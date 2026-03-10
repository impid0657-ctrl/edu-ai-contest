<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AuthenticationController extends AbstractController
{
    #[Route('authentication/forgotPassword', name:'forgotPassword')]
    public function forgotPassword(): Response
    {
        return $this->render('authentication/forgotPassword.html.twig');
    }

    #[Route('authentication/signin', name:'signin')]
    public function signin(): Response
    {
        return $this->render('authentication/signin.html.twig');
    }

    #[Route('authentication/signup', name:'signup')]
    public function signup(): Response
    {
        return $this->render('authentication/signup.html.twig');
    }

}
