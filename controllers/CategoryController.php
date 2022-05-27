<?php

namespace Hasdemir\Controller;

use Hasdemir\Controller\Codes;
use Hasdemir\Helper\Json;
use Hasdemir\Base\Controller;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Model\Category;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\Slug;
use Respect\Validation\Validator as v;

class CategoryController extends Controller
{
  public function search($request, $args)
  {
    $this->currentJob(Codes::JOB_CATEGORY_SEARCH);
    try {
      $params = getSearchParamsWithDefaults($request->params());

      $total = new Category();
      $this->header['Total-Row'] = $total->select('COUNT(*) as total')->first()['total'];

      $auto_link = new Category();
      if ($params['search']) {
        $auto_link->openPharanthesis()
          ->where('title', 'LIKE', "%" . $params['search'] . "%")
          ->orWhere('content', 'LIKE', "%" . $params['search'] . "%")
          ->closePharanthesis();
      }
      if ($params['trash']) {
        $auto_link->onlyDeleted();
      }
      $response = $auto_link->order($params['order'], $params['by'])
        ->limit($params['limit'], $params['limit'] * ($params['page'] - 1))
        ->get();

      $this->body = $response;
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

      $slug = new Slug();
      $slug->create([
        'owner' => 'Category',
        'path' => slugify($_POST['path']),
        'seo_title' => $_POST['seo_title'] ?? $_POST['title'],
        'seo_description' => $_POST['seo_description'],
        'seo_index' => $_POST['seo_index'] ?? 1,
        'seo_follow' => $_POST['seo_follow'] ?? 1,
        'laguage_id' => $_POST['laguage_id'] ?? primary_language_id(),
      ]);

      $category = new Category();
      $category->create([
        'slug_id' => $slug['id'],
        'file_id' => $_POST['file_id'] ?? null,
        'parent_id' => $_POST['parent_id'] ?? null,
        'owner' => $_POST['owner'],
        'title' => $_POST['title'] ?? 'Category-' . uniqid(),
        'content' => $_POST['content'] ?? '',
      ]);

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
        $this->body = Category::find($args['category_id'])->toArray();
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

      $category->slug()->update([
        'path' => slugify($_POST['path']),
        'seo_title' => $_POST['seo_title'] ?? $_POST['title'],
        'seo_description' => $_POST['seo_description'],
        'seo_index' => $_POST['seo_index'] ?? 1,
        'seo_follow' => $_POST['seo_follow'] ?? 1,
      ]);

      $category->update([
        'file_id' => $_PUT['file_id'] ?? null,
        'parent_id' => $_PUT['parent_id'] ?? null,
        'title' => $_PUT['title'] ?? 'Category-' . uniqid(),
        'content' => $_PUT['content'] ?? '',
      ]);

      $this->response(HTTP_NO_CONTENT);
    } finally {
      $this->endJob();
    }
  }

  public function delete($request, $args)
  {
    $this->currentJob(Codes::JOB_CATEGORY_DELETE);
    try {
      if (!Category::find($args['category_id'])->delete()) {
        throw new NotFoundException('Category not found', Codes::key(Codes::ERROR_CATEGORY_NOT_FOUND));
      }
      
      $this->response(HTTP_NO_CONTENT);
    } finally {
      $this->endJob();
    }
  }

  public function validate($params)
  {
    if (!v::key('owner', v::in(Slug::OWNER))->validate($params)) {
      throw new UnexpectedValueException("'owner' must be " . implode(', ', Slug::OWNER), Codes::key(Codes::ERROR_OWNER_NOT_ALLOWED));
    }
    if (!v::key('path', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'path' must be sent", Codes::key(Codes::ERROR_PATH_MUST_NOT_BE_EMPTY));
    }
    if (!v::key('slug_id', v::positive())->validate($params)) {
      throw new UnexpectedValueException("'slug_id' must be positive number", Codes::key(Codes::ERROR_SLUG_ID_MUST_BE_POSITIVE_NUMBER));
    }
    if (!v::key('file_id', v::anyOf(v::nullType(), v::positive()), false)->validate($params)) {
      throw new UnexpectedValueException("'file_id' must be positive number", Codes::key(Codes::ERROR_FILE_ID_MUST_BE_POSITIVE_NUMBER));
    }
    if (!v::key('parent_id', v::anyOf(v::nullType(), v::positive()), false)->validate($params)) {
      throw new UnexpectedValueException("'parent_id' must be positive number", Codes::key(Codes::ERROR_PARENT_ID_MUST_BE_POSITIVE_NUMBER));
    }
  }
}
