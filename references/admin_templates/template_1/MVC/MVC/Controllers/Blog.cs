using Microsoft.AspNetCore.Mvc;

namespace WowDash.Controllers
{
    public class Blog : Controller
    {
        public IActionResult AddBlog()
        {
            return View();
        }
        
        public IActionResult Blogs()
        {
            return View();
        }
        
        public IActionResult BlogDetails()
        {
            return View();
        }

    }
}
