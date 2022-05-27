<?php

use Hasdemir\Base\System;

class Seeds200
{
  public function up()
  {
    $db = System::getPdo();
    $sql = [];
    $sql['user'] = "INSERT INTO `user` (`id`, `first_name`, `last_name`, `role`, `email`, `username`, `email_verified_at`, `password`, `deleted_at`, `created_at`, `updated_at`) VALUES (NULL, 'Murat', 'Hasdemir', 'Admin', 'hsdmrsoft@gmail.com', 'admin', NULL, '" . password_hash('12345678', PASSWORD_BCRYPT) . "', NULL, " . time() . ", " . time() . ")";
    $sql['user1'] = "INSERT INTO `user` (`id`, `first_name`, `last_name`, `role`, `email`, `username`, `email_verified_at`, `password`, `deleted_at`, `created_at`, `updated_at`) VALUES (NULL, 'Murat', 'Hasdemir', 'Admin', 'hsdmrsoft1@gmail.com', 'admin1', NULL, '" . password_hash('12345678', PASSWORD_BCRYPT) . "', NULL, " . time() . ", " . time() . ")";
    $sql['user2'] = "INSERT INTO `user` (`id`, `first_name`, `last_name`, `role`, `email`, `username`, `email_verified_at`, `password`, `deleted_at`, `created_at`, `updated_at`) VALUES (NULL, 'Murat', 'Hasdemir', 'Admin', 'hsdmrsoft2@gmail.com', 'admin2', NULL, '" . password_hash('12345678', PASSWORD_BCRYPT) . "', NULL, " . time() . ", " . time() . ")";
    $sql['post'] = "INSERT INTO `post` (`id`, `slug_id`, `user_id`, `file_id`, `status`, `type`, `title`, `content`, `sidebar`, `template`, `deleted_at`, `created_at`, `updated_at`) VALUES (NULL, '1', '1', NULL, 'published', 'post', 'Title 1', 'Content', 'NULL', 'NULL', NULL, " . time() . ", " . time() . ")";
    $sql['option1'] = "INSERT INTO `option` (`type`, `type_id`, `key`, `value`, `created_at`, `updated_at`) VALUES ('user', '1', 'brandLogoBg', \"\", " . time() . ", " . time() . ")";
    $sql['option2'] = "INSERT INTO `option` (`type`, `type_id`, `key`, `value`, `created_at`, `updated_at`) VALUES ('user', '1', 'navbarBg', '\"navbar-light bg-white\"', " . time() . ", " . time() . ")";
    $sql['option3'] = "INSERT INTO `option` (`type`, `type_id`, `key`, `value`, `created_at`, `updated_at`) VALUES ('user', '1', 'sidebarBg', '\"sidebar-dark-success\"', " . time() . ", " . time() . ")";
    $sql['option4'] = "INSERT INTO `option` (`type`, `type_id`, `key`, `value`, `created_at`, `updated_at`) VALUES ('user', '1', 'languagePreference', '\"tr\"', " . time() . ", " . time() . ")";

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
