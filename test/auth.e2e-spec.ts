import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { disconnect } from 'mongoose'
import { AuthDto } from '../src/auth/dto/auth.dto'
import {
	INCORRECT_PASSWORD_ERROR,
	USER_NOT_FOUND_ERROR,
} from '../src/auth/auth.constants'

const loginDto: AuthDto = {
	login: 'user@example.com',
	password: '123456',
}

describe('AuthController (e2e)', () => {
	let app: INestApplication

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	it('/auth/login (POST) - success', (done) => {
		request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined()
				done()
			})
			.catch(done)
	})
	it('/auth/login (POST) - fail password', () =>
		request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, password: '2' })
			.expect(401, {
				statusCode: 401,
				message: INCORRECT_PASSWORD_ERROR,
				error: 'Unauthorized',
			}))

	it('/auth/login (POST) - fail login', () =>
		request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, login: 'user@bad_example.com' })
			.expect(401, {
				statusCode: 401,
				message: USER_NOT_FOUND_ERROR,
				error: 'Unauthorized',
			}))

	afterAll(disconnect)
})
