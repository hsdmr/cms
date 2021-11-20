<?php

namespace Hasdemir\Rest;

use Hasdemir\Base\Log;
use Hasdemir\Exception\StoragePdoException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\Post;
use Respect\Validation\Validator as v;

class PostApi extends BaseApi
{
    const HELPER_LINK = ['link' => 'post'];

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
            $_POST = json_decode($request->body(), true);
            $this->validate($_POST);
            $post = new Post();
            $this->body = $post->create([
                'permalink_id' => $_POST['permalink_id'],
                'user_id' => $_POST['user_id'] ?? 1,
                'file_id' => $_POST['file_id'] ?? null,
                'status' => $_POST['status'] ?? 'published',
                'title' => $_POST['title'] ?? 'Post_'. uniqid(),
                'content' => $_POST['content'] ?? '',
            ])->toArray();
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
                $post = Post::findById($args[0]);
                $response = $post->toArray();
                $response['categories'] = $post->categories();
                $response['permalink'] = $post->permalink();
                $this->body = $response;
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
            $_PUT = json_decode($request->body(), true);
            $this->validate($_PUT);
            $post = Post::findById($args[0]);
            $this->body = $post->update([
                'permalink_id' => $_PUT['permalink_id'],
                'user_id' => $_PUT['user_id'] ?? 1,
                'file_id' => $_PUT['file_id'] ?? null,
                'status' => $_PUT['status'] ?? 'published',
                'title' => $_PUT['title'] ?? 'Post_'. uniqid(),
                'content' => $_PUT['content'] ?? '',
            ])->toArray();
            return $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function delete($request, $args)
    {
        Log::currentJob('post-update');
        try {
            if (Post::findById($args[0])->delete()) {
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
