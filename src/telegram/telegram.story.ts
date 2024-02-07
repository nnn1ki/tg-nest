import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf'
import { Context } from 'telegraf'
import { SceneContext } from 'telegraf/typings/scenes'
import { Update } from 'telegraf/typings/core/types/typegram'


import { UserMongoModel } from '../user/user.model';
import axios from 'axios';



/* just some service to save data in SQL database */
// import { UserSessionStorageService } from '../../storages'
import * as notValidatedStoryJson from './scenes.json'
import Client from '../espocrm-api/espocrm-api-client';
import {TypegooseModule} from "nestjs-typegoose";
import * as mongoose from "mongoose";

type SessionValue = { storyStep?: string | null }

const userSessionService = {
	db: {} as Record<number, SessionValue>,
	getUserStoryStep(userId: number): string | null {
		return this.db[userId]?.storyStep || null
	},
	updateUserSession(userId: number, value: SessionValue) {
		this.db[userId] = value
	},
}

type UserSessionStorageService = typeof userSessionService

interface IStoryStep {
	replies: { type: string; message: string }[]
	buttons: { text: string; nextStep: string;}[]
}

const storySteps: Record<string, IStoryStep> = notValidatedStoryJson

const getUserId = (context: Context): number => {
	if ('callback_query' in context.update) {
		return context.update.callback_query.from.id
	}

	if ('message' in context.update) {
		return context.update.message.from.id
	}

	if ('my_chat_member' in context.update) {
		return context.update.my_chat_member.from.id
	}

	return -1
}

@Scene('story')
export class StoryScene {
	// constructor(
	// 	private readonly userSessionService: UserSessionStorageService,
	// ) {}

	@SceneEnter()
	async start(@Ctx() context: SceneContext) {
		const userId = getUserId(context)
		const currentStep = await userSessionService.getUserStoryStep(userId)

		const story = storySteps[currentStep || 'info']
		if (!story) return

		const { replies, buttons } = story

		context.reply(replies.map(({ message }) => message).join('\n'), {
			reply_markup: {
				inline_keyboard: buttons.map(({ text, nextStep}) => [
					{
						text,
						callback_data: nextStep,
					},
				]),
			},
		})
	}

	@Action(/.*/)
	async onAnswer(
		@Ctx() context: SceneContext & { update: Update.CallbackQueryUpdate },
	) {
		const userId = getUserId(context);
		const cbQuery = context.update.callback_query; //вся нужная информация о пользователе
		const nextStep = 'data' in cbQuery ? cbQuery.data : null; // та кнопка, которую нажал пользователь - ее кодовое название

		const userInfo = {
			id: cbQuery.from.id,
			first_name: cbQuery.from.first_name,
			username: cbQuery.from.username,
			message: nextStep,
		}


		try {
			console.log('Trying to connect to MongoDB...');

			//todo - правильно получать ссылку из .env
			await mongoose.connect('mongodb+srv://admin:admin@cluster0.4awrspq.mongodb.net/?retryWrites=true&w=majority', {
				// useNewUrlParser: true,
				// useUnifiedTopology: true,
			});
			console.log('Connected to MongoDB successfully!');
			await UserMongoModel.create(userInfo);
			console.log('Data sent:', userInfo);
		} catch (e){
			console.log("Возникла ошибка при отправке данных - ", e);
		} finally {
			// Close the connection when done (important to avoid hanging connections)
			await mongoose.disconnect();
			console.log('Disconnected from MongoDB.');
		}


		const client = new Client(
			'https://my.baikal-p.ru',
			'add60ba089673e2fb2fec8f9a404b603',
			'538baa48fcb8ea0bd8c57e3084795945'
		);

		client.request('POST', 'UsernameTG', userInfo)
			.then(
				(response) => {
					// success
					console.log(response);
				}
			)
			.catch(
				(res) => {
					// error
					console.log("Ошибка отправки - ", res.statusCode, res.statusMessage);
				}
			);

		if (nextStep === 'stop') {
			await userSessionService.updateUserSession(userId, {})
			await context.reply('Отлично! Обращайся!')
			return
		}
		await userSessionService.updateUserSession(userId, {
			storyStep: nextStep,
		})
		context.scene.reenter()
	}
}
