<?php

namespace Hasdemir\Rest;

use Hasdemir\Base\Log;
use Hasdemir\Exception\StoragePdoException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\Post;
use Respect\Validation\Validator as v;

class PostApi extends BaseApi
{
    const HELPER_LINK = ['link' => 'user'];

    public function search($request, $args)
    {
        Log::currentJob('post-search');
        try {
            $post = new Post();
            $this->body = $post->all();
            return $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function create($request, $args)
    {
        Log::currentJob('post-create');
        try {
            $_POST = json_decode($request->getBody(), true);
            $this->validate($_POST);
            $post = new Post();
            $this->body = $post->create([
                'permalink_id' => $_POST['permalink_id'],
                'user_id' => $_POST['user_id'] ?? 1,
                'file_id' => $_POST['file_id'] ?? null,
                'status' => $_POST['status'] ?? 'published',
                'title' => $_POST['title'] ?? 'Post_'. uniqid(),
                'content' => $_POST['content'] ?? '',
            ]);
            return $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function read($request, $args)
    {
        Log::currentJob('post-read');
        try {
            try {
                $post = new Post();
                $this->body = $post->find($args[0]);
                return $this->response(200);
            } catch (\Throwable $th) {
                throw new StoragePdoException('User not found', self::HELPER_LINK, $th);
            }
        } finally {
            Log::endJob();
        }
    }

    public function update($request, $args)
    {
        Log::currentJob('post-update');
        try {
            $_PUT = json_decode($request->getBody(), true);
            $this->validate($_PUT);
            $post = new Post();
            $post->find($args[0]);
            $this->body = $post->update([
                'permalink_id' => $_PUT['permalink_id'],
                'user_id' => $_PUT['user_id'] ?? 1,
                'file_id' => $_PUT['file_id'] ?? null,
                'status' => $_PUT['status'] ?? 'published',
                'title' => $_PUT['title'] ?? 'Post_'. uniqid(),
                'content' => $_PUT['content'] ?? '',
            ]);
            return $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function delete($request, $args)
    {
        Log::currentJob('post-update');
        try {
            $post = new Post();
            $post->find($args[0]);
            if ($post->delete()) {
                $this->response(200);
            }
        } finally {
            Log::endJob();
        }
    }

    public function validate($params)
    {
        if (!v::key('permalink_id', v::positive())->validate($params)) {
            throw new UnexpectedValueException("'permalink_id' must be positive number", self::HELPER_LINK);
        }

        if (!v::key('user_id', v::positive())->validate($params)) {
            throw new UnexpectedValueException("'user_id'  must be positive number", self::HELPER_LINK);
        }
        
        if (!v::key('status', v::in(['published', 'draft']))->validate($params)) {
            throw new UnexpectedValueException("'status' only can be 'published' or 'draft'", self::HELPER_LINK);
        }
    }
}
