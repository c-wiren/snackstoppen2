const API_URL = 'https://apiv2.snackstoppen.se';
const STATIC_URL = 'https://static.snackstoppen.se/snackstoppen';

import Client from '@c-wiren/safe-router/client';

import type { Schema } from './schema/schema';
import type * as Types from './schema/types';
import type { GetSnacksParams } from './schema/input-types';

const client = Client<Schema>(API_URL);

type Replace<T, U> = Omit<T, keyof U> & U;

type Snack = Replace<Types.Snack, {
    image?: {
        sm: string;
        lg: string;
    };
}>;

type Brand = Replace<Types.Brand, {
    image?: {
        sm: string;
        lg: string;
    };
}>;

type Store = {
    snacks: Record<string, Snack>;
    brands: Record<string, Brand>;
};

const defaultStore = () => ({ snacks: {}, brands: {} });

const store: Store = reactive(defaultStore());

function onFetchSnack(snack: Types.Snack): Snack {
    let image;
    if (snack.image) {
        image = {
            sm: `${STATIC_URL}/sm/snacks/${snack.image}.webp`,
            lg: `${STATIC_URL}/snacks/${snack.image}.webp`
        };
    }
    const brandSlug = `${snack.brand?.id}/${snack.slug}`;
    store.snacks[brandSlug] = Object.assign(store.snacks[brandSlug] ?? {}, snack, { image });
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

const mockUser = {
    id: 0,
    username: "chipsfantast1",
    created: Date.now(),
    followers: 5,
    following: 3,
};
const mockReview = {
    id: 0,
    snack: null,
    rating: 8,
    user: mockUser,
    review: "Sveriges stolthet",
    created: Date.now(),
    likes: 4,
};

async function getBrands() {
    if (store.brands.length) { return store.brands; }
    const result = await client('getBrands', undefined);
    if (result.ok) {
        for (let i = 0; i < result.value.length; i++) {
            const brand = result.value[i];
            onFetchBrand(brand);
        }
        return store.brands;
    }
    else { throw result.error.error; }
}

async function getBrand(brand: string) {
    getBrands();
    return store.brands[brand];
}

async function getSnacks(params: GetSnacksParams = {}) {
    let result = await client('getSnacks', params);
    let snacks: Snack[] = [];
    if (result.ok) {
        for (let i = 0; i < result.value.length; i++) {
            snacks.push(onFetchSnack(result.value[i]));
        }
        return snacks;
    } else { throw result.error.error; }
}

async function getSnack(brand: string, slug: string) {
    const brandSlug = `${brand}/${slug}`;
    if (store.snacks[brandSlug]) { return store.snacks[brandSlug]; }
    const result = await client('getSnack', { brand, slug });
    if (result.ok) {
        return onFetchSnack(result.value);
    }
    else { throw result.error.error; }
};

async function getUser(username: string) {
    return username === "chipsfantast1" ? mockUser : undefined;
}

async function getUserReviews(username: string) {
    return username === "chipsfantast1" ? [mockReview] : undefined;
}

async function getSnackReviews(brand: string, slug: string) {
    return brand === "olw" && slug === "sourcream-and-onion" ? [mockReview] : undefined;
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
