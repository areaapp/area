import { Pool } from 'pg';


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

    async tryConnection() {
        const client = await this._pool.connect();
        client.release();
    }

    async _request(req) {
        const client = await this._pool.connect();
        const res = await client.query(req);
        client.release();
        return res;
    }

    async _selectAllFrom(table) {
        try {
            const res = await this._request(`SELECT * FROM ${table}`);
            return res;
        } catch (e) {
            console.error('Request to database failed.');
            throw e;
        }
    }

    async _selectAllFromWhere(table, condition) {
        try {
            const res = await this._request(`SELECT * FROM ${table} WHERE ${condition}`);
            return res;
        } catch (e) {
            console.error('Request to database failed.');
            throw e;
        }
    }

    async getAreas() {
        let areas = [];
        const _areas = await this._selectAllFrom('areas');
        if (_areas.rows.length > 0) {
            let relatedActions = [];
            let relatedReactions = [];

            for (const a of _areas.rows) {
                relatedActions.push(`id = ${a.action_id}`);
                relatedReactions.push(`id = ${a.reaction_id}`);
            }

            const actions = await this._selectAllFromWhere('actions', relatedActions.join(' OR '));
            const reactions = await this._selectAllFromWhere('reactions', relatedReactions.join(' OR '));

            for (const a of _areas.rows) {
                const action = actions.rows.find(x => x.id === a.action_id);
                const reaction = actions.rows.find(x => x.id === a.reaction_id);

                areas.push({
                    id: a.id,
                    userId: a.user_id,
                    name: a.name,
                    lastExecution: a.last_execution,
                    action,
                    reaction
                });
            }
        }

        return areas;
    }

    end() {
        this._pool.end();
    }
}
