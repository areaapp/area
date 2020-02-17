import Notifier from './notifier.js';

export default class Context {
    constructor({ axios, db, workers, minAreas }) {
        this._axios = axios;
        this.workers = workers;
        this.minAreas = minAreas;
        this.db = db;
        this.notifier = new Notifier(this);
        this.services = [];
    }

    async _get(route) {
        try {
            const { data } = await this._axios.get('/services');

            return data;
        } catch (e) {
            console.error('Request to Area API failed:', e.message);
            throw e;
        }
    }

    async init() {
        const services = await this._get('/services');

        if (services.status === 'success') {
            this.services = services.data;
        }
    }
}
