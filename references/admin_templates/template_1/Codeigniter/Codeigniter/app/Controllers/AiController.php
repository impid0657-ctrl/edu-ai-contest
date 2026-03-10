<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class AiController extends BaseController
{
    public function voiceGenerator()
    {
        $data = [
            'title' => 'Voice Generator',
            'subTitle' => 'Voice Generator',
        ];
        return view('ai/voiceGenerator', $data);
    }
    
    public function videoGenerator()
    {
        $data = [
            'title' => 'video Generator',
            'subTitle' => 'video Generator',
        ];
        return view('ai/videoGenerator', $data);
    }
    
    public function textGeneratorNew()
    {
        $data = [
            'title' => 'Text Generator',
            'subTitle' => 'Text Generator',
        ];
        return view('ai/textGeneratorNew', $data);
    }
    
    public function textGenerator()
    {
        $data = [
            'title' => 'Text Generator',
            'subTitle' => 'Text Generator',
        ];
        return view('ai/textGenerator', $data);
    }
    
    public function imageGenerator()
    {
        $data = [
            'title' => 'Image Generator',
            'subTitle' => 'Image Generator',
        ];
        return view('ai/imageGenerator', $data);
    }
    
    public function codeGeneratorNew()
    {
        $data = [
            'title' => 'Code Generator',
            'subTitle' => 'Code Generator',
        ];
        return view('ai/codeGeneratorNew', $data);
    }
    
    public function codeGenerator()
    {
        $data = [
            'title' => 'Code Generator',
            'subTitle' => 'Code Generator',
        ];
        return view('ai/codeGenerator', $data);
    }
    
}
