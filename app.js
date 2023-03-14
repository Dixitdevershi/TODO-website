const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const app = express();
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/todoListDb");
const itemSchema = {
    name: String
}
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({ name: "Welcome to our todo list " });
const item2 = new Item({ name: "This is second item 2 " });
const item3 = new Item({ name: " this is third item 3" });
const defaultItems = [item1, item2, item3];

var inputs = ["body", "Thats it"];
let workTasks = [];
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.get("/", function (req, res) {
    //  let day = date.getdate();
    Item.find({}, function (err, foundeditems) {
        if (foundeditems.length == 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Inserted every items")
                }

            });
            res.redirect("/");
        }
        else {
            res.render("list", { kindofday: "today", newtasks: foundeditems });
        }

    });
});
app.post("/", function (req, res) {
    const newItem = req.body.task;
    const item = new Item({
        name: newItem
    });
    item.save();
    res.redirect("/");



});
app.post("/delete",function(req,res)
{
   const id=req.body.checkbox;
   Item.findByIdAndRemove(id,function(err)
   {
    if(!err)
    {
        console.log("sucessfully deleted that task");

    }
    else{
        console.log(err);
    }
   })
   res.redirect("/");
});
// app.get("/work", function (req, res) {
//     res.render("list", { kindofday: "work", newtasks: workTasks });
// });
const listSchema={
    name:String,
    item:[itemSchema]
}
const List =mongoose.model("List",listSchema);

app.get("/:customListName",function(req,res)
{
   const customlistname=req.params.customListName;
    List.findOne({name:customlistname}, function(err,foundList)
    {
        if(!err)
        {
            if(!foundList){
                const list = new List({
                    name: customlistname,
                    items:defaultItems
            });
            list.save();
            res.redirect("/"+customlistname);
            }
            else{
                res.render("list", { kindofday: foundList.name, newtasks: foundList.items });
            }

        }

});

});


app.listen(3000, function () {
    console.log("This server is running in 3000");
});