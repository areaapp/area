export const state = () => ({
    userAction: null
});

export const mutations = {
    set (state, value) {
        state.userAction = value;
    },

    clear (state) {
        state.userAction = null;
    }
};
