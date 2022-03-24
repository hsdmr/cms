<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class User extends Model
{
  protected $table = 'user';
  protected $unique = ['email', 'username'];
  protected $protected = ['password'];
  protected $soft_delete = true;

  public static function findById(int $id)
  {
    $item = new User();
    return $item->find($id);
  }

  public static function findByEmail(string $email)
  {
    $item = new User();
    return $item->where([['email', '=', $email]])->first();
  }

  public static function findByUsername(string $username)
  {
    $item = new User();
    return $item->where([['username', '=', $username]])->first();
  }

  public function posts()
  {
    return $this->hasMany('post');
  }

  public function options()
  {
    return $this->hasMany('option');
  }
}
