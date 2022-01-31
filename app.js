const express = require('express');
const pino = require('express-pino-logger')();
require('dotenv').config()
const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);



const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(pino);

app.use(function (req, res, next) {
    var allowedOrigins = ['http://localhost:3000', 'https://localhost:3000', req.headers.origin || ""];
    var origin = req.headers.origin;
    console.log(origin, 'sm origin')
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin); // restrict it to the required domain
    }

    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});
/////////////////////////Create conversation Start/////////////////////////////////
app.post('/api/create-conversation', (req, res) => {
    res.header('Content-Type', 'application/json');
    client.conversations.conversations
        .create({
            friendlyName: req.body.conversationName
        })
        .then((data) => {
            console.log(data, 'conversation');
            res.send(JSON.stringify({
                success: true,
                data
            }));
        })
        .catch(err => {
            console.log(err);
            res.send(JSON.stringify({ success: false }));
        });

})
/////////////////////////Create conversation End/////////////////////////////////

/////////////////////////Retrieve all conversation Start/////////////////////////////////
app.get('/api/conversations', (req, res) => {
    res.header('Content-Type', 'application/json');
    client.conversations.conversations
        .list({ limit: req.body.limit })
        .then((data) => {
            // console.log(data);
            res.send(JSON.stringify({
                success: true,
                data
            }));
        })
        .catch(err => {
            // console.log(err);
            res.send(JSON.stringify({ success: false }));
        });
})
/////////////////////////Retrieve all conversation End/////////////////////////////////


/////////////////////////Retrieve Messages Start/////////////////////////////////
app.get('/api/retrieve-conversation/messages', (req, res) => {
    res.header('Content-Type', 'application/json');
    let resp
    client.messages.list(
        { sid: req.query.conversationSID }
    ).toJSON()

    console.log({ resp })
    return res.status(200).send({ success: true })
    // .then((data) => {
    //     console.log(data);
    //     res.send(JSON.stringify({
    //         success: true,
    //         data
    //     }));
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.send(JSON.stringify({ success: false }));
    // });
})
/////////////////////////Retrieve Messages End/////////////////////////////////



/////////////////////////Retrieve conversation Start/////////////////////////////////
app.get('/api/retrieve-conversation', (req, res) => {
    res.header('Content-Type', 'application/json');
    client.conversations.conversations(
        req.query.conversationSID
    ).messages
        .list()
        .then((data) => {
            // console.log(data);
            res.send(JSON.stringify({
                success: true,
                data
            }));
        })
        .catch(err => {
            // console.log(err);
            res.send(JSON.stringify({ success: false }));
        });
})
/////////////////////////Retrieve conversation End/////////////////////////////////



/////////////////////////Add participants Start/////////////////////////////////
app.post('/api/add-participants', (req, res) => {
    res.header('Content-Type', 'application/json');
    client.conversations.conversations(
        req.query.conversationSID
    )
        .participants
        .create({
            identity: req.body.conversationIdentity
        })
        .then(
            (data) => {
                console.log(data);
                res.send(JSON.stringify({
                    success: true,
                    data
                }));
            })
        .catch(err => {
            console.log(err);
            res.send(JSON.stringify({ success: false }));
        });
})
/////////////////////////Retrieve participants End/////////////////////////////////


/////////////////////////Send Message Start/////////////////////////////////
app.post('/api/send-message', (req, res) => {
    res.header('Content-Type', 'application/json');
    client.conversations.conversations(
        req.query.conversationSID
    )
        .messages
        .create({
            author: req.body.author,
            body: req.body.body
        })
        .then(
            (data) => {
                console.log(data);
                res.send(JSON.stringify({
                    success: true,
                    data
                }));
            })
        .catch(err => {
            console.log(err);
            res.send(JSON.stringify({ success: false }));
        });
})

/////////////////////////Send Message End/////////////////////////////////

/////////////////////////Fetch Latest Message Start/////////////////////////////////
app.post('/api/fetch-recent-messages', (req, res) => {
    res.header('Content-Type', 'application/json');
    client.conversations.conversations(
        req.query.conversationSID
    )
        .messages
        .list({
            order: `${req.body.order || 'desc'}`,
            limit: req.body.limit || 20
        })
        .then(
            (messages) => {
                messages.forEach(m => console.log(m));
                res.send(JSON.stringify({
                    success: true,
                    messages
                }));
            })
        .catch(err => {
            console.log(err);
            res.send(JSON.stringify({ success: false }));
        });
})

/////////////////////////Fetch Latest  End/////////////////////////////////


/////////////////////////Fetch all messages  start/////////////////////////////////

app.post('/api/fetch-all-messages', (req, res) => {
    res.header('Content-Type', 'application/json');
    client.conversations.conversations(
        req.query.conversationSID
    )
        .messages
        .list()
        .then(
            (messages) => {
                messages.forEach(m => console.log(m.sid));
                res.send(JSON.stringify({
                    success: true,
                    messages
                }));
            })
        .catch(err => {
            console.log(err);
            res.send(JSON.stringify({ success: false }));
        });
})

/////////////////////////Fetch all messages  End/////////////////////////////////



/////////////////////////Fetch all Participants start/////////////////////////////////

app.get('/api/fetch-all-participants', (req, res) => {
    res.header('Content-Type', 'application/json');
    client.conversations.conversations(
        req.query.conversationSID
    )
        .participants
        .list()
        .then(
            (participants) => {
                 console.log(participants);
                res.send(JSON.stringify({
                    success: true,
                    participants
                }));
            })
        .catch(err => {
            console.log(err);
            res.send(JSON.stringify({ success: false }));
        });
})

/////////////////////////Fetch all participants  End/////////////////////////////////


app.listen(3001, () => {
    console.log("App is running on 3001")
})


