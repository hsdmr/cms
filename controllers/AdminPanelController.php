<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Controller;

class AdminPanelController extends Controller
{
  public function admin($request, $args)
  {
    return view('admin.index.html');
  }

}
