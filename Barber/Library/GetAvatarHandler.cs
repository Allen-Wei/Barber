using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Barber.Library
{
    public class GetAvatarHandler : IHttpHandler
    {
        public bool IsReusable
        {
            get { return false; }
        }

        public void ProcessRequest(HttpContext context)
        {
            var req = context.Request;
            var rep = context.Response;
            rep.ContentType = "image/*";

            var userIdentity = req.Url.AbsolutePath.Split('.')[0].Replace("/", "");
            Guid userId = Guid.Empty;
            var user = Utils.Model.Users.FirstOrDefault(u => u.UserCode == userIdentity);
            if (Guid.TryParse(userIdentity, out userId))
            {
                user = Utils.Model.Users.FirstOrDefault(u => u.Id == userId);
            }
            if (user == null)
            {
                rep.Headers.Add("X-Bar-Error", "not_found_user");
                rep.Headers.Add("X-Bar-Query", userIdentity);
                rep.StatusCode = 404;
                rep.End();
                return;
            }
            var directory = new DirectoryInfo(context.Server.MapPath(Path.Combine("~", "Content", "Upload", "Images")));
            var images = directory.GetFiles(user.Id.ToString() + "*");
            if (images.Length <= 0)
            {
                rep.Headers.Add("X-Bar-Error", "not_found_image");
                rep.StatusCode = 404;
                rep.End();
                return;
            }

            var image = images[0];
            rep.ContentType = "image/" + Path.GetExtension(image.Name).Remove(0, 1);
            rep.WriteFile(image.FullName);
        }
    }
}