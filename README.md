# Finances App Backend

API REST para la gestión de finanzas personales desarrollada con NestJS, TypeORM y PostgreSQL.

## Características

- ✅ **Autenticación JWT** - Sistema de login seguro
- ✅ **Gestión de Usuarios** - Registro y administración de usuarios
- ✅ **Cuentas Financieras** - Diferentes tipos de cuentas (Activo, Pasivo, Patrimonio, Ingreso, Egreso)
- ✅ **Transacciones** - Registro de ingresos y gastos con categorías
- ✅ **Inversiones** - Gestión de inversiones y préstamos
- ✅ **Documentación API** - Swagger/OpenAPI integrado
- ✅ **Base de Datos** - PostgreSQL con TypeORM
- ✅ **Validación** - Validación automática con class-validator

## 📖 Documentación API

La documentación completa de la API está disponible en **Swagger UI**:

**🔗 [http://localhost:3001/api](http://localhost:3001/api)**

### Características de Swagger:
- 📋 Documentación completa de todos los endpoints
- 🔐 Autenticación JWT integrada
- 🧪 Pruebas interactivas de la API
- 📝 Esquemas de datos detallados
- 🏷️ Organización por módulos con tags

### Cómo usar la autenticación en Swagger:
1. Hacer login en `/login` para obtener el token JWT
2. Copiar el `accessToken` de la respuesta
3. Hacer clic en el botón **"Authorize"** en Swagger
4. Pegar el token (sin "Bearer ")
5. ¡Listo! Ya puedes probar endpoints protegidos

## 🚀 Configuración e Instalación

### Prerrequisitos
- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone [repository-url]
cd finances-app-back
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia `.env.example` a `.env` y configura tus valores:

```bash
cp .env.example .env
```

Variables principales:
```env
# Base de Datos
TYPEORM_HOST=localhost
TYPEORM_PORT=5432
TYPEORM_USERNAME=tu_usuario
TYPEORM_PASSWORD=tu_password
TYPEORM_DATABASE=finances_app

# JWT
JWT_SECRET=tu-clave-secreta-super-segura
JWT_EXPIRES_IN=1d

# Servidor
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 4. Configurar la base de datos
```bash
# Crear la base de datos en PostgreSQL
createdb finances_app

# Ejecutar seeds (datos iniciales)
npm run seed
```

### 5. Ejecutar la aplicación
```bash
# Desarrollo (con watch mode)
npm run start:dev

# Producción
npm run start:prod
```

La aplicación estará disponible en:
- **API**: http://localhost:3001
- **Swagger**: http://localhost:3001/api

## 🗄️ Estructura de la Base de Datos

### Entidades principales:
- **users** - Usuarios del sistema
- **account_types** - Tipos de cuenta (Activo, Pasivo, etc.)
- **accounts** - Cuentas financieras del usuario
- **transaction_categories** - Categorías de transacciones
- **transactions** - Transacciones financieras
- **investment_types** - Tipos de inversión
- **investments** - Inversiones realizadas
- **investment_details** - Detalles y pagos de inversiones

## 📚 Endpoints Principales

### 🔐 Autenticación
- `POST /login` - Iniciar sesión

### 👥 Usuarios  
- `POST /users` - Registrar usuario
- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### 💳 Cuentas
- `POST /accounts` - Crear cuenta
- `GET /accounts` - Listar cuentas
- `GET /accounts/:id` - Obtener cuenta
- `PATCH /accounts/:id` - Actualizar cuenta
- `DELETE /accounts/:id` - Eliminar cuenta

### 💰 Transacciones
- `POST /transactions` - Crear transacción
- `GET /transactions` - Listar transacciones
- `GET /transactions/:id` - Obtener transacción
- `PATCH /transactions/:id` - Actualizar transacción
- `DELETE /transactions/:id` - Eliminar transacción

### 📈 Inversiones
- `POST /investments` - Crear inversión
- `GET /investments` - Listar inversiones
- `GET /investments/:id` - Obtener inversión
- `PATCH /investments/:id` - Actualizar inversión
- `DELETE /investments/:id` - Eliminar inversión

### 💸 Detalles de Inversión
- `POST /investment-credit-payments/:investmentId` - Crear pago
- `GET /investment-credit-payments/:investmentId` - Listar pagos
- `GET /investment-credit-payments/:investmentId/:paymentId` - Obtener pago
- `PATCH /investment-credit-payments/:investmentId/:paymentId` - Actualizar pago
- `DELETE /investment-credit-payments/:investmentId/:paymentId` - Eliminar pago

## 🛠️ Tecnologías Utilizadas

- **Framework**: NestJS 10
- **Base de Datos**: PostgreSQL + TypeORM
- **Autenticación**: JWT + Passport
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI
- **Lenguaje**: TypeScript

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de código
npm run test:cov
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev     # Inicia en modo desarrollo con watch

# Construcción
npm run build         # Compila el proyecto

# Producción  
npm run start:prod    # Inicia en modo producción

# Base de datos
npm run seed          # Ejecuta seeds

# Linting y formato
npm run lint          # Ejecuta ESLint
npm run format        # Formatea código con Prettier
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**¡Desarrollado con ❤️ usando NestJS!**
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
