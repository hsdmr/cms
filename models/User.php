<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class User extends Model
{
    protected $class = __CLASS__;
    protected $table = 'user';
    protected $unique = ['email'];
    protected $protected = ['password'];
    protected $soft_delete = true;

    public static function getWithId(int $id, bool $as_array = false)
    {
        $item = new User();
        if ($as_array) {
            return $item->find($id)->toArray();
        }
        return $item->find($id);
    }

    public static function getWithEmail(string $email, bool $as_array = false)
    {
        $item = new User();
        if ($as_array) {
            return $item->where([['email', '=', $email]])->first()->toArray();
        }
        return $item->where([['email', '=', $email]])->first();
    }
}