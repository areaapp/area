export default async function ({ $auth, store, app, query, params, redirect }) {
    const userAction = app.$cookies.get('userAction');
    const url = app.$cookies.get('userActionUrl');

    app.$cookies.remove('userAction');
    app.$cookies.remove('userActionUrl');

    switch (userAction) {
    case 'addService':
        try {
            await store.dispatch('user/addService', {
                name: params.service,
                authCode: query.code
            });
            const displayName = store.state.services[params.service].displayName;

            store.dispatch('messages/setSuccess', `${displayName} successfully added !`);
            redirect(url);
        } catch (e) {
            store.dispatch('messages/setError', e.response.data.message);
            redirect(url);
        }
        break;
    default:
        try {
            await $auth.loginWith('oauth', {
                data: {
                    authCode: query.code,
                    service: params.service,
                    clientType: 'web'
                }
            });
            store.dispatch('messages/setSuccess', `Hi ${$auth.user.username} !`);
            redirect(url);
        } catch (e) {
            store.dispatch('messages/setError', e.response.data.message);
            redirect(url);
        }
        break;
    }
}
