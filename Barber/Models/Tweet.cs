using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Barber.Models
{
    public partial class Tweet
    {
        public IEnumerable<Comment> Comments { get; set; }
    }
}