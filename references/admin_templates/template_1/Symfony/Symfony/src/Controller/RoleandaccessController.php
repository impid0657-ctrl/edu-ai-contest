<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class RoleandaccessController extends AbstractController
{
    #[Route('/roleandaccess/assignRole', name: 'assignRole')]
    public function assignRole(): Response
    {
        return $this->render('roleandaccess/assignRole.html.twig',[
            'title' => 'Role & Access',
            'subTitle' => 'Role & Access',
        ]);
    }
    
    #[Route('/roleandaccess/roleAaccess', name: 'roleAaccess')]
    public function roleAaccess(): Response
    {
        return $this->render('roleandaccess/roleAaccess.html.twig',[
            'title' => 'Role & Access',
            'subTitle' => 'Role & Access',
        ]);
    }   

}
