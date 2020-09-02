const util = require('util');
const sqlite3 = require('sqlite3').verbose();
const {DB_PATH} = require('./config');

class DatabaseWrapper {
    constructor() {
        this.init = new Promise(((resolve, reject) => {
            this._db = new sqlite3.Database(DB_PATH, (err) => {
                if (err) console.error(err);

                this._promisifiedRun(
                    'CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, login TEXT, pass TEXT);')
                    .then(() => this._promisifiedRun('CREATE TABLE memes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, url TEXT);'))
                    .then(() => this._promisifiedRun(`CREATE TABLE prices (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                meme_id INTEGER NOT NULL, user_id INTEGER NOT NULL, price INTEGER NOT NULL,
                                FOREIGN KEY (meme_id) REFERENCES memes (id),
                                FOREIGN KEY (user_id) REFERENCES users (id));`))
                    .then(resolve).catch(reject);
            });
        }));
    }

    _promisifiedDbFun(fun) {
        return (stmt, paramsValues) =>
            util.promisify(fun).bind(this._db)(stmt, paramsValues);
    }

    _promisifiedRun(stmt, paramsValues=[]) {
        return this._promisifiedDbFun(this._db.run)(stmt, paramsValues);
    }

    _promisifiedGet(stmt, paramsValues=[]) {
        return this._promisifiedDbFun(this._db.get)(stmt, paramsValues);
    }

    _promisifiedAll(stmt, paramsValues=[]) {
        return this._promisifiedDbFun(this._db.all)(stmt, paramsValues);
    }

    addNewUser(username, pass) {
        const stmt = 'INSERT INTO users (login, pass) VALUES (?, ?)'
        return this._promisifiedRun(stmt, [username, pass]);
    }

    getUserByName(username) {
        const stmt = 'SELECT * FROM users WHERE login=?';
        return this._promisifiedGet(stmt, [username]);
    }

    getUserById(id) {
        const stmt = 'SELECT * FROM users WHERE id=?';
        return this._promisifiedGet(stmt, [id]);
    }

    addMeme(name, price, url, id=null) {
        const memeInsert = `INSERT INTO memes (${id ? 'id,' : ''} name, url) VALUES
                       (${id ? '?, ' : ''} ?, ?);`;
        const priceInsert = `INSERT INTO prices (meme_id, user_id, price) VALUES
                            (?, ?, ?);`;

        const params = id ? [id, name, url] : [name, url];
        return this._promisifiedRun(memeInsert, params).then(() =>
            this._promisifiedRun(priceInsert, [id, 0, price])
        );
    }

    getMostExpensiveMemes() {
        const stmt = `SELECT memes.*, prices.price FROM memes JOIN prices ON memes.id = prices.meme_id
                      GROUP BY (prices.meme_id) HAVING prices.id = MAX(prices.id) ORDER BY prices.price DESC;`;
        return this._promisifiedAll(stmt);
    }

    getMemeById(memeId) {
        const stmt = `SELECT memes.*, prices.price FROM memes JOIN prices ON memes.id = prices.meme_id
                      WHERE memes.id = ? GROUP BY (prices.meme_id) HAVING prices.id = MAX(prices.id);`;
        return this._promisifiedGet(stmt, [memeId]);
    }

    getMemePricesById(memeId) {
        const stmt = `SELECT price FROM prices WHERE meme_id = ? ORDER BY id DESC;`;
        return this._promisifiedAll(stmt, [memeId]);
    }

    addNewMemePrice(memeId, userId, price) {
        const stmt = `INSERT INTO prices (meme_id, user_id, price) VALUES (?, ?, ?);`;
        return this._promisifiedRun(stmt, [memeId, userId, price]);
    }
}


module.exports = DatabaseWrapper;
