const nodemailer = require('nodemailer');
const Hogan = require('hogan.js');
const fs = require('fs');
const ejs = require('ejs');
const handlebars = require('handlebars');
const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv/config');

const mail = {
    service:'Godaddy',
    host: 'smtpout.secureserver.net',
    port: 25,
    secure:false,
    auth: {
        user: 'info@greengavya.com',
        pass: 'gr33nmarbl3'
    }
}
//https://webapplog.com/handlebars/ 

var data = {tags: ['express', 'node', 'javascript']};
var data1 = 
[
    {
        "name": "Onion",
        "quantity": "4",
        "price": "36"
    },
    {
        "name": "Beans",
        "quantity": "12",
        "price": "24"
    }
];

var template = fs.readFileSync("./Mail/emailverification.html", "utf-8");
var emailVerificationTemplate = fs.readFileSync("./Mail/email_verify.html", "utf-8");
var resetpasswordTemplate = fs.readFileSync("./Mail/resetpassword.html", "utf-8");  // reset password
var orderpurchaseTemplate = fs.readFileSync("./Mail/purchasedetails.html", "utf-8");
var orderCancelTemplate = fs.readFileSync("./Mail/Ordercancelmail.html", "utf-8");
var orderRejectTemplate = fs.readFileSync("./Mail/Orderrejectmail.html", "utf-8");
var orderStatusTemplate = fs.readFileSync("./Mail/OrderStatus.html", "utf-8"); // admin
var adminSignupTemplate = fs.readFileSync("./Mail/adminsignup.html", "utf-8"); // admin
var courierSignupTemplate = fs.readFileSync("./Mail/couriersignup.html", "utf-8"); // admin
var orderListTemplate = fs.readFileSync("./Mail/OrderList.html", "utf-8"); // admin

