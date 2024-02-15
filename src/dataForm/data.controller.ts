// data.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { DataService } from './data.service';

@Controller() // Указывает на путь, к которому будут приходить запросы
export class DataController {
    constructor(private readonly dataService: DataService) {}

    @Post() // Обрабатывает POST-запросы по пути /data
    async handleData(@Body() data: any): Promise<any> {
        console.log("Принятые данные - ", data);
        const result = await this.dataService.processData(data);
        return result;
    }
}
