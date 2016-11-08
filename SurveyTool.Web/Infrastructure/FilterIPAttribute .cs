using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

using System.Web.Mvc;

namespace SurveyTool.Web.Infrastructure
{
    public class FilterIPAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            //Get users IP Address 
            string ipAddress = HttpContext.Current.Request.UserHostAddress;

            if (!IsIpAddressValid(ipAddress.Trim()))
            {
                //Send back a HTTP Status code of 403 Forbidden  
                filterContext.Result = new HttpStatusCodeResult(403);
            }

            base.OnActionExecuting(filterContext);
        }

        /// <summary> 
        /// Compares an IP address to list of valid IP addresses attempting to 
        /// find a match 
        /// </summary> 
        /// <param name="ipAddress">String representation of a valid IP Address</param> 
        /// <returns></returns> 
        public static bool IsIpAddressValid(string ipAddress)
        {
            //Split the users IP address into it's 4 octets (Assumes IPv4) 
            string[] incomingOctets = ipAddress.Trim().Split(new char[] { '.' });

            //Get the valid IP addresses from the web.config 
            string addresses =
              Convert.ToString(ConfigurationManager.AppSettings["AuthorizedIPs"]);

            //Store each valid IP address in a string array 
            string[] validIpAddresses = addresses.Trim().Split(new char[] { ',' });

            //Iterate through each valid IP address 
            foreach (var validIpAddress in validIpAddresses)
            {
                //Return true if valid IP address matches the users 
                if (validIpAddress.Trim() == ipAddress)
                {
                    return true;
                }

                //Split the valid IP address into it's 4 octets 
                string[] validOctets = validIpAddress.Trim().Split(new char[] { '.' });

                bool matches = true;

                //Iterate through each octet 
                for (int index = 0; index < validOctets.Length; index++)
                {
                    //Skip if octet is an asterisk indicating an entire 
                    //subnet range is valid 
                    if (validOctets[index] != "*")
                    {
                        if (validOctets[index] != incomingOctets[index])
                        {
                            matches = false;
                            break; //Break out of loop 
                        }
                    }
                }

                if (matches)
                {
                    return true;
                }
            }

            //Found no matches 
            return false;
        }
    } 
}