<?php

use Hasdemir\Base\System;

class Initial
{
    public function up()
    {
        $db = System::get('pdo');
        $sql = [];
        $timestamps = "`created_at` BIGINT(20) NULL , `updated_at` BIGINT(20) NULL";
        $timestamps_with_delete = "`deleted_at` BIGINT(20) NULL , `created_at` BIGINT(20) NULL , `updated_at` BIGINT(20) NULL";
        $sql['user'] = "CREATE TABLE `phprest`.`user` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `first_name` VARCHAR(255) NULL , `last_name` VARCHAR(255) NULL , `role` VARCHAR(50) NOT NULL , `email` VARCHAR(255) NOT NULL , `email_verified_at` TIMESTAMP NULL , `password` VARCHAR(255) NOT NULL , {$timestamps_with_delete} , PRIMARY KEY (`id`), UNIQUE `uniqeu_email` (`email`)) ENGINE = InnoDB;";
        $sql['user_meta'] = "CREATE TABLE `phprest`.`user_meta` ( `user_id` BIGINT(20) NOT NULL , `key` VARCHAR(255) NOT NULL , `value` TEXT NOT NULL , {$timestamps} ) ENGINE = InnoDB;";
        $sql['permalink'] = "CREATE TABLE `phprest`.`permalink` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `owner` VARCHAR(255) NOT NULL , `path` VARCHAR(255) NOT NULL , `seo_title` VARCHAR(255) NULL , `seo_description` TEXT NULL , `seo_index` TINYINT(1) NOT NULL DEFAULT '1' , `seo_follow` TINYINT(1) NOT NULL DEFAULT '1' , `language_id` BIGINT(20) NOT NULL , {$timestamps_with_delete} , PRIMARY KEY (`id`), UNIQUE `permalink_path_unique` (`path`)) ENGINE = InnoDB;";
        $sql['access_token'] = "CREATE TABLE `phprest`.`access_token` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `user_id` BIGINT(20) NOT NULL , `token` VARCHAR(100) NOT NULL , `type` VARCHAR(20) NULL , `attributes` MEDIUMTEXT NULL , `scopes` MEDIUMTEXT NULL , `expires` TIMESTAMP NULL , {$timestamps_with_delete} , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
        $sql['auto_link'] = "CREATE TABLE `phprest`.`auto_link` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `word` VARCHAR(255) NOT NULL , `uri` VARCHAR(255) NOT NULL , {$timestamps} , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
        $sql['post'] = "CREATE TABLE `phprest`.`post` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `permalink_id` BIGINT(20) NOT NULL , `user_id` BIGINT(20) NOT NULL , `file_id` BIGINT(20) NULL , `status` VARCHAR(50) NOT NULL , `title` VARCHAR(255) NOT NULL , `content` LONGTEXT NULL , `sidebar` VARCHAR(255) NULL , `template` VARCHAR(255) NULL , {$timestamps_with_delete} , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
        $sql['category'] = "CREATE TABLE `phprest`.`category` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `permalink_id` BIGINT(20) NOT NULL , `file_id` BIGINT(20) NOT NULL , `parent_id` BIGINT(20) NOT NULL , `type` VARCHAR(100) NOT NULL , `title` VARCHAR(255) NOT NULL , `content` LONGTEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
        $sql[] = "";
        try {
            foreach ($sql as $key => $value) {
                $db->exec($value);
            }
        } catch(\Throwable $th) {
            echo $th->getMessage();
        }
    }

    public function down()
    {
    }
}
