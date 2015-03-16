using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Barber.Library;
using ModelUser = Barber.Models.User;

namespace Barber.Areas.ApiV1.Controllers
{
    public class FileController : Controller
    {
        [Authorize]
        public JsonResult UploadAvatar()
        {
            var message = new Utils.RichMessage(false);
            if (Request.Files.Count <= 0)
            {
                Response.StatusCode = 404;
                message.Brief = "not_found_image";
                return Json(message);
            }
            var image = Request.Files[0];
            if (!(new List<string>() { "image/jpeg", "image/jpg", "image/png" }).Any(ct => ct == image.ContentType))
            {
                message.Brief = "error_mime_type";
                return Json(message);
            }
            var newFileName = String.Format("~/Content/Upload/Images/{0}.{1}", ModelUser.CurrentUserId.ToString(), Path.GetExtension(image.FileName));
            var directory = new DirectoryInfo(Server.MapPath("~/Content/Upload/Images"));

            var files = directory.GetFiles(ModelUser.CurrentUserId.ToString() + "*");
            foreach (var f in files) if (f.Exists) f.Delete();

            image.SaveAs(Server.MapPath(newFileName));
            message.Success = true;
            message.Result = newFileName;
            message.Brief = ModelUser.CurrentUserId.ToString();
            return Json(message);
        }
    }
}
