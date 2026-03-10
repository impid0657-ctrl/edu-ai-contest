<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * RoleAndAccess Controller
 *
 */
class RoleAndAccessController extends AppController
{

    public function assignRole()
    {
        $this->set('title', 'Role & Access');
        $this->set('subTitle', 'Role & Access');
    }

    public function roleAccess()
    {
        $this->set('title', 'Role & Access');
        $this->set('subTitle', 'Role & Access');
    }
}
