<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Blog Controller
 *
 */
class BlogController extends AppController
{
    public function addBlog()
    {
        $this->set('title', 'Add Blog');
        $this->set('subTitle', 'Add Blog');
    }

    public function blog()
    {
        $this->set('title', 'Blog');
        $this->set('subTitle', 'Blog');
    }

    public function blogDetails()
    {
        $this->set('title', 'Blog Details');
        $this->set('subTitle', 'Blog Details');
    }
}
