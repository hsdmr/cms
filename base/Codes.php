<?php

namespace Hasdemir\Base;

class Codes
{

  public static function key($key)
  {
    return ['key' => $key];
  }


  const NAMESPACE_API = 'Hasdemir\\Rest\\';
  const NAMESPACE_MODEL = 'Hasdemir\\Model\\';
  const NAMESPACE_CONTROLLER = 'Hasdemir\\Controller\\';
  const NAMESPACE_MIDDLEWARE = 'Hasdemir\\Middleware\\';

  const IS_ROUTE_CALLED = 'is_route_called';
  const IS_MIDDLEWARE_CALLED = 'is_middleware_called';
  
  const ROUTES = 'routes';
  const MIDDLEWARE = 'middleware';

  const SQL_QUERIES = 'sql_queries';
  const QUERY = 'query';
  const BINDS = 'binds';

  const PASSWORD_IS_INCORRECT = 'passwordIsIncorrect';
  const EMAIL_IS_WRONG = 'emailIsWrong';
  const USERNAME_IS_WRONG = 'usernameIsWrong';
  const ACCESS_TOKEN_NOT_SENT = 'accessTokenNotSent';
  const ACCESS_TOKEN_NOT_FOUND = 'accessTokenNotFound';
  const ACCESS_TOKEN_EXPIRED = 'accessTokenExpired';
}