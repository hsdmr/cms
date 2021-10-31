<?php

namespace Hasdemir\Rest;

use Hasdemir\Base\Rest;

class CategoryApi extends Rest
{

    public function search($request, $args)
    {
        echo 'Category search';
    }

    public function create($request, $args)
    {
        echo 'Category create';
    }

    public function read($request, $args)
    {
        echo 'Category read ' . $args[0];
    }

    public function update($request, $args)
    {
        echo 'Category update ' . $args[0];
    }

    public function delete($request, $args)
    {
        echo 'Category delete ' . $args[0];
    }
}
