using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Barber.Library;

namespace Barber.Models
{
    public partial class User
    {

        public class UserTypes
        {
            public static string Barber { get { return "Barber"; } }
            public static string User { get { return "User"; } }
            public static string BarberShop { get { return "BarberShop"; } }
        }
        public static bool IsLogin
        {
            get
            {
                var user = HttpContext.Current.User;
                if (user == null) { return false; }
                return user.Identity.IsAuthenticated;
            }
        }
        public static Guid CurrentUserId
        {
            get
            {
                Guid userId = Guid.Empty;
                if (!IsLogin) return userId;
                if (!Guid.TryParse(HttpContext.Current.User.Identity.Name, out userId)) return userId;
                return userId;
            }
        }
        public static Barber.Models.User CurrentUser
        {
            get
            {
                if (!IsLogin) return null;

                var query = Utils.Model.Users.FirstOrDefault(u => u.Id == CurrentUserId);
                if (query == null) return null;
                query.Password = "";
                return query;
            }
        }
        public static bool IsBarber
        {
            get
            {
                if (!IsLogin) return false;
                var currentUser = CurrentUser;
                if (currentUser == null) return false;
                return currentUser.ThisIsBarber;
            }
        }
        public static bool IsNormalUser
        {
            get
            {
                if (!IsLogin) return false;
                var currentUser = CurrentUser;
                if (currentUser == null) return false;
                return currentUser.ThisIsNormalUser;
            }
        }

        public static User GetUser(string userCode)
        {
            return Utils.Model.Users.FirstOrDefault(u => u.UserCode == userCode) ?? new User();
        }
        public static Guid GetUserId(string userCode)
        {
            return GetUser(userCode).Id;
        }
       
        public static User PublicGet(User u)
        {
            if (u != null)
            {
                u.Password = "";
            }
            return u;
        }



        public User(string userCode)
        {
            this.UserCode = userCode;
        }
        public User PublicGet()
        {
            this.Password = "";
            return this;
        }

         public bool IsExist()
        {
            return Utils.Model.Users.Any(u => u.UserCode == this.UserCode);
        }
        public bool ThisIsBarber
        {
            get { return this.UserType == UserTypes.Barber; }
        }
        public bool ThisIsNormalUser
        {
            get
            {
                return this.UserType == UserTypes.User;
            }
        }


        public IEnumerable<Tag> Tags { get; set; }
        public IEnumerable<Skill> Skills { get; set; }
        public IEnumerable<Fan> Fans { get; set; }
        public IEnumerable<Tweet> Tweets { get; set; }

        private Barberer _barberer;
        public Barberer Barberer
        {
            get
            {
                if (this._barberer != null) return this._barberer;
                if (this.ThisIsBarber) {
                    return Utils.Model.Barberers.FirstOrDefault(b => b.BarberId == this.Id) ?? new Barberer();
                }
                return new Barberer();
            }
            set
            {
                this._barberer = value;
            }
        }

        public bool IsValid()
        {
            if (this.Id == Guid.Empty || this.UserCode.Length < 6 || this.Password.Length < 6 || String.IsNullOrWhiteSpace(this.UserType)) return false;
            if (this.UserType == UserTypes.Barber)
            {
                if (this.Barberer == null || !this.Barberer.IsValid()) return false;
            }
            return true;
        }

        public void GetTags()
        {
            this.Tags = Utils.Model.Tags.Where(t => t.BarberId == this.Id);
        }
        public void GetSkills()
        {
            this.Skills = Utils.Model.Skills.Where(s => s.BarberId == this.Id);
        }
        public void GetFans()
        {
            this.Fans = Utils.Model.Fans.Where(f => f.BarberId == this.Id);
        }
        public void GetTweets(int take = 10, int skip = 0)
        {
            this.Tweets = Utils.Model.Tweets.Where(t => t.UserId == this.Id).OrderByDescending(t => t.PublishDate).Skip(skip).Take(take);
        }
       
    }
}