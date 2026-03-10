<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SettingsController extends AbstractController
{
    #[Route('/settings/company', name: 'company')]
    public function company(): Response
    {
        return $this->render('settings/company.html.twig',[
            'title' => 'Company',
            'subTitle' => 'Settings / Company',
        ]);
    }
    #[Route('/settings/currencies', name: 'currencies')]
    public function currencies(): Response
    {
        return $this->render('settings/currencies.html.twig',[
            'title' => 'Currencies',
            'subTitle' => 'Settings / Currencies',
        ]);
    }
    #[Route('/settings/language', name: 'language')]
    public function language(): Response
    {
        return $this->render('settings/language.html.twig',[
            'title' => 'Language',
            'subTitle' => 'Settings / Language',
        ]);
    }
    #[Route('/settings/notification', name: 'notification')]
    public function notification(): Response
    {
        return $this->render('settings/notification.html.twig',[
            'title' => 'Notification',
            'subTitle' => 'Settings / Notification',
        ]);
    }
    #[Route('/settings/notificationAlert', name: 'notificationAlert')]
    public function notificationAlert(): Response
    {
        return $this->render('settings/notificationAlert.html.twig',[
            'title' => 'Notification',
            'subTitle' => 'Setting / Notification Alert',
        ]);
    }
    #[Route('/settings/paymentGateway', name: 'paymentGateway')]
    public function paymentGateway(): Response
    {
        return $this->render('settings/paymentGateway.html.twig',[
            'title' => 'Payment Gateway',
            'subTitle' => 'Settings / Payment Gateway',
        ]);
    }
    #[Route('/settings/theme', name: 'theme')]
    public function theme(): Response
    {
        return $this->render('settings/theme.html.twig',[
            'title' => 'Theme',
            'subTitle' => 'Settings / Theme',
        ]);
    }

}
