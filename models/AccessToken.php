<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class AccessToken extends Model
{
    protected $table = 'access_token';
    protected $unique = ['token'];
    protected $soft_delete = false;

    public static function findById(int $id)
    {
        $item = new AccessToken();
        return $item->find($id);
    }

    public static function findByToken(string $token)
    {
        $item = new AccessToken();
        return $item->where([['token', '=', $token]])->first();
    }
}
