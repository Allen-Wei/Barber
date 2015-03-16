using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Barber.Models;
using Barber.Library;
using ModelUser = Barber.Models.User;

namespace Barber.Areas.ApiV1.Controllers
{
    public class SearchController : Controller
    {
        private BarberModel model = new BarberModel();

        public JsonResult SearchTag(string q, int take= 10, int skip = 0)
        {
            var query = from tag in model.Tags
                join user in model.Users.DefaultIfEmpty() on tag.BarberId equals user.Id
                where tag.TagName.Contains(q)
                select new {Tag = tag, User = user};

            var total = query.LongCount();
            var result = query.Skip(skip).Take(take).AsEnumerable();
            foreach (var r in result)
            {
                 ModelUser.PublicGet(r.User);
            }


            return Json(result, JsonRequestBehavior.AllowGet);
        }

    }
}
