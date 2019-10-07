const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const http = require('http');
const hbs = require('hbs');
const expressip = require('express-ip');

const routes = require('./api/routes');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

//DB config
let uri = 'mongodb://shubham25:shubham25@ds145926.mlab.com:45926/sdk';

//connect to mongodb
mongoose.connect(uri,
    { useNewUrlParser: true },
    function(error) {
        console.log(`ERRORS in connecting to DB: ${error}`);
    }
);

// public path for static content
const publicPath = path.join(__dirname,'../public');

// port config
const port = process.env.PORT || 1111;
let app = express();
let server = http.createServer(app);

app.use(express.static(publicPath));

//body-parser middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// CORS config
app.use(function(req, res, next) {
    
  // need to change
  // currently can accept request from everywhere
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// for fetching location details
app.use(expressip().getIpInfoMiddleware);

//API ROUTES 
app.use(routes);

// Connect to server
server.listen(port,()=>{
   console.log(`Server is up on port ${port}`); 
});