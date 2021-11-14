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
        $user = new User();
        if ($as_array) {
            return $user->asArray()->find($id);
        }
        return $user->find($id);
    }

    public static function getWithEmail(string $email, bool $as_array = false)
    {
        $user = new User();
        if ($as_array) {
            return $user->asArray()->where([['email', '=', $email]])->first();
        }
        return $user->where([['email', '=', $email]])->first();
    }
}