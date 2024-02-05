import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { UserModel } from "./user.model";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [TypegooseModule.forFeature([UserModel])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}