<?php

namespace Hasdemir\Base;

use Dotenv\Dotenv;
use PDO;

class System
{
  const PDO = 'pdo';
  const CONFIG = 'config';

  public static function get($type)
  {
    switch ($type) {
      case self::PDO:
        $object = new PDO('mysql:host=' . $_ENV['DB_HOST'] . '; dbname=' . $_ENV['DB_NAME'] . ';charset=utf8', $_ENV['DB_USER'], $_ENV['DB_PASSWORD']);
        $object->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $object->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
        $object->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $object;

      case self::CONFIG:
        $object = Dotenv::createImmutable(ROOT)->load();
        return $object;
    }
  }

  public static function getPdo()
  {
    return self::get(self::PDO);
  }

  public static function getConfig()
  {
    return self::get(self::CONFIG);
  }
}
