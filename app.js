const express = require('express');
const bodyparser = require('body-parser');
const date = require(__dirname + "/date.js");

const app = express();

console.log(date());

var items = ["buy Food ", "Cook Food", "Eat Food"];
var workListItems = [];

var item = "";

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    let day = date();

    res.render('list', {
        listTitle: day,
        newListItems: items,
    });
    console.log(req.body);
})

app.post("/", function(req, res) {
    console.log(req.body);
    let catergory = req.body.list;
    let item = req.body.todoListName;

    if (catergory === 'Work') {
        workListItems.push(item);
        res.redirect('/workitem');
    } else {
        items.push(item);
        res.redirect('/');
    }
})

app.get("/workitem", (req, res) => {

        res.render('list', {
            listTitle: "Work Items",
            newListItems: workListItems
        });
    })
    // app.post("/workitem", (req, res) => {
    //     let item = req.body.todoListName;
    //     workListItems.push(item);
    //     res.redirect("/workitem");
    // })

app.listen(3000, function() {
    console.log("Server is running on port 3000");
})