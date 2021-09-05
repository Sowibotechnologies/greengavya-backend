const express = require('express');
const bcrypt = require("bcryptjs");
const db = require("../db/dbconnection");
const router = express.Router();
const misc = require("../Misc/Misc");
const jwt = require("../security/Jwt");
const csurf = require('csurf');
var session = require("express-session");
var mailService = require('../Mail/MailService');
var dbservice = require('../db/Dbservice');
const { check, validationResult } = require('express-validator/check')


const saltRounds = 10;
const SELECT_ID_BY_EMAIL_FROM_USERDB = "SELECT id from user WHERE email = ?";
const SELECT_ALL_BY_EMAIL_FROM_USERDB = "SELECT * from user WHERE email = ? AND verified = 'true'";
const USER_ROLE = 'user';

router.use(session({secret:"secret", resave:false, saveUninitialized :false}));
var csrfProtection = csurf({ignoreMethods:['POST']});

//router.use(csrfProtection);

//get all users
  
router.get("/",csrfProtection, function(req, res){
    console.log( req.headers['origin'])
    db.query("SELECT * FROM user", function(err,results){
        res.send(results);
    }) 
})

//save user
router.post("/register",[
        check("username").isLength({min:2, max:40}).not().isEmpty(),
		check("lastname").isLength({min:0, max:40}).not().isEmpty(),
        check("email").isLength({min:5, max:40}).not().isEmpty().isEmail(),
		check("phone").isLength({min:5, max:50}).not().isEmpty().isNumeric(),
        check("password").isLength({min:8, max:30}).not().isEmpty(),
		check("referral").isLength({min:0, max:30}),
    ], function(req, res){
    var input = req.body;
    var usr_id = misc.RandomIdGen();
    var Verif_code = misc.RandomUserVerificationID();
    var hash_pwd = "";
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(input.password, salt, function(err,results){
        if(err)
        {
            console.log(err)
            res.json({message : "Something went wrongg!!"});
        }
        if(results){
            setTimeout(() => {
                var data = {
                    username: input.username,
					lastname: input.lastname,
                    email: input.email,
                    password: results,
                    user_id: parseInt(usr_id),
                    verification_code:Verif_code,
					referral_code : input.referral,
                    phoneno:input.phone,
                    shippingAddress:0,
                    billingAddress:0
                }
                // check is exists
                db.query(SELECT_ID_BY_EMAIL_FROM_USERDB, [input.email],function(err, result){
					//console.log(result.length);
                    if(result == ""){
                        //insert into database
                        db.query("INSERT INTO user SET ?", [data], function(err,fetchArray){
                            if(err){
                                //throw err;
                                res.json({message : "Something went wrong. try again later!"});
                            }
                            mailService.EmailVerification(input.email, input.username, input.lastname, Verif_code);
                            res.status(200).json({message : "Please verify your account! verification link sent to your account!"});
                        })
                    }else{
                        res.status(404).json({message:"Already registered with this Email ID!!"})
                    }
                })
            }, 100);
        }
    })
})
    
})

//login
router.post("/login",
[
    check("email").isLength({max:50}).not().isEmpty().isEmail(),
    check("password").isLength({ max:30}).not().isEmpty()
],
csrfProtection, function(req, res){
    //console.log( req.headers['origin'])
    var email = req.body.email;
    var password = req.body.password;
	var errors = validationResult(req);
    if (!errors.isEmpty()) {
        //return res.status(404).json({ message : "Something went wrongg!!" });
		return res.json({message:"Something went wrongg!!",status:404})
    }
    var csurf_token = req.csrfToken();
    db.query(SELECT_ALL_BY_EMAIL_FROM_USERDB, [email], function(err, results){
        if(results == ""){
            //res.status(404).json({message : "Invalid Account!!"});
			res.json({message:"Invalid Account", status:404});
        }else{
            //compare password
            bcrypt.compare(password, results[0].password, function(err, vaild){
                if(vaild){
                    var token = jwt.JWTSign(results[0].user_id, results[0].username, USER_ROLE,csurf_token);
                    res.status(200).json({
                        _uid : results[0].user_id,
                        token : token,
                        csrf_token : csurf_token,
						status:200
                    });
                    // var b = jwt.JWTVerify(token);
                    // console.log(b);
                    
                }else{
                    //res.status(404).json({message : "Invalid Account!!"});
					res.json({message:"Invalid Account", status:404})
                }
            })
        }
    })
})


