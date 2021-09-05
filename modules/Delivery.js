const express = require("express");
const router = express.Router();
const db = require("../db/dbconnection");
const jwt = require("../security/Jwt");
const csurf = require('csurf');
var session = require("express-session");
const bcrypt = require("bcryptjs");
const misc = require("../Misc/Misc");
const mail = require("../Mail/MailService");
const { check, validationResult } = require('express-validator/check')

const saltRounds = 10;
const SELECT_ID_BY_EMAIL_FROM_USERDB = "SELECT id from courier WHERE email = ?";
const SELECT_ALL_BY_EMAIL_FROM_USERDB = "SELECT * from courier WHERE email = ?";
const USER_ROLE = 'courier';

router.use(session({secret:"secret", resave:false, saveUninitialized :false}));
var csrfProtection = csurf({ignoreMethods:['POST']});


router.get("/getallcouriers", function(req, res){
db.query("SELECT courier.username,courier.email,courier.user_id,(CASE WHEN courier.current_order = '' THEN 'Free' ELSE 'Active' END)as status,(SELECT COUNT(*) FROM delivery_log WHERE delivery_log.courierid = courier.user_id && status = ? ) as order_count FROM courier ORDER BY order_count DESC",["Delivered"], function(err,results){
res.status(200).json(results);
}) 
})
//courier login
router.post("/login",csrfProtection, function(req, res){
console.log( req.headers['origin'])
var email = req.body.email;
var password = req.body.password;
var csurf_token = req.csrfToken();
db.query(SELECT_ALL_BY_EMAIL_FROM_USERDB, [email], function(err, results){
if(results == ""){
res.status(200).json({status:"Failed", message : "Email or password is incorrect !"});
}else{
if(results[0].verified === "true"){
//compare password
bcrypt.compare(password, results[0].password, function(err, vaild){
if(vaild){
var user_id = results[0].user_id;
var username = results[0].username;
var permission_id = results[0].permission_id;
var token = jwt.JWTAdminSign(user_id,username,"Courier",permission_id,csurf_token);
res.status(200).json({
_uid : results[0].user_id,
token : token,
csrf_token : csurf_token
});

}else{
res.status(200).json({status:"Failed", message : "Email or password is incorrect !"});
}
})
}
else{
res.status(200).json({status:"Failed", message : "Account unverified !"});
}
}
})
})

//post couriers
router.post("/send",
[
check('email').isLength({min:2, max:30}).not().isEmpty().isEmail(),
]
, function(req, res){
var token = req.headers.token;
var session = req.headers.sessionid;
var validToken = jwt.JWTVerify(token);
if(validToken){
var jwtParse = jwt.JWTParse(token);
var JWT_SESSION = jwtParse[0].csrf;
if(JWT_SESSION === session){
URL = "SELECT * FROM permission WHERE permission_id = ?";
db.query(URL,[jwtParse[0]._pid], function(err, result){
if(err){
console.log(err);
}
var permission = (result[0].courier_create == "true");
if(permission){
var input = req.body;

db.query("SELECT * from courier WHERE email = ?",[req.body.email], function(err, result){
if(err){
console.log(err);
}
if(result == ""){
const error = validationResult(req);
if(!error.isEmpty()){
res.status(200).json({status:"Failed", message : error.array()[0].msg});
}else{
var courierData = {
user_id : misc.RandomCourierID(),
username : "Unverified",
verification_code: misc.RandomUserVerificationID(),
verified: "false",
email: input.email
}
db.query("INSERT INTO courier SET ?",[courierData], function(err, result){
if(err){
console.log(err);
res.json({status:"Failed", message : "Failed to add courier!"});
}
mail.courierSignup(input.email,courierData.verification_code);
res.status(200).json({status:"Success", message : "New courier added!"});
})
}
}
else{
res.status(200).json({status:"Failed", message : "Email already active as courier !"});
}
});
}
else{
res.status(200).json({status:"Failed", message : "Permission Denied !"});
}
})
}
else{
res.sendStatus(404);
}
}
else{
res.sendStatus(404);
}
})

router.post("/getopenordercount", function(req, res){
var courierid = req.body.courierid;
var startDate = req.body.start;
var endDate = req.body.end;
db.query("SELECT (SELECT COUNT(orders.id) FROM orders WHERE orders.scheduled_date BETWEEN ? AND ? && orders.status = 'Confirmed') as order_count,(SELECT COUNT(*) FROM orders INNER JOIN user ON orders.userid = user.user_id WHERE status='Pending') as pending_count,(SELECT COUNT(*) FROM delivery_log WHERE delivery_log.courierid = ? && status = 'Delivered' ) as fulfilled_count, (SELECT COUNT(*) FROM delivery_log WHERE delivery_log.courierid = ? && delivery_log.status = 'Picked up') as picked_count",[startDate,endDate,courierid,courierid], function(err, result){
if(err){
console.log(err);
}
res.status(200).json(result);
})
})
router.post("/openorders",function(req,res){
var startDate = req.body.start;
var endDate = req.body.end;
db.query("SELECT orders.orderid,user.username,address.name as addressname,address.district,address.house,address.street,address.city,address.pin,address.landmark,orders.scheduled_date,orders.userid,orders.payment_method,orders.status,(SELECT SUM((SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) *order_details.quantity) FROM order_details WHERE order_details.orderid = orders.orderid) AS total FROM orders INNER JOIN gavya.user ON user.user_id=orders.userid INNER JOIN address ON orders.address = address.addressid WHERE orders.date BETWEEN ? AND ? && orders.status = 'Confirmed' ORDER BY address.district,address.city,address.street",[startDate,endDate], function(err, result){
if(err){
console.log(err);
}
res.status(200).json(result);
})
})
router.put("/status/:id", function(req, res){
    var token = req.headers.token;
    var session = req.headers.sessionid;
    var validToken = jwt.JWTVerify(token);
    if(validToken){
        var jwtParse = jwt.JWTParse(token);
        var JWT_SESSION = jwtParse[0].csrf;
        if(JWT_SESSION === session){
                    var id = req.params.id;
                    var status = req.body.status;
					var total = req.body.total;
                    var status_present = "",date_prefix = "";
                    
					if(status === "Delivered"){
                        status_present = "Delivery";
                        date_prefix = "Delivered on ";
					}
					if(status === "Picked up"){
                        status_present = "Pick up"
                        date_prefix = "Expected on ";
					}
					if(status === "Confirmed"){
                        status_present = "Confirm"
                        date_prefix = "Expected on ";
					}
                    console.log(status+id);
                    db.query("UPDATE orders set status = ? WHERE orderid = ?", [status, id], function(err, result){
                        if(err){
                            res.status(200).json({status:"Failed",message:"Somthing went wrong!"});
                        }
						var emailData = [];
						db.query("SELECT order_details.id,orders.orderid,orders.payment_method,address.name as username,user.email,address.phone,address.district,address.house,address.street,address.city,address.pin,address.landmark,orders.scheduled_date,orders.userid,orders.status,order_details.productid,products.name,products.img_url,order_details.quantity,CONCAT(CONCAT((order_details.quantity * products.quantity),' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) as quan,order_details.date,(SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) as price,order_details.quantity*price as total FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id INNER JOIN address ON orders.address = address.addressid INNER JOIN gavya.user ON user.user_id=orders.userid WHERE orders.orderid = ?", [id], function(err, array){
							
							if(!err){
								emailData.push(array);
							}
                        })
						if(status === "Delivered" || status === "Picked up" || status === "Confirmed"){
							setTimeout(() => {
							var emailParseData = JSON.parse(JSON.stringify(emailData[0]));
                            var scheduled_date = new Date();
                            var date = new Date();
                            scheduled_date.setTime(emailData[0][0].scheduled_date);
                            date.setTime(emailData[0][0].date);
                            var formattedScheduleDate = scheduled_date.toDateString();
                            var formattedDate = date.toDateString();
							mail.orderStatus(emailData[0][0].email,emailData[0][0].username,id,formattedDate,formattedScheduleDate,emailParseData,total,status_present,status,date_prefix);
						}, 100);
						}
						if(status === "Cancelled"){
							setTimeout(() => {
							var emailParseData = JSON.parse(JSON.stringify(emailData[0]));
							
							mail.OrdercancelMail(emailData[0][0].email,emailData[0][0].username,id,emailParseData,total);
						}, 100);
						}
						if(status === "Rejected"){
							setTimeout(() => {
							var emailParseData = JSON.parse(JSON.stringify(emailData[0]));
							
							mail.OrderRejectMail(emailData[0][0].email,emailData[0][0].username,id,emailParseData,total);
						}, 100);
						}
                        res.status(200).json({status:"Success",message : "Order Status Changed!"})
                    })
        }
        else{
            res.sendStatus(404);
        }
    }
    else{
        res.sendStatus(404);
    }
    
})
router.put("/views/:id", function(req, res){
    var token = req.headers.token;
    var session = req.headers.sessionid;
    var validToken = jwt.JWTVerify(token);
    if(validToken){
        var jwtParse = jwt.JWTParse(token);
        var JWT_SESSION = jwtParse[0].csrf;
        if(JWT_SESSION === session){
                    var id = req.params.id;
					var views = req.body.json;
					var test = JSON.stringify(views);
                    db.query("UPDATE orders set views = '"+test+"' WHERE orderid = ?", [id], function(err, result){
                        if(err){
                            res.status(200).json({status:"Failed",message:"Somthing went wrong!"});

                        }
						else{
							res.status(200).json({status:"Success",message : "This order has been marked as viewed!"})
						}
                    })
        }
        else{
            res.sendStatus(404);
        }
    }
    else{
        res.sendStatus(404);
    }
    
})
router.post("/fetchordersbycourierid",function(req,res){
var courierid = req.body.courierid;
db.query("SELECT orders.orderid,user.username,address.name as addressname,address.district,address.house,address.street,address.city,address.pin,address.landmark,orders.scheduled_date,orders.userid,orders.status,(SELECT SUM((SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) *order_details.quantity) FROM order_details WHERE order_details.orderid = orders.orderid) AS total, orders.payment_method FROM orders INNER JOIN gavya.user ON user.user_id=orders.userid INNER JOIN address ON orders.address = address.addressid INNER JOIN delivery_log ON orders.orderid = delivery_log.orderid WHERE delivery_log.courierid = ? && orders.status = 'Picked up'",[courierid], function(err, result){
if(err){
console.log(err);
}
res.status(200).json(result);
})
})
router.post("/getactiveorder",function(req,res){
var courierid = req.body.courierid;
db.query("SELECT current_order from courier where user_id = ?",[courierid], function(err, result){
if(err){
console.log(err);
}
res.status(200).json(result);
})
})
router.post("/pickup",function(req, res){
var orderid = req.body.orderid;
var status = req.body.status;
var date = req.body.date;
var courierid = req.body.courierid;
var total = req.body.total;
var token = req.headers.token;
var session = req.headers.sessionid;
var validToken = jwt.JWTVerify(token);
var log_data = {
orderid: orderid,
courierid: courierid,
date: date,
status: status
}
if(validToken){
var jwtParse = jwt.JWTParse(token);
var JWT_SESSION = jwtParse[0].csrf;
var ROLE = jwtParse[0].role;
if(JWT_SESSION === session){
db.query("UPDATE orders set status = ? WHERE orderid = ? && status = 'Confirmed'",[status,orderid], function(err, result){
if(err){
console.log(err);
res.json({status:"Failed",message : "Order already picked up!"});
}
else{
db.query("UPDATE courier set current_order = ? WHERE user_id = ?", [orderid,courierid], function(err,fetchArray){
if(err){
res.json({message : "Failed to pickup order!"});
}
else{
db.query("INSERT INTO delivery_log SET ?", [log_data], function(err,fetchArray){
if(err){
res.json({message : "Something went wrong. try again later!"});
}
else{
	
		var status_present = "Pick up";
	db.query("UPDATE orders set status = ? WHERE orderid = ?", [status, orderid], function(err, result){
		if(err){
			res.status(200).json({status:"Failed",message:"Somthing went wrong!"});
		}
		var emailData = [];
		db.query("SELECT order_details.id,orders.orderid,orders.payment_method,address.name as username,user.email,address.phone,address.district,address.house,address.street,address.city,address.pin,address.landmark,orders.scheduled_date,orders.userid,orders.status,order_details.productid,products.name,products.img_url,order_details.quantity,CONCAT(CONCAT((order_details.quantity * products.quantity),' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) as quan,order_details.date,(SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) as price,order_details.quantity*price as total FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id INNER JOIN address ON orders.address = address.addressid INNER JOIN gavya.user ON user.user_id=orders.userid WHERE orders.orderid = ?", [orderid], function(err, array){
			
			if(!err){
				emailData.push(array);
			}
		})
		if(status === "Picked up"){
			setTimeout(() => {
			var date_prefix = "Expected on ";
			var scheduled_date = new Date();
			var date = new Date();
			scheduled_date.setTime(emailData[0][0].scheduled_date);
			date.setTime(emailData[0][0].date);
			var formattedScheduleDate = scheduled_date.toDateString();
			var formattedDate = date.toDateString();
			var emailParseData = JSON.parse(JSON.stringify(emailData[0]));
			
			mail.orderStatus(emailData[0][0].email,emailData[0][0].username,orderid,formattedDate,formattedScheduleDate,emailParseData,total,status_present,status,date_prefix);
		}, 100);
		}
		});
		res.status(200).json({status:"Success",message : "Order picked up!"});
}
})
}
})
}
})
}
else{
res.json({status:"Failed",message : "Something went wrong. try again later!"});
}
}
else{
res.sendStatus(404);
}
})
router.post("/delivered",function(req, res){
var orderid = req.body.orderid;
var status = req.body.status;
var total = req.body.total;
var date = req.body.date;
var courierid = req.body.courierid;
var token = req.headers.token;
var session = req.headers.sessionid;
var validToken = jwt.JWTVerify(token);
if(validToken){
var jwtParse = jwt.JWTParse(token);
var JWT_SESSION = jwtParse[0].csrf;
var ROLE = jwtParse[0].role;
if(JWT_SESSION === session){

db.query("UPDATE orders set status = ? WHERE orderid = ?",[status,orderid], function(err, result){
if(err){
console.log(err);
res.json({status:"Failed",message : "Failed to deliver order!"});
}
else{
db.query("UPDATE courier set current_order = ? WHERE user_id = ?", ["",courierid], function(err,fetchArray){
if(err){
res.json({message : "Something went wrong. try again later!"});
}
else{
db.query("UPDATE delivery_log set status = ? WHERE orderid = ?", [status,orderid], function(err,fetchArray){
if(err){
res.json({message : "Something went wrong. try again later!"});
}
else{
	var status_present = "Delivery";
	db.query("UPDATE orders set status = ? WHERE orderid = ?", [status, orderid], function(err, result){
		if(err){
			res.status(200).json({status:"Failed",message:"Somthing went wrong!"});
		}
		var emailData = [];
		db.query("SELECT order_details.id,orders.orderid,orders.payment_method,address.name as username,user.email,address.phone,address.district,address.house,address.street,address.city,address.pin,address.landmark,orders.scheduled_date,orders.userid,orders.status,order_details.productid,products.name,products.img_url,order_details.quantity,CONCAT(CONCAT((order_details.quantity * products.quantity),' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) as quan,order_details.date,(SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) as price,order_details.quantity*price as total FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id INNER JOIN address ON orders.address = address.addressid INNER JOIN gavya.user ON user.user_id=orders.userid WHERE orders.orderid = ?", [orderid], function(err, array){
			
			if(!err){
				emailData.push(array);
			}
		})
		if(status === "Delivered"){
			setTimeout(() => {
			var emailParseData = JSON.parse(JSON.stringify(emailData[0]));
			var date_prefix = "Delivered on ";
			var scheduled_date = new Date();
			var date = new Date();
			scheduled_date.setTime(emailData[0][0].scheduled_date);
			date.setTime(emailData[0][0].date);
			var formattedScheduleDate = scheduled_date.toDateString();
			var formattedDate = date.toDateString();
			var emailParseData = JSON.parse(JSON.stringify(emailData[0]));
			mail.orderStatus(emailData[0][0].email,emailData[0][0].username,orderid,formattedDate,formattedScheduleDate,emailParseData,total,status_present,status,date_prefix);
		}, 100);
		}
		});
		res.status(200).json({status:"Success",message : "Order delivery notified!"});
}
})
}
});
}
}) 
}
else{
res.json({status:"Failed",message : "Order already delivered!"});
}
}
else{
res.sendStatus(404);
}
})

