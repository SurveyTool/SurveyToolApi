myapp.controller('DasboardController', function ($mdMedia,myShareServices, AngularServicesDasboard, $mdDialog, $scope, $compile, $rootScope, $location, $cookieStore, $http) {
  
    (function () {
        $(function () {
            return $('[data-toggle]').on('click', function () {
                var toggle;
                toggle = $(this).addClass('active').attr('data-toggle');
                $(this).siblings('[data-toggle]').removeClass('active');
                return $('.surveys').removeClass('grid list').addClass(toggle);
            });
        });

    }).call(this);
    
    checkKeepLogin = function () {
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
            myShareServices.setFullName($rootScope.globals.currentUser.username);
            myShareServices.setStatusLogin(true);
            myShareServices.prepForBroadcast();
            
        }
        else {
            myShareServices.setStatusLogin(false);
            myShareServices.prepForBroadcast();
           // $location.path("/home");

        }

    }
    checkKeepLogin();
    GetAllSurvey($cookieStore.get('globals').currentUser.username);
    $scope.waiting = true;
    function GetAllSurvey(userName)
    {
        var getData = AngularServicesDasboard.GetAllSurvey(userName);
        getData.success(function (sur) {
            $scope.waiting = false;
            $scope.biens = sur;
        });
    }
    $scope.DecodeDate=function(stringDate)
    {
        var myDate = new Date(stringDate.match(/\d+/)[0] * 1);
       
        return myDate.getDate() + "/" + (myDate.getMonth()+1)+"/"+(myDate.getYear()+1900);
    }
    $scope.deleteSurvey = function (ev, survey) {
        var Id = survey.Id;


        var confirm = $mdDialog.confirm()
              .title('Are you sure delete survey?')
              .textContent('You can not recovery a survey, if you delete survey.')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .cancel('Delete')
              .ok('Cancel');

        $mdDialog.show(confirm).then(function () {
           
        }, function () {
            /// $scope.status = 'xóa';
            var getData = AngularServicesDasboard.DeleteSurvey(Id);
            getData.success(function (msg) {
                GetAllSurvey($cookieStore.get('globals').currentUser.username);
            });
        });

    };
    $scope.createTemplate=function()
    {
        $location.path("/createsurvey");
    }
    $scope.showAdvancedInfo = function (ev, bien) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $mdDialog.show({
            controller: DialogDetailController,
            templateUrl: 'dialog1.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen,
            locals: {
                IdSurvey: bien.Id
            }
        })
    };
    $scope.preview = function (bien) {
        $scope.idsurvey = bien.Id;
        myShareServices.checkPreviewOrConductSurvey = true;
        var host = $location.host();
        var port = $location.port();
        var  urlConduct="http://"+host+":"+port+"/#/conductionsurvey?id="+bien.Id;
        window.open(urlConduct);
    }
    $scope.showAdvanced = function (ev, inforSurvey) {       
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $scope.bien = inforSurvey;
        $mdDialog.show({
            controller: DialogResultController ,
            templateUrl: 'dialog1.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen,
            locals: {
                scopes: $scope
            }
        })
        .then(function (answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function () {
            $scope.status = 'You cancelled the dialog.';
        });



        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
        
    };
    $scope.editSurvey=function(bien)
    {
        myShareServices.checkEditOrNewSurvey = true;
        myShareServices.setIdSurveyEdit(bien.IdSurvey);
        $scope.idSurveyEdit = bien.Id;

        var host = $location.host();
        var port = $location.port();
        var urlConduct = "http://" + host + ":" + port + "/#/editsurvey?id=" + bien.Id;
        window.open(urlConduct);
    }
    $scope.dialogAddMember=function(ev, surveyChoice)
    {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $scope.bien = "02";
        $mdDialog.show({
            controller: AddMemberController,
            templateUrl: 'addMember.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen,
            locals: {
                scopes: $scope
            }
        })
        .then(function (answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function () {
            $scope.status = 'You cancelled the dialog.';
        });



        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    }

});
function DialogResultController(AngularServicesGetDataServey, $scope, $mdDialog, scopes, AngularServicesDasboard) {
    $scope.linkResultSurvey = "resultsurvey?id=" + scopes.bien.Id;
    var dataAnswerJson = AngularServicesDasboard.GetResultAnswer(scopes.bien.Id);
    $scope.listAnswerObj = [];
    $scope.contentAnswerRows = [];
    var ObjDictionnaryTypeQuestion;
    $scope.numberRow = [];
    $scope.numberColumn = [];
    var listQuestionTypeJSON = AngularServicesGetDataServey.GetListQuestionType();// get list type question
    listQuestionTypeJSON.then(function (result) {
        $scope.ObjDictionnaryTypeQuestion = JSON.parse(result.data);
    });
    dataAnswerJson.success(function (result) {
        for (var i = 0; i < result.length; i++) {
            var tempAnswerObj = JSON.parse(result[i]);
            $scope.listAnswerObj.push(tempAnswerObj);
        }
        for (var i = 0; i < $scope.listAnswerObj[0].length; i++) { 
            if ($scope.listAnswerObj[0][i].Contents.length > 10) {
                $scope.listAnswerObj[0][i].TitleQuestion = $scope.listAnswerObj[0][i].Contents.slice(0, 10);
                $scope.listAnswerObj[0][i].TitleQuestion += "...";
                $scope.listAnswerObj[0][i].reduceString = true;
            }
            else {
                $scope.listAnswerObj[0][i].TitleQuestion = $scope.listAnswerObj[0][i].Contents;
                $scope.listAnswerObj[0][i].reduceString = false;
            }
        }
        var tempTitle = {};
        tempTitle.Contents = "STT";
        tempTitle.QuestionTypeId = 1;
        $scope.listAnswerObj[0].unshift(tempTitle);
        var listSTT = [];

        for (var i = 0; i < $scope.listAnswerObj[1].length; i++) {
            var tempSTT = {};
            tempSTT.AnswerText = i + 1;

            listSTT.push(tempSTT);
        }
        $scope.listAnswerObj.splice(1, 0, listSTT);
        $scope.numberColumn.push(0);
        for (var i = 0; i < $scope.listAnswerObj[1].length; i++) {
            var tempAnswer = [];
            $scope.numberRow.push(i);
            for (var j = 1; j < $scope.listAnswerObj.length; j++) {
                if (i == 0) {
                    $scope.numberColumn.push(j);
                }
                var bientam;

                switch (ConvertIdToNameQuestionType($scope.ObjDictionnaryTypeQuestion, $scope.listAnswerObj[0][j - 1].QuestionTypeId)) {
                    case "LinearScale":
                        if ($scope.listAnswerObj[j][i].AnswerNumber == null) {
                            bientam = $scope.listAnswerObj[j][i].AnswerNumber;
                        }
                        else {
                            bientam = $scope.listAnswerObj[j][i].AnswerNumber + ". Note:" + $scope.listAnswerObj[j][i].AnswerText;
                        }
                        break;
                    case "Date":
                        var tempDate = new Date($scope.listAnswerObj[j][i].AnswerDate);
                        bientam = tempDate.getDate() + "-" + (tempDate.getMonth() + 1) + "-" + (tempDate.getYear() + 1900);
                        break;
                    default:

                        bientam = $scope.listAnswerObj[j][i].AnswerText;
                        break;


                }
                tempAnswer.push(bientam);

            }
            $scope.contentAnswerRows.push(tempAnswer);
        }

        $("#projectSpreadsheet").ready(function () {
            $scope.dataTableExcel = $("#projectSpreadsheet").tableExport({
                headings: true,                     // (Boolean), display table headings (th/td elements) in the <thead> 
                footers: true,                      // (Boolean), display table footers (th/td elements) in the <tfoot> 
                formats: ["xls","txt"],     // (String[]), filetype(s) for the export 
                fileName: "id",                     // (id, String), filename for the downloaded file 
                bootstrap: true,                    // (Boolean), style buttons using bootstrap 
                position: "top",                 // (top, bottom), position of the caption element relative to table 
                ignoreRows: null,                   // (Number, Number[]), row indices to exclude from the exported file 
                ignoreCols: null,                   // (Number, Number[]), column indices to exclude from the exported file 
                ignoreCSS: ".tableexport-ignore"    // (selector, selector[]), selector(s) to exclude from the exported file 
            });
        });



    });
    
    $scope.titleSurvey = scopes.bien.Title;
    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
    $scope.refeshResult = function () {
        var listAnswerObj = [];
        var numberRow = [];
        var numberColumn = [];
        var contentAnswerRows = [];
        dataAnswerJson = AngularServicesDasboard.GetResultAnswer(scopes.bien.Id);
        dataAnswerJson.success(function (result) {
            for (var i = 0; i < result.length; i++) {
                var tempAnswerObj = JSON.parse(result[i]);
                listAnswerObj.push(tempAnswerObj);
            }
            var tempTitle = {};
            tempTitle.Contents = "STT";
            tempTitle.QuestionTypeId = 1;
            listAnswerObj[0].unshift(tempTitle);
            var listSTT = [];

            for (var i = 0; i < listAnswerObj[1].length; i++) {
                var tempSTT = {};
                tempSTT.AnswerText = i + 1;

                listSTT.push(tempSTT);
            }
            listAnswerObj.splice(1, 0, listSTT);
            //numberColumn.push(0);
            for (var i = 0; i < listAnswerObj[1].length; i++) {
                var tempAnswer = [];
                numberRow.push(i);
                for (var j = 1; j < listAnswerObj.length; j++) {
                    if (i == 0) {
                        numberColumn.push(j - 1);
                    }
                    var bientam;
                    switch (ConvertIdToNameQuestionType($scope.ObjDictionnaryTypeQuestion, listAnswerObj[0][j - 1].QuestionTypeId)) {
                        case "LinearScale":
                            if (listAnswerObj[j][i].AnswerNumber == null) {
                                bientam = listAnswerObj[j][i].AnswerNumber;
                            }
                            else {
                                bientam = listAnswerObj[j][i].AnswerNumber + ". Note:" + listAnswerObj[j][i].AnswerText;
                            }
                            break;
                        case "Date":
                            var tempDate = new Date(listAnswerObj[j][i].AnswerDate);
                            bientam = tempDate.getDate() + "-" + (tempDate.getMonth() + 1) + "-" + (tempDate.getYear() + 1900);
                            break;
                        default:

                            bientam = listAnswerObj[j][i].AnswerText;
                            break;
                    }
                    tempAnswer.push(bientam);
                }
                contentAnswerRows.push(tempAnswer);

            }
            $scope.listAnswerObj = listAnswerObj;
            $scope.numberRow = numberRow;
            $scope.numberColumn = numberColumn;
            $scope.contentAnswerRows = contentAnswerRows;
            $scope.numberRecord = $scope.numberRow.length;
            //$("#projectSpreadsheet").tableExport.reset();
        });

    }
    $scope.sortItem = function (titleItem, check,idColor) {
        var index = getIndexArrayObj(titleItem, $scope.listAnswerObj);
        $scope.checkTypeSort = check;
        sortControl($scope, index);
        if ($scope.checkTypeSort == true) {
            for (var i = 1; i < $scope.listAnswerObj[0].length; i++) {
                document.getElementById("icon1" + $scope.listAnswerObj[0][i].$id).style.color = "#fff";
                document.getElementById("icon2" + $scope.listAnswerObj[0][i].$id).style.color = "#fff";
            }
            document.getElementById("icon2" + idColor).style.color = "#fff";
            $scope.checkTypeSort = false;
            document.getElementById("icon1" + idColor).style.color = "#999";

        }
        else {
            for (var i = 1; i < $scope.listAnswerObj[0].length; i++) {
                document.getElementById("icon1" + $scope.listAnswerObj[0][i].$id).style.color = "#fff";
                document.getElementById("icon2" + $scope.listAnswerObj[0][i].$id).style.color = "#fff";
            }
            document.getElementById("icon1" + idColor).style.color = "#fff";
            $scope.checkTypeSort = true;
            document.getElementById("icon2" + idColor).style.color = "#999";
        }

    }
    


}
function ConvertIdToNameQuestionType(ObjDictionnaryTypeQuestion, idType)
{
    for(var i=0;i<ObjDictionnaryTypeQuestion.length;i++)
    {
        if(ObjDictionnaryTypeQuestion[i].Id==idType)
        {
            return ObjDictionnaryTypeQuestion[i].NameTypeQuestion;
        }
    }
    return null;

}
function DialogDetailController($scope, $mdDialog, AngularServicesDasboard, IdSurvey) {
    var dataJson = AngularServicesDasboard.GetDataSurveyInfo(IdSurvey);
    dataJson.success(function (result) {
        $scope.infoSurveyjson = JSON.parse(result);
        var dateS = new Date($scope.infoSurveyjson.DateStart);
        $scope.dateStart = dateS.getDate() + "/" + (dateS.getMonth() + 1) + "/" + (dateS.getYear() + 1900);
        var dateD = new Date($scope.infoSurveyjson.Deadline);
        $scope.dateDeadline = dateD.getDate() + "/" + (dateD.getMonth() + 1) + "/" + (dateD.getYear() + 1900);
    });
    var numberQuestionJson = AngularServicesDasboard.GetNumberQuestion(IdSurvey);
    numberQuestionJson.success(function (result) {
        $scope.numberQuestion = result;
    })
    var numberSectionJson = AngularServicesDasboard.GetNumberSection(IdSurvey);
    numberSectionJson.success(function (result) {
        $scope.numberSection = result;
    })
    $scope.idsurvey = IdSurvey;
    var id = $scope.idsurvey;


    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
    $scope.objInfo = {
        numberPage: "1",
        numberQuestion: "10",
        answer: "20"
    };

}
function AddMemberController($q, $timeout, scopes)
{

}