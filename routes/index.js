const express = require('express');
const numberName = require('number-name');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const NUMBER_OF_LEVELS = 22;
const levelList = Array.from({length: NUMBER_OF_LEVELS}, (x,i) => i+1);
let levelObject = [];

for (let number of levelList) {
    levelObject.push({
        level: [number, numberName(number)]
    });
}

for (let level of levelObject) {
    router.get(`/lvl/${level.level[0]}`, (req, res)=>{
        res.render(`levels/${level.level[1]}`)
    });
}

router.get('/die', (req,res)=>{
    res.render("die", {"level":req.query.lvl})
});

module.exports = router;
