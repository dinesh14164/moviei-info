var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
       userId : {type:Number, required:true},
       movieId: {type:Number, required:true},
       tag: {type:String, required:true},
       timestamp: {type:String, required:true}
});
module.exports=mongoose.model('Tags',schema);