/*
SQLyog Community v13.1.6 (64 bit)
MySQL - 5.6.51-log : Database - gavya
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`gavya` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `gavya`;

/*Table structure for table `address` */

DROP TABLE IF EXISTS `address`;

CREATE TABLE `address` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) DEFAULT NULL,
  `phone` varchar(80) DEFAULT NULL,
  `district` varchar(40) DEFAULT NULL,
  `house` varchar(80) DEFAULT NULL,
  `street` varchar(80) DEFAULT NULL,
  `city` varchar(60) DEFAULT NULL,
  `pin` varchar(40) DEFAULT NULL,
  `landmark` text,
  `addressid` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=390 DEFAULT CHARSET=latin1;

/*Table structure for table `admin` */

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(80) DEFAULT NULL,
  `email` varchar(80) DEFAULT NULL,
  `password` text,
  `user_id` varchar(40) DEFAULT NULL,
  `permission_id` varchar(50) DEFAULT NULL,
  `verification_code` text,
  `verified` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

/*Table structure for table `blacklist` */

DROP TABLE IF EXISTS `blacklist`;

CREATE TABLE `blacklist` (
  `id` int(40) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `courier` */

DROP TABLE IF EXISTS `courier`;

CREATE TABLE `courier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(80) DEFAULT NULL,
  `email` varchar(80) DEFAULT NULL,
  `password` text,
  `user_id` varchar(40) DEFAULT NULL,
  `verification_code` text,
  `verified` varchar(20) DEFAULT NULL,
  `current_order` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;

/*Table structure for table `delivery_log` */

DROP TABLE IF EXISTS `delivery_log`;

CREATE TABLE `delivery_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderid` varchar(180) DEFAULT NULL,
  `courierid` text,
  `date` text,
  `status` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=latin1;

/*Table structure for table `faq` */

DROP TABLE IF EXISTS `faq`;

CREATE TABLE `faq` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `subject` text,
  `question` text,
  `answer` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

/*Table structure for table `feedback` */

DROP TABLE IF EXISTS `feedback`;

CREATE TABLE `feedback` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` text,
  `email` text,
  `phone` text,
  `comment` text,
  `date` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=371 DEFAULT CHARSET=latin1;

/*Table structure for table `order_details` */

DROP TABLE IF EXISTS `order_details`;

CREATE TABLE `order_details` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `orderid` varchar(180) DEFAULT NULL,
  `productid` varchar(180) DEFAULT NULL,
  `quantity` varchar(180) DEFAULT NULL,
  `date` varchar(180) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=926 DEFAULT CHARSET=latin1;

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `orderid` varchar(180) DEFAULT NULL,
  `userid` varchar(180) DEFAULT NULL,
  `date` varchar(180) DEFAULT NULL,
  `scheduled_date` varchar(180) DEFAULT NULL,
  `status` varchar(180) DEFAULT NULL,
  `address` varchar(180) DEFAULT NULL,
  `payment_method` text,
  `payment_id` text,
  `delivery_speed` varchar(30) DEFAULT 'standard',
  `views` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=470 DEFAULT CHARSET=latin1;

/*Table structure for table `permission` */

DROP TABLE IF EXISTS `permission`;

CREATE TABLE `permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `permission_id` varchar(50) NOT NULL,
  `p_create` varchar(20) NOT NULL,
  `p_alter` varchar(20) NOT NULL,
  `p_delete` varchar(20) NOT NULL,
  `c_create` varchar(20) NOT NULL,
  `c_alter` varchar(20) NOT NULL,
  `c_delete` varchar(20) NOT NULL,
  `o_alter` varchar(20) NOT NULL,
  `a_create` varchar(20) NOT NULL,
  `a_alter` varchar(20) NOT NULL,
  `a_delete` varchar(20) NOT NULL,
  `u_create` varchar(20) NOT NULL,
  `u_alter` varchar(20) NOT NULL,
  `u_delete` varchar(20) NOT NULL,
  `courier_create` varchar(20) NOT NULL,
  `courier_delete` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=latin1;

/*Table structure for table `price` */

DROP TABLE IF EXISTS `price`;

CREATE TABLE `price` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` text,
  `date` varchar(60) DEFAULT NULL,
  `price` text,
  `cost` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=765 DEFAULT CHARSET=latin1;

/*Table structure for table `product_category` */

DROP TABLE IF EXISTS `product_category`;

CREATE TABLE `product_category` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `category_id` varchar(40) DEFAULT NULL,
  `name` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=latin1;

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) DEFAULT NULL,
  `price` varchar(40) DEFAULT NULL,
  `cost_price` text,
  `quantity` text,
  `img_url` text,
  `availability` varchar(40) DEFAULT NULL,
  `product_id` varchar(40) DEFAULT NULL,
  `translated` varchar(40) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `category_id` varchar(60) DEFAULT NULL,
  `food_type` varchar(60) DEFAULT 'Regular',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=268 DEFAULT CHARSET=latin1;

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(80) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `email` varchar(80) DEFAULT NULL,
  `password` text,
  `user_id` varchar(40) DEFAULT NULL,
  `verified` varchar(20) DEFAULT 'false',
  `verification_code` varchar(80) DEFAULT NULL,
  `referral_code` varchar(40) DEFAULT NULL,
  `phoneno` varchar(40) DEFAULT NULL,
  `shippingAddress` varchar(20) DEFAULT NULL,
  `billingAddress` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
