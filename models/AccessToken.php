<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class AccessToken extends Model
{
  protected string $table = 'access_token';
  protected array $unique = ['token'];

  const TYPE = ['temporary', 'internal', 'external'];

  public static function find(int $id)
  {
    $item = new AccessToken();
    return $item->findByPrimaryKey($id);
  }

  public static function findByToken(string $token)
  {
    $item = new AccessToken();
    return $item->where('token', $token)->first();
  }

  public function user()
  {
    return $this->belongsTo('user');
  }
}
