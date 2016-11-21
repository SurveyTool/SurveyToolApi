myapp.service("AngularCreateSurvey", function ($http, configApi) {
    this.sendDataSurvey = function (dataSurvey) {
        var response = $http({
            method: "post",
            url: configApi.hostApi+ "NewSurvey/createsurvey",
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
            url: configApi.hostApi+ "loadingdatasurvey/GetIdNewSurvey",
        });
        return response;
    }
});
