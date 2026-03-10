<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Forms Controller
 *
 */
class FormsController extends AppController
{
    public function formValidation()
    {
        $this->set('title', 'Form Validation');
        $this->set('subTitle', 'Form Validation');
    }

    public function formWizard()
    {
        $this->set('title', 'Wizard');
        $this->set('subTitle', 'Wizard');
    }

    public function inputForms()
    {
        $this->set('title', 'Input Forms');
        $this->set('subTitle', 'Input Forms');
    }

    public function inputLayout()
    {
        $this->set('title', 'Input Layout');
        $this->set('subTitle', 'Input Layout');
    }
}
