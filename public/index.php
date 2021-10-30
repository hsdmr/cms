<?php

use Hasdemir\Base\App;

define('ROOT', dirname(dirname(__FILE__)));
define('API_PREFIX', 'v1');
define('API_VERSION', '1.0.0');

require ROOT . '/vendor/autoload.php';

try {
    $app = new App();
    $app->add('Post');
    $app->add('Category');
    $app->run();
} catch (Throwable $th) {
    echo $th->getMessage();
}
