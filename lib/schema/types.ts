export type LoginUser = {
    id: number;
    role?: string;
    username: string;
    email: string;
    password: string;
    firstname?: string;
    lastname?: string;
    image?: string;
    logout: Date;
};

export type Brand = {
    id: string;
    name?: string;
    image?: string;
    count?: number;
    categories?: string[];
};

export type Snack = {
    id: number;
    brand?: Brand;
    name?: string;
    slug?: string;
    category?: string;
    subcategory?: string;
    image?: string;
    ingredients?: string;
    date?: number;
    rating?: number;
    reviews?: number;
};

export type User = {
    id: number;
    username?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    created?: number;
    image?: string;
    role?: string;
    followers?: number;
    following?: number;
    follow?: boolean;
};

export type Review = {
    id: number;
    snack?: Snack;
    rating?: number;
    user?: User;
    review?: string;
    created?: number;
    edited?: number;
    likes?: number;
    liked?: boolean;
};

export type Login = { token: string; };

export type Verification = { verificationToken: string; };

export type Categories = Record<string, string[]>;

export type ErrorMessage =
    'NotFound' |
    'Unknown' |
    'TokenInvalid' |
    'EmailAlreadyExists' |
    'VerificationCodeInvalid' |
    'PasswordIncorrect' |
    'ValidationFailed' |
    'Unauthorized' |
    'Failed';

export type AuthenticatedUser = {
    id: number;
    role?: string;
};
export type RefreshedUser = {
    id: number;
    logout: Date;
};
