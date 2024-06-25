const express = require('express');
const { check, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { usuariosCollection } = require('../config/mongo');
const { getCoordinates, findFrequentBairro, findSimilarBairro, findSimilarStreet } = require('../helpers/helper');
const { pool } = require('../config/postgres');
router.post('/',
  [
    check('nome').notEmpty().withMessage('Nome é obrigatório'),
    check('endereco').notEmpty().withMessage('Endereço é obrigatório'),
    check('bairro').notEmpty().withMessage('Bairro é obrigatório'),
    check('municipio').notEmpty().withMessage('Município é obrigatório'),
    check('uf').notEmpty().withMessage('UF é obrigatório').isLength({ min: 2, max: 2 }).withMessage('UF deve ter 2 caracteres')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, endereco, bairro, municipio, uf } = req.body;
    let address = `${endereco}, ${bairro}, ${municipio}, ${uf}`;
    try {
      let coordinates = await getCoordinates(address);
      if (!coordinates) {
        // Tentar encontrar uma rua similar
        const similarStreet = await findSimilarStreet(endereco, municipio, uf);
        if (similarStreet) {
          address = `${similarStreet}, ${bairro}, ${municipio}, ${uf}`;
          coordinates = await getCoordinates(address);
        }
      }

      if (!coordinates) {
        // Tentar encontrar um bairro similar
        const similarBairro = await findSimilarBairro(bairro, municipio, uf);
        if (similarBairro) {
          address = `${endereco}, ${similarBairro}, ${municipio}, ${uf}`;
          coordinates = await getCoordinates(address);
        }
      }

      if (!coordinates) {
        address = `${bairro}, ${municipio}, ${uf}`;
        coordinates = await getCoordinates(address);
      }

      if (!coordinates) {
        address = `${municipio}, ${uf}`;
        coordinates = await getCoordinates(address);
      }

      if (!coordinates) {
        const frequentBairro = await findFrequentBairro(municipio, uf);
        if (frequentBairro) {
          address = `${frequentBairro}, ${municipio}, ${uf}`;
          coordinates = await getCoordinates(address);
        }
      }

      if (coordinates) {
        const { lat, lon } = coordinates;
        const newUser = { nome, endereco, bairro, municipio, uf, latitude: lat, longitude: lon };
        const existingUser = await usuariosCollection.findOne({ nome, endereco, bairro, municipio, uf });
        if (!existingUser) {
          await usuariosCollection.insertOne(newUser);
          res.status(201).json(newUser);
        } else {
          res.status(409).json({ error: 'Usuário já existe.' });
        }
      } else {
        res.status(404).json({ error: 'Endereço não encontrado.' });
      }
    } catch (error) {
      logger.error('Erro ao salvar no MongoDB', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });


router.delete('/remove-duplicatas', async (req, res) => {
  try {
    const aggregation = await usuariosCollection.aggregate([
      {
        $group: {
          _id: { nome: "$nome", endereco: "$endereco", bairro: "$bairro", municipio: "$municipio", uf: "$uf" },
          uniqueIds: { $addToSet: "$_id" },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray();

    for (const group of aggregation) {
      const idsToRemove = group.uniqueIds.slice(1);
      await usuariosCollection.deleteMany({ _id: { $in: idsToRemove } });
    }

    res.status(200).json({ message: 'Duplicatas removidas com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover duplicatas', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/locations', async (req, res) => {
  try {
    const users = await usuariosCollection.find({}).project({ nome: 1, latitude: 1, longitude: 1 }).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar localizações', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.delete('/delete-all', async (req, res) => {
  try {
    await usuariosCollection.deleteMany({});
    res.status(200).json({ message: 'Todos os dados foram excluídos com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir dados', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/count-by-coordinates', async (req, res) => {
    try {
      const aggregation = await usuariosCollection.aggregate([
        {
          $group: {
            _id: {latitude: "$latitude", longitude: "$longitude" },
            count: { $sum: 1 }
          }
        },
        {
          $match: {
            count: { $gt: 1 } // Ajuste conforme necessário para incluir endereços únicos se desejado
          }
        }
      ]).toArray();
  
      res.status(200).json(aggregation);
    } catch (error) {
      console.error('Erro ao agrupar endereços por coordenadas', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  router.put('/update-address', 
    [
      check('id').notEmpty().withMessage('ID é obrigatório').isMongoId().withMessage('ID deve ser um ObjectId válido'),
      check('nome').notEmpty().withMessage('Nome é obrigatório'),
      check('endereco').notEmpty().withMessage('Endereço é obrigatório'),
      check('bairro').notEmpty().withMessage('Bairro é obrigatório'),
      check('municipio').notEmpty().withMessage('Município é obrigatório'),
      check('uf').notEmpty().withMessage('UF é obrigatório').isLength({ min: 2, max: 2 }).withMessage('UF deve ter 2 caracteres')
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { id, nome, endereco, bairro, municipio, uf } = req.body;
      let address = `${endereco}, ${bairro}, ${municipio}, ${uf}`;
  
      try {
        let coordinates = await getCoordinates(address);
        if (!coordinates) {
          return res.status(404).json({ error: 'Endereço não encontrado.' });
        }
  
        const { lat, lon } = coordinates;
        const updateFields = { nome, endereco, bairro, municipio, uf, latitude: lat, longitude: lon };
  
        const result = await usuariosCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
  
        if (result.matchedCount === 0) {
          res.status(404).json({ error: 'Usuário não encontrado.' });
        } else {
          res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
        }
      } catch (error) {
        console.error('Erro ao atualizar usuário no MongoDB', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });
module.exports = router;
