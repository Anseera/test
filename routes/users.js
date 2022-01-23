var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});
router.get('/register',(req,res)=>{
  // res.send('register')
  res.render('register')
})

module.exports = router;
