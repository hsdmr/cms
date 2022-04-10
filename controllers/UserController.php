<?php

namespace Hasdemir\Controller;

use Hasdemir\Controller\Codes;
use Hasdemir\Base\Log;
use Hasdemir\Base\Controller;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\User;
use Respect\Validation\Validator as v;
use Hasdemir\Base\Request;
use Hasdemir\Model\Option;

class UserController extends Controller
{
  const HELPER_LINK = ['link' => 'user'];

  public function search(Request $request, $args)
  {
    Log::currentJob(Codes::JOB_USER_SEARCH);
    try {
      $params = getParamsWithDefaults($request->params());

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
    }
    finally {
      Log::endJob();
    }
  }

  public function create(Request $request, $args)
  {
    Log::currentJob(Codes::JOB_USER_CREATE);
    try {
      $_POST = json_decode($request->body(), true);

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
          Option::createOption('user', $user['id'], $key, $value);
        }
      }

      $options = Option::findOptions('user', $user['id']);

      $response = $user;
      $response['options'] = $options;

      $this->body = $response;
      $this->response(HTTP_CREATED);
    }
    finally {
      Log::endJob();
    }
  }

  public function read(Request $request, $args)
  {
    Log::currentJob(Codes::JOB_USER_READ);
    try {
      try {
        $user = User::find($args['user_id']);
        $options = Option::findOptions('user', $user->id);

        $response = $user->toArray();
        $response['options'] = $options;
        $this->body = $response;
        $this->response(HTTP_OK);
      }
      catch (\Throwable $th) {
        throw new NotFoundException('User not found', self::HELPER_LINK, $th);
      }
    }
    finally {
      Log::endJob();
    }
  }

  public function update(Request $request, $args)
  {
    Log::currentJob(Codes::JOB_USER_UPDATE);
    try {
      $_PUT = json_decode($request->body(), true);

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

      $user = $user->update($update)->toArray();

      if (v::key('options')->validate($_PUT)) {
        foreach ($_PUT['options'] as $key => $value) {
          Option::createOption('user', $user['id'], $key, $value);
        }
      }

      $options = Option::findOptions('user', $user['id']);

      $response = $user;
      $response['options'] = $options;

      $this->body = $response;
      $this->response(HTTP_OK);
    }
    finally {
      Log::endJob();
    }
  }

  public function delete(Request $request, $args)
  {
    Log::currentJob(Codes::JOB_USER_DELETE);
    try {
      $user = User::find($args['user_id']);

      foreach($user->tokens() as $token) {
        $token->delete();
      }

      if ($user->delete()) {
        $this->response(HTTP_NO_CONTENT);
      }
    }
    finally {
      Log::endJob();
    }
  }

  public function validate($params, $method = 'create'): void
  {
    if (!v::key('first_name', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'first_name' must be string", self::HELPER_LINK);
    }
    if (!v::key('last_name', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'last_name' must be string", self::HELPER_LINK);
    }
    if (!v::key('role', v::in(['admin', 'user']))->validate($params)) {
      throw new UnexpectedValueException("'role' must be 'admin' or 'user'", self::HELPER_LINK);
    }
    if (!v::key('email', v::email())->validate($params)) {
      throw new UnexpectedValueException("'email' must be valid an email", self::HELPER_LINK);
    }
    if (!v::key('username', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'username' must be sent", self::HELPER_LINK);
    }
    if ($method == 'create') {
      if (!v::key('password', v::stringType())->validate($params)) {
        throw new UnexpectedValueException("'password' not valid", self::HELPER_LINK);
      }
    }
    else {
      if (!v::key('password', v::stringType(), false)->validate($params)) {
        throw new UnexpectedValueException("'password' not valid", self::HELPER_LINK);
      }
    }

    if (v::key('password')->validate($params) && v::key('password_verified')->validate($params)) {
      if (!v::key('password', v::equals($params['password_verified']), false)->validate($params)) {
        throw new UnexpectedValueException("'password_verified' must be the same as the 'password'", self::HELPER_LINK);
      }
    }
  }
}
