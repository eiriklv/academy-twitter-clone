require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('build'));

const port = process.env.PORT;
const secret = process.env.SECRET;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function getTweets() {
  return pool.query(`
    SELECT
      tweets.id,
      tweets.message,
      tweets.created_at,
      users.name,
      users.handle
    FROM
      tweets
    INNER JOIN users ON
      tweets.user_id = users.id
    ORDER BY created_at DESC
  `)
  .then(({ rows }) => rows);
}

function createTweet(message, userId) {
  return pool.query(`
    INSERT INTO tweets
      (message, user_id)
    VALUES
      ($1, $2)
    RETURNING
      *
  `, [message, userId])
  .then(({ rows }) => rows[0]);
}

function getUserByHandle(handle) {
  return pool.query(`
    SELECT * FROM users WHERE handle = $1
  `, [handle])
  .then(({ rows }) => rows[0]);
}

const api = express();

api.get('/session', authenticate, function (req, res) {
  res.send({ message: 'You are authenticated' });
})

api.post('/session', async function (req, res) {
  const { handle, password } = req.body;
  try {
    const user = await getUserByHandle(handle);
    console.log({ user, handle })

    if (!user) {
      return res.status(401).send({ error: 'Unknown user' });
    }

    if (user.password !== password) {
      return res.status(401).send({ error: 'Wrong password' });
    }

    const token = jwt.sign({
      id: user.id,
      handle: user.handle,
      name: user.name
    }, new Buffer(secret, 'base64'));

    res.send({
      token: token
    });
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
});

function authenticate(req, res, next) {
  const token = req.headers['x-auth-token'];

  try {
    const { id, name, handle } = jwt.verify(
      token,
      new Buffer(secret, 'base64')
    );

    req.user = { id, name, handle };
    next();
  } catch (error) {
    res.status(401).send({
      error: 'Unable to authenticate - please use a valid token'
    });
  }
}

api.post('/tweets', authenticate, async function(req, res) {
  const { id } = req.user;
  const { message } = req.body;

  const newTweet = await createTweet(message, id);
  res.send(newTweet);
});

api.get('/tweets', async function (req, res) {
  const tweets = await getTweets();
  res.send(tweets);
});

app.use('/api', api);

app.listen(port, () => {
  console.log('Twitter API running on http://localhost:3333');
});
