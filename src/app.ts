import express from "express";
import dotenv from "dotenv";
import { HttpError } from "http-errors"; 
import config from "./config/dbConfig";
import cors from "cors";
import logger from "morgan";
import { db } from "./config";
import userRoutes from "./Routes/userRoutes"
import postRoutes from "./Routes/postRoutes";


const { PORT } = config;

dotenv.config;

const app = express();
app.use(express.json());
app.use(logger("dev"));
app.use(cors());
app.use("/user", userRoutes)
app.use("/post", postRoutes)

app.get("/", (req, res) => {
     return res.send("welcome too Alozie's blog")
});


db.sync().then(() => {
     console.log("Database is connected")
}).catch((err: HttpError) => {
     console.log(err)
});

const port = PORT;

app.listen(port, () => {
     console.log(`Server is running on port ${port}`)
})

export default app 

