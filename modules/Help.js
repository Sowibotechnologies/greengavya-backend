const express = require('express');
const router = express.Router();
const db = require("../db/dbconnection");

//GET QUESTIONS
router.get("/:type", function(req, res){
    var type = req.params.type;
    db.query("SELECT * FROM faq WHERE subject = ?",[type], function(err, result){
        if(!err){
            res.json({result:result, status:200})
        }else{
            res.json({status:404})
        }
    })
})

module.exports = router;