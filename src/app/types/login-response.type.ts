export type LoginResponse = {
    user: UserType;
    token: string;
};

type UserType = {
    id: number;
    name: string;
    email: string;
    role: string;
    profile_picture?: string | null;
};
