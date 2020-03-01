export const state = () => ({
    services: [],
    servicesNb: 0,
    pageTitle: '',
    darkTheme: false,
    error: null
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
    },

    setError (state, message) {
        state.error = { message };
    },

    clearError (state) {
        state.error = null;
    }
};

export const actions = {
    async nuxtServerInit ({ commit, dispatch }, { $axios, $auth, app, route }) {
        // Get services
        const resServices = await $axios.$get('/services');

        if (resServices.status === 'success') {
            commit('setServices', resServices.data);
        }

        // Get dark theme mode
        const dark = app.$cookies.get('darkTheme') || false;
        commit('setDarkTheme', dark);

        // Get error
        const errorMsg = app.$cookies.get('areaError');
        if (errorMsg) {
            commit('messages/setError', errorMsg);
        }

        // Get success
        const success = app.$cookies.get('areaSuccess');
        if (success) {
            commit('messages/setSuccess', success);
        }

        await dispatch('initUser');
    },

    async initUser ({ dispatch }) {
        if (this.$auth.loggedIn) {
            await dispatch('user/getServices');
            await dispatch('user/getAreas');
            await dispatch('user/getNotifications');

            dispatch('user/setAvatar', this.$auth.user.avatar);
        }
    },

    async pollData ({ dispatch }) {
        await dispatch('user/getNotifications');
        await dispatch('user/getAreas');
    },

    setDarkTheme ({ commit }, value) {
        this.app.$cookies.set('darkTheme', value, {
            maxAge: 315360000
        });
        commit('setDarkTheme', value);
    }
};
