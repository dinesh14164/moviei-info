var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
       movieId : {type:Number, required:true},
       imdbId: {type:Number, required:true},
       tmdbId: {type:Number}
});
module.exports=mongoose.model('Links',schema);