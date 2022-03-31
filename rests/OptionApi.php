<?php

namespace Hasdemir\Rest;

use Hasdemir\Rest\Codes;
use Hasdemir\Base\Log;
use Hasdemir\Base\Rest;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\Option;
use Respect\Validation\Validator as v;

class OptionApi extends Rest
{
  const HELPER_LINK = ['link' => 'option'];

  public function search($request, $args)
  {
    Log::currentJob(Codes::JOB_OPTION_SEARCH);
    try {
      $options = new Option();
      $this->body = $options->findOptions();
      $this->response(HTTP_OK);
    } finally {
      Log::endJob();
    }
  }

  public function create($request, $args)
  {
    Log::currentJob(Codes::JOB_OPTION_CREATE);
    try {
      $_POST = json_decode($request->body(), true);
      $this->validate($_POST);
      $option = new Option();
      $this->body = $option->create([
        'user_id' => null,
        'key' => $_POST['key'],
        'value' => json_encode($_POST['value']),
      ])->toArray();
      $this->response(HTTP_CREATED);
    } finally {
      Log::endJob();
    }
  }

  public function read($request, $args)
  {
    Log::currentJob(Codes::JOB_OPTION_READ);
    try {
      try {
        $option_id = $args['option_id'];

        $this->body = Option::findById($option_id)->toArray();
        $this->response(HTTP_OK);
      } catch (\Throwable $th) {
        throw new NotFoundException('Option not found', self::HELPER_LINK, $th);
      }
    } finally {
      Log::endJob();
    }
  }

  public function update($request, $args)
  {
    Log::currentJob(Codes::JOB_OPTION_UPDATE);
    try {
      $_PUT = json_decode($request->body(), true);
      $option_id = $args['option_id'];

      $this->validate($_PUT);

      $option = Option::findById($option_id);
      $this->body = (array) $option->update([
        'user_id' => null,
        'key' => $_POST['key'],
        'value' => json_encode($_POST['value']),
      ])->toArray();
      $this->response(HTTP_OK);
    } finally {
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
    } finally {
      Log::endJob();
    }
  }

  public function userSearch($request, $args)
  {
    Log::currentJob('option-search');
    try {
      $user_id = $args['user_id'];
      $this->body = Option::findOptions($user_id);
      $this->response(HTTP_OK);
    } finally {
      Log::endJob();
    }
  }

  public function userCreate($request, $args)
  {
    Log::currentJob('option-create');
    try {
      $_POST = json_decode($request->body(), true);
      $user_id = $args['user_id'];

      $this->validate($_POST);

      $option = new Option();
      $this->body = $option->create([
        'user_id' => $user_id,
        'key' => $_POST['key'],
        'value' => json_encode($_POST['value']),
      ])->toArray();
      $this->response(HTTP_OK);
    } finally {
      Log::endJob();
    }
  }

  public function validate($params): void
  {
    if (!v::key('user_id', v::positive(), false)->validate($params)) {
      throw new UnexpectedValueException("'user_id' must be string", self::HELPER_LINK);
    }
    if (!v::key('key', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'key' must be string", self::HELPER_LINK);
    }
  }
}
