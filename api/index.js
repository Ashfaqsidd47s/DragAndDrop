const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("mongodb server connected");
});

const alphalistSchema = mongoose.Schema({
    numArr:{
        type: Array,
    },
});

const Alphalist = mongoose.model("Alphalist", alphalistSchema);

app.post("/",async (req,res)=>{
    const newAlphaList = new Alphalist(req.body);
    try {
        const saveAlphaList = await newAlphaList.save();
        res.status(200).json(saveAlphaList);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get("/:id",async (req,res)=>{
    try {
        const arr = await Alphalist.findById(req.params.id);
        res.status(200).json(arr);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get("/", (req,res)=>{
    res.json("server started ....");
})

app.listen(8800, ()=>{
    console.log("server started at port 8800..");
})