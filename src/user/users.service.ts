import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import {ModelType} from "@typegoose/typegoose/lib/types";
import {InjectModel} from "nestjs-typegoose";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private readonly userModel: ModelType<User>) {}

    async create(user: User): Promise<User> {
        const createdUser = new this.userModel(user);
        return createdUser.save();
    }

    // методы для работы с пользователями по типу CRUD
}