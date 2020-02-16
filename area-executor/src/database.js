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

    async getAreas() {
        const result = await this._request('SELECT * FROM areas');

        console.log(result.rows);
    }

    end() {
        this._pool.end();
    }
}
