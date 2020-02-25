export default class Notifier {
    constructor(ctx) {
        this._context = ctx;
    }

    async notifie(userId, message) {
        await this._context.db.createNotification(userId, message);
    }
};
