import Identicon from 'identicon.js';

export const state = () => ({
    services: [],
    servicesNb: 0,
    areas: [],
    avatar: null,
    notifications: []
});

export const mutations = {
    setServices (state, value) {
        state.services = value;
        state.servicesNb = Object.keys(value).length;
    },

    addService (state, service) {
        const obj = Object.assign({}, state.services);
        obj[service.name] = service;
        state.services = obj;
        state.servicesNb += 1;
    },

    deleteService (state, serviceName) {
        delete state.services[serviceName];
        state.servicesNb -= 1;
    },

    setAreas (state, value) {
        state.areas = value;
    },

    addArea (state, area) {
        state.areas.push(area);
    },

    updateArea (state, area) {
        const i = state.areas.findIndex(a => a.id === area.id);
        Object.assign(state.areas[i], area);
    },

    deleteArea (state, id) {
        const i = state.areas.findIndex(a => a.id === id);
        state.areas.splice(i, 1);
    },

    setAvatar (state, value) {
        state.avatar = value;
    },

    setNotifications (state, value) {
        state.notifications = value;
    },

    setNotification (state, notif) {
        const i = state.notifications.findIndex(n => n.id === notif.id);
        Object.assign(state.notifications[i], notif);
    },

    deleteNotification (state, id) {
        const i = state.notifications.findIndex(n => n.id === id);
        state.notifications.splice(i, 1);
    }
};

export const actions = {
    async updateUsername (_, username) {
        const resUser = await this.$axios.$put('/me', { username });

        if (resUser.status === 'success') {
            await this.$auth.fetchUser();
        }
    },

    async updatePassword (_, password) {
        const resUser = await this.$axios.$put('/me', { password });

        if (resUser.status === 'success') {
            await this.$auth.fetchUser();
        }
    },

    async getNotifications ({ commit }) {
        const resNotifs = await this.$axios.$get('/me/notifications');

        if (resNotifs.status === 'success') {
            commit('setNotifications', resNotifs.data);
        }
    },

    async readNotification ({ commit }, id) {
        const resNotif = await this.$axios.$put(`/me/notification/${id}`);

        if (resNotif.status === 'success') {
            commit('setNotification', resNotif.data);
        }
    },

    async deleteNotification ({ commit }, id) {
        const resNotif = await this.$axios.$delete(`/me/notification/${id}`);

        if (resNotif.status === 'success') {
            commit('deleteNotification', id);
        }
    },

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

    async addArea ({ commit }, area) {
        const resArea = await this.$axios.$post(`/me/area`, area);

        if (resArea.status === 'success') {
            commit('addArea', resArea.data);
        }
    },

    async updateArea ({ commit }, { id, action_args, reaction_args, name }) { //eslint-disable-line
        const resArea = await this.$axios.$put(`/me/area/${id}`, {
            action_args,
            reaction_args,
            name
        });

        if (resArea.status === 'success') {
            commit('updateArea', resArea.data);
        }
    },

    async deleteArea ({ commit }, id) {
        const resArea = await this.$axios.$delete(`/me/area/${id}`);

        if (resArea.status === 'success') {
            commit('deleteArea', id);
        }
    },

    async addService ({ commit }, { name, authCode, accessToken }) { //eslint-disable-line
        const resService = await this.$axios.$post(`/me/services/${name}`, {
            authCode,
            accessToken,
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
    },

    setAvatar ({ commit }, value) {
        const identIcon = new Identicon(value, 500).toString();
        const avatar = `data:image/png;base64,${identIcon}`;

        commit('setAvatar', avatar);
    }
};
