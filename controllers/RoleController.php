<?php

namespace Hasdemir\Controller;

use Hasdemir\Controller\Codes;
use Hasdemir\Base\Controller;
use Hasdemir\Exception\NotAllowedException;
use Hasdemir\Helper\Json;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\Option;
use Hasdemir\Model\User;
use Respect\Validation\Validator as v;

class RoleController extends Controller
{
  public function search($request, $args)
  {
    $this->currentJob(Codes::JOB_ROLE_SEARCH);
    try {
      $params = getSearchParamsWithDefaults($request->params());
      $roles = Option::findOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, Codes::ROLES);
      
      $this->header['Total-Row'] = count($roles['value']);

      $options = new Option();
      $options->select('id', 'key', 'value', 'updated_at')->WhereIn('key', $roles['value'] ?? []);

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
            'id' => $item['id'],
            'role' => $item['key'],
            'permissions' => Json::decode($item['value']),
            'updated_at' => $item['updated_at']
          ];
        }
      }

      $this->body = $response;
      $this->response(HTTP_OK);
    } finally {
      $this->endJob();
    }
  }

  public function create($request, $args)
  {
    $this->currentJob(Codes::JOB_ROLE_CREATE);
    try {
      $_POST = Json::decode($request->body(), true);
      $this->validate($_POST);
      $role = Option::saveOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, $_POST['role'], $_POST[Codes::PERMISSIONS]);
      $roles = Option::findOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, Codes::ROLES);
      $value = $roles['value'];

      if (!in_array($role['key'], $value)) {
        $value[] = $role['key'];
        Option::saveOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, Codes::ROLES, $value);
      }
      
      $this->response(HTTP_CREATED);
    } finally {
      $this->endJob();
    }
  }

  public function read($request, $args)
  {
    $this->currentJob(Codes::JOB_ROLE_READ);
    try {
      try {
        $option = Option::find($args['role_id']);
        $option->value = Json::decode($option->value);

        $this->body = $option->toArray();
        $this->response(HTTP_OK);
      } catch (\Throwable $th) {
        throw new NotFoundException('Role not found', [], $th);
      }
    } finally {
      $this->endJob();
    }
  }

  public function delete($request, $args)
  {
    $this->currentJob(Codes::JOB_ROLE_DELETE);
    try {
      $option = Option::find($args['role_id']);

      $user = new User();
      $user = $user->where('role', $option->key)->first();

      if ($user['role']) {
        throw new NotAllowedException('Role can not deleted. Some user have this role', Codes::key(Codes::ERROR_ROLE_CAN_NOT_DELETED_SOME_USERS_HAS_IT));
      }

      $roles = Option::findOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, Codes::ROLES);
      $value = $roles['value'];

      if (in_array($option->key, $value)) {
        unset($value[$option->key]);
        Option::saveOption(Codes::OPTION_TYPE_ADMIN_PANEL, 0, Codes::ROLES, $value);
      }

      if ($option->delete()) {
        $this->response(HTTP_NO_CONTENT);
      }

      throw new NotFoundException('Role not found!', Codes::key(Codes::ERROR_GENERIC_NOT_FOUND, ['generic' => 'Role']));
    } finally {
      $this->endJob();
    }
  }

  public function validate($params)
  {
    if (!v::key('role', v::notEmpty())->validate($params) || !v::key('permissions', v::arrayType())->validate($params)) {
      throw new UnexpectedValueException("'role' must be sent", Codes::key(Codes::ERROR_ROLE_MUST_BE_SENT));
    }
  }
}
