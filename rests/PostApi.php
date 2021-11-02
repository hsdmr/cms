<?php

namespace Hasdemir\Rest;

use Hasdemir\Base\Rest;
use Hasdemir\Base\System;
use Hasdemir\Model\Post;

class PostApi extends Rest
{

    public function search($request, $args)
    {
        $post = new Post();
        $this->body = $post->select(['title', 'content'])->where(['title' => 'Post1', 'content' => 'Content1'])->order(['title', 'asc'])->limit(10)->get();
        return $this->response(200);
    }

    public function create($request, $args)
    {
        try {
            $_POST = json_decode($request->getBody(), true);
            $this->validation($_POST);
            $post = new Post();
            $this->body = $post->create($_POST);
            return $this->response(200);
        } finally {
            return '';
        }
    }

    public function read($request, $args)
    {
        $post = new Post();
        $this->body = $post->find($args[0]);
        return $this->response(200);
    }

    public function update($request, $args)
    {
        try {
            $_PUT = json_decode($request->getBody(), true);
            $post = new Post();
            $post->find($args[0]);
            $this->body = $post->update($_PUT);
            return $this->response(200);
        } finally {
        }
    }

    public function delete($args)
    {
        $post = new Post();
        $post->find($args[0]);
        $post->softDelete();
    }

    public function validation($params)
    {

    }
}
