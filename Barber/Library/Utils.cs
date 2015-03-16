using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;
using System.Data;

namespace Barber.Library
{
    public class Utils
    {
        public class RichMessage
        {
            public bool Success { get; set; }
            public string Brief { get; set; }
            public string Message { get; set; }
            public object Result { get; set; }
            public RichMessage() { }

            public RichMessage(bool s)
            {
                this.Success = s;
            }
            public RichMessage(bool s, string m)
            {
                this.Success = s;
                this.Message = m;
            }
        }

        public static Barber.Models.BarberModel Model
        {
            get
            {
                return new Barber.Models.BarberModel();
            }
        }

    }

    public static class Extensions
    {
        public static void SetValuesExclude(this object entity, object target, params string[] excludes)
        {
            entity.GetType().GetProperties().Where(prop => !excludes.Contains(prop.Name)).All(prop =>
            {
                prop.SetValue(entity, target.GetValue(prop.Name), null);
                return true;
            });
        }

        public static void SetValuesInclude(this object entity, object target, params string[] includes)
        {
            entity.GetType().GetProperties().Where(prop => includes.Contains(prop.Name)).All(prop =>
            {
                prop.SetValue(entity, target.GetValue(prop.Name), null);
                return true;
            });
        }
        public static object GetValue(this object entity, string propertyName)
        {
            var property = entity.GetType().GetProperties().FirstOrDefault(prop => prop.Name == propertyName);
            if (property == null) return null;
            return property.GetValue(entity, null);
        }


        public static string eToJson(this object t)
        {
            var serializer = new JavaScriptSerializer();
            return serializer.Serialize(t);
        }
        public static string eToJson(this DataTable table)
        {
            if (table == null) return null;

            var list = (from DataRow row in table.Rows select table.Columns.Cast<DataColumn>().ToDictionary(column => column.ColumnName, column => row[column])).ToList();
            return list.eToJson();
        }
    }

}