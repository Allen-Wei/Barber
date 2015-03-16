using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using M = Barber.Models;
using ModelUser = Barber.Models.User;
using Barber.Library;
using System.Web.Security;

namespace Barber.Areas.ApiV1.Controllers
{
    public class UserController : Controller
    {
        private M.BarberModel model = Utils.Model;
        public JsonResult Login(ModelUser user)
        {
            var queryUser = model.Users.FirstOrDefault(u => u.UserCode == user.UserCode && u.Password == user.Password);
            var message = new Utils.RichMessage(false);
            if (queryUser == null)
            {
                message.Brief = "not_found";
                if ((new ModelUser(user.UserCode)).IsExist()) { message.Brief = "error_password"; }
                return Json(message);
            }
            var ticket = new FormsAuthenticationTicket(1, queryUser.Id.ToString(), DateTime.Now, DateTime.Now.AddDays(2), true, "");
            var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket));
            Response.AppendCookie(cookie);
            message.Success = true;
            return Json(message);
        }

        public JsonResult Register(ModelUser user)
        {
            var message = new Utils.RichMessage(false);
            if (String.IsNullOrWhiteSpace(user.Password) ||
                String.IsNullOrWhiteSpace(user.UserCode))
            {
                message.Brief = "invalid_parameters";
                return Json(message);
            }
            if (user.IsExist())
            {
                message.Brief = "is_exist";
                return Json(message);
            }

            if (user.UserType != ModelUser.UserTypes.Barber) user.UserType = ModelUser.UserTypes.User;
            user.Id = Guid.NewGuid();

            if (user.UserType == ModelUser.UserTypes.Barber)
            {
                if (user.Barberer == null) { message.Brief = "error_barber"; return Json(message); }
                if (String.IsNullOrWhiteSpace(user.Barberer.ShopName)) { message.Brief = "error_barber_shopname"; return Json(message); }
                user.Barberer.BarberId = user.Id;
                model.Barberers.InsertOnSubmit(user.Barberer);
            }

            if (user.Gender != "female") user.Gender = "male";
            user.RegisterDate = DateTime.Now;

            model.Users.InsertOnSubmit(user);

            model.SubmitChanges();
            (new RolesProvider()).AddUserToRole(user.Id.ToString(), user.UserType);
            message.Success = true;
            return Json(message);
        }
        public JsonResult Logout()
        {
            var message = new Utils.RichMessage(true);
            FormsAuthentication.SignOut();
            return Json(message);
        }

        public JsonResult Current()
        {
            var message = new Utils.RichMessage(false);
            if (User.Identity.IsAuthenticated)
            {
                Guid gid;
                if (!Guid.TryParse(User.Identity.Name, out gid))
                {
                    message.Brief = "error_userid";
                    return Json(message, JsonRequestBehavior.AllowGet);
                }
                message.Success = true;
                var currentUser = ModelUser.PublicGet(model.Users.FirstOrDefault(u => u.Id == gid));
                message.Result = currentUser;
            }
            else
            {
                message.Success = false;
                message.Brief = "not_login";
            }
            return Json(message, JsonRequestBehavior.AllowGet);
        }

        public JsonResult IsExist(string id)
        {
            var message = new Utils.RichMessage(true);
            var user = new ModelUser() { UserCode = id };
            message.Result = user.IsExist();

            return Json(message, JsonRequestBehavior.AllowGet);
        }

        public JsonResult IsBarber(string id)
        {
            var user = model.Users.FirstOrDefault(u => u.UserCode == id);
            if (user == null) return Json(false, JsonRequestBehavior.AllowGet);
            return Json(user.ThisIsBarber, JsonRequestBehavior.AllowGet);
        }
    }
}
