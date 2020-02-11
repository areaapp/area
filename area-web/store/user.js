export const state = () => ({
    services: [],
    servicesNb: 0,
    areas: []
});

export const mutations = {
    setServices (state, value) {
        state.services = value;
        state.servicesNb = Object.keys(value).length;
    },

    addService (state, service) {
        state.services[service.name] = service;
        state.servicesNb += 1;
    },

    deleteService (state, serviceName) {
        // const services = state.services;

        delete state.services[serviceName];
        state.servicesNb -= 1;
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