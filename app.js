//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const todo=[];

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemsSchema = {name: String};
const Item = mongoose.model("Item",itemsSchema);

const newItem1 = new Item({
    name:"Go to Home"
});

const newItem2 = new Item({
    name:"Go to library"
});

const newItem3 = new Item({
    name:"Go to Town"
});

const defaultItems = [newItem1,newItem2,newItem3];



app.get("/", function(req,res){

    Item.find({},function(err,foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                   console.log(err);
                }else{
                   console.log("Success");
                }
               });
               res.redirect("/");
        }else{
            res.render('list',{listTitle:"Today",newListItem:foundItems});
        }
        
    });

    
});

app.post("/", function(req,res){
    const itemName = req.body.newItem;

    const item = new Item({
        name:itemName
    });

    item.save();

    res.redirect("/");
    
});

app.post("/delete", function(req,res){
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId,function(err){
        if(!err){
            console.log("Successfully deleted checked item.");
            res.redirect("/");
        }
    });
    
});

app.get("/work", function(req,res){


    res.render("list", {listTitle:"Work List", newListItem:workItems});
});

app.post("/work",function(req,res){
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about",function(req,res){
    res.render("about");
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});
