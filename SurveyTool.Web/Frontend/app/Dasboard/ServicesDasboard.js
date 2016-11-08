
myapp.service("AngularServicesDasboard", function ($http) {
    this.GetAllSurvey = function (userName) {
        return $http({
            method: "get",
            url: "managesurvey/getallsurvey",
            params: {
                UserName: userName
            }
        }).success(function (sur) {
            return sur.data;
        });
    }
    this.DeleteSurvey=function(Id)
    {
        return $http({
            method: "post",
            url: "managesurvey/deletesurvey",
            params: {
                IdSurvey: Id
            }
        }).success(function (result) {
            return result.data;
        });
    }
    this.GetResultAnswer=function(IdSurvey)
    {
        return $http({
            method: "get",
            url: "loadingdatasurvey/GetListAnswerBySurvey",
            params: {
                IdSurvey: IdSurvey
            }

        }).success(function (result) {
            return result.data;
        });
    }
    this.GetListQuestionType = function () {
        var data = $http({
            method: "get",
            url: "loadingdatasurvey/GetListQuestionType",
            params: {
            }
        })
        return data.success(function (result) {
            return result;
        });
    }
    this.GetDataSurveyInfo = function (IdSurvey) {
        return $http({
            method: "get",
            url: "loadingdatasurvey/GetInformationSurvey",
            params: {
                IdSurvey: IdSurvey
            }
        })
        return data.success(function (result) {
            return result;
        });
    }
    this.GetNumberQuestion = function (IdSurvey) {
        return $http({
            method: "get",
            url: "loadingdatasurvey/GetNumberQuestion",
            params: {
                IdSurvey: IdSurvey
            }
        })
        return data.success(function (result) {
            return result;
        });
    }
    this.GetNumberSection = function (IdSurvey) {
        return $http({
            method: "get",
            url: "loadingdatasurvey/GetNumberSection",
            params: {
                IdSurvey: IdSurvey
            }
        })
        return data.success(function (result) {
            return result;
        });
    }

});