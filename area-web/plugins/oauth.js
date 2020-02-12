async function oauthConnect ({ $auth, store, app, query, params, redirect, route }) {
    const userAction = app.$cookies.get('userAction');
    const fUrl = app.$cookies.get('userActionFUrl');
    const sUrl = app.$cookies.get('userActionSUrl');
    const match = route.hash.match(/(access_token=)(\w+)/);
    const accessToken = match ? match[2] : undefined;

    store.dispatch('userAction/clear');

    switch (userAction) {
    case 'addService':
        try {
            await store.dispatch('user/addService', {
                service: params.service,
                authCode: query.code,
                accessToken
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
                    service: params.service,
                    authCode: query.code,
                    accessToken,
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

export default function (ctx, inject) {
    inject('oauthConnect', () => oauthConnect(ctx));
}
