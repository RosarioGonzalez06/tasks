const axios = require('axios');

const STRAPI_URL = 'http://127.0.0.1:1337';
const API_TOKEN = '9e0215f172c9054065f478e253bd1bb4b16272b543243d8561909584c12ca71e27e63e3bbcb9c3d24375a80b041e185c411c1a3e2eaf142820e029149947ec1fb56e383f4daf6945ea40d8274a9b8adc33c9f88efe39866173697eefa6a1ddcd7149fceb7313731a11cad389af872c08aa0e859f5a9849abdd0b959f66e4d84a';
const DRAGONBALL_API = 'https://dragonball-api.com/api';

async function importPlanets() {
  try {
    let page = 1;
    let totalPages = 1;

    console.log('🌍 Importando planetas...');

    while (page <= totalPages) {
      const res = await axios.get(`https://dragonball-api.com/api/planets?page=${page}&limit=50`);
      const planets = res.data.items;

      totalPages = res.data.meta.totalPages || 1;

      if (!Array.isArray(planets)) {
        console.error('❌ Planetas no encontrados o estructura inesperada:', res.data);
        return;
      }

      for (const planet of planets) {
        try {
          await axios.post(`${STRAPI_URL}/api/planets`, {
            data: {
              name: planet.name || 'Nombre desconocido',
              isDestroyed: !!planet.isDestroyed,
              description: planet.description || '',
              // No enviamos imagen
            }
          }, {
            headers: { Authorization: `Bearer ${API_TOKEN}` }
          });

          console.log(`✅ Importado planeta → ${planet.name}`);
        } catch (err) {
          console.error(`❌ Error importando planeta ${planet.name}:`, err.response?.data || err.message);
        }
      }

      page++;
    }

    console.log('✅ Importación de planetas completa.');
  } catch (err) {
    console.error('❌ Error obteniendo planetas de la API:', err.response?.data || err.message);
  }
}

importPlanets();
