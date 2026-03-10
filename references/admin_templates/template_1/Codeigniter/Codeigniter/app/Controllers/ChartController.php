<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class ChartController extends BaseController
{
    public function columnChart()
    {
        $data = [
            'title' => 'Column Chart',
            'subTitle' => 'Components / Column Chart',
        ];
        return view('chart/columnChart', $data);
    }

    public function lineChart()
    {
        $data = [
            'title' => 'Line Chart',
            'subTitle' => 'Components / Line Chart',
        ];
        return view('chart/lineChart', $data);
    }

    public function pieChart()
    {
        $data = [
            'title' => 'Pie Chart',
            'subTitle' => 'Components / Pie Chart',
        ];
        return view('chart/pieChart', $data);
    }
    
}
