using Microsoft.AspNetCore.Mvc;

namespace WowDash.Controllers
{
    public class SettingsController : Controller
    {
        public IActionResult Company()
        {
            return View();
        }
        public IActionResult Currencies()
        {
            return View();
        }
        public IActionResult Languages()
        {
            return View();
        }
        public IActionResult Notification()
        {
            return View();
        }
        public IActionResult NotificationAlert()
        {
            return View();
        }
        public IActionResult PaymentGetway()
        {
            return View();
        }
        public IActionResult Theme()
        {
            return View();
        }
    }
}
