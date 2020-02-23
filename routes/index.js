var express = require('express');
var router = express.Router();

var { 
  findMovieDataWithRatingAndTags,
  getAllMoviesCount,
  addToWishlist,
  getWishlist } = require('../DatabaseOps/Data');
/* GET home page. */
let totalMovies = 9742;
const userId = 500000;
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
          count: 0,
          deafultUserId: userId
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

router.post('/add-wishlist', function(req, res, next) {
  let uid = req.body.userId ? parseInt(req.body.userId) : userId;
  let mid = req.body.movieId ? parseInt(req.body.movieId) : 5;
  if(uid === userId || uid === 0) {
    res.status(201).json({
      data: {},
      metadata: {
        status: 'Success',
        code: 201,
        newUser: true
      }
    });
  } else {
    addToWishlist({userId: uid, movieId: mid}, (err, result) => {
      if(err) {
        res.status(500).json({
          data: {
            error: err
          },
          metadata: {
            status: 'Error',
            code: 500,
          }
        });
        return;
      }
      res.status(200).json({
        data: result,
        metadata: {
          status: 'Success',
          code: 200,
          newUser: false
        }
      })
    });
  }
});

router.get('/wishlist/:userId', function(req, res, next) {
  let uid = req.params.userId ? parseInt(req.params.userId) : userId;
  if(uid === userId || uid === 0) {
    res.status(201).json({
      data: {},
      metadata: {
        status: 'Success',
        code: 201,
        newUser: true
      }
    });
  } else {
    getWishlist(uid, (err, result) => {
      if(err) {
        res.status(500).json({
          data: {
            error: err
          },
          metadata: {
            status: 'Error',
            code: 500,
          }
        });
        return;
      }
      res.status(200).json({
        data: result,
        metadata: {
          status: 'Success',
          code: 200,
          newUser: false
        }
      })
    });
  }
});

module.exports = router;
