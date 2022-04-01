<?php

namespace Hasdemir\Base;

use Hasdemir\Exception\AuthenticationException;
use Hasdemir\Model\AccessToken;
use Hasdemir\Model\User;
use PDO;
use Respect\Validation\Validator as v;

class Auth
{
  private $db;
  private $header;
  private static $instance;

  public function __construct()
  {
    $this->db = System::getPdo();
    $this->header = getallheaders();
  }

  public static function getInstance()
  {
    if (!isset(self::$instance)) {
      self::$instance = new Auth();
    }
    return self::$instance;
  }

  public function attempt($credentials)
  {
    $key = 'username';
    if (v::key('user', v::email())->validate($credentials)) {
      $key = 'email';
    }
    $sql = "SELECT * FROM user WHERE $key = :$key";
    $statement = $this->db->prepare($sql);
    $statement->bindValue(":$key", $credentials['user']);
    $statement->execute();
    $user = $statement->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
      throw new AuthenticationException("'$key' is wrong");
    }
    if (!password_verify($_POST['password'], $user['password'])) {
      throw new AuthenticationException("'password' is incorrect");
    }
    Session::getInstance()->set('user', $user);
    return true;
  }

  public function check()
  {
    if (!v::key('Authorization')->validate($this->header)) {
      throw new AuthenticationException('Authorization key must be sent');
    }

    $authorization_key = $this->header['Authorization'];
    $access_token = AccessToken::findByToken(sha1($authorization_key));
    
    if (!(bool) $access_token) {
      throw new AuthenticationException('Authorization key not found');
    }
    
    if ($access_token->expires < time()) {
      throw new AuthenticationException('Authorization key expired');
    }
    
    $access_token->token = $authorization_key;
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
    Session::getInstance()->set('user.session', $return);
    return $return;
  }

  public static function User()
  {
    return Session::getInstance()->get('user');
  }

  public static function id()
  {
    return Session::getInstance()->get('user')['id'];
  }

  public static function logout()
  {
    if (self::getInstance()->check()) {
      AccessToken::findByToken(sha1(Session::getInstance()->get('user.session')['access_token']))->delete();
      Session::getInstance()->remove('user.session');
    }
  }
}
