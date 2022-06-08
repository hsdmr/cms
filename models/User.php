<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Codes;
use Hasdemir\Base\Model;

class User extends Model
{
  protected string $table = 'user';
  protected array $unique = ['email', 'username'];
  protected array $hidden = ['created_at', 'updated_at'];
  protected array $protected = ['password'];
  protected bool $soft_delete = true;

  const ROLES = ['admin', 'user'];

  public static function find(int $id)
  {
    $item = new User();
    return $item->findByPrimaryKey($id);
  }

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

  public function options($key = '')
  {
    if ($key) {
      return Option::findOption('user', $this->id, $key);
    }
    return Option::findOptions('user', $this->id);
  }

  public function permissions()
  {
    if ($this->role == 'Admin') {
      return Option::findOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, Codes::PERMISSIONS)['value'];
    }
    return Option::findOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, $this->role)['value'];
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
