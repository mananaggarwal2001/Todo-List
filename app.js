const express = require('express');
const bodyparser = require('body-parser');
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const app = express();
const _ = require('lodash');

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Manan:manan@9319054970@cluster0.dquuo.mongodb.net/todoListDB", { useNewUrlParser: true });
const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const itemModel = mongoose.model("listItem", itemSchema);

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


const listSchema = {
    name: String,
    items: [itemSchema],
};

const listModel = mongoose.model("List", listSchema); // for storing the list heading in the List collections in the database of todolistDB.

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
    const listName = req.body.listName;

    if (listName === date()) {
        itemModel.findByIdAndRemove({ _id: checkedItemId }, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully removed the item ");
            }
        })
        res.redirect("/");
    } else {
        listModel.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, (err, results) => {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }
});
app.post("/", function(req, res) {

    let itemName = req.body.todoListName;
    const listName = req.body.list;
    const insertItemname = new itemModel({
        name: itemName,
    });
    if (listName === date()) {
        insertItemname.save();
        res.redirect("/");

    } else {
        listModel.findOne({ name: listName }, (err, founditem) => {
            founditem.items.push(insertItemname);
            founditem.save();
            res.redirect("/" + listName);
        });
    }
});
app.get("/:customListName", (req, res) => {
    let parameters = _.capitalize(req.params.customListName);

    listModel.findOne({ name: parameters }, (err, results) => {
        if (!err) {
            if (!results) {
                const List = new listModel({
                    name: parameters,
                    items: defaultItemList
                });

                List.save(); // this is for the new list which is made .

                res.redirect("/" + parameters);
            } else {
                res.render('list', {
                    listTitle: results.name,
                    newListItems: results.items, // this is for the existing list which is found
                });

            }
        }
    })
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is listning to the port 3000");
});