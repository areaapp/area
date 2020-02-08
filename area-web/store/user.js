export const state = () => ({
    services: [],
    areas: []
});

export const mutations = {
    setServices (state, value) {
        state.services = value;
    },

    addService (state, service) {
        state.services.push(service);
    },

    setAreas (state, value) {
        state.areas = value;
    }
};

export const actions = {
    async getServices ({ commit }) {
        const resServices = await this.$axios.$get('/me/services');

        if (resServices.status === 'success') {
            commit('setServices', resServices.data);
        }
    },

    async getAreas ({ commit }) {
        const resAreas = await this.$axios.$get('/me/area');

        if (resAreas.status === 'success') {
            commit('setAreas', resAreas.data);
        }
    }
};
