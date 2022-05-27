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
      'userRestore',
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
      'layoutRestore',
      'optionSearch',
      'optionCreate',
      'optionDelete',
    ];
    $user = [
      'postSearch',
      'postCreate',
      'postRead',
      'postUpdate',
      'postDelete',
    ];
    try {
      Option::saveOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, Codes::PERMISSIONS, $permissions);
      Option::saveOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, Codes::ROLES, ['Admin', 'User']);
      Option::saveOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, 'User', $user);
    } catch (\Throwable $th) {
      echo $th->getMessage();
    }
  }

  public function down()
  {
  }
}
