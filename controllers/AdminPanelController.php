<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Controller;
use Hasdemir\Base\Log;

class AdminPanelController extends Controller
{
  public function admin($request, $args)
  {
    Log::currentJob(Codes::JOB_ADMIN);
    try {
      return view('admin.index.html');
    } finally {
      Log::endJob();
    }
  }

}
