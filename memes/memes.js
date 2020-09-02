const mostExpensive = [
    {
        'id': 10,
        'name': 'Gold',
        'price': 1000,
        'url': 'https://i.redd.it/h7rplf9jt8y21.png'
    },
    {
        'id': 9,
        'name': 'Platinum',
        'price': 1100,
        'url': 'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg'
    },
    {
        'id': 8,
        'name': 'Elite',
        'price': 1200,
        'url': 'https://i.imgflip.com/30zz5g.jpg'
    }
]

class Meme {
    constructor(memeProps) {
        this.id = memeProps.id;
        this.name = memeProps.name;
        this.url = memeProps.url;
        this._price = memeProps.price;
    }

    get price() {
        return this._price;
    }
}

class DbMemes {
    constructor(db) {
        this._db = db;
        this._db.init.then(() => {
            Promise.all(mostExpensive.map(meme => this._db.addMeme(
                meme.name, meme.price, meme.url, meme.id
            ))).catch(err => console.error(err));
        });
    }

    async mostExpensive() {
        const memeRows = await this._db.getMostExpensiveMemes();
        console.log(memeRows);
        return memeRows.map(x => new Meme(x, this._db));
    }

    async getById(id) {
        let meme = null;
        try {
            meme = await this._db.getMemeById(id);
        } catch (err) {
            console.log(err);
        }
        return meme;
    }

    async getPriceHistoryById(id) {
        return await this._db.getMemePricesById(id);
    }

    async addNewMemePrice(id, userId, price) {
        return await this._db.addNewMemePrice(id, userId, price);
    }
}

module.exports = DbMemes;
