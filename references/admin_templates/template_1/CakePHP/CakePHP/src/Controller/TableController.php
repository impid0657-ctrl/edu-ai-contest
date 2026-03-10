<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Table Controller
 *
 */
class TableController extends AppController
{
    public function basicTable()
    {
        $this->set('title', 'Basic Table');
        $this->set('subTitle', 'Basic Table');
    }

    public function dataTable()
    {
        $this->set('title', 'Data Table');
        $this->set('subTitle', 'Data Table');
    }
}
