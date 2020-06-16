var express = require('express');
var router = express.Router();
const config = require('config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { w: config.get('w'), h: config.get('h'), size: config.get('size') });
});

module.exports = router;
