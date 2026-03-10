<!DOCTYPE html>
<html lang="en" data-theme="light">

    <?= $this->include('partials/head') ?> 

<body>
    <!-- ..::  header area start ::.. -->
    <?= $this->include('partials/sidebar') ?> 
    <!-- ..::  header area end ::.. -->

    <main class="dashboard-main">      
        <!-- ..::  navbar start ::.. -->
        <?= $this->include('partials/navbar') ?>
        <!-- ..::  navbar end ::.. -->

        <div class="dashboard-main-body">
            <!-- ..::  breadcrumb  start ::.. -->
            <?= $this->include('partials/breadcrumb') ?>
            <!-- ..::  header area end ::.. -->    
            
            <?= $this->renderSection('content') ?> <!-- Main content from the page -->
        </div>      

        <?= $this->include('partials/footer') ?>

    </main>
    <?= $this->include('partials/scripts') ?> <!-- Scripts -->
    <!-- This is a comment about fetching the 'script' block -->
    <?= $this->renderSection('script') ?> <!-- Page-specific scripts -->
</body>
</html>
