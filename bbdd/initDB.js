const { formatDate } = require('../helpers');
const getDB = require('./getDB.js');

async function main() {
  let connection;

  try {
    connection = await getDB();

    await connection.query('DROP TABLE IF EXISTS users;');
    await connection.query('DROP TABLE IF EXISTS entries;');
    await connection.query('DROP TABLE IF EXISTS votes;');
    await connection.query('DROP TABLE IF EXISTS photos;');

    console.log('TAblas eliminadas');

    await connection.query(`
        CREATE TABLE users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR (512) NOT NULL,
          name  VARCHAR(100),
          avatar VARCHAR (100),
          active BOOLEAN DEFAULT FALSE,
          deleted BOOLEAN DEFAULT false,
          role ENUM ("admin","normal") DEFAULT "normal" NOT NULL,
          registrationCode VARCHAR(100),
          recoverCode VARCHAR(100),
          createAt DATETIME NOT NULL,
          modifiedAt DATETIME

        )

    `);

    //Crear la tabla de entradas
    await connection.query(`
             CREATE TABLE entries ( 
              id INT PRIMARY KEY AUTO_INCREMENT,
              place VARCHAR(100) NOT NULL,
              description TEXT,
              idUser INT NOT NULL,
              createAt DATETIME NOT NULL,
              modifiedAt DATETIME
          
              )
          `);

    await connection.query(`
              CREATE TABLE photos  (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name  VARCHAR(50) NOT NULL,
                idEntry INT NOT NULL,
                createdAt DATETIME NOT NULL
           )   
           `);

    await connection.query(`
           CREATE TABLE votes (
             id INT PRIMARY KEY AUTO_INCREMENT,
             vote INT NOT NULL,
             idEntry INT NOT NULL,
             idUser INT NOT NULL,
             CONSTRAINT votes_CK1 CHECK (vote IN(1,2,3,4,5)),
             createdAt DATETIME NOT NULL


        )   
        `);

    console.log('Tablas Creadas');

    //INSERTAR EL USUARIO ADMINISTRADOR.

    await connection.query(`
              INSERT INTO users (email,password,name,active,role, createAt)
              VALUES (
                "AHBHB1987@GMAIL.COM",
                "123456",
                "ALFONSO",
                true,
                "admin",
                "${formatDate(new Date())}"

               )

            `);

    console.log('usuario administrador creado');
  } catch (error) {
    console.error(error.message);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

main();
