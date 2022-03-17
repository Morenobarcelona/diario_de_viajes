require('dotenv').config();
const express = require('express');
const res = require('express/lib/response');
const morgan = require('morgan');

const app = express();

const { PORT } = process.env;

//IMPORTAMOS LOS CONTROLADORES DE LAS ENTRADAS

const newEntry = require('./controllers/newEntry');
const editEntry = require('./controllers/entries/editEntry');
const listEntry = require('./controllers/listEntries');
//Logger

app.use(morgan('dev'));

//Deserializar el body

app.use(express.json());

//Agregar una nueva entrada

app.post('/entries', newEntry);

//Editar una entrada

app.put('/entries/:idEntry', editEntry);

// Obtener la lista de entradas

app.get('/entries', listEntry);

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
