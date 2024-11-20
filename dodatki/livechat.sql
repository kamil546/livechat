-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Lis 20, 2024 at 01:28 AM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `livechat`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `chat_users`
--

CREATE TABLE `chat_users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(18) NOT NULL,
  `email` varchar(32) NOT NULL,
  `pass_hash` varchar(255) NOT NULL,
  `avatar_path` varchar(255) DEFAULT NULL,
  `bg_path` varchar(255) DEFAULT NULL,
  `theme_id` int(11) NOT NULL DEFAULT 1,
  `ipaddr` varchar(15) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `lastactive_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `chat_users`
--

INSERT INTO `chat_users` (`user_id`, `username`, `email`, `pass_hash`, `avatar_path`, `bg_path`, `theme_id`, `ipaddr`, `created_time`, `lastactive_time`) VALUES
(3, 'kamil111', 'kamil111@fsd.pl', '$2a$08$R2OdA3i17h4RfWf3.mS1VeKZXPn/VKYFBCZv9575APHTgBErHrLC.', '', '', 1, '::1', '2024-11-14 00:53:11', '2024-11-14 00:53:11'),
(4, 'kamil111', 'kamil111@gdsf.pl', '$2a$08$5idSF.FbttQM6trZCzln7.QrOTAbAYdPzy9v.XmZZ77PpiHH95LPC', NULL, NULL, 1, '::1', '2024-11-14 13:22:12', '2024-11-14 13:22:12'),
(5, 'kamil1132', 'kamil1132@frsdf.pl', '$2a$08$5Sanlt7oE4ERpn8xIEsGQ.FAHYPIMDj3dG5uQi42t/IKIgbv8sMXW', NULL, NULL, 1, '::1', '2024-11-14 13:22:39', '2024-11-14 13:22:39'),
(6, 'kamil111', 'kamil111@gdsf.pl', '$2a$08$BPPoJVzt7NoHsqMOObjBZ.Y9PRKijZ5brjGecOqBiQz9kGmT4qWIm', NULL, NULL, 1, '::1', '2024-11-14 13:25:00', '2024-11-14 13:25:00'),
(7, 'kamil111', 'kamil111@gfg.pl', '$2a$08$e30XkQVdKvDhhvHC7KiFlOHo3Tp3oOZLseHOaGVEq.GeZi3rAgTfy', NULL, NULL, 1, '::1', '2024-11-14 13:35:37', '2024-11-14 13:35:37'),
(8, 'kamil1112', 'kamil111@gdsf.pl', '$2a$08$Zv0HZ.LjhYMU8th/jLviluzKmPrPr0uizdzlx.f3ugTE1MyiROAgi', NULL, NULL, 1, '::1', '2024-11-14 13:46:15', '2024-11-14 13:46:15'),
(9, 'kamil1112312312', 'kamil546@fsd.pl', '$2a$08$opkDQHTKZVNzRxUiSx.31.Y9Y8k5LdSduw7zAb2OYP4mQt9jgikUK', NULL, NULL, 1, '::1', '2024-11-14 13:51:13', '2024-11-14 13:51:13'),
(10, 'kamil113xd1', 'kamil113xd1@dfsf.pl', '$2a$10$.XTQSvzQkgJViDcwEg8oP.CUcT9U3Bo8oUnTm3w/ispHuORH3nRCi', NULL, NULL, 1, '::1', '2024-11-14 15:21:19', '2024-11-14 15:21:19'),
(11, 'kamil114', 'dsdasda@fsd.pl', '$2a$10$ZQQRQ5noNP5n2FWBe0cgROrluk3lE9hfMG4ON.kUgxsTvw9Iqe6sy', NULL, NULL, 1, '::1', '2024-11-16 17:41:04', '2024-11-16 17:41:04'),
(12, 'kamil111432424', 'kamifsdf@fsdf.pl', '$2a$10$P742SNNH4M65WUoSGpiFlurgo9VaprwsP8o.K1yZqKQ1H0K7v1g/.', NULL, NULL, 1, '::1', '2024-11-16 17:44:31', '2024-11-16 17:44:31'),
(13, 'Hxhc', 'hchfd@jdkd.com', '$2a$10$cA/bWs95QNBQQSH5O/pE8ellB6830ACvduNV7J2fEBt7co6W9u.Q2', NULL, NULL, 1, '::ffff:192.168.', '2024-11-16 18:02:46', '2024-11-16 18:02:46'),
(14, '123', 'dasd@fds.pl', '$2a$10$rgTiVymgVDFxUT4XMyQCgeaHC/YRDXPqF6SSImwC0yhQILWSQWe2C', NULL, NULL, 1, '::1', '2024-11-17 01:34:45', '2024-11-17 01:34:45'),
(15, 'test', 'test@g.pl', '$2a$10$gl/JDCBHUfDThCQiWV4EX.RE/oYyrwbOSs/hlmty/K6VnrRg/bE0a', NULL, NULL, 1, '::1', '2024-11-17 01:50:48', '2024-11-17 01:50:48'),
(16, 'test2112', 'test2112@da.pl', '$2a$10$jT1RgWWT4E3P82loH4eKHeCt6zRmoJkSt.K41B0DOc0S0i5e4MtJq', NULL, NULL, 1, '::1', '2024-11-17 01:51:18', '2024-11-17 01:51:18');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `chat_users`
--
ALTER TABLE `chat_users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_users`
--
ALTER TABLE `chat_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
