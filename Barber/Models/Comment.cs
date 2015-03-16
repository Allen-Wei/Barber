using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Barber.Library;

namespace Barber.Models
{
    public partial class Comment
    {
        private User _Commenter;
        public User Commenter
        {
            get
            {
                if (this._Commenter != null) return this._Commenter;
                if (this.UserId == null || this.UserId == Guid.Empty) { return new User(); }
                return User.PublicGet(Utils.Model.Users.FirstOrDefault(u => u.Id == this.UserId));
            }
            set
            {
                this._Commenter = value;
            }
        }
    }
}