using Microsoft.AspNetCore.Mvc;

namespace WowDash.Controllers
{
    public class AuthenticationController : Controller
    {
        public IActionResult ForgotPassword()
        {
            return View();
        }
        public IActionResult Signin()
        {
            return View();
        }
        public IActionResult Signup()
        {
            return View();
        }
    }
}
