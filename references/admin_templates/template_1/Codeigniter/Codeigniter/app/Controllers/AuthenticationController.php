<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class AuthenticationController extends BaseController
{
    
    public function forgotPassword()
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'Sub Title',
        ];
        return view('authentication/forgotPassword', $data);
    }

    public function signin()
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'Sub Title',
        ];
        return view('authentication/signin', $data);
    }

    public function signup()
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'Sub Title',
        ];
        return view('authentication/signup', $data);
    }

}
