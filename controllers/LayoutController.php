<?php

namespace Hasdemir\Controller;

use Hasdemir\Controller\Codes;
use Hasdemir\Base\Log;
use Hasdemir\Base\Controller;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\Layout;
use Respect\Validation\Validator as v;
use Hasdemir\Base\Request;
use Hasdemir\Model\Option;

class LayoutController extends Controller
{
  public function search(Request $request, $args)
  {
    Log::currentJob(Codes::JOB_LAYOUT_SEARCH);
    try {
      $params = getSearchParamsWithDefaults($request->params());

      $total = new Layout();
      $this->header['Total-Row'] = $total->select('COUNT(*) as total')->first()['total'];

      $users = new Layout();
      if ($params['search']) {
        $users->openPharanthesis()
          ->where('first_name', 'LIKE', "%" . $params['search'] . "%")
          ->orWhere('last_name', 'LIKE', "%" . $params['search'] . "%")
          ->orWhere('email', 'LIKE', "%" . $params['search'] . "%")
          ->orWhere('username', 'LIKE', "%" . $params['search'] . "%")
          ->orWhere('nickname', 'LIKE', "%" . $params['search'] . "%")
          ->orWhere('phone', 'LIKE', "%" . $params['search'] . "%")
          ->closePharanthesis();
      }
      if ($params['trash']) {
        $users->onlyDeleted();
      }
      $response = $users->order($params['order'], $params['by'])
        ->limit($params['limit'], $params['limit'] * ($params['page'] - 1))
        ->get();

      $this->body = $response;
      $this->response(HTTP_OK);
    }
    finally {
      Log::endJob();
    }
  }

  public function create(Request $request, $args)
  {
    Log::currentJob(Codes::JOB_LAYOUT_CREATE);
    try {
      $_POST = json_decode($request->body(), true);

      $this->validate($_POST);

      if (v::key('status', v::equals('active'))->validate($_POST)) {
        $layout = new Layout();
        $layout = $layout->where('which', $_POST['which'])->where('status', 'active')->first();
        if ($layout) {
          $layout->update([
            'status' => 'passive'
          ]);
        }
      }

      $layout = new Layout();
      $layout = $layout->create([
        'title' => $_POST['title'],
        'top' => $_POST['top'],
        'content' => $_POST['content'],
        'bottom' => $_POST['bottom'],
        'status' => $_POST['status'],
        'which' => $_POST['which'],
        'language_id' => $_POST['language_id'] ?? 1
      ])->toArray();

      $response = $layout;

      $this->body = $response;
      $this->response(HTTP_CREATED);
    }
    finally {
      Log::endJob();
    }
  }

  public function read(Request $request, $args)
  {
    Log::currentJob(Codes::JOB_LAYOUT_READ);
    try {
      try {
        $layout = Layout::find($args['layout_id']);

        $response = $layout->toArray();
        
        $this->body = $response;
        $this->response(HTTP_OK);
      }
      catch (\Throwable $th) {
        throw new NotFoundException('Layout not found', Codes::key(Codes::ERROR_LAYOUT_NOT_FOUND), $th);
      }
    }
    finally {
      Log::endJob();
    }
  }

  public function update(Request $request, $args)
  {
    Log::currentJob(Codes::JOB_LAYOUT_UPDATE);
    try {
      $_PUT = json_decode($request->body(), true);

      $this->validate($_PUT, 'update');

      if (v::key('status', v::equals('active'))->validate($_POST)) {
        $layout = new Layout();
        $layout = $layout->where('which', $_POST['which'])->where('status', 'active')->first();
        if ($layout) {
          $layout->update([
            'status' => 'passive'
          ]);
        }
      }

      $layout = Layout::find($args['layout_id']);
      $update = [
        'title' => $_POST['title'],
        'top' => $_POST['top'],
        'content' => $_POST['content'],
        'bottom' => $_POST['bottom'],
        'status' => $_POST['status'],
        'which' => $_POST['which'],
        'language_id' => $_POST['language_id'] ?? 1
      ];

      $layout = $layout->update($update)->toArray();

      $response = $layout;

      $this->body = $response;
      $this->response(HTTP_OK);
    }
    finally {
      Log::endJob();
    }
  }

  public function delete(Request $request, $args)
  {
    Log::currentJob(Codes::JOB_LAYOUT_DELETE);
    try {
      $user = Layout::find($args['layout_id']);

      if ($user->delete()) {
        $this->response(HTTP_NO_CONTENT);
      }
    }
    finally {
      Log::endJob();
    }
  }

  public function validate($params, $method = 'create'): void
  {
    if (!v::key('title', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'title' must be string", Codes::key(Codes::ERROR_TITLE_MUST_BE_STRING));
    }
    if (!v::key('top', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'top' must be string", Codes::key(Codes::ERROR_TOP_MUST_BE_STRING));
    }
    if (!v::key('content', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'content' must be string", Codes::key(Codes::ERROR_CONTENT_MUST_BE_STRING));
    }
    if (!v::key('bottom', v::email())->validate($params)) {
      throw new UnexpectedValueException("'bottom' must be string", Codes::key(Codes::ERROR_BOTTOM_MUST_BE_STRING));
    }
    if (!v::key('which', v::in(Layout::WHICH))->validate($params)) {
      throw new UnexpectedValueException("'which' must be 'admin' or 'user'", Codes::key(Codes::ERROR_WHICH_NOT_ALLOWED));
    }
    if (!v::key('status', v::in(Layout::STATUS))->validate($params)) {
      throw new UnexpectedValueException("'which' must be 'admin' or 'user'", Codes::key(Codes::ERROR_STATUS_NOT_ALLOWED));
    }
    if (!v::key('language_id', v::intType(), false)->validate($params)) {
      throw new UnexpectedValueException("'language_id' must be sent", Codes::key(Codes::ERROR_LANGUAGE_ID_MUST_BE_INTEGER));
    }
  }
}
