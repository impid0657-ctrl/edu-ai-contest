<?php
/**
 * Routes configuration.
 *
 * In this file, you set up routes to your controllers and their actions.
 * Routes are very important mechanism that allows you to freely connect
 * different URLs to chosen controllers and their actions (functions).
 *
 * It's loaded within the context of `Application::routes()` method which
 * receives a `RouteBuilder` instance `$routes` as method argument.
 *
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link          https://cakephp.org CakePHP(tm) Project
 * @license       https://opensource.org/licenses/mit-license.php MIT License
 */

use Cake\Routing\Route\DashedRoute;
use Cake\Routing\RouteBuilder;

/*
 * This file is loaded in the context of the `Application` class.
 * So you can use `$this` to reference the application class instance
 * if required.
 */
return function (RouteBuilder $routes): void {
    /*
     * The default class to use for all routes
     *
     * The following route classes are supplied with CakePHP and are appropriate
     * to set as the default:
     *
     * - Route
     * - InflectedRoute
     * - DashedRoute
     *
     * If no call is made to `Router::defaultRouteClass()`, the class used is
     * `Route` (`Cake\Routing\Route\Route`)
     *
     * Note that `Route` does not do any inflections on URLs which will result in
     * inconsistently cased URLs when used with `{plugin}`, `{controller}` and
     * `{action}` markers.
     */
    $routes->setRouteClass(DashedRoute::class);

    $routes->scope('/', function (RouteBuilder $builder): void {
        

        $builder->scope('/ai', ['controller' => 'Ai'], function ($builder) {
            $builder->connect('/code-generator',['action'=>'codeGenerator'], ['_name'=> 'codeGenerator']);
            $builder->connect('/code-generatorNew',['action'=>'codeGeneratorNew'], ['_name'=> 'codeGeneratorNew']);
            $builder->connect('/image-generator',['action'=>'imageGenerator'], ['_name'=> 'imageGenerator']);
            $builder->connect('/text-generator',['action'=>'textGenerator'], ['_name'=> 'textGenerator']);
            $builder->connect('/text-generatorNew',['action'=>'textGeneratorNew'], ['_name'=> 'textGeneratorNew']);
            $builder->connect('/video-generator',['action'=>'videoGenerator'], ['_name'=> 'videoGenerator']);
            $builder->connect('/voice-generator',['action'=>'voiceGenerator'], ['_name'=> 'voiceGenerator']);
        });


        $builder->scope('/authentication', ['controller' => 'Authentication'], function ($builder) {
            $builder->connect('/forgot-password',['action'=>'forgotPassword'], ['_name'=> 'forgotPassword']);
            $builder->connect('/signin',['action'=>'signin'], ['_name'=> 'signin']);
            $builder->connect('/signup',['action'=>'signup'], ['_name'=> 'signup']);
        });


        $builder->scope('/blog', ['controller' => 'Blog'], function ($builder) {
            $builder->connect('/add-blog',['action'=>'addBlog'], ['_name'=> 'addBlog']);
            $builder->connect('/blog',['action'=>'blog'], ['_name'=> 'blog']);
            $builder->connect('/blog-details',['action'=>'blogDetails'], ['_name'=> 'blogDetails']);
        });
        $builder->scope('/chart', ['controller' => 'Chart'], function ($builder) {
            $builder->connect('/column-chart',['action'=>'columnChart'],['_name'=>'columnChart']);
            $builder->connect('/line-chart',['action'=>'lineChart'],['_name'=>'lineChart']);
            $builder->connect('/pie-chart',['action'=>'pieChart'],['_name'=>'pieChart']);
        });

        // Routhing for Components Controller
        $builder->scope('/components', ['controller' => 'Components'], function ($builder) {
            $builder->connect('/alerts',['action'=>'alerts'],['_name'=>'alerts']);
            $builder->connect('/avatars',['action'=>'avatars'],['_name'=>'avatars']);
            $builder->connect('/badges',['action'=>'badges'],['_name'=>'badges']);
            $builder->connect('/button',['action'=>'button'],['_name'=>'button']);
            $builder->connect('/card',['action'=>'card'],['_name'=>'card']);
            $builder->connect('/carousel',['action'=>'carousel'],['_name'=>'carousel']);
            $builder->connect('/colors',['action'=>'colors'],['_name'=>'colors']);
            $builder->connect('/dropdown',['action'=>'dropdown'],['_name'=>'dropdown']);
            $builder->connect('/list',['action'=>'list'],['_name'=>'list']);
            $builder->connect('/pagination',['action'=>'pagination'],['_name'=>'pagination']);
            $builder->connect('/progressbar',['action'=>'progressbar'],['_name'=>'progressbar']);
            $builder->connect('/radio',['action'=>'radio'],['_name'=>'radio']);
            $builder->connect('/star-ratings',['action'=>'starRatings'],['_name'=>'starRatings']);
            $builder->connect('/switch',['action'=>'switch'],['_name'=>'switch']);
            $builder->connect('/tab-and-accordion',['action'=>'tabAndAccordion'],['_name'=>'tabAndAccordion']);
            $builder->connect('/tags',['action'=>'tags'],['_name'=>'tags']);
            $builder->connect('/tooltip',['action'=>'tooltip'],['_name'=>'tooltip']);
            $builder->connect('/typography',['action'=>'typography'],['_name'=>'typography']);
            $builder->connect('/upload',['action'=>'upload'],['_name'=>'upload']);
            $builder->connect('/videos',['action'=>'videos'],['_name'=>'videos']);
        });


        // Routing for CryptoCurrency Controller
        $builder->scope('/cryptocurrency', ['controller' => 'Cryptocurrency'], function ($builder) {
            $builder->connect('/marketplace',['action'=>'marketplace'],['_name'=>'marketplace']);
            $builder->connect('/marketplace-details',['action'=>'marketplaceDetails'],['_name'=>'marketplaceDetails']);
            $builder->connect('/portfolio',['action'=>'portfolio'],['_name'=>'portfolio']);
            $builder->connect('/wallet',['action'=>'wallet'],['_name'=>'wallet']);
        });

        // Routing for Dashboard Controller
        $builder->scope('/dashboard', ['controller' => 'Dashboard'], function ($builder) {
            $builder->connect('/index2',['action'=>'index2'],['_name'=>'index2']);
            $builder->connect('/index3',['action'=>'index3'],['_name'=>'index3']);
            $builder->connect('/index4',['action'=>'index4'],['_name'=>'index4']);
            $builder->connect('/index5',['action'=>'index5'],['_name'=>'index5']);
            $builder->connect('/index6',['action'=>'index6'],['_name'=>'index6']);
            $builder->connect('/index7',['action'=>'index7'],['_name'=>'index7']);
            $builder->connect('/index8',['action'=>'index8'],['_name'=>'index8']);
            $builder->connect('/index9',['action'=>'index9'],['_name'=>'index9']);
            $builder->connect('/index10',['action'=>'index10'],['_name'=>'index10']);
        });

        // Routing for Forms Controller
        $builder->scope('/forms', ['controller' => 'Forms'], function ($builder) {
            $builder->connect('/form-validation',['action'=>'formValidation'],['_name'=>'formValidation']);
            $builder->connect('/form-wizard',['action'=>'formWizard'],['_name'=>'formWizard']);
            $builder->connect('/input-forms',['action'=>'inputForms'],['_name'=>'inputForms']);
            $builder->connect('/input-layout',['action'=>'inputLayout'],['_name'=>'inputLayout']);
        });

        // Routing for Home Controller
        $builder->scope('/', ['controller' => 'Home'], function ($builder) {
            $builder->connect('/blankpage',['action'=>'blankpage'],['_name'=>'blankpage']);
            $builder->connect('/calendar',['action'=>'calendar'],['_name'=>'calendar']);
            $builder->connect('/chat',['action'=>'chat'],['_name'=>'chat']);
            $builder->connect('/chat-profile',['action'=>'chatProfile'],['_name'=>'chatProfile']);
            $builder->connect('/comingsoon',['action'=>'comingsoon'],['_name'=>'comingsoon']);
            $builder->connect('/email',['action'=>'email'],['_name'=>'email']);
            $builder->connect('/faqs',['action'=>'faqs'],['_name'=>'faqs']);
            $builder->connect('/gallery',['action'=>'gallery'],['_name'=>'gallery']);
            $builder->connect('/',['action'=>'index'],['_name'=>'index']);
            $builder->connect('/kanban',['action'=>'kanban'],['_name'=>'kanban']);
            $builder->connect('/maintenance',['action'=>'maintenance'],['_name'=>'maintenance']);
            $builder->connect('/not-found',['action'=>'notFound'],['_name'=>'notFound']);
            $builder->connect('/pricing',['action'=>'pricing'],['_name'=>'pricing']);
            $builder->connect('/stared',['action'=>'stared'],['_name'=>'stared']);
            $builder->connect('/terms-and-conditions',['action'=>'termsAndConditions'],['_name'=>'termsAndConditions']);
            $builder->connect('/testimonials',['action'=>'testimonials'],['_name'=>'testimonials']);
            $builder->connect('/view-details',['action'=>'viewDetails'],['_name'=>'viewDetails']);
            $builder->connect('/widgets',['action'=>'widgets'],['_name'=>'widgets']);
        });

        // Routing for Invoice Controller
        $builder->scope('/invoice', ['controller' => 'Invoice'], function ($builder) {
            $builder->connect('/add-new',['action'=>'addNew'],['_name'=>'addNew']);
            $builder->connect('/edit',['action'=>'edit'],['_name'=>'edit']);
            $builder->connect('/list',['action'=>'list'],['_name'=>'invoiceList']);
            $builder->connect('/preview',['action'=>'preview'],['_name'=>'preview']);
        });

        // Routing for RoleAndAccess Controller
        $builder->scope('/role-and-accesds', ['controller' => 'RoleAndAccess'], function ($builder) {
            $builder->connect('/assign-role',['action'=>'assignRole'],['_name'=>'assignRole']);
            $builder->connect('/role-access',['action'=>'roleAccess'],['_name'=>'roleAccess']);
        });

        // Routing for Settings Controller
        $builder->scope('/settings', ['controller' => 'Settings'], function ($builder) {
            $builder->connect('/company',['action'=>'company'],['_name'=>'company']);
            $builder->connect('/currencies',['action'=>'currencies'],['_name'=>'currencies']);
            $builder->connect('/languages',['action'=>'languages'],['_name'=>'languages']);
            $builder->connect('/notification',['action'=>'notification'],['_name'=>'notification']);
            $builder->connect('/notificationAlert',['action'=>'notificationAlert'],['_name'=>'notificationAlert']);
            $builder->connect('/payment-getway',['action'=>'paymentGetway'],['_name'=>'paymentGetway']);
            $builder->connect('/theme',['action'=>'theme'],['_name'=>'theme']);
        });

        // Routing for Table Controller
        $builder->scope('/table', ['controller' => 'Table'], function ($builder) {
            $builder->connect('/basic-table',['action'=>'basicTable'],['_name'=>'basicTable']);
            $builder->connect('/data-table ',['action'=>'dataTable'],['_name'=>'dataTable']);
        });

        // Routing for Users Controller
        $builder->scope('/user', ['controller' => 'Users'], function ($builder) {
            $builder->connect('/add-user',['action'=>'addUser'],['_name'=>'addUser']);
            $builder->connect('/users-grid',['action'=>'usersGrid'],['_name'=>'usersGrid']);
            $builder->connect('/users-list',['action'=>'usersList'],['_name'=>'usersList']);
            $builder->connect('/view-profile',['action'=>'viewProfile'],['_name'=>'viewProfile']);
        });

        $builder->fallbacks();
    });

    /*
     * If you need a different set of middleware or none at all,
     * open new scope and define routes there.
     *
     * ```
     * $routes->scope('/api', function (RouteBuilder $builder): void {
     *     // No $builder->applyMiddleware() here.
     *
     *     // Parse specified extensions from URLs
     *     // $builder->setExtensions(['json', 'xml']);
     *
     *     // Connect API actions here.
     * });
     * ```
     */
};
