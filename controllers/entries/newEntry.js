const getDB = require('../../bbdd/getDB');
const { formatDate } = require('../../helpers');

const newEntry = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { place, description, idUser } = req.body;

    //Si falta algun dato lanzamos  un error.

    if (!place || !description || !idUser) {
      const error = new Error('Faltan campos');
      error.httpStatus = 404;
      throw error;
    }

    //COmprobamos que el usuario existe.

    const [user] = await connection.query(
      `SELECT  * FROM users WHERE  id= ?`,

      [idUser]
    );

    //Si el usuario no existe lanzo un error
    if (user.length < 1) {
      const error = new Error(' EL usuario no existe');
      error.httpStatus = 404;
      throw error;
    }

    //FEcha  creacion
    const createdAt = formatDate(new Date());

    //Insertamos la entrada
    await connection.query(
      `INSERT INTO entries  (place,description,idUser, createdAt)
      VALUES (?,?,?,?)
      `,
      [place, description, idUser, createdAt]
    );

    res.send({
      status: 'ok',
      message: 'La entrada ha sido creada con exito',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newEntry;