var orderPurchasecompileTemplate = handlebars.compile(orderpurchaseTemplate);
var orderCancelcompileTemplate = handlebars.compile(orderCancelTemplate);
var orderRejectcompileTemplate = handlebars.compile(orderRejectTemplate);
var orderStatuscompileTemplate = handlebars.compile(orderStatusTemplate);
var orderListcompileTemplate = handlebars.compile(orderListTemplate);
var compileTemplate = handlebars.compile(template);
var emailVerifycompileTemplate = handlebars.compile(emailVerificationTemplate);
var resetpasswordcompileTemplate = handlebars.compile(resetpasswordTemplate); // reset password temp
var adminsignupcompileTemplate = handlebars.compile(adminSignupTemplate); // admin
var courierSignupcompileTemplate = handlebars.compile(courierSignupTemplate); // admin

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(smtpTransport({
    service:'Godaddy',
    host: 'smtpout.secureserver.net',
    port: 25,
    secure:false,
    auth: {
        user: 'info@greengavya.com',
        pass: 'gr33nmarbl3'
    }
	
}));
module.exports = {
    
    SentEmail : function(){
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Fred Foo 👻" <sonu.sowibo.com>', // sender address
            to: "sonu.sowibo@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
           // html: "<b>Hello world?</b>" // html body
            //html:compileTemplate({company:"Cissa organics",tags:tags})
            html:compileTemplate()
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + JSON.stringify(response));
            }
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    },
    EmailVerification : function(toAddress, userName, lastname, v_id){
        var URL = "http://www.greengavya.com/verifyaccount/"+v_id;
        let mailOptions = {
            from: '"GreenGavya" <info@greengavya.com>', // sender address
            to: toAddress, // list of receivers
            subject: "Gavya Email Verification", // Subject line
            text: "Green gavya", // plain text body
           // html: "<b>Hello world?</b>" // html body
            //html:compileTemplate({company:"Cissa organics",tags:tags})
            html:emailVerifycompileTemplate({url: URL,username: userName, lastname:lastname})
        };
		let transporter = nodemailer.createTransport(smtpTransport({
			service:'Godaddy',
			host: 'smtpout.secureserver.net',
			port: 25,
			secure:false,
			auth: {
				user: 'info@greengavya.com',
				pass: 'gr33nmarbl3'
			}
			
		}));
				// send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + JSON.stringify(response));
            }
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    },
    resetPassword : function(toAddress, v_id){
        var URL = "http://www.greengavya.com/resetpassword/"+v_id+"/"+toAddress;
        let mailOptions = {
            from: '"GreenGavya" <info@greengavya.com>', // sender address
            to: toAddress, // list of receivers
            subject: "Green gavya Reset password]", // Subject line
            text: "Green gavya", // plain text body
           // html: "<b>Hello world?</b>" // html body
            //html:compileTemplate({company:"Cissa organics",tags:tags})
            html:resetpasswordcompileTemplate({url: URL}),
			attachments:[{
                filename: 'logo.png',
                path: __dirname + '/images/logo.png',
                cid: 'cissa' //same cid value as in the html img src
            }]
        };
		let transporter = nodemailer.createTransport(smtpTransport({
			service:'Godaddy',
			host: 'smtpout.secureserver.net',
			port: 25,
			secure:false,
			auth: {
				user: 'info@greengavya.com',
				pass: 'gr33nmarbl3'
			}
			
		}));
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + JSON.stringify(response));
            }
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    },
    Orderpurchase : function(toAddress,userName,orderId, time, s_date,data,total,address){
		console.log(address[0][0].name);
        console.log(data);
        var addressData = [{name:address[0][0].name,house:address[0][0].house,street:address[0][0].street,city:address[0][0].city,district:address[0][0].district,pin:address[0][0].pin,phone:address[0][0].phone}]
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: mail.service,
            host: mail.host,
            port: mail.port,
            secure: mail.secure, // true for 465, false for other ports
            tls: {rejectUnauthorized: false},
            auth: {
                user: mail.auth.user, // generated ethereal user
                pass: mail.auth.pass // generated ethereal password
            }
        });

        let mailOptions = {
            from: '"GreenGavya" <info@greengavya.com>', // sender address
            to: toAddress, // list of receivers
            subject: "Green gavya order purchase", // Subject line
            text: "Green gavya", // plain text body
           // html: "<b>Hello world?</b>" // html body
            //html:compileTemplate({company:"Cissa organics",tags:tags})
            html:orderPurchasecompileTemplate({orderid:orderId,username:userName,orderid:orderId,Time:time,data:data,s_date:s_date,productData:data,totalPrice:total,address:addressData}),
			attachments: [{
                filename: 'logo.png',
                path: __dirname + '/images/logo.png',
                cid: 'CissaLogo' //same cid value as in the html img src
                },
                {
                    filename: orderId+'.png',
                    path: __dirname + '/qr/'+orderId+'.png',
                    cid: 'qrcode' //same cid value as in the html img src
                }
            ]
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log('====================================');
                console.log("mail error");
                console.log('====================================');
                console.log(error);
            }else{
                console.log('====================================');
                console.log("mailed");
                console.log('====================================');
                console.log("Message sent: " + JSON.stringify(response));
            }
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    },
	OrdercancelMail : function(toAddress,userName,orderId,data,total){
        // create reusable transporter object using the default SMTP transport

        let mailOptions = {
            from: '"GreenGavya" <info@greengavya.com>', // sender address
            to: toAddress, // list of receivers
            subject: "Green Gavya cancel order", // Subject line
            text: "Green Gavya", // plain text body
           // html: "<b>Hello world?</b>" // html body
            //html:compileTemplate({company:"Cissa organics",tags:tags})
            html:orderCancelcompileTemplate({orderid:orderId,username:userName,orderid:orderId,productData:data,totalPrice:total}),
			attachments:[{
                filename: 'logo.png',
                path: __dirname + '/images/logo.png',
                cid: 'CissaLogo' //same cid value as in the html img src
            }]
        };
		let transporter = nodemailer.createTransport(smtpTransport({
			service:'Godaddy',
			host: 'smtpout.secureserver.net',
			port: 25,
			secure:false,
			auth: {
				user: 'info@greengavya.com',
				pass: 'gr33nmarbl3'
			}
			
		}));
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log('====================================');
                console.log("mail error");
                console.log('====================================');
                console.log(error);
            }else{
                console.log('====================================');
                console.log("mailed");
                console.log('====================================');
                console.log("Message sent: " + JSON.stringify(response));
            }
            
        });
    },
		OrderRejectMail : function(toAddress,userName,orderId,data,total){
        // create reusable transporter object using the default SMTP transport

        let mailOptions = {
            from: '"GreenGavya" <info@greengavya.com>', // sender address
            to: toAddress, // list of receivers
            subject: "Green Gavya Order #"+orderId+" Rejected", // Subject line
            text: "Green Gavya", // plain text body
           // html: "<b>Hello world?</b>" // html body
            //html:compileTemplate({company:"Cissa organics",tags:tags})
            html:orderRejectcompileTemplate({orderid:orderId,username:userName,orderid:orderId,productData:data,totalPrice:total}),
			attachments:[{
                filename: 'logo.png',
                path: __dirname + '/images/logo.png',
                cid: 'CissaLogo' //same cid value as in the html img src
            }]
        };
		let transporter = nodemailer.createTransport(smtpTransport({
			service:'Godaddy',
			host: 'smtpout.secureserver.net',
			port: 25,
			secure:false,
			auth: {
				user: 'info@greengavya.com',
				pass: 'gr33nmarbl3'
			}
			
		}));
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log('====================================');
                console.log("mail error");
                console.log('====================================');
                console.log(error);
            }else{
                console.log('====================================');
                console.log("mailed");
                console.log('====================================');
                console.log("Message sent: " + JSON.stringify(response));
            }
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    },
	//admin
	orderStatus : function(toAddress,userName,orderId, time, s_date,data,total,status,status_past,date_prefix){
        // create reusable transporter object using the default SMTP transport

        var email_subject = "";
        if(status_past === "Delivered"){
            email_subject = "Green Gavya order #"+orderId+" Delivered";
        }
        if(status_past === "Picked up"){
            email_subject = "Green Gavya order #"+orderId+" Picked up";
        }
        if(status_past === "Confirmed"){
            email_subject = "Green Gavya order #"+orderId+" Confirmed";
        }
        let mailOptions = {
            from: '"GreenGavya" <info@greengavya.com>', // sender address
            to: toAddress, // list of receivers
            subject: email_subject, // Subject line
            text: "Green Gavya", // plain text body
           // html: "<b>Hello world?</b>" // html body
            //html:compileTemplate({company:"Cissa organics",tags:tags})
            html:orderStatuscompileTemplate({orderid:orderId,username:userName,Time:time,s_date:s_date,productData:data,priceTotal:total,status:status,status_past:status_past,date_prefix:date_prefix}),
            attachments:[{
                filename: 'logo.png',
                path: __dirname + '/images/logo.png',
                cid: 'CissaLogo' //same cid value as in the html img src
            }]
        };
		let transporter = nodemailer.createTransport(smtpTransport({
			service:'Godaddy',
			host: 'smtpout.secureserver.net',
			port: 25,
			secure:false,
			auth: {
				user: 'info@greengavya.com',
				pass: 'gr33nmarbl3'
			}
			
		}));
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log('====================================');
                console.log("mail error");
                console.log('====================================');
                console.log(error);
            }else{
                console.log('====================================');
                console.log("mailed");
                console.log('====================================');
                console.log("Message sent: " + JSON.stringify(response));
            }
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    },
	orderList : function(toAddress,data,total_amt){
        // create reusable transporter object using the default SMTP transport


        let mailOptions = {
            from: '"GreenGavya" <info@greengavya.com>', // sender address
            to: toAddress, // list of receivers
            subject: "[Green Gavya Order List]", // Subject line
            text: "Green Gavya", // plain text body
           // html: "<b>Hello world?</b>" // html body
            //html:compileTemplate({company:"Cissa organics",tags:tags})
            attachments:[{
                filename: 'logo.png',
                path: __dirname + '/images/logo.png',
                cid: 'cissa' //same cid value as in the html img src
            }],
            html:orderListcompileTemplate({productData:data,total_amt:total_amt})
        };
		let transporter = nodemailer.createTransport(smtpTransport({
			service:'Godaddy',
			host: 'smtpout.secureserver.net',
			port: 25,
			secure:false,
			auth: {
				user: 'info@greengavya.com',
				pass: 'gr33nmarbl3'
			}
			
		}));
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log('====================================');
                console.log("mail error");
                console.log('====================================');
                console.log(error);
            }else{
                console.log('====================================');
                console.log("mailed");
                console.log('====================================');
                console.log("Message sent: " + JSON.stringify(response));
            }
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    },
	    adminSignup : function(toAddress, v_id){
        var URL = "http://18.222.178.169:4002/signup/"+v_id+"/"+toAddress;
        let mailOptions = {
            from: '"GreenGavya" <info@greengavya.com>', // sender address
            to: toAddress, // list of receivers
            subject: "[Green Gavya Admin Invitation]", // Subject line
			attachments: [{
				filename: 'logo.png',
				path: './Mail/logo.png',
				cid: 'logo@cissaorganics.com' //same cid value as in the html img src
			}],
            text: "Green Gavya", // plain text body
           // html: "<b>Hello world?</b>" // html body
            //html:compileTemplate({company:"Cissa organics",tags:tags})
            html:adminsignupcompileTemplate({url: URL})
        };
		let transporter = nodemailer.createTransport(smtpTransport({
			service:'Godaddy',
			host: 'smtpout.secureserver.net',
			port: 25,
			secure:false,
			auth: {
				user: 'info@greengavya.com',
				pass: 'gr33nmarbl3'
			}
			
		}));
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + JSON.stringify(response));
            }
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    },	 
	courierSignup : function(toAddress, v_id){
        var URL = "http://18.222.178.169:4002/courier-signup/"+v_id+"/"+toAddress;
        let mailOptions = {
            from: '"GreenGavya" <info@greengavya.com>', // sender address
            to: toAddress, // list of receivers
            subject: "[Green Gavya Courier Invitation]", // Subject line
			attachments: [{
				filename: 'logo.png',
				path: './Mail/logo.png',
				cid: 'logo@cissaorganics.com' //same cid value as in the html img src
			}],
            text: "Green Gavya", // plain text body
           // html: "<b>Hello world?</b>" // html body
            //html:compileTemplate({company:"Cissa organics",tags:tags})
            html:courierSignupcompileTemplate({url: URL})
        };
		let transporter = nodemailer.createTransport(smtpTransport({
			service:'Godaddy',
			host: 'smtpout.secureserver.net',
			port: 25,
			secure:false,
			auth: {
				user: 'info@greengavya.com',
				pass: 'gr33nmarbl3'
			}
			
		}));
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + JSON.stringify(response));
            }
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    },
	EmailOrderList : function(toAddress,path,name){
        let mailOptions = {
            from: '"GreenGavya" <info@greengavya.com>', // sender address
            to: toAddress, // list of receivers
            subject: "Gavya Order List", // Subject line
            text: "Please find the attached Order List", // plain text body
			attachments:[{
				filename: name,
				path: path
			}]
        };
		let transporter = nodemailer.createTransport(smtpTransport({
			service:'Godaddy',
			host: 'smtpout.secureserver.net',
			port: 25,
			secure:false,
			auth: {
				user: 'info@greengavya.com',
				pass: 'gr33nmarbl3'
			}
			
		}));
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + JSON.stringify(response));
            }
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
		return true;
    }
}