using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.Web.UI.WebControls;
using Barber.Library;
using Barber.Models;
using ModelUser = Barber.Models.User;

namespace Barber.Api
{
    [Authorize]
    public class MessageController : ApiController
    {
        private BarberModel model = Utils.Model;

        private IEnumerable<Message> GetMessages(Func<Message, bool> condition, int take, int skip)
        {
            var total = model.Messages.Where(condition).LongCount();
            var pages = Math.Ceiling(Convert.ToDouble(total) / Convert.ToDouble(take));

            HttpContext.Current.Response.AddHeader("X-Bar-Total", total.ToString());
            HttpContext.Current.Response.AddHeader("X-Bar-Pages", pages.ToString());

            return model.Messages.Where(condition).OrderByDescending(m=>m.GenerateDate).Skip(skip).Take(take);
        }

        public int GetUnReadCount()
        {
            return Message.UnReadCount();
        }
        public IEnumerable<Message> GetAll(int take, int skip)
        {
            Func<Message, bool> condition = m => m.ReceiverId == ModelUser.CurrentUserId;
            return this.GetMessages(condition, take, skip);
        }

        public IEnumerable<Message> Get(bool isRead, int take, int skip)
        {
            Func<Message, bool> condition = m => m.ReceiverId == ModelUser.CurrentUserId && m.IsRead == isRead;
            return this.GetMessages(condition, take, skip);
        }
        
        
        
        
        public bool PostUpdateReadStatus(int id, bool read)
        {
            var message = model.Messages.FirstOrDefault(m => m.Id == id && m.ReceiverId == ModelUser.CurrentUserId);
            if (message == null) return false;

            message.IsRead = read;
            model.SubmitChanges();
            return true;
        }

        public bool PostSetAsRead(int id)
        {
            return this.PostUpdateReadStatus(id, true);
        }
        public bool PostSetAsRead(int[] messageIds)
        {
            var messages =
                model.Messages.Where(m => m.ReceiverId == ModelUser.CurrentUserId && messageIds.Contains(m.Id) && !m.IsRead);
            foreach (var message in messages)
            {
                message.IsRead = true;
            }
            model.SubmitChanges();
            return true;
        }

        //public bool PostSetAllAsRead()
        //{
        //    var messages =
        //       model.Messages.Where(m => m.ReceiverId == ModelUser.CurrentUserId && !m.IsRead);
        //    foreach (var message in messages)
        //    {
        //        message.IsRead = true;
        //    }
        //    model.SubmitChanges();
        //    return true;
        //}


        public bool Delete(int messageId)
        {
            var message =
                model.Messages.FirstOrDefault(m => m.Id == messageId && m.ReceiverId == ModelUser.CurrentUserId);
            if (message == null) return false;
            model.Messages.DeleteOnSubmit(message);
            model.SubmitChanges();
            return true;
        }
    }
}
