<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Authentication Controller
 *
 */
class AuthenticationController extends AppController
{
    public function forgotPassword()
    {
        $this->viewBuilder()->setLayout('layout2');
    }

    public function signin()
    {
        $this->viewBuilder()->setLayout('layout2');
    }

    public function signup()
    {
        $this->viewBuilder()->setLayout('layout2');
    }
}
