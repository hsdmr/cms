<?php

namespace Hasdemir\Base;

class Codes
{

  const NAMESPACE_MODEL = 'Hasdemir\\Model\\';
  const NAMESPACE_CONTROLLER = 'Hasdemir\\Controller\\';
  const NAMESPACE_MIDDLEWARE = 'Hasdemir\\Middleware\\';

  const IS_ROUTE_CALLED = 'is_route_called';
  const IS_MIDDLEWARE_CALLED = 'is_middleware_called';

  const ROUTES = 'routes';
  const MIDDLEWARE = 'middleware';
  const PERMISSIONS = 'permissions';
  const ROLES = 'roles';

  const OPTION_TYPE_ADMIN_PANEL = 'admin_panel';
  const SQL_QUERIES = 'sql_queries';
  const QUERY = 'query';
  const BINDS = 'binds';

  const JOB_AUTH_ATTEMPT = 'authAttempt';
  const JOB_AUTH_CHECK = 'authCheck';

  const ERROR_PASSWORD_IS_INCORRECT = 'passwordIsIncorrect';
  const ERROR_EMAIL_IS_WRONG = 'emailIsWrong';
  const ERROR_USERNAME_IS_WRONG = 'usernameIsWrong';
  const ERROR_ACCESS_TOKEN_NOT_SENT = 'accessTokenNotSent';
  const ERROR_ACCESS_TOKEN_NOT_FOUND = 'accessTokenNotFound';
  const ERROR_ACCESS_TOKEN_EXPIRED = 'accessTokenExpired';
  const ERROR_DONT_HAVE_PERMISSION = 'dontHavePermission';
  const ERROR_UNKNOWN = 'unknownError';
  const ERROR_GENERIC_NOT_FOUND = 'genericNotFound';
  const ERROR_USER_DELETED = 'userDeleted';
  const ERROR_KEY_ALREADY_REGISTERED = 'keyAlreadyRegistered';
  const ERROR_URL_NOT_VALID = 'urlNotValid';
  const ERROR_CALLED_FUNCTION_NOT_IMPLEMENTED = 'calledFunctionNotImplemented';
  const ERROR_CALLED_MIDDLE_FUNCTION_NOT_IMPLEMENTED = 'calledMiddleFunctionNotImplemented';
  const ERROR_WHILE_MODEL_UPDATE = 'errorOccurredWhileModelUpdate';
  const ERROR_WHILE_MODEL_CREATE = 'errorOccurredWhileModelCreate';
  const ERROR_WHILE_MODEL_GET = 'errorOccurredWhileModelGET';
  const ERROR_WHILE_MODEL_BELONGS_TO_MANY = 'errorOccurredWhileModelCallBelongsToMany';
  const ERROR_WHILE_MODEL_BELONGS_TO = 'errorOccurredWhileModelCallBelongsTo';
  const ERROR_WHILE_MODEL_HAS_MANY = 'errorOccurredWhileModelCallHasMany';

  public static function key($key, $vars = [])
  {
    return [
      'key' => $key,
      'vars' => $vars
    ];
  }
}
