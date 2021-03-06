<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Auth;
use Hasdemir\Controller\Codes;
use Hasdemir\Helper\Json;
use Hasdemir\Base\Controller;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\User;
use Respect\Validation\Validator as v;
use Hasdemir\Base\Request;
use Hasdemir\Exception\NotAllowedException;
use Hasdemir\Model\Option;

class UserController extends Controller
{
  public function search(Request $request, $args)
  {
    $this->currentJob(Codes::JOB_USER_SEARCH);
    try {
      $params = getSearchParamsWithDefaults($request->params());

      $total = new User();
      $this->header['Total-Row'] = $total->select('COUNT(*) as total')->first()['total'];

      $users = new User();
      if ($params['search']) {
        $users->openPharanthesis()
          ->where('first_name', 'LIKE', "%" . $params['search'] . "%")
          ->orWhere('last_name', 'LIKE', "%" . $params['search'] . "%")
          ->orWhere('email', 'LIKE', "%" . $params['search'] . "%")
          ->orWhere('username', 'LIKE', "%" . $params['search'] . "%")
          ->orWhere('nickname', 'LIKE', "%" . $params['search'] . "%")
          ->orWhere('phone', 'LIKE', "%" . $params['search'] . "%")
          ->closePharanthesis();
      }
      if ($params['trash']) {
        $users->onlyDeleted();
      }
      $response = $users->order($params['order'], $params['by'])
        ->limit($params['limit'], $params['limit'] * ($params['page'] - 1))
        ->get();

      $this->body = $response;
      $this->response(HTTP_OK);
    } finally {
      $this->endJob();
    }
  }

  public function create(Request $request, $args)
  {
    $this->currentJob(Codes::JOB_USER_CREATE);
    try {
      $_POST = Json::decode($request->body(), true);

      $this->validate($_POST);

      $user = new User();
      $user = $user->create([
        'first_name' => $_POST['first_name'],
        'last_name' => $_POST['last_name'],
        'role' => $_POST['role'],
        'email' => $_POST['email'],
        'username' => $_POST['username'],
        'email_verified_at' => $_POST['email_verified_at'] ?? null,
        'password' => password_hash($_POST['password'], PASSWORD_BCRYPT)
      ])->toArray();

      if (v::key('options')->validate($_POST)) {
        foreach ($_POST['options'] as $key => $value) {
          Option::saveOption('user', $user['id'], $key, $value);
        }
      }

      $this->response(HTTP_CREATED);
    } finally {
      $this->endJob();
    }
  }

  public function read(Request $request, $args)
  {
    $this->currentJob(Codes::JOB_USER_READ);
    try {
      try {
        $user = User::find($args['user_id']);
        $options = Option::findOptions('user', $user->id);

        $response = $user->toArray();
        $response['options'] = $options;
        $this->body = $response;
        $this->response(HTTP_OK);
      } catch (\Throwable $th) {
        throw new NotFoundException('User not found', Codes::key(Codes::ERROR_USER_NOT_FOUND), $th);
      }
    } finally {
      $this->endJob();
    }
  }

  public function update(Request $request, $args)
  {
    $this->currentJob(Codes::JOB_USER_UPDATE);
    try {
      $_PUT = Json::decode($request->body(), true);

      $this->validate($_PUT, 'update');

      $user = User::find($args['user_id']);

      $update = [
        'first_name' => $_PUT['first_name'],
        'last_name' => $_PUT['last_name'],
        'role' => $_PUT['role'],
        'email' => $_PUT['email'],
        'username' => $_PUT['username'],
      ];
      if (isset($_PUT['password'])) {
        $update['password'] = password_hash($_PUT['password'], PASSWORD_BCRYPT);
      }

      $user->update($update);

      if (v::key('options')->validate($_PUT)) {
        foreach ($_PUT['options'] as $key => $value) {
          Option::saveOption('user', $user['id'], $key, $value);
        }
      }

      $this->response(HTTP_NO_CONTENT);
    } finally {
      $this->endJob();
    }
  }

  public function delete(Request $request, $args)
  {
    $this->currentJob(Codes::JOB_USER_DELETE);
    try {
      if (Auth::id() == $args['user_id']) {
        throw new NotAllowedException("Auth user can not delete own profile", Codes::key(Codes::ERROR_AUTH_USER_CAN_NOT_DELETE_OWN_PROFILE));
      }

      $user = User::find($args['user_id']);

      foreach ($user->tokens() as $token) {
        $token->delete();
      }

      if (!$user->delete()) {
        throw new NotFoundException('User not found', Codes::key(Codes::ERROR_USER_NOT_FOUND));
      }

      $this->response(HTTP_NO_CONTENT);
    } finally {
      $this->endJob();
    }
  }

  public function restore(Request $request, $args)
  {
    $this->currentJob(Codes::JOB_USER_RESTORE);
    try {
      User::find($args['user_id'])->update(['deleted_at' => null]);
      $this->response(HTTP_NO_CONTENT);
    } finally {
      $this->endJob();
    }
  }

  public function permanentDelete(Request $request, $args)
  {
    $this->currentJob(Codes::JOB_USER_PERMANENT_DELETE);
    try {

      if (!User::find($args['user_id'])->forceDelete()) {
        throw new NotFoundException('User not found', Codes::key(Codes::ERROR_USER_NOT_FOUND));
      }

      $this->response(HTTP_NO_CONTENT);
    } finally {
      $this->endJob();
    }
  }

  public function constants(Request $request, $args)
  {
    $this->currentJob(Codes::JOB_USER_CONSTANTS, false);
    try {
      $roles = Option::findOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, Codes::ROLES);

      $this->body = [
        'roles' => $roles['value'] ?? User::ROLES,
      ];

      $this->response(HTTP_OK);
    } finally {
      $this->endJob();
    }
  }

  public function validate($params, $method = 'create'): void
  {
    $roles = Option::findOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, Codes::ROLES);
    $roles = $roles['value'] ?? User::ROLES;

    if (!v::key('first_name', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'first_name' must be sent", Codes::key(Codes::ERROR_FIRST_NAME_MUST_NOT_BE_EMPTY));
    }
    if (!v::key('last_name', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'last_name' must be sent", Codes::key(Codes::ERROR_LAST_NAME_MUST_NOT_BE_EMPTY));
    }
    if (!v::key('role', v::in($roles))->validate($params)) {
      throw new UnexpectedValueException("'role' must be " . implode(', ', $roles), Codes::key(Codes::ERROR_ROLE_NOT_ALLOWED));
    }
    if (!v::key('email', v::email())->validate($params)) {
      throw new UnexpectedValueException("'email' must be valid an email", Codes::key(Codes::ERROR_EMAIL_NOT_VALID));
    }
    if (!v::key('username', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'username' must be sent", Codes::key(Codes::ERROR_USERNAME_MUST_BE_SENT));
    }
    if ($method == 'create') {
      if (!v::key('password', v::stringType())->validate($params)) {
        throw new UnexpectedValueException("'password' not valid", Codes::key(Codes::ERROR_PASSWORD_NOT_VALID));
      }
    } else {
      if (!v::key('password', v::stringType(), false)->validate($params)) {
        throw new UnexpectedValueException("'password' not valid", Codes::key(Codes::ERROR_PASSWORD_NOT_VALID));
      }
    }

    if (v::key('password')->validate($params) && v::key('password_verified')->validate($params)) {
      if (!v::key('password', v::equals($params['password_verified']), false)->validate($params)) {
        throw new UnexpectedValueException("'password_verified' must be the same as the 'password'", Codes::key(Codes::ERROR_PASSWORDS_NOT_MATCH));
      }
    }
  }
}
