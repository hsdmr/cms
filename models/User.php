<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class User extends Model
{
  protected string $table = 'user';
  protected array $unique = ['email', 'username'];
  protected array $hidden = ['created_at', 'updated_at'];
  protected array $protected = ['password'];
  protected bool $soft_delete = true;

  public static function findByEmail(string $email)
  {
    $item = new User();
    return $item->where('email', $email)->first();
  }

  public static function findByUsername(string $username)
  {
    $item = new User();
    return $item->where('username', $username)->first();
  }

  public function posts()
  {
    return $this->hasMany('post');
  }
  public function tokens()
  {
    return $this->hasMany('access_token');
  }

}
