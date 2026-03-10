<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DashboardController extends AbstractController
{
    #[Route('/', name: 'root')]
    #[Route('/dashboard/index', name:'index')]
    public function index(): Response
    {
        return $this->render('dashboard/index.html.twig',[
            'title' => 'Dashboard',
            'subTitle' => 'AI',
        ]);
    }

    #[Route('/dashboard/index2', name:'index2')]
    public function index2(): Response
    {
        return $this->render('dashboard/index2.html.twig',[
            'title' => 'Dashboard',
            'subTitle' => 'CRM',
        ]);
    }

    #[Route('/dashboard/index3', name:'index3')]
    public function index3(): Response
    {
        return $this->render('dashboard/index3.html.twig',[
            'title' => 'Dashboard',
            'subTitle' => 'e Commerce',
        ]);
    }

    #[Route('/dashboard/index4', name:'index4')]
    public function index4(): Response
    {
        return $this->render('dashboard/index4.html.twig',[
            'title' => 'Dashboard',
            'subTitle' => 'Cryptocracy',
        ]);
    }

    #[Route('/dashboard/index5', name:'index5')]
    public function index5(): Response
    {
        return $this->render('dashboard/index5.html.twig',[
            'title' => 'Dashboard',
            'subTitle' => 'Investment',
        ]);
    }

    #[Route('/dashboard/index6', name:'index6')]
    public function index6(): Response
    {
        return $this->render('dashboard/index6.html.twig',[
            'title' => 'Dashboard',
            'subTitle' => 'LMS / Learning System',
        ]);
    }

    #[Route('/dashboard/index7', name:'index7')]
    public function index7(): Response
    {
        return $this->render('dashboard/index7.html.twig',[
            'title' => 'Dashboard',
            'subTitle' => 'NFT & Gaming',
        ]);
    }

    #[Route('/dashboard/index8', name:'index8')]
    public function index8(): Response
    {
        return $this->render('dashboard/index8.html.twig',[
            'title' => 'Dashboard',
            'subTitle' => 'Madical',
        ]);
    }

    #[Route('/dashboard/index9', name:'index9')]
    public function index9(): Response
    {
        return $this->render('dashboard/index9.html.twig',[
            'title' => 'Dashboard',
            'subTitle' => 'Analytics',
        ]);
    }

    #[Route('/dashboard/index10', name:'index10')]
    public function index10(): Response
    {
        return $this->render('dashboard/index10.html.twig',[
            'title' => 'Dashboard',
            'subTitle' => 'POS & Inventory',
        ]);
    }
}
