require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

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

app.listen(PORT, () => {
  console.log(`SERVER LISTENING AT http://localhost:${PORT}`);
});
