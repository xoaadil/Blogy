import mongoose from "mongoose"
let MONGO_URI=process.env.MONGO_URI as string;
mongoose.connect(MONGO_URI)
.then(()=>{
    console.log("Database is conneceted")
}).catch((err)=>{
    console.log(`faild to connect db ${err}`)
})