using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Barber.Models
{
    public partial class Barberer
    {
        public bool IsValid()
        {
            if (String.IsNullOrWhiteSpace(this.ShopName)) return false;
            return true;
        }
    }
}