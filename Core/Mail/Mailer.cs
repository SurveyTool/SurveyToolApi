using System.Collections;
using System.Web;
using log4net;
using System.IO;
using System;
using Core.Runtime.Session;
using System.Net.Mail;
using RazorEngine;
using RazorEngine.Templating;
using System.Configuration;
using Core.Runtime.Log;
using System.Text;
using System.Net.Mime;
using System.Collections.Generic;
namespace Core.Mail
{
    public class Mailer : IMailer
    {
        public void SendEmail(MailAddress from, MailAddress[] to, MailAddress[] cc, MailAddress[] bcc,
            string subject, string mailTemplatePath, DynamicViewBag data, List<LinkedResource> LinkedResources = null)
        {
            string testMode = ConfigurationManager.AppSettings["TestMode"];
            string smtpServer = ConfigurationManager.AppSettings["SMTPServer"];
            int smtpPort = Int32.Parse(ConfigurationManager.AppSettings["SMTPPort"]);
            string smtpUsername = ConfigurationManager.AppSettings["SMTPUsername"];
            string smtpPassword = ConfigurationManager.AppSettings["SMTPPassword"];


            SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort);

            if (string.IsNullOrEmpty(smtpUsername))
                smtpClient.UseDefaultCredentials = false;
            else
            {
                smtpClient.Credentials = new System.Net.NetworkCredential(smtpUsername, smtpPassword);
                smtpClient.UseDefaultCredentials = true;
            }

            MailMessage mailToSend = new MailMessage();

            string template = File.ReadAllText(mailTemplatePath);

            string body = Engine.Razor.RunCompile(template, mailTemplatePath, null, data);

            mailToSend.From = from;

            // to insure no email sent out during its development period
            if (!string.IsNullOrEmpty(testMode) && testMode.Equals("off"))
            {
                // send mail to real email addresses
                foreach (var address in to)
                {
                    mailToSend.To.Add(address);
                }

                if (cc != null && cc.Length > 0)
                {
                    foreach (var address in cc)
                    {
                        mailToSend.CC.Add(address);
                    }
                }

                if (bcc != null && bcc.Length > 0)
                {
                    foreach (var address in bcc)
                    {
                        mailToSend.Bcc.Add(address);
                    }
                }
            }
            else
            {
                // send to preconfigured email addresses for testing only
                foreach (var address in ConfigurationManager.AppSettings["TestEmailAddress"]
                    .Split(new char[] { ',' }))
                {
                    if (!string.IsNullOrEmpty(address))
                    {
                        mailToSend.To.Add(new MailAddress(address));
                    }
                }
            }

            // set subject and encoding
            AlternateView viewHTML = AlternateView.CreateAlternateViewFromString(body, new System.Net.Mime.ContentType("text/html"));

            //Add LinkedResource such as :Image ...
            if (LinkedResources != null)
            {
                foreach (LinkedResource linkedResource in LinkedResources)
                {
                    viewHTML.LinkedResources.Add(linkedResource);
                }
            }

            //
            mailToSend.AlternateViews.Add(viewHTML);
            mailToSend.Subject = subject;
            mailToSend.SubjectEncoding = System.Text.Encoding.UTF8;
            mailToSend.Body = body;
            mailToSend.BodyEncoding = System.Text.Encoding.UTF8;
            mailToSend.IsBodyHtml = true;

            smtpClient.Send(mailToSend);

            string receivers = null;
            foreach (var receiver in to)
            {
                receivers += receiver.Address + ";";
            }

            SfLogger.Instance.LogInfo("Sender:" + from.Address + " .To:" + receivers + " .Subject:" + subject);
        }

        public void SendMeetingRequest(MailAddress from, MailAddress[] to, MailAddress[] optional, string subject,
            string mailTemplatePath, DynamicViewBag data, DateTime startTime, DateTime endTime, string location, int reminderMinute)
        {
            string testMode = ConfigurationManager.AppSettings["TestMode"];
            string smtpServer = ConfigurationManager.AppSettings["SMTPServer"];
            int smtpPort = Int32.Parse(ConfigurationManager.AppSettings["SMTPPort"]);
            string smtpUsername = ConfigurationManager.AppSettings["SMTPUsername"];
            string smtpPassword = ConfigurationManager.AppSettings["SMTPPassword"];


            SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort);

            if (string.IsNullOrEmpty(smtpUsername))
                smtpClient.UseDefaultCredentials = false;
            else
            {
                smtpClient.Credentials = new System.Net.NetworkCredential(smtpUsername, smtpPassword);
                smtpClient.UseDefaultCredentials = true;
            }

            MailMessage mailToSend = new MailMessage();

            string template = File.ReadAllText(mailTemplatePath);

