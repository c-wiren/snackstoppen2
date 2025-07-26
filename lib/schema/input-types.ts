import { z } from 'zod';

type IsInput = true;
type Infer<T extends z.ZodTypeAny> = IsInput extends true ? z.input<T> : z.infer<T>;

const getSnack = z.object({
    brand: z.string(),
    slug: z.string()
});
export type GetSnackParams = Infer<typeof getSnack>;

const getSnacks = z.object({
    brand: z.string().optional(),
    limit: z.number().min(5).max(30).default(20),
    page: z.number().nonnegative().default(0),
    category: z.string().optional(),
    subcategories: z.array(z.string()).optional(),
    order: z.enum(['Name', 'Rating']).default('Name')
});
export type GetSnacksParams = Infer<typeof getSnacks>;

const getBrand = z.object({
    brand: z.string()
});
export type GetBrandParams = Infer<typeof getBrand>;

const login = z.object({
    user: z.string(),
    password: z.string()
});
export type LoginParams = Infer<typeof login>;

const refresh = z.object({
    token: z.string()
});
export type RefreshParams = Infer<typeof refresh>;

const verifyEmail = z.object({
    email: z.string().email()
});
export type VerifyEmailParams = Infer<typeof verifyEmail>;

const requestResetPassword = z.object({
    email: z.string().email()
});
export type RequestResetPasswordParams = Infer<typeof requestResetPassword>;

const signup = z.object({
    token: z.string(),
    verificationCode: z.string(),
    password: z.string().min(8).max(128),
    username: z.string().min(2).max(20).regex(/^[a-zA-Z0-9-_]+$/),
    firstname: z.string().min(1).max(35).optional(),
    lastname: z.string().min(1).max(35).optional()
});
export type SignupParams = Infer<typeof signup>;

const resetPassword = z.object({
    token: z.string(),
    verificationCode: z.string(),
    password: z.string()
});
export type ResetPasswordParams = Infer<typeof resetPassword>;

const getUser = z.object({
    username: z.string()
});
export type GetUserParams = Infer<typeof getUser>;

const getUsernameAvailability = z.object({
    username: z.string()
});
export type GetUsernameAvailabilityParams = Infer<typeof getUsernameAvailability>;

const getUsers = z.object({
    follows: z.string().optional(),
    following: z.string().optional()
});
export type GetUsersParams = Infer<typeof getUsers>;

const getReview = z.object({
    reviewId: z.number()
});
export type GetReviewParams = Infer<typeof getReview>;

const getReviews = z.object({
    username: z.string().optional(),
    brand: z.string().optional(),
    slug: z.string().optional(),
    limit: z.number().min(5).max(30).default(20),
    page: z.number().nonnegative().default(0),
    order: z.enum(['Likes', 'New']).default('Likes')
});
export type GetReviewsParams = Infer<typeof getReviews>;

const createReview = z.object({
    snackId: z.number(),
    rating: z.number().min(1).max(10),
    review: z.string().min(1).max(10000).optional()
});
export type CreateReviewParams = Infer<typeof createReview>;

const deleteReview = z.object({ reviewId: z.number() });
export type DeleteReviewParams = Infer<typeof deleteReview>;

const like = z.object({ reviewId: z.number() });
export type LikeParams = Infer<typeof like>;

const follow = z.object({ followsUserId: z.number() });
export type FollowParams = Infer<typeof follow>;

const createSnack = z.object({
    name: z.string().min(1).max(100),
    category: z.string(),
    subcategory: z.string().optional(),
    slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    image: z.string().optional(),
    ingredients: z.string().min(1).max(2000).optional(),
    brandId: z.string()
});
export type CreateSnackParams = Infer<typeof createSnack>;

const getActivity = z.object({
    limit: z.number().min(5).max(20).default(10),
    page: z.number().nonnegative().default(0),
});
export type GetActivityParams = Infer<typeof getActivity>;

export default {
    getSnack,
    getSnacks,
    getBrand,
    login,
    refresh,
    verifyEmail,
    requestResetPassword,
    signup,
    resetPassword,
    getUser,
    getUsernameAvailability,
    getUsers,
    getReview,
    getReviews,
    createReview,
    deleteReview,
    createSnack,
    follow,
    like,
    getActivity
};
