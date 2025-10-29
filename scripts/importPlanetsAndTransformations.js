
const axios = require('axios');

const STRAPI_URL = 'http://127.0.0.1:1337';
const API_TOKEN = '9e0215f172c9054065f478e253bd1bb4b16272b543243d8561909584c12ca71e27e63e3bbcb9c3d24375a80b041e185c411c1a3e2eaf142820e029149947ec1fb56e383f4daf6945ea40d8274a9b8adc33c9f88efe39866173697eefa6a1ddcd7149fceb7313731a11cad389af872c08aa0e859f5a9849abdd0b959f66e4d84a';
const DRAGONBALL_API = 'https://dragonball-api.com/api';

async function importPlanets() {
  try {
    const res = await axios.get('https://dragonball-api.com/api/planets');
    const planets = res.data;

    if (!Array.isArray(planets)) {
      console.error('❌ Planetas no encontrados o estructura inesperada:', planets);
      return;
    }

    for (const planet of planets) {
      const data = {
        name: planet.name || 'Nombre desconocido',
        isDestroyed: planet.isDestroyed || false,
        description: planet.description || '',
        image: null, // Puedes poner URL si quieres subir imágenes
      };

      try {
        await axios.post(`${STRAPI_URL}/api/planets`, { data }, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        console.log(`✅ Importado planet → ${data.name}`);
      } catch (err) {
        console.error(`❌ Error importando planet ${data.name}:`, err.response?.data || err.message);
      }
    }
  } catch (err) {
    console.error('❌ Error obteniendo planetas de la API:', err.response?.data || err.message);
  }
}

// Subir transformaciones
async function importTransformations() {
  try {
    const res = await axios.get('https://dragonball-api.com/api/transformations');
    const transformations = res.data;

    if (!Array.isArray(transformations)) {
      console.error('❌ Transformaciones no encontradas o estructura inesperada:', transformations);
      return;
    }

    for (const trans of transformations) {
      const data = {
        name: trans.name || 'Nombre desconocido',
        ki: trans.ki || '0',
        image: null, // Igual, aquí puedes usar URL si quieres
      };

      try {
        await axios.post(`${STRAPI_URL}/api/transformations`, { data }, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        console.log(`✅ Importado transformation → ${data.name}`);
      } catch (err) {
        console.error(`❌ Error importando transformation ${data.name}:`, err.response?.data || err.message);
      }
    }
  } catch (err) {
    console.error('❌ Error obteniendo transformaciones de la API:', err.response?.data || err.message);
  }
}

async function main() {
  console.log('🌍 Importando planetas...');
  await importPlanets();

  console.log('⚡ Importando transformaciones...');
  await importTransformations();

  console.log('✅ Importación completa.');
}

main();