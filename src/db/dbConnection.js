const mongoose=require('mongoose');
const DB_NAME=require('../constant')
const  connectDb = async()=> {
    const URL=process.env.MONGODB_URL;
    try {
        const connectionInstance=await mongoose.connect(`${URL}/${DB_NAME}`)
        console.log(`MongoDb connected : ${connectionInstance.connection.host}`);
        // process.exit()
    } catch (error) {
       console.log("Mongo connection error",error);
    //    process.exit(1)
    }
}

module.exports=connectDb;