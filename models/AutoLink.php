<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class AutoLink extends Model
{
  protected $table = 'auto_link';
  protected $unique = ['word'];

  public static function findById(int $id)
  {
    $item = new AutoLink();
    return $item->find($id);
  }

  public static function findByMeta(string $word)
  {
    $item = new AutoLink();
    return $item->where([['word', '=', $word]])->first();
  }
}
