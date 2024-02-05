import { Injectable } from '@nestjs/common';
import {ModelType} from "@typegoose/typegoose/lib/types";
import {InjectModel} from "nestjs-typegoose";
import { UserModel } from './user.model';

@Injectable()
export class UserService {
    constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

    // методы для работы с пользователями по типу CRUD

    async create(user: UserModel): Promise<UserModel> {
        console.log("Creating user - ", user);
        const createdUser = new this.userModel(user);
        return createdUser.save();
    }


    async findAll(): Promise<UserModel[] | null> {
        return await this.userModel.find().exec();
    }
}