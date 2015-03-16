using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ModelUser = Barber.Models.User;
using Barber.Models;
using Barber.Library;

namespace Barber.Controllers
{
    public class HomeController : Controller
    {
        private BarberModel model = Utils.Model;

        public ActionResult Index()
        {
            if (ModelUser.IsLogin)
            {
                Response.Redirect("/Users");
            }

            var currentUser = ModelUser.CurrentUser ?? new ModelUser();
            currentUser.GetTags();
            currentUser.GetSkills();
            currentUser.GetFans();
            currentUser.GetTweets();

            return View();
        }

    }
}
