<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Option extends Model
{
    protected $table = 'user_meta';

    public static function findById(int $id)
    {
        $item = new Option();
        $item = $item->find($id);
        $item->value = json_decode($item->value, true);
        return $item;
    }

    public static function findOption(int $user_id = null, string $meta)
    {
        $item = new Option();
        $item = $item->where([['user_id', '=', $user_id], ['string', '=', $meta]])->first();
        $item->value = json_decode($item->value, true);
        return $item;
    }
    
    public static function findOptions(int $user_id = null)
    {
        $items = new Option();
        $options = [];
        foreach ($items->where([['user_id', '=', $user_id]])->get() as $item) {
            $item->value = json_decode($item->value, true);
            $options[] = $item;
        }
        return $options;
    }
}