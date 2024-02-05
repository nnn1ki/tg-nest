import { Controller, Get, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserModel } from "./user.model";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUser(): Promise<UserModel[] | null> {
        return await this.userService.findAll();
    }

    @Post()
    async create(@Body() user: UserModel): Promise<UserModel> {
        console.log('Received user data:', user);
        return await this.userService.create(user);
    }
}