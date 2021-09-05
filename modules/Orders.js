const express = require('express');
const router = express.Router();
const jwt = require("../security/Jwt");
const db = require("../db/dbconnection");
const mail = require("../Mail/MailService");
var formidable = require('formidable');
const dbservice = require('../db/Dbservice');

//get all orders by user id
 /* router.post("/orderbyid", function(req, res){
    var token = req.headers.token;
    var session = req.headers.sessionid;
    var validToken = jwt.JWTVerify(token);
    if(validToken){
        var jwtParse = jwt.JWTParse(token);
        var JWT_SESSION = jwtParse[0].csrf;
        var USER_ID = jwtParse[0]._i;
        if(JWT_SESSION === session){
            //SELECT * FROM `orders` ORDER BY CAST(date as signed) DESC
            db.query("SELECT * FROM orders WHERE userid = ? ORDER BY CAST(date as signed) DESC", [USER_ID], function(err, array){
                if(!err){
                    res.json(array);
                }else{
                    console.log(err);
                }
            })
        }else{
            res.sendStatus(404);
        }
    }else{
        res.sendStatus(404);
    }
}) 
*/
//Admin
router.post("/mailbyorder",function(req,res){
	var name = req.headers.name;
	var email = req.headers.email;
	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		if(mail.EmailOrderList(email,files.csv.path,name)){
			res.status(200).json({status:"Success",message:"Email sent successfully"});
		}
	
	});
	
})
//Admin
router.post("/getallbyorder",function(req,res){
    var startDate = req.body.start;
    var endDate = req.body.end;
    db.query("SELECT order_details.id,orders.orderid,user.username,user.email,user.phoneno,orders.scheduled_date,orders.userid,orders.status,order_details.productid,products.name,order_details.quantity,CONCAT(CONCAT((order_details.quantity * products.quantity),' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) as quan,products.price, order_details.date FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id  INNER JOIN user ON user.user_id=orders.userid WHERE order_details.date BETWEEN ? AND ? && orders.status = 'Confirmed' ORDER BY IF((orders.status = 'Delivered' || orders.status = 'Cancelled'|| orders.status = 'Picked up') , TRUE,FALSE),CAST(orders.date as SIGNED) DESC",[startDate,endDate], function(err, result){
        if(err){
            console.log(err);
        }
        res.status(200).json(result);
    })
})
//Client
router.post("/orderlengthbyid", function(req, res){
    // SELECT order_details.id,orders.orderid,orders.scheduled_date,orders.status,order_details.productid,products.name, (products.price * order_details.quantity) as total,CONCAT(CONCAT((order_details.quantity * products.quantity),' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) as quantity,products.price, order_details.date FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id WHERE orders.userid = ? order by CAST(orders.date as SIGNED) DESC
    var token = req.headers.token;
    var session = req.headers.sessionid;
    var validToken = jwt.JWTVerify(token);
    if(validToken){
        var jwtParse = jwt.JWTParse(token);
        var JWT_SESSION = jwtParse[0].csrf;
        var USER_ID = jwtParse[0]._i;
        if(JWT_SESSION === session){
            //SELECT * FROM `orders` ORDER BY CAST(date as signed) DESC
            db.query("SELECT order_details.id,orders.orderid,orders.address as addressid,address.name as addressname,address.phone as addressphone,address.district as addressdistrict,address.house as addresshouse,address.street as addressstreet,address.city as addresscity,address.landmark as addresslandmark,address.pin as addresspin, orders.scheduled_date,orders.status,order_details.productid,products.name,products.img_url, (products.price * order_details.quantity) as total,products.quantity as quantity,order_details.quantity as order_quantity,CONCAT(CONCAT((order_details.quantity * products.quantity),' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) as total_quantity,products.price, order_details.date FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id INNER JOIN address ON orders.address = address.addressid WHERE orders.userid = ? order by CAST(orders.date as SIGNED) DESC", [USER_ID], function(err, array){
                if(!err){
                    res.json(array.length);
                }else{
                    console.log(err);
                }
            })
        }else{
            res.sendStatus(404);
        }
    }else{
        res.sendStatus(404);
    }
})
//Client
 router.post("/orderbyid", function(req, res){
    // SELECT order_details.id,orders.orderid,orders.scheduled_date,orders.status,order_details.productid,products.name, (products.price * order_details.quantity) as total,CONCAT(CONCAT((order_details.quantity * products.quantity),' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) as quantity,products.price, order_details.date FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id WHERE orders.userid = ? order by CAST(orders.date as SIGNED) DESC
    var token = req.headers.token;
    var session = req.headers.sessionid;
	var pageLoad = req.body.orderperpage;
	//console.log(session+"-----");
    var validToken = jwt.JWTVerify(token);
    if(validToken){
        var jwtParse = jwt.JWTParse(token);
        var JWT_SESSION = jwtParse[0].csrf;
		//console.log(JWT_SESSION);
        var USER_ID = jwtParse[0]._i;
        if(JWT_SESSION === session){
            //SELECT * FROM `orders` ORDER BY CAST(date as signed) DESC
            db.query("SELECT order_details.id,orders.orderid,orders.payment_method as payment,orders.address as addressid,orders.delivery_speed,address.name as addressname,address.phone as addressphone,address.district as addressdistrict,address.house as addresshouse,address.street as addressstreet,address.city as addresscity,address.landmark as addresslandmark,address.pin as addresspin, orders.scheduled_date,orders.status,order_details.productid,products.name,products.img_url, ((SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) * order_details.quantity) as total,products.quantity as quantity,order_details.quantity as order_quantity,CONCAT(CONCAT((order_details.quantity * products.quantity),' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) as total_quantity,(SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) as price, order_details.date FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id INNER JOIN address ON orders.address = address.addressid WHERE orders.userid = ? order by CAST(orders.date as SIGNED) DESC LIMIT 0, ?", [USER_ID, pageLoad], function(err, array){
                if(!err){
                    res.json(array);
                }else{
                    console.log(err);
                }
            })
        }else{
            res.sendStatus(404);
        }
    }else{
        res.sendStatus(404);
    }
})
//Order by id sorted(Updated)
router.post("/orderbyidsorted", function(req, res){
    // SELECT order_details.id,orders.orderid,orders.scheduled_date,orders.status,order_details.productid,products.name, (products.price * order_details.quantity) as total,CONCAT(CONCAT((order_details.quantity * products.quantity),' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) as quantity,products.price, order_details.date FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id WHERE orders.userid = ? order by CAST(orders.date as SIGNED) DESC
    var token = req.headers.token;
    var session = req.headers.sessionid;
	var pageLoad = req.body.orderperpage;
	//console.log(session+"-----");
    var validToken = jwt.JWTVerify(token);
    if(validToken){
        var jwtParse = jwt.JWTParse(token);
        var JWT_SESSION = jwtParse[0].csrf;
		//console.log(JWT_SESSION);
        var USER_ID = jwtParse[0]._i;
        if(JWT_SESSION === session){
            //SELECT * FROM `orders` ORDER BY CAST(date as signed) DESC
            db.query("SELECT order_details.id,orders.orderid,orders.payment_method as payment,orders.address as addressid,orders.delivery_speed,address.name as addressname,address.phone as addressphone,address.district as addressdistrict,address.house as addresshouse,address.street as addressstreet,address.city as addresscity,address.landmark as addresslandmark,address.pin as addresspin, orders.scheduled_date,orders.status,order_details.productid,products.name,products.img_url, ((SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) * order_details.quantity) as total,products.quantity as quantity,order_details.quantity as order_quantity,CONCAT(CONCAT((order_details.quantity * products.quantity),' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) as total_quantity,(SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) as price, order_details.date FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id INNER JOIN address ON orders.address = address.addressid WHERE orders.userid = ? order by CAST(orders.date as SIGNED) DESC", [USER_ID, pageLoad], function(err, array){
                if(!err){
                    var arr = array;
                    var data = [];
                    var o_id = new Set();
                    arr.map((i,j) => {
                        o_id.add(arr[j].orderid);
                    })
                    var orderdata = {};
                    Array.from(o_id).map((n) => {
                        var item = [];
                        var orderdetails = {};
                        arr.map((i,j) => { 
                            if(n == i.orderid){
                                Object.assign(orderdetails, {"orderid":i.orderid,"payment":i.payment,"addressid":i.addressid,"delivery_speed":i.delivery_speed,"addressname":i.addressname,"addressphone":i.addressphone,"addressdistrict":i.addressdistrict,"addresshouse":i.addresshouse,"addresscity":i.addresscity,"addresslandmark":i.addresslandmark,"addresspin":i.addresspin,"scheduled_date":i.scheduled_date,"status":i.status,"date":i.date})
                                item.push({"productid":i.productid,"name":i.name,"img_url":i.img_url,"total":i.total,"quantity":i.quantity,"order_quantity":i.order_quantity,"total_quantity":i.total_quantity,"price":i.price});
                                Object.assign(orderdetails, {"products": item})
                            }
                        })
                        data.push(orderdetails)
                    })
                    res.json(data);
                }else{
                    console.log(err);
                }
            })
        }else{
            res.sendStatus(404);
        }
    }else{
        res.sendStatus(404);
    }
})
//test
router.post("/orderbyidtest", function(req, res){
            //SELECT * FROM `orders` ORDER BY CAST(date as signed) DESC
            db.query("SELECT order_details.id,orders.orderid,orders.payment_method as payment,orders.address as addressid,orders.delivery_speed,address.name as addressname,address.phone as addressphone,address.district as addressdistrict,address.house as addresshouse,address.street as addressstreet,address.city as addresscity,address.landmark as addresslandmark,address.pin as addresspin, orders.scheduled_date,orders.status,order_details.productid,products.name,products.img_url, ((SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) * order_details.quantity) as total,products.quantity as quantity,order_details.quantity as order_quantity,CONCAT(CONCAT((order_details.quantity * products.quantity),' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) as total_quantity,(SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) as price, order_details.date FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id INNER JOIN address ON orders.address = address.addressid WHERE orders.userid = '14008402243767' order by CAST(orders.date as SIGNED) DESC", [], function(err, array){
                if(!err){
                    var arr = array;
                    var data = [];
                    var o_id = new Set();
                    arr.map((i,j) => {
                        o_id.add(arr[j].orderid);
                    })
                    var orderdata = {};
                    Array.from(o_id).map((n) => {
                        console.log(n);
                        var item = [];
                        var orderdetails = {};
                        arr.map((i,j) => { 
                            if(n == i.orderid){
                                Object.assign(orderdetails, {"orderid":i.orderid,"payment":i.payment,"addressid":i.addressid,"delivery_speed":i.delivery_speed,"addressname":i.addressname,"addressphone":i.addressphone,"addressdistrict":i.addressdistrict,"addresshouse":i.addresshouse,"addresscity":i.addresscity,"addresslandmark":i.addresslandmark,"addresspin":i.addresspin,"scheduled_date":i.scheduled_date,"status":i.status,"date":i.date})
                                item.push({"productid":i.productid,"name":i.name,"img_url":i.img_url,"total":i.total,"quantity":i.quantity,"order_quantity":i.order_quantity,"total_quantity":i.total_quantity,"price":i.price});
                                Object.assign(orderdetails, {"products": item})
                            }
                        })
                        console.log(orderdetails);
                        
                        data.push(orderdetails)
                    })

                    res.json(data);
                }else{
                    console.log(err);
                }
            })
})
//Client
router.post("/productsbyorderid", function(req, res){
    var orderId = req.body.orderid;
    if(orderId != undefined){
        var data = [];
        db.query("SELECT * from order_details WHERE orderid = ?", [orderId], function(err, array){
            var usersRows = JSON.parse(JSON.stringify(array));
            if(!err){
                Object.keys(usersRows).map(i => {
                    var product_id = usersRows[i].productid;
                    db.query("SELECT * FROM products WHERE product_id = ?",[product_id], function(err, result){
                        var productRows = JSON.parse(JSON.stringify(result));
                        var it;
                        Object.keys(productRows).map(j => {
                            it = {orderdetails:usersRows[i], productdetails:productRows[j]}
                            data.push(it)
                        })
                    })
                })
            }
            setTimeout(() => {
                res.json(data);
            }, 100);
            
        })
    }
})
//Admin 
//NB:Check if required!
router.post("/productdetailformail", function(req, res){
    var orderId = req.body.orderid;
    if(orderId != undefined){
        var data = [];
        db.query("SELECT products.name, order_details.quantity,products.price FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id WHERE orders.orderid = ?", [orderId], function(err, array){
            var usersRows = JSON.parse(JSON.stringify(array));
            if(!err){
                res.json(array)
            }
        })
    }
})

