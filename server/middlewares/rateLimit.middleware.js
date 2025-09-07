const rateLimit= require('express-rate-limit');


const limiter= rateLimit({
    windowMS:15*60*1000, //15mins
    max:100, //max req
    message:'Too many requests, please try again alter'
})

module.exports = limiter;