export const state = () => ({
    services: [],
    areas: []
});

export const mutations = {
    setServices (state, value) {
        state.services = value;
    },

    addService (state, service) {
        state.services[service.name] = service;
    },

    deleteService (state, serviceName) {
        const services = state.services;

        delete services[serviceName];
        state.services = services;
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
        const resAreas = await this.$axios.$get('/me/areas');

        if (resAreas.status === 'success') {
            commit('setAreas', resAreas.data);
        }
    },

    async addService ({ commit }, { name, authCode }) {
        const resService = await this.$axios.$post(`/me/services/${name}`, {
            name,
            authCode,
            clientType: 'web'
        });

        if (resService.status === 'success') {
            commit('addService', resService.data);
        }
    },

    async deleteService ({ commit }, name) {
        const resService = await this.$axios.$delete(`/me/services/${name}`);

        if (resService.status === 'success') {
            commit('deleteService', name);
        }
    }
};
