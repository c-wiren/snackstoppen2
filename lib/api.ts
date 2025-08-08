const API_URL = 'https://apiv2.snackstoppen.se';
const STATIC_URL = 'https://static.snackstoppen.se/snackstoppen';

import Client from '@c-wiren/safe-router/client';

import type { Schema } from './schema/schema';
import type * as Types from './schema/types';
import type { GetActivityParams, GetReviewParams, GetReviewsParams, GetSnacksParams, GetUsersParams, ResetPasswordParams, SignupParams } from './schema/input-types';

type Result<T> = { ok: true, value: T; } | { ok: false, error: { error: string; type: 'Client' | 'Server'; }; };

const client = Client<Schema>(API_URL);

let refreshPromise: Promise<Result<void>> | null = null;

async function getToken(): Promise<string | null> {
    if (refreshPromise !== null) { await refreshPromise; }
    let token = null;
    try {
        token = localStorage.getItem("token");
    } catch { }
    if (token) { return "Bearer " + token; }
    return null;
}

// Call client with auth and handle invalid auth
async function client_auth<T extends Parameters<typeof client>[0]>(...args: Parameters<typeof client<T>>) {
    if (!args[2]) args[2] = {};
    const Authorization = await getToken();
    if (Authorization) {
        args[2].headers = Object.assign(args[2].headers ?? {}, { Authorization });
    }
    const result = await client(...args);
    if (!result.ok && result.error.error == 'TokenInvalid') {
        if (refreshPromise === null) {
            refreshPromise = refresh();
            await refreshPromise;
            refreshPromise = null;
        }
        delete (args[2].headers as Record<string, string>).Authorization;
        const Authorization = await getToken();
        if (Authorization) {
            args[2].headers = Object.assign(args[2].headers ?? {}, { Authorization });
        }
        return client(...args);
    }
    return result;
}

type Replace<T, U> = Omit<T, keyof U> & U;

export type Brand = Replace<Types.Brand, {
    image?: {
        sm: string;
        lg: string;
    };
}>;

export type Snack = Replace<Types.Snack, {
    image?: {
        sm: string;
        lg: string;
    };
    brand: Brand;
}>;


export type Review = Replace<Types.Review, {
    snack: Snack,
    user: User;
}>;

export type User = Types.User;

type Store = {
    snacks: Record<string, Snack>;
    brands: Record<string, Brand>;
    users: Record<string, User>;
    reviews: Record<number, Review>;
    user?: Types.User;
};


const defaultStore = () => ({ snacks: {}, brands: {}, users: {}, user: undefined, reviews: {} });

const store: Store = reactive(defaultStore());

function onFetchSnack(snack: Types.Snack): Snack {
    let image;
    if (snack.image) {
        image = {
            sm: `${STATIC_URL}/sm/snacks/${snack.image}.webp`,
            lg: `${STATIC_URL}/snacks/${snack.image}.webp`
        };
    }
    let brand;
    if (snack.brand) {
        if (store.brands[snack.brand.id]) {
            brand = store.brands[snack.brand.id];
        } else {
            brand = onFetchBrand(snack.brand);

        }
    }
    const brandSlug = `${snack.brand?.id}/${snack.slug}`;
    store.snacks[brandSlug] = Object.assign(store.snacks[brandSlug] ?? {}, snack, { image, brand });
    return store.snacks[brandSlug];
}

function onFetchBrand(brand: Types.Brand): Brand {
    let image;
    if (brand.image) {
        image = {
            sm: `${STATIC_URL}/sm/brands/${brand.image}.webp`,
            lg: `${STATIC_URL}/brands/${brand.image}.webp`
        };
    }
    store.brands[brand.id] = Object.assign(store.brands[brand.id] ?? {}, brand, { image });
    return store.brands[brand.id];
}

function onFetchUser(user: Types.User): User {
    store.users[user.username!] = Object.assign(store.users[user.username!] ?? {}, user);
    return store.users[user.username!];
}

function onFetchReview(review: Types.Review): Review {
    let snack;
    if (review.snack && review.snack.slug && review.snack.brand) {
        const brandSlug = `${review.snack.brand?.id}/${review.snack.slug}`;
        if (store.snacks[brandSlug]) {
            snack = store.snacks[brandSlug];
        } else {
            snack = onFetchSnack(review.snack);
        }
    }
    let user;
    if (review.user && review.user.username) {
        if (store.users[review.user.username]) {
            user = store.users[review.user.username];
        } else {
            user = onFetchUser(review.user);
        }
    }
    store.reviews[review.id] = Object.assign(store.reviews[review.id] ?? {}, review, { snack, user });
    return store.reviews[review.id];
}

async function getBrands() {
    if (store.brands.length) { return store.brands; }
    const result = await client('getBrands', undefined);

    if (result.ok) {
        for (const brand of result.value) { onFetchBrand(brand); }
        return store.brands;
    }
    else { throw result.error.error; }
}

async function getBrand(brand: string): Promise<Brand | null> {
    await getBrands();
    return store.brands[brand] ?? null;
}

async function getSnacks(params: GetSnacksParams = {}) {
    let result = await client('getSnacks', params);
    let snacks: Snack[] = [];
    if (result.ok) {
        for (const snack of result.value) { snacks.push(onFetchSnack(snack)); }
        return snacks;
    } else { throw result.error.error; }
}

async function getSnack(brand: string, slug: string): Promise<Snack | null> {
    const brandSlug = `${brand}/${slug}`;
    if (store.snacks[brandSlug]) { return store.snacks[brandSlug]; }
    const result = await client('getSnack', { brand, slug });
    if (result.ok) { return onFetchSnack(result.value); }
    else {
        if (result.error.error === 'NotFound') { return null; }
        else { throw result.error.error; }
    }
};

async function getUser(username: string): Promise<User | null> {
    const result = await client_auth('getUser', { username });
    if (result.ok) { return onFetchUser(result.value); }
    else {
        if (result.error.error === 'NotFound') { return null; }
        else { throw result.error; }
    }
}

async function getUsers(params: GetUsersParams) {
    const result = await client_auth('getUsers', params);
    let users: User[] = [];
    if (result.ok) {
        for (const user of result.value) { users.push(onFetchUser(user)); }
        return users;
    } else { throw result.error; }
}

async function login(user: string, password: string): Promise<Result<void>> {
    const result = await client('login', { user, password });
    if (result.ok) {
        localStorage.setItem('token', result.value.token);
        localStorage.setItem('refresh', result.value.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.value.user));
        store.users[result.value.user.username!] = result.value.user;
        store.user = result.value.user;
        return { ok: true, value: undefined };
    }
    else {
        return result;
    }
}

function logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    if (store.user) {
        store.user.email = undefined;
        store.user = undefined;
    }
}

async function logoutAll(): Promise<Result<void>> {
    const result = await client_auth('logoutAll', undefined);
    if (result.ok) {
        logout();
    }
    return result;
}

async function refresh(): Promise<Result<void>> {
    const token = localStorage.getItem('refresh');
    if (token) {
        const result = await client('refresh', { token });
        if (result.ok) {
            localStorage.setItem('token', result.value.token);
            localStorage.setItem('refresh', result.value.refreshToken);
            localStorage.setItem('user', JSON.stringify(result.value.user));
            store.users[result.value.user.username!] = result.value.user;
            store.user = result.value.user;
        }
        else {
            // TODO: Handle other cases
            // if (result.error.error === 'TokenInvalid') {
            logout();
            // }
            // else {
            //     return result;
            // }
        }
        return { ok: true, value: undefined };
    }
    else {
        logout();
        return { ok: false, error: { error: 'TokenInvalid', type: 'Client' } };
    }
}

function loadSession(): boolean {
    const user = JSON.parse(localStorage.getItem('user') ?? 'null');
    if (user) {
        store.users[user.username!] = user;
        store.user = user;
        return true;
    }
    return false;
}

async function signup(params: SignupParams): Promise<Result<void>> {
    const result = await client('signup', params);
    if (result.ok) {
        localStorage.setItem('token', result.value.token);
        localStorage.setItem('refresh', result.value.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.value.user));
        store.users[result.value.user.username!] = result.value.user;
        store.user = result.value.user;
        return { ok: true, value: undefined };
    }
    else { return result; }
}

async function verifyEmail(email: string) {
    return client('verifyEmail', { email });
}

async function requestResetPassword(email: string) {
    return client('requestResetPassword', { email });
}

