//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const todo=[];

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-ansari:Test123@cluster0.blrmget.mongodb.net/todolistDB');

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

const listSchema = {
 name: String,
 items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);


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

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name:customListName},function(err,results){
        if(!err){
            if(!results){

                const list = new List({
                    name:customListName,
                    items:defaultItems
                });
            
                list.save();

               res.redirect("/"+ customListName);

            }else {
                res.render("list",{listTitle:results.name,newListItem:results.items});
            }
        }
    });

   
});

app.post("/", function(req,res){
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name:itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    } else{
        List.findOne({name: listName}, function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }

    
    
});

app.post("/delete", function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err){
                res.redirect("/");
            }
        });
    }else {
        List.findOneAndUpdate({name: listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        });

    }
    
    
});

app.get("/about",function(req,res){
    res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
    console.log("Server has started");
});
