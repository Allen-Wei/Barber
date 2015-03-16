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
    public class TagController : ApiController
    {
        private BarberModel model = new BarberModel();

        public IEnumerable<Tag> Get()
        {
            return this.Get((ModelUser.CurrentUser ?? new ModelUser()).UserCode);
        }

        [AllowAnonymous]
        public IEnumerable<Tag> Get(string id)
        {
            var queryUser = model.Users.FirstOrDefault(u => u.UserCode == id);
            if (queryUser == null) return new List<Tag>();

            return model.Tags.Where(t => t.BarberId == queryUser.Id);
        }

        public Tag Put(Tag entity)
        {
            entity.BarberId = ModelUser.CurrentUserId;
            entity.TagDate = DateTime.Now;
            model.Tags.InsertOnSubmit(entity);
            model.SubmitChanges();
            return entity;
        }


        public bool Delete(int id)
        {
            var query = model.Tags.FirstOrDefault(t => t.BarberId == ModelUser.CurrentUserId && t.Id == id);
            model.Tags.DeleteOnSubmit(query);
            model.SubmitChanges();
            return true;
        }
    }
}
