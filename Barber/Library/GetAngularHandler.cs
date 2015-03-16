using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;

namespace Barber.Library
{
    public class GetAngularHandler : IHttpHandler
    {
        public bool IsReusable
        {
            get { return false; }
        }

        public void ProcessRequest(HttpContext context)
        {
            var req = context.Request;
            var rep = context.Response;
            var svr = context.Server;

            var url = req.Url.AbsolutePath.Remove(0, 1).ToLower();

            var blocks = url.Split('.');

            if (blocks[0] == "angular")
            {
                rep.ContentType = "text/javascript";
                var directory = new DirectoryInfo(svr.MapPath("~/Vendors"));
                var jsContent = new StringBuilder();
                directory.GetFiles("angular*.js").OrderBy(f => f.Name.Length).All(f =>
                {
                    using (var reader = f.OpenText())
                    {
                        jsContent.Append(String.Format("/* file: {0} */", f.Name));
                        jsContent.AppendLine();
                        jsContent.Append(reader.ReadToEnd());
                        jsContent.AppendLine();
                    }
                    return true;
                });
                rep.Write(jsContent.ToString());
                return;
            }

            if (blocks[0] == "directive" || blocks[0] == "temp")
            {
                rep.ContentType = "text/html";
                var fileName = svr.MapPath(String.Format("~/Angular/Partial/{0}", url.Replace(blocks.Last(), "html")));
                if (File.Exists(fileName))
                {
                    rep.Write(File.ReadAllText(fileName));
                    return;
                }
                rep.StatusCode = 404;
                return;
            }

            rep.ContentType = "text/javascript";
            if (blocks[0] == "boot")
            {
                var fileName = svr.MapPath(String.Format("~/Angular/Boot/{0}.{1}.js", blocks[1], blocks[2]));
                if (File.Exists(fileName))
                {
                    rep.Write(File.ReadAllText(fileName));
                    return;
                }
                rep.StatusCode = 404;
                return;
            }

            if (blocks.Length == 2)
            {
                var directory = new DirectoryInfo(svr.MapPath(String.Format("~/Angular/{0}", blocks[0])));
                if (!directory.Exists)
                {
                    rep.StatusCode = 404;
                    return;
                }
                var jsContent = new StringBuilder();
                directory.GetFiles().All(f =>
                {
                    using (var reader = f.OpenText())
                    {
                        jsContent.Append(reader.ReadToEnd());
                    }
                    return true;
                });
                rep.Write(jsContent.ToString());
                return;
            }

            if (blocks.Length == 3)
            {
                var fileName = svr.MapPath(String.Format("~/Angular/{0}/{1}.js", blocks[0], blocks[1]));
                if (File.Exists(fileName))
                {
                    rep.Write(File.ReadAllText(fileName));
                    return;
                }
            }
            rep.StatusCode = 404;

        }
    }
}