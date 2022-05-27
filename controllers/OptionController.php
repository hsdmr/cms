<?php

namespace Hasdemir\Controller;

use Hasdemir\Controller\Codes;
use Hasdemir\Helper\Json;
use Hasdemir\Base\Controller;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\Option;
use Respect\Validation\Validator as v;

class OptionController extends Controller
{
  public function search($request, $args)
  {
    $this->currentJob(Codes::JOB_OPTION_SEARCH);
    try {
      $params = $request->params();

      if (!v::key('get', v::in(['one', 'many']))->validate($params)) {
        throw new UnexpectedValueException("'get' must be 'one' or 'many'", Codes::key(Codes::ERROR_GET_NOT_ALLOWED));
      }

      $this->validate($params);

      if ($params['get'] == 'one') {
        $response = Option::findOption($params['type'], $params['type_id'] ?? null, $params['key']);

        if (!$response) {
          throw new NotFoundException('Option not found!', Codes::key(Codes::ERROR_OPTION_NOT_FOUND));
        }
      }
      else {
        $response = Option::findOptions($params['type'], $params['type_id'] ?? null);

        if (!$response) {
          throw new NotFoundException('Options not found!', Codes::key(Codes::ERROR_OPTIONS_NOT_FOUND));
        }
      }

      $this->body = $response->toArray();
      $this->response(HTTP_OK);
    }
    finally {
      $this->endJob();
    }
  }

  public function create($request, $args)
  {
    $this->currentJob(Codes::JOB_OPTION_CREATE);
    try {
      $_POST = Json::decode($request->body(), true);
      $this->validate($_POST);

      Option::saveOption($_POST['type'], $_POST['type_id'], $_POST['key'], $_POST['value']);

      $this->response(HTTP_CREATED);
    }
    finally {
      $this->endJob();
    }
  }

  public function delete($request, $args)
  {
    $this->currentJob(Codes::JOB_OPTION_DELETE);
    try {
      if (Option::find($args['option_id'])->delete()) {
        $this->response(HTTP_NO_CONTENT);
      }
      
      throw new NotFoundException('Options not found!', Codes::key(Codes::ERROR_OPTIONS_NOT_FOUND));
    }
    finally {
      $this->endJob();
    }
  }

  public function validate($params): void
  {
    if (!v::key('type', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'type' must be string", Codes::key(Codes::ERROR_TYPE_MUST_NOT_BE_EMPTY));
    }
  }
}
