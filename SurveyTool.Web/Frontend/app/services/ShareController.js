myapp.factory("myShareServices", function ($rootScope) {
    var sharedService = {};
    sharedService.showStatusLogin = false;
    sharedService.checkEditOrNewSurvey = false;
    sharedService.setIdSurveyEdit = function(msg)
    {
        this.IdSurveyEdit = msg;
    }
    sharedService.broadcast = function () {
        $rootScope.$broadcast("handleBroadcast");
    }
    sharedService.checkPreviewOrConductSurvey = false;
    sharedService.setIdSurveyPreview = function(msg)
    {
        this.IdSurveyEdit = msg;
    }
    sharedService.setFullName=function(msg)
    {
        this.FullName = msg;
    }
    sharedService.setStatusLogin=function(status)
    {
        this.showStatusLogin = status;
    }
    sharedService.prepForBroadcast = function () {
        this.broadcastItem();
    }
    sharedService.broadcastItem = function () {
        $rootScope.$broadcast("handleBroadcast");
    }
   
    sharedService.setEventLogin=function(ev)
    {
        sharedService.eventDialog = ev;
    }
    sharedService.NotifyShowDialogLogin = function () {
        $rootScope.$broadcast("ShowDialogLogin");
    }
    return sharedService;
});