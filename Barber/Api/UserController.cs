using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Barber.Models;
using Barber.Library;
using ModelUser = Barber.Models.User;


namespace Barber.Api
{
    [Authorize]
    public class UserController : ApiController
    {
        private BarberModel model = Utils.Model;

        [AllowAnonymous]
        public ModelUser Get(string id)
        {
            var user = model.Users.FirstOrDefault(u => u.UserCode == id);
            if (user == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            ModelUser.PublicGet(user);
            if (user.ThisIsBarber)
            {
                user.Tags = model.Tags.Where(t => t.BarberId == user.Id);
                user.Skills = model.Skills.Where(s => s.BarberId == user.Id);
                user.Fans = model.Fans.Where(s => s.BarberId == user.Id);
            }
            return user;
        }
        public Barber.Models.User Get()
        {
            var user = ModelUser.CurrentUser ?? new ModelUser();
            if (user.ThisIsBarber)
            {
                user.Tags = model.Tags.Where(t => t.BarberId == user.Id);
                user.Skills = model.Skills.Where(s => s.BarberId == user.Id);
                user.Fans = model.Fans.Where(s => s.BarberId == user.Id);
            }
            return user;
        }

        public bool Post(ModelUser user)
        {
            var queryUser = model.Users.FirstOrDefault(u => u.Id == ModelUser.CurrentUserId);
            if (queryUser == null) return false;

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
            return true;
        }

    }
}
