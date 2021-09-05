const express = require('express');
const router = express.Router();
const db = require("../db/dbconnection");
const { check, validationResult } = require('express-validator/check')

router.post("/feedback",
    [check("name").isLength({min:2, max:40}).not().isEmpty(),
    check("email").isLength({min:5, max:40}).not().isEmpty().isEmail(),
    check("phone").isLength({min:5, max:50}).not().isEmpty().isNumeric(),
    check("comment").isLength({min:1, max:200}).not().isEmpty()],
    function(req, res){
        var input = req.body;
        var d = new Date();
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(200).json({ message : "Something went wrongg!!" });
            return res.json({message:"Something went wrongg!!",status:404})
        }else{
            var data = {
                name:input.name,
                email:input.email,
                phone:input.phone,
                comment:input.comment,
                date: d.getTime()
            }
            
            db.query("INSERT INTO feedback SET ?",[data], function(err,results){
                if(results){
                    res.status(200).json({message:"success",status:200})
                }else{
                    res.status(404).json({message:"failed",status:404})
                }
            })
        }

})

module.exports = router;