import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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
});