//blacklist client verification

router.post("/getallblacklistbyuserid", function(req, res){
    var token = req.headers.token;
    var session = req.headers.sessionid;
    var validToken = jwt.JWTVerify(token);
    if(validToken){
        var jwtParse = jwt.JWTParse(token);
        var JWT_SESSION = jwtParse[0].csrf;
        var ROLE = jwtParse[0].role;
        var user_id = jwtParse[0]._i;
        if(JWT_SESSION === session){
            setTimeout(() => {
                db.query("SELECT * FROM blacklist WHERE user_id = ?",[user_id], function(err,results){
                    if(results != ""){
                        res.sendStatus(423);
                    }else{
                        
                        res.sendStatus(200);
                    }
                }) 
            }, 100);
        }else{
            res.sendStatus(401);
        }
    }else{
        res.sendStatus(401);
    }
})

router.post('/getUserAddress', function(req, res){
    var token = req.headers.token;
    var session = req.headers.sessionid;
    var validToken = jwt.JWTVerify(token);
    if(validToken){
        var jwtParse = jwt.JWTParse(token);
        var JWT_SESSION = jwtParse[0].csrf;
        var ROLE = jwtParse[0].role;
        var user_id = jwtParse[0]._i;
        if(JWT_SESSION === session){
            db.query("SELECT shippingAddress FROM user WHERE user_id=?", [user_id], function(err, result){
                if(err){
                    res.json({message:"error",status:404});
                }
                if(result == ""){
                    res.json({message:"error",status:404});
                }else{
                    var addressid = result[0].shippingAddress;
                    setTimeout(() => {
                       db.query("SELECT * FROM address WHERE addressid=?", [addressid], function(err, result){
                            if(err){
                                console.log(err);
                                res.json({message:"error",status:404});
                            }else{
                                if(result == ""){
                                    res.json({message:"error",status:404});
                                }else{
                                    res.json({message:"success",status:200,shipping:result});
                                }
                            }
                        }) 
                    }, 200);
                    
                }
            })
            
        }else{
            res.sendStatus(401);
        }

    }else{
        res.sendStatus(401);
    }
})
router.post('/getAddressbyId', function(req, res){
    var token = req.headers.token;
    var session = req.headers.sessionid;
    var addressId = req.body.addressId;
    var validToken = jwt.JWTVerify(token);
    if(validToken){
        var jwtParse = jwt.JWTParse(token);
        var JWT_SESSION = jwtParse[0].csrf;
        var ROLE = jwtParse[0].role;
        var user_id = jwtParse[0]._i;
        if(JWT_SESSION === session){
            db.query("SELECT * FROM address WHERE addressid= ? ", [addressId], function(err, result){
                if(err){
                    console.log(err);
                    res.json({message:"error",status:404});
                }else{
                    res.json({message:"success",status:200,shipping:result});
                }
            })
        }else{
            res.sendStatus(401);
        }

    }else{
        res.sendStatus(401);
    }
})

router.post("/resetpasswordbyloggeduser", function(req, res){
    var token = req.headers.token;
    var session = req.headers.sessionid;
    var validToken = jwt.JWTVerify(token);
    if(validToken){
        var jwtParse = jwt.JWTParse(token);
        var JWT_SESSION = jwtParse[0].csrf;
        var ROLE = jwtParse[0].role;
        var user_id = jwtParse[0]._i;
        if(JWT_SESSION === session){
            
            if(ROLE == "user"){
                var oldpassword = req.body.oldpassword;
                var newPassword = req.body.newpassword;
                
                if(oldpassword !== ""&&newPassword !== ""){
                    //verify user
                    db.query("SELECT * FROM user WHERE user_id = ?", [user_id], function(err, results){
                        if(results !== ""){
                            bcrypt.compare(oldpassword, results[0].password, function(err, vaild){
                                if(vaild){
                                    bcrypt.genSalt(10, function(err, salt) {
                                        bcrypt.hash(newPassword, salt, function(err,results){
                                            if(err){
                                                res.status(404);
                                            }else{
                                                db.query("UPDATE user SET password = ? WHERE user_id= ?", [results, user_id], function(err, result){
                                                    if(err){
                                                        res.status(404);
                                                    }else{
                                                        res.status(200).json({message:"Password updated successfully!!",status:200});
                                                    }
                                                })
                                            }
                                        })
                                    })
                                }else{
                                    res.status(200).json({message:"Current password is incorrect!!",status:406});
                                }
                            })
                        }else{
                            res.status(404);
                        }
                    })
                }else{
                    res.status(404);
                }
            }
            else{
                res.sendStatus(401);
            }
        }else{
            res.sendStatus(401);
        }
    }else{
        res.sendStatus(401);
    }

})

router.post("/verifyaccount", function(req, res){
    var verify_code = req.body.verify_code;
	//console.log(verify_code);
    db.query("SELECT * FROM user WHERE verification_code = ?", [verify_code], function(err, result){
        if(!err){
            if(result != ""){
                //console.log(result[0].verified);
                if(result[0].verified == 'true'){
                    res.sendStatus(409); //already verified
                }else{
                    db.query("UPDATE user SET verified = ? WHERE verification_code =?",["true", verify_code], function(err, array){
                        if(!err){
                            res.sendStatus(200);
                        }else{
                            res.sendStatus(404);
                        }
                    })
                }
            }
        }else{
            res.sendStatus(404);
        }
    })
})

router.get("/getusernamebytoken", function(req, res){
    var token = req.headers.token;
    if(token != ""){
        var valid_token = jwt.JWTVerify(token);
        var TOKEN_DATA = jwt.JWTParse(token);
        if(valid_token){
            var username = TOKEN_DATA[0]._u;
            res.json({name:username})
        }else{
            res.sendStatus(404);
        }
    }else{
        res.sendStatus(404);
    }
})

router.get("/sendmail", function(req, res){
    
    mailService.SentEmail();
    
})

router.post("/resetpasswordmail", function(req,res){
    var email = req.body.email;
	console.log(email);
    if(email != ""){
        db.query("SELECT * FROM user WHERE email = ? AND verified = 'true'", [email], function(err, result){
            if(result != ""){

                mailService.resetPassword(email,result[0].verification_code)
                res.status(200).json({message:"Password reset link sent to your email account"});
            }else{
                res.status(404).json({message:"We were unable to find an account linked to this email"});
            }
        })
    }else{
        res.status(404).json({message:"Please provide a email"});
    }
})

router.post("/resetpassword", function(req, res){
    var v_code = req.body.verify_code;
    var email = req.body.email;
    var newPassword = req.body.password;
    if(v_code !== ""&&email !== ""&&newPassword !== ""){
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newPassword, salt, function(err,results){
                if(err){
                    res.status(404);
                }else{
                    db.query("UPDATE user SET password = ? WHERE email= ? AND verification_code = ?", [results, email, v_code], function(err, result){
						console.log(result)
                        if(err){
                            res.status(404);
                        }else{
                            res.status(200).json({message:"Password updated successfully!!"});
                        }
                    })
                }
            })
        })
    }else{
        res.status(404);
    }
})

router.get("/getall", function(req, res){
    db.query("SELECT user.username,user.email,user.user_id,user.verified,(SELECT COUNT(*) FROM orders WHERE user.user_id = orders.userid ) as order_count FROM user WHERE NOT EXISTS (SELECT * from blacklist WHERE blacklist.user_id = user.user_id) ORDER BY order_count DESC", function(err,results){
        res.send(results);
    }) 
})
router.get("/getallfeedback", function(req, res){
    db.query("SELECT name as username,email,phone,comment,date from feedback ORDER BY date DESC", function(err,results){
        res.send(results);
    }) 
})
router.get("/getallblacklist", function(req, res){
    db.query("SELECT user.username,user.email,user.user_id,(SELECT COUNT(*) FROM orders WHERE user.user_id = orders.userid) as order_count FROM user INNER JOIN blacklist ON blacklist.user_id = user.user_id", function(err,results){
        res.send(results);
    }) 
})
router.post("/block",function(req, res){
            var token = req.headers.token;
            var session = req.headers.sessionid;
            var validToken = jwt.JWTVerify(token);
            if(validToken){
                var jwtParse = jwt.JWTParse(token);
                var JWT_SESSION = jwtParse[0].csrf;
                var ROLE = jwtParse[0].role;
                if(JWT_SESSION === session){
                    URL = "SELECT * FROM permission WHERE permission_id = ?";
                    db.query(URL,[jwtParse[0]._pid], function(err, result){
                        if(err){
                            console.log(err);
                        }
                        var permission = (result[0].u_alter == "true");
                        if(permission){
                            var input = req.body;
                            var user_id = input.user_id;
                            db.query("SELECT * FROM blacklist WHERE user_id = ?",[user_id], function(err, result){
                                if(err){
                                    console.log(err);
                                }
                                if(result == ""){
                                    db.query("INSERT INTO blacklist SET user_id = ?",[user_id], function(err, result){
                                        if(err){
                                            console.log(err);
                                            res.json({status:"Failed",message : "Failed to blacklist user!"});
                                        }
                                        res.status(200).json({status:"Success",message : "Account blacklisted!"});
                                    })
                                }
                                else{
                                    res.json({status:"Failed",message : "User already  blacklisted!"});
                                }
                            });
                            }
                            else{
                                res.status(200).json({status:"Failed", message : "Permission Denied !"});
                            }
                    });
                    }
                    else{
                        res.sendStatus(404);
                    }
                }
                else{
                    res.sendStatus(404);
                }
})
router.delete("/unblock",function(req, res){
            var token = req.headers.token;
            var session = req.headers.sessionid;
            var validToken = jwt.JWTVerify(token);
            if(validToken){
                var jwtParse = jwt.JWTParse(token);
                var JWT_SESSION = jwtParse[0].csrf;
                var ROLE = jwtParse[0].role;
                if(JWT_SESSION === session){
                    URL = "SELECT * FROM permission WHERE permission_id = ?";
                    db.query(URL,[jwtParse[0]._pid], function(err, result){
                        if(err){
                            console.log(err);
                        }
                        var permission = (result[0].u_alter == "true");
                        if(permission){
                            var input = req.body;
                            var user_id = input.user_id;
                            db.query("DELETE FROM blacklist WHERE user_id = ?",[user_id], function(err, result){
                                if(err){
                                    console.log(err);
                                    res.json({status:"Failed",message : "Failed to whitelist user!"});
                                }
                                res.status(200).json({status:"Success",message : "Account whitelisted!"});
                            })
                            }
                            else{
                                res.status(200).json({status:"Failed", message : "Permission Denied !"});
                            }
                    });
                    }
                    else{
                        res.sendStatus(404);
                    }
                }
                else{
                    res.sendStatus(404);
                }
})

