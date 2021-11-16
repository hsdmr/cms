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
    const LIFE_TIME = '+2 hour';

    public function login($request, $args)
    {
        Log::currentJob('login-attempt');
        try {
            $_POST = json_decode($request->body(), true);

            if (Auth::attempt(['email' => $_POST['email'], 'password' => $_POST['password']])) {
                $access_token = new AccessToken();
                $item = $access_token->where([['user_id', '=', Auth::id()], ['type', '=', 'temp']])->first();
                $token = random_string(60);
                if ($item) {
                    $access_token = $access_token->update([
                        'token' => sha1($token),
                        'expires' => strtotime(self::LIFE_TIME)
                    ]);
                } else {
                    $access_token = $access_token->create([
                        'user_id' => Auth::id(),
                        'token' => sha1($token),
                        'type' => 'temp', //int, ext, temp
                        'attributes' => null,
                        'scope' => null,
                        'expires' => strtotime(self::LIFE_TIME)
                    ]);
                }
            }
            $access_token->token = $token;
            $this->body = Auth::prepareResponse($access_token);
            $this->response(201);

        } finally {
            Log::endJob();
        }
    }
}
