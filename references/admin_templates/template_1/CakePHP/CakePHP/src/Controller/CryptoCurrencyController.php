<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * CryptoCurrency Controller
 *
 */
class CryptoCurrencyController extends AppController
{

    public function marketplace()
    {
        $this->set('title', 'Market Place');
        $this->set('subTitle', 'Market Place');
    }

    public function marketplaceDetails()
    {
        $this->set('title', 'Market Place Details');
        $this->set('subTitle', 'Market Place Details');
    }

    public function portfolio()
    {
        $this->set('title', 'Portfolio');
        $this->set('subTitle', 'Portfolio');
    }

    public function wallet()
    {
        $this->set('title', 'Wallet');
        $this->set('subTitle', 'Wallet');
    }
}
