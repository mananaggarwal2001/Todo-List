const express = require('express');
const bodyparser = require('body-parser');
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoListDB", { useNewUrlParser: true });
const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const itemModel = mongoose.model("listItem", itemSchema);
const workItemModel = mongoose.model("workListItem", itemSchema);

const newItem = new itemModel({
    name: "Welcome to your todolist!!!"
});

const newItemOne = new itemModel({
    name: "Hit the + Button to add the new item"
});

const newItemTwo = new itemModel({
    name: " <-- Hit this to delete an item "
});

const defaultItemList = [newItem, newItemOne, newItemTwo];

app.get("/", function(req, res) {
    let day = date();
    itemModel.find({}, (err, results) => {
        if (results.length === 0) {
            itemModel.insertMany(defaultItemList, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully added the item in the todoList");
                }
            });
            res.redirect("/");
        } else {
            res.render('list', {
                listTitle: day,
                newListItems: results,
            });
        }
    })
})





app.post("/deleteItem", (req, res) => {
    const checkedItemId = req.body.checkedItem;
    itemModel.findByIdAndRemove({ _id: checkedItemId }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully removed the item ");
        }
    })

    res.redirect("/");
})

app.post("/", function(req, res) {
    const itemName = req.body.todoListName;
    const insertItemname = new itemModel({
        name: itemName
    });
    insertItemname.save();
    res.redirect("/");
})

// app.get("/workitem", (req, res) => {
//     res.render("list", { listTitle: "Work" })
// })

app.listen(3000, function() {
    console.log("Server is running on port 3000");
})