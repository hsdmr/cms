<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Controller;

class RouteController extends Controller
{
    public function home($request, $args)
    {
        echo 'Hello World';
    }

    public function route($request, $args)
    {
        var_dump($args);
    }
}