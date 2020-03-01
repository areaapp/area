function getErrors ({ store }) {
    const err = store.state.messages.error;

    if (err) {
        store.dispatch('messages/resetError');

        return [ err ];
    }
    return [];
}

function getSuccess ({ store }) {
    const success = store.state.messages.success;

    if (success) {
        store.dispatch('messages/resetSuccess');
        return success;
    }
    return null;
}

export default function (ctx, inject) {
    inject('getErrors', () => getErrors(ctx));
    inject('getSuccess', () => getSuccess(ctx));
}
