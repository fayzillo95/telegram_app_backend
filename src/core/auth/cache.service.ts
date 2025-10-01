import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

export type UserCacheValue = {
    code: number;
    email: string;
};

@Injectable()
export class CacheService {
    private cache: Map<string, UserCacheValue> = new Map();

    set(email: string, data: UserCacheValue, ttlMs: number): void {
        if(this.cache.get(email)){
            throw new BadRequestException("Sizga oldin code yuborilgan birozdan so'ng urinib ko'ring")
        }
        this.cache.set(email, data);
        console.log("Cacheservice set ",this.cache.get(email))
        setTimeout(() =>{
            const exists = this.cache.get(email)
            if(exists){
                this.cache.delete(email)
            }
        },ttlMs)
    }

    get(email: string): UserCacheValue | null {
        return this.cache.get(email) || null;
    }

    delete(email: string): void {
        this.cache.delete(email);
    }   

    getAll(): Map<string, UserCacheValue> {
        return this.cache;
    }
}
