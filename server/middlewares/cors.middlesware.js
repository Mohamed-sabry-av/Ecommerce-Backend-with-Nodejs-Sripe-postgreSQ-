const cors = require('cors');

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
console.log(allowedOrigins);

const corsOptions = {
origin:function(origin,callback){
    if(!origin) return callback(null,true); //allow server to server or postman
    if(allowedOrigins.includes(origin)){
        return callback(null,true);
    }
    else{
        callback(new Error('CORS policy:origion not allowed'));
    }
},
credentials:true,
methods:['GET','POST','PUT','DELETE'],
allowedHeaders:['Content-Type','Authorization']
}

module.exports = cors(corsOptions);