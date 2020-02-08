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
            redirect(url, { success: `Service ${params.service} successfully added.` });
        } catch (e) {
            redirect(url, { error: e.response.data.message });
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
            redirect(url, { success: 'connected' });
        } catch (e) {
            redirect(url, { error: e.response.data.message });
        }
        break;
    }
}
