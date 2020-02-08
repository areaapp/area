export const state = () => ({
    services: [],
    pageTitle: '',
    darkTheme: false
});

export const mutations = {
    setServices (state, value) {
        state.services = value;
    },

    setTitle (state, value) {
        state.pageTitle = value;
    },

    setDarkTheme (state, value) {
        state.darkTheme = value;
    }
};

export const actions = {
    async nuxtServerInit ({ commit }, { $axios, app }) {
        // Get services
        const resServices = await $axios.$get('/services');

        if (resServices.status === 'success') {
            commit('setServices', resServices.data);
        }

        // Get dark theme mode
        const dark = app.$cookies.get('darkTheme') || false;
        commit('setDarkTheme', dark);
    },

    setDarkTheme ({ commit }, value) {
        this.app.$cookies.set('darkTheme', value);
        commit('setDarkTheme', value);
    }
};
