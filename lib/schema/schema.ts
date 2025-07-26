import type { Snack, Review, Brand, Categories, Login, Verification, User } from './types.ts';
import type types from './input-types.ts';

export interface Schema {
    getSnack: { in: typeof types.getSnack; out: Snack; };
    getSnacks: { in: typeof types.getSnacks; out: Snack[]; };
    getBrand: { in: typeof types.getBrand; out: Brand; };
    getBrands: { in: undefined; out: Brand[]; };
    getCategories: { in: undefined; out: Categories; };
    login: { in: typeof types.login; out: Login; };
    refresh: { in: typeof types.refresh; out: Login; };
    logoutAll: { in: undefined; out: undefined; };
    verifyEmail: { in: typeof types.verifyEmail; out: Verification; };
    requestResetPassword: { in: typeof types.requestResetPassword; out: Verification; };
    signup: { in: typeof types.signup; out: Login; };
    resetPassword: { in: typeof types.resetPassword; out: Login; };
    getUser: { in: typeof types.getUser; out: User; };
    getUsernameAvailability: { in: typeof types.getUsernameAvailability; out: boolean; };
    getUsers: { in: typeof types.getUsers; out: User[]; };
    getReview: { in: typeof types.getReview; out: Review; };
    getReviews: { in: typeof types.getReviews; out: Review[]; };
    createReview: { in: typeof types.createReview; out: Review; };
    createSnack: { in: typeof types.createSnack; out: Snack; };
    deleteReview: { in: typeof types.deleteReview; out: boolean; };
    like: { in: typeof types.like; out: Review; };
    unlike: { in: typeof types.like; out: Review; };
    follow: { in: typeof types.follow; out: User; };
    unfollow: { in: typeof types.follow; out: User; };
    getActivity: { in: typeof types.getActivity; out: Review[]; };
}
