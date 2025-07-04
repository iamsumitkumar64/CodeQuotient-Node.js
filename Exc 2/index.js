const { log } = require("console");
const fs=require("fs");

fs.readFile('File.txt','utf-8',(err,data)=>{
    if(!err){
        console.log(data);
    }else{
        console.log(err);        
    }
}); 