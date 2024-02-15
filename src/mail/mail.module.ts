import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
    imports: [
        MailerModule.forRoot({
            // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
            // or
            transport: {
                host: 'mail.baikal-family.ru',
                port: 587,
                secure: false,
                ignoreTLS: true, // Игнорировать ошибку проверки сертификата
                auth: {
                    user: 'bot@baikal-family.ru',
                    pass: 'tB0vD7nQ1mtI6nP4',
                },
            },
            defaults: {
                from: '"No Reply" <bot@baikal-family.ru>',
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService], // 👈 export for DI
})
export class MailModule {}

