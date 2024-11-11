import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './core/users/users.module';
import { TagsModule } from './core/tags/tags.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as autoPopulate from 'mongoose-autopopulate';
import 'dotenv/config';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGODB_URI || '', {
            connectionFactory: (connection) => {
                connection.plugin(autoPopulate);
                return connection;
            },
        }),
        UsersModule,
        TagsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
