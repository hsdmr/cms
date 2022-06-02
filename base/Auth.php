<?php

namespace Hasdemir\Base;

use Hasdemir\Exception\AuthenticationException;
use Hasdemir\Model\AccessToken;
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
    Log::currentJob(Codes::JOB_AUTH_ATTEMPT);
    try {
      $key = 'username';
      if (v::key('user', v::email())->validate($credentials)) {
        $key = 'email';
      }
      $sql = "SELECT * FROM user WHERE $key = :$key";
      $statement = $this->db->prepare($sql);
      $statement->bindValue(":$key", $credentials['user']);
      $GLOBALS[Codes::SQL_QUERIES][] = [
        Codes::QUERY => $sql,
        Codes::BINDS => [$key => $credentials['user']]
      ];
      $statement->execute();
      $user = $statement->fetch(PDO::FETCH_ASSOC);

      if (!$user) {
        switch ($key) {
          case 'username':
            throw new AuthenticationException("'username' is wrong", Codes::key(Codes::ERROR_USERNAME_IS_WRONG));

          case 'email':
            throw new AuthenticationException("'email' is wrong", Codes::key(Codes::ERROR_EMAIL_IS_WRONG));
        }
      }
      if ($user['deleted_at'] != null) {
        throw new AuthenticationException("This user deleted", Codes::key(Codes::ERROR_USER_DELETED));
      }
      if (!password_verify($_POST['password'], $user['password'])) {
        throw new AuthenticationException("'password' is incorrect", Codes::key(Codes::ERROR_PASSWORD_IS_INCORRECT));
      }

      Session::getInstance()->set('user', $user);
      return true;
    } finally {
      Log::endJob();
    }
  }

  public function check(): bool
  {
    Log::currentJob(Codes::JOB_AUTH_CHECK);
    try {
      if (!v::key('Authorization')->validate($this->header)) {
        throw new AuthenticationException('Authorization key must be sent', Codes::key(Codes::ERROR_ACCESS_TOKEN_NOT_SENT));
      }

      $authorization_key = $this->header['Authorization'];
      $access_token = AccessToken::findByToken(sha1($authorization_key));

      if (!(bool) $access_token) {
        throw new AuthenticationException('Authorization key not found', Codes::key(Codes::ERROR_ACCESS_TOKEN_NOT_FOUND));
      }

      if ($access_token->expires < time()) {
        throw new AuthenticationException('Authorization key expired', Codes::key(Codes::ERROR_ACCESS_TOKEN_EXPIRED));
      }

      return true;
    } finally {
      Log::endJob();
    }
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
      AccessToken::findByToken(sha1(Session::getInstance()->get('user')['access_token']))->delete();
      Session::getInstance()->remove('user');
    }
  }
}
