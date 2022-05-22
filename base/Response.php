<?php

namespace Hasdemir\Base;

class Response
{ 
  public function error($http_code, $header, $message = null, $e = null, $th = null)
  {
    $response = [
      'message' => $message,
      'key' => $e->key ?? Codes::ERROR_UNKNOWN,
      'vars' => $e->vars,
    ];
    Log::error($response, $e, $th);
    return $this->emit($http_code, $header, $response);
  }

  public function emit($http_code, $header, $response)
  {
    $header['Api-Verison'] = API_VERSION;
    if (is_array($response)) {
      $header['Content-Type'] = 'application/json; charset=utf-8';
      $response = json_encode($response);
    } else {
      $header['Content-Type'] = $header['Content-Type'] ?? 'text/html; charset=utf-8';
    }

    foreach ($header as $key => $value) {
      header($key . ': ' . $value);
    }

    http_response_code($http_code);

    echo $response;
  }
}
