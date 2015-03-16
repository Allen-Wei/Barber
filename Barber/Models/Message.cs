using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Web;
using Barber.Library;

namespace Barber.Models
{
    public partial class Message
    {
        public void PublicMessage()
        {
            var model = Utils.Model;
            this.GenerateDate = DateTime.Now;
            this.IsRead = false;
            model.Messages.InsertOnSubmit(this);
            model.SubmitChanges();
        }
        public static void PublicMessage(Guid receiverId, Guid commitId, string content, string msgType)
        {
            var msg = new Message {ReceiverId = receiverId, CommitId = commitId, Content = content, MessageType = msgType};
            msg.PublicMessage();
        }

        public static int UnReadCount()
        {
            if (User.CurrentUserId == Guid.Empty) return 0;
            return Utils.Model.Messages.Count(m => m.ReceiverId == User.CurrentUserId && !m.IsRead);
        }
    }
}