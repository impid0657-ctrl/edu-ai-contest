<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Dashboard Controller
 *
 */
class DashboardController extends AppController
{
    
    public function index2()
    {
        $this->set('title', 'Dashboard');
        $this->set('subTitle', 'CRM');
    }

    public function index3()
    {
        $this->set('title', 'Dashboard');
        $this->set('subTitle', 'eCommerce');
    }

    public function index4()
    {
        $this->set('title', 'Dashboard');
        $this->set('subTitle', 'Cryptocracy');
    }

    public function index5()
    {
        $this->set('title', 'Dashboard');
        $this->set('subTitle', 'Investment');
    }

    public function index6()
    {
        $this->set('title', 'Dashboard');
        $this->set('subTitle', 'LMS / Learning System');
    }

    public function index7()
    {
        $this->set('title', 'Dashboard');
        $this->set('subTitle', 'NFT & Gaming');
    }

    public function index8()
    {
        $this->set('title', 'Dashboard');
        $this->set('subTitle', 'Medical');
    }

    public function index9()
    {
        $this->set('title', 'Analytics');
        $this->set('subTitle', 'Analytics');
    }

    public function index10()
    {
        $this->set('title', 'POS & Inventory');
        $this->set('subTitle', 'POS & Inventory');
    }

}
