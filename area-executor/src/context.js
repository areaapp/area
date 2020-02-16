import Notifier from './notifier.js';

export default class Context {
    constructor({ apiUrl, db }) {
        this._apiUrl = apiUrl;
        this.db = db;
        this.notifier = new Notifier(this);
    }
}