//Client
router.post("/cancelorder", function(req, res){
    var orderid = req.body.orderid;
    console.log(orderid);
    
    var TOKEN = req.headers.token;
    var SESSIONID = req.headers.sessionid;
    if(TOKEN != undefined && SESSIONID != undefined){
        var valid_token = jwt.JWTVerify(TOKEN);
        var TOKEN_DATA = jwt.JWTParse(TOKEN);
        var cancelStatus = "Cancelled";
        if(valid_token){
            var csrf = TOKEN_DATA[0].csrf;
            var userId = TOKEN_DATA[0]._i;
            if(csrf === SESSIONID){
                var userDetails = dbservice.UserdetailsById(userId);
                var username=''
                var email='';
                setTimeout(() => {
                    if(userDetails[0] != ""){
                        userDetails.map(i => {
                            username = i[0].username,
                            email = i[0].email
                            
                        })
                    }
                    //update status
                    db.query("UPDATE orders set status = ? WHERE orderid = ?", [cancelStatus, orderid], function(err, result){
                        if(!err){
                            setTimeout(() => {
                                console.log(username + "" + email);
                                    var emailData = [];
                                    db.query("SELECT products.name, order_details.quantity,products.price,order_details.quantity * products.price as 'total' FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id WHERE orders.orderid = ?", [orderid], function(err, array){
                                        
                                        if(!err){
                                            emailData.push(array);
                                        }
                                    })
                                    setTimeout(() => {
                                        var emailParseData = JSON.parse(JSON.stringify(emailData[0]));
                                        var totalPrice = 0;
                                        emailParseData.map(item => {
                                            totalPrice += parseInt(item.total);
                                        })
										//send mail
                                        mail.OrdercancelMail(email,username,orderid,emailParseData,totalPrice);
                                    }, 100);
                                   
                                }, 1000);
                                //response
                            res.json({message:"Order successfully cancelled"});
                        }else{
                            console.log(err);
                            
                            res.json({message:"Something went wrong!!"});
                        }
                    })

                }, 100);
            }else{
                res.json({message: "Failed to cancel order!!"});
            }
        }else{
            res.json({message: "Failed to cancel order!!"});
        }
    }
})
//Admin
router.post("/getall",function(req,res){
    var startDate = req.body.start;
    var endDate = req.body.end;
	var currentPage = req.body.currentPage;
	var itemsPerPage = req.body.itemsPerPage;
	var statusFilterArray = req.body.statusFilterArray;
	var firstItemIndex = req.body.firstItemIndex;
	console.log(currentPage);
	db.query("SELECT COUNT(*) as order_count FROM orders INNER JOIN address ON orders.address = address.addressid WHERE orders.status IN (?) AND orders.date BETWEEN ? AND ?",[statusFilterArray,startDate,endDate], function(err, resultset){
    if(err){
    console.log(err);
    }
	else{
		db.query("SELECT orders.orderid,orders.delivery_speed,orders.views,user.username,address.name as addressname,(SELECT SUM((SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) *order_details.quantity) FROM order_details WHERE order_details.orderid = orders.orderid) AS total,courier.username as courier_name,delivery_log.courierid,address.district,address.house,address.street,address.city,address.pin,address.landmark,orders.scheduled_date,orders.userid,orders.status,orders.payment_method FROM orders INNER JOIN address ON orders.address = address.addressid INNER JOIN gavya.user ON user.user_id=orders.userid LEFT JOIN delivery_log ON orders.orderid = delivery_log.orderid LEFT JOIN courier ON delivery_log.courierid = courier.user_id WHERE orders.status IN (?) AND orders.date BETWEEN ? AND ? ORDER BY FIELD(orders.status,'Pending','Confirmed','Picked up','Delivered','Rejected','Cancelled') LIMIT ?,?",[statusFilterArray,startDate,endDate,firstItemIndex,itemsPerPage], function(err, result){

		if(err){
		console.log(err);
		}
		var data = {orders: result, order_count:resultset[0].order_count};		
		res.status(200).json(data);
		})
	}
    })
})
//Admin
router.post("/testorderbyorderid",function(req,res){
    var orderId = req.body.orderId;
	console.log("OrderID: "+ orderId);
    db.query("SELECT order_details.id,orders.orderid,orders.views,orders.delivery_speed,orders.payment_method,user.username,address.name as addressname,user.email,address.phone,address.district,address.house,address.street,address.city,address.pin,address.landmark,orders.scheduled_date,orders.userid,orders.status,order_details.productid,products.name,products.img_url,order_details.quantity,CONCAT(CONCAT((order_details.quantity * products.quantity),' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) as quan,order_details.date,(SELECT price FROM price WHERE price.product_id = order_details.productid && price.date <= order_details.date ORDER BY (price.date - order_details.date) DESC LIMIT 1) as price FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN products ON order_details.productid = products.product_id INNER JOIN address ON orders.address = address.addressid INNER JOIN gavya.user ON user.user_id=orders.userid WHERE orders.orderid = ? ",[orderId], function(err, result){
    if(err){
    console.log(err);
    }
	console.log(result);
    res.status(200).json(result);
    })
})
//Admin
router.post("/getByProduct",function(req,res){
    var startDate = req.body.start;
    var endDate = req.body.end;
    console.log(startDate);
    console.log(endDate);
    db.query("SELECT orders.userid,orders.status,order_details.productid,products.name,products.img_url,products.quantity as unit_quantity,order_details.quantity,products.price,products.cost_price, order_details.date,CONCAT(CONCAT(SUM(CASE WHEN (orders.status = 'Confirmed') THEN order_details.quantity ELSE 0 END) * products.quantity,' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) AS quan FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN user ON user.user_id=orders.userid INNER JOIN products ON order_details.productid = products.product_id WHERE orders.date BETWEEN ? AND ? AND orders.status = 'Confirmed' GROUP BY order_details.productid HAVING quan != 0 ORDER BY quan DESC",[startDate,endDate], function(err, result){
    if(err){
    console.log(err);
    }
    res.status(200).json(result);
    })
})
//Admin
router.post("/mailByProduct",function(req,res){
    var startDate = req.body.start;
    var endDate = req.body.end;
    var email = req.body.email;
    console.log(startDate);
    console.log(endDate);
    db.query("SELECT orders.userid,orders.status,order_details.productid,products.name,products.img_url,products.quantity as unit_quantity,order_details.quantity,products.price,products.cost_price, order_details.date,CONCAT(CONCAT(SUM(CASE WHEN (orders.status = 'Confirmed') THEN order_details.quantity ELSE 0 END) * products.quantity,' '),SUBSTRING_INDEX(SUBSTRING_INDEX(products.quantity, ' ', 2), ' ', -1)) AS quan FROM orders INNER JOIN order_details ON orders.orderid=order_details.orderid INNER JOIN user ON user.user_id=orders.userid INNER JOIN products ON order_details.productid = products.product_id WHERE orders.date BETWEEN ? AND ? AND orders.status = 'Confirmed' GROUP BY order_details.productid HAVING quan != 0 ORDER BY quan DESC",[startDate,endDate], function(err, result){
    if(err){
    console.log(err);
    res.status(200).json({status:"Failed", message : "Email not sent !"});
    }
    else{
    var i;
    var total_amt = 0;
    for(i=0;i<result.length;i++) 
    { 
    var quantity = result[i].quan.split(" ")[0];
    var unit = result[i].quan.split(" ")[1];
    if(quantity >= 1000){
    if(unit === 'gm'){
    quantity = quantity/1000;
    unit = 'kg';
    }
    if(unit === 'ml'){
    quantity = quantity/1000;
    unit = 'L';
    }
    }
    var total_cost = (result[i].quan.split(' ')[0] / result[i].unit_quantity.split(' ')[0]) * result[i].cost_price;
    total_cost = Math.round(total_cost * 100) / 100;
    total_amt += total_cost;
    result[i].total = total_cost;
    result[i].quan = quantity+" "+unit;
    } 
    mail.orderList(email,result,total_amt);
    res.status(200).json({status:"Success", message : "Email successfully sent !"});
    }
    })
})
//Admin
router.put("/status/:id", function(req, res){
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
                var permission = (result[0].o_alter == "true");
                if(permission){
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
//Client
router.post("/removeOrderProduct", function(req, res){
    //delete from order_details
    var orderid = req.body.orderid;
    var productid = req.body.productid;
    if(orderid !== ""&& productid !== ""){
        db.query("DELETE FROM order_details WHERE orderid = ? AND productid = ?", [orderid, productid], function(err, result){
            if(err){
                res.sendStatus(404)
            }else{
                res.json({message:"Product Deleted!"});
            }
        })
    }else{
        res.sendStatus(404);
    }
})
//Client
router.post("/rmvunwantedorder", function(req, res){
    var orderid = req.body.orderid;
    if(orderid !== ""){
        db.query("DELETE FROM orders WHERE orderid = ? ",[orderid] ,function(err, result){
            if(err){
                console.log(err);
                
                res.sendStatus(404);
            }else{
                res.json("Order deleted!")
            }
        })
    }else{
        res.sendStatus(404);
    }
})


module.exports = router;