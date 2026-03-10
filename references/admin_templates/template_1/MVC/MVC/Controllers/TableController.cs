using Microsoft.AspNetCore.Mvc;

namespace WowDash.Controllers
{
    public class TableController : Controller
    {
        public IActionResult BasicTable()
        {
            return View();
        }
        public IActionResult DataTable()
        {
            return View();
        }
    }
}
