<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class RoleAndAccessController extends BaseController
{
    public function assignRole()
    {
        $data = [
            'title' => 'Role & Access',
            'subTitle' => 'Role & Access',
        ];
        return view('roleAndAccess/assignRole', $data);
    }

    public function roleAaccess()
    {
        $data = [
            'title' => 'Role & Access',
            'subTitle' => 'Role & Access',
        ];
        return view('roleAndAccess/roleAccess', $data);
    }

}
