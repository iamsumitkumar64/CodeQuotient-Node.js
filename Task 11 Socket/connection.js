import mongoose from "mongoose";

function connectDB(url){
    mongoose.connect(url)
    .then(()=>{
        console.log("Database Connected Successfully");
    })
    .catch((error)=>{
        console.error(error);        
    })
}

export default connectDB;