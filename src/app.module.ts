import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TopPageModule } from './top-page/top-page.module'
import { ProductModule } from './product/product.module'
import { ReviewModule } from './review/review.module'
import { TypegooseModule } from 'nestjs-typegoose'

//отключаем монго
import { getMongoConfig } from './config/mongo.config'

import { AuthModule } from './auth/auth.module'
import { FilesModule } from './files/files.module'
import { SitemapModule } from './sitemap/sitemap.module'
// import { TelegramModule } from './telegram/telegram.module'
import { TelegramModule } from './telegram/telegram.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],

			useFactory: getMongoConfig,
		}),
		AuthModule,
		TopPageModule,
		ProductModule,
		ReviewModule,
		FilesModule,
		SitemapModule,
		// TODO deprecated
		TelegramModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
