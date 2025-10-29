const axios = require('axios');

const STRAPI_URL = 'http://127.0.0.1:1337';
const API_TOKEN = '9e0215f172c9054065f478e253bd1bb4b16272b543243d8561909584c12ca71e27e63e3bbcb9c3d24375a80b041e185c411c1a3e2eaf142820e029149947ec1fb56e383f4daf6945ea40d8274a9b8adc33c9f88efe39866173697eefa6a1ddcd7149fceb7313731a11cad389af872c08aa0e859f5a9849abdd0b959f66e4d84a';

async function importCharacters() {
  try {
    // Obtenemos personajes desde la API
    const { data } = await axios.get('https://dragonball-api.com/api/characters');
    const characters = data.items || data.characters || data;

    if (!Array.isArray(characters)) {
      console.error('❌ No se encontró un array de personajes:', data);
      return;
    }

    for (const item of characters) {
      try {
        await axios.post(`${STRAPI_URL}/api/characters`, {
          data: {
            name: item.name,
            race: item.race,
            gender: item.gender,
            description: item.description,
            affiliation: item.affiliation,
            ki: item.ki,
            maxKi: item.maxKi,
            // Imagen omitida
          }
        }, {
          headers: { Authorization: `Bearer ${API_TOKEN}` }
        });

        console.log(`✅ ${item.name} importado correctamente`);
      } catch (err) {
        console.error(`❌ Error importando ${item.name}:`, err.response?.data || err.message);
      }
    }

    console.log('✅ Importación completa.');
  } catch (err) {
    console.error('❌ Error obteniendo personajes:', err.response?.data || err.message);
  }
}

// Ejecutar importación
importCharacters();









