<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class CryptoCurrencyController extends BaseController
{   
    public function marketplace()
    {
        $data = [
            'title' => 'Marketplace',
            'subTitle' => 'Marketplace',
        ];
        return view('cryptoCurrency/marketplace', $data);
    }

    public function marketplaceDetails()
    {
        $data = [
            'title' => 'Marketplace Details',
            'subTitle' => 'Marketplace Details',
        ];
        return view('cryptoCurrency/marketplaceDetails', $data);
    }

    public function portfolio()
    {
        $data = [
            'title' => 'Portfolios',
            'subTitle' => 'Portfolios',
        ];
        return view('cryptoCurrency/portfolio', $data);
    }

    public function wallet()
    {
        $data = [
            'title' => 'Wallet',
            'subTitle' => 'Wallet',
        ];
        return view('cryptoCurrency/wallet', $data);
    }

}
