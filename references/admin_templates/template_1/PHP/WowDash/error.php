<?php
// Set default title and subtitle if not set
if (!isset($title)) $title = 'Error';
if (!isset($subTitle)) $subTitle = 'Error';
if (!isset($errorMessage)) $errorMessage = 'An error occurred while processing your request.';
?>

<?php include './layouts/layout-top.php' ?>

<div class="card basic-data-table">
    <div class="card-body py-80 px-32 text-center">
        <div class="max-w-454-px mx-auto">
            <img src="assets/images/error/404-img.png" alt="Error" class="mb-24">
        </div>
        <h1 class="mb-16"><?php echo htmlspecialchars($title); ?></h1>
        <p class="text-secondary-light max-w-650-px mx-auto">
            <?php echo htmlspecialchars($errorMessage); ?>
        </p>
        
        <?php if (isset($debugInfo) && !empty($debugInfo) && getenv('APP_DEBUG') === 'true'): ?>
            <div class="mt-24 p-16 bg-gray-50 rounded-8 text-left" style="word-break: break-all;">
                <h4 class="mb-12">Debug Information:</h4>
                <pre class="text-sm"><?php echo htmlspecialchars($debugInfo); ?></pre>
            </div>
        <?php endif; ?>
        
        <div class="mt-32">
            <a href="index.php" class="btn btn-primary-600 radius-8 px-40 py-16">
                <i class="ri-home-4-line me-2"></i> Back to Home
            </a>
            <button onclick="window.history.back()" class="btn btn-outline-primary-600 radius-8 px-40 py-16 ms-12">
                <i class="ri-arrow-left-line me-2"></i> Go Back
            </button>
        </div>
    </div>
</div>

<?php include './layouts/layout-bottom.php' ?>