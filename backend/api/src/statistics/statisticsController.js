const statisticsService = require("./statisticsService");

module.exports.getStatistics = async (req, res, next) => {
  const { query } = req;

  const statiscts = await statisticsService.getClientStatistics(
    query.clientId,
    query.initialDate,
    query.finalDate
  );

  return res.send(statiscts);
};
