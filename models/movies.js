var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
       movieId : {type:Number, required:true},
       title: {type:String, required:true},
       genres: {type:String, required:true},
       year: {type:String, required:true}
});
module.exports=mongoose.model('Movies',schema);