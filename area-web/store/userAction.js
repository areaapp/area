export const state = () => ({
    action: '',
    url: ''
});

export const mutations = {
    setAction (state, value) {
        state.action = value;
    },

    setUrl (state, value) {
        state.url = value;
    },

    clear (state) {
        state.action = null;
    }
};
