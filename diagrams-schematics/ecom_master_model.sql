CREATE TABLE `categories` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `subcategories` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `category_id` integer NOT NULL
);

CREATE TABLE `products` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal NOT NULL,
  `old_price` decimal,
  `discount` integer,
  `rating` integer,
  `sku` varchar(255) UNIQUE NOT NULL,
  `stock` integer NOT NULL,
  `subcategory_id` integer NOT NULL
);

CREATE TABLE `product_images` (
  `id` integer PRIMARY KEY,
  `url_image` varchar(255) NOT NULL,
  `product_id` integer NOT NULL
);

CREATE TABLE `users` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `birth_date` date,
  `role` varchar(255) NOT NULL DEFAULT 'customer'
);

CREATE TABLE `addresses` (
  `id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `address_line` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `neighborhood` varchar(255) NOT NULL,
  `complement` varchar(255),
  `recipient_full_name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `is_default` boolean NOT NULL DEFAULT false
);

CREATE TABLE `cart_items` (
  `id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `product_id` integer NOT NULL,
  `quantity` integer NOT NULL
);

CREATE TABLE `orders` (
  `id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `address_id` integer,
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  `mercadopago_payment_id` varchar(255) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `recipient_full_name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `address_line` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `neighborhood` varchar(255) NOT NULL,
  `complement` varchar(255),
  `subtotal` decimal NOT NULL,
  `cost` decimal NOT NULL,
  `total` decimal NOT NULL
);

CREATE TABLE `order_items` (
  `id` integer PRIMARY KEY,
  `order_id` integer NOT NULL,
  `product_id` integer NOT NULL,
  `quantity` integer NOT NULL,
  `unit_price` decimal NOT NULL,
  `subtotal` decimal NOT NULL
);

ALTER TABLE `subcategories` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

ALTER TABLE `products` ADD FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`);

ALTER TABLE `product_images` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `cart_items` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `cart_items` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `addresses` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`);

ALTER TABLE `order_items` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

ALTER TABLE `order_items` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
