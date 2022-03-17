const getDB = require('../../bbdd/getDB');
const { formatDate } = require('../../helpers');

const editEntry = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idEntry } = req.params;

    //Obtenemos las propiedades del body.
    let { description, place } = req.body;

    //Comprobamos si la entrada existe,

    const [entry] = await connection.query(
      `
       SELECT *FROM entries WHERE id=?
    `,
      [idEntry]
    );

    //Si la entrada no existe lanzamos un error.
    if (entry.length < 1) {
      const error = new Error('La entrada no existe');
      error.httpStatus = 404;
      throw error;
    }

    //SI faltan las dos propiedades lanzamos un error.
    if (!description && !place) {
      const error = new Error('Faltan Campos');
      error.httpStatus = 400;
      throw error;
    }

    //SI existe "place" o "description" nos quedamos con ese valor, pero si algun
    //valor es undefined, nos quedamos con el valor que habia
    place = place || entry[0].place;
    description = description || entry[0].description;

    //Fecha de modificacion
    const modifiedAt = formatDate(new Date());

    //Actualizamos la entrada

    await connection.query(
      `UPDATE entries SET place=', description=', modifiedAt=?  WHERE id = ?`,
      [place, description, modifiedAt, idEntry]
    );

    res.send({
      status: 'ok',
      entry: {
        id: idEntry,
        place,
        description,
        modifiedAt,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editEntry;
