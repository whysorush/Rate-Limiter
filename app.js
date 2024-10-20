const express = require('express');
const app = express();

const requestStore = new Map();

const rateLimiter = (req,res,next)=>{
    const ip = req.ip;
    console.log("middleware",requestStore)
    const currentTime = Date.now();
    if(!requestStore.has(ip)){
        requestStore.set(ip,{count:1,startTime:currentTime})
    }
    else{
        const record = requestStore.get(ip);
        const elapsedTime = (currentTime - record.startTime)/1000;
        if(elapsedTime < 60){
            if(record.count >= 5){
                res.status(400).send({error:"too many request"});
            }
            else{
                record.count+=1;
            }
        }
        else{
            requestStore.set(ip,{count:1,startTime:currentTime});
        }
    }
    next();
}

app.use(rateLimiter);

app.use('/',(req,res)=>{
    res.send("Hello welcome to rate limiter");
})

app.listen(3000)