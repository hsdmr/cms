<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class AutoLink extends Model
{
  protected string $table = 'auto_link';
  protected bool $unique = ['word'];

  public static function find(int $id)
  {
    $item = new AutoLink();
    return $item->findByPrimaryKey($id);
  }

  public static function findByMeta(string $word)
  {
    $item = new AutoLink();
    return $item->where('word', $word)->first();
  }
}
