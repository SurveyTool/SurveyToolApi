myapp.service("AngularServicesGetDataServey", function ($http, configApi) {
    this.GetDataSurvey = function (IdSurvey) {
        var data=$http({
            method: "get",
            url: configApi.hostApi+"loadingdatasurvey/GetInformationSurvey",
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
            url: configApi.hostApi+"loadingdatasurvey/GetListSectionBySurvey",
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
            url: configApi.hostApi+"loadingdatasurvey/GetListQuestionType",
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
            url: configApi.hostApi+"loadingdatasurvey/GetListQuestionBySection",
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
            url: configApi.hostApi+"loadingdatasurvey/GetListQuestionByIdSurvey",
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
            url: configApi.hostApi+"loadingdatasurvey/GetListOptionChoiceByQuestion",
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
            url: configApi.hostApi+"informationuserinput/addrecord",
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
            url: configApi.hostApi+"checkvalidinfo/CheckValidDateSurvey",
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
            url: configApi.hostApi+"checkvalidinfo/CheckNumberPerSon",
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
