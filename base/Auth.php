<?php

namespace Hasdemir\Base;

use Hasdemir\Exception\AuthenticationException;
use Hasdemir\Model\AccessToken;
use Hasdemir\Model\User;
use PDO;
use Respect\Validation\Validator as v;
use Hasdemir\Model\Option;

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
      switch ($key) {
        case 'username':
          throw new AuthenticationException("'username' is wrong", Codes::key(Codes::USERNAME_IS_WRONG));
        
        case 'email':
          throw new AuthenticationException("'email' is wrong", Codes::key(Codes::EMAIL_IS_WRONG));
      }
    }
    if ($user['deleted_at'] != null) {
      throw new AuthenticationException("This user deleted");
    }
    if (!password_verify($_POST['password'], $user['password'])) {
      throw new AuthenticationException("'password' is incorrect", Codes::key(Codes::PASSWORD_IS_INCORRECT));
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
    $user = new User();
    $user = $user->find($access_token->user_id);
    
    $options = Option::findOptions('user',$user->id);

    $return = [
      'access_token' => $access_token->token,
      'scope' => $access_token->scope,
      'id' => $user->id,
      'first_name' => $user->first_name,
      'last_name' => $user->last_name,
      'role' => $user->role,
      'email' => $user->email,
      'options' => $options,
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
