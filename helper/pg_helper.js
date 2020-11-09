const { Client } = require('pg');

class PgHelper {
    client;

    constructor() {
        this.client = new Client({
            user: 'judy',
            host: 'localhost',
            database: 'Flashcard',
            port: 5432
        });
    }
}

module.exports = PgHelper;