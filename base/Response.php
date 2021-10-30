<?php

namespace Hasdemir\Base;

class Response
{
	public function error($http_code, $header, $code = null, $message = null, $th = null)
	{
		$response = [
			'status' => $code,
			'message' => $message,
			'link' => $header['Link'],
			'th' => $th->getMessage()
		];
		return $this->emit($http_code, $header, $response);
	}

	public static function emit($http_code, $header, $response)
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
