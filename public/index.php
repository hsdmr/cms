<?php

use Hasdemir\Base\App;

define('ROOT', dirname(dirname(__FILE__)));
define('DS', DIRECTORY_SEPARATOR);
define('API_PREFIX', '/v2');
define('API_VERSION', '2.0.0');

require ROOT . '/vendor/autoload.php';

try {
    $app = new App();
    $app->run();
} catch (\Throwable $th) {
    echo $th->getMessage();
}
