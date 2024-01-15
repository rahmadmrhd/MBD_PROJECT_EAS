-- Active: 1700739113891@@127.0.0.1@3307@pos

/*--Kelompok 1
--NIM : 1462200004 David D.
--NIM : 1462200006 Mashuri F.
--NIM : 1462200015 Nur Kholil R.
--NIM : 1462200017 Rahmad Maulana
*/
DROP DATABASE IF EXISTS `pos`;
CREATE DATABASE `pos`;
USE `pos`;

CREATE TABLE `log` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `tabel_name` VARCHAR(100) NOT NULL,
    `employee_id` INTEGER UNSIGNED NOT NULL,
    `data_id` INTEGER UNSIGNED NOT NULL,
    `operation` VARCHAR(50) NOT NULL,
    `action` TEXT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `customer` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(25) NOT NULL,
    `password` TEXT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `gender` ENUM('L', 'P') NOT NULL,
    `no_telp` VARCHAR(20) NOT NULL,
    `birthdate` DATE NOT NULL,
    `token` TEXT NULL,
    `image` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    UNIQUE INDEX `customer_username_unique`(`username`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `employee` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(25) NOT NULL,
    `password` TEXT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `gender` ENUM('L', 'P') NULL,
    `no_telp` VARCHAR(20) NULL,
    `role` ENUM('ADMIN', 'CASHIER'),
    `token` TEXT NULL,
    `image` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
    UNIQUE INDEX `employee_username_unique`(`username`),
    PRIMARY KEY (`id`)
);

/* default username : admin password:admin */
INSERT INTO `employee` (`username`, `password`, `name`, `role`, `token`) 
VALUES ("admin","$2b$10$aG9UlwoMUC0eoV/tixze..CGWSCcjr56Mcmq/IAuT29XpJVfkdWT.","ADMIN", "ADMIN", "89fd688a-c4b0-469c-9a9d-236fb33687dd");

