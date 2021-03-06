<?php

use Hasdemir\Base\App;
use Hasdemir\Base\Log;

error_reporting(E_ALL & ~E_NOTICE);
define('ROOT', dirname(dirname(__FILE__)));
define('DS', DIRECTORY_SEPARATOR);
define('API_PREFIX', '/v2');
define('API_VERSION', '2.0.0');

require ROOT . DS . 'vendor' . DS . 'autoload.php';
require ROOT . DS . 'base' . DS . 'helper' . DS . 'functions.php';

try {
  Log::startApp();
  $app = new App();
  $app->run();
} finally {
  Log::endApp();
}
