<?php

namespace App\Controllers;

class HomeController extends BaseController
{
    public function blankPage()
    {
        $data = [
            'title' => 'Blank Page',
            'subTitle' => 'Blank Page',
        ];
        return view('home/blankPage', $data);
    }

    public function calendar()
    {
        $data = [
            'title' => 'Calendar',
            'subTitle' => 'Components / Calendar',
        ];
        return view('home/calendar', $data);
    }

    public function chatEmpty()
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'Sub Title',
        ];
        return view('home/chatEmpty', $data);
    }

    public function chatMessage()
    {
        $data = [
            'title' => 'Chat',
            'subTitle' => 'Chat',
        ];
        return view('home/chatMessage', $data);
    }

    public function chatProfile()
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'Sub Title',
        ];
        return view('home/chatProfile', $data);
    }

    public function comingSoon()
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'Sub Title',
        ];
        return view('home/comingSoon', $data);
    }

    public function email()
    {
        $data = [
            'title' => 'Email',
            'subTitle' => 'Components / Email',
        ];
        return view('home/email', $data);
    }

    public function error()
    {
        $data = [
            'title' => '404',
            'subTitle' => '404',
        ];
        return view('home/error', $data);
    }

    public function faq()
    {
        $data = [
            'title' => 'Faq',
            'subTitle' => 'Faq',
        ];
        return view('home/faq', $data);
    }

    public function gallery()
    {
        $data = [
            'title' => 'Gallery',
            'subTitle' => 'Gallery',
        ];
        return view('home/gallery', $data);
    }

    public function kanban()
    {
        $data = [
            'title' => 'Kanban',
            'subTitle' => 'Kanban',
        ];
        return view('home/kanban', $data);
    }

    public function maintenance()
    {
        return view('home/maintenance');    
    }

    public function pricing()
    {
        $data = [
            'title' => 'Pricing',
            'subTitle' => 'Pricing',
        ];
        return view('home/pricing', $data);
    }

    public function starred()
    {
        $data = [
            'title' => 'Email',
            'subTitle' => 'Components / Email',
        ];
        return view('home/starred', $data);
    }

    public function termsCondition()
    {
        $data = [
            'title' => 'Terms & Conditions',
            'subTitle' => 'Terms & Conditions',
        ];
        return view('home/termsCondition', $data);
    }

    public function testimonials()
    {
        $data = [
            'title' => 'Testimonials',
            'subTitle' => 'Testimonials',
        ];
        return view('home/testimonials', $data);
    }

    public function veiwDetails()
    {
        $data = [
            'title' => 'Email',
            'subTitle' => 'Components / Email',
        ];
        return view('home/veiwDetails', $data);
    }
    
    public function widgets()
    {
        $data = [
            'title' => 'Widgets',
            'subTitle' => 'Widgets',
        ];
        return view('home/widgets', $data);
    }
}
