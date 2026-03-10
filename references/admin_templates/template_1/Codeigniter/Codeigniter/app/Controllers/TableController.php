<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class TableController extends BaseController
{  
    public function tableBasic()
    {
        $data = [
            'title' => 'Basic Table',
            'subTitle' => 'Basic Table',
        ];
        return view('table/tableBasic', $data);
    }
    public function tableData()
    {
        $data = [
            'title' => 'Basic Table',
            'subTitle' => 'Basic Table',
        ];
        return view('table/tableData', $data);
    }
}
