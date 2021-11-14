<?php

namespace Hasdemir\Rest;

use Hasdemir\Base\Auth;
use Hasdemir\Base\Log;
use Hasdemir\Exception\AuthenticationException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\AccessToken;
use Hasdemir\Model\User;
use Respect\Validation\Validator as v;

class AuthApi extends BaseApi
{
    public function login($request, $args)
    {
        Log::currentJob('login-attempt');
        try {
            $_POST = json_decode($request->body(), true);

            if (!v::key('email')->validate($_POST)) {
                throw new UnexpectedValueException("'email' does not valid");
            }
            
            $user = new User();
            $user = $user->select(['id', 'email', 'password'])
                        ->where([['email', '=', $_POST['email']]])
                        ->first();
                        
            if (!$user) {
                throw new AuthenticationException("'email' is wrong");
            }
            
            if (!password_verify($_POST['password'], $user->password)) {
                throw new AuthenticationException("'password' is incorrect");
            }

            $access_token = new AccessToken();
            $item = $access_token->where([['user_id', '=', $user->id], ['type', '=', 'temp']])->first();
            $token = random_string(60);
            if ($item) {
                $access_token = $access_token->update([
                    'token' => sha1($token),
                    'expires' => $this->lifetime
                ]);
            } else {
                $access_token = $access_token->create([
                    'user_id' => $user['id'],
                    'token' => sha1($token),
                    'type' => 'temp', //int, ext, temp
                    'attributes' => null,
                    'scope' => null,
                    'expires' => $this->lifetime
                ]);
            }
            $access_token->token = $token;
            BaseApi::$authenticatedUser = Auth::prepareResponse($access_token);
            $this->body = BaseApi::$authenticatedUser;
            $this->response(201);

        } finally {
            Log::endJob();
        }
    }
}
