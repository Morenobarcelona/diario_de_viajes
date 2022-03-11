require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const app = express();

const { PORT } = process.env;

//Logger

app.use(morgan('dev'));

//Deserializar el body

app.use(express.json());

 //Agregar una nueva entrada

app.post('/entries, (req,res) => {

})



app.listen(PORT, () => {
  console.log(`SERVER LISTENING AT http://localhost:${PORT}`);
});
