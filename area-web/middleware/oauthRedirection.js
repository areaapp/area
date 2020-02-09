export default async function ({ params, redirect, store, $axios }) {
    try {
        const res = await $axios.$get(`/auth/oauth/authorize_url/${params.service}/web`);
        const redirectUri = res.data;
        redirect(redirectUri);
    } catch (e) {
        const fUrl = store.state.userAction.failureUrl;
        redirect(fUrl);
    }
}
