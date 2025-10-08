import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateGroupSubscriptionDto {
    @ApiProperty({example : "descsd-cds78sc-cds78ds-cds7c8sdc"})
    @IsUUID()
    chatId : string
}
