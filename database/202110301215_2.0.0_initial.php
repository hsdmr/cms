<?php

use Hasdemir\Base\System;

class Initial200
{
  public function up()
  {
    $db = System::getPdo();
    $sql = [];
    $timestamps = timestamps();
    $timestamps_with_delete = timestamps(true);
    $sql['user'] = "CREATE TABLE `user` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `first_name` VARCHAR(255) NULL , `last_name` VARCHAR(255) NULL , `role` VARCHAR(50) NOT NULL , `email` VARCHAR(255) NOT NULL , `username` VARCHAR(255) NOT NULL , `nickname` VARCHAR(255) NULL , `phone` VARCHAR(255) NULL , `email_verified_at` BIGINT(20) NULL , `password` VARCHAR(255) NOT NULL , {$timestamps_with_delete} , PRIMARY KEY (`id`), UNIQUE `uniqeu_email` (`email`)) ENGINE = InnoDB;";
    $sql['option'] = "CREATE TABLE `option` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT ,`type` VARCHAR(255) NULL , `type_id` BIGINT(20) NULL , `key` VARCHAR(255) NOT NULL , `value` TEXT NULL , {$timestamps} , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    $sql['slug'] = "CREATE TABLE `slug` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `owner` VARCHAR(255) NOT NULL , `path` VARCHAR(255) NOT NULL , `seo_title` VARCHAR(255) NULL , `seo_description` TEXT NULL , `seo_index` TINYINT(1) NOT NULL DEFAULT '1' , `seo_follow` TINYINT(1) NOT NULL DEFAULT '1' , `language_id` BIGINT(20) NOT NULL , {$timestamps_with_delete} , PRIMARY KEY (`id`), UNIQUE `slug_path_unique` (`path`)) ENGINE = InnoDB;";
    $sql['access_token'] = "CREATE TABLE `access_token` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `user_id` BIGINT(20) NOT NULL , `token` VARCHAR(100) NOT NULL , `type` VARCHAR(20) NULL , `attributes` MEDIUMTEXT NULL , `scope` MEDIUMTEXT NULL , `expires` BIGINT(20) NULL , {$timestamps} , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    $sql['auto_link'] = "CREATE TABLE `auto_link` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `word` VARCHAR(255) NOT NULL , `uri` VARCHAR(255) NOT NULL , {$timestamps} , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    $sql['post'] = "CREATE TABLE `post` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `slug_id` BIGINT(20) NOT NULL , `user_id` BIGINT(20) NOT NULL , `file_id` BIGINT(20) NULL , `status` VARCHAR(50) NOT NULL , `type` VARCHAR(50) NOT NULL , `title` VARCHAR(255) NOT NULL , `content` LONGTEXT NULL , `sidebar` VARCHAR(255) NULL , `template` VARCHAR(255) NULL , {$timestamps_with_delete} , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    $sql['category'] = "CREATE TABLE `category` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `slug_id` BIGINT(20) NOT NULL , `file_id` BIGINT(20) NULL , `parent_id` BIGINT(20) NULL , `owner` VARCHAR(100) NOT NULL , `title` VARCHAR(255) NOT NULL , `content` LONGTEXT NULL , {$timestamps} , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
    $sql['category_post'] = "CREATE TABLE `category_post` ( `post_id` BIGINT(20) UNSIGNED NOT NULL , `category_id` BIGINT(20) UNSIGNED NOT NULL ) ENGINE = InnoDB;";
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
    $db = System::getPdo();
    $sql = [];
    $sql['migration'] = "DROP TABLE `migration`";
    $sql['user'] = "DROP TABLE `user`";
    $sql['option'] = "DROP TABLE `option`";
    $sql['slug'] = "DROP TABLE `slug`";
    $sql['access_token'] = "DROP TABLE `access_token`";
    $sql['auto_link'] = "DROP TABLE `auto_link`";
    $sql['post'] = "DROP TABLE `post`";
    $sql['category'] = "DROP TABLE `category`";
    $sql['category_post'] = "DROP TABLE `category_post`";
    try {
      foreach ($sql as $key => $value) {
        $db->exec($value);
      }
    } catch (\Throwable $th) {
      echo " => " . $th->getMessage();
    }
  }
}
