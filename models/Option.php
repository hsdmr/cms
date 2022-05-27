<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Helper\Json;

class Option extends Model
{
  protected string $table = 'option';

  public static function find(int $id)
  {
    $item = new Option();
    return $item->findByPrimaryKey($id);
  }

  public static function findOption(string $type, int $type_id = null, string $key)
  {
    $item = new Option();
    $item->where('type', $type);

    if ($type_id) {
      $item->where('type_id', $type_id);
    } else {
      $item->whereNull('type_id');
    }

    $item->where('key', $key)->first();

    if ($item['value']) {
      $item['value'] = Json::decode($item['value']);
    }

    return $item;
  }

  public static function findOptions(string $type, int $type_id = null)
  {
    $items = new Option();
    $items->where('type', $type);
    if ($type_id) {
      $items->where('type_id', $type_id);
    } else {
      $items->whereNull('type_id');
    }
    $items = $items->get();

    $options = [];
    foreach ($items as $item) {
      if ($item['value']) {
        $options[$item['key']] = Json::decode($item['value']);
      }
    }
    return $options;
  }

  public static function saveOption(string $type, int $type_id, string $key, $value)
  {
    $option = self::findOption($type, $type_id, $key);

    if ($option['value']) {
      $option->update([
        'value' =>  Json::encode($value),
      ]);
    } else {
      $option->create([
        'type' => $type,
        'type_id' => $type_id ? $type_id : null,
        'key' => $key,
        'value' =>  Json::encode($value),
      ]);
    }

    return $option;
  }
}
