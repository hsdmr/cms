<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Layout extends Model
{
  protected string $table = 'layout';
  protected array $hidden = ['created_at', 'updated_at'];
  protected bool $soft_delete = true;

  const WHICH = ['header', 'footer', 'left-sidebar', 'right-sidebar'];
  const STATUS = ['active', 'passive'];

  public static function find(int $id)
  {
    $item = new Layout();
    return $item->findByPrimaryKey($id);
  }
}