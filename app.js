const express = require('express');
const bodyparser = require('body-parser');
const date = require(__dirname + "/date.js");

const app = express();

console.log(date());

var items = ["buy Food ", "Cook Food", "Eat Food"];
var workListItems = [];

var item = "";
let workItem = "";

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    let day = date();

    res.render('list', {
        listTitle: day,
        newListItems: items,
    });
})

app.post("/", function(req, res) {
    item = req.body.todoListName;
    workItem = req.body.todoListName;
})

app.get("/workitem", (req, res) => {

    let day = date();

    res.render('list', {
        listTitle: day,
        newListItems: workListItems
    });
})


app.listen(3000, function() {
    console.log("Server is running on port 3000");
})