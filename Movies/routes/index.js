var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');


var url = 'mongodb://viorel:123@ds163181.mlab.com:63181/movieslist';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// load list of movies
router.get('/load-list', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('movies').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('index', {items: resultArray});
    });
  });
});
// insert a movie
router.post('/insert', function(req, res, next) {
  var item = {
    title: req.body.title,
    description: req.body.description,
    rating: req.body.rating,
    released: req.body.released,
    url:req.body.url
  };
    if(!item.title){
    res.json({
      "error":"No title"
    });
   }else{

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('movies').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });
}
  res.redirect('/load-list');
});

// edit a movie
router.post('/update', function(req, res, next) {
  var item = {
    title: req.body.title,
    description: req.body.description,
    rating: req.body.rating,
    released: req.body.released,
    url:req.body.url
  };
  var id = req.body.id;

  if(!id){
    res.json({
      "error":"Fill ID and blanks"
    });
  }else{

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('movies').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
}
res.redirect('/load-list');
});

//delete a movie
router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  if(!id){
    res.json({
      "error":"Fill ID"
    });
  }else{
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('movies').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
  }
  res.redirect('/load-list');
});

module.exports = router;
