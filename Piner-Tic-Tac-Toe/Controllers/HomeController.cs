using Microsoft.AspNetCore.Mvc;
using Piner_Tic_Tac_Toe.Models;
using System.Diagnostics;

namespace Piner_Tic_Tac_Toe.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
