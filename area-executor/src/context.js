'use strict';

import Notifier from './notifier.js';

export default class Context {
    constructor({ axios, db, workers, minAreas, dbConfig }) {
        this._axios = axios;
        this.workers = workers;
        this.minAreas = minAreas;
        this.dbConfig = dbConfig;
        this.db = db;
        this.notifier = new Notifier(this);
        this.services = [];
    }

    /**
     * @function _get
     * GET HTTP request to Area API
     *
     * @param {String} route
     * @return {Promise}
     */
    async _get(route) {
        try {
            const { data } = await this._axios.get(route);

            return data;
        } catch (e) {
            throw new Error(`Request to Area API failed.\n${e.message}`);
        }
    }

    /**
     * @function init
     * Initialize context by getting required informations
     *
     * @return {Promise}
     */
    async init() {
        const services = await this._get('/services');

        if (services.status === 'success') {
            this.services = services.data;
        }
    }
}
