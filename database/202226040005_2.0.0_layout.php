<?php

use Hasdemir\Base\System;

class Layout200
{
  public function up()
  {
    try {
      $timestamps_with_delete = timestamps(true);
      $sql = "CREATE TABLE `layout` ( 
        `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT, 
        `title` VARCHAR(50) NOT NULL, 
        `top` LONGTEXT NOT NULL, 
        `content` LONGTEXT NOT NULL, 
        `bottom` LONGTEXT NOT NULL, 
        `status` VARCHAR(20) NOT NULL, 
        `which` VARCHAR(50) NOT NULL, 
        `language_id` BIGINT(20) NOT NULL, 
        {$timestamps_with_delete}, 
        PRIMARY KEY (`id`)) ENGINE = InnoDB;";

      $db = System::getPdo();
      $db->exec($sql);
    } catch (\Throwable $th) {
      echo $th->getMessage();
    }
  }

  public function down()
  {
    $db = System::getPdo();
    $db->exec("DROP TABLE `layout`");
  }
}
