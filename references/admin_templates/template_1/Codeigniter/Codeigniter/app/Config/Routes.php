<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->group('', function($routes) {
    $routes->get('/', 'DashboardController::index', ['as' => 'index']);
    $routes->get('index2', 'DashboardController::index2', ['as' => 'index2']);
    $routes->get('index3', 'DashboardController::index3', ['as' => 'index3']);
    $routes->get('index4', 'DashboardController::index4', ['as' => 'index4']);
    $routes->get('index5', 'DashboardController::index5', ['as' => 'index5']);
    $routes->get('index6', 'DashboardController::index6', ['as' => 'index6']);
    $routes->get('index7', 'DashboardController::index7', ['as' => 'index7']);
    $routes->get('index8', 'DashboardController::index8', ['as' => 'index8']);
    $routes->get('index9', 'DashboardController::index9', ['as' => 'index9']);
    $routes->get('index10', 'DashboardController::index10', ['as' => 'index10']);
});

$routes->group('ai', function($routes) {
    $routes->get('voice-generator', 'AiController::voiceGenerator', ['as'=>'voiceGenerator']);
    $routes->get('video-generator', 'AiController::videoGenerator', ['as'=>'videoGenerator']);
    $routes->get('text-generator-new', 'AiController::textGeneratorNew', ['as'=>'textGeneratorNew']);
    $routes->get('text-generator', 'AiController::textGenerator', ['as'=>'textGenerator']);
    $routes->get('image-generator', 'AiController::imageGenerator', ['as'=>'imageGenerator']);
    $routes->get('code-generator-new', 'AiController::codeGeneratorNew', ['as'=>'codeGeneratorNew']);
    $routes->get('code-generator', 'AiController::codeGenerator', ['as'=>'codeGenerator']);
});

$routes->group('authentication', function($routes) {
    $routes->get('forgot-password', 'AuthenticationController::forgotPassword', ['as'=>'forgotPassword']);
    $routes->get('signin', 'AuthenticationController::signin', ['as'=>'signin']);
    $routes->get('signup', 'AuthenticationController::signup', ['as'=>'signup']);
});

$routes->group('blog', function($routes) {
    $routes->get('addBlog', 'BlogController::addBlog', ['as'=>'addBlog']);
    $routes->get('blog', 'BlogController::blog', ['as'=>'blog']);
    $routes->get('blogDetails', 'BlogController::blogDetails', ['as'=>'blogDetails']);
});

$routes->group('chart', function($routes) {
    $routes->get('column-chart', 'ChartController::columnChart', ['as' => 'columnChart']);
    $routes->get('line-chart', 'ChartController::lineChart', ['as' => 'lineChart']);
    $routes->get('pie-chart', 'ChartController::pieChart', ['as' => 'pieChart']);
});

$routes->group('components', function($routes) {
    $routes->get('alert', 'ComponentsController::alert', ['as' => 'alert']);
    $routes->get('avatar', 'ComponentsController::avatar', ['as' => 'avatar']);
    $routes->get('badges', 'ComponentsController::badges', ['as' => 'badges']);
    $routes->get('button', 'ComponentsController::button', ['as' => 'button']);
    $routes->get('calendar', 'ComponentsController::calendar', ['as' => 'calendar']);
    $routes->get('card', 'ComponentsController::card', ['as' => 'card']);
    $routes->get('carousel', 'ComponentsController::carousel', ['as' => 'carousel']);
    $routes->get('colors', 'ComponentsController::colors', ['as' => 'colors']);
    $routes->get('dropdown', 'ComponentsController::dropdown', ['as' => 'dropdown']);
    $routes->get('image-upload', 'ComponentsController::imageUpload', ['as' => 'imageUpload']);
    $routes->get('list', 'ComponentsController::list', ['as' => 'list']);
    $routes->get('pagination', 'ComponentsController::pagination', ['as' => 'pagination']);
    $routes->get('progress', 'ComponentsController::progress', ['as' => 'progress']);
    $routes->get('radio', 'ComponentsController::radio', ['as' => 'radio']);
    $routes->get('star-rating', 'ComponentsController::starRating', ['as' => 'starRating']);
    $routes->get('switch', 'ComponentsController::switch', ['as' => 'switch']);
    $routes->get('tabs', 'ComponentsController::tabs', ['as' => 'tabs']);
    $routes->get('tags', 'ComponentsController::tags', ['as' => 'tags']);
    $routes->get('tooltip', 'ComponentsController::tooltip', ['as' => 'tooltip']);
    $routes->get('typography', 'ComponentsController::typography', ['as' => 'typography']);
    $routes->get('videos', 'ComponentsController::videos', ['as' => 'videos']);
});

