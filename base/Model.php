<?php

namespace Hasdemir\Base;


class Model extends Builder
{

  public static $model;

  public function __construct()
  {
    self::$model = getModelFromTable($this->table);
    parent::__construct();

  }
  
  public static function find(int $id, $with_deleted = null, $only_deleted = null, $with_hidden = null)
  {
    $item = new self::$model;
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
}
