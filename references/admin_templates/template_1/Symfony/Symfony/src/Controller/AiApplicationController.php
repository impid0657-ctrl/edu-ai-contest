<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AiApplicationController extends AbstractController
{
    #[Route('ai_application/codeGenerator', name:'codeGenerator')]
    public function codeGenerator(): Response
    {
        return $this->render('ai_application/codeGenerator.html.twig',[
            'title' => 'Code  Generator',
            'subTitle' => 'Code Generator',
        ]);
    }

    #[Route('ai_application/codeGeneratorNew', name:'codeGeneratorNew')]
    public function codeGeneratorNew(): Response
    {
        return $this->render('ai_application/codeGeneratorNew.html.twig',[
            'title' => 'Code  Generator',
            'subTitle' => 'Code Generator',
        ]);
    }

    #[Route('ai_application/imageGenerator', name:'imageGenerator')]
    public function imageGenerator(): Response
    {
        return $this->render('ai_application/imageGenerator.html.twig',[
            'title' => 'Image  Generator',
            'subTitle' => 'Image Generator',
        ]);
    }

    #[Route('ai_application/textGenerator', name:'textGenerator')]
    public function textGenerator(): Response
    {
        return $this->render('ai_application/textGenerator.html.twig',[
            'title' => 'Text  Generator',
            'subTitle' => 'Text Generator',
        ]);
    }

    #[Route('ai_application/textGeneratorNew', name:'textGeneratorNew')]
    public function textGeneratorNew(): Response
    {
        return $this->render('ai_application/textGeneratorNew.html.twig',[
            'title' => 'Text  Generator',
            'subTitle' => 'Text Generator',
        ]);
    }

    #[Route('ai_application/videoGenerator', name:'videoGenerator')]
    public function videoGenerator(): Response
    {
        return $this->render('ai_application/videoGenerator.html.twig',[
            'title' => 'Video  Generator',
            'subTitle' => 'Video Generator',
        ]);
    }

    #[Route('ai_application/voiceGenerator', name:'voiceGenerator')]
    public function voiceGenerator(): Response
    {
        return $this->render('ai_application/voiceGenerator.html.twig',[
            'title' => 'Voice  Generator',
            'subTitle' => 'Voice Generator',
        ]);
    }
}