$routes->group('crypto-currency', function($routes) {
    $routes->get('marketplace', 'CryptoCurrencyController::marketplace', ['as'=>'marketplace']);
    $routes->get('marketplace-details', 'CryptoCurrencyController::marketplaceDetails', ['as'=>'marketplaceDetails']);
    $routes->get('portfolio', 'CryptoCurrencyController::portfolio', ['as'=>'portfolio']);
    $routes->get('wallet', 'CryptoCurrencyController::wallet', ['as'=>'wallet']);
});

$routes->group('forms', function($routes) {
    $routes->get('form', 'FormsController::form', ['as' => 'form']);
    $routes->get('form-layout', 'FormsController::formlayout', ['as' => 'formLayout']);
    $routes->get('form-validation', 'FormsController::formvalidation', ['as' => 'formValidation']);
    $routes->get('wizard', 'FormsController::wizard', ['as' => 'wizard']);
});

$routes->group('invoice', function($routes) {
    $routes->get('invoice-add', 'InvoiceController::invoiceAdd', ['as' => 'invoiceAdd']);
    $routes->get('invoice-edit', 'InvoiceController::invoiceEdit', ['as' => 'invoiceEdit']);
    $routes->get('invoice-list', 'InvoiceController::invoiceList', ['as' => 'invoiceList']);
    $routes->get('invoice-preview', 'InvoiceController::invoicePreview', ['as' => 'invoicePreview']);
});

$routes->group('role-and-access', function($routes) {
    $routes->get('assign-role', 'RoleAndAccessController::assignRole', ['as' => 'assignRole']);
    $routes->get('role-access', 'RoleAndAccessController::roleAaccess', ['as' => 'roleAaccess']);
});

$routes->group('settings', function($routes) {
    $routes->get('company', 'SettingsController::company', ['as' => 'company']);
    $routes->get('currencies', 'SettingsController::currencies', ['as' => 'currencies']);
    $routes->get('language', 'SettingsController::language', ['as' => 'language']);
    $routes->get('notification', 'SettingsController::notification', ['as' => 'notification']);
    $routes->get('notification-alert', 'SettingsController::notificationAlert', ['as' => 'notificationAlert']);
    $routes->get('payment-gateway', 'SettingsController::paymentGateway', ['as' => 'paymentGateway']);
    $routes->get('theme', 'SettingsController::theme', ['as' => 'theme']);
});

$routes->group('tables', function($routes) {
    $routes->get('table-basic', 'tableController::tableBasic', ['as' => 'tableBasic']);
    $routes->get('table-data', 'tableController::tableData', ['as' => 'tableData']);
});

$routes->group('users', function($routes) {
    $routes->get('add-user', 'UsersController::addUser', ['as' => 'addUser']);
    $routes->get('users-grid', 'UsersController::usersGrid', ['as' => 'usersGrid']);
    $routes->get('users-list', 'UsersController::usersList', ['as' => 'usersList']);
    $routes->get('view-profile', 'UsersController::viewProfile', ['as' => 'viewProfile']);
});

$routes->group('', function($routes) {
    $routes->get('blank-page', 'HomeController::blankPage', ['as' => 'blankPage']);
    $routes->get('calendar', 'HomeController::calendar', ['as' => 'calendar']);
    $routes->get('chat-empty', 'HomeController::chatEmpty', ['as' => 'chatEmpty']);
    $routes->get('chat-message', 'HomeController::chatMessage', ['as' => 'chatMessage']);
    $routes->get('chat-profile', 'HomeController::chatProfile', ['as' => 'chatProfile']);
    $routes->get('comingSoon', 'HomeController::comingSoon', ['as' => 'comingSoon']);
    $routes->get('/email', 'HomeController::email', ['as' => 'email']);
    $routes->get('error', 'HomeController::error', ['as' => 'error']);
    $routes->get('faq', 'HomeController::faq', ['as' => 'faq']);
    $routes->get('gallery', 'HomeController::gallery', ['as' => 'gallery']);
    $routes->get('kanban', 'HomeController::kanban', ['as' => 'kanban']);
    $routes->get('maintenance', 'HomeController::maintenance', ['as' => 'maintenance']);
    $routes->get('pricing', 'HomeController::pricing', ['as' => 'pricing']);
    $routes->get('starred', 'HomeController::starred', ['as' => 'starred']);
    $routes->get('terms-condition', 'HomeController::termsCondition', ['as' => 'termsCondition']);
    $routes->get('testimonials', 'HomeController::testimonials', ['as' => 'testimonials']);
    $routes->get('veiw-details', 'HomeController::veiwDetails', ['as' => 'veiwDetails']);
    $routes->get('widgets', 'HomeController::widgets', ['as' => 'widgets']);
});

