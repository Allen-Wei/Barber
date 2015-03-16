using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection.Emit;
using System.Web.Http;
using Barber.Library;
using Barber.Models;
using ModelUser = Barber.Models.User;

namespace Barber.Api
{

    public class ReserveController : ApiController
    {
        public class TempResult
        {
            public int MonthDay { get; set; }
            public int Number { get; set; }
        }

        private BarberModel model = new BarberModel();

        public IEnumerable<TempResult> Get(string user, int year, int month)
        {
            var message = new HttpResponseMessage();
            var userId = ModelUser.GetUserId(user);
            if (userId == Guid.Empty)
            {
                return new List<TempResult>();
            }
            var sql =
                String.Format("select Day(StartDate) MonthDay, Count(*) as Number from Reserves where Month(StartDate) = {0} and Year(StartDate) = {1} and BarberId = '{2}' group by Day(StartDate)", month, year, userId);

            var result = model.ExecuteQuery<TempResult>(sql);
            return result;
        }
        public IEnumerable<Reserve> Get(string user, int year, int month, int day)
        {
            var date = new DateTime(year, month, day, 1, 1, 1);
            var queryUser = model.Users.FirstOrDefault(u => u.UserCode == user) ?? new ModelUser();

            var query = from reserve in model.Reserves
                        join u in model.Users.DefaultIfEmpty() on reserve.UserId equals u.Id
                        where reserve.BarberId == queryUser.Id && reserve.StartDate <= date && reserve.EndDate >= date
                        select new { reserve, u };

            var reserves = new List<Reserve>();
            Array.ForEach(query.ToArray(), entity =>
            {
                entity.reserve.User = ModelUser.PublicGet(entity.u);
                reserves.Add(entity.reserve);
            });
            return reserves;
        }

        [Authorize]
        public Reserve Put(Reserve reserve, [FromUri] string barber)
        {
            var barberId = ModelUser.GetUserId(barber);
            if (barberId == Guid.Empty) { return null; }

            reserve.Id = Guid.NewGuid();
            reserve.UserId = ModelUser.CurrentUserId;
            reserve.BarberId = barberId;

            model.Reserves.InsertOnSubmit(reserve);
            model.SubmitChanges();

            Barber.Models.Message.PublicMessage(reserve.BarberId, reserve.UserId, String.Format("You have new reserve for {0}.", reserve.Description), "System-Reserve");

            return reserve;
        }

        [Authorize]
        public Reserve Put(SimpleReserve reserve)
        {
            var barberId = ModelUser.GetUserId(reserve.Barber);
            if (barberId == Guid.Empty) return null;
            var dbReserve = new Reserve()
            {
                Id = Guid.NewGuid(),
                Description = reserve.Description,
                StartDate = new DateTime(reserve.Year, reserve.Month, reserve.Day),
                EndDate = new DateTime(reserve.Year, reserve.Month, reserve.Day, 23, 59, 59),
                UserId = ModelUser.CurrentUserId,
                BarberId = barberId
            };
            model.Reserves.InsertOnSubmit(dbReserve);
            model.SubmitChanges();
            Barber.Models.Message.PublicMessage(dbReserve.BarberId, dbReserve.UserId, String.Format("You have new reserve for {0}.", dbReserve.Description), "System-Reserve");
            return dbReserve;
        }

        public class SimpleReserve
        {
            public int Year { get; set; }
            public int Month { get; set; }
            public int Day { get; set; }
            public string Description { get; set; }
            public string Barber { get; set; }
        }

    }
}
