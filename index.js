const express = require('express');
const path = require('path');
const {restrictToLoggedInUserOnly, checkAuth} = require('./middlewares/auth')
const {connectToMongoDB} = require('./connection');


const URL = require('./model/url');

const urlRoute = require('./route/url');
const staticRoute = require('./route/staticRoute')
const  userRoute = require('./route/user');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8000;



connectToMongoDB('mongodb://localhost:27017/short-url').then(() => console.log('MongoDB connected.'));

app.set('view engine', 'ejs'); 
app.set('views', path.resolve('./views'))

app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/url', restrictToLoggedInUserOnly,  urlRoute);
app.use('/user', userRoute);
app.use('/', checkAuth, staticRoute);


app.get('/url/:shortId', async (req,res) => {
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

// app.get('/test', async (req,res) => {
//     const allUrls = await URL.find({});
//     return res.render('home', {
//         urls : allUrls,
//     })
// })

app.listen(PORT, () => console.log(`Server connection at http://localhost:${PORT}`));

