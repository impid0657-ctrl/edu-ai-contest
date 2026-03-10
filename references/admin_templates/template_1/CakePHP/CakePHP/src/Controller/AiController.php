<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Ai Controller
 *
 */
class AiController extends AppController
{    
    public function codeGenerator()
    {
        $this->set('title', 'Code Generator');
        $this->set('subTitle', 'Code Generator');
    }

    public function codeGeneratorNew()
    {
        $this->set('title', 'Code  Generator');
        $this->set('subTitle', 'Code  Generator');
    }

    public function imageGenerator()
    {
        $this->set('title', 'Image  Generator');
        $this->set('subTitle', 'Image  Generator');
    }

    public function textGenerator()
    {
        $this->set('title', 'Text Generator');
        $this->set('subTitle', 'Text Generator');
    }

    public function textGeneratorNew()
    {
        $this->set('title', 'Text Generator');
        $this->set('subTitle', 'Text Generator');
    }

    public function videoGenerator()
    {
        $this->set('title', 'Video Generator');
        $this->set('subTitle', 'Video Generator');
    }

    public function voiceGenerator()
    {
        $this->set('title', 'Voice Generator');
        $this->set('subTitle', 'Voice Generator');
    }
}
