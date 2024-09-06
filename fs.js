//fs-file system
import fs from "fs";

//read a data from file
//1)read synchronously
// const data=fs.readFileSync("./demo.txt","utf-8");
// console.log(data);
//2)asynchronous
// fs.readFile("./demo.txt","utf-8",(err,data)=>{
//     if(err) throw err;
//     console.log(data)
// })

//how to write data in file

//synchronous
// fs.writeFileSync("./demo.txt","i love node.js")
// {
//     console.log("data written in file");
// }

//asynchronous
// fs.writeFile("./demo.txt","i love node.js",(err)=>{
//     if(err) throw err;  //throw terminates
//     console.log("data written in file");
// });


//which to use async or sync depends on use cases..

//existing data will not go..
try {
    fs.appendFileSync('./demo.txt', '\n Doremon');
    console.log('The "data to append" was appended to file!');
  } catch (err) {
    console.log(err);
  }

