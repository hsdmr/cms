<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Controller;

class AdminController extends Controller
{
  public function admin($request, $args)
  {
    $this->currentJob(Codes::JOB_ADMIN, false);
    try {
      return view('admin.public.index.php');
    } finally {
      $this->endJob();
    }
  }
}
