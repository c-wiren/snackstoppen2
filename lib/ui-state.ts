// TODO: Improve this

type Store = {
    overlay: 'login' | 'search' | 'account' | 'signup' | null;
};

const defaultStore = () => ({ overlay: null });

const store: Store = reactive(defaultStore());

export default store;
