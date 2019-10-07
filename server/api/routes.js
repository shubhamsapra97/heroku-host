const router = require('express').Router();
const _ = require('lodash');
const mongoose = require('mongoose');
const {InitModel} = require('../model/init');

router.get('/', function(req, res){
  res.render('index.html');
});

router.post('/init' , (req,res) => {
    
    let body = _.pick(req.body,['browser','os','version','userAgent','city','country','state'],);
    let ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;
    let status,message;
    
    if (Object.keys(body).length) {
        const ipInfo = req.ipInfo;
        body = {
            ...body,
            ip,
            countryCode: ipInfo ? ipInfo.country : '',
            city: ipInfo ? ipInfo.city : '',
            region: ipInfo ? ipInfo.region : ''
        }
        let initConfig = new InitModel(body);
        initConfig.save().then((init) => {
           if (init) {
               status = "201";
               message = "Init Config saved successfully";
           } else {
               status = "400";
               message = "Error saving init config";
           }
           let data = {
               status,
               message
           };
           return res.status(status).send([data]);
        });
    }
    
});

module.exports = router;