router.post("/signup", function(req, res){
var v_code = req.body.verify_code;
var email = req.body.email;
var name = req.body.name;
var newPassword = req.body.password;
console.log(email + "" + newPassword);
if(v_code !== ""&&email !== ""&&newPassword !== ""){
bcrypt.genSalt(10, function(err, salt) {
bcrypt.hash(newPassword, salt, function(err,results){
if(err){
res.status(404);
}else{
db.query("UPDATE courier SET password = ?,username = ?,verified = ? WHERE email= ? AND verification_code = ?", [results,name,"true",email, v_code], function(err, result){
console.log(result)
if(err){
res.status(404);
}else{
res.status(200).json({status:"Success",message:"Account Activated"});
}
})
}
})
})
}else{
res.status(200).json({status:"Failed",message:"Signup Failed"});
}
})

router.get("/verifysignup", function(req, res){
var email = req.headers.email;
db.query("SELECT verified from courier WHERE email = ?",[email], function(err, result){
if(result == ""){
res.status(404).json({status:"Failed", message : "Unauthorized access"});
}
else{
res.status(200).json(result);
}
if(err){
console.log(err);
}
})
})

router.delete("/:id", function(req, res){
var token = req.headers.token;
var session = req.headers.sessionid;
var validToken = jwt.JWTVerify(token);
if(validToken){
var jwtParse = jwt.JWTParse(token);
var JWT_SESSION = jwtParse[0].csrf;
if(JWT_SESSION === session){
URL = "SELECT * FROM permission WHERE permission_id = ?";
db.query(URL,[jwtParse[0]._pid], function(err, result){
if(err){
console.log(err);
}
var permission = (result[0].courier_delete == "true");
if(permission){
var id = req.params.id;
var permission_id = req.body.permission_id;
db.query("DELETE FROM courier WHERE user_id = ?", [ id ], function(err, results){
if(err){
res.status(200).json({status:"Failed",message:"Something went wrong!"});
}
else{
res.status(200).json({status:"Success",message : "Courier removed successfully !"})
}
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


module.exports = router;