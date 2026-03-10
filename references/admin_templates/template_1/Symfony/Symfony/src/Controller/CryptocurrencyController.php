<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CryptocurrencyController extends AbstractController
{
    #[Route('/cryptocurrency/marketplace', name:'marketplace')]
    public function marketplace(): Response
    {
        return $this->render('cryptocurrency/marketplace.html.twig',[
            'title' => 'Marketplace',
            'subTitle' => 'Marketplace',
        ]);
    }

    #[Route('/cryptocurrency/marketplaceDetails', name:'marketplaceDetails')]
    public function marketplaceDetails(): Response
    {
        return $this->render('cryptocurrency/marketplaceDetails.html.twig',[
            'title' => 'Marketplace Details',
            'subTitle' => 'Marketplace Details',
        ]);
    }

    #[Route('/cryptocurrency/portfolio', name:'portfolio')]
    public function portfolio(): Response
    {
        return $this->render('cryptocurrency/portfolio.html.twig',[
            'title' => 'Portflio',
            'subTitle' => 'Portfolio',
        ]);
    }
    
    #[Route('/cryptocurrency/wallet', name:'wallet')]
    public function wallet(): Response
    {
        return $this->render('cryptocurrency/wallet.html.twig',[
            'title' => 'Wallet',
            'subTitle' => 'Wallet',
        ]);
    }
}
