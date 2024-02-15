import { Injectable } from '@nestjs/common'
import { Scenes, Telegraf, Markup } from 'telegraf'
import { InjectBot, Start, Update } from 'nestjs-telegraf'
import { UserService } from '../user/user.service';
// import {MailService} from "../mail/mail.service";


@Update()
@Injectable()
export class TelegramService {
	constructor(@InjectBot() private bot: Telegraf) {
		this.bot.help((ctx) => ctx.reply('Send me a sticker'))
		this.bot.hears('hh', (ctx) => ctx.reply('👍 👍👍👍👍'))
	}

	//точка входа в программу
	@Start()
	start(ctx: Scenes.SceneContext) {
		ctx.scene.enter('story');

		//const user = {//добавим перменную, которая повторяет поля пользователя, но только начальные
			//telegramId: ctx.from.id,
			// Добавьте другие поля, если необходимо
		//};


		const userQ = {
			name: "test1", question: "question", howToCall: "1234567890"
		}
		// this.sendQuestion(userQ);
		//this.usersService.create(user);
	}

	async sendMessage(message: string, chatId: string) {
		await this.bot.telegram.sendMessage(chatId, message)
	}


	// async sendQuestion(userQ) {
	// 	await this.mailService.sendMail(userQ);
	// }

}
