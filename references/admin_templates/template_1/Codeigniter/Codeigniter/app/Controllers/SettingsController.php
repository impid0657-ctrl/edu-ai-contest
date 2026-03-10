<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class SettingsController extends BaseController
{
    public function company()
    {
        $data = [
            'title' => 'Company',
            'subTitle' => 'Settings - Company',
        ];
        return view('settings/company', $data);
    }

    public function currencies()
    {
        $data = [
            'title' => 'Currencies',
            'subTitle' => 'Settings - Currencies',
        ];
        return view('settings/currencies', $data);
    }

    public function language()
    {
        $data = [
            'title' => 'Languages',
            'subTitle' => 'Settings - Languages',
        ];
        return view('settings/language', $data);
    }

    public function notification()
    {
        $data = [
            'title' => 'Notification',
            'subTitle' => 'Settings - Notification',
        ];
        return view('settings/notification', $data);
    }

    public function notificationAlert()
    {
        $data = [
            'title' => 'Notification Alert',
            'subTitle' => 'Settings - Notification Alert',
        ];
        return view('settings/notificationAlert', $data);
    }

    public function paymentGateway()
    {
        $data = [
            'title' => 'Languages',
            'subTitle' => 'Settings - Languages',
        ];
        return view('settings/paymentGateway', $data);
    }

    public function theme()
    {
        $data = [
            'title' => 'Theme',
            'subTitle' => 'Settings - Theme',
        ];
        return view('settings/theme', $data);
    }

}
