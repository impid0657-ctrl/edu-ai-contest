<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TableController extends AbstractController
{
    #[Route('/table/tableBasic', name: 'tableBasic')]
    public function tableBasic(): Response
    {
        return $this->render('table/tableBasic.html.twig',[
            'title' => 'Basic Table',
            'subTitle' => 'Basic Table',
        ]);
    }
    #[Route('/table/tableData', name: 'tableData')]
    public function tableData(): Response
    {
        return $this->render('table/tableData.html.twig',[
            'title' => 'Data Table',
            'subTitle' => 'Data Table',
        ]);
    }
}