async function resetPassword(params: ResetPasswordParams) {
    const result = await client('resetPassword', params);
    if (result.ok) {
        localStorage.setItem('token', result.value.token);
        localStorage.setItem('refresh', result.value.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.value.user));
        store.users[result.value.user.username!] = result.value.user;
        store.user = result.value.user;
        return { ok: true, value: undefined };
    }
    else { return result; }
}

async function getUserAvailability(username: string) {
    return client('getUsernameAvailability', { username });
}

async function createReview(
    snack: Snack,
    rating: number,
    review: string | undefined = undefined): Promise<Result<Review>> {
    const result = await client_auth('createReview', { snackId: snack.id, rating, review });
    if (result.ok) {
        return { ok: true, value: onFetchReview(result.value) };
    } else {
        return result;
    }
}

async function getReview(params: GetReviewParams): Promise<Review | null> {
    const result = await client_auth('getReview', params);
    if (result.ok) {
        return onFetchReview(result.value);
    }
    else {
        if (result.error.error === 'NotFound') { return null; }
        else { throw result.error; };
    }
}

async function getReviews(params: GetReviewsParams): Promise<Review[]> {
    const result = await client_auth('getReviews', params);
    const reviews: Review[] = [];
    if (result.ok) {
        for (const review of result.value) { reviews.push(onFetchReview(review)); }
        return reviews;
    } else { throw result.error; }
}

async function getActivity(params: GetActivityParams = {}): Promise<Review[] | null> {
    if (!store.user) { return null; }
    const result = await client_auth('getActivity', params);
    const reviews: Review[] = [];
    if (result.ok) {
        for (const review of result.value) { reviews.push(onFetchReview(review)); }
        return reviews;
    } else {
        if (result.error.error === 'Unauthorized') { return null; }
        throw result.error;
    }
}

async function like(review: Review): Promise<Result<void>> {
    if (review.liked) { return { ok: true, value: undefined }; }
    review.liked = true;
    if (review.likes !== undefined) { review.likes++; }
    const result = await client_auth('like', { reviewId: review.id });
    if (!result.ok) {
        review.liked = false;
        if (review.likes !== undefined) { review.likes--; }
        return result;
    }
    return { ok: true, value: undefined };
}

async function unlike(review: Review): Promise<Result<void>> {
    if (!review.liked) { return { ok: true, value: undefined }; }
    review.liked = false;
    if (review.likes !== undefined) { review.likes--; }
    const result = await client_auth('unlike', { reviewId: review.id });
    if (!result.ok) {
        review.liked = true;
        if (review.likes !== undefined) { review.likes++; }
        return result;
    }
    return { ok: true, value: undefined };
}

async function follow(user: User): Promise<Result<void>> {
    if (store.user && store.user.following !== undefined) { store.user.following++; }
    if (user.follow) { return { ok: true, value: undefined }; }
    user.follow = true;
    if (user.followers !== undefined) { user.followers++; }
    const result = await client_auth('follow', { followsUserId: user.id });
    if (!result.ok) {
        user.follow = false;
        if (user.followers !== undefined) { user.followers--; }
        if (store.user && store.user.following !== undefined) { store.user.following--; }
        return result;
    }
    return { ok: true, value: undefined };
}

async function unfollow(user: User): Promise<Result<void>> {
    if (store.user && store.user.following !== undefined) { store.user.following--; }
    if (!user.follow) { return { ok: true, value: undefined }; }
    user.follow = false;
    if (user.followers !== undefined) { user.followers--; }
    const result = await client_auth('unfollow', { followsUserId: user.id });
    if (!result.ok) {
        user.follow = true;
        if (user.followers !== undefined) { user.followers++; }
        if (store.user && store.user.following !== undefined) { store.user.following++; }
        return result;
    }
    return { ok: true, value: undefined };
}

export default {
    getSnack,
    getSnacks,
    getBrand,
    getBrands,
    getUser,
    getUsers,
    login,
    logout,
    logoutAll,
    refresh,
    signup,
    verifyEmail,
    requestResetPassword,
    resetPassword,
    getUserAvailability,
    loadSession,
    createReview,
    getReview,
    getReviews,
    getActivity,
    like,
    unlike,
    follow,
    unfollow,
    get currentUser() {
        return store.user;
    }
};
