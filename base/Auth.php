<?php

namespace Hasdemir\Base;

use Hasdemir\Exception\AuthenticationException;
use Hasdemir\Model\AccessToken;
use Hasdemir\Model\User;
use PDO;
use Respect\Validation\Validator as v;
use UnexpectedValueException;

class Auth
{
    private static $db;
    private static $header;

    public static function setVariables()
    {
        self::$db = System::get('pdo');
        self::$header = getallheaders();
    }

    public static function attempt($credentials)
    {
        self::setVariables();
        if (!v::key('email')->validate($credentials)) {
            throw new UnexpectedValueException("'email' does not valid");
        }
        $sql = "SELECT * FROM user WHERE email = :email";
        $statement = self::$db->prepare($sql);
        $statement->bindValue(":email", $credentials['email']);
        $statement->execute();
        $user = $statement->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            throw new AuthenticationException("'email' is wrong");
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
        $access_token = AccessToken::getWithToken(sha1($authorization_key));

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
        $user = User::getWithId($access_token->user_id);
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
        $access_token = AccessToken::getWithToken(Session::get('user.session')['access_token'])->delete();
        Session::remove('user.session');
    }
}