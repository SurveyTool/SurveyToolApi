using EntityFrameworks;
using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Mingrations
{
    class Configuration : DbMigrationsConfiguration<DAL.SurveyToolDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }
        protected override void Seed(DAL.SurveyToolDbContext context)
        {
            context.QuestionTypes.AddOrUpdate(x => x.Id,
                new QuestionType() { Id = 0, NameTypeQuestion = "ShortAnswer" },
                new QuestionType() { Id = 1, NameTypeQuestion = "Paragraph" },
                new QuestionType() { Id = 2, NameTypeQuestion = "MultipleChoice" },
                new QuestionType() { Id = 3, NameTypeQuestion = "CheckBoxs" },
                new QuestionType() { Id = 4, NameTypeQuestion = "Dropdown" },
                new QuestionType() { Id = 5, NameTypeQuestion = "LinearScale" },
                new QuestionType() { Id = 6, NameTypeQuestion = "Date" }
                );
            context.Users.AddOrUpdate(x => x.Id,
                new User()
                {
                    Id = 1,
                    FullName = "Nguyễn Hoàng Nam",
                    IsAdmin = true,
                    UserName = "nhn12",
                    Password = "nhn12",
                    Email = "nhn12.hoangnam@gmail.com",
                    Phone = "0123456789",
                    Birthday = DateTime.Parse("08/19/1995"),
                    Company = "none",
                    Gender = "male"
                }
                );

        }
    }
}
