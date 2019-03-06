-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: multibank
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bankcheque`
--

DROP TABLE IF EXISTS `bankcheque`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bankcheque` (
  `bank_id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `other` varchar(100) DEFAULT NULL,
  `minimum_balance` varchar(100) DEFAULT NULL,
  `cut_balance` varchar(100) DEFAULT NULL,
  `signature` varchar(100) DEFAULT NULL,
  `items_bank_cheque` varchar(255) DEFAULT NULL,
  `items_round` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`bank_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bankcheque`
--

LOCK TABLES `bankcheque` WRITE;
/*!40000 ALTER TABLE `bankcheque` DISABLE KEYS */;
INSERT INTO `bankcheque` VALUES (17,'Pob','123456','OK','120000','120000','API','123343451100','125000');
/*!40000 ALTER TABLE `bankcheque` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact` (
  `contact_id` int(11) NOT NULL AUTO_INCREMENT,
  `mobile` varchar(10) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`contact_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES (1,'0989998887','pob@gmail.com','Pob123'),(10,'0989876765','joe@gmail.com','Joe'),(13,'0989878760','po@gmail.com','OK');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_number` varchar(10) DEFAULT NULL,
  `account_name` varchar(200) DEFAULT NULL,
  `account_branch` varchar(4) DEFAULT NULL,
  `reference_number1` varchar(20) DEFAULT NULL,
  `download_time` varchar(5) DEFAULT NULL,
  `client_code` varchar(255) DEFAULT NULL,
  `reference_number2` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'100223','Azay190','2540','4444','10:05','010','000000111');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holiday`
--

DROP TABLE IF EXISTS `holiday`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `holiday` (
  `holiday_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `holiday_name` varchar(200) DEFAULT NULL,
  `holiday_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`holiday_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holiday`
--

LOCK TABLES `holiday` WRITE;
/*!40000 ALTER TABLE `holiday` DISABLE KEYS */;
INSERT INTO `holiday` VALUES (1,'Meeting','2018-08-29 18:51:03'),(2,'Test','2018-10-11 00:00:00');
/*!40000 ALTER TABLE `holiday` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `menu_id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL,
  `privilege` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`item_id`,`user_id`,`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=372 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (294,'Bank Signature Management',6,28,'M_BANKSIGNATURE_MANAGEMENT'),(295,'Customer Management',7,28,'M_CUSTOMER_MANAGEMENT'),(296,'System Admin',2,28,'M_SYSTEMADMIN'),(351,'Bank/Branch Management',4,22,'M_BANKBRANCH_MANAGEMENT'),(352,'Daily Process',9,22,'M_DAILAY_PROCESS'),(353,'Report',10,22,'M_REPORT'),(354,'User Management',3,22,'M_USERMANAGEMENT'),(355,'Holiday Management',5,22,'M_HOLIDAY_MANAGEMENT'),(356,'Bank Signature Management',6,22,'M_BANKSIGNATURE_MANAGEMENT'),(357,'Home',1,30,'M_HOME'),(358,'Bank Signature Management',6,30,'M_BANKSIGNATURE_MANAGEMENT'),(359,'Customer Management',7,30,'M_CUSTOMER_MANAGEMENT'),(360,'Holiday Management',5,31,'M_HOLIDAY_MANAGEMENT'),(361,'Cheque Management',8,31,'M_CHEQUE_MANAGEMENT'),(362,'Home',1,21,'M_HOME'),(363,'Bank/Branch Management',4,21,'M_BANKBRANCH_MANAGEMENT'),(364,'Bank Signature Management',6,21,'M_BANKSIGNATURE_MANAGEMENT'),(365,'Cheque Management',8,21,'M_CHEQUE_MANAGEMENT'),(366,'Report',10,21,'M_REPORT'),(367,'System Admin',2,21,'M_SYSTEMADMIN'),(368,'User Management',3,21,'M_USERMANAGEMENT'),(369,'Holiday Management',5,21,'M_HOLIDAY_MANAGEMENT'),(370,'Customer Management',7,21,'M_CUSTOMER_MANAGEMENT'),(371,'Daily Process',9,21,'M_DAILAY_PROCESS');
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_detail`
--

DROP TABLE IF EXISTS `log_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log_detail` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` text,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_detail`
--

LOCK TABLES `log_detail` WRITE;
/*!40000 ALTER TABLE `log_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menu` (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL DEFAULT '0',
  `privilege` varchar(255) NOT NULL,
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'Home','M_HOME'),(2,'System Admin','M_SYSTEMADMIN'),(3,'User Management','M_USERMANAGEMENT'),(4,'Bank/Branch Management','M_BANKBRANCH_MANAGEMENT'),(5,'Holiday Management','M_HOLIDAY_MANAGEMENT'),(6,'Bank Signature Management','M_BANKSIGNATURE_MANAGEMENT'),(7,'Customer Management','M_CUSTOMER_MANAGEMENT'),(8,'Cheque Management','M_CHEQUE_MANAGEMENT'),(9,'Daily Process','M_DAILAY_PROCESS'),(10,'Report','M_REPORT');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_nb4h0p6txrmfc0xbrd1kglp9t` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (2,'ROLE_ADMIN'),(1,'ROLE_USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_log`
--

DROP TABLE IF EXISTS `user_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_log` (
  `user_id` bigint(20) DEFAULT NULL,
  `log_id` bigint(20) DEFAULT NULL,
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_log`
--

LOCK TABLES `user_log` WRITE;
/*!40000 ALTER TABLE `user_log` DISABLE KEYS */;
INSERT INTO `user_log` VALUES (1,1);
/*!40000 ALTER TABLE `user_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `fk_user_roles_role_id` (`role_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (21,1),(22,1),(28,1),(30,1),(31,1);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(40) NOT NULL,
  `username` varchar(15) NOT NULL,
  `email` varchar(40) NOT NULL,
  `password` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `login_count` int(3) DEFAULT NULL,
  `last_login` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (21,'17','70003017','17@gmail.com','$2a$10$vFFsEwzcefcVAOd0N2WsHO0brqHn5DFLygxvPTTMTR861qiWo8tEq','01','180.183.41.57',21,'2018-11-23 13:43:48'),(22,'Test18','70003018','18@gmail.com','$2a$10$UHJGX4JigKZmcKyRPietDOAa9lcObvmQzBps9ZMLyvdU/PoN/.olS','02','180.183.41.57',0,NULL),(28,'User 11','70003011','11@hotmail.com','$2a$10$9iRIGljBjdrmA9m/njmHtOcOfQoSXLF7biwM.J4TEOSCaIF4zlj..','02','180.183.41.57',1,'2018-10-25 11:13:48'),(30,'12','70003012','12@gmail.com','$2a$10$3ywEq2NSt8tqPdQi10XppO4q4zk1R2.eO5Pi.Lm/zd9rFcdQnIkx2','02','180.183.41.57',1,'2018-10-25 12:04:39'),(31,'14','70003014','14@gmail.com','$2a$10$sNQ946ErXtKWcYXb.7aGEO8mu1YJvTJQM.BwiW.c7BYukcORED08q','02','180.183.41.57',2,'2018-10-25 12:05:46');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-11-28 11:24:14
