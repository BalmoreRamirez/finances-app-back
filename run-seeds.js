const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🌱 Ejecutando seeders...');

// Verificar si existen los archivos compilados
const possiblePaths = [
  './dist/src/seeds/index.js',
  './dist/seeds/index.js'
];

let seedPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    seedPath = p;
    break;
  }
}

if (seedPath) {
  console.log(`✅ Encontrado seeder en: ${seedPath}`);
  try {
    require(seedPath);
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
    process.exit(1);
  }
} else {
  console.log('⚠️ No se encontraron seeders compilados, ejecutando con ts-node...');
  try {
    execSync('npx ts-node src/seeds/index.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Error ejecutando seeders con ts-node:', error);
    process.exit(1);
  }
}
