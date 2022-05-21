<?php

namespace Hasdemir\Controller;

use Hasdemir\Controller\Codes;
use Hasdemir\Helper\Json;
use Hasdemir\Base\Controller;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Model\Category;
use Hasdemir\Exception\UnexpectedValueException;
use Respect\Validation\Validator as v;

class CategoryController extends Controller
{
  public function search($request, $args)
  {
    $this->currentJob(Codes::JOB_CATEGORY_SEARCH);
    try {
      $category = new Category();
      $this->body = $category->all();
      $this->response(HTTP_OK);
    } finally {
      $this->endJob();
    }
  }

  public function create($request, $args)
  {
    $this->currentJob(Codes::JOB_CATEGORY_CREATE);
    try {
      $_POST = Json::decode($request->body(), true);
      $this->validate($_POST);
      $category = new Category();
      $this->body = $category->create([
        'slug_id' => $_POST['slug_id'],
        'file_id' => $_POST['file_id'] ?? null,
        'parent_id' => $_POST['parent_id'] ?? null,
        'owner' => $_POST['owner'],
        'title' => $_POST['title'] ?? 'Category-' . uniqid(),
        'content' => $_POST['content'] ?? '',
      ])->toArray();
      $this->response(HTTP_CREATED);
    } finally {
      $this->endJob();
    }
  }

  public function read($request, $args)
  {
    $this->currentJob(Codes::JOB_CATEGORY_READ);
    try {
      try {
        $category_id = $args['category_id'];

        $this->body = Category::find($category_id)->toArray();
        $this->response(HTTP_OK);
      } catch (\Throwable $th) {
        throw new NotFoundException('Category not found', Codes::key(Codes::ERROR_CATEGORY_NOT_FOUND), $th);
      }
    } finally {
      $this->endJob();
    }
  }

  public function update($request, $args)
  {
    $this->currentJob(Codes::JOB_CATEGORY_UPDATE);
    try {
      $_PUT = Json::decode($request->body(), true);
      $category_id = $args['category_id'];

      $this->validate($_PUT);

      $category = Category::find($category_id);
      $this->body = $category->update([
        'slug_id' => $_PUT['slug_id'],
        'file_id' => $_PUT['file_id'] ?? null,
        'parent_id' => $_PUT['parent_id'] ?? null,
        'owner' => $_PUT['owner'],
        'title' => $_PUT['title'] ?? 'Category-' . uniqid(),
        'content' => $_PUT['content'] ?? '',
      ])->toArray();
      $this->response(HTTP_OK);
    } finally {
      $this->endJob();
    }
  }

  public function delete($request, $args)
  {
    $this->currentJob(Codes::JOB_CATEGORY_DELETE);
    try {
      $category_id = $args['category_id'];

      if (Category::find($category_id)->delete()) {
        $this->response(HTTP_NO_CONTENT);
      }
    } finally {
      $this->endJob();
    }
  }

  public function validate($params)
  {
    if (!v::key('slug_id', v::positive())->validate($params)) {
      throw new UnexpectedValueException("'slug_id' must be positive number", Codes::key(Codes::ERROR_SLUG_ID_MUST_BE_POSITIVE_NUMBER));
    }
    if (!v::key('owner', v::in(Category::OWNER))->validate($params)) {
      throw new UnexpectedValueException("'owner' must be " . implode(', ', Category::OWNER), Codes::key(Codes::ERROR_OWNER_NOT_ALLOWED));
    }
    if (!v::key('file_id', v::anyOf(v::nullType(), v::positive()), false)->validate($params)) {
      throw new UnexpectedValueException("'file_id' must be positive number", Codes::key(Codes::ERROR_FILE_ID_MUST_BE_POSITIVE_NUMBER));
    }
    if (!v::key('parent_id', v::anyOf(v::nullType(), v::positive()), false)->validate($params)) {
      throw new UnexpectedValueException("'parent_id' must be positive number", Codes::key(Codes::ERROR_PARENT_ID_MUST_BE_POSITIVE_NUMBER));
    }
  }
}
