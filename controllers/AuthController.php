<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Auth;
use Hasdemir\Controller\Codes;
use Hasdemir\Base\Controller;
use Hasdemir\Helper\Json;
use Hasdemir\Model\AccessToken;

class AuthController extends Controller
{
  const LIFE_TIME = '+2 hour';

  public function login($request, $args)
  {
    $this->currentJob(Codes::JOB_LOGIN, false);
    try {
      $_POST = Json::decode($request->body(), true);

      if (Auth::getInstance()->attempt(['user' => $_POST['user'], 'password' => $_POST['password']])) {
        $access_token = new AccessToken();
        $item = $access_token->where('user_id', Auth::id())->where('type', 'temporary')->first();
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
            'type' => 'temporary',
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
      $this->endJob();
    }
  }

  public function check($request, $args)
  {
    $this->currentJob(Codes::JOB_AUTH_CHECK, false);
    try {
      $this->body = Auth::getInstance()->check();
      $this->response(HTTP_OK);
    } finally {
      $this->endJob();
    }
  }

  public function logout($request, $args)
  {
    $this->currentJob(Codes::JOB_LOGOUT, false);
    try {
      Auth::logout();
      $this->response(HTTP_NO_CONTENT);
    } finally {
      $this->endJob();
    }
  }
}
