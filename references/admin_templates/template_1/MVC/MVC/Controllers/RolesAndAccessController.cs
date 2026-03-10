using Microsoft.AspNetCore.Mvc;

namespace WowDash.Controllers
{
    public class RolesAndAccessController : Controller
    {
        public IActionResult AssignRole()
        {
            return View();
        }
        public IActionResult RoleAccess()
        {
            return View();
        }
    }
}
