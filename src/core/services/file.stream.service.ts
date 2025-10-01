import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { existsSync } from 'fs';
import { getPathInFileType, headerDataStream, urlGenerator } from "../../common/types/generator.types";
import { join } from "path";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileStreamService {

    constructor(
        private readonly config : ConfigService
    ){}

    async fileStream(
        res: Response,
        fileName: string,
    ) {
        const filePath = join(getPathInFileType(fileName), fileName)
        if (!existsSync(filePath)) {
            return res.status(404).json({ message: 'Video not found' });
        }
        headerDataStream(res, filePath, fileName)
    }

    async writeFileSerrvice(filename : string){
        return urlGenerator(this.config,filename)
    }
}