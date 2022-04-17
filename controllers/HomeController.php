<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Controller;

class HomeController extends Controller
{
  public function home($request, $args)
  {
    return view('index.php');
  }
  
  public function not_found($request, $args)
  {
    return view('404.php');
  }
}
