using Microsoft.AspNetCore.Mvc;

namespace WowDash.Controllers
{
    public class CryptoCurrencyController : Controller
    {
        public IActionResult Marketplace()
        {
            return View();
        }
        public IActionResult MarketplaceDetails()
        {
            return View();
        }
        public IActionResult Portfolio()
        {
            return View();
        }
        public IActionResult Wallet()
        {
            return View();
        }
    }
}
