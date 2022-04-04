<?php

namespace Hasdemir\Rest;

use Hasdemir\Rest\Codes;
use Hasdemir\Base\Log;
use Hasdemir\Base\Rest;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\User;
use Respect\Validation\Validator as v;
use Hasdemir\Base\Request;

class UserApi extends Rest
{
  const HELPER_LINK = ['link' => 'user'];

  public function search(Request $request, $args)
  {
    Log::currentJob(Codes::JOB_USER_SEARCH);
    try {
      $params = $request->params();

      $total = new User();
      $this->header['Total-Row'] = $total->select('COUNT(*) as total')->first()['total'];

      $users = new User();
      $this->body = $users->where('first_name', 'LIKE', "%" . $params['search'] . "%")
      ->orWhere('last_name', 'LIKE', "%" . $params['search'] . "%")
      ->orWhere('email', 'LIKE', "%" . $params['search'] . "%")
      ->orWhere('username', 'LIKE', "%" . $params['search'] . "%")
      ->orWhere('nickname', 'LIKE', "%" . $params['search'] . "%")
      ->orWhere('phone', 'LIKE', "%" . $params['search'] . "%")
      ->order($params['order'], $params['by'])
      ->limit($params['limit'], $params['limit'] * ($params['page'] - 1))
      ->get();
      
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
      $this->body = $user->create([
        'first_name' => $_POST['first_name'],
        'last_name' => $_POST['last_name'],
        'role' => $_POST['role'],
        'email' => $_POST['email'],
        'username' => $_POST['username'],
        'email_verified_at' => $_POST['email_verified_at'] ?? null,
        'password' => password_hash($_POST['password'], PASSWORD_BCRYPT)
      ])->toArray();
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
        $user_id = $args['user_id'];

        $user = User::findById($user_id);
        $response = $user->toArray();
        $response['posts'] = $user->posts();
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
      $user_id = $args['user_id'];

      $this->validate($_PUT);

      $user = User::findById($user_id);
      $this->body = (array)$user->update([
        'first_name' => $_PUT['first_name'],
        'last_name' => $_PUT['last_name'],
        'role' => $_PUT['role'],
        'email' => $_PUT['email'],
        'username' => $_PUT['username'],
        'password' => password_hash($_PUT['password'], PASSWORD_BCRYPT)
      ])->toArray();
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
      $user_id = $args['user_id'];

      if (User::findById($user_id)->delete()) {
        $this->response(HTTP_NO_CONTENT);
      }
    }
    finally {
      Log::endJob();
    }
  }

  public function validate($params): void
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
    if (!v::key('password', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'password' must be valid an email", self::HELPER_LINK);
    }
    if (!v::key('password_verified', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'password_verified' must be valid an email", self::HELPER_LINK);
    }
    if ($params['password'] != $params['password_verified']) {
      throw new UnexpectedValueException("'password_verified' must be the same as the 'password'", self::HELPER_LINK);
    }
  }
}
