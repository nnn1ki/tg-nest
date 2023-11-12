import { ITelegramOptions } from '../telegram/telegram.interface'
import { ConfigService } from '@nestjs/config'
import { session } from 'telegraf'

export const getTelegramConfig = (
	configService: ConfigService,
): ITelegramOptions => {
	const token = configService.get('TELEGRAM_TOKEN')
	if (!token) {
		throw new Error('TELEGRAM_TOKEN не задан')
	}
	return { token, middlewares: [session()] }
}
