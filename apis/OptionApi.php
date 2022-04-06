<?php

namespace Hasdemir\Rest;

use Hasdemir\Rest\Codes;
use Hasdemir\Base\Log;
use Hasdemir\Base\Rest;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\Option;
use Respect\Validation\Validator as v;
use Hasdemir\Model\Permalink;

class OptionApi extends Rest
{
  const HELPER_LINK = ['link' => 'option'];

  public function search($request, $args)
  {
    Log::currentJob(Codes::JOB_OPTION_SEARCH);
    try {
      $params = $request->params();

      if (!v::key('get', v::in(['one', 'many']))->validate($params)) {
        throw new UnexpectedValueException("'get' must be 'one' or 'many'", self::HELPER_LINK);
      }

      $this->validate($params);

      if ($params['get'] == 'one') {
        $response = Option::findOption($params['type'], $params['type_id'] ?? null, $params['key']);

        if (!$response) {
          throw new NotFoundException('Option not found!');
        }
      }
      else {
        $response = Option::findOptions($params['type'], $params['type_id'] ?? null);

        if (!$response) {
          throw new NotFoundException('Options not found!');
        }
      }

      $this->body = $response;
      $this->response(HTTP_OK);
    }
    finally {
      Log::endJob();
    }
  }

  public function create($request, $args)
  {
    Log::currentJob(Codes::JOB_OPTION_CREATE);
    try {
      $_POST = json_decode($request->body(), true);
      $this->validate($_POST);

      $response = Option::createOption($_POST['type'], $_POST['type_id'], $_POST['key'], $_POST['value']);

      $this->body = $response;
      $this->response(HTTP_CREATED);
    }
    finally {
      Log::endJob();
    }
  }

  public function delete($request, $args)
  {
    Log::currentJob(Codes::JOB_OPTION_DELETE);
    try {
      $option_id = $args['option_id'];

      if (Option::findById($option_id)->delete()) {
        $this->response(HTTP_NO_CONTENT);
      }
    }
    finally {
      Log::endJob();
    }
  }

  public function validate($params): void
  {
    if (!v::key('type', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'key' must be string", self::HELPER_LINK);
    }

    if (!v::key('type_id', v::intType(), false)->validate($params)) {
      throw new UnexpectedValueException("'type_id' must be integer", self::HELPER_LINK);
    }

    if (!v::key('key', v::stringType(), false)->validate($params)) {
      throw new UnexpectedValueException("'key' must be string", self::HELPER_LINK);
    }
  }
}
