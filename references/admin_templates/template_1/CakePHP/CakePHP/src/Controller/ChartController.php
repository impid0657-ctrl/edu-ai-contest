<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Chart Controller
 *
 */
class ChartController extends AppController
{
    public function columnChart()
    {
        $this->set('title', 'Column Chart');
        $this->set('subTitle', 'Components / Column Chart');
    }
    
    public function lineChart()
    {
        $this->set('title', 'Line Chart');
        $this->set('subTitle', 'Components / Line Chart');
    }
        
    public function pieChart()
    {
        $this->set('title', 'Pie Chart');
        $this->set('subTitle', 'Components / Pie Chart');
    }
}
