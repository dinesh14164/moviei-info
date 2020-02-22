var express = require('express');
var router = express.Router();

var { findMovieDataWithRatingAndTags, getAllMoviesCount } = require('../DatabaseOps/Data');
/* GET home page. */
let totalMovies = 0;
getAllMoviesCount((err, len) => {
  totalMovies = len;
});
router.get('/', function(req, res, next) {
  let movieId = req.query.id ? parseInt(req.query.id) : 1;
  let count = req.query.count ? parseInt(req.query.count) : 5;
  findMovieDataWithRatingAndTags(movieId, count, (err, doc) => {
    if(err) {
      res.status(500).json({
        error: err,
        metadata: {
          status: 'Error',
          code: 500,
          count: 0
        } 
      });
      return;
    }
    res.status(200).json({
      data: doc,
      metadata: {
        status: 'Success',
        code: 200,
        count: totalMovies
      } 
    });
  });
});

module.exports = router;
