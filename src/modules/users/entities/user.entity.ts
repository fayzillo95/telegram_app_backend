import { Profile, User } from "@prisma/client";

export const userReturnData = (
  user: User | null,
  profile?: Profile | null,
  message = 'Success',
  status = 200,
) => {
  if (!user) {
    return {
      status,
      success: false,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  const { id: userId, username, email, isBot, isDeleted, createdAt, updatedAt } = user;

  const {
    id: profileId = '',
    firstName = null,
    lastName = null,
    avatar = null,
    bio = null,
    privateUrl = null,
    publicUrl = null,
  } = profile || {};

  return {
    status,
    success: true,
    message,
    data: {
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
      createdAt,
      updatedAt,
    },
  };
};
