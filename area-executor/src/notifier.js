export default class Notifier {
    constructor(ctx) {
        this._context = ctx;
    }

    async notifie(userId, message, status) {
        await this._context.db.createNotification(userId, message, status);
    }
};
