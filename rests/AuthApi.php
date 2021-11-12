<?php

namespace Hasdemir\Rest;

use Hasdemir\Base\Log;
use Hasdemir\Exception\AuthenticationException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\AccessToken;
use Hasdemir\Model\User;
use Respect\Validation\Rules\Base;
use Respect\Validation\Validator as v;

class AuthApi extends BaseApi
{
    public function login($request, $args)
    {
        Log::currentJob('login-attempt');
        try {
            $_POST = json_decode($request->getBody(), true);

            if (!v::key('email')->validate($_POST)) {
                throw new UnexpectedValueException("'email' does not valid");
            }
            
            $user = new User();
            $user = $user->select(['id', 'first_name', 'last_name', 'role', 'email', 'email_verified_at', 'password'])
                        ->where([['email', '=', $_POST['email']]])
                        ->first();
            
            if (!$user) {
                throw new AuthenticationException("'email' is wrong");
            }
            
            if (!password_verify($_POST['password'], $user['password'])) {
                throw new AuthenticationException("'password' is incorrect");
            }

            $access_token = new AccessToken();
            $token = $access_token->where([['user_id', '=', $user['id']], ['type', '=', 'temp']])->first();
            if ($token) {
                $access_token = $access_token->update([
                    'user_id' => $user['id'],
                    'token' => random_string(60),
                    'type' => 'temp', //int, ext, temp
                    'attributes' => null,
                    'scope' => null,
                    'expires' => strtotime('+2 hour')
                ]);
            } else {
                $access_token = $access_token->create([
                    'user_id' => $user['id'],
                    'token' => random_string(60),
                    'type' => 'temp', //int, ext, temp
                    'attributes' => null,
                    'scope' => null,
                    'expires' => strtotime('+2 hour')
                ]);
            }
            BaseApi::$authenticatedUser = [
                'access_token' => $access_token['token'],
                'user_id' => $user['id'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'role' => $user['role'],
                'email' => $user['email'],
                'options' => [],
                'permissions' => [],
            ];
            $this->body = BaseApi::$authenticatedUser;
            $this->response(201);

        } finally {
            Log::endJob();
        }
    }
}
