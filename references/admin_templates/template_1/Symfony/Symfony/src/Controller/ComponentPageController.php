<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ComponentPageController extends AbstractController
{
    #[Route('/component/alert', name: 'alert')]
    public function alert(): Response
    {
        return $this->render('component_page/alert.html.twig',[
            'title' => 'Alerts',
            'subTitle' => 'Components / Alerts',
        ]);
    }
    
    #[Route('/component/avatar', name: 'avatar')]
    public function avatar(): Response
    {
        return $this->render('component_page/avatar.html.twig',[
            'title' => 'Avatar',
            'subTitle' => 'Components / Avatar',
        ]);
    }
    
    #[Route('/component/badges', name: 'badges')]
    public function badges(): Response
    {
        return $this->render('component_page/badges.html.twig',[
            'title' => 'Badges',
            'subTitle' => 'Components / Badges',
        ]);
    }
    
    #[Route('/component/button', name: 'button')]
    public function button(): Response
    {
        return $this->render('component_page/button.html.twig',[
            'title' => 'Buttons',
            'subTitle' => 'Components / Buttons',
        ]);
    }
    
    #[Route('/component/calendar', name: 'calendar')]
    public function calendar(): Response
    {
        return $this->render('component_page/calendar.html.twig',[
            'title' => 'Calendar',
            'subTitle' => 'Components / Calendar',
        ]);
    }
    
    #[Route('/component/card', name: 'card')]
    public function card(): Response
    {
        return $this->render('component_page/card.html.twig',[
            'title' => 'Card',
            'subTitle' => 'Components / Card',
        ]);
    }
    
    #[Route('/component/carousel', name: 'carousel')]
    public function carousel(): Response
    {
        return $this->render('component_page/carousel.html.twig',[
            'title' => 'Carousel',
            'subTitle' => 'Components / Carousel',
        ]);
    }
    
    #[Route('/component/colors', name: 'colors')]
    public function colors(): Response
    {
        return $this->render('component_page/colors.html.twig',[
            'title' => 'Colors',
            'subTitle' => 'Components / Colors',
        ]);
    }
    
    #[Route('/component/dropdown', name: 'dropdown')]
    public function dropdown(): Response
    {
        return $this->render('component_page/dropdown.html.twig',[
            'title' => 'Dropdown',
            'subTitle' => 'Components / Dropdown',
        ]);
    }
    
    #[Route('/component/imageUpload', name: 'imageUpload')]
    public function imageUpload(): Response
    {
        return $this->render('component_page/imageUpload.html.twig',[
            'title' => 'Image Upload',
            'subTitle' => 'Components / Image Upload',
        ]);
    }
    
    #[Route('/component/list', name: 'list')]
    public function list(): Response
    {
        return $this->render('component_page/list.html.twig',[
            'title' => 'List',
            'subTitle' => 'Components / List',
        ]);
    }
    
    #[Route('/component/pagination', name: 'pagination')]
    public function pagination(): Response
    {
        return $this->render('component_page/pagination.html.twig',[
            'title' => 'Pagination',
            'subTitle' => 'Components / Pagination',
        ]);
    }
    
    #[Route('/component/progress', name: 'progress')]
    public function progress(): Response
    {
        return $this->render('component_page/progress.html.twig',[
            'title' => 'Progress bar',
            'subTitle' => 'Components / Progress bar',
        ]);
    }
    
    #[Route('/component/radio', name: 'radio')]
    public function radio(): Response
    {
        return $this->render('component_page/radio.html.twig',[
            'title' => 'Radio',
            'subTitle' => 'Components / Radio',
        ]);
    }
    
    #[Route('/component/starRating', name: 'starRating')]
    public function starRating(): Response
    {
        return $this->render('component_page/starRating.html.twig',[
            'title' => 'Star Rating',
            'subTitle' => 'Components / Star Rating',
        ]);
    }
    
    #[Route('/component/switch', name: 'switch')]
    public function switch(): Response
    {
        return $this->render('component_page/switch.html.twig',[
            'title' => 'Switch',
            'subTitle' => 'Components / Switch',
        ]);
    }
    
    #[Route('/component/tabs', name: 'tabs')]
    public function tabs(): Response
    {
        return $this->render('component_page/tabs.html.twig',[
            'title' => 'Tabs',
            'subTitle' => 'Components / Tabs',
        ]);
    }
    
    #[Route('/component/tags', name: 'tags')]
    public function tags(): Response
    {
        return $this->render('component_page/tags.html.twig',[
            'title' => 'Tags',
            'subTitle' => 'Components / Tags',
        ]);
    }
    
    #[Route('/component/tooltip', name: 'tooltip')]
    public function tooltip(): Response
    {
        return $this->render('component_page/tooltip.html.twig',[
            'title' => 'ToolTip',
            'subTitle' => 'Components / ToolTip',
        ]);
    }
    
    #[Route('/component/typography', name: 'typography')]
    public function typography(): Response
    {
        return $this->render('component_page/typography.html.twig',[
            'title' => 'Typography',
            'subTitle' => 'Components / Typography',
        ]);
    }
    
    #[Route('/component/videos', name: 'videos')]
    public function videos(): Response
    {
        return $this->render('component_page/videos.html.twig',[
            'title' => 'Videos',
            'subTitle' => 'Components / Videos',
        ]);
    }
    
}
