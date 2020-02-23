import { Pool } from 'pg';

import { unique }  from './utils.js';


export default class Database {
    constructor({ host, port, name, user, pass }) {
        this._pool = new Pool({
            user,
            host,
            port,
            database: name,
            password: pass
        });
    }

    /**
     * @function tryConnection
     * Try to etablishing connection with db
     * throw an error if failed
     *
     * @return {Promise}
     */
    async tryConnection() {
        try {
            const client = await this._pool.connect();
            client.release();
        } catch (e) {
            throw new Error(`Connection to database failed.\n${e.message}`);
        }
    }

    /**
     * @function _request
     * Make a raw request to a postgres database
     *
     * @param {String} req - Raw request
     * @return {Promise}
     */
    async _request(req) {
        try {
            const client = await this._pool.connect();
            const res = await client.query(req);
            client.release();
            return res;
        } catch (e) {
            throw new Error(`Request to database failed.\n${e.message}`);
        }
    }

    /**
     * @function _selectAllFrom
     * SELECT * FROM `table`
     *
     * @param {String} table - Name of table
     * @return {Promise}
     */
    async _selectAllFrom(table) {
        const res = await this._request(`SELECT * FROM ${table}`);
        return res;
    }

    /**
     * @function _selectAllFromWhere
     * SELECT * FROM `table` WHERE `condition`
     *
     * @param {String} table - Name of table
     * @param {String} condition - Selection condition
     * @return {Promise}
     */
    async _selectAllFromWhere(table, condition) {
        const res = await this._request(`SELECT * FROM ${table} WHERE ${condition}`);
        return res;
    }

    /**
     * @function _updateWhere
     * UPDATE `table` SET `column` = `value` WHERE `condition`
     *
     * @param {String} table - Name of table
     * @param {String} condition - Selection condition
     * @return {Promise}
     */
    async _updateWhere(table, column, value, condition) {
        const res = await this._request(`UPDATE ${table} SET ${column} = '${value}' WHERE ${condition}`);

        return res;
    }

    /**
     * @function updateBuffer
     * Update buffer of an action
     *
     * @param {String} areaId
     * @param {String} value
     */
    async updateBuffer(actionId, value) {
        await this._updateWhere('actions', 'buffer', value, `id = ${actionId}`);
    }

    /**
     * @function getAreas
     * Get all areas from database
     *
     * @return {Promise}
     */
    async getAreas() {
        let areas = [];
        const _areas = await this._selectAllFrom('areas');
        if (_areas.rows.length > 0) {
            let relatedActions = [];
            let relatedReactions = [];
            let relatedUsers = [];

            for (const a of _areas.rows) {
                relatedActions.push(`id = ${a.action_id}`);
                relatedReactions.push(`id = ${a.reaction_id}`);
                relatedUsers.push(`id = ${a.user_id}`);
            }

            relatedActions = unique(relatedActions);
            relatedReactions = unique(relatedReactions);
            relatedUsers = unique(relatedUsers);

            const { actions, reactions } = await this.getActionsReactions(relatedActions, relatedReactions);
            const users = await this._selectAllFromWhere('users', relatedUsers.join(' OR '));

            for (const a of _areas.rows) {
                const action = actions.rows.find(x => x.id === a.action_id);
                const reaction = reactions.rows.find(x => x.id === a.reaction_id);
                const user = users.rows.find(x => x.id === a.user_id);

                areas.push({
                    id: a.id,
                    user,
                    name: a.name,
                    lastExecution: a.last_execution,
                    action,
                    reaction
                });
            }
        }

        return areas;
    }

    async getActionsReactions(relatedActions, relatedReactions) {
        const reactions = await this._selectAllFromWhere('reactions', relatedReactions.join(' OR '));
        const actions = await this._selectAllFromWhere('actions', relatedActions.join(' OR '));
        let relatedServices = [];

        actions.rows.forEach(a => relatedServices.push(`id = ${a.service_id}`));
        reactions.rows.forEach(r => relatedServices.push(`id = ${r.service_id}`));

        relatedServices = unique(relatedServices);

        const services = await this._selectAllFromWhere('services', relatedServices.join(' OR '));

        actions.rows.forEach(a => a.service = services.rows.find(s => s.id === a.service_id));
        reactions.rows.forEach(r => r.service = services.rows.find(s => s.id === r.service_id));

        return { actions, reactions };
    }

    end() {
        this._pool.end();
    }
}
