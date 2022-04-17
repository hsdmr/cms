<?php

namespace Hasdemir\Controller;

use Hasdemir\Controller\Codes;
use Hasdemir\Base\Log;
use Hasdemir\Base\Controller;
use Hasdemir\Base\Helper\Json;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\Option;
use Hasdemir\Model\User;
use Respect\Validation\Validator as v;

class RoleController extends Controller
{
  public function search($request, $args)
  {
    Log::currentJob(Codes::JOB_ROLE_SEARCH);
    try {
      $params = getSearchParamsWithDefaults($request->params());
      $roles = Option::findOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, 'roles');

      $options = new Option();
      $options->select('id', 'key', 'value')->WhereIn('key', $roles['value'] ?? []);

      if ($params['search']) {
        $options->where('key', 'LIKE', "%" . $params['search'] . "%");
      }

      $result = $options->order($params['order'] == 'role' ? 'key' : 'value', $params['by'])
        ->limit($params['limit'], $params['limit'] * ($params['page'] - 1))
        ->get();


      $response = [];
      if ($result) {
        foreach ($result as $item) {
          $item = $item->toArray();
          $response[] = [
            'role' => $item['key'],
            'permissions' => Json::decode($item['value']),
          ];
        }
      }

      $this->body = $response;
      $this->response(HTTP_OK);
    } finally {
      Log::endJob();
    }
  }

  public function create($request, $args)
  {
    Log::currentJob(Codes::JOB_ROLE_CREATE);
    try {
      try {
        $_POST = json_decode($request->body(), true);
        $this->validate($_POST);
        $role = Option::createOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, $_POST['role'], $_POST['permissions']);
        $this->body = $role->toArray();
        $this->response(HTTP_CREATED);
      } catch (\Throwable $th) {
        throw new NotFoundException('Role not created', [], $th);
      }
    } finally {
      Log::endJob();
    }
  }

  public function read($request, $args)
  {
    Log::currentJob(Codes::JOB_ROLE_READ);
    try {
      try {
        $option = Option::find($args['option_id']);

        $this->body = $option->toArray();
        $this->response(HTTP_OK);
      } catch (\Throwable $th) {
        throw new NotFoundException('Role not found', [], $th);
      }
    } finally {
      Log::endJob();
    }
  }

  public function delete($request, $args)
  {
    Log::currentJob(Codes::JOB_ROLE_DELETE);
    try {
      try {
        $option = Option::find($args['option_id']);

        $user = new User();
        $user = $user->where('role', $option->key)->first();

        if ($user) {
          throw new NotFoundException('Role can not deleted. Some user have this role', Codes::key(Codes::ERROR_ROLE_CAN_NOT_DELETED_SOME_USERS_HAS_IT));
        }

        $option->delete();
        $this->response(HTTP_NO_CONTENT);
      } catch (\Throwable $th) {
        throw new NotFoundException('Role not found', Codes::key(Codes::ERROR_ROLE_NOT_FOUND), $th);
      }
    } finally {
      Log::endJob();
    }
  }

  public function validate($params)
  {
    if (!v::key('role', v::positive())->validate($params)) {
      throw new UnexpectedValueException("'role' must be sent", Codes::key(Codes::ERROR_ROLE_MUST_BE_SENT));
    }
  }
}
