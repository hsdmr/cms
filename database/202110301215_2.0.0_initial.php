<?php

use Hasdemir\Base\System;

class Initial200
{
  public function up()
  {
    $db = System::getPdo();
    $sql = [];
    $timestamps = "`created_at` BIGINT(20) NULL , `updated_at` BIGINT(20) NULL";
    $timestamps_with_delete = "`deleted_at` BIGINT(20) NULL , `created_at` BIGINT(20) NULL , `updated_at` BIGINT(20) NULL";
    $sql['user'] = "CREATE TABLE `rest`.`user` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `first_name` VARCHAR(255) NULL , `last_name` VARCHAR(255) NULL , `role` VARCHAR(50) NOT NULL , `email` VARCHAR(255) NOT NULL , `username` VARCHAR(255) NOT NULL , `nickname` VARCHAR(255) NULL , `phone` VARCHAR(255) NULL , `email_verified_at` BIGINT(20) NULL , `password` VARCHAR(255) NOT NULL , {$timestamps_with_delete} , PRIMARY KEY (`id`), UNIQUE `uniqeu_email` (`email`)) ENGINE = InnoDB;";
    $sql['option'] = "CREATE TABLE `rest`.`option` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT ,`type` VARCHAR(255) NULL , `type_id` BIGINT(20) NULL , `key` VARCHAR(255) NOT NULL , `value` TEXT NULL , {$timestamps} , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    $sql['permalink'] = "CREATE TABLE `rest`.`permalink` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `owner` VARCHAR(255) NOT NULL , `path` VARCHAR(255) NOT NULL , `seo_title` VARCHAR(255) NULL , `seo_description` TEXT NULL , `seo_index` TINYINT(1) NOT NULL DEFAULT '1' , `seo_follow` TINYINT(1) NOT NULL DEFAULT '1' , `language_id` BIGINT(20) NOT NULL , {$timestamps_with_delete} , PRIMARY KEY (`id`), UNIQUE `permalink_path_unique` (`path`)) ENGINE = InnoDB;";
    $sql['access_token'] = "CREATE TABLE `rest`.`access_token` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `user_id` BIGINT(20) NOT NULL , `token` VARCHAR(100) NOT NULL , `type` VARCHAR(20) NULL , `attributes` MEDIUMTEXT NULL , `scope` MEDIUMTEXT NULL , `expires` BIGINT(20) NULL , {$timestamps} , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    $sql['auto_link'] = "CREATE TABLE `rest`.`auto_link` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `word` VARCHAR(255) NOT NULL , `uri` VARCHAR(255) NOT NULL , {$timestamps} , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    $sql['post'] = "CREATE TABLE `rest`.`post` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `permalink_id` BIGINT(20) NOT NULL , `user_id` BIGINT(20) NOT NULL , `file_id` BIGINT(20) NULL , `status` VARCHAR(50) NOT NULL , `title` VARCHAR(255) NOT NULL , `content` LONGTEXT NULL , `sidebar` VARCHAR(255) NULL , `template` VARCHAR(255) NULL , {$timestamps_with_delete} , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    $sql['category'] = "CREATE TABLE `rest`.`category` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `permalink_id` BIGINT(20) NOT NULL , `file_id` BIGINT(20) NULL , `parent_id` BIGINT(20) NULL , `owner` VARCHAR(100) NOT NULL , `title` VARCHAR(255) NOT NULL , `content` LONGTEXT NULL , {$timestamps} , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    $sql['category_post'] = "CREATE TABLE `rest`.`category_post` ( `post_id` BIGINT(20) UNSIGNED NOT NULL , `category_id` BIGINT(20) UNSIGNED NOT NULL ) ENGINE = InnoDB;";
    try {
      foreach ($sql as $key => $value) {
        $db->exec($value);
      }
    } catch (\Throwable $th) {
      echo $th->getMessage();
    }
  }

  public function down()
  {
  }
}
