const express = require('express');
const app = express();
const cors = require('cors');
const Auth = require('./autorisation');
const configuration = require('./configrdv.js');
const bodyParser = require('body-parser');
const port = 3000;

// api google calendar
const { google } = require('googleapis');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const calendar = google.calendar({ version: 'v3' });

// api calendrier
function listEvents(auth) {
  return new Promise(function (resolve, reject) {

    // addEvents(auth, calendar); // Add events
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
// Add events
// function addEvents(auth, calendar){
//   calendar.events.insert({
//     auth: auth,
//     calendarId: 'primary',
//     resource: {
//       'summary': 'formulaire.sujet',
//       'description': 'Sample description',
//       'start': {
//         'dateTime': '2018-12-21T08:00:00',
//         'timeZone': 'GMT',
//       },
//       'end': {
//         'dateTime': '2018-12-21T09:00:00',
//         'timeZone': 'GMT',
//       },
//     },
//   }, function(err, res) {
//     if (err) {
//       console.log('Error: ' + err);
//       return;
//     }
//     console.log(res);
//   });
// }
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

app.post('/contact', async (req, res) => {
  Auth.getToken(async (token) => {
    try {
      const event = await calendar.events.insert({
        auth: token,
        calendarId: 'primary',
        resource: {
            summary: req.body.sujet,
            description: 'Hackaton two',
            start: {
            dateTime: '2018-12-21T18:00:00Z',
            // timeZone: 'GMT',
          },
          end: {
            dateTime: '2018-12-21T19:00:00Z',
            // timeZone: 'GMT',
            },
          },
        bodyRequest: req.body
      });
      configuration(req.body);
      res.status(200).json(event);
    } catch (err) {
      res.end(500).send(err.message);
    }
  })
})

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }

  console.log(`Server is listening on ${port}`);
});