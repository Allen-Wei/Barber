using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Barber.Library;
using Barber.Models;
using ModelUser = Barber.Models.User;

namespace Barber.Api
{
    public class CommentController : ApiController
    {
        private BarberModel model = Utils.Model;

        [Authorize]
        public Comment Put(Comment comment)
        {

            var tweet = model.Tweets.FirstOrDefault(t => t.Id == comment.TweetId);
            if (tweet == null) return null;

            comment.UserId = ModelUser.CurrentUserId;
            comment.PublishDate = DateTime.Now;

            model.Comments.InsertOnSubmit(comment);
            model.SubmitChanges();

            Message.PublicMessage(tweet.UserId, ModelUser.CurrentUserId, String.Format("You have new comment for tweet {0}", tweet.Content), "System-Tweet");
            return comment;
        }

        [Authorize]
        public bool Delete(int id)
        {
            var comment = model.Comments.FirstOrDefault(c => c.Id == id);
            if (comment == null) return false;
            var tweetIsBlongCurrentUser = model.Tweets.Any(t => t.UserId == ModelUser.CurrentUserId && t.Id == comment.TweetId);
            if (!tweetIsBlongCurrentUser) return false;

            model.Comments.DeleteOnSubmit(comment);
            model.SubmitChanges();
            return true;
        }
    }
}
