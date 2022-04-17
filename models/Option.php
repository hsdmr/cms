<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Base\Helper\Json;

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

    if ($type_id) {
      $item = $item->where('type', $type)->where('type_id', $type_id)->where('key', $key)->first();
    }
    else {
      $item = $item->where('type', $type)->whereNull('type_id')->where('key', $key)->first();
    }

    if ($item) {
      $item = $item->toArray();
      $item['value'] =  Json::decode($item['value']);
    }

    return $item;
  }
  public static function createOption(string $type, int $type_id, string $key, $value)
  {
    $option = self::findOption($type, $type_id, $key);
    
    if ($option) {
      self::find($option['id'])->forceDelete();
    }

    $item = new Option();
    $item = $item->create([
      'type' => $type,
      'type_id' => $type_id ? $type_id : null,
      'key' => $key,
      'value' =>  Json::encode($value),
    ])->toArray();

    return $item;
  }

  public static function findOptions(string $type, int $type_id = null)
  {
    $items = new Option();

    if ($type_id) {
      $items = $items->where('type', $type)->where('type_id', $type_id)->get();
    }
    else {
      $items = $items->where('type', $type)->whereNull('type_id')->get();
    }

    $options = [];
    foreach ($items as $item) {
      if ($item) {
        $item = $item->toArray();
        $options[$item['key']] = Json::decode($item['value']);
      }
    }
    return $options;
  }
}
