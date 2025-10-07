import { Profile, User } from "@prisma/client";

export const profileServiceReturnData = (user: User, profile?: Profile) => {
  const {
    id: userId,
    email,
    username,
    isBot,
    isDeleted,
    createdAt,
    updatedAt,
  } = user;

  const {
    id: profileId,
    firstName,
    lastName,
    bio,
    avatar,
    privateUrl,
    publicUrl,
  } = profile || {};

  return {
    userId,
    profileId,
    username,
    firstName,
    lastName,
    email,
    avatar,
    bio,
    isDeleted,
    isBot,
    publicUrl,
    privateUrl,
    updatedAt,
    createdAt,
  };
};