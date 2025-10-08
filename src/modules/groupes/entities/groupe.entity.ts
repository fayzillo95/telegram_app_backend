import { GroupChat } from "@prisma/client";

export class Groupe {}

export function groupReturnData(group: GroupChat) {
  return {
    id: group.id,
    ownerId: group.ownerId,
    title: group.title,
    description: group.description,
    logo: group.logo,
    publicUrl: group.publicUrl,
    privateUrl: group.privateUrl,
    subscriptionsCount: Number(group.subscriptionsCount),
    createdAt: group.createdAt,
    updatedAt: group.updatedAt
  };
}
