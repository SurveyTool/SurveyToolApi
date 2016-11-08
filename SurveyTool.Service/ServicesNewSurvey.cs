using DAL;
using EntityFrameworks;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesSurveyTool
{
    public class ServicesNewSurvey : IServicesNewSurvey
    {
        SurveyToolDbContext db;
        public ServicesNewSurvey(SurveyToolDbContext _db)
        {
            this.db = _db;
        }
        public int GetIdUser(string username)
        {
            foreach (var user in db.Users)
            {
                if (user.UserName.Equals(username) == true)
                {
                    return user.Id;
                }
            }
            return -1;
        }
        public bool AddSurvey(Survey survey)
        {
            try
            {
                db.Surveys.Add(survey);
                db.SaveChanges();
                return true;
            }catch(Exception e)
            {
                return false;
            }
            
        }
        public bool AddSection(Section section)
        {
           
                db.Sections.Add(section);
                db.SaveChanges();
                return true;
           
        }
        public bool AddQuestion(Question question)
        {
            
                db.Questions.Add(question);
                db.SaveChanges();
                return true;
            
        }
        public bool AddOptionChoice(OptionChoice option)
        {
            try
            {
                db.OptionChoices.Add(option);
                db.SaveChanges();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
        public bool AddQuestionOption(QuestionOption questionOption)
        {
            try
            {
                db.QuestionOptions.Add(questionOption);
                db.SaveChanges();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
        public int GetIdQuestionType(string nameQuestionType)
        {
            List<QuestionType> questionTypes = db.QuestionTypes.ToList();
            foreach(var questionType in questionTypes)
            {
                if(nameQuestionType.Equals(questionType.NameTypeQuestion)==true)
                {
                    return questionType.Id;
                }
            }
            return -1;
        }
        public Survey ConvertJsonToObject(JObject obj)
        {
            try
            {
                Survey survey = new Survey();
                survey.Title = (String)obj["title"];
                survey.DateStart = (DateTime)obj["datestart"];
                survey.Deadline = (DateTime)obj["deadline"];
                survey.Discription = (String)obj["discription"];
                survey.UserId = GetIdUser((string)obj["username"]);
                survey.AllowAddAnother = (bool)obj["allowAddAnother"];
                survey.LimitNumber = (int)obj["numberPerson"];

                survey.EndPage = (string)obj["messageEndSurvey"];
                return survey;
            }
            catch(Exception ex)
            {
                return null;
            }
            
        }
        
    }
}
