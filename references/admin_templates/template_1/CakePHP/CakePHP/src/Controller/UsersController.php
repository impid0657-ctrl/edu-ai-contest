<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Users Controller
 *
 */
class UsersController extends AppController
{
    
    public function addUser()
    {
        $this->set('title', 'Add User');
        $this->set('subTitle', 'Add User');
    }

    public function usersGrid()
    {
        $this->set('title', 'Users Grid');
        $this->set('subTitle', 'Users Grid');
    }

    public function usersList()
    {
        $this->set('title', 'Users List');
        $this->set('subTitle', 'Users List');
    }

    public function viewProfile()
    {
        $this->set('title', 'View Profile');
        $this->set('subTitle', 'View Profile');
    }
}
