require('dotenv').config();
const express = require('express');
const res = require('express/lib/response');
const morgan = require('morgan');
const editEntry = require('./controllers/editEntry');
const app = express();

const { PORT } = process.env;

//IMPORTAMOS LOS CONTROLADORES DE LAS ENTRADAS

const newEntry = require('./controllers/newEntry');

//Logger

app.use(morgan('dev'));

//Deserializar el body

app.use(express.json());

//Agregar una nueva entrada

app.post('/entries', newEntry);

//Editar una entrada

app.put('/entries/:idEntry', editEntry);

// Middleware de error.

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

//Middlware de not found

app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: ' Not found',
  });
});

app.listen(PORT, () => {
  console.log(`SERVER LISTENING AT http://localhost:${PORT}`);
});
