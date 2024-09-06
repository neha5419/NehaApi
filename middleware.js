import express from "express"
const app=express();

const PORT=4000;


//middleware

function middleware1(req,res,next){
    console.log("middleware1");
 
    req.firstname="neha";
    next();
}
 function middleware2(req,res,next){
    console.log("middleware2");
    res.send("chaloo middleware..")
     next();
 }

app.use(middleware1);
app.use(middleware2);

// app.use((req,res,next)=>{

// })
//route

app.get("/",(req,res)=>{
    console.log(req.firstname);
    // res.send("hello");
})

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
})