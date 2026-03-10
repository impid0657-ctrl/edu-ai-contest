<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class UsersController extends BaseController
{

    public function addUser()
    {
        $data = [
            'title' => 'Add User',
            'subTitle' => 'Add User',
        ];
        return view('users/addUser', $data);
    }

    public function usersGrid()
    {
        $data = [
            'title' => 'Users Grid',
            'subTitle' => 'Users Grid',
        ];
        return view('users/usersGrid', $data);
    }

    public function usersList()
    {
        $data = [
            'title' => 'Users List',
            'subTitle' => 'Users List',
        ];
        return view('users/usersList', $data);
    }

    public function viewProfile()
    {
        $data = [
            'title' => 'View Profile',
            'subTitle' => 'View Profile',
        ];
        return view('users/viewProfile', $data);
    }

}
