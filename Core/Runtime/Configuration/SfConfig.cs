using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml;

namespace Core.Runtime.Configuration
{
    public class SfConfig : ISfConfig
    {
        protected Hashtable settings;

        /// <summary>
        /// Singleton instance.
        /// </summary>
        public static SfConfig Instance { get { return SingletonInstance; } }
        private static readonly SfConfig SingletonInstance = new SfConfig();

        private SfConfig()
        {
            
        }
        
        public void Set(object key, object value)
        {
            settings[key] = value;
        }

        public object Get(object key)
        {
            if (settings.ContainsKey(key))
                return settings[key];
            else
                return null;
        }

        public void LoadConfig()
        {
            Hashtable _ret = new Hashtable();
            string path = HttpContext.Current.Server.MapPath("~/Web.config");
            if (File.Exists(path))
            {
                StreamReader reader = new StreamReader
                (
                    new FileStream(
                        path,
                        FileMode.Open,
                        FileAccess.Read,
                        FileShare.Read)
                );
                XmlDocument doc = new XmlDocument();
                string xmlIn = reader.ReadToEnd();
                reader.Close();
                doc.LoadXml(xmlIn);
                XmlNode configurationNode = doc.GetElementsByTagName("appSettings")[0];
                foreach (XmlNode node in configurationNode.ChildNodes)
                    if (node.Name.Equals("add"))
                        _ret.Add
                        (
                            node.Attributes["key"].Value,
                            node.Attributes["value"].Value
                        );
            }
            settings = _ret;
        }
    }
}
