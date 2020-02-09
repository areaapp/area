export const state = () => ({
    services: [],
    servicesNb: 0,
    pageTitle: '',
    darkTheme: false
});

export const mutations = {
    setServices (state, value) {
        state.services = value;
        state.servicesNb = Object.keys(value).length;
    },

    setTitle (state, value) {
        state.pageTitle = value;
    },

    setDarkTheme (state, value) {
        state.darkTheme = value;
    }
};

export const actions = {

    async nuxtServerInit ({ commit, dispatch }, { $axios, $auth, app }) {
        // Get services
        const resServices = await $axios.$get('/services');

        if (resServices.status === 'success') {
            commit('setServices', resServices.data);
        }

        // Get dark theme mode
        const dark = app.$cookies.get('darkTheme') || false;
        commit('setDarkTheme', dark);

        if ($auth.loggedIn) {
            await dispatch('user/getServices');
            await dispatch('user/getAreas');
        }
    },

    setDarkTheme ({ commit }, value) {
        this.app.$cookies.set('darkTheme', value);
        commit('setDarkTheme', value);
    }
};
