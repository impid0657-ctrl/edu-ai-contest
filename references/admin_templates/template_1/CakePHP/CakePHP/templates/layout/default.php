<!-- meta tags and other links -->
<!DOCTYPE html>
<html lang="en" data-theme="light">
  <?= $this->element('head') ?>
  <body>
    <?= $this->element('sidebar') ?>

    <main class="dashboard-main">
      <?= $this->element('navbar') ?>
        <div class="dashboard-main-body">

            <?= $this->element('breadcrumb') ?> 

            <?= $this->fetch('content') ?>
        </div>

      <?= $this->element('footer') ?> 
    </main>
    <?= $this->element('scripts') ?>
    
    <!-- This is a comment about fetching the 'script' block -->
    <?= $this->fetch('script') ?>
  </body>
</html>
