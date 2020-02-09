export default async function ({ $auth, store, app, query, params, redirect }) {
    const userAction = app.$cookies.get('userAction');
    const fUrl = app.$cookies.get('userActionFUrl');
    const sUrl = app.$cookies.get('userActionSUrl');

    store.dispatch('userAction/clear');

    switch (userAction) {
    case 'addService':
        try {
            await store.dispatch('user/addService', {
                name: params.service,
                authCode: query.code
            });
            const displayName = store.state.services[params.service].displayName;

            store.dispatch('messages/setSuccess', `${displayName} successfully added !`);
            redirect(sUrl);
        } catch (e) {
            store.dispatch('messages/setError', e.response.data.message);
            redirect(fUrl);
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
            redirect(sUrl);
        } catch (e) {
            store.dispatch('messages/setError', e.response.data.message);
            redirect(fUrl);
        }
        break;
    }
}
