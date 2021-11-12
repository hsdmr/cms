<?php

namespace Hasdemir\Rest;

use Hasdemir\Base\Log;
use Hasdemir\Exception\StoragePdoException;
use Hasdemir\Model\Category;
use Hasdemir\Exception\UnexpectedValueException;
use Respect\Validation\Validator as v;

class CategoryApi extends BaseApi
{
    const HELPER_LINK = ['link' => 'category'];

    public function search($request, $args)
    {
        Log::currentJob('category-search');
        try {
            $category = new Category();
            $this->body = $category->all();
            $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function create($request, $args)
    {
        Log::currentJob('category-create');
        try {
            $_POST = json_decode($request->getBody(), true);
            $this->validate($_POST);
            $category = new Category();
            $this->body = $category->create([
                'permalink_id' => $_POST['permalin_id'],
                'file_id' => $_POST['file_id'] ?? null,
                'parent_id' => $_POST['parent_id'] ?? null,
                'type' => $_POST['type'],
                'title' => $_POST['title'] ?? 'Category-' . uniqid(),
                'content' => $_POST['content'] ?? '',
            ]);
            $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function read($request, $args)
    {
        Log::currentJob('category-read');
        try {
            try {
                $category = new Category();
                $this->body = $category->find($args[0]);
                $this->response(200);
            } catch (\Throwable $th) {
                throw new StoragePdoException('User not found', self::HELPER_LINK, $th);
            }
        } finally {
            Log::endJob();
        }
    }

    public function update($request, $args)
    {
        Log::currentJob('category-update');
        try {
            $_PUT = json_decode($request->getBody(), true);
            $this->validate($_PUT);
            $category = new Category();
            $category->find($args[0]);
            $this->body = $category->update([
                'permalink_id' => $_PUT['permalin_id'],
                'file_id' => $_PUT['file_id'] ?? null,
                'parent_id' => $_PUT['parent_id'] ?? null,
                'type' => $_PUT['type'],
                'title' => $_PUT['title'] ?? 'Category-' . uniqid(),
                'content' => $_PUT['content'] ?? '',
            ]);
            $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function delete($request, $args)
    {
        Log::currentJob('category-delete');
        try {
            $category = new Category();
            $category->find($args[0]);
            if ($category->delete()) {
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

        if (!v::key('type', v::positive())->validate($params)) {
            throw new UnexpectedValueException("'user_id'  must be positive number", self::HELPER_LINK);
        }
        
        if (!v::key('type', v::in(['post', 'product', 'tutor']))->validate($params)) {
            throw new UnexpectedValueException("'status' only can be 'published' or 'draft'", self::HELPER_LINK);
        }
    }
}
