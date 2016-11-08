using RazorEngine.Templating;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Core.Mail
{
    public interface IMailer
    {
        void SendEmail(MailAddress from, MailAddress[] to, MailAddress[] cc, MailAddress[] bcc,
            string subject, string mailTemplatePath, DynamicViewBag data, List<LinkedResource> LinkedResources =null);
        void SendMeetingRequest(MailAddress from, MailAddress[] to, MailAddress[] optional, string subject, string mailTemplatePath, 
            DynamicViewBag data, DateTime startTime, DateTime endTime, string location, int reminderMinute);
    }
}
