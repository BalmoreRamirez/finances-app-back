import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Finances App API')
    .setDescription('API para la gestión de finanzas personales')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticación')
    .addTag('users', 'Gestión de usuarios')
    .addTag('accounts', 'Gestión de cuentas')
    .addTag('account-types', 'Tipos de cuenta')
    .addTag('transactions', 'Gestión de transacciones')
    .addTag('transaction-categories', 'Categorías de transacciones')
    .addTag('investments', 'Gestión de inversiones')
    .addTag('investment-types', 'Tipos de inversión')
    .addTag('investment-details', 'Detalles de inversiones')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

app.use('/',(req, res, next) => {
  if (req.method === 'GET' && req.url === '/') {
    res.json({ message: 'Hello World!' });
  } else {
    next();
  }
})

  await app.listen(process.env.PORT || 3000);
}

bootstrap().then(() => {
  console.log(
    `Application is running on: http://localhost:${process.env.PORT || 3000}`,
  );
  console.log(
    `Swagger documentation available at: http://localhost:${process.env.PORT || 3000}/api`,
  );
});
