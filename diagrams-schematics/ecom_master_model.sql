CREATE TABLE `categories` (
  `id` integer PRIMARY KEY,
  `name` varchar(255)
);

CREATE TABLE `subcategories` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `category_id` integer
);

CREATE TABLE `products` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `description` text,
  `price` decimal,
  `subcategory_id` integer
);

CREATE TABLE `product_images` (
  `id` integer PRIMARY KEY,
  `url_image` varchar(255),
  `product_id` integer
);

ALTER TABLE `subcategories` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

ALTER TABLE `products` ADD FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`);

ALTER TABLE `product_images` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
