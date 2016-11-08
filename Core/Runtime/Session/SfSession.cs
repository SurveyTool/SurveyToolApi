using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Core.Runtime.Session
{
    public class SfSession : ISfSession
    {
        protected string userId;
        protected Hashtable data;

        /// <summary>
        /// Singleton instance.
        /// </summary>
        public static SfSession Instance 
        {
            get
            {
                IDictionary items = HttpContext.Current.Items;
                if (!items.Contains("TheInstance"))
                {
                    items["TheInstance"] = new SfSession();
                }
                return items["TheInstance"] as SfSession; ;

                //if (HttpContext.Current != null)
                //{
                //    IDictionary items = HttpContext.Current.Items;
                //    if (!items.Contains("TheInstance"))
                //    {
                //        items["TheInstance"] = new SfSession();
                //    }
                //    return items["TheInstance"] as SfSession;
                //}
                //else { return new SfSession(); }
            }
        }

        private SfSession()
        {
            userId = "unspecified";
            data = new Hashtable();
        }

        public string UserId
        {
            get { return userId; }
            set { userId = value; }
        }

        public void Set(object key, object value)
        {
            data[key] = value;
        }

        public object Get(object key)
        {
            if (data.ContainsKey(key))
                return data[key];
            else
                return null;
        }
    }
}
