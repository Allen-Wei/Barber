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
    public class SkillController : ApiController
    {

        private BarberModel model = new BarberModel();

        public IEnumerable<Skill> Get()
        {
            return this.Get((ModelUser.CurrentUser ?? new ModelUser()).UserCode);
        }

        [AllowAnonymous]
        public IEnumerable<Skill> Get(string id)
        {
            var user = model.Users.FirstOrDefault(u => u.UserCode == id);
            if (user == null) return new List<Skill>();
            return model.Skills.Where(s => s.BarberId == user.Id);
        }

        public Skill Put(Skill entity)
        {
            entity.BarberId = ModelUser.CurrentUserId;
            entity.SkillDate = DateTime.Now;
            model.Skills.InsertOnSubmit(entity);
            model.SubmitChanges();
            return entity;
        }


        public bool Delete(int id)
        {
            var query = model.Skills.FirstOrDefault(s => s.BarberId == ModelUser.CurrentUserId && s.Id == id);
            model.Skills.DeleteOnSubmit(query);
            model.SubmitChanges();
            return true;
        }
    }
}
