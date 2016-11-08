using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EntityFrameworks;
using DAL;


namespace ServicesSurveyTool
{
    public class ServicesLogin : IServicesLogin
    {
        SurveyToolDbContext db;
        public ServicesLogin(SurveyToolDbContext _db)
        {
            this.db = _db;
        }
        public bool CheckLogin(string UserName,string Password)
        {
            List<User> user = db.Users.ToList();
            for(int i=0;i<user.Count;i++)
            {
                if(user[i].UserName.Equals(UserName)==true&&user[i].Password.Equals(Password)==true)
                {
                    return true;
                }
                
            }
            return false;
        }
        public bool CheckExistsUserNameInRegister(string userName)
        {
            var listUser = db.Users.ToList();
            foreach(User item in listUser)
            {
                if(item.UserName.Equals(userName)==true)
                {
                    return true;
                }
            }
            return false;
        }
        public bool CheckExistsEmailInRegister(string email)
        {
            var listUser = db.Users.ToList();
            foreach (User item in listUser)
            {
                if (item.Email.Equals(email) == true)
                {
                    return true;
                }
            }
            return false;
        }
        public bool CheckInValidAccount(User user)
        {
            if(CheckExistsEmailInRegister(user.Email)==true)
            {
                return false;
            }
            if (CheckExistsUserNameInRegister(user.UserName) == true)
            {
                return false;
            }
            return true;
        }
        public bool AddAccount(User user)
        {
            db.Users.Add(user);
            db.SaveChanges();
            return true;
        }

        public string GetFullName(string UserName)
        {
            List<User> listUser = db.Users.ToList();
            foreach(var item in listUser)
            {
                if(item.UserName.Equals(UserName)==true)
                {
                    return item.FullName;
                }
            }
            return null;

        }
    }
}
