<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Invoice Controller
 *
 */
class InvoiceController extends AppController
{
    
    public function addNew()
    {
        $this->set('title', 'Invoice List');
        $this->set('subTitle', 'Invoice List');
    }

    public function edit()
    {
        $this->set('title', 'Invoice List');
        $this->set('subTitle', 'Invoice List');
    }

    public function list()
    {
        $this->set('title', 'Invoice List');
        $this->set('subTitle', 'Invoice List');
    }

    public function preview()
    {
        $this->set('title', 'Invoice List');
        $this->set('subTitle', 'Invoice List');
    }
}
