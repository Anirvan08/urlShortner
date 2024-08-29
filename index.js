const express = require('express');

const {connectToMongoDB} = require('./connection');
const urlRoute = require('./route/url');

const URL = require('./model/url');

const app = express();
const PORT = 8000;

connectToMongoDB('mongodb://localhost:27017/short-url').then(() => console.log('MongoDB connected.'));

app.use(express.json())

app.use('/', urlRoute);

app.get('/:shortId', async (req,res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push : {
                visitHistory :
                {
                    timestamp:  Date.now()
                }
            }
        }
    )

    res.redirect(entry.redirectURL)

})

app.listen(PORT, () => console.log(`Server connection at localhost://${PORT}`));

