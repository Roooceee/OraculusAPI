const mysql = require('mysql2');

// Crée la connexion
const db = mysql.createConnection({
  host: 'localhost',
  user: 'test',
  password: 'crud1234',
  database: 'oraculusapi'
});

// Connexion à la BDD
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la BDD:', err);
    return;
  }
  console.log('Connecté à la base MySQL !');
});

module.exports = db;