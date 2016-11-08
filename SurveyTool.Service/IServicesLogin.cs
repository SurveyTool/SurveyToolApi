using EntityFrameworks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesSurveyTool
{
    public interface IServicesLogin
    {
        string GetFullName(string UserName);
        bool CheckLogin(String UserName,string Password);
        bool CheckExistsUserNameInRegister(string userName);
        bool CheckExistsEmailInRegister(string email);
        bool CheckInValidAccount(User user);
        bool AddAccount(User user);
    }
}
