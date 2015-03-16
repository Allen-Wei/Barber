using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.ComponentModel.DataAnnotations;
using ModelUser = Barber.Models.User;
using Barber.Models;
using Barber.Library;
using System.Web.Security;

namespace Barber.Controllers
{
    [Authorize]
    public class UsersController : Controller
    {

        private BarberModel model = Utils.Model;

        public ActionResult Index()
        {
            Response.Redirect("/Users/Detail/" + ModelUser.CurrentUser.UserCode);
            return View();
        }

        [AllowAnonymous]
        public ActionResult Detail(string id)
        {
            ViewBag.UserCode = id;
            ViewBag.IsLogin = ModelUser.IsLogin;
            ViewBag.IsCurrent = false;
            if (ModelUser.CurrentUser != null && ModelUser.CurrentUser.UserCode == id)
            {
                ViewBag.IsCurrent = true;
            }

            var query = model.Users.FirstOrDefault(u => u.UserCode == id) ?? new User();
            if (query.Id == Guid.Empty) Response.Redirect("/");

            query.GetTags();
            query.GetSkills();
            query.GetFans();
            query.GetTweets();
            return View(query);
        }
        [AllowAnonymous]
        public ActionResult Barber()
        {
            return View();
        }
        public ActionResult SignOut()
        {
            FormsAuthentication.SignOut();
            Response.Redirect("/");
            return View();
        }

        public ActionResult Message(string filter = "all", int page = 1)
        {
            Func<Message, bool> condition = m => m.ReceiverId == ModelUser.CurrentUserId;

            if (filter == "unread") condition = m => m.ReceiverId == ModelUser.CurrentUserId && !m.IsRead;
            if (filter == "read") condition = m => m.ReceiverId == ModelUser.CurrentUserId && m.IsRead;


            var take = 10;
            var skip = (page - 1) * take;

            ViewBag.Filter = filter;
            ViewBag.Total = model.Messages.Where(condition).LongCount();
            ViewBag.Pages = Math.Ceiling(Convert.ToDouble(ViewBag.Total) / take);

            var messages = model.Messages.Where(condition).OrderByDescending(m => m.GenerateDate).Skip(skip).Take(take);

            return View(messages);
        }

        public ActionResult Update()
        {
            var user = ModelUser.CurrentUser;
            return View(user);
        }
        public ActionResult Profile()
        {
            return View(ModelUser.CurrentUser);
        }
        [HttpPost]
        public ActionResult Update(ModelUser user)
        {
            var queryUser = model.Users.FirstOrDefault(u => u.Id == ModelUser.CurrentUserId);
            if (queryUser == null)
            {
                ViewBag.Error = "not found";
                return View();
            }
            queryUser.Name = user.Name;
            queryUser.Gender = user.Gender == "female" ? "female" : "male";
            queryUser.Address = user.Address;
            queryUser.Age = user.Age;
            queryUser.Email = user.Email;
            queryUser.Signature = user.Signature;
            if (queryUser.ThisIsBarber)
            {
                var barber = model.Barberers.FirstOrDefault(b => b.BarberId == queryUser.Id);
                if (barber != null)
                {
                    barber.ShopName = user.Barberer.ShopName;
                }
            }
            model.SubmitChanges();
            Response.Redirect("/Users");
            return View();
        }
    }
}
