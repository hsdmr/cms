<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class AccessToken extends Model
{
  protected string $table = 'access_token';
  protected array $unique = ['token'];
  protected bool $soft_delete = false;

  public static function findById(int $id, $with_deleted = null, $only_deleted = null, $with_hidden = null)
  {
    $item = new AccessToken();
    if ($with_deleted) {
      $item->withDeleted();
    }
    if ($only_deleted) {
      $item->onlyDeleted();
    }
    if ($with_hidden) {
      $item->withHidden();
    }
    return $item->findByPrimaryKey($id);
  }

  public static function findByToken(string $token)
  {
    $item = new AccessToken();
    return $item->where('token', $token)->first();
  }
}
