const express = require("express")
const app=express()
const Chat=require("./models/chat.js")
const mongoose= require("mongoose")
const methodOverride = require('method-override');
const path=require("path");
const { resolveObjectURL } = require("buffer");
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended : true}))  
app.use(methodOverride('_method'));
app.use(express.json())
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
main()
.then((res)=>{
    console.log("connection successful")
}).catch((err)=>{
    console.log(err)
})
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp')
}

app.get("/",(req,res)=>{
    res.send("root is working")
})
app.listen(8080,()=>{
    console.log("app is listen on 8080")
})

// 

////////////////index route//////////////////////
app.get("/chats",async(req,res)=>{
    try{
        let allchats=await Chat.find({})
        res.render("index.ejs",{allchats})
    }catch(err){
        console.log(err)
        res.send("something went wrong")
    } 
})

app.get("/chats/new",(req,res)=>{
    res.render("new.ejs")
})


//////////////create route/////////////////////////
app.post("/chats", async (req,res)=>{
    try {
        let {from,msg,to}=req.body;
        let newchat = new Chat({
          from:from,
          to:to,
          msg:msg,
          created_at:new Date()
        })
      
        await newchat.save(); 
      
        res.redirect("/chats")
    } catch(err) {
        console.log(err);
        res.send("Error creating chat");
    }
})

/////////////////////////Delete rout/////////////////////
app.delete("/chats/delete/:id",async (req,res)=>{
    let {id}=req.params;
    
    await Chat.findByIdAndDelete(id);
    res.redirect("/chats")
})

app.get("/chats/:id",async(req,res)=>{
    let {id}=req.params;
    try{
        
        let val=await Chat.findOne({_id:id})
        res.render("edit.ejs",{val})
        // console.log(val)
    }
    catch(err){
        console.log(err)
    }
})

///////////////////////updaterout///////////////////////////
app.patch("/chats/edit/:id",async(req,res)=>{
    let {id}=req.params;
    let {msg}=req.body;
    console.log(id)
    console.log(msg)
    // let {msg}=req.body;
    // console.log(msg)
    await Chat.findByIdAndUpdate(id,{msg:msg}).then((result)=>{
        console.log(result)
    }).catch((err)=>{
        console.log(err)
    })
    res.redirect("/chats")
    
})