export const state = () => ({
    action: '',
    successUrl: '',
    failureUrl: ''
});

export const mutations = {
    setAction (state, value) {
        state.action = value;
    },

    setSuccessUrl (state, value) {
        state.successUrl = value;
    },

    setFailureUrl (state, value) {
        state.failureUrl = value;
    },

    clear (state) {
        state.action = '';
        state.successUrl = '';
        state.failureUrl = '';
    }
};

export const actions = {
    setAction ({ commit }, action) {
        this.app.$cookies.set('userAction', action);
        commit('setAction', action);
    },

    setSuccessUrl ({ commit }, url) {
        this.app.$cookies.set('userActionSUrl', url);
        commit('setSuccessUrl', url);
    },

    setFailureUrl ({ commit }, url) {
        this.app.$cookies.set('userActionFUrl', url);
        commit('setFailureUrl', url);
    },

    setUrl ({ dispatch }, url) {
        dispatch('setSuccessUrl', url);
        dispatch('setFailureUrl', url);
    },

    clear ({ commit }) {
        this.app.$cookies.remove('userActionSUrl');
        this.app.$cookies.remove('userActionFUrl');
        this.app.$cookies.remove('userAction');
        commit('clear');
    }
};
