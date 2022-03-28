<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Controller;
use Hasdemir\Base\Log;

class AdminController extends Controller
{
  public function admin($request, $args)
  {
    Log::currentJob(Codes::JOB_ADMIN);
    try {
      return view('admin.public.index.php');
    } finally {
      Log::endJob();
    }
  }
}