CREATE TABLE `category` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `order` INTEGER UNSIGNED NOT NULL,
    `icon` VARCHAR(255) NULL,
    `last_update_by` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
    UNIQUE INDEX `category_name_unique`(`name`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `table` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(10) NOT NULL,
    `available` TINYINT(1) UNSIGNED NOT NULL DEFAULT true,
    `capacity` TINYINT UNSIGNED NOT NULL,
    `last_update_by` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
    UNIQUE INDEX `table_unique`(`name`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `menu_favorite` (
    `menu_id` INTEGER UNSIGNED NOT NULL,
    `customer_id` INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (`menu_id`, `customer_id`)
);

CREATE TABLE `menu` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `price` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL DEFAULT 0,
    `available` TINYINT(1) UNSIGNED NOT NULL DEFAULT true,
    `image` VARCHAR(255) NULL,
    `last_update_by` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
    UNIQUE INDEX `menu_unique`(`category_id`, `name`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `menu_option` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `menu_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `min` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `max` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `last_update_by` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
    UNIQUE INDEX `menu_option_name_key`(`name`, `menu_id`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `menu_option_item` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `menu_option_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `price` DOUBLE NOT NULL DEFAULT 0,
    `available` TINYINT(1) UNSIGNED NOT NULL DEFAULT true,
    `last_update_by` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
    UNIQUE INDEX `menu_option_item_unique`(`name`, `menu_option_id`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `cart`(
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT ,
    `customer_id` INTEGER UNSIGNED NOT NULL,
    `menu_id` INTEGER UNSIGNED NOT NULL,
    `qty` INTEGER UNSIGNED NOT NULL,
    `note` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
    PRIMARY KEY (`id`)
);
CREATE TABLE `cart_detail`(
    `cart_id` INTEGER UNSIGNED NOT NULL,
    `menu_option_item_id` INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (`cart_id`, `menu_option_item_id`)
);

CREATE TABLE `order` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_code` VARCHAR(20) NOT NULL,
    `customer_id` INTEGER UNSIGNED NULL,
    `employee_id` INTEGER UNSIGNED NULL,
    `table_id` INTEGER UNSIGNED NOT NULL,
    `note` TEXT NULL,
    `voucher_id` INTEGER UNSIGNED NULL,
    `ppn` DOUBLE NOT NULL,
    `status` ENUM('WAITING_CONFIRMATION', 'IN_PROCESS', 'DONE', 'CANCELED') NOT NULL DEFAULT 'WAITING_CONFIRMATION',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
    PRIMARY KEY (`id`),
    UNIQUE INDEX `order_code_unique`(`order_code`)
);

CREATE TABLE `order_detail` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER UNSIGNED NOT NULL,
    `menu_id` INTEGER UNSIGNED NULL,
    `name_menu` VARCHAR(100) NOT NULL,
    `price` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL DEFAULT 0,
    `image` VARCHAR(255) NULL,
    `qty` TINYINT UNSIGNED NOT NULL,
    `note` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);
CREATE TABLE `order_detail_option` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_detail_id` INTEGER UNSIGNED NOT NULL,
    `name_option` VARCHAR(100) NOT NULL,
    `name_option_item` VARCHAR(100) NOT NULL,
    `price` DOUBLE NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `rating` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER UNSIGNED NOT NULL,
    `rate` DOUBLE UNSIGNED NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
    PRIMARY KEY (`id`)
    UNIQUE INDEX `rating_unique`(`order_id`),

);

CREATE TABLE `menu_rating` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `rating_id` INTEGER UNSIGNED NOT NULL,
    `menu_id` INTEGER UNSIGNED NOT NULL,
    `rate` DOUBLE NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
    UNIQUE INDEX `menu_rating_unique`(`rating_id`, `menu_id`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `voucher` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(25) NOT NULL,
    `description` TEXT NULL,
    `discount` DOUBLE NOT NULL,
    `min_purchase` DOUBLE NOT NULL,
    `max_discount` DOUBLE NOT NULL,
    `max_use` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `qty` TINYINT UNSIGNED NOT NULL,
    `expired_at` DATETIME NOT NULL,
    `last_update_by` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
    UNIQUE INDEX `voucher_code_unique`(`code`),
    PRIMARY KEY (`id`)
);

-- CREATE TABLE `log_voucher` (
--     `order_id` INTEGER UNSIGNED NOT NULL,
--     `total_discount` DOUBLE NOT NULL,
--     `voucher_code` VARCHAR(25) NOT NULL,
--     PRIMARY KEY (`order_id`)
-- );

CREATE TABLE `reservation` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(25) NOT NULL,
    `table_id` INTEGER UNSIGNED NULL,
    `table_name` VARCHAR(10) NULL,
    `customer_id` INTEGER UNSIGNED NULL,
    `customer_name` VARCHAR(255) NOT NULL,
    `customer_no_telp` VARCHAR(20) NOT NULL,
    `note` TEXT NULL,
    `total_guests` TINYINT UNSIGNED NOT NULL,
    `datetime` DATETIME NOT NULL,
    `status` ENUM('CONFIRMED', 'WAITING_CONFIRMATION', 'CANCELED') NOT NULL DEFAULT 'WAITING_CONFIRMATION',
    `type` ENUM('CUSTOMER', 'EMPLOYEE') NOT NULL,
    `last_update_by` INTEGER UNSIGNED NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
    PRIMARY KEY (`id`)
);


-- CREATE RELATION
ALTER TABLE `log` 
    ADD CONSTRAINT `log_employee_id_fkey` 
        FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `category` 
    ADD CONSTRAINT `category_last_update_by_fkey` 
        FOREIGN KEY (`last_update_by`) REFERENCES `employee`(`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `table` 
    ADD CONSTRAINT `table_last_update_by_fkey` 
        FOREIGN KEY (`last_update_by`) REFERENCES `employee`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `menu_favorite` 
    ADD CONSTRAINT `menu_favorite_menu_id_fkey` 
        FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `menu_favorite_customer_id_fkey` 
        FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `menu` 
    ADD CONSTRAINT `menu_category_id_fkey` 
        FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `menu_last_update_by_fkey` 
        FOREIGN KEY (`last_update_by`) REFERENCES `employee`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `menu_option` 
    ADD CONSTRAINT `menu_option_menu_id_fkey` 
        FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `menu_option_last_update_by_fkey` 
        FOREIGN KEY (`last_update_by`) REFERENCES `employee`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `menu_option_item` 
    ADD CONSTRAINT `menu_option_item_menu_option_id_fkey` 
        FOREIGN KEY (`menu_option_id`) REFERENCES `menu_option`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `menu_option_item_last_update_by_fkey` 
        FOREIGN KEY (`last_update_by`) REFERENCES `employee`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `order` 
    ADD CONSTRAINT `order_customer_id_fkey` 
        FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `order_employee_id_fkey` 
        FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `order_table_id_fkey` 
        FOREIGN KEY (`table_id`) REFERENCES `table`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `order_voucher_id_fkey` 
        FOREIGN KEY (`voucher_id`) REFERENCES `voucher`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `order_detail` 
    ADD CONSTRAINT `order_detail_order_id_fkey` 
        FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `order_detail_menu_id_fkey` 
        FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) 
            ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `order_detail_option` 
    ADD CONSTRAINT `order_detail_option_order_detail_id_fkey` 
        FOREIGN KEY (`order_detail_id`) REFERENCES `order_detail`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `cart` 
    ADD CONSTRAINT `cart_customer_id_fkey` 
        FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `cart_menu_id_fkey` 
        FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `cart_detail` 
    ADD CONSTRAINT `cart_detail_cart_id_fkey` 
        FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `cart_detail_menu_option_item_id_fkey` 
        FOREIGN KEY (`menu_option_item_id`) REFERENCES `menu_option_item`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `rating` 
    ADD CONSTRAINT `rating_order_id_fkey` 
        FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `menu_rating` 
    ADD CONSTRAINT `menu_rating_rating_id_fkey` 
        FOREIGN KEY (`rating_id`) REFERENCES `rating`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `menu_rating_menu_id_fkey` 
        FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `voucher` 
    ADD CONSTRAINT `voucher_last_update_by_fkey` 
        FOREIGN KEY (`last_update_by`) REFERENCES `employee`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `reservation` 
    ADD CONSTRAINT `reservation_customer_id_fkey` 
        FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) 
            ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT `reservation_table_id_fkey` 
        FOREIGN KEY (`table_id`) REFERENCES `table`(`id`) 
            ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT `reservation_last_update_by_fkey` 
        FOREIGN KEY (`last_update_by`) REFERENCES `employee`(`id`) 
            ON DELETE CASCADE ON UPDATE CASCADE;

-- CREATE TRIGGER
DELIMITER $$
CREATE TRIGGER `category_AFTER_INSERT` AFTER INSERT ON `category` FOR EACH ROW
BEGIN
	INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ('category', NEW.id, NEW.last_update_by, 'INSERT', CONCAT('Membuat kategori baru \"', NEW.name,'\"'));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `category_AFTER_DELETE` AFTER DELETE ON `category` FOR EACH ROW
BEGIN
	INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ('category', OLD.id, OLD.last_update_by, 'DELETE', CONCAT('Membuat kategori baru \"', OLD.name,'\"'));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `category_AFTER_UPDATE` AFTER UPDATE ON `category` FOR EACH ROW
BEGIN
    DECLARE action TEXT DEFAULT 'Diubah pada\n';
    
    IF OLD.name <> NEW.name THEN
        SET action  = CONCAT(action, 'name: ', OLD.name, ' -> ', NEW.name, '\n');
    END IF;
    IF OLD.`order` <> NEW.`order` THEN
        SET action  = CONCAT(action, 'order: ', OLD.`order`, ' -> ', NEW.`order`, '\n');
    END IF;
    IF OLD.icon <> NEW.icon THEN
        SET action  = CONCAT(action, 'icon: ', OLD.icon, ' -> ', NEW.icon, '\n');
    END IF;
    
    IF  (OLD.name <> NEW.name) OR 
        (OLD.`order` <> NEW.`order`) OR 
        (OLD.icon <> NEW.icon) THEN
        SET action  = CONCAT(action, 'name: ', OLD.name, ' -> ', NEW.name, '\n');
        INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
        ("category", NEW.id, NEW.last_update_by, "UPDATE", action);
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `menu_AFTER_INSERT` AFTER INSERT ON `menu` FOR EACH ROW
BEGIN
	INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ('menu', NEW.id, NEW.last_update_by, 'INSERT', CONCAT('Membuat menu baru \"', NEW.name,'\"'));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `menu_AFTER_DELETE` AFTER DELETE ON `menu` FOR EACH ROW
BEGIN
	INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ('menu', OLD.id, OLD.last_update_by, 'DELETE', CONCAT('Menghapus menu \"', OLD.name,'\"'));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `menu_AFTER_UPDATE` AFTER UPDATE ON `menu` FOR EACH ROW
BEGIN
    DECLARE action TEXT DEFAULT 'Diubah pada\n';
    
    IF OLD.category_id <> NEW.category_id THEN
        SET action  = CONCAT(action, 'category_id: ', OLD.category_id, ' -> ', NEW.category_id, '\n');
    END IF;
    IF OLD.name <> NEW.name THEN
        SET action  = CONCAT(action, 'name: ', OLD.name, ' -> ', NEW.name, '\n');
    END IF;
    IF OLD.description <> NEW.description THEN
        SET action  = CONCAT(action, 'description: ', OLD.description, ' -> ', NEW.description, '\n');
    END IF;
    IF OLD.price <> NEW.price THEN
        SET action  = CONCAT(action, 'price: ', OLD.price, ' -> ', NEW.price, '\n');
    END IF;
    IF OLD.discount <> NEW.discount THEN
        SET action  = CONCAT(action, 'discount: ', OLD.discount, ' -> ', NEW.discount, '\n');
    END IF;
    IF OLD.available <> NEW.available THEN
        SET action  = CONCAT(action, 'available: ', OLD.available, ' -> ', NEW.available, '\n');
    END IF;

    IF  (OLD.category_id <> NEW.category_id) OR 
        (OLD.name <> NEW.name) OR 
        (OLD.description <> NEW.description) OR 
        (OLD.price <> NEW.price) OR 
        (OLD.discount <> NEW.discount) OR 
        (OLD.available <> NEW.available) THEN
    INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ("menu", NEW.id, NEW.last_update_by, "UPDATE", action);
    END IF;
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER `menu_option_AFTER_INSERT` AFTER INSERT ON `menu_option` FOR EACH ROW
BEGIN
	INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ('menu_option', NEW.id, NEW.last_update_by, 'INSERT', CONCAT('Membuat menu_option baru \"', NEW.name,'\"'));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `menu_option_AFTER_DELETE` AFTER DELETE ON `menu_option` FOR EACH ROW
BEGIN
	INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ('menu_option', OLD.id, OLD.last_update_by, 'DELETE', CONCAT('Menghapus menu_option \"', OLD.name,'\"'));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `menu_option_AFTER_UPDATE` AFTER UPDATE ON `menu_option` FOR EACH ROW
BEGIN
    DECLARE action TEXT DEFAULT 'Diubah pada\n';
    
    IF OLD.name <> NEW.name THEN
        SET action  = CONCAT(action, 'name: ', OLD.name, ' -> ', NEW.name, '\n');
    END IF;
    IF OLD.min <> NEW.min THEN
        SET action  = CONCAT(action, 'min: ', OLD.min, ' -> ', NEW.min, '\n');
    END IF;
    IF OLD.max <> NEW.max THEN
        SET action  = CONCAT(action, 'max: ', OLD.max, ' -> ', NEW.max, '\n');
    END IF;

    IF  (OLD.name <> NEW.name) OR 
        (OLD.min <> NEW.min) OR 
        (OLD.max <> NEW.max) THEN
    INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ("menu_option", NEW.id, NEW.last_update_by, "UPDATE", action);
    END IF;
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER `menu_option_item_AFTER_INSERT` AFTER INSERT ON `menu_option_item` FOR EACH ROW
BEGIN
	INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ('menu_option_item', NEW.id, NEW.last_update_by, 'INSERT', CONCAT('Membuat menu_option_item baru \"', NEW.name,'\"'));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `menu_option_item_AFTER_DELETE` AFTER DELETE ON `menu_option_item` FOR EACH ROW
BEGIN
	INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ('menu_option_item', OLD.id, OLD.last_update_by, 'DELETE', CONCAT('Menghapus menu_option_item \"', OLD.name,'\"'));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `menu_option_item_AFTER_UPDATE` AFTER UPDATE ON `menu_option_item` FOR EACH ROW
BEGIN
    DECLARE action TEXT DEFAULT 'Diubah pada\n';
    
    IF OLD.name <> NEW.name THEN
        SET action  = CONCAT(action, 'name: ', OLD.name, ' -> ', NEW.name, '\n');
    END IF;
    IF OLD.price <> NEW.price THEN
        SET action  = CONCAT(action, 'price: ', OLD.price, ' -> ', NEW.price, '\n');
    END IF;

    IF  (OLD.name <> NEW.name) OR 
        (OLD.price <> NEW.price) THEN
    INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ("menu_option_item", NEW.id, NEW.last_update_by, "UPDATE", action);
    END IF;
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER `voucher_AFTER_INSERT` AFTER INSERT ON `voucher` FOR EACH ROW
BEGIN
	INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ('voucher', NEW.id, NEW.last_update_by, 'INSERT', CONCAT('Membuat voucher baru \"', NEW.code,'\"'));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `voucher_AFTER_DELETE` AFTER DELETE ON `voucher` FOR EACH ROW
BEGIN
	INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ('voucher', OLD.id, OLD.last_update_by, 'DELETE', CONCAT('Menghapus voucher \"', OLD.code,'\"'));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `voucher_AFTER_UPDATE` AFTER UPDATE ON `voucher` FOR EACH ROW
BEGIN
    DECLARE action TEXT DEFAULT 'Diubah pada\n';
    
    IF OLD.discount <> NEW.discount THEN
        SET action  = CONCAT(action, 'discount: ', OLD.discount, ' -> ', NEW.discount, '\n');
    END IF;
    IF OLD.min_purchase <> NEW.min_purchase THEN
        SET action  = CONCAT(action, 'min_purchase: ', OLD.min_purchase, ' -> ', NEW.min_purchase, '\n');
    END IF;
    IF OLD.max_discount <> NEW.max_discount THEN
        SET action  = CONCAT(action, 'max_discount: ', OLD.max_discount, ' -> ', NEW.max_discount, '\n');
    END IF;
    IF OLD.qty <> NEW.qty THEN
        SET action  = CONCAT(action, 'qty: ', OLD.qty, ' -> ', NEW.qty, '\n');
    END IF;
    IF OLD.expired_at <> NEW.expired_at THEN
        SET action  = CONCAT(action, 'expired_at: ', OLD.expired_at, ' -> ', NEW.expired_at, '\n');
    END IF;

    IF  (OLD.discount <> NEW.discount) OR 
        (OLD.min_purchase <> NEW.min_purchase) OR 
        (OLD.max_discount <> NEW.max_discount) OR 
        (OLD.qty <> NEW.qty) OR 
        (OLD.expired_at <> NEW.expired_at) THEN
    INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ("voucher", NEW.id, NEW.last_update_by, "UPDATE", action);
    END IF;
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER `reservation_AFTER_INSERT` AFTER INSERT ON `reservation` FOR EACH ROW
BEGIN
	INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ('reservation', NEW.id, NEW.last_update_by, 'INSERT', 'Membuat reservation baru');
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `reservation_AFTER_DELETE` AFTER DELETE ON `reservation` FOR EACH ROW
BEGIN
	INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ('reservation', OLD.id, OLD.last_update_by, 'DELETE', 'Menghapus reservation');
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `reservation_AFTER_UPDATE` AFTER UPDATE ON `reservation` FOR EACH ROW
BEGIN
    DECLARE action TEXT DEFAULT 'Diubah pada\n';
    
    IF OLD.table_id <> NEW.table_id THEN
        SET action  = CONCAT(action, 'table_id: ', OLD.table_id, ' -> ', NEW.table_id, '\n');
    END IF;
    IF OLD.customer_name <> NEW.customer_name THEN
        SET action  = CONCAT(action, 'customer_name: ', OLD.customer_name, ' -> ', NEW.customer_name, '\n');
    END IF;
    IF OLD.customer_no_telp <> NEW.customer_no_telp THEN
        SET action  = CONCAT(action, 'customer_no_telp: ', OLD.customer_no_telp, ' -> ', NEW.customer_no_telp, '\n');
    END IF;
    IF OLD.note <> NEW.note THEN
        SET action  = CONCAT(action, 'note: ', OLD.note, ' -> ', NEW.note, '\n');
    END IF;
    IF OLD.total_guests <> NEW.total_guests THEN
        SET action  = CONCAT(action, 'total_guests: ', OLD.total_guests, ' -> ', NEW.total_guests, '\n');
    END IF;
    IF OLD.datetime <> NEW.datetime THEN
        SET action  = CONCAT(action, 'datetime: ', OLD.datetime, ' -> ', NEW.datetime, '\n');
    END IF;
    IF OLD.status <> NEW.status THEN
        SET action  = CONCAT(action, 'status: ', OLD.status, ' -> ', NEW.status, '\n');
    END IF;

    IF  (OLD.table_id <> NEW.table_id) OR 
        (OLD.customer_name <> NEW.customer_name) OR 
        (OLD.customer_no_telp <> NEW.customer_no_telp) OR 
        (OLD.note <> NEW.note) OR 
        (OLD.total_guests <> NEW.total_guests) OR 
        (OLD.datetime <> NEW.datetime) OR
        (OLD.status <> NEW.status) THEN
    INSERT INTO `log` (tabel_name, data_id, employee_id, operation, action) VALUES
    ("reservation", NEW.id, NEW.last_update_by, "UPDATE", action);
    END IF;
END$$
DELIMITER ;


-- CREATE VIEW
CREATE
OR
REPLACE VIEW `menu_view` AS
SELECT
    `menu`.`id`,
    `menu`.`category_id` AS 'categoryId',
    `category`.`name` AS 'categoryName',
    `category`.`icon` AS 'categoryIcon',
    `menu`.`name`,
    `menu`.`description`,
    `menu`.`price`,
    `menu`.`discount`,
    `menu`.`image`,
    `menu`.`available`,
    ROUND(
        IFNULL(AVG(`menu_rating`.`rate`), 0),
        2
    ) AS 'rating',
    COUNT(`menu_rating`.`menu_id`) AS 'ratingCount'
FROM `menu`
    LEFT JOIN `category` ON `category`.`id` = `menu`.`category_id`
    LEFT JOIN `menu_rating` ON `menu_rating`.`menu_id` = `menu`.`id`
GROUP BY `menu`.`id`;

CREATE
OR
REPLACE
    VIEW `customer_favorite` AS
SELECT
    `customer_id` as 'customerId',
    `menu`.*
FROM `menu_favorite`
    INNER JOIN `menu_view` AS `menu` ON `menu`.`id` = `menu_favorite`.`menu_id`;

CREATE OR REPLACE 
VIEW `voucher_view` AS
SELECT 
    `voucher`.`id`,
    `voucher`.`code`,
    `voucher`.`description`,
    `voucher`.`discount`,
    `voucher`.`min_purchase` AS 'minPurchase',
    `voucher`.`max_discount` AS 'maxDiscount',
    `voucher`.`max_use` AS maxUse,
    `voucher`.`qty`,
    IF(`voucher_id` IS NULL,0, COUNT(`voucher_id`)) as 'used',
    `voucher`.`expired_at` AS 'expiredAt',
    (CASE 
        WHEN IF(`voucher_id` IS NULL,0, COUNT(`voucher_id`)) >=  `qty` THEN
            'Sold Out'
        WHEN NOW() > `expired_at` THEN  
            'Expired'        
        ELSE 'Available'
    END) AS 'status'
FROM `voucher`
LEFT JOIN `order` 
ON `voucher`.`code`= `order`.`voucher_id` GROUP BY `voucher`.`code`;

CREATE
OR
REPLACE VIEW enum_view AS
SELECT
    col.table_name,
    col.column_name,
REPLACE (
        TRIM(
            LEADING 'enum('
            FROM
                TRIM(
                    TRAILING ')'
                    FROM
                        col.column_type
                )
        ),
        "'",
        ""
    ) AS enum_values
FROM
    information_schema.columns col
    JOIN information_schema.tables tab ON tab.table_schema = col.table_schema
    AND tab.table_name = col.table_name
    AND tab.table_type = 'BASE TABLE'
WHERE
    col.data_type IN ('enum')
    AND col.table_schema NOT IN (
        'information_schema',
        'sys',
        'performance_schema',
        'mysql'
    )
    AND col.table_schema = 'pos'
ORDER BY
    col.table_schema,
    col.table_name,
    col.ordinal_position;

CREATE OR REPLACE VIEW `order_view` AS SELECT 
    `order`.`id`,
    `order`.`order_code` AS 'orderCode',
    `customer`.`id` AS 'customerId',
    `customer`.`name` AS 'customerName',
    `customer`.`no_telp` AS 'customerNoTelp',
    `customer`.`image` AS 'customerImage',
    `employee`.`name` AS 'employeeName',
    `employee`.`image` AS 'employeeImage',
    `table`.`name` AS 'tableName',
    `order`.`note`,
    `order`.`ppn`,
    `voucher`.`code` AS 'voucherCode',
    `voucher`.`discount` AS 'voucherDiscount',
    `order`.`status`,
    `order`.`created_at` AS 'timestamp',
    `rating`.`rate` AS 'rating',
    `rating`.`description` AS 'review'
FROM `order`
LEFT JOIN `customer` ON `order`.`customer_id` = `customer`.`id`
LEFT JOIN `employee` ON `order`.`employee_id` = `employee`.`id`
LEFT JOIN `table` ON `order`.`table_id` = `table`.`id`
LEFT JOIN `voucher` ON `order`.`voucher_id` = `voucher`.`id`
LEFT JOIN `rating` ON `rating`.`order_id` = `order`.`id`;

CREATE OR REPLACE VIEW `order_detail_view` AS SELECT 
    `order`.*,
    `detail`.`id` AS 'detailId',
    `detail`.`menu_id` AS 'menuId',
    `detail`.`name_menu` AS 'menuName',
    `detail`.`price` AS 'menuPrice',
    `detail`.`discount` AS 'menuDiscount',
    (`detail`.`price` - (`detail`.`price` * `detail`.`discount`)) AS 'menuPriceAfterDiscount',
    `detail`.`image` AS 'menuImage',
    `detail`.`qty` AS 'menuQty',
    `detail`.`note` AS 'menuNote',
    `option`.`name_option` AS 'optionName',
    `option`.`name_option_item` AS 'optionItemName',
    `option`.`price` AS 'optionItemPrice'
FROM `order_view` `order`
LEFT JOIN `order_detail` `detail` ON `detail`.`order_id` = `order`.`id`
LEFT JOIN `order_detail_option` `option` ON `option`.`order_detail_id` = `detail`.`id`;

CREATE OR REPLACE VIEW `reservation_view` AS SELECT 
    `reservation`.`id`,
    `reservation`.`code` AS 'reservationCode',
    IF(`customer`.`id` IS NULL,`reservation`.`customer_name`, `customer`.`name`) AS 'customerName',
    IF(`customer`.`id` IS NULL,`reservation`.`customer_no_telp`, `customer`.`no_telp`) AS 'customerNoTelp',
    `customer`.`image` AS 'customerImage',
    IF(`reservation`.`table_id` IS NULL,`reservation`.`table_name`, `table`.`name`) AS 'tableName',
    `reservation`.`note`,
    `reservation`.`total_guests` AS 'totalGuests',
    `reservation`.`datetime`,
    `reservation`.`status`,
    `reservation`.`created_at` AS 'timestamp'
FROM `reservation`
LEFT JOIN `customer` ON `reservation`.`customer_id` = `customer`.`id`
LEFT JOIN `table` ON `reservation`.`table_id` = `table`.`id`;

CREATE OR REPLACE VIEW `cart_view` AS 
SELECT 
    `cart`.`id`,
    `cart`.`customer_id` AS `customerId`,
    `menu`.`id` AS `menuId`,
    `menu`.`name` AS `menuName`,
    `menu`.`price` AS `menuPrice`,
    `menu`.`discount` AS `menuDiscount`,
    `menu`.`image` AS `menuImage`,
    `cart`.`qty`,
    `cart`.`note`,
    `option`.`name` AS `optionName`,
    `item`.`id` AS `optionItemId`,
    `item`.`name` AS `optionItemName`,
    `item`.`price` AS `optionItemPrice`
FROM `cart`
LEFT JOIN `cart_detail` ON `cart`.`id`=`cart_detail`.`cart_id`
LEFT JOIN `menu_view` `menu` ON `menu`.`id` = `cart`.`menu_id`
LEFT JOIN `menu_option_item` `item` ON `item`.`id` = `cart_detail`.`menu_option_item_id`
LEFT JOIN `menu_option` `option` ON `option`.`id` = `item`.`menu_option_id`
WHERE `menu`.`available` = 1 AND (`item`.`available` = 1 OR `item`.`available` IS NULL);

CREATE OR REPLACE VIEW `menu_customer_view` AS SELECT menu.*,
    IF(`menu_favorite`.`menu_id` IS NULL, 0,1) AS `isFavorite`,
    `menu_favorite`.`customer_id` AS `customerId`,
    IF ( (
            SELECT
                COUNT(`menu_id`)
            FROM `menu_option`
            WHERE
                `menu_option`.`menu_id` = `menu`.`id`
        ) > 0,
        TRUE,
        FALSE
    ) AS `availableOptions`
FROM `menu_view` `menu`
LEFT JOIN `menu_favorite`
ON `menu`.id = `menu_favorite`.`menu_id`;

CREATE OR REPLACE VIEW `menu_rating_view` AS SELECT 
    `customer`.`username` AS `customerUsername`,
    `customer`.`name` AS `customerName`,
    `customer`.`image` AS `customerImage`,
    `menu_rating`.`menu_id` as `menuId`,
    `menu_rating`.`rate` as `rating`,
    `menu_rating`.`description` as `review`,
    `menu_rating`.`created_at` as `timestamp`
FROM `menu_rating`
LEFT JOIN `rating` ON `menu_rating`.`rating_id` = `rating`.`id`
LEFT JOIN `order` ON `order`.`id` = `rating`.`order_id`
LEFT JOIN `customer` ON `order`.`customer_id` = `customer`.`id`;






