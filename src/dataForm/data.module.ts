import { Module } from '@nestjs/common';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import {MailModule} from "../mail/mail.module";

@Module({
    imports: [MailModule], //импортируем нашу почту

    controllers: [DataController],
    providers: [DataService],
})
export class DataModule {}