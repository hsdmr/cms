<?php

namespace Hasdemir\Controller;

use Hasdemir\Controller\Codes;
use Hasdemir\Base\Log;
use Hasdemir\Base\Controller;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\Slug;
use Respect\Validation\Validator as v;

class SlugController extends Controller
{
  const HELPER_LINK = ['link' => 'slug'];

  public function search($request, $args)
  {
    Log::currentJob(Codes::JOB_SLUG_SEARCH);
    try {
      $slug = new Slug();
      $this->body = $slug->all();
      return $this->response(HTTP_OK);
    } finally {
      Log::endJob();
    }
  }

  public function create($request, $args)
  {
    Log::currentJob(Codes::JOB_SLUG_CREATE);
    try {
      $_POST = json_decode($request->body(), true);

      $this->validate($_POST);

      $slug = new Slug();
      $this->body = $slug->create([
        'owner' => $_POST['owner'],
        'path' => $_POST['path'],
        'seo_title' => $_POST['seo_title'] ?? null,
        'seo_description' => $_POST['seo_description'] ?? null,
        'seo_index' => $_POST['seo_index'] ?? 1,
        'seo_follow' => $_POST['seo_follow'] ?? 1,
        'language_id' => $_POST['language_id'] ?? 1,
      ])->toArray();
      return $this->response(HTTP_CREATED);
    } finally {
      Log::endJob();
    }
  }

  public function read($request, $args)
  {
    Log::currentJob(Codes::JOB_SLUG_READ);
    try {
      try {
        $slug_id = $args['slug_id'];

        $this->body = Slug::find($slug_id)->toArray();
        return $this->response(HTTP_OK);
      } catch (\Throwable $th) {
        throw new NotFoundException('Link not found', self::HELPER_LINK, $th);
      }
    } finally {
      Log::endJob();
    }
  }

  public function update($request, $args)
  {
    Log::currentJob(Codes::JOB_SLUG_UPDATE);
    try {
      $_PUT = json_decode($request->body(), true);
      $slug_id = $args['slug_id'];

      $this->validate($_PUT);

      $slug = Slug::find($slug_id);
      $this->body = $slug->update([
        'owner' => $_PUT['owner'],
        'path' => $_PUT['path'],
        'seo_title' => $_PUT['seo_title'] ?? null,
        'seo_description' => $_PUT['seo_description'] ?? null,
        'seo_index' => $_PUT['seo_index'] ?? 1,
        'seo_follow' => $_PUT['seo_follow'] ?? 1,
        'language_id' => $_PUT['language_id'] ?? 1,
      ])->toArray();
      return $this->response(HTTP_OK);
    } finally {
      Log::endJob();
    }
  }

  public function delete($request, $args)
  {
    Log::currentJob(Codes::JOB_SLUG_DELETE);
    try {
      $slug_id = $args['slug_id'];

      if (Slug::find($slug_id)->delete()) {
        $this->response(HTTP_NO_CONTENT);
      }
    } finally {
      Log::endJob();
    }
  }

  public function validate($params)
  {
    if (!v::key('owner', v::in(['post', 'page', 'product', 'lesson']))->validate($params)) {
      throw new UnexpectedValueException("'owner' must be 'post', 'page', 'product', 'lesson'", self::HELPER_LINK);
    }
    if (!v::key('path', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'path' must be string", self::HELPER_LINK);
    }
    if (!v::key('language_id', v::positive())->validate($params)) {
      throw new UnexpectedValueException("'language_id' must be positive number", self::HELPER_LINK);
    }
  }
}
