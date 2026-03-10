<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UsersController extends AbstractController
{
    #[Route('/users/addUser', name: 'addUser')]
    public function addUser(): Response
    {
        return $this->render('users/addUser.html.twig',[
            'title' => 'Add User',
            'subTitle' => 'Add User',
        ]);
    }
    
    #[Route('/users/usersGrid', name: 'usersGrid')]
    public function usersGrid(): Response
    {
        return $this->render('users/usersGrid.html.twig',[
            'title' => 'User Grid',
            'subTitle' => 'User Grid',
        ]);
    }
    
    #[Route('/users/usersList', name: 'usersList')]
    public function usersList(): Response
    {
        return $this->render('users/usersList.html.twig',[
            'title' => 'User List',
            'subTitle' => 'User List',
        ]);
    }
    
    #[Route('/users/viewProfile', name: 'viewProfile')]
    public function viewProfile(): Response
    {
        return $this->render('users/viewProfile.html.twig',[
            'title' => 'View Profile',
            'subTitle' => 'View Profile',
        ]);
    }
    
}
