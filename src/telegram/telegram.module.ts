import { Global, Module } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { TelegrafModule } from 'nestjs-telegraf'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getTelegramConfig } from '../config/telegram.config'
import { StoryScene } from './telegram.story'

@Global()
@Module({
	imports: [
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getTelegramConfig,
		}),
	],
	providers: [TelegramService, StoryScene],
	exports: [TelegramService],
})
export class TelegramModule {}
