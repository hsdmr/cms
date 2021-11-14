<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class AccessToken extends Model
{
    protected $class = __CLASS__;
    protected $table = 'access_token';
    protected $unique = ['token'];
    protected $soft_delete = false;

    public static function getWithId(int $id, bool $as_array = false)
    {
        $item = new AccessToken();
        if ($as_array) {
            return $item->find($id)->toArray();
        }
        return $item->find($id);
    }

    public static function getWithToken(string $token, bool $as_array = false)
    {
        $item = new AccessToken();
        if ($as_array) {
            return $item->where([['token', '=', $token]])->first()->toArray();
        }
        return $item->where([['token', '=', $token]])->first();
    }
}
