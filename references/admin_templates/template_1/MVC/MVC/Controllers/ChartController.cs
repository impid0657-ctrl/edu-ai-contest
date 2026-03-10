using Microsoft.AspNetCore.Mvc;

namespace WowDash.Controllers
{
    public class ChartController : Controller
    {
        public IActionResult ColumnChart()
        {
            return View();
        }
        public IActionResult LineChart()
        {
            return View();
        }
        public IActionResult PieChart()
        {
            return View();
        }
    }
}
