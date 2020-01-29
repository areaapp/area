export default async function ({ $auth, app, store, query, params, redirect }) {
    const userAction = app.$cookies.get('userAction');
    const url = app.$cookies.get('userActionUrl');

    app.$cookies.remove('userAction');
    app.$cookies.remove('userActionUrl');

    switch (userAction) {
    case 'addService':
        // add service and redirect
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
            redirect(url, { error: e.message });
        }
        break;
    }
}
