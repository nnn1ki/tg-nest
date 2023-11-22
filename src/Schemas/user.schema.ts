import { prop } from '@typegoose/typegoose';
import {IsString} from 'class-validator';

//todo - настроить схему под контекст пользлвателя

export class UserSchema {
    @IsString()
    @prop({
        required: true
    })
    name: string;
}


