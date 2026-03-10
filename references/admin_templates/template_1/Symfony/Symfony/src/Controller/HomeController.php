<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    #[Route('/blankPage', name: 'blankPage')]
    public function blankPage(): Response
    {
        return $this->render('home/blankPage.html.twig',[
            'title' => 'Blank Page',
            'subTitle' => 'Blank Page',
        ]);
    }
    #[Route('/calendar', name: 'calendar')]
    public function calendar(): Response
    {
        return $this->render('home/calendar.html.twig',[
            'title' => 'Calendar',
            'subTitle' => 'Components / Calendar',
        ]);
    }
    #[Route('/chatEmpty', name: 'chatEmpty')]
    public function chatEmpty(): Response
    {
        return $this->render('home/chatEmpty.html.twig',[
            'title' => 'Chat',
            'subTitle' => 'Components / Chat',
        ]);
    }
    #[Route('/chatMessage', name: 'chatMessage')]
    public function chatMessage(): Response
    {
        return $this->render('home/chatMessage.html.twig',[
            'title' => 'Chat',
            'subTitle' => 'Chat',
        ]);
    }
    #[Route('/chatProfile', name: 'chatProfile')]
    public function chatProfile(): Response
    {
        return $this->render('home/chatProfile.html.twig',[
            'title' => 'Chat',
            'subTitle' => 'Chat',
        ]);
    }
    #[Route('/comingSoon', name: 'comingSoon')]
    public function comingSoon(): Response
    {
        return $this->render('home/comingSoon.html.twig');
    }
    #[Route('/email', name: 'email')]
    public function email(): Response
    {
        return $this->render('home/email.html.twig',[
            'title' => 'Email',
            'subTitle' => 'Components / Email',
        ]);
    }
    #[Route('/error', name: 'error')]
    public function error(): Response
    {
        return $this->render('home/error.html.twig',[
            'title' => '404',
            'subTitle' => 'Components / Error',
        ]);
    }
    #[Route('/faq', name: 'faq')]
    public function faq(): Response
    {
        return $this->render('home/faq.html.twig',[
            'title' => 'Faq',
            'subTitle' => 'Faq',
        ]);
    }
    #[Route('/gallery', name: 'gallery')]
    public function gallery(): Response
    {
        return $this->render('home/gallery.html.twig',[
            'title' => 'Gallery',
            'subTitle' => 'Gallery',
        ]);
    }
    #[Route('/kanban', name: 'kanban')]
    public function kanban(): Response
    {
        return $this->render('home/kanban.html.twig',[
            'title' => 'Kanban',
            'subTitle' => 'Kanban',
        ]);
    }
    #[Route('/maintenance', name: 'maintenance')]
    public function maintenance(): Response
    {
        return $this->render('home/maintenance.html.twig');
    }
    #[Route('/pricing', name: 'pricing')]
    public function pricing(): Response
    {
        return $this->render('home/pricing.html.twig',[
            'title' => 'Pricing',
            'subTitle' => 'Pricing',
        ]);
    }
    #[Route('/starred', name: 'starred')]
    public function starred(): Response
    {
        return $this->render('home/starred.html.twig',[
            'title' => 'Starred',
            'subTitle' => 'Starred',
        ]);
    }
    #[Route('/termsCondition', name: 'termsCondition')]
    public function termsCondition(): Response
    {
        return $this->render('home/termsCondition.html.twig',[
            'title' => 'Terms & Conditions',
            'subTitle' => 'Terms & Conditions',
        ]);
    }
    #[Route('/testimonials', name: 'testimonials')]
    public function testimonials(): Response
    {
        return $this->render('home/testimonials.html.twig',[
            'title' => 'Testimonials',
            'subTitle' => 'Testimonials',
        ]);
    }
    #[Route('/veiwDetails', name: 'veiwDetails')]
    public function veiwDetails(): Response
    {
        return $this->render('home/veiwDetails.html.twig',[
            'title' => 'Email',
            'subTitle' => 'Email',
        ]);
    }

    #[Route('/widgets', name: 'widgets')]
    public function widgets(): Response
    {
        return $this->render('home/widgets.html.twig',[
            'title' => 'Widgets',
            'subTitle' => 'Widgets',
        ]);
    }
}
