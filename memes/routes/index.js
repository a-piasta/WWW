var express = require('express');
var Memes = require('../memes.js');
var router = express.Router();

const memes = new Memes();
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Meme market',
    message: 'Hello there!',
    memes: memes.mostExpensive
  })
});

router.get('/meme/:memeId', function (req, res) {
  let meme = memes.get_meme(req.params.memeId);
  if (!meme) res.status(404).send('No such meme');
  res.render('meme', { meme: meme })
});

router.use(express.urlencoded({
  extended: true
})); 


router.post('/meme/:memeId', function (req, res) {
  let meme = memes.get_meme(req.params.memeId);
  if (!meme) {
    res.status(404).send('No such meme');
  }
  let price = req.body.price;
  meme.change_price(price);
  console.log(req.body.price);
  res.render('meme', { meme: meme })
})
  
module.exports = router;
