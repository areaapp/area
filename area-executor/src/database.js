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

    async _request(req) {
        const client = await this._pool.connect();
        const res = await client.query(req);
        client.release();
        return res;
    }

    async _getAllFrom(table) {
        try {
            const res = await this._request(`SELECT * FROM ${table}`);
            return res;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async getAreas() {
        return await this._getAllFrom('areas');
    }

    end() {
        this._pool.end();
    }
}
