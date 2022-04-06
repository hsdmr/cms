<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Category extends Model
{
  protected string $table = 'category';
  protected array $unique = ['permalink_id'];
  protected bool $soft_delete = false;

  public static function findById(int $id, $with_deleted = null, $only_deleted = null, $with_hidden = null)
  {
    $item = new Category();
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

  public function posts()
  {
    return $this->belongsToMany('post');
  }
}
