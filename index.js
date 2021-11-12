const express= require("express")
const app = express()
const helmet= require("helmet")
const morgan= require("morgan");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/post")


//.env config
const dotenv= require("dotenv")
dotenv.config()


//MogoDB connection
const mongoose= require("mongoose");
mongoose.connect(process.env.MONGO_URL,
() => {
  console.log("Connected to MongoDB");
}
);

//middleware 
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
//les routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post",postRoute);



app.listen(8800, ()=>{
    console.log("backend is ready")
})
