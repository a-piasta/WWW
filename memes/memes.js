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
    },
    {
        'id': 7,
        'name': 'OSU',
        'price': 727,
        'url': 'https://preview.redd.it/ano80gm7odj51.png?width=1000&auto=webp&s=1c31272a478f44f57f24edc3515ac72a1747e0cc'
    }
]

class Meme {
    constructor(memeProps) {
        this.id = memeProps.id;
        this.name = memeProps.name;
        this.url = memeProps.url;

        this._price = memeProps.price;
        this._priceHistory = [this._price];
    }

    get price() {
        return this._price;
    }

    get priceHistory() {
        return [...this._priceHistory].reverse();
    }

    change_price(newPrice) {
        this._priceHistory.push(newPrice);
        this._price = newPrice;
    }
}

class Memes {
    constructor() {
        this.memes = mostExpensive.map(x => new Meme(x));
    }

    get mostExpensive() {
        this.memes.sort((a, b) => b.price - a.price);
        return this.memes.slice(0, 3);
    }

    get_meme(id) {
        const meme = this.memes.filter(value => value.id === +id);
        return meme ? meme[0] : null;
    }
}

module.exports = Memes;
