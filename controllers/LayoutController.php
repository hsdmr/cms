<?php

namespace Hasdemir\Controller;

use Hasdemir\Controller\Codes;
use Hasdemir\Helper\Json;
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
    $this->currentJob(Codes::JOB_LAYOUT_SEARCH);
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
    } finally {
      $this->endJob();
    }
  }

  public function create(Request $request, $args)
  {
    $this->currentJob(Codes::JOB_LAYOUT_CREATE);
    try {
      $_POST = Json::decode($request->body(), true);

      $this->validate($_POST);

      if (v::key('status', v::equals('active'))->validate($_POST)) {
        $layout = new Layout();
        $layouts = $layout->where('which', $_POST['which'])
          ->where('status', 'active')
          ->where('language_id', $_POST['language_id'])
          ->get();
        foreach ($layouts as $layout) {
          if ($layout['status']) {
            $layout->update([
              'status' => 'passive'
            ]);
          }
        }
      }

      $layout = new Layout();
      $layout->create([
        'title' => $_POST['title'],
        'top' => $_POST['top'],
        'content' => $_POST['content'],
        'bottom' => $_POST['bottom'],
        'status' => $_POST['status'],
        'which' => $_POST['which'],
        'language_id' => $_POST['language_id'] ?? 1
      ]);

      $this->response(HTTP_CREATED);
    } finally {
      $this->endJob();
    }
  }

  public function read(Request $request, $args)
  {
    $this->currentJob(Codes::JOB_LAYOUT_READ);
    try {
      try {
        $this->body = Layout::find($args['layout_id'])->toArray();
        $this->response(HTTP_OK);
      } catch (\Throwable $th) {
        throw new NotFoundException('Layout not found', Codes::key(Codes::ERROR_LAYOUT_NOT_FOUND), $th);
      }
    } finally {
      $this->endJob();
    }
  }

  public function update(Request $request, $args)
  {
    $this->currentJob(Codes::JOB_LAYOUT_UPDATE);
    try {
      $_PUT = Json::decode($request->body(), true);

      $this->validate($_PUT, 'update');

      if (v::key('status', v::equals('active'))->validate($_PUT)) {
        $layout = new Layout();
        $layouts = $layout->where('which', $_PUT['which'])
          ->where('status', 'active')
          ->where('language_id', $_PUT['language_id'])
          ->get();
        foreach ($layouts as $layout) {
          if ($layout['status']) {
            $layout->update([
              'status' => 'passive'
            ]);
          }
        }
      }

      $layout = Layout::find($args['layout_id']);
      $layout = $layout->update([
        'title' => $_PUT['title'],
        'top' => $_PUT['top'],
        'content' => $_PUT['content'],
        'bottom' => $_PUT['bottom'],
        'status' => $_PUT['status'],
        'which' => $_PUT['which'],
        'language_id' => $_PUT['language_id'] ?? primary_language_id(),
      ]);

      $this->response(HTTP_NO_CONTENT);
    } finally {
      $this->endJob();
    }
  }

  public function delete(Request $request, $args)
  {
    $this->currentJob(Codes::JOB_LAYOUT_DELETE);
    try {
      if (!Layout::find($args['layout_id'])->delete()) {
        throw new NotFoundException('Layout not found', Codes::key(Codes::ERROR_LAYOUT_NOT_FOUND));
      }
      
      $this->response(HTTP_NO_CONTENT);
    } finally {
      $this->endJob();
    }
  }

  public function constants(Request $request, $args)
  {
    $this->currentJob(Codes::JOB_LAYOUT_CONSTANTS, false);
    try {

      $this->body = [
        'which' => Layout::WHICH,
        'status' => Layout::STATUS,
      ];
      $this->response(HTTP_OK);
    } finally {
      $this->endJob();
    }
  }

  public function validate($params, $method = 'create'): void
  {
    if (!v::key('title', v::notEmpty())->validate($params)) {
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
