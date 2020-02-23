var mongoose = require('mongoose');
var events = require('events');

var { dbUser} = require('./env');
var Movie = require('../models/movies');
var Link = require('../models/links');
var Tag = require('../models/tags');
var Rating = require('../models/ratings');
var Wishlist = require('../models/wishlist');

const database = 'movies';
var url = generateDBUrl(dbUser.user, dbUser.password, dbUser.host, database);
var totalMovies = 0;
// getAllMovies(1, 20);
// getMovieRating(17);
// getMovieTags(2);

function getAllMoviesCount(cb) {
    Movie.find({}, (err, mlist) => {
        if(err) {
            cb(err, null);
            return;
        }
        cb(null, mlist.length);
    });
}

function getAllMovies(id, count, cb) {
    Movie.find({movieId: { $in: generateIds(id, count)}}, (err, mlist) => {
        if(err) {
            cb(err, null);
            return;
        }
        cb(null, mlist)
    });
}

function getMovieRating(id,cb) {
    let ratings = []
    Rating.find({movieId: { $eq: id}},(err, mratings) => {
        if(err) {
            cb(err, null);
            return;
        }
        mratings.forEach(ele => ratings.push(ele.rating));
        let r = average(ratings);
        cb(null, r);
    });
}

function getMovieTags(id, cb) {
    let tags = [];
    Tag.find({movieId: { $eq: id}},(err, mtags) => {
        if(err) {
            cb(err, null);
            return;
        }
        mtags.forEach(ele => tags.push(ele.tag));
        cb(null, tags);
    });
}

// getMovieLinksId(2, (err, data) => {
//     console.log(data);
// });
function getMovieLinksId(id, cb) {
    createConnection()
    let linksId = {};
    Link.find({movieId: { $eq: id}},(err, mlinkId) => {
        if(err) {
            cb(err, null);
            return;
        }
        const dataObj = mlinkId.length ? mlinkId[0] : null;
        cb(null, dataObj);
    });
}

// addToWishlist({userId: 5, movieId: 4}, (err, d) => {
//     console.log(d);
// })
function addToWishlist(data, cb) {
    createConnection()
    let wishlist = new Wishlist(data);
    Wishlist.findOne({userId: wishlist.userId, movieId: wishlist.movieId}, (err, doc) => {
        if(!doc) {
            wishlist.save(wishlist,(err, result) => {
                if(err) {
                    cb(err, null);
                    return;
                }
                cb(null, result);
            });
        } else {
            cb(null, {message: 'already added'});  
        }
    });
}

// getWishlist(2, (err, d) => {
//     console.log(d);
// })
function getWishlist(id, cb) {
    createConnection();
    const movieIds = [];
    Wishlist.find({userId: id}, (err, doc) => {
        if(doc) {
            doc.forEach(ele => movieIds.push(ele.movieId));
            Movie.find({movieId: { $in: movieIds}}, (err, mlist) => {
                if(err) {
                    cb(err, null);
                    return;
                }
                cb(null, mlist)
            });
        } else {
            cb(null, {})
        }
    })
}


// utils
// findMovieDataWithRatingAndTags((err, data) => {
//     if(err) {
//         console.log(err);
//         return;
//     }
//     console.log('final: ', data);
// });

function findMovieDataWithRatingAndTags(id, count, cb) {
    const allData = [];
    let mrating;
    let mtags;
    let count1, count2 = 0;
    let eventEmitter = new events.EventEmitter();
    eventEmitter.on('end', (err, data) => {
        closeConnection();
        cb(err, data);
    });
    createConnection();
    getAllMovies(id, count, (err, data) => {
        count1 = data.length;
        if(err) {
            cb(err, null);
            return  
        }
        data.forEach(m => {
            getMovieRating(m.movieId, (err, r) => {
                if(err) {
                    mrating = 0;
                } else {
                    mrating = r;
                }
                getMovieTags(m.movieId, (err, t) => {
                    mtags = t;
                    getMovieLinksId(m.movieId, (err, l) => {
                        allData.push({
                            ...m._doc,
                            rating: mrating,
                            tags: mtags,
                            imdbLink: `https://www.imdb.com/title/tt0${l.imdbId}`,
                            tmdbLink: `https://www.themoviedb.org/movie/${l.tmdbId}`
                        });
                        count2 = count2 + 1;
                        if(count1 === count2) {
                            eventEmitter.emit('end', null, allData);
                        }
                    })
                });
            });
        });
    });
}

function generateIds(id, count) {
    const ids = [];
    for(i = id; i <= id + count - 1; i++) {
        ids.push(i);
    }
    return ids;
}
function generateDBUrl(user, pass, host, db) {
    return `mongodb://${user}:${pass}@${host}/${db}`;
}

function createConnection() {
    mongoose.connect(url);
}

function closeConnection() {
    mongoose.disconnect();
}

function average(nums) {
    return (nums.reduce((a, b) => a + b, 0)/nums.length).toFixed(1);;
}


// export
module.exports = {
    findMovieDataWithRatingAndTags: findMovieDataWithRatingAndTags ,
    getAllMovies: getAllMovies,
    getAllMoviesCount: getAllMoviesCount,
    addToWishlist: addToWishlist,
    getWishlist: getWishlist
}
