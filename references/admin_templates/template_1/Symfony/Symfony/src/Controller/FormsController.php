<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class FormsController extends AbstractController
{
    #[Route('/forms/form', name: 'form')]
    public function form(): Response
    {
        return $this->render('forms/form.html.twig',[
            'title' => 'Input Form',
            'subTitle' => 'Input Form',
        ]);
    }
    
    #[Route('/forms/formLayout', name: 'formLayout')]
    public function formLayout(): Response
    {
        return $this->render('forms/formLayout.html.twig',[
            'title' => 'Input Form',
            'subTitle' => 'Input Form',
        ]);
    }
    
    #[Route('/forms/formValidation', name: 'formValidation')]
    public function formValidation(): Response
    {
        return $this->render('forms/formValidation.html.twig',[
            'title' => 'Form Validation',
            'subTitle' => 'Form Validation',
        ]);
    }
    
    #[Route('/forms/wizard', name: 'wizard')]
    public function wizard(): Response
    {
        return $this->render('forms/wizard.html.twig',[
            'title' => 'Wizard',
            'subTitle' => 'Wizard',
        ]);
    }
    
}