            string body = Engine.Razor.RunCompile(template, mailTemplatePath, null, data);

            // to insure no email sent out during its development period
            if (!string.IsNullOrEmpty(testMode) && testMode.Equals("off"))
            {
                // send mail to real email addresses
                foreach (MailAddress address in to)
                {
                    mailToSend.To.Add(address);
                }

                if (optional != null && optional.Length > 0)
                {
                    foreach (var address in optional)
                    {
                        mailToSend.CC.Add(address);
                    }
                }
            }
            else
            {
                // send to preconfigured email addresses for testing only
                foreach (var address in ConfigurationManager.AppSettings["TestEmailAddress"]
                    .Split(new char[] { ',' }))
                {
                    if (!string.IsNullOrEmpty(address))
                    {
                        mailToSend.To.Add(new MailAddress(address));
                    }
                }
            }

            StringBuilder bodyCalendar = new StringBuilder();
            System.Net.Mime.ContentType typeCalendar = new System.Net.Mime.ContentType("text/calendar");
            string calendarDateFormat = "yyyyMMddTHHmmssZ";

            //  Add parameters to the calendar header
            typeCalendar.Parameters.Add("Content-class", "urn:content-classes:calendarmessage");
            typeCalendar.Parameters.Add("Content-Type", "text/calendar");
            typeCalendar.Parameters.Add("method", "REQUEST");
            typeCalendar.Parameters.Add("name", "meeting.ics");
            typeCalendar.Parameters.Add("Content-Transfer-Encoding", "8bit");

            bodyCalendar.AppendLine("BEGIN:VCALENDAR");
            bodyCalendar.AppendLine("PRODID:-//Microsoft Corporation//Outlook 10.0 MIMEDIR//EN");
            bodyCalendar.AppendLine("VERSION:2.0");
            bodyCalendar.AppendLine("METHOD:REQUEST");
            bodyCalendar.AppendLine("BEGIN:VEVENT");
            bodyCalendar.AppendFormat("DTSTART:{0}\r\n", startTime.ToUniversalTime().ToString(calendarDateFormat));
            bodyCalendar.AppendFormat("DTEND:{0}\r\n", endTime.ToUniversalTime().ToString(calendarDateFormat));
            bodyCalendar.AppendFormat("DTSTAMP:{0}\r\n", DateTime.Now.ToUniversalTime().ToString(calendarDateFormat));
            bodyCalendar.AppendFormat("TRANSP:OPAQUE\r\n");
            bodyCalendar.AppendFormat("SEQUENCE:0\r\n");
            bodyCalendar.AppendFormat("SUMMARY:{0}\r\n", subject);
            bodyCalendar.AppendLine(string.Format("ORGANIZER:MAILTO:{0}", from));
            bodyCalendar.AppendLine(string.Format("UID:{0}", Guid.NewGuid()));
            bodyCalendar.AppendLine(string.Format("LOCATION: {0}", location));
            bodyCalendar.AppendLine("PRIORITY:5");
            bodyCalendar.AppendLine("X-MICROSOFT-CDO-IMPORTANCE:1");
            bodyCalendar.AppendLine("CLASS:PUBLIC");
            bodyCalendar.AppendLine("BEGIN:VALARM");
            bodyCalendar.AppendLine("TRIGGER:-PT" + reminderMinute + "M");
            bodyCalendar.AppendLine("ACTION:DISPLAY");
            bodyCalendar.AppendLine("DESCRIPTION:Reminder");
            bodyCalendar.AppendLine("END:VALARM");
            bodyCalendar.AppendLine("END:VEVENT");
            bodyCalendar.AppendLine("END:VCALENDAR");

            AlternateView calendar = AlternateView.CreateAlternateViewFromString(bodyCalendar.ToString(), typeCalendar);
            mailToSend.AlternateViews.Add(calendar);
            //Create the Body in HTML format
            AlternateView viewHTML = AlternateView.CreateAlternateViewFromString(body, new System.Net.Mime.ContentType("text/html"));
            mailToSend.AlternateViews.Add(viewHTML);


            mailToSend.From = from;
            // set subject and encoding
            mailToSend.Subject = subject;
            mailToSend.SubjectEncoding = System.Text.Encoding.UTF8;
            mailToSend.Body = body;
            mailToSend.BodyEncoding = System.Text.Encoding.UTF8;
            mailToSend.IsBodyHtml = true;

            smtpClient.Send(mailToSend);

            string receivers = null;
            foreach (var receiver in to)
            {
                receivers += receiver.Address + ";";
            }

            SfLogger.Instance.LogInfo("Sender:" + from.Address + " .To:" + receivers + " .Subject:" + subject);
        }
    }
}