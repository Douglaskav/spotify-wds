const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const lyricsFinder = require('lyrics-finder');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: '',
    clientSecret: '', 
    refreshToken
  });

  spotifyApi.refreshAccessToken().then(
    (data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expiresIn
      });
    }).catch((err) => {
      console.log(err);
      res.sendStatus(400);;
    });  
});

app.post('/login', (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: '',
    clientSecret: '' 
  });

spotifyApi.authorizationCodeGrant(code)
  .then(data => {
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in
    })
  }).catch((e) => {
    console.log(e);
    res.sendStatus(400);
  })
});

app.get('/lyrics', async (req, res) => {
  const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No lyrics FOUND"
  res.json({ lyrics })
});

app.listen(3001);
