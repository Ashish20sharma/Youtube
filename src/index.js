require('dotenv').config();
const app = require('./app');
const connectDb=require("./db/dbConnection")
const port=process.env.PORT;
connectDb()
.then(()=>{
    app.listen(port,()=>{
        console.log(`App listening on ${port}`);
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed")
});
