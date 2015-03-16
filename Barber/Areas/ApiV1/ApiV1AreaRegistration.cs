using System.Web.Mvc;

namespace Barber.Areas.ApiV1
{
    public class ApiV1AreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "ApiV1";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "ApiV1_default",
                "ApiV1/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
