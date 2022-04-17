<?php

namespace Hasdemir\Controller;

use Hasdemir\Controller\Codes;
use Hasdemir\Base\Log;
use Hasdemir\Base\Controller;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\AutoLink;
use Respect\Validation\Validator as v;

class AutoLinkController extends Controller
{
  public function search($request, $args)
  {
    Log::currentJob(Codes::JOB_AUTO_LINK_SEARCH);
    try {
      $links = new AutoLink();
      $this->body = $links->all();
      $this->response(HTTP_OK);
    } finally {
      Log::endJob();
    }
  }

  public function create($request, $args)
  {
    Log::currentJob(Codes::JOB_AUTO_LINK_CREATE);
    try {
      $_POST = json_decode($request->body(), true);
      $this->validate($_POST);
      $link = new AutoLink();
      $this->body = $link->create([
        'word' => $_POST['word'],
        'uri' => $_POST['uri']
      ])->toArray();
      $this->response(HTTP_CREATED);
    } finally {
      Log::endJob();
    }
  }

  public function read($request, $args)
  {
    Log::currentJob(Codes::JOB_AUTO_LINK_READ);
    try {
      try {
        $link_id = $args['link_id'];

        $this->body = AutoLink::find($link_id)->toArray();
        $this->response(HTTP_OK);
      } catch (\Throwable $th) {
        throw new NotFoundException('Auto link not found', Codes::key(Codes::ERROR_AUTO_LINK_NOT_FOUND), $th);
      }
    } finally {
      Log::endJob();
    }
  }

  public function update($request, $args)
  {
    Log::currentJob(Codes::JOB_AUTO_LINK_UPDATE);
    try {
      $_PUT = json_decode($request->body(), true);
      $link_id = $args['link_id'];

      $this->validate($_PUT);

      $link = AutoLink::find($link_id);
      $this->body = (array) $link->update([
        'word' => $_PUT['word'],
        'uri' => $_PUT['uri']
      ])->toArray();
      $this->response(HTTP_OK);
    } finally {
      Log::endJob();
    }
  }

  public function delete($request, $args)
  {
    Log::currentJob(Codes::JOB_AUTO_LINK_DELETE);
    try {
      $link_id = $args['link_id'];

      if (AutoLink::find($link_id)->delete()) {
        $this->response(HTTP_NO_CONTENT);
      }
    } finally {
      Log::endJob();
    }
  }

  public function validate($params): void
  {
    if (!v::key('word', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'word' must be string", Codes::key(Codes::ERROR_WORD_MUST_BE_STRING));
    }
    if (!v::key('uri', v::stringType(), false)->validate($params)) {
      throw new UnexpectedValueException("'uri' must be string", Codes::key(Codes::ERROR_URI_MUST_BE_STRING));
    }
  }
}
