<?php

namespace Hasdemir\Rest;

use Hasdemir\Base\Log;
use Hasdemir\Exception\StoragePdoException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\AutoLink;
use Respect\Validation\Validator as v;

class AutoLinkApi extends BaseApi
{
    const HELPER_LINK = ['link' => 'auto-link'];
    
    public function search($request, $args)
    {
        Log::currentJob('user-search');
        try {
            $links = new AutoLink();
            $this->body = $links->all();
            $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function create($request, $args)
    {
        Log::currentJob('user-create');
        try {
            $_POST = json_decode($request->body(), true);
            $this->validate($_POST);
            $link = new AutoLink();
            $this->body = $link->create([
                'word' => $_POST['word'],
                'url' => $_POST['url']
            ])->toArray();
            $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function read($request, $args)
    {
        Log::currentJob('user-read');
        try {
            try {
                $link_id = $args[0];

                $this->body = AutoLink::findById($link_id)->toArray();
                $this->response(200);
            } catch (\Throwable $th) {
                throw new StoragePdoException('Auto link not found', self::HELPER_LINK, $th);
            }
        } finally {
            Log::endJob();
        }
    }

    public function update($request, $args)
    {
        Log::currentJob('user-update');
        try {
            $_PUT = json_decode($request->body(), true);
            $link_id = $args[0];

            $this->validate($_PUT);
            
            $link = AutoLink::findById($link_id);
            $this->body = (array) $link->update([
                'word' => $_POST['word'],
                'url' => $_POST['url']
            ])->toArray();
            $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function delete($request, $args)
    {
        Log::currentJob('user-delete');
        try {
            $link_id = $args[0];

            if (AutoLink::findById($link_id)->delete()) {
                $this->response(200);
            }
        } finally {
            Log::endJob();
        }
    }

    public function validate($params): void
    {
        if (!v::key('word', v::stringType())->validate($params)) {
            throw new UnexpectedValueException("'word' must be string", self::HELPER_LINK);
        }

        if (!v::key('url', v::stringType(), false)->validate($params)) {
            throw new UnexpectedValueException("'url' must be string", self::HELPER_LINK);
        }
    }
}
