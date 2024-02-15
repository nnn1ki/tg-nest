// import { MailerService } from '@nestjs-modules/mailer';
// import { Injectable } from '@nestjs/common';
// import { UserModel } from './../user/user.model';
//
// @Injectable()
// export class MailService {
//     constructor(private mailerService: MailerService) {}
//
//     // async sendMessage(userQuestion) {
//     //
//     //     await this.mailerService.sendMail({
//     //         to: "nma1tsev@yandex.ru",
//     //         // from: '"Support Team" <support@example.com>', // override default from
//     //         subject: 'Доброго времени суток! Вопрос от получателя',
//     //         template: './confirmation', // `.hbs` extension is appended automatically
//     //         context: {
//     //             userQuestion.name, // имя пользователя
//     //             userQuestion.question, // его вопрос
//     //             userQuestion.howToCall // где ему ответить
//     //         },
//     //     });
//     // }
// }


import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    private mail = '';

    // мы можем тут принять данные о том, кому нужно отправить
    async sendUserMail(user: User) {

        switch (user.selectedSpecialist){
            case ('lawyer'): this.mail = 'yurist@baikal-family.ru'; break;
            case ('director'): this.mail = 'del@baikal-family.ru'; break;
            case ('specialist'): this.mail = 'tsr@baikal-family.ru'; break;
        }

        console.log("wait this.mailerService.sendMail - ", user);
        await this.mailerService.sendMail({
            to: this.mail,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Обращение от получателя фонда',
            template: './questionForm', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                fullName: user.fullName,
                selectedSpecialist: user.selectedSpecialist,
                questionDescription: user.questionDescription,
                userEmail: user.userEmail,
            },
        });
    }
}
