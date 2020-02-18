function getErrors ({ store }) {
    const err = store.state.messages.error;

    store.dispatch('messages/resetError');

    return [ err ];
}

function getSuccess ({ store }) {
    const success = store.state.messages.success;

    store.dispatch('messages/resetSuccess');

    return success;
}

export default function (ctx, inject) {
    inject('getErrors', getErrors);
    inject('getSuccess', getSuccess);
}
