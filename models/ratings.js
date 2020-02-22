var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
       userId : {type:Number, required:true},
       movieId: {type:Number, required:true},
       rating: {type:Number, required:true},
       timestamp: {type:Number, required:true}
});
module.exports=mongoose.model('Ratings',schema);