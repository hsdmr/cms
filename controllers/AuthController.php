<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Auth;
use Hasdemir\Controller\Codes;
use Hasdemir\Base\Controller;
use Hasdemir\Base\Session;
use Hasdemir\Exception\AuthenticationException;
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
        $access_token->where('user_id', Auth::id())->where('type', 'temporary')->first();
        $token = randomString(60);

        if ($access_token['id']) {
          $access_token->update([
            'user_id' => Auth::id(),
            'token' => sha1($token),
            'expires' => strtotime(self::LIFE_TIME)
          ]);
        } else {
          $access_token->create([
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
      $this->body = $this->prepareResponse($access_token);
      $this->response(HTTP_CREATED);
    } finally {
      $this->endJob();
    }
  }

  public function check($request, $args)
  {
    if (!Auth::getInstance()->check()) {
      throw new AuthenticationException('Authorization key must be sent', Codes::key(Codes::ERROR_ACCESS_TOKEN_NOT_SENT));
    }

    $this->response(HTTP_NO_CONTENT);
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

  private function prepareResponse(AccessToken $access_token)
  {
    $this->currentJob(Codes::JOB_AUTH_PREPARE_RESPONSE, false);
    try {
      $user = $access_token->user();

      $return = [
        'access_token' => $access_token->token,
        'scope' => $access_token->scope,
        'id' => $user->id,
        'first_name' => $user->first_name,
        'last_name' => $user->last_name,
        'role' => $user->role,
        'email' => $user->email,
        'options' => $user->options(),
        'permissions' => $user->permissions(),
      ];
      Session::getInstance()->set('user', $return);
      return $return;
    } finally {
      $this->endJob();
    }
  }
}
