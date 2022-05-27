<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Controller;
use Hasdemir\Model\User;

class DenemeController extends Controller
{
  public function index($request, $args)
  {
    $user = new User();
    $user = $user->first();
    var_dump($user);
    var_dump(count($user));
    foreach ($user as $key => $value) {
      var_dump($key . ' ' . $value);
    }
    $user['adana'] = 'demir';
    var_dump(count($user));
    var_dump($user['id']);
    var_dump(isset($user['adana']));
    var_dump($user);
    unset($user['adana']);
    var_dump($user);
  }
}
