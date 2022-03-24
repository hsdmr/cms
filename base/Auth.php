<?php

namespace Hasdemir\Base;

use Hasdemir\Exception\AuthenticationException;
use Hasdemir\Model\AccessToken;
use Hasdemir\Model\User;
use PDO;
use Respect\Validation\Validator as v;

class Auth
{
  private static $db;
  private static $header;

  public static function setVariables()
  {
    self::$db = System::getPdo();
    self::$header = getallheaders();
  }

  public static function attempt($credentials)
  {
    self::setVariables();
    $key = 'username';
    if (v::key('user', v::email())->validate($credentials)) {
      $key = 'email';
    }
    $sql = "SELECT * FROM user WHERE $key = :$key";
    $statement = self::$db->prepare($sql);
    $statement->bindValue(":$key", $credentials['user']);
    $statement->execute();
    $user = $statement->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
      throw new AuthenticationException("$key is wrong");
    }
    if (!password_verify($_POST['password'], $user['password'])) {
      throw new AuthenticationException("'password' is incorrect");
    }
    Session::set('user', $user);
    return true;
  }

  public static function check()
  {
    self::setVariables();
    if (!v::key('authorization')->validate(self::$header)) {
      throw new AuthenticationException('Authorization key must be sent');
    }

    $authorization_key = self::$header['authorization'];
    $access_token = AccessToken::findByToken(sha1($authorization_key));

    if (!(bool) $access_token) {
      throw new AuthenticationException('Authorization key not found');
    }

    if ($access_token->expires < time()) {
      throw new AuthenticationException('Authorization key expired');
    }

    return self::prepareResponse($access_token);
  }

  public static function prepareResponse(AccessToken $access_token)
  {
    $user = User::findById($access_token->user_id);
    $return = [
      'access_token' => $access_token->token,
      'scope' => $access_token->scope,
      'user_id' => $user->id,
      'first_name' => $user->first_name,
      'last_name' => $user->last_name,
      'role' => $user->role,
      'email' => $user->email,
      'options' => [],
      'permissions' => [],
    ];
    Session::set('user.session', $return);
    return $return;
  }

  public static function User()
  {
    return Session::get('user');
  }

  public static function id()
  {
    return Session::get('user')['id'];
  }

  public static function logout()
  {
    $access_token = AccessToken::findByToken(Session::get('user.session')['access_token'])->delete();
    Session::remove('user.session');
  }
}
