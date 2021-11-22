<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Controller;

class PanelController extends Controller
{
    public function admin($request, $args)
    {
        return view('admin');
    }

    public function commerce($request, $args)
    {
        return view('commerce.index.php');
    }

    public function tutor($request, $args)
    {
        return view('tutor.index.php');
    }

    public function auth($request, $args)
    {
        return view('auth.index', 'html');
    }
}