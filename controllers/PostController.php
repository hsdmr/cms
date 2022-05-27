<?php

namespace Hasdemir\Controller;

use Hasdemir\Controller\Codes;
use Hasdemir\Helper\Json;
use Hasdemir\Base\Controller;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\Post;
use Hasdemir\Model\Slug;
use Respect\Validation\Validator as v;

class PostController extends Controller
{
  public function search($request, $args)
  {
    $this->currentJob(Codes::JOB_POST_SEARCH);
    try {
      $params = getSearchParamsWithDefaults($request->params());

      $total = new Post();
      $this->header['Total-Row'] = $total->select('COUNT(*) as total')->first()['total'];

      $posts = new Post();
      if ($params['search']) {
        $posts->openPharanthesis()
          ->where('title', 'LIKE', "%" . $params['search'] . "%")
          ->orWhere('content', 'LIKE', "%" . $params['search'] . "%")
          ->closePharanthesis();
      }
      if ($params['trash']) {
        $posts->onlyDeleted();
      }
      $response = $posts->order($params['order'], $params['by'])
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
    $this->currentJob(Codes::JOB_POST_CREATE);
    try {
      $_POST = Json::decode($request->body(), true);

      $this->validate($_POST);

      $slug = new Slug();
      $slug->create([
        'owner' => 'Post',
        'path' => slugify($_POST['path']),
        'seo_title' => $_POST['seo_title'] ?? $_POST['title'],
        'seo_description' => $_POST['seo_description'],
        'seo_index' => $_POST['seo_index'] ?? 1,
        'seo_follow' => $_POST['seo_follow'] ?? 1,
        'laguage_id' => $_POST['laguage_id'] ?? primary_language_id(),
      ]);

      $post = new Post();
      $post->create([
        'slug_id' => $slug['id'],
        'user_id' => $_POST['user_id'] ?? 1,
        'file_id' => $_POST['file_id'] ?? null,
        'status' => $_POST['status'] ?? Post::STATUS[0],
        'title' => $_POST['title'] ?? 'Post_' . uniqid(),
        'content' => $_POST['content'],
      ]);

      return $this->response(HTTP_CREATED);
    } finally {
      $this->endJob();
    }
  }

  public function read($request, $args)
  {
    $this->currentJob(Codes::JOB_POST_READ);
    try {
      try {
        $post_id = $args['post_id'];

        $post = Post::find($post_id);
        $response = $post->toArray();
        $response['categories'] = $post->categories();
        $response['slug'] = $post->slug();

        $this->body = $response;
        return $this->response(HTTP_OK);
      } catch (\Throwable $th) {
        throw new NotFoundException('Post not found', Codes::key(Codes::ERROR_POST_NOT_FOUND), $th);
      }
    } finally {
      $this->endJob();
    }
  }

  public function update($request, $args)
  {
    $this->currentJob(Codes::JOB_POST_UPDATE);
    try {
      $_PUT = Json::decode($request->body());

      $this->validate($_PUT);

      $post = Post::find($args['post_id']);

      $post->slug()->update([
        'path' => slugify($_PUT['path']),
        'seo_title' => $_PUT['seo_title'] ?? $_PUT['title'],
        'seo_description' => $_PUT['seo_description'],
        'seo_index' => $_PUT['seo_index'] ?? 1,
        'seo_follow' => $_PUT['seo_follow'] ?? 1,
        'laguage_id' => $_PUT['laguage_id'] ?? primary_language_id(),
      ]);

      $post->update([
        'file_id' => $_PUT['file_id'] ?? null,
        'status' => $_PUT['status'] ?? 'published',
        'title' => $_PUT['title'] ?? 'Post_' . uniqid(),
        'content' => $_PUT['content'] ?? '',
      ]);

      return $this->response(HTTP_NO_CONTENT);
    } finally {
      $this->endJob();
    }
  }

  public function delete($request, $args)
  {
    $this->currentJob(Codes::JOB_POST_DELETE);
    try {

      if (!Post::find($args['post_id'])->delete()) {
        throw new NotFoundException('Post not found!', Codes::key(Codes::ERROR_POST_NOT_FOUND));
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
    if (!v::key('language_id', v::positive())->validate($params)) {
      throw new UnexpectedValueException("'language_id' must be positive number", Codes::key(Codes::ERROR_LANGUAGE_ID_MUST_BE_POSITIVE_NUMBER));
    }
    if (!v::key('status', v::in(Post::STATUS))->validate($params)) {
      throw new UnexpectedValueException("'status' only can be " . implode(', ', Post::STATUS), Codes::key(Codes::ERROR_STATUS_NOT_ALLOWED));
    }
    if (!v::key('status', v::in(Post::TYPE))->validate($params)) {
      throw new UnexpectedValueException("'type' only can be " . implode(', ', Post::TYPE), Codes::key(Codes::ERROR_TYPE_NOT_ALLOWED));
    }
  }
}
