import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: { credentials: true, origin: 'http://localhost:3000' } });

    const config = new DocumentBuilder()
        .setTitle('Talents Pool')
        .setDescription(
            'Sports Talents is your go-to resource for discovering the best young athletes from around the world. Our platform connects promising sports talents with coaches, agents, and teams to help them achieve their dreams.',
        )
        .addBearerAuth()
        .setVersion('1.0')
        .addTag('API')
        .addTag('Auth')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    app.use(
        session({
            secret: process.env.SESSION_SECRET || '',
            resave: false,
            saveUninitialized: false,
        }),
    );

    await app.listen(process.env.PORT || 5000);
}

bootstrap().then(() => {
    console.log('App was started at ' + process.env.PORT || 5000);
});
