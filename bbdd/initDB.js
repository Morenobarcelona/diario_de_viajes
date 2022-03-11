const faker = require('faker/locale/es');
const { formatDate, getRandomValue } = require('../helpers');
const getDB = require('./getDB.js');

async function main() {
  let connection;

  try {
    connection = await getDB();

    await connection.query('DROP TABLE IF EXISTS photos;');
    await connection.query('DROP TABLE IF EXISTS votes;');
    await connection.query('DROP TABLE IF EXISTS entries;');
    await connection.query('DROP TABLE IF EXISTS users;');

    console.log('Tablas eliminadas');

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
          createdAt DATETIME NOT NULL,
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
              FOREIGN KEY (iduser) REFERENCES users (id),
              createdAt DATETIME NOT NULL,
              modifiedAt DATETIME
          
              )
          `);

    await connection.query(`
              CREATE TABLE photos  (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name  VARCHAR(50) NOT NULL,
                idEntry INT NOT NULL,
                FOREIGN KEY (idEntry) REFERENCES entries (id),
                createdAt DATETIME NOT NULL
           )   
           `);

    await connection.query(`
           CREATE TABLE votes (
             id INT PRIMARY KEY AUTO_INCREMENT,
             vote INT NOT NULL,
             idEntry INT NOT NULL,
             FOREIGN KEY (idEntry) REFERENCES entries (id),
             idUser INT NOT NULL,
             FOREIGN KEY (iduser) REFERENCES users (id),
             CONSTRAINT votes_CK1 CHECK (vote IN(1,2,3,4,5)),
             createdAt DATETIME NOT NULL


        )   
        `);

    console.log('Tablas Creadas');

    //INSERTAR EL USUARIO ADMINISTRADOR.

    await connection.query(`
              INSERT INTO users (email,password,name,active,role, createdAt)
              VALUES (
                "AHBHB1987@GMAIL.COM",
                "123456",
                "ALFONSO",
                true,
                "admin",
                "${formatDate(new Date())}"

               )

            `);

    console.log('Creado usuario administrador');

    const USERS = 10;

    for (let i = 0; i < USERS; i++) {
      const email = faker.internet.password();
      const password = faker.internet.password();
      const name = faker.name.findName();

      //fECHA DE CREACION
      const createdAt = formatDate(new Date());

      await connection.query(`
                    
                    INSERT INTO users ( email, password,name,active, createdAt)
                    VALUES ( "${email}", "${password}", "${name}", true, "${createdAt}" )
                    
                    `);
    }

    console.log('Usuarios Creados');

    // Nº entradas a introducir

    const ENTRIES = 100;

    for (let i = 0; i < ENTRIES; i++) {
      const place = faker.address.city();
      const description = faker.lorem.paragraph();
      const idUser = getRandomValue(2, USERS + 1);

      //fECHA DE CREACION
      const createdAt = formatDate(new Date());

      await connection.query(`
                    
                    INSERT INTO entries (place, description,idUser, createdAt)
                    VALUES ( "${place}", "${description}", "${idUser}","${createdAt}" )
                    
                    `);
    }

    console.log('Valores insertados');
  } catch (error) {
    console.error(error.message);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

main();
