<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Settings Controller
 *
 */
class SettingsController extends AppController
{
    
    public function company()
    {
        $this->set('title', 'Company');
        $this->set('subTitle', 'Settings - Company');
    }

    public function currencies()
    {
        $this->set('title', 'Currrencies');
        $this->set('subTitle', 'Settings - Currencies');
    }

    public function languages()
    {
        $this->set('title', 'Languages');
        $this->set('subTitle', 'Settings - Languages');
    }

    public function notification()
    {
        $this->set('title', 'Notification');
        $this->set('subTitle', 'Settings - Notification');
    }

    public function notificationAlert()
    {
        $this->set('title', 'Notification Alert');
        $this->set('subTitle', 'Settings - Notification Alert');
    }

    public function paymentGetway()
    {
        $this->set('title', 'Payment Getway');
        $this->set('subTitle', 'Settings - Payment Getway');
    }

    public function theme()
    {
        $this->set('title', 'Theme');
        $this->set('subTitle', 'Settings - Theme');
    }
}
