const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Hasher = require('../auth');
const DatabaseWrapper = require('../db');
const Memes = require('../memes');

// Setup route middlewares.
const csrfProtection = csrf({cookie: true});
const parseForm = bodyParser.urlencoded({extended: false});

const db = new DatabaseWrapper();
const memes = new Memes(db);
const hasher = new Hasher();

// Authentication middleware initialization.
passport.use(new LocalStrategy(
    {usernameField: 'login', passwordField: 'pass'},
    function (username, password, done) {
        db.getUserByName(username).then(user => {
            if (!user)
                return done(null, false);
            hasher.comparePass(password, user.pass).then(good => {
                return done(null, good ? user : false);
            }).catch(err => {
                return done(err);
            })
        }).catch(err => {
            return done(err);
        });
    }));

// Authentication middleware for protected routes.
function requireAuth(req, res, next) {
    return req.isAuthenticated() ? next() : res.redirect('/login');
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    const user = await db.getUserById(id);
    return done(null, user || false);
});

router.use(function (req, res, next) {
  const get = Number(req.method === 'GET');
  if (req.session.views)
      req.session.views += get;
  else
      req.session.views = get;
  res.locals.views = req.session.views;
  next();
});

// User object for templates.
router.use(function (req, res, next) {
  res.locals.username = req.user ? req.user.login : null;
  next();
});

// Login and register routes.
router.get('/register', csrfProtection, function (req, res) {
  return res.render('login', {
      title: 'Zarejestruj się',
      redirectRoute: '/register',
      csrfToken: req.csrfToken()
  });
});

router.post('/register', parseForm, csrfProtection, async function (req, res, next) {
  const username = req.body.login;
  const userExists = await db.getUserByName(username);
  if (userExists) return next(createError(422, 'Username busy'));

  try {
      const passHash = await hasher.generateHash(req.body.pass);
      await db.addNewUser(username, passHash);
  } catch (err) {
      return next(createError(500, err));
  }
  return res.redirect('/login');
});

router.get('/login', csrfProtection, function (req, res) {
  return res.render('login', {
      title: 'Zaloguj się',
      redirectRoute: '/login',
      csrfToken: req.csrfToken()
  });
});

router.post('/login', parseForm, csrfProtection,
  passport.authenticate(
      'local', {session: true, failureRedirect: '/login'}
  ),
  function (req, res) {
      return res.redirect('/');
  });

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

/* GET home page. */
router.get('/', async function(req, res) {
  const mostExpensive = await memes.mostExpensive();
  res.render('index', {
    title: 'Meme market',
    message: 'Hello there!',
    memes: mostExpensive
  })
});

router.get('/meme/:memeId', csrfProtection, async function (req, res) {
  let memeId = Number(req.params.memeId);
  let meme = await memes.getById(memeId);
  if (!meme) res.status(404).send('No such meme');
  const history = await memes.getPriceHistoryById(memeId);
  res.render('meme', {
    meme: meme,
    priceHistory: history,
    csrfToken: req.csrfToken() })
});

router.use(express.urlencoded({
  extended: true
})); 

router.post('/meme/:memeId', parseForm, csrfProtection,
    requireAuth,
    async function (req, res) {
        if (req.body.price === '')
            return res.status(422).send('No new price provided');
        const memeId = Number(req.params.memeId);
        let meme = await memes.getById(Number(req.params.memeId));
        if (!meme) {
            res.status(404).send('No such meme');
        }
        const newPrice = Number(req.body.price);
        await memes.addNewMemePrice(memeId, req.user.id, newPrice);
        const newHistory = await memes.getPriceHistoryById(memeId);
        res.render('meme', {meme: meme, priceHistory: newHistory,
            csrfToken: req.csrfToken()});
    });

module.exports = router;