router.post("/addAddress",[
        check("fullname").isLength({min:2, max:40}).not().isEmpty(),
        check("mobile").isLength({min:3, max:40}).not().isEmpty(),
		check("district").isLength({min:3, max:50}).not().isEmpty(),
		check("house").isLength({min:3, max:75}).not().isEmpty(),
		check("area").isLength({min:3, max:50}).not().isEmpty(),
		check("city").isLength({min:3, max:50}).not().isEmpty(),
		check("pin").isLength({min:3, max:50}).not().isEmpty(),
		check("landmark").isLength({min:0, max:100})
    ], function(req, res){
    var input = req.body;
    console.log(input);
    var errors = validationResult(req);
    var addressId = misc.RandomAddressId();
    if (!errors.isEmpty()) {
        console.log(errors);
        
        return res.json({ message : "Something went wrongg!!" ,status : 404 });
    }
    setTimeout(() => {
            var data = {
                name:input.fullname,
                phone:input.mobile,
                district:input.district,
                house:input.house,
                street:input.area,
                city:input.city,
                pin:input.pin,
                landmark:input.landmark,
                addressid:addressId
            }
                    //insert into database
                    db.query("INSERT INTO address SET ?", [data], function(err,fetchArray){
                        if(err){
                            //throw err;
                            res.json({message : "Something went wrong. try again later!",status:404});
                        }
                        //mailService.EmailVerification(input.email, input.username, Verif_code);
                        res.status(200).json({message : "Address added", status: 200, addressid:addressId});
                    })
        }, 100);
})

router.post("/getuserinfo", function(req,res){
    var token = req.headers.token;
    if(token != ""){
        var valid_token = jwt.JWTVerify(token);
        var TOKEN_DATA = jwt.JWTParse(token);
        if(valid_token){
            var USER_ID = TOKEN_DATA[0]._i;
            db.query("SELECT username, lastname, email,phoneno FROM user WHERE user_id = ?", [USER_ID], function(err,result){
                if(err){
                    console.log(err);
                    
                    res.sendStatus(304);
                }
                res.json(result);
            })
        }else{
            res.sendStatus(404);
        }
    }else{
        res.sendStatus(404);
    }
})

router.post('/updateuserinfo', function(req, res){
    var token = req.headers.token;
    var session = req.headers.sessionid;
    var validToken = jwt.JWTVerify(token);
    var username = req.body.fname;
	var lastname = req.body.lname;
    var phone = req.body.phone;
    if(validToken){
        var jwtParse = jwt.JWTParse(token);
        var JWT_SESSION = jwtParse[0].csrf;
        var ROLE = jwtParse[0].role;
        var user_id = jwtParse[0]._i;
        if(JWT_SESSION === session){
            db.query("UPDATE user SET username= ?, lastname= ?, phoneno= ? WHERE user_id = ?", [username,lastname, phone, user_id], function(err,result){
                if(err){
                    console.log(err);
                    
                    res.sendStatus(304);
                }
                res.json({message:"Successfully updated",status:200}).status(200);
            })
        }else{
            res.sendStatus(404);
        }
    }else{
        res.sendStatus(404);
    }
})


router.post("/updateUserAddress",function(req, res){
    var token = req.headers.token;
    var session = req.headers.sessionid;
    var validToken = jwt.JWTVerify(token);
    if(validToken){
        var jwtParse = jwt.JWTParse(token);
        var JWT_SESSION = jwtParse[0].csrf;
        var ROLE = jwtParse[0].role;
        var user_id = jwtParse[0]._i;
        if(JWT_SESSION === session){
            var addressid = req.body.addressid; 
            db.query("UPDATE user SET shippingAddress = ? WHERE user_id = ?",[addressid, user_id], function(err, result){
                if(err){
                    console.log(err);
                }
                res.sendStatus(200);
            })
        }else{
            res.sendStatus(401);
        }
    }else{
        res.sendStatus(401);
    }
})

router.post("/removeaddressbyuser",function(req, res){
    var token = req.headers.token;
    var session = req.headers.sessionid;
    var validToken = jwt.JWTVerify(token);
    if(validToken){
        var jwtParse = jwt.JWTParse(token);
        var JWT_SESSION = jwtParse[0].csrf;
        var ROLE = jwtParse[0].role;
        var user_id = jwtParse[0]._i;
        if(JWT_SESSION === session){
            var addressid = req.body.addressid; 
            db.query("UPDATE user SET shippingAddress = ? WHERE user_id = ?",["", user_id], function(err, result){
                if(err){
                    console.log(err);
                }
                res.json({message:"Successfully removed",status:200});
            })
        }else{
            res.sendStatus(401);
        }
    }else{
        res.sendStatus(401);
    }
})


module.exports = router;