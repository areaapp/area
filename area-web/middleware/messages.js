export default function (ctx) {
    const err = ctx.store.state.messages.error;
    const success = ctx.store.state.messages.success;

    if (err) {
        ctx.areaErrors = [ err ];
        ctx.store.dispatch('messages/resetError');
    }

    if (success) {
        ctx.areaSuccess = success;
        ctx.store.dispatch('messages/resetSuccess');
    }
}
