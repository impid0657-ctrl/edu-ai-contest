<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class DashboardController extends BaseController
{
    public function index(): string
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'AI',
        ];
        return view('dashboard/index', $data);
    }

    public function index2(): string
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'CRM',
        ];
        return view('dashboard/index2', $data);
    }
    
    public function index3(): string
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'eCommerce',
        ];
        return view('dashboard/index3', $data);
    }
    
    public function index4(): string
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'Cryptocracy',
        ];
        return view('dashboard/index4', $data);
    }
    
    public function index5(): string
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'Investment',
        ];
        return view('dashboard/index5', $data);
    }
    
    public function index6(): string
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'LMS / Learning System',
        ];
        return view('dashboard/index6', $data);
    }
    
    public function index7(): string
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'NFT & Gaming',
        ];
        return view('dashboard/index7', $data);
    }
    
    public function index8(): string
    {
        $data = [
            'title' => 'Dashboard',
            'subTitle' => 'Medical',
        ];
        return view('dashboard/index8', $data);
    }
    
    public function index9(): string
    {
        $data = [
            'title' => 'Analytics',
            'subTitle' => 'Analytics',
        ];
        return view('dashboard/index9', $data);
    }
    
    public function index10(): string
    {
        $data = [
            'title' => 'POS & Inventory',
            'subTitle' => 'POS & Inventory',
        ];
        return view('dashboard/index10', $data);
    }
}
