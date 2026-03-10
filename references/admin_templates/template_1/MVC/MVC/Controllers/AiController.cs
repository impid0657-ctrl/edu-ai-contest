using Microsoft.AspNetCore.Mvc;

namespace WowDash.Controllers
{
    public class AiController : Controller
    {
        public IActionResult Ai()
        {
            return View();
        }

        public IActionResult CodeGenerator()
        {
            return View();
        }
        public IActionResult CodeGeneratorNew()
        {
            return View();
        }

        public IActionResult ImageGenerator()
        {
            return View();
        }

        public IActionResult TextGenerator()
        {
            return View();
        }
        public IActionResult TextGeneratorNew()
        {
            return View();
        }

        public IActionResult VideoGenerator()
        {
            return View();
        }

        public IActionResult VoiceGenerator()
        {
            return View();
        }

    }
}
