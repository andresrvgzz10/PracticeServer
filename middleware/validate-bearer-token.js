const {TOKEN} = require('./../config')
//const APIKEY = "password123456";

function validateApiKey(req,res,next)
{
    if (!req.headers.authorization)
    {
        res.statusMessage = "Unathorized Message. Please send the APIKEY"
        return res.status(401).end();      
    }

    if(req.headers.authorization !== `Bearer ${TOKEN}`){
        res.statusMessage = "Unathorized Request. Invalid APIKEY"
        return res.status(401).end();   
    }

    next();
    
}

module.exports = validateApiKey;
