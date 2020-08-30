var express = require('express');
var Memes = require('../memes.js');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

const memes = new Memes();
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Meme market',
    message: 'Hello there!',
    memes: memes.mostExpensive
  })
});

router.get('/meme/:memeId', csrfProtection, function (req, res) {
  let meme = memes.get_meme(req.params.memeId);
  if (!meme) res.status(404).send('No such meme');
  res.render('meme', {
    meme: meme,
    csrfToken: req.csrfToken() })
});

router.use(express.urlencoded({
  extended: true
})); 


router.post('/meme/:memeId', csrfProtection, function (req, res) {
  let meme = memes.get_meme(req.params.memeId);
  if (!meme) {
    res.status(404).send('No such meme');
  }
  let price = req.body.price;
  meme.change_price(price);
  console.log(req.body.price);
  res.redirect('/meme/' + req.params.memeId);
});

module.exports = router;
