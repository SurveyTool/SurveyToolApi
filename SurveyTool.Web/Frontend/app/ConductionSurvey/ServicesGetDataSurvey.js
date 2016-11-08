myapp.service("AngularServicesGetDataServey", function ($http) {
    this.GetDataSurvey = function (IdSurvey) {
        var data=$http({
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
    this.GetListSectionBySurvey = function (IdSurvey) {
        var data = $http({
            method: "get",
            url: "loadingdatasurvey/GetListSectionBySurvey",
            params: {
                IdSurvey: IdSurvey
            }
        })
        return data.success(function (result) {
            return result;
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
    this.GetListQuestionBySection = function (IdSection) {
        var data = $http({
            method: "get",
            url: "loadingdatasurvey/GetListQuestionBySection",
            params:
            {
                IdSection: IdSection
            }
        })
        return data.success(function (result) {
            return result;
        });
    }
    this.GetListQuestionBySurvey=function(IdSurvey)
    {
        
        var data = $http({
            method: "get",
            url: "loadingdatasurvey/GetListQuestionByIdSurvey",
            params:
            {
                IdSurvey: IdSurvey
            }
        })
        return data.success(function (result) {
            return result;
        });
    }
    this.GetListOptionChoiceByQuestion = function (IdQuestion) {
        var data = $http({
            method: "get",
            url: "loadingdatasurvey/GetListOptionChoiceByQuestion",
            params:
            {
                IdQuestion: IdQuestion
            }
        })
        return data.success(function (result) {
            return result;
        });
    }
    this.PostDataInput = function (dataInput) {
        var data = $http({
            method: "post",
            url: "informationuserinput/addrecord",
            params:
            {
                dataJson: dataInput
            }
        })
        return data.success(function (result) {
            return result;
        });
    }
    this.CheckValidDateSurvey = function (IdSurvey) {
        var data = $http({
            method: "post",
            url: "checkvalidinfo/CheckValidDateSurvey",
            params:
            {
                IdSurvey: IdSurvey
            }
        })
        return data.success(function (result) {
            return result;
        });
    }
    this.CheckNumberPerson = function (IdSurvey) {
        var data = $http({
            method: "post",
            url: "checkvalidinfo/CheckNumberPerSon",
            params:
            {
                IdSurvey: IdSurvey
            }
        })
        return data.success(function (result) {
            return result;
        });
    }

});
