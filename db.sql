-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: darkVolumes
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category` varchar(255) NOT NULL,
  PRIMARY KEY (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('Action'),('Adventure'),('Comedy'),('Drama'),('Fantasy'),('Fiction'),('Historical'),('Horror'),('Mystery'),('Romance'),('Science Fiction'),('Slice of Life'),('Sports'),('Superhero'),('Thriller');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `volume`
--

DROP TABLE IF EXISTS `volume`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `volume` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `isbn` varchar(13) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `isbn` (`isbn`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `volume`
--

LOCK TABLES `volume` WRITE;
/*!40000 ALTER TABLE `volume` DISABLE KEYS */;
INSERT INTO `volume` VALUES (1,'Attack on Titan','In a world where humanity resides within enormous walled cities...','9784063825034','Hajime Isayama',2009,'attack_on_titan_cover.jpg',120),(2,'Death Note','Light Yagami discovers a mysterious notebook that allows him to kill anyone...','9781421525778','Tsugumi Ohba',2003,'death_note_cover.jpg',90),(3,'My Hero Academia','In a world where nearly everyone has superpowers, Izuku Midoriya aims to become a hero...','9784088818363','Kohei Horikoshi',2014,'my_hero_academia_cover.jpg',80),(4,'Demon Slayer','Tanjiro Kamado seeks to avenge his family and cure his demon-turned sister...','9784088737190','Koyoharu Gotouge',2016,'demon_slayer_cover.jpg',110),(5,'One Punch Man','Saitama, a hero who can defeat any opponent with a single punch, seeks a worthy challenge...','9784088739811','ONE',2009,'one_punch_man_cover.jpg',70),(6,'Fullmetal Alchemist','Two brothers, Edward and Alphonse Elric, search for the Philosopher\'s Stone to restore their bodies...','9784088736940','Hiromu Arakawa',2001,'fullmetal_alchemist_cover.jpg',100),(7,'Hunter x Hunter','Gon Freecss aspires to become a Hunter and find his missing father...','9784088736674','Yoshihiro Togashi',1998,'hunter_x_hunter_cover.jpg',85),(8,'Tokyo Ghoul','Ken Kaneki, a college student, becomes a half-ghoul after a chance encounter with one of these flesh-eating beings...','9784088736216','Sui Ishida',2011,'tokyo_ghoul_cover.jpg',95),(9,'Dragon Ball','Follow the adventures of Goku as he trains in martial arts and searches for the Dragon Balls...','9784088732386','Akira Toriyama',1984,'dragon_ball_cover.jpg',75),(10,'Nausicaä of the Valley of the Wind','In a post-apocalyptic world, Princess Nausicaä must navigate conflicts and environmental issues...','9781421505951','Hayao Miyazaki',1982,'nausicaa_cover.jpg',120),(11,'Black Clover','Asta, a boy born without magic, dreams of becoming the Wizard King...','9784088817212','Yūki Tabata',2015,'black_clover_cover.jpg',95),(12,'Haikyuu!!','Hinata Shoyo aspires to become a great volleyball player and overcome his height disadvantage...','9784088809873','Haruichi Furudate',2012,'haikyuu_cover.jpg',85),(13,'The Promised Neverland','Emma and her friends discover the dark secrets of the orphanage they live in...','9784088736322','Kaiu Shirai',2016,'promised_neverland_cover.jpg',110),(14,'Bleach','Ichigo Kurosaki obtains the powers of a Soul Reaper and must protect the living world from evil spirits...','9784088739891','Tite Kubo',2001,'bleach_cover.jpg',75),(15,'One Piece','Monkey D. Luffy sets out on a journey to find the legendary One Piece and become the Pirate King...','9784088736919','Eiichiro Oda',1997,'one_piece_cover.jpg',120),(16,'Jujutsu Kaisen','Yuji Itadori joins a secret organization to battle curses and protect the world from supernatural threats...','9784088820557','Gege Akutami',2018,'jujutsu_kaisen_cover.jpg',90),(17,'Dr. Stone','Senku Ishigami uses his scientific knowledge to rebuild civilization after a mysterious petrification event...','9784088739873','Riichiro Inagaki',2017,'dr_stone_cover.jpg',100),(18,'Mythical Beast Investigator','A girl named Ferry investigates mythical creatures in a world filled with magic...','9781975307860','Korie Riko',2018,'mythical_beast_investigator_cover.jpg',80),(19,'Naruto','Naruto Uzumaki, a young ninja with dreams of becoming the strongest ninja and leader of his village...','9784088736223','Masashi Kishimoto',1999,'naruto_cover.jpg',110),(20,'Dorohedoro','Caiman, an amnesiac with a lizard head, seeks to uncover the mystery of his transformation...','9784757530043','Q Hayashida',2000,'dorohedoro_cover.jpg',70);
/*!40000 ALTER TABLE `volume` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `volumeCategory`
--

DROP TABLE IF EXISTS `volumeCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `volumeCategory` (
  `id` int NOT NULL,
  `category` varchar(255) NOT NULL,
  PRIMARY KEY (`id`,`category`),
  KEY `category` (`category`),
  CONSTRAINT `volumeCategory_ibfk_1` FOREIGN KEY (`id`) REFERENCES `volume` (`id`),
  CONSTRAINT `volumeCategory_ibfk_2` FOREIGN KEY (`category`) REFERENCES `category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `volumeCategory`
--

LOCK TABLES `volumeCategory` WRITE;
/*!40000 ALTER TABLE `volumeCategory` DISABLE KEYS */;
INSERT INTO `volumeCategory` VALUES (1,'Action'),(2,'Action'),(3,'Action'),(5,'Action'),(6,'Action'),(7,'Action'),(8,'Action'),(9,'Action'),(10,'Action'),(14,'Action'),(16,'Action'),(19,'Action'),(1,'Adventure'),(2,'Adventure'),(6,'Adventure'),(8,'Adventure'),(9,'Adventure'),(11,'Adventure'),(15,'Adventure'),(4,'Fantasy'),(18,'Fantasy'),(20,'Fantasy'),(3,'Mystery'),(4,'Mystery'),(10,'Mystery'),(13,'Mystery'),(17,'Science Fiction'),(12,'Sports'),(5,'Superhero'),(7,'Superhero');
/*!40000 ALTER TABLE `volumeCategory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-14 12:04:17
