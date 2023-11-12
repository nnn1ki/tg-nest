import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { CreateReviewDto } from '../src/review/dto/create-review.dto'
import { disconnect, Types } from 'mongoose'
import { REVIEW_NOT_FOUND } from '../src/review/review.constants'
import { AuthDto } from '../src/auth/dto/auth.dto'

const productId = new Types.ObjectId().toHexString()

const loginDto: AuthDto = {
	login: 'user@example.com',
	password: '123456',
}

const testDto: CreateReviewDto = {
	productId,
	name: 'Test',
	title: ' Test title',
	description: 'Test description',
	rating: 5,
}

describe('ReviewController (e2e)', () => {
	let app: INestApplication
	let createdId: string
	let token: string

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()

		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
		token = body.access_token
	})

	it('/review/create (POST) - success', (done) => {
		request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id
				expect(createdId).toBeDefined()
				done()
			})
			.catch(done)
	})

	it('/review/create (POST) - fail', () =>
		request(app.getHttpServer())
			.post('/review/create')
			.send({ ...testDto, rating: 0 })
			.expect(400))

	it('/review/byProduct/:productId (GET) - success', (done) => {
		request(app.getHttpServer())
			.get('/review/byProduct/' + productId)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1)
				expect(body[0]._id).toBe(createdId)
				done()
			})
			.catch(done)
	})

	it('/review/byProduct/:productId (GET) - fail', (done) => {
		request(app.getHttpServer())
			.get('/review/byProduct/' + new Types.ObjectId().toHexString())
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(0)
				done()
			})
			.catch(done)
	})

	it('/review/:id (DELETE) - success', () =>
		request(app.getHttpServer())
			.delete('/review/' + createdId)
			.set('Authorization', `Bearer ${token}`)
			.expect(200))

	it('/review/:id (DELETE) - fail', () =>
		request(app.getHttpServer())
			.delete('/review/' + new Types.ObjectId().toHexString())
			.set('Authorization', `Bearer ${token}`)
			.expect(404, {
				statusCode: 404,
				message: REVIEW_NOT_FOUND,
			}))

	afterAll(disconnect)
})
