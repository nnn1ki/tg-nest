import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	app.enableCors({ allowedHeaders: '*' })
	await app.listen(8000)
}

bootstrap()


//todo -
// 1 - сделать все ссылки кнопками
// 2 - сделать конечное сообщение - понравилось, не понравилось
// 3 - добавить обратную связь - можно взять форму с сайта и привязать ее к своей почте, и почте юриста
