<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Option extends Model
{
  protected string $table = 'user_meta';

  public static function findById(int $id)
  {
    $item = new Option();
    $item = $item->find($id);
    $item->value = json_decode($item->value, true);
    return $item;
  }

  public static function findOption(string $type = null, int $type_id = null, string $key)
  {
    $item = new Option();
    $item = $item->where('type', $type)->where('type_id', $type_id)->where('key', $key)->first();
    $item->value = json_decode($item->value, true);
    return $item;
  }

  public static function findOptions(string $type = null, int $type_id = null)
  {
    $items = new Option();
    $options = [];
    foreach ($items->where('type', $type)->where('type_id', $type_id)->get() as $item) {
      $item->value = json_decode($item->value, true);
      $options[] = $item;
    }
    return $options;
  }
}
