using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Net.Http;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Security;
using Barber.Library;
using Barber.Models;
using ModelUser = Barber.Models.User;

namespace Barber.Api
{
    public class TweetController : ApiController
    {
        private BarberModel model = Utils.Model;

        public Tweet Get(int id)
        {
            var tweet = model.Tweets.FirstOrDefault(t => t.Id == id);
            if (tweet == null) return null;
            tweet.Comments = model.Comments.Where(c => c.TweetId == id);
            return tweet;
        }
        public IEnumerable<Tweet> Get(Guid id, int take, int skip)
        {
            var total = model.Tweets.Where(t => t.UserId == id).LongCount();
            var pages = Math.Ceiling(Convert.ToDouble(total) / Convert.ToDouble(take));
            HttpContext.Current.Response.AddHeader("X-Bar-Total", total.ToString());
            HttpContext.Current.Response.AddHeader("X-Bar-Pages", pages.ToString());

            var tweets = model.Tweets.Where(t => t.UserId == id).OrderByDescending(t => t.PublishDate).Skip(skip).Take(take);
            return tweets;

        }
        public IEnumerable<Tweet> Get(string user, int take, int skip)
        {
            var userId = (model.Users.FirstOrDefault(u => u.UserCode == user) ?? new ModelUser()).Id;
            return this.Get(userId, take, skip);
        }
        public IEnumerable<Tweet> Get(int take, int skip)
        {
            return this.Get(ModelUser.CurrentUserId, take, skip);
        }

        [Authorize]
        public bool Post(Tweet tweet)
        {
            var currentUser = ModelUser.CurrentUser ?? new ModelUser();
            var query = model.Tweets.FirstOrDefault(t => t.Id == tweet.Id && tweet.UserId == currentUser.Id);
            if (query == null) return false;
            query.Content = tweet.Content;
            model.SubmitChanges();
            return true;
        }
        [Authorize]
        public Tweet Put(Tweet tweet)
        {
            if (ModelUser.CurrentUserId == Guid.Empty) return null;

            tweet.UserId = ModelUser.CurrentUserId;
            tweet.PublishDate = DateTime.Now;
            model.Tweets.InsertOnSubmit(tweet);
            model.SubmitChanges();
            return tweet;
        }

        [Authorize]
        public bool Delete(int id)
        {
            var tweet = model.Tweets.FirstOrDefault(t => t.Id == id && t.UserId == ModelUser.CurrentUserId);
            if (tweet == null) return false;
            model.Tweets.DeleteOnSubmit(tweet);
            var comments = model.Comments.Where(c => c.TweetId == tweet.Id);
            model.Comments.DeleteAllOnSubmit(comments);
            model.SubmitChanges();
            return true;
        }
    }
}
