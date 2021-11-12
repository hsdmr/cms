<?php

namespace Hasdemir\Rest;

use Hasdemir\Base\Log;
use Hasdemir\Exception\StoragePdoException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\User;
use Respect\Validation\Validator as v;

class UserApi extends BaseApi
{
    const HELPER_LINK = ['link' => 'post'];
    
    public function search($request, $args)
    {
        Log::currentJob('user-search');
        try {
            $users = new User();
            $this->body = $users->all();
            $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function create($request, $args)
    {
        Log::currentJob('user-create');
        try {
            $_POST = json_decode($request->getBody(), true);
            $this->validate($_POST);
            $user = new User();
            $this->body = $user->create([
                'first_name' => $_POST['first_name'],
                'last_name' => $_POST['last_name'],
                'role' => $_POST['role'],
                'email' => $_POST['email'],
                'email_verified_at' => $_POST['email_verified_at'] ?? null,
                'password' => password_hash($_POST['password'], PASSWORD_DEFAULT)
            ]);
            $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function read($request, $args)
    {
        Log::currentJob('user-read');
        try {
            try {
                $user = new User();
                $this->body = $user->find($args[0]);
                $this->response(200);
            } catch (\Throwable $th) {
                throw new StoragePdoException('User not found', self::HELPER_LINK, $th);
            }
        } finally {
            Log::endJob();
        }
    }

    public function update($request, $args)
    {
        Log::currentJob('user-update');
        try {
            $_PUT = json_decode($request->getBody(), true);
            $this->validate($_PUT);
            $user = new User();
            $user->find($args[0]);
            $this->body = $user->update([
                'first_name' => $_PUT['first_name'],
                'last_name' => $_PUT['last_name'],
                'role' => $_PUT['role'],
                'email' => $_PUT['email'],
                'password' => password_hash($_PUT['password'], PASSWORD_DEFAULT)
            ]);
            $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function delete($request, $args)
    {
        Log::currentJob('user-delete');
        try {
            $user = new User();
            $user->find($args[0]);
            if ($user->delete()) {
                $this->response(200);
            }
        } finally {
            Log::endJob();
        }
    }

    public function validate($params): void
    {
        if (!v::key('first_name', v::stringType())->validate($params)) {
            throw new UnexpectedValueException("'first_name' must be string", self::HELPER_LINK);
        }

        if (!v::key('last_name', v::stringType())->validate($params)) {
            throw new UnexpectedValueException("'last_name' must be string", self::HELPER_LINK);
        }

        if (!v::key('role', v::in(['admin', 'user']))->validate($params)) {
            throw new UnexpectedValueException("'role' must be 'admin' or 'user'", self::HELPER_LINK);
        }

        if (!v::key('email', v::email())->validate($params)) {
            throw new UnexpectedValueException("'email' must be valid an email", self::HELPER_LINK);
        }

        if (!v::key('password', v::stringType())->validate($params)) {
            throw new UnexpectedValueException("'password' must be valid an email", self::HELPER_LINK);
        }

        if (!v::key('password_verified', v::stringType())->validate($params)) {
            throw new UnexpectedValueException("'password_verified' must be valid an email", self::HELPER_LINK);
        }

        if ($params['password'] != $params['password_verified']) {
            throw new UnexpectedValueException("'password_verified' must be the same as the 'password'", self::HELPER_LINK);
        }
    }
}