const getDB = require('../bbdd/getDB');

const listEntries = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const [entries] = await connection.query(`
            SELECT entries.id, entries.place, entries.createdAt, entries.idUser, AVG(IFNULL(votes.vote,0)) AS vostes
            FROM entries
            LEFT JOIN votes ON (entries.id = votes.idEntry)
            GROUP BY entries.id
            `);

    res.send({
      status: 'ok',
      entries,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listEntries;
