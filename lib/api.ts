/*
const API_URL = 'http://127.0.0.1:8787';

import Client from '@c-wiren/safe-router/client';

import { Schema } from './schema/schema';
import { Brand, Snack, Review, User } from './schema/types';

const client = Client<Schema>(API_URL);

type Store = {
    snacks: Record<string, Snack>;
};

const defaultStore = () => ({ snacks: {} });

const store: Store = reactive(defaultStore());
*/

const mockBrand = { id: "olw", name: "OLW", count: 1, categories: ["Chips"] };
const mockSnack = { id: 0, slug: "sourcream-and-onion", name: "Sourcream & Onion", brand: mockBrand, category: "Chips", subcategory: "Potatischips", rating: 8, ingredients: "Potatis, solrosolja", date: Date.now(), reviews: 1 };
const mockUser = { id: 0, username: 'chipsfantast1', created: Date.now(), followers: 5, following: 3 };
const mockReview = {
    id: 0,
    snack: mockSnack,
    rating: 8,
    user: mockUser,
    review: "Sveriges stolthet",
    created: Date.now(),
    likes: 4,
};

async function getBrands() {
    return [mockBrand];
}

async function getBrand(brand: string) {
    return (brand == "olw") ? mockBrand : undefined;
}

async function getSnacks(brand?: string) {
    return [mockSnack];
}

async function getSnack(brand: string, slug: string) {
    return (brand == "olw" && slug == "sourcream-and-onion") ? mockSnack : undefined;
    /*
    const brandSlug = `${brand}/${slug}`;
    if (store.snacks[brandSlug]) { return store.snacks[brandSlug]; }
    const result = await client('getSnack', { brand, slug });
    if (result.ok) {
        store.snacks[brandSlug] = result.value;
        return store.snacks[brandSlug];
    }
    else { throw result.error.error; }
    */
};

async function getUser(username: string) {
    return (username == 'chipsfantast1') ? mockUser : undefined;
}

async function getUserReviews(username: string) {
    return (username == 'chipsfantast1') ? [mockReview] : undefined;
}

async function getSnackReviews(brand: string, slug: string) {
    return (brand == 'olw' && slug == 'sourcream-and-onion') ? [mockReview] : undefined;
}

export default {
    getSnack,
    getSnacks,
    getBrand,
    getBrands,
    getUser,
    getUserReviews,
    getSnackReviews
};