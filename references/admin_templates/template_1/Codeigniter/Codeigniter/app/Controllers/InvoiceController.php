<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class InvoiceController extends BaseController
{
    public function invoiceAdd()
    {
        $data = [
            'title' => 'Invoice List',
            'subTitle' => 'Invoice List',
        ];
        return view('invoice/invoiceAdd', $data);
    }

    public function invoiceEdit()
    {
        $data = [
            'title' => 'Invoice List',
            'subTitle' => 'Invoice List',
        ];
        return view('invoice/invoiceEdit', $data);
    }

    public function invoiceList()
    {
        $data = [
            'title' => 'Invoice List',
            'subTitle' => 'Invoice List',
        ];
        return view('invoice/invoiceList', $data);
    }

    public function invoicePreview()
    {
        $data = [
            'title' => 'Invoice List',
            'subTitle' => 'Invoice List',
        ];
        return view('invoice/invoicePreview', $data);
    }

}
