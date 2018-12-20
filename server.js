const express = require('express');
const app = express();
const cors = require('cors');
const Auth = require('./autorisation');
const configuration = require('./configrdv.js');
const bodyParser = require('body-parser');
const port = 3000;

// api google calendar
const {google} = require('googleapis');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// api calendrier
function listEvents(auth) {
  return new Promise(function (resolve, reject) {

    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) {
        reject(err); 
        return;
      }
      resolve(res.data.items);

    });
  });
}
app.get('/api/calendar/events', function (req, res) {
  Auth.getToken((token) => {
    listEvents(token)
    .then((events) => {
      res.json(events);
    })
    .catch((err) => {
      res.status(500).json(err);
    })
  })
});

app.post('/contact', (req, res) => {
  configuration(req.body);
  res.status(200).send();
})

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }

  console.log(`Server is listening on ${port}`);
});