<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class InvoiceController extends AbstractController
{

    #[Route('/invoice/invoiceAdd', name: 'invoiceAdd')]
    public function invoiceAdd(): Response
    {
        return $this->render('invoice/invoiceAdd.html.twig',[
            'title' => 'Invoice List',
            'subTitle' => 'Invoice List',
        ]);
    }

    #[Route('/invoice/invoiceEdit', name: 'invoiceEdit')]
    public function invoiceEdit(): Response
    {
        return $this->render('invoice/invoiceEdit.html.twig',[
            'title' => 'Invoice List',
            'subTitle' => 'Invoice List',
        ]);
    }

    #[Route('/invoice/invoiceList', name: 'invoiceList')]
    public function invoiceList(): Response
    {
        return $this->render('invoice/invoiceList.html.twig',[
            'title' => 'Invoice List',
            'subTitle' => 'Invoice List',
        ]);
    }

    #[Route('/invoice/invoicePreview', name: 'invoicePreview')]
    public function invoicePreview(): Response
    {
        return $this->render('invoice/invoicePreview.html.twig',[
            'title' => 'Invoice List',
            'subTitle' => 'Invoice List',
        ]);
    }

}
