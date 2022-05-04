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
        $users->where('name', 'LIKE', "%" . $params['search'] . "%");
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
        'name' => $_POST['name'],
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
        'name' => $_POST['name'],
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

  public function constants(Request $request, $args)
  {
    Log::currentJob(Codes::JOB_LAYOUT_CONSTANTS);
    try {
      
      $this->body = [
        'which' => Layout::WHICH,
        'status' => Layout::STATUS,
      ];
      $this->response(HTTP_OK);
    }
    finally {
      Log::endJob();
    }
  }

  public function validate($params, $method = 'create'): void
  {
    if (!v::key('title', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'title' must not be empty", Codes::key(Codes::ERROR_TITLE_MUST_NOT_BE_EMPTY));
    }
    if (!v::key('which', v::in(Layout::WHICH))->validate($params)) {
      throw new UnexpectedValueException("'which' must be " . implode(', ', Layout::WHICH), Codes::key(Codes::ERROR_WHICH_NOT_ALLOWED));
    }
    if (!v::key('status', v::in(Layout::STATUS))->validate($params)) {
      throw new UnexpectedValueException("'status' must be " . implode(', ', Layout::STATUS), Codes::key(Codes::ERROR_STATUS_NOT_ALLOWED));
    }
  }
}
