export const state = () => ({
    services: [],
    areas: []
});

export const mutations = {
    setServices (state, value) {
        state.services = value;
    },

    setAreas (state, value) {
        state.areas = value;
    }
};

export const actions = {
    async nuxtServerInit ({ commit }, { $axios, $auth, app }) {
        console.log('Logged in:', $auth.loggedIn);
        if ($auth.loggedIn) {
            const resServices = await $axios.$get('/me/services');

            if (resServices.status === 'success') {
                commit('setServices', resServices.data);
            }
        }
    }
};
