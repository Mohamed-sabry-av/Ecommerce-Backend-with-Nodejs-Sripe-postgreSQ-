const sanitizeHTML= require("sanitize-html");

function sanitizeBody(req,res,next) {
    if(req.body){
        for(let key in req.body){
            if(typeof req.body[key] === "string"){
                req.body[key]=sanitizeHTML(req.body[key],{
                    allowedTags:[],
                    allowedAttributes:{}
                })
            }
        }
    }
    next();
}
module.exports = sanitizeBody