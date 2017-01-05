var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // use native mongoose promises﻿

//connect to the database
mongoose.connect('mongodb://test:test@ds155428.mlab.com:55428/lestertodo');

//create a schema - this is like blueprint
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);

//adding item to the database
// var itemOne = Todo({item: 'buy flowers'}).save(function(err){
//   if (err) throw err;
//   console.log('item saved!');
// });

var urlencodedParser = bodyParser.urlencoded({ extended: false });

//var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}];

module.exports = function(app){

app.get('/todo', function(req, res) {
  //res.render('todo', {todos: data});
  //get data from mongodb and pass it to the view
  
  Todo.find({}, function(err, data) { //retrive all, if specific Todo.find({item: 'buy flowers'});
    if(err) throw err;
    res.render('todo', {todos: data});
  });
});

app.post('/todo', urlencodedParser, function(req, res){
  //get data from the view and add it to mongodb
  var newTodo = Todo(req.body).save(function(err, data){
    if (err) throw err;
    res.json(data);
  });
  //data.push(req.body);
  //res.json(data);
});

app.delete('/todo/:item', function(req, res){
  //delete the requested item from mongodb
  Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data) {
    if (err) throw err;
    res.json(data);
  });
  // data = data.filter(function(todo){
  //   return todo.item.replace(/ /g, '-') !== req.params.item;
  // });
  // res.json(data);
});

};
