<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Layout extends Model
{
  protected string $table = 'layout';
  protected array $hidden = ['created_at', 'updated_at'];
  protected bool $soft_delete = true;

  const WHICH = ['header', 'footer', 'leftSidebar', 'rightSidebar'];
  const STATUS = ['passive', 'active'];

  public static function find(int $id)
  {
    $item = new Layout();
    return $item->findByPrimaryKey($id);
  }
}
