/*
SQLyog Community v10.12 
MySQL - 5.5.20-log : Database - seaking
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`seaking` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `seaking`;

/*Table structure for table `sk_serverlist` */

DROP TABLE IF EXISTS `sk_serverlist`;

CREATE TABLE `sk_serverlist` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `mongoDbId` varchar(60) NOT NULL DEFAULT '' COMMENT 'mongoDbId',
  `name` varchar(60) NOT NULL DEFAULT '' COMMENT 'name',
  `ip` varchar(60) NOT NULL DEFAULT '' COMMENT 'ip',
  `port` int(4) NOT NULL DEFAULT '0' COMMENT 'port',
  `connectNumber` int(10) NOT NULL DEFAULT '0' COMMENT 'connectNumber',
  `date` int(10) NOT NULL DEFAULT '0' COMMENT '日期',
  `showName` varchar(60) NOT NULL DEFAULT '' COMMENT 'showName',
  `bz` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 - 可用 2 - 不可用',
  `updateBz` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 - 新增 2 - 已更新到mongoDB',
  PRIMARY KEY (`id`),
  KEY `index_mongoDbId` (`mongoDbId`),
  KEY `index_bz` (`bz`),
  KEY `index_updateBz` (`updateBz`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `sk_serverlist` */

insert  into `sk_serverlist`(`id`,`mongoDbId`,`name`,`ip`,`port`,`connectNumber`,`date`,`showName`,`bz`,`updateBz`) values (1,'','server1','hg.wozlla.com',8002,0,1356686745,'华东区',1,1),(2,'','server2','hg.wozlla.com',8002,0,1356767555,'华北区',1,1);

/*Table structure for table `uc_user` */

DROP TABLE IF EXISTS `uc_user`;

CREATE TABLE `uc_user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `mongoDbId` varchar(60) NOT NULL DEFAULT '' COMMENT 'mongoDbId',
  `loginName` varchar(60) NOT NULL DEFAULT '' COMMENT 'loginName',
  `password` varchar(60) NOT NULL DEFAULT '' COMMENT 'password',
  `nickname` varchar(60) NOT NULL DEFAULT '' COMMENT 'nickname',
  `registerType` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 - 登录名 2 - email 3 - phoneNum',
  `email` varchar(100) NOT NULL DEFAULT '' COMMENT 'email',
  `phoneNum` bigint(11) NOT NULL DEFAULT '0' COMMENT 'phoneNum',
  `country` varchar(60) NOT NULL DEFAULT '' COMMENT 'country',
  `province` varchar(60) NOT NULL DEFAULT '' COMMENT 'province',
  `city` varchar(60) NOT NULL DEFAULT '' COMMENT 'city',
  `birthdate` int(10) NOT NULL DEFAULT '0' COMMENT 'birthdate',
  `registerDate` int(10) NOT NULL DEFAULT '0' COMMENT 'registerDate',
  `DATE` int(10) NOT NULL DEFAULT '0' COMMENT '日期',
  `bz` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 - 可用 2 - 不可用',
  `updateBz` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 - 新增 2 - 已更新到mysql',
  PRIMARY KEY (`id`),
  KEY `index_mongoDbId` (`mongoDbId`),
  KEY `index_login` (`loginName`,`password`),
  KEY `index_loginName` (`loginName`),
  KEY `index_bz` (`bz`),
  KEY `index_updateBz` (`updateBz`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `uc_user` */

insert  into `uc_user`(`id`,`mongoDbId`,`loginName`,`password`,`nickname`,`registerType`,`email`,`phoneNum`,`country`,`province`,`city`,`birthdate`,`registerDate`,`DATE`,`bz`,`updateBz`) values (1,'','html5','65e232ed43477b2f5cb4413023548fce','html5',1,'',0,'','','',0,1356785206,1356785206,1,1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
