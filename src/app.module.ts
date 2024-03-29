import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TopPageModule } from './top-page/top-page.module'
import { ProductModule } from './product/product.module'
import { ReviewModule } from './review/review.module'
import { TypegooseModule } from 'nestjs-typegoose'
import { getMongoConfig } from './config/mongo.config'
import { AuthModule } from './auth/auth.module'
import { FilesModule } from './files/files.module'
import { SitemapModule } from './sitemap/sitemap.module'
import { TelegramModule } from './telegram/telegram.module'
//import { UserSchema} from "./Schemas/user.schema"; //схема данных для отправки в базу данных
// import { UserModule } from './user/user.module';
import { UserModule } from "./user/user.module";
import {DataModule} from "./dataForm/data.module";
// import {MailModule} from "./mail/mail.module";


@Module({
	imports: [
		TypegooseModule.forRoot("mongodb+srv://admin:admin@cluster0.4awrspq.mongodb.net/?retryWrites=true&w=majority", {
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
		}),

		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [
				ConfigModule,
			],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		AuthModule,
		TopPageModule,
		ProductModule,
		ReviewModule,
		FilesModule,
		SitemapModule,
		TelegramModule,
		UserModule,

		DataModule,
		// MailModule,


	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
