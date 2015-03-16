using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Barber.Models;
using ModelUser = Barber.Models.User;
using Barber.Library;

namespace Barber.Api
{
    public class BarberController : ApiController
    {
        private BarberModel model = Utils.Model;

        public IEnumerable<ModelUser> Get(int take, int skip)
        {
            return null;
        }
    }
}
