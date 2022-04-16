<?php

namespace Hasdemir\Base;

use Hasdemir\Base\System;

class Migration
{
  public static \PDO $pdo;
  public static $config;

  public static function run($args = [])
  {
    self::$config = System::getConfig();
    self::$pdo = System::getPdo();

    $files = scandir(ROOT . DS . 'database');

    if (isset($args[1])) {
      if ($args[1] == 'fresh') {
        foreach ($files as $migration) {
          if ($migration === '.' || $migration === '..') {
            continue;
          }

          require_once ROOT . DS . 'database' . DS . $migration;
          $name = explode('_', pathinfo($migration, PATHINFO_FILENAME));
          $version = $name[1];
          $className = ucwords($name[2]) . implode('', explode('.', $version));
          $instance = new $className();
          self::echoLog("Droping", $migration, 3);
          $instance->down();
          self::echoLog("Dropped", $migration);
          $newMigrations[] = $migration . "', '" . $version . "', '" . time();
        }
      }
    }

    self::createMigrationsTable();
    $appliedMigrations = self::getAppliedMigrations();

    $newMigrations = [];
    $files = scandir(ROOT . DS . 'database');

    $toApplyMigrations = array_diff($files, $appliedMigrations);
    foreach ($toApplyMigrations as $migration) {
      if ($migration === '.' || $migration === '..') {
        continue;
      }

      require_once ROOT . DS . 'database' . DS . $migration;
      $name = explode('_', pathinfo($migration, PATHINFO_FILENAME));
      $version = $name[1];
      $className = ucwords($name[2]) . implode('', explode('.', $version));
      $instance = new $className();
      self::echoLog("Migrating", $migration, 3);
      $instance->up();
      self::echoLog("Migrated", $migration);
      $newMigrations[] = $migration . "', '" . $version . "', '" . time();
    }

    if (!empty($newMigrations)) {
      self::saveMigrations($newMigrations);
    }
    echo PHP_EOL;
    self::echoLog("All migrations are applied");
  }

  private static function createMigrationsTable()
  {
    self::$pdo->exec("CREATE TABLE IF NOT EXISTS migration (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    migration_name VARCHAR(50), `version` VARCHAR(20),
                    created_at BIGINT(20) NULL
                )  ENGINE=INNODB;");
  }


  private static function getAppliedMigrations()
  {
    $statement = self::$pdo->prepare("SELECT migration_name FROM migration");
    $statement->execute();

    return $statement->fetchAll(\PDO::FETCH_COLUMN);
  }

  private static function saveMigrations(array $newMigrations)
  {
    $str = implode(',', array_map(fn ($m) => "('$m')", $newMigrations));
    $statement = self::$pdo->prepare("INSERT INTO migration (`migration_name`, `version`, `created_at`) VALUES 
        $str
    ");
    $statement->execute();
  }

  private static function echoLog($message1 = "", $message2 = "", $code = 2)
  {
    $echo = PHP_EOL . "\033[3" . $code . "m[" . date("Y-m-d H:i:s") . "] $message1 \033[0m" . $message2;
    echo $echo;
    //Black: \033[30m
    //Red: \033[31m
    //Green: \033[32m
    //Yellow: \033[33m
    //Blue: \033[34m
    //Magenta: \033[35m
    //Cyan: \033[36m
    //White: \033[37m
    //Reset: \033[0m
  }
}
