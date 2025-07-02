require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('./config/db.js');
const { generateHoroscope } = require('./generateHoroscope.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// ✅ Gestion de la session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretUltraSecret',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  // rolling: false,
  cookie: {
    maxAge: 3 * 60 * 1000, // 10 minutes
    sameSite: 'lax', // 'none' si HTTPS
    // secure: true // décommente quand tu es en HTTPS
  }
}));

// ✅ Middleware pour vérifier que la l'user est connecter
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next(); // User is authenticated, continue to next middleware
    } else {
        res.redirect('/login'); // User is not authenticated, redirect to login page
    }
}

const attachSessionInfo = (req, res, next) => {
  if (req.session.user) {
    res.locals.sessionInfo = {
      user: req.session.user,
      expiresAt: req.session.cookie._expires
    };
  }
  next();
};

app.use(attachSessionInfo);

// =================== ROUTES ===================

// ✅ Test serveur
app.get('/', (req, res) => {
  res.send('API Oraculus opérationnelle 🔮');
});

// ✅ Route GET pour l'horoscope
app.get('/api/horoscope' , async (req, res) => {
  try {
    const filePath = path.join(__dirname, '/horoscope.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const horoscope = JSON.parse(data);

    console.log('✅ Horoscope envoyé');
    res.status(200).json(horoscope);
  } catch (error) {
    console.error('❌ Erreur lecture horoscope :', error);
    res.status(500).json({ error: 'Impossible de lire l’horoscope.' });
  }
});

// ✅ Route POST pour générer un horoscope
app.POST('/api/generateHoroscope' , async (req, res) => {
  try {
    const result = await generateHoroscope();
    res.status(200).json({
      message: 'Horoscope généré avec succès !',
      data: result,
    });
  } catch (error) {
    console.error('Erreur génération :', error);
    res.status(500).json({ error: 'Erreur lors de la génération.' });
  }
});

// ✅ Route POST login
app.post('/api/login', (req, res) => {
  const { pseudo, email, password } = req.body;

  if (!pseudo || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  const query = "SELECT u.id, u.pseudo, u.email, u.password , u.created_at, r.name AS role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.pseudo = ? OR u.email = ?;";
  db.query(query, [pseudo, email], (err, results) => {
    if (err) {
      console.error('Erreur BDD :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Erreur bcrypt :', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }

      
    // ✅ Création de la session
    req.session.user = {
      id: user.id,
      pseudo: user.pseudo,
      email: user.email,
      created_at: user.created_at,
      role: user.role
    };

    console.log('✅ Session créée :', req.session.user);

    // ✅ Envoi de la réponse avec la date d’expiration
    res.status(200).json({
      message: 'Connexion réussie',
      user: req.session.user,
      expiresAt: req.session.cookie._expires,
    });
    });
  });
});

// ✅ Route POST register
app.post('/api/register', (req, res) => {
  const { pseudo, email, password } = req.body;

  if (!pseudo || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });

    const query = 'INSERT INTO users (pseudo, email, password) VALUES (?, ?, ?)';
    db.query(query, [pseudo, email, hash], (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Pseudo ou email déjà utilisé' });
        }
        return res.status(500).json({ error: 'Erreur base de données' });
      }
      res.status(201).json({ message: 'Utilisateur créé avec succès' });
    });
  });
});

// ✅ Route GET pour vérifier la session
app.get('/api/checkSession', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, 
      ...res.locals.sessionInfo
     });
  } else {
    res.json({ loggedIn: false });
  }
});

// ✅ Route pour rester connecter
app.get('/api/stayConnect', (req, res) => {
  if (req.session.user) {
    // ✨ Touche la session → Express renouvelle le cookie automatiquement
    req.session.touch(); 
    res.status(200).json({ message: 'Session prolongée' });
  } else {
    res.status(401).json({ error: 'Session expirée' });
  }
});

// ✅ Route logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Déconnexion réussie' });
  });
});

// ✅ Lancer le serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
