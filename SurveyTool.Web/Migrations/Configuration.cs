using EntityFrameworks;
using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SurveyTool.Web.Migrations
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
                new QuestionType() { Id = 0, NameTypeQuestion = "MultibleChoice" },
                new QuestionType() { Id = 1, NameTypeQuestion = "CheckBoxs" },
                new QuestionType() { Id = 2, NameTypeQuestion = "Date" },
                new QuestionType() { Id = 3, NameTypeQuestion = "ShortAnswers" },
                new QuestionType() { Id = 4, NameTypeQuestion = "Paragraph" },
                new QuestionType() { Id = 5, NameTypeQuestion = "LinearScale" },
                new QuestionType() { Id = 6, NameTypeQuestion = "Dropdown" }
                );
        }
    }
}
