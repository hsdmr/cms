<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class AccessToken extends Model
{
  protected string $table = 'access_token';
  protected array $unique = ['token'];
  protected bool $soft_delete = false;

  public static function findById(int $id)
  {
    $item = new AccessToken();
    return $item->find($id);
  }

  public static function findByToken(string $token)
  {
    $item = new AccessToken();
    return $item->where('token', $token)->first();
  }
}
