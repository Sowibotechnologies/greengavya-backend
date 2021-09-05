const nodemailer = require('nodemailer');
const Hogan = require('hogan.js');
const fs = require('fs');
const ejs = require('ejs');
const handlebars = require('handlebars');
const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv/config');

var orderpurchaseTemplate = fs.readFileSync("./Mail/Adminpurchasedetails.html", "utf-8");

var orderPurchasecompileTemplate = handlebars.compile(orderpurchaseTemplate);
module.exports = {
    adminOrderpurchaseInvoice : function(toAddress,userName,orderId, time, s_date,data,total,address,speed){
		console.log(address[0][0].name);
        console.log(data);
        var addressData = [{name:address[0][0].name,house:address[0][0].house,street:address[0][0].street,city:address[0][0].city,district:address[0][0].district,pin:address[0][0].pin,phone:address[0][0].phone}]
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            tls: {rejectUnauthorized: false},
            auth: {
                user: process.env.ORDERLIST_EMAIL_ID, // generated ethereal user
                pass: process.env.ORDERLIST_EMAIL_PASSWORD // generated ethereal password
            }
        });

        let mailOptions = {
            from: '"Green gavya" <greengavya.orderlist@gmail.com>', // sender address
            to:process.env.RECEPIENT_ADMIN_ID, // list of receivers
            subject: "[Green gavya Order purchase invoice copy]", // Subject line
            text: "Green gavya", // plain text body
           // html: "<b>Hello world?</b>" // html body
            //html:compileTemplate({company:"Cissa organics",tags:tags})
            html:orderPurchasecompileTemplate({orderid:orderId,username:userName,orderid:orderId,Time:time,data:data,s_date:s_date,productData:data,totalPrice:total,address:addressData,speed:speed}),
			
        };
        // send mail with defined transport object
        console.log(transporter);
        
        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log('====================================');
                console.log("mail error");
                console.log('====================================');
                console.log(error);
            }else{
                console.log('====================================');
                console.log("mail to admin");
                console.log('====================================');
                console.log("Message sent: " + JSON.stringify(response));
            }
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    }
}