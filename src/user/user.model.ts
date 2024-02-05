import {prop, getModelForClass, index} from "@typegoose/typegoose";
import { IsString } from "class-validator";


// @index({id_user: 1}, {unique: false})
export class UserModel {
    // информация о пользователе
    @prop({ required: true })
    id: number;

    @IsString()
    @prop({ required: true })
    first_name: string;

    @IsString()
    @prop({ required: true })
    username: string;

    //сообщение, которе его интересовало
    @IsString()
    @prop({ required: true })
    message: string;
}


export const UserMongoModel = getModelForClass(UserModel);