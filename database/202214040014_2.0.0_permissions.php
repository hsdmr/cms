<?php

use Hasdemir\Base\Codes;
use Hasdemir\Base\System;
use Hasdemir\Model\Option;

class Permissions200
{
  public function up()
  {
    $permissions = [
      'searchPost',
      'createPost',
      'readPost',
      'updatePost',
      'deletePost',
      'searchUser',
      'createUser',
      'readUser',
      'updateUser',
      'deleteUser',
      'searchRole',
      'createRole',
      'readRole',
      'updateRole',
      'deleteRole',
      'searchPage',
      'createPage',
      'readPage',
      'updatePage',
      'deletePage',
    ];
    $user = [
      'searchPost',
      'createPost',
      'readPost',
      'updatePost',
      'deletePost',
    ];
    try {
      Option::createOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, 'permissions', $permissions);
      Option::createOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, 'roles', ['admin', 'user']);
      Option::createOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, 'admin', $permissions);
      Option::createOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, 'user', $user);
    } catch (\Throwable $th) {
      echo $th->getMessage();
    }
  }

  public function down()
  {
  }
}
