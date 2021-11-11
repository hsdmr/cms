<?php

namespace Hasdemir\Base;

use Hasdemir\Base\DefaultException;

class Request
{
    protected string $dir;
    protected string $base;

    public function __construct()
    {
        $this->dir = dirname($_SERVER['SCRIPT_NAME']);
        $this->base = basename($_SERVER['SCRIPT_NAME']);
    }

    public function getUri()
    {
        return str_replace([$this->dir, $this->base], [null], $_SERVER['REQUEST_URI']);
    }

    public function getPath()
    {
        return explode('?', $this->getUri())[0];
    }

    public function getMethod()
    {
        return strtoupper($_SERVER['REQUEST_METHOD']);
    }

    public function getBody()
    {
        $body = [];
        if ($this->getMethod() === 'POST' || $this->getMethod() === 'PUT') {
            $body = file_get_contents('php://input');
        }
        return $body;
    }

    public function getParams()
    {
        $params = [];
        if ($this->getMethod() === 'GET') {
            foreach ($_GET as $key => $value) {
                $params[$key] = filter_input(INPUT_GET, $key, FILTER_SANITIZE_SPECIAL_CHARS);
            }
        }
        if ($this->getMethod() === 'POST' || $this->getMethod() === 'PUT') {
            foreach ($_POST as $key => $value) {
                $params[$key] = filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS);
            }
        }
        return $params;
    }

    public function isValid(): bool
    {
        return preg_match('@^([-a-z0-9%.=#?&//]*)$@', $this->getUri());
    }

    public function checkUri()
    {
        if (!$this->isValid()) {
            throw new DefaultException('Url does not valid', ['http_code' => 403]);
        }
    }
}
