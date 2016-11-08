myapp.service("AngularCreateSurvey", function ($http) {
    this.sendDataSurvey = function (dataSurvey) {
        var response = $http({
            method: "post",
            url: "NewSurvey/createsurvey",
            params: {
                dataSurvey: dataSurvey
            }
        
        });
        return response.success(function (result) {
            return result;
        });
    }
    this.getIdNewSurvey = function (dataSurvey) {
        var response = $http({
            method: "get",
            url: "loadingdatasurvey/GetIdNewSurvey",
        });
        return response;
    }
});
