<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class BlogController extends AbstractController
{
    #[Route('/blog/addBlog', name:'addBlog')]
    public function addBlog():Response
    {
        return $this->render('blog/addBlog.html.twig',[
            'title' => 'Add Blog',
            'subTitle' => 'Add Blog',
        ]);
    }

    #[Route('/blog/blog', name:'blog')]
    public function blog():Response
    {
        return $this->render('blog/blog.html.twig',[
            'title' => 'Blog',
            'subTitle' => 'Blog',
        ]);
    }

    #[Route('/blog/blogDetails', name:'blogDetails')]
    public function blogDetails():Response
    {
        return $this->render('blog/blogDetails.html.twig',[
            'title' => 'Blog Details',
            'subTitle' => 'Blog Details',
        ]);
    }
}
