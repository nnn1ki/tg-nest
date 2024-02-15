// data.service.ts
import { Injectable } from '@nestjs/common';
import {User} from "../user/user.entity";
import {MailService} from "../mail/mail.service";


@Injectable()
export class DataService {
    constructor(private mailService: MailService) {}

    //использование сервиса почты для отправки сообщения
    async send(user: User) {
        //сюда можем сразу передать все данные, которые пришли с фронта


        console.log("data.sevice send user - ", user);
        // await this.mailerService.sendUserMail(user);
        await this.mailService.sendUserMail(user);

        // this.mailerService
        //     .sendMail({
        //         to: 'nma1tsev@yandex.ru', // list of receivers
        //         from: 'bot@baikal-family.ru', // sender address
        //         subject: 'Обращение получателя', // Subject line
        //         text: 'welcome', // plaintext body
        //         html: '<b>welcome</b>', // HTML body content
        //     })
        //     .then(() => {})
        //     .catch(() => {});
    }

    processData(data: any): Promise<any> {
        //тут мы и отправим все в модуль почты, чтобы оно ушло на ящик
        const {fullName, selectedSpecialist, questionDescription, userEmail } = data;

        try {
            this.send({fullName, selectedSpecialist, questionDescription, userEmail}); //попытка отправки
        }catch (e){
            console.log("Попытка отправки прервана - ", e);
        }

        return Promise.resolve({ message: 'Данные успешно получены на сервере' });
    }
}
