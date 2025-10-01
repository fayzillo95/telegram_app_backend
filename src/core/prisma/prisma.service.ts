import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy{
    private logger : Logger
    async onModuleDestroy() {

        try {
            this.$disconnect()
            this.logger.warn("Database disconnected !")
        } catch (error) {
            this.logger.error(error.message)
        }
    }
    async onModuleInit() {
        this.logger = new Logger()
        try {
            this.$connect()
            this.logger.log("Database connected !")
        } catch (error) {
            this.logger.error(error.message)   
        }
    }
}
