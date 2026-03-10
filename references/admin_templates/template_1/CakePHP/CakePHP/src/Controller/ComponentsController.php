<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Components Controller
 *
 */
class ComponentsController extends AppController
{
    public function alerts()
    {
        $this->set('title', 'Alerts');
        $this->set('subTitle', 'Components / Alerts');
    }
    
    public function avatars()
    {
        $this->set('title', 'Avatars');
        $this->set('subTitle', 'Components / Avatars');
    }

    public function badges()
    {
        $this->set('title', 'Badges');
        $this->set('subTitle', 'Components / Badges');
    }

    public function button()
    {
        $this->set('title', 'Button');
        $this->set('subTitle', 'Components / Button');
    }

    public function calendar()
    {
        $this->set('title', 'Calendar');
        $this->set('subTitle', 'Components / Calendar');
    }

    public function card()
    {
        $this->set('title', 'Card');
        $this->set('subTitle', 'Components / Card');
    }

    public function carousel()
    {
        $this->set('title', 'Carousel');
        $this->set('subTitle', 'Components / Carousel');
    }

    public function colors()
    {
        $this->set('title', 'Colors');
        $this->set('subTitle', 'Components / Colors');
    }

    public function dropdown()
    {
        $this->set('title', 'Dropdown');
        $this->set('subTitle', 'Components / Dropdown');
    }

    public function list()
    {
        $this->set('title', 'List');
        $this->set('subTitle', 'Components / List');
    }

    public function pagination()
    {
        $this->set('title', 'Pagination');
        $this->set('subTitle', 'Components / Pagination');
    }

    public function progressbar()
    {
        $this->set('title', 'Progressbar');
        $this->set('subTitle', 'Components / Progressbar');
    }

    public function radio()
    {
        $this->set('title', 'Radio');
        $this->set('subTitle', 'Components / Radio');
    }

    public function starRatings()
    {
        $this->set('title', 'Star Ratings');
        $this->set('subTitle', 'Components / Star Ratings');
    }

    public function switch()
    {
        $this->set('title', 'Switch');
        $this->set('subTitle', 'Components / Switch');
    }
        
    public function tabAndAccordion()
    {
        $this->set('title', 'Tab & Accordion');
        $this->set('subTitle', 'Components / Tab & Accordion');
    }
        
    public function tags()
    {
        $this->set('title', 'Tags');
        $this->set('subTitle', 'Components / Tags');
    }
        
    public function tooltip()
    {
        $this->set('title', 'Tooltip & Popover');
        $this->set('subTitle', 'Components / Tooltip & Popover');
    }
        
    public function typography()
    {
        $this->set('title', 'Typography');
        $this->set('subTitle', 'Components / Typography');
    }
        
    public function upload()
    {
        $this->set('title', 'File Upload');
        $this->set('subTitle', 'Components / File Upload');
    }
        
    public function videos()
    {
        $this->set('title', 'Videos');
        $this->set('subTitle', 'Components / Videos');
    }
}
