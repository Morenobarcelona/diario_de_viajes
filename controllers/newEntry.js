const getDB = require('../bbdd/getDB');
const { formatDate } = require('../helpers');

const newEntry = async (req, res) => {
  let connection;

  try {
    connection = await getDB();

    const { place, description, idUser } = req.body;

    //Si falta algun dato lanzamos  un error.

    if (!place || !description || idUser) {
      throw new Error('Faltan campos');
    }

    //FEcha  creacion
      const createdAt=formatDate(new Date());

      //Insertamos la entrada 
      await connection.query(`
      
      );`

    const createdAt = res.send(req.body);
  } catch (error) {
    console.error(error.message);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newEntry;
