const { fetchHoroscopeFromAI } = require('./aiClient.js');
const fs = require('fs').promises;
const path = require('path');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateHoroscope() {
  const signes = [
    "belier", "taureau", "gemeaux", "cancer",
    "lion", "vierge", "balance", "scorpion",
    "sagittaire", "capricorne", "verseau", "poisson"
  ];

  const newHoroscope = [];

  for (const signe of signes) {
    const prompt = `
      Génère les prédictions quotidiennes pour le signe du zodiaque "${signe}".
      Les thèmes sont : amour, travail, argent, santé, famille_et_amis, conseil.
      Chaque clé contient deux phrases d'une longueur entre 40 et 70 caractère et inspirantes et loufoques.
      Pas de markdown, pas de titre, seulement le JSON.
    `;

    console.log(`🔮 Génération de l'horoscope pour : ${signe}`);

    const responseText = await fetchHoroscopeFromAI(prompt);
    const predictionsIA = JSON.parse(responseText)[0];

    newHoroscope.push({
      signe: signe,
      amour: predictionsIA.amour,
      travail: predictionsIA.travail,
      argent: predictionsIA.argent,
      sante: predictionsIA.sante,
      famille_et_amis: predictionsIA.famille_et_amis,
      conseil: predictionsIA.conseil,
    });

    if (signe !== 'poisson') {
      console.log('⏳ Pause de 7 secondes pour ne pas dépasser le quota !');
      await sleep(7000);
    }
  }

  console.log(newHoroscope)
  console.log('✅ Horoscope généré avec succès !');


  // const filePath = path.join(__dirname, 'horoscope.json');
  // await fs.writeFile(filePath, JSON.stringify(newHoroscope, null, 2), 'utf-8');

  // console.log('✅ Horoscope sauvegardé dans horoscope.json');

  // return newHoroscope;
}

module.exports = { generateHoroscope };