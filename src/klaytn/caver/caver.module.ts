import { Module } from "@nestjs/common";
import { CaverService } from "./caver.service";

@Module({
    providers: [CaverService]
})
export class CaverModule { }
