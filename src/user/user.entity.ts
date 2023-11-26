import { prop } from '@typegoose/typegoose';

export class User {
    @prop({ required: true })
    telegramId: number;

    // тут можно написать другие поля для отправления в монго
}