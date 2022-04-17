<?php

namespace Hasdemir\Base;

class Request
{
  protected string $dir;
  protected string $base;

  public function __construct()
  {
    $this->dir = dirname($_SERVER['SCRIPT_NAME']);
    $this->base = basename($_SERVER['SCRIPT_NAME']);
    Log::request($this->uri(), $this->method());
  }

  public function uri()
  {
    return str_replace([$this->dir, $this->base], [null], $_SERVER['REQUEST_URI']);
  }

  public function path()
  {
    return explode('?', $this->uri())[0];
  }

  public function method()
  {
    return strtoupper($_SERVER['REQUEST_METHOD']);
  }

  public function body()
  {
    $body = [];
    if ($this->method() === 'POST' || $this->method() === 'PUT') {
      $body = file_get_contents('php://input');
    }
    return $body;
  }

  public function params()
  {
    $params = [];
    if ($this->method() === 'GET') {
      foreach ($_GET as $key => $value) {
        if (is_numeric($value)) {
          $params[$key] = (int) filter_input(INPUT_GET, $key, FILTER_SANITIZE_SPECIAL_CHARS);
        } else if ($value === 'true') {
          $params[$key] = true;
        } else if ($value === 'false') {
          $params[$key] = false;
        } else {
          $params[$key] = (string) filter_input(INPUT_GET, $key, FILTER_SANITIZE_SPECIAL_CHARS);
        }
      }
    }
    if ($this->method() === 'POST' || $this->method() === 'PUT') {
      foreach ($_POST as $key => $value) {
        if (is_numeric($value)) {
          $params[$key] = (int) filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS);
        } else if ($value === 'true') {
          $params[$key] = true;
        } else if ($value === 'false') {
          $params[$key] = false;
        } else {
          $params[$key] = (string) filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS);
        }
      }
    }
    return $params;
  }

  public function isValid(): bool
  {
    return preg_match('@^([-a-z0-9%.=_#?&//]*)$@', $this->uri());
  }
}
