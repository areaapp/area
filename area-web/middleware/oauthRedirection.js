export default async function ({ params, app, redirect, store, $axios }) {
    const res = await $axios.$get(`/auth/oauth/authorize_url/${params.service}/web`);
    const redirectUri = res.data;
    const userAction = store.state.userAction.action;
    const url = store.state.userAction.url;

    app.$cookies.set('userAction', userAction);
    app.$cookies.set('userActionUrl', url);

    redirect(redirectUri);
}
