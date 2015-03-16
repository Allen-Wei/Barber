using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Barber.Controllers
{
    public class TestController : Controller
    {
        //
        // GET: /Test/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ModelBindTest()
        {
            return View();
        }
    }
}
