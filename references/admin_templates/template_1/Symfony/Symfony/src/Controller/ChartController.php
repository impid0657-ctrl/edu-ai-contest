<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ChartController extends AbstractController
{
    #[Route('/chart/columnChart', name:'columnChart')]
    public function columnChart(): Response
    {
        return $this->render('chart/columnChart.html.twig',[
            'title' => 'Column Chart',
            'subTitle' => 'Components / Column Chart',
        ]);
    }

    #[Route('/chart/lineChart', name:'lineChart')]
    public function lineChart(): Response
    {
        return $this->render('chart/lineChart.html.twig',[
            'title' => 'Line Chart',
            'subTitle' => 'Compoonents / Line Chart',
        ]);
    }

    #[Route('/chart/pieChart', name:'pieChart')]
    public function pieChart(): Response
    {
        return $this->render('chart/pieChart.html.twig',[
            'title' => 'Pie Chart',
            'subTitle' => 'Components / Pie Chart',
        ]);
    }

}
