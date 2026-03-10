<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class BlogController extends BaseController
{
    public function addBlog()
    {
        $data = [
            'title' => 'Add Blog',
            'subTitle' => 'Add Blog',
        ];
        return view('blog/addBlog', $data);
    }
    
    public function blog()
    {
        $data = [
            'title' => 'Blog',
            'subTitle' => 'Blog',
        ];
        return view('blog/blog', $data);
    }
    
    public function blogDetails()
    {
        $data = [
            'title' => 'Blog Details',
            'subTitle' => 'Blog Details',
        ];
        return view('blog/blogDetails', $data);
    }
    
}
