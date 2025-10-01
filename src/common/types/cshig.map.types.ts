export type UserCacheValue = {
    code: string;
    email: string;
    password: string;
    fullname: string;
    expiresAt: number; // TTL uchun timestamp (millisekundlarda)
};

export type UserCache = Map<string, UserCacheValue>;
