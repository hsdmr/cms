<?php

use Hasdemir\Base\Codes;
use Hasdemir\Base\System;
use Hasdemir\Model\Option;

class Permissions200
{
  public function up()
  {
    $permissions = [
      'postSearch',
      'postCreate',
      'postRead',
      'postUpdate',
      'postDelete',
      'userSearch',
      'userCreate',
      'userRead',
      'userUpdate',
      'userDelete',
      'roleSearch',
      'roleCreate',
      'roleRead',
      'roleUpdate',
      'roleDelete',
      'pageSearch',
      'pageCreate',
      'pageRead',
      'pageUpdate',
      'pageDelete',
      'layoutSearch',
      'layoutCreate',
      'layoutRead',
      'layoutUpdate',
      'layoutDelete',
    ];
    $user = [
      'postSearch',
      'postCreate',
      'postRead',
      'postUpdate',
      'postDelete',
    ];
    try {
      Option::CreateOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, 'permissions', $permissions);
      Option::CreateOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, 'roles', ['Admin', '']);
      Option::CreateOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, 'admin', $permissions);
      Option::CreateOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, 'user', $user);
    } catch (\Throwable $th) {
      echo $th->getMessage();
    }
  }

  public function down()
  {
  }
}
