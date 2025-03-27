const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const connection = mysql.createConnection(config);

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }

    console.log('Conectado ao banco de dados.');

    // Criação da tabela 'people' se não existir
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS people (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `;
    
    connection.query(createTableSQL, (err, result) => {
        if (err) {
            console.error('Erro ao criar tabela:', err);
            return;
        }
        console.log('Tabela "people" verificada/criada com sucesso.');

        // Inserção inicial de dado (exemplo)
        const sql = `INSERT INTO people(name) values('Matheus')`;
        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Erro ao inserir dado:', err);
            } else {
                console.log('Dado inserido com sucesso:', result);
            }
        });
    });
});

app.get('/', (req, res) => {
    const sqlSelect = `SELECT name FROM people`;

    connection.query(sqlSelect, (err, results) => {
        if (err) {
            res.status(500).send('<h1>Erro ao consultar o banco de dados</h1>');
            return;
        }

        const namesList = results.map(row => `<li>${row.name}</li>`).join('');
        res.send(`<h1>Full Cycle Rocks!</h1><ul>${namesList}</ul>`);
    });
});
app.listen(port, () => {
    console.log("Rodando na porta: " + port);
});
