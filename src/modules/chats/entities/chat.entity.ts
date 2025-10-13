import { ChannelChat, User } from "@prisma/client";
import { profileServiceReturnData } from "src/modules/profile/entities/profile.entity";

export class Chat {}

export function channelChatReturnData(ch: ChannelChat & { owner?: User & { Profile?: any[] } },user2Id? :string,lastActivaty? : Date) {
  return {
    id: ch.id,
    title: ch.title,
    logo: ch.logo,
    description: ch.description,
    publicUrl: ch.publicUrl,
    privateUrl: ch.privateUrl,
    subscriptionsCount: Number(ch.subscriptionsCount ?? 0),
    createdAt: ch.createdAt,
    updatedAt: ch.updatedAt,
    type: ch.type,
    user2Id,
    ownerId : ch.owner?.id,
    lastActivaty : lastActivaty,
    owner: ch.owner
      ? profileServiceReturnData(ch.owner, ch.owner.Profile?.[0])
      : undefined,
  };
}