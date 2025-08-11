const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🌱 Ejecutando seeders...');
console.log('📁 Directorio actual:', process.cwd());
console.log('📁 __dirname:', __dirname);

// Asegurar que estamos en el directorio raíz del proyecto
const projectRoot = __dirname;
process.chdir(projectRoot);

console.log('📁 Directorio de trabajo:', process.cwd());

// Verificar si existen los archivos compilados
const possiblePaths = [
  path.join(projectRoot, 'dist/src/seeds/index.js'),
  path.join(projectRoot, 'dist/seeds/index.js')
];

let seedPath = null;
for (const p of possiblePaths) {
  console.log(`🔍 Verificando ruta: ${p}`);
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
  console.log('📁 Listando contenido del directorio dist:');
  
  try {
    const distPath = path.join(projectRoot, 'dist');
    if (fs.existsSync(distPath)) {
      const distContents = execSync('find dist -name "*.js" | head -20', { encoding: 'utf8' });
      console.log(distContents);
    } else {
      console.log('❌ Directorio dist no existe');
    }
  } catch (e) {
    console.log('❌ Error listando dist:', e.message);
  }
  
  try {
    execSync('npx ts-node src/seeds/index.ts', { stdio: 'inherit', cwd: projectRoot });
  } catch (error) {
    console.error('❌ Error ejecutando seeders con ts-node:', error);
    process.exit(1);
  }
}
