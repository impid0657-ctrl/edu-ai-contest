<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class FormsController extends BaseController
{
    public function form()
    {
        $data = [
            'title' => 'Input From',
            'subTitle' => 'Input Form',
        ];
        return view('forms/form', $data);
    }

    public function formlayout()
    {
        $data = [
            'title' => 'Input Layout',
            'subTitle' => 'Input Layout',
        ];
        return view('forms/formlayout', $data);
    }

    public function formvalidation()
    {
        $data = [
            'title' => 'Form Validation',
            'subTitle' => 'Form Validation',
        ];
        return view('forms/formvalidation', $data);
    }

    public function wizard()
    {
        $data = [
            'title' => 'Wizard',
            'subTitle' => 'Wizard',
        ];
        return view('forms/wizard', $data);
    }

}
