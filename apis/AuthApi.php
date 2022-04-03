<?php

namespace Hasdemir\Rest;

use Hasdemir\Base\Auth;
use Hasdemir\Rest\Codes;
use Hasdemir\Base\Log;
use Hasdemir\Base\Rest;
use Hasdemir\Model\AccessToken;

class AuthApi extends Rest
{
  const LIFE_TIME = '+2 hour';

  public function login($request, $args)
  {
    Log::currentJob(Codes::JOB_LOGIN);
    try {
      $_POST = json_decode($request->body(), true);

      if (Auth::getInstance()->attempt(['user' => $_POST['user'], 'password' => $_POST['password']])) {
        $access_token = new AccessToken();
        $item = $access_token->where('user_id', Auth::id())->where('type', 'temp')->first();
        $token = randomString(60);
        if ($item) {
          $access_token = $access_token->update([
            'token' => sha1($token),
            'expires' => strtotime(self::LIFE_TIME)
          ]);
        }
        else {
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
      $this->body = Auth::getInstance()->prepareResponse($access_token);
      $this->response(HTTP_CREATED);
    }
    finally {
      Log::endJob();
    }
  }

  public function check($request, $args)
  {
    Log::currentJob(Codes::JOB_AUTH_CHECK);
    try {
      $this->body = Auth::getInstance()->check();
      $this->response(HTTP_OK);
    } finally {
      Log::endJob();
    }
  }

  public function logout($request, $args)
  {
    Log::currentJob(Codes::JOB_LOGOUT);
    try {
      Auth::logout();
      $this->response(HTTP_NO_CONTENT);
    } finally {
      Log::endJob();
    }
  }
}
