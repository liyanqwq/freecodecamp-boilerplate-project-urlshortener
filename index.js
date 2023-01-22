require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Database = require("@replit/database")
const db = new Database()
const bodyParser = require('body-parser')
const dns = require('node:dns');
const URL = require("url").URL;
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());



app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', urlencodedParser, function(req, res) {
  let url = req.body.url;
  try {
    url = new URL(url);
  } catch (err) {
    res.json({ error: 'invalid url' });
    return;
  }
  dns.lookup(url.hostname, (err) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      db.list().then(keys => {
        let num = keys.length + 1;
        db.set(keys.length + 1, url).then(() => {
          res.json({ "original_url": url, "short_url": num });
        });
      });
    }
  });
});
app.get("/api/shorturl/:id", function(req, res) {
  db.get(req.params.id).then(value => {
    res.redirect(value);
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
