<?php

namespace Hasdemir\Controller;

use Hasdemir\Controller\Codes;
use Hasdemir\Helper\Json;
use Hasdemir\Base\Controller;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\AutoLink;
use Respect\Validation\Validator as v;

class AutoLinkController extends Controller
{
  public function search($request, $args)
  {
    $this->currentJob(Codes::JOB_AUTO_LINK_SEARCH);
    try {
      $params = getSearchParamsWithDefaults($request->params());

      $total = new AutoLink();
      $this->header['Total-Row'] = $total->select('COUNT(*) as total')->first()['total'];

      $auto_link = new AutoLink();
      if ($params['search']) {
        $auto_link->openPharanthesis()
          ->where('word', 'LIKE', "%" . $params['search'] . "%")
          ->orWhere('url', 'LIKE', "%" . $params['search'] . "%")
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
    $this->currentJob(Codes::JOB_AUTO_LINK_CREATE);
    try {
      $_POST = Json::decode($request->body());

      $this->validate($_POST);
      
      $link = new AutoLink();
      $link->create([
        'word' => $_POST['word'],
        'uri' => $_POST['uri']
      ])
      ;
      $this->response(HTTP_CREATED);
    } finally {
      $this->endJob();
    }
  }

  public function read($request, $args)
  {
    $this->currentJob(Codes::JOB_AUTO_LINK_READ);
    try {
      try {
        $this->body = AutoLink::find($args['link_id'])->toArray();
        $this->response(HTTP_OK);
      } catch (\Throwable $th) {
        throw new NotFoundException('Auto link not found', Codes::key(Codes::ERROR_AUTO_LINK_NOT_FOUND), $th);
      }
    } finally {
      $this->endJob();
    }
  }

  public function update($request, $args)
  {
    $this->currentJob(Codes::JOB_AUTO_LINK_UPDATE);
    try {
      $_PUT = Json::decode($request->body());

      $this->validate($_PUT);

      $link = AutoLink::find($args['link_id']);
      $link->update([
        'word' => $_PUT['word'],
        'uri' => $_PUT['uri']
      ]);

      $this->response(HTTP_NO_CONTENT);
    } finally {
      $this->endJob();
    }
  }

  public function delete($request, $args)
  {
    $this->currentJob(Codes::JOB_AUTO_LINK_DELETE);
    try {
      
      if (!AutoLink::find($args['link_id'])->delete()) {
        throw new NotFoundException('Auto link not found', Codes::key(Codes::ERROR_AUTO_LINK_NOT_FOUND));
      }
      
      $this->response(HTTP_NO_CONTENT);
    } finally {
      $this->endJob();
    }
  }

  public function validate($params): void
  {
    if (!v::key('word', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'word' must be sent", Codes::key(Codes::ERROR_WORD_MUST_NOT_BE_EMPTY));
    }
    if (!v::key('uri', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'uri' must be sent", Codes::key(Codes::ERROR_URI_MUST_NOT_BE_EMPTY));
    }
  }
}
