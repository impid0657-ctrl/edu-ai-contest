<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class ComponentsController extends BaseController
{
    public function alert()
    {
        $data = [
            'title' => 'Alerts',
            'subTitle' => 'Components / Alerts',
        ];
        return view('components/alert', $data);
    }

    public function avatar()
    {
        $data = [
            'title' => 'Avatars',
            'subTitle' => 'Components / Avatars',
        ];
        return view('components/avatar', $data);
    }

    public function badges()
    {
        $data = [
            'title' => 'Badges',
            'subTitle' => 'Components / Badges',
        ];
        return view('components/badges', $data);
    }

    public function button()
    {
        $data = [
            'title' => 'Button',
            'subTitle' => 'Components / Button',
        ];
        return view('components/button', $data);
    }

    public function calendar()
    {
        $data = [
            'title' => 'Calendar',
            'subTitle' => 'Components / Calendar',
        ];
        return view('components/calendar', $data);
    }

    public function card()
    {
        $data = [
            'title' => 'Card',
            'subTitle' => 'Components / Card',
        ];
        return view('components/card', $data);
    }

    public function carousel()
    {
        $data = [
            'title' => 'Carousel',
            'subTitle' => 'Components / Carousel',
        ];
        return view('components/carousel', $data);
    }

    public function colors()
    {
        $data = [
            'title' => 'Colors',
            'subTitle' => 'Components / Colors',
        ];
        return view('components/Colors', $data);
    }

    public function dropdown()
    {
        $data = [
            'title' => 'Dropdown',
            'subTitle' => 'Components / Dropdown',
        ];
        return view('components/dropdown', $data);
    }

    public function imageUpload()
    {
        $data = [
            'title' => 'Image Upload',
            'subTitle' => 'Components / Image Upload',
        ];
        return view('components/imageUpload', $data);
    }

    public function list()
    {
        $data = [
            'title' => 'List',
            'subTitle' => 'Components / List',
        ];
        return view('components/list', $data);
    }

    public function pagination()
    {
        $data = [
            'title' => 'Pagination',
            'subTitle' => 'Components / Pagination',
        ];
        return view('components/pagination', $data);
    }

    public function progress()
    {
        $data = [
            'title' => 'Progress Bar',
            'subTitle' => 'Components / Progress Bar',
        ];
        return view('components/progress', $data);
    }

    public function radio()
    {
        $data = [
            'title' => 'Radio',
            'subTitle' => 'Components / Radio',
        ];
        return view('components/radio', $data);
    }

    public function starRating()
    {
        $data = [
            'title' => 'Star Ratings',
            'subTitle' => 'Components / Star Ratings',
        ];
        return view('components/starRating', $data);
    }

    public function switch()
    {
        $data = [
            'title' => 'switch',
            'subTitle' => 'Components / switch',
        ];
        return view('components/switch', $data);
    }

    public function tabs()
    {
        $data = [
            'title' => 'Tab & Accordion',
            'subTitle' => 'Components / Tab & Accordion',
        ];
        return view('components/tabs', $data);
    }

    public function tags()
    {
        $data = [
            'title' => 'Tags',
            'subTitle' => 'Components / Tags',
        ];
        return view('components/tags', $data);
    }

    public function tooltip()
    {
        $data = [
            'title' => 'Tooltip & Popover',
            'subTitle' => 'Components / Tooltip & Popover',
        ];
        return view('components/tooltip', $data);
    }

    public function typography()
    {
        $data = [
            'title' => 'Typography',
            'subTitle' => 'Components / Typography',
        ];
        return view('components/typography', $data);
    }

    public function videos()
    {
        $data = [
            'title' => 'Videos',
            'subTitle' => 'Components / Videos',
        ];
        return view('components/videos', $data);
    }

}
