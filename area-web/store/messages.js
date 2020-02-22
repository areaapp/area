export const state = () => ({
    error: null,
    success: null
});

export const mutations = {
    setSuccess (state, value) {
        state.success = value;
    },

    clearSuccess (state) {
        state.success = null;
    },

    setError (state, message) {
        state.error = { message };
    },

    clearError (state) {
        state.error = null;
    }
};

export const actions = {
    setError ({ commit }, msg) {
        this.app.$cookies.set('areaError', msg);
        commit('setError', msg);
    },

    resetError ({ commit }, msg) {
        this.app.$cookies.remove('areaError');
        commit('clearError');
    },

    setSuccess ({ commit }, value) {
        this.app.$cookies.set('areaSuccess', value);
        commit('setSuccess', value);
    },

    resetSuccess ({ commit }, msg) {
        this.app.$cookies.remove('areaSuccess');
        commit('clearSuccess');
    }
};
