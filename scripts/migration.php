<?php

define('ROOT', dirname(dirname(__FILE__)));
define('DS', DIRECTORY_SEPARATOR);

require ROOT . '/vendor/autoload.php';

use Hasdemir\Base\System;

$config = System::get('config');
$pdo = System::get('pdo');

applyMigrations();

function applyMigrations()
{
    createMigrationsTable();
    $appliedMigrations = getAppliedMigrations();

    $newMigrations = [];
    $files = scandir(ROOT . DS . 'database');

    $toApplyMigrations = array_diff($files, $appliedMigrations);
    foreach ($toApplyMigrations as $migration) {
        if ($migration === '.' || $migration === '..') {
            continue;
        }

        require_once ROOT . DS . 'database' . DS . $migration;
        $name = explode('_',pathinfo($migration, PATHINFO_FILENAME));
        $version = $name[1];
        $className = ucwords($name[2]) . implode('', explode('.', $version));
        $instance = new $className();
        echoLog("Applying migration $migration");
        $instance->up();
        echoLog("Applied migration $migration");
        $newMigrations[] = $migration. "', '" . $version;
    }

    if (!empty($newMigrations)) {
        saveMigrations($newMigrations);
    } else {
        echoLog("All migrations are applied");
    }
}

function createMigrationsTable()
{
    global $pdo;
    $pdo->exec("CREATE TABLE IF NOT EXISTS migration (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    migration_name VARCHAR(50), `version` VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )  ENGINE=INNODB;");
}


function getAppliedMigrations()
{
    global $pdo;
    $statement = $pdo->prepare("SELECT migration_name FROM migration");
    $statement->execute();

    return $statement->fetchAll(\PDO::FETCH_COLUMN);
}

function saveMigrations(array $newMigrations)
{
    global $pdo;
    $str = implode(',', array_map(fn($m) => "('$m')", $newMigrations));
    $statement = $pdo->prepare("INSERT INTO migration (migration_name, `version`) VALUES 
        $str
    ");
    $statement->execute();
}

function prepare($sql): \PDOStatement
{
    global $pdo;
    return $pdo->prepare($sql);
}

function echoLog($message)
{
    echo "[" . date("Y-m-d H:i:s") . "] - " . $message . PHP_EOL;
}
