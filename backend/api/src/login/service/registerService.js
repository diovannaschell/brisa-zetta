// registerService.js
const db = require('./database'); // Import your database configuration

exports.register = async (clientData) => {
    // Aqui, 'clientData' inclui: name, cpfCnpj, address, postalCode, city, state
    // Realize qualquer transformação ou verificação de dados necessária

    // Monta a query SQL para inserir o cliente no banco de dados
    const sql = `
        INSERT INTO clients (name, cpfCnpj, address, postalCode, city, state)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        clientData.name,
        clientData.cpfCnpj,
        clientData.address,
        clientData.postalCode,
        clientData.city,
        clientData.state
    ];

    try {
        // Executa a query de inserção no banco de dados
        const [result] = await db.query(sql, values);
        // Retorna informações sobre o cliente inserido
        // `result.insertId` é útil para obter o ID do cliente inserido, caso necessário
        return { id: result.insertId, ...clientData };
    } catch (error) {
        console.error('Erro ao registrar o cliente:', error);
        throw error; // Relança o erro para ser tratado por quem chamar esta função
    }
};
