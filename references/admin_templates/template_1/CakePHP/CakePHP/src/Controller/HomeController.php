<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Home Controller
 *
 */
class HomeController extends AppController
{
    
    public function blankpage()
    {
        $this->set('title', 'Blank Page');
        $this->set('subTitle', 'Blank Page');
    }

    public function calendar()
    {
        $this->set('title', 'Calendar');
        $this->set('subTitle', 'Components / Calendar');
    }

    public function chat()
    {
        $this->set('title', 'Chat');
        $this->set('subTitle', 'Chat');
    }

    public function chatProfile()
    {
        $this->set('title', 'Chat');
        $this->set('subTitle', 'Chat');
    }

    public function comingsoon()
    {
        $this->viewBuilder()->setLayout('layout2');
    }

    public function email()
    {
        $this->set('title', 'Email');
        $this->set('subTitle', 'Components / Email');
    }

    public function faqs()
    {
        $this->set('title', 'Faq');
        $this->set('subTitle', 'Faq');
    }

    public function gallery()
    {
        $this->set('title', 'Gallery');
        $this->set('subTitle', 'Gallery');
    }

    public function index()
    {
        $this->set('title', 'Dashboard');
        $this->set('subTitle', 'AI');
    }

    public function kanban()
    {
        $this->set('title', 'Kanban');
        $this->set('subTitle', 'Kanban');
    }

    public function maintenance()
    {
        $this->viewBuilder()->setLayout('layout2');
    }

    public function notFound()
    {
        $this->set('title', '404');
        $this->set('subTitle', '404');
    }

    public function pricing()
    {
        $this->set('title', 'Pricing');
        $this->set('subTitle', 'Pricing');
    }

    public function stared()
    {
        $this->set('title', 'Email');
        $this->set('subTitle', 'Components / Email');
    }

    public function termsAndConditions()
    {
        $this->set('title', 'Terms & Condition');
        $this->set('subTitle', 'Terms & Condition');
    }

    public function testimonials()
    {
        $this->set('title', 'Testimonials');
        $this->set('subTitle', 'Testimonials');
    }

    public function viewDetails()
    {
        $this->set('title', 'Email');
        $this->set('subTitle', 'Components / Email');
    }

    public function widgets()
    {
        $this->set('title', 'Widgets');
        $this->set('subTitle', 'Widgets');
    }

}
