<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Controller;

class HomeController extends Controller
{
  public function home($request, $args)
  {
    return view('index.php');
  }
}
