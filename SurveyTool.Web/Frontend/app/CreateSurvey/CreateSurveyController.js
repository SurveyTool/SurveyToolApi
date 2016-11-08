myapp.controller("CreateSurveyController", function (AngularServicesGetDataServey,AngularServicesGetDataServey, myShareServices, $mdMedia, $cookieStore, $http, $location, $timeout, $scope, $mdDialog, $mdConstant, $compile, $rootScope, AngularCreateSurvey) {
    $scope.choiceAddAnother = "Yes";
    checkKeepLogin = function () {
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
            myShareServices.setFullName($rootScope.globals.currentUser.username);
            myShareServices.setStatusLogin(true);
            myShareServices.prepForBroadcast();
            $scope.username = $cookieStore.get('globals').currentUser.username;

        }
        else {
            myShareServices.setStatusLogin(false);
            myShareServices.prepForBroadcast();
            $location.path("/home");

        }

    }
   
    checkKeepLogin();
    $scope.listHTMLPage = [];
    $scope.listPage = [];//list page
    $scope.idPage = 0;
    $scope.indexSelectPage = 0;
    ShowIconNewItem(this);
    $scope.moveWidget = function (drag) {
        console.log(drag);
    }
    $scope.newPage = function () {
       
        NewPage($scope, $compile, $rootScope, $("#pageContainer"), $mdDialog);
    }
    $scope.OnlyExcute = 1;


    $scope.newQuestion = function () {
        NewQuestion($scope.listPage[$scope.indexSelectPage], $compile, $rootScope, $("#page" + $scope.indexSelectPage), $mdDialog);
    }
    this.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];
    this.tags = [];
    var semicolon = 186;
    this.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, semicolon];
    this.contacts = ['test@example.com'];
    var dataSurvey;//all data of survey
    
    $(document).ready(function () {
        if ($location.path() == "/createsurvey") {
            NewPage($scope, $compile, $rootScope, $("#pageContainer"), $mdDialog);
           
        }
        if ($location.path() == "/editsurvey") {///////edit survey
            EditSurvey(AngularServicesGetDataServey, AngularServicesGetDataServey, myShareServices, $mdMedia, $cookieStore, $http, $location, $timeout, $scope, $mdDialog, $mdConstant, $compile, $rootScope, AngularCreateSurvey);
            
        }
    });
    $scope.test=function()
    {
        for (var i = $scope.listHTMLPage.length-1; i >=0; i--)
        {
            $("#pageContainer").append($scope.listHTMLPage[i].innerHTML);
        }
    }
    //////
    $scope.choiceAdd = [{
        label: "Yes",
        value:""
    },
    {
        label: "No",
        value:""
    }]
    $scope.clickTab1=function()
    {
        $scope.showTabNewItem = true;
    }
    $scope.clickTab2 = function () {
        $scope.showTabNewItem = false;
    }
    $scope.saveSurvey = function (ev) {
        //check correct data
        if ($scope.title == undefined || $scope.title == "") {
            alert("Title is empty");
            return;
        }
        if ($scope.datestart == undefined || $scope.deadline == undefined) {
            alert("The duration of survey is empty.");
            return;
        }
        var dateS = $scope.datestart;
        var dateD = $scope.deadline;
        var dateSy = new Date();
        if (dateCompare(dateS, dateD) == 1) {
            alert("Date start must prior deadline.");
            return;
        }
        if (dateCompare(dateSy, dateS) == 1) {
            alert("Date start must greater or equal date of system.");
            return;
        }
        if ($scope.listPage.length == 0) {
            alert("Page is emtpy!");
            return;
        }
        for (var i = 0; i < $scope.listPage.length; i++) {
            if ($scope.listPage[i].listQuestionScope.length == 0) {
                alert("Question in page " + i + 1 + " is empty");
                return;
            }
            for (var j = 0; j < $scope.listPage[i].listQuestionScope.length; j++) {
                if ($scope.listPage[i].listQuestionScope[j].questionname == undefined || $scope.listPage[i].listQuestionScope[j].questionname == "") {
                    alert("Question Title is empty");
                    return;
                }
                if ($scope.listPage[i].listQuestionScope[j].type == undefined) {
                    alert("Question Type is empty");
                    return;
                }

                for (k = 0; k < $scope.listPage[i].listQuestionScope[j].listOptionQuestion.length; k++) {
                    var checkType = $scope.listPage[i].listQuestionScope[j].type;
                    switch (checkType) {
                        case "MultipleChoice":

                            if ($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].option == undefined ||
                                $scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].option == "") {
                                alert("Option is empty");
                                return;
                            }
                            for (h = k + 1; h < $scope.listPage[i].listQuestionScope[j].listOptionQuestion.length; h++) {
                                if ($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].option == $scope.listPage[i].listQuestionScope[j].listOptionQuestion[h].option) {
                                    $scope.listPage[i].listQuestionScope[j].listOptionQuestion[k + 1].showError = true;
                                    return;
                                }
                            }
                            break;
                        case "CheckBoxs":
                            if ($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].option == undefined) {
                                alert("Option is empty");
                                return;
                            }
                            for (h = k + 1; h < $scope.listPage[i].listQuestionScope[j].listOptionQuestion.length; h++) {
                                if ($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].option == $scope.listPage[i].listQuestionScope[j].listOptionQuestion[h].option) {
                                    $scope.listPage[i].listQuestionScope[j].listOptionQuestion[k + 1].showError = true;
                                    return;
                                }
                            }
                            break;
                        case "Dropdown":
                            if ($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].option == undefined) {
                                alert("Option is empty");
                                return;
                            }
                            for (h = k + 1; h < $scope.listPage[i].listQuestionScope[j].listOptionQuestion.length; h++) {
                                if ($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].option == $scope.listPage[i].listQuestionScope[j].listOptionQuestion[h].option) {
                                    $scope.listPage[i].listQuestionScope[j].listOptionQuestion[k + 1].showError = true;
                                    return;
                                }
                            }
                            break;
                        case "Date":

                            break;
                        case "LinearScale":
                            if ($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].min == undefined || $scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].max == undefined || $scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].choiceLinear == undefined) {
                                alert("Option is empty");
                                return;
                            }
                            if (parseInt($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].choiceLinear) < parseInt($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].min)) {
                                alert("Value choice must larger min.");

                                return;
                            }
                            if (parseInt($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].choiceLinear) > parseInt($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].max)) {
                                alert("Value choice must lesser value max.");
                                return;
                            }
                            if (parseInt($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].min) > parseInt($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].max)) {
                                alert("Value min must lesser value max.");
                                return;
                            }
                            break;

                    }

                }

            }
        }
        //////////////////////////////////////
        //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        //$mdDialog.show({
        //    controller: DialogDetailControllerCreateSurvey,
        //    templateUrl: 'dialog1.tmpl.html',
        //    parent: angular.element(document.body),
        //    targetEvent: ev,
        //    clickOutsideToClose: true,
        //    fullscreen: useFullScreen,
        //    locals: {
        //        scopeMain: $scope
        //    }
        //})
        ///////////////////////////////////////
        var temp = $scope.datestart;

        dataSurvey = { //ads title
            Title: $scope.title
        };
        if ($scope.choiceAddAnother == "Yes") {
            $scope.allowAddAnother = true;
        }
        else if ($scope.choiceAddAnother == "No") {
            $scope.allowAddAnother = false;
        }
        else {
            $scope.allowAddAnother = true;
        }
        if ($scope.numberPerson == undefined || $scope.numberPerson == "") {
            $scope.numberPerson = -1;
        }

        dataSurvey = { //add discription, datestart, deadline and mail-share
            title: dataSurvey.Title,
            discription: $scope.discription,
            datestart: covertDateToString($scope.datestart),
            deadline: covertDateToString($scope.deadline),
            allowAddAnother: $scope.allowAddAnother,
            numberPerson: $scope.numberPerson,
            mailShare: $scope.ctrl.tags,
            username: $scope.username,
            messageEndSurvey: $scope.endsurvey
        }
        var infoListPage = [];// contain information of each page
        for (var i = 0; i < $scope.listPage.length; i++) {
            infoListPage.push($scope.listPage[i].listQuestionScope.length)
        }
        dataSurvey.infoListPage = infoListPage;
        var listQuestion = [];
        for (var i = 0; i < $scope.listPage.length; i++) {
            for (var j = 0; j < $scope.listPage[i].listQuestionScope.length; j++) {
                var tempQuestion;
                tempQuestion = {
                    titleQuestion: $scope.listPage[i].listQuestionScope[j].questionname,
                    typeQuestion: $scope.listPage[i].listQuestionScope[j].type,
                    required: $scope.listPage[i].listQuestionScope[j].requiredQuestion

                };
                var listOptionQuestion = [];
                var checkTypeQuestion = $scope.listPage[i].listQuestionScope[j].type;
                switch (checkTypeQuestion) {
                    case "ShortAnswer":

                        break;
                    case "Paragraph":

                        break;
                    case "MultipleChoice":
                        for (var k = 0; k < $scope.listPage[i].listQuestionScope[j].listOptionQuestion.length; k++) {
                            listOptionQuestion.push($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].option);
                        }
                        tempQuestion.listQuestionOption = listOptionQuestion;
                        break;
                    case "CheckBoxs":

                        for (var k = 0; k < $scope.listPage[i].listQuestionScope[j].listOptionQuestion.length; k++) {
                            listOptionQuestion.push($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].option);
                        }

                        tempQuestion.listQuestionOption = listOptionQuestion;
                        break;
                    case "Dropdown":

                        for (var k = 0; k < $scope.listPage[i].listQuestionScope[j].listOptionQuestion.length; k++) {
                            listOptionQuestion.push($scope.listPage[i].listQuestionScope[j].listOptionQuestion[k].option);

                        }
                        tempQuestion.listQuestionOption = listOptionQuestion;
                        break;
                    case "LinearScale":
                        tempQuestion.min = $scope.listPage[i].listQuestionScope[j].listOptionQuestion[0].min;
                        tempQuestion.max = $scope.listPage[i].listQuestionScope[j].listOptionQuestion[0].max;
                        tempQuestion.choiceLinear = $scope.listPage[i].listQuestionScope[j].listOptionQuestion[0].choiceLinear;
                        break;
                    case "Date":

                        break;
                }


                listQuestion.push(tempQuestion);

            }
        }
        dataSurvey.listQuestion = listQuestion;
        AngularCreateSurvey.sendDataSurvey(dataSurvey).success(function (result) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: DialogSucessController,
                templateUrl: 'dialogSuccess',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    IdSurvey: result
                }

            })
        });

    }
});
function EditSurvey(AngularServicesGetDataServey, AngularServicesGetDataServey, myShareServices, $mdMedia, $cookieStore, $http, $location, $timeout, $scope, $mdDialog, $mdConstant, $compile, $rootScope, AngularCreateSurvey)
{
    var ObjDictionnaryTypeQuestion;
    var listQuestionTypeJSON = AngularServicesGetDataServey.GetListQuestionType();// get list type question
    listQuestionTypeJSON.then(function (result) {
        ObjDictionnaryTypeQuestion = JSON.parse(result.data);
    });
    var IdSurvey = $location.search().id;
    var bienjson = AngularServicesGetDataServey.GetDataSurvey(IdSurvey);//get data survey
    bienjson.then(function (result) {
        var ObjDataSurvey = JSON.parse(result.data);
        $scope.title = ObjDataSurvey.Title;
        $scope.discription = ObjDataSurvey.Discription;
        $scope.endsurvey = ObjDataSurvey.EndPage;
        $scope.datestart = new Date(ObjDataSurvey.DateStart);
        $scope.deadline = new Date(ObjDataSurvey.DateStart);
    });
    var listSectionJson = AngularServicesGetDataServey.GetListSectionBySurvey(IdSurvey);// get list section of survey
    var ObjListSection;
    listSectionJson.then(function (result) {
        ObjListSection = JSON.parse(result.data);

        ///////////////////////////Add Question
        for (var i = 0; i < ObjListSection.length; i++) {
            var IdPageTemp = i;
            NewPage($scope, $compile, $rootScope, $("#pageContainer"), $mdDialog);
        }
        var listQuestionJson = AngularServicesGetDataServey.GetListQuestionBySurvey(IdSurvey);
        listQuestionJson.success(function (result) {

            var ObjListQuestion = [];
            for (var i = 0; i < result.length; i++) {
                ObjListQuestion.push(JSON.parse(result[i]));
            }
            ///////////////
            for (var i = 0; i < ObjListSection.length; i++) {
                for (var j = 0; j < ObjListQuestion.length; j++) {
                    if (ObjListQuestion[j].SectionId == ObjListSection[i].Id) {
                        NewQuestion($scope.listPage[i], $compile, $rootScope, $("#page" + i), $mdDialog);

                    }
                }
            }
            for (var i = 0, dem = 0; i < ObjListSection.length; i++) {
                for (var j = 0; j < $scope.listPage[i].listQuestionScope.length; j++) {
                    $scope.listPage[i].listQuestionScope[j].questionname = ObjListQuestion[dem].Contents;
                    $scope.listPage[i].listQuestionScope[j].requiredQuestion = ObjListQuestion[dem].IsRequired;
                    var typeQuestion = ConvertIdToNameQuestionType(ObjDictionnaryTypeQuestion, ObjListQuestion[dem].QuestionTypeId);
                    
                    $scope.listPage[i].listQuestionScope[j].type = typeQuestion;
                    sleep(30);
                    //AddOptionByQuestion($scope.listPage[i].listQuestionScope[j], $compile, $rootScope, $("#question" + $scope.listPage[i].listQuestionScope[j].indexId + "_" + $scope.listPage[i].idPage),typeQuestion)
                    $scope.listPage[i].listQuestionScope[j].initOptionQuestionInEditSurvey(ObjListQuestion[dem].Id, AngularServicesGetDataServey);

                    dem++;
                }
            }
        });

    });
}
function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {
    }
}
///chip
myapp.controller("ChipController", function ($mdConstant) {
    this.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];
    this.tags = [];
    var semicolon = 186;
    this.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, semicolon];
    this.contacts = ['test@example.com'];
});
function NewPage(scopeMain, compileMain, rootScopeMain, pageContainer, mdDialogMain) {
    var i = 0;
    for (i = 0; i < scopeMain.listPage.length; i++) {
        scopeMain.listPage[i].allPage++;
    }
    var comiledHTML = angular.element("<div pagetemplate></div>");
    var scopePage = rootScopeMain.$new();
    var linkFun = compileMain(comiledHTML);
    var finalTemplate = linkFun(scopePage);
    pageContainer.append(finalTemplate);
    scopeMain.listHTMLPage.push(finalTemplate);
    scopePage.idPage = scopeMain.idPage;
    scopeMain.idPage++;

    scopePage.idQuestion = 0;
    scopePage.listQuestionScope = [];
    scopeMain.listPage.push(scopePage);
    scopePage.numberPage = scopeMain.listPage.length;
    scopePage.allPage = scopeMain.listPage.length;
    scopePage.addTemp = function () {

        for (var i = 0; i < scopeMain.listPage.length; i++) {
            document.getElementById("buttonPage" + scopeMain.listPage[i].idPage).style.background = '#00695C';


            document.getElementById("borderLinePage" + scopeMain.listPage[i].idPage).style.borderTop = "solid 1px #d7d7d7";

        }
        document.getElementById("buttonPage" + scopePage.idPage).style.background = '#000000';


        document.getElementById("borderLinePage" + scopePage.idPage).style.borderTop = "solid 1px #acacac";
        scopeMain.indexSelectPage = scopePage.idPage;

    }
    scopePage.removePage = function () {
        finalTemplate.remove();

        for (var i = 0; i < scopeMain.listPage.length; i++)// find index item delete
        {
            if (scopeMain.listPage[i].idPage == scopePage.idPage) {

                scopeMain.listPage.splice(i, 1); //delete data in list page
                scopePage.$destroy();
                break;
            }
        }

        //update index page
        var i = 0;
        for (i = 0; i < scopeMain.listPage.length; i++) {
            scopeMain.listPage[i].numberPage = i + 1;
            scopeMain.listPage[i].allPage = scopeMain.listPage.length;
        }

    }
   

}
function ShowIconNewItem(bien) {
    bien.topDirections = ['left', 'up'];
    bien.bottomDirections = ['down', 'right'];

    bien.isOpen = false;

    bien.availableModes = ['md-fling', 'md-scale'];
    bien.selectedMode = 'md-fling';

    bien.availableDirections = ['up', 'down', 'left', 'right'];
    bien.selectedDirection = 'up';
}
function NewQuestion(scopePage, compileMain, rootScopeMain, questionContaier, mdDialogMain) {
    
    var comiledHTML = angular.element("<div serveytemplate></div>");
    var scopeQuestion = rootScopeMain.$new();

    var linkFun = compileMain(comiledHTML);
    var finalTemplate = linkFun(scopeQuestion);
    questionContaier.append(finalTemplate);
    scopePage.listQuestionScope.push(scopeQuestion);
    scopeQuestion.indexId = scopePage.idQuestion;
    scopeQuestion.inNumberPage = scopePage.idPage;
    scopeQuestion.listOptionQuestion = [];
    scopePage.idQuestion++;
    scopeQuestion.idOption = 0;
    scopeQuestion.requiredQuestion = false;

    //get type question
    var newScope = scopeQuestion;
    var compile = compileMain;
    var rootScope = rootScopeMain;
    scopeQuestion.initOptionQuestionInEditSurvey = function (IdQuestion, AngularServicesGetDataServey)
    {
        var checkTypeQuestion = newScope.type;
        switch (checkTypeQuestion) {
            case "ShortAnswer":
                $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage).ready(function () {
                    NewOptionShortAnswerQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));

                });
                break;
            case "Paragraph":
                $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage).ready(function () {
                    NewOptionParagraphQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));

                });
                break;
            case "MultipleChoice":
                $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage).ready(function () {
                    var listOptionChoiceJSON = AngularServicesGetDataServey.GetListOptionChoiceByQuestion(IdQuestion);
                    listOptionChoiceJSON.then(function (result) {
                        var listObjOptionChoice = JSON.parse(result.data);

                        for (var i = 0; i < listObjOptionChoice.length; i++) {
                            NewOptionMultipleQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));
                            newScope.listOptionQuestion[i].option = listObjOptionChoice[i].Contents;
                        }
                        newScope.visibleButtonAddOption = true;

                    });
                });
                break;
            case "CheckBoxs":
                $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage).ready(function () {
                    var listOptionChoiceJSON = AngularServicesGetDataServey.GetListOptionChoiceByQuestion(IdQuestion);
                    listOptionChoiceJSON.then(function (result) {
                        var listObjOptionChoice = JSON.parse(result.data);

                        for (var i = 0; i < listObjOptionChoice.length; i++) {
                            NewOptionCheckboxsQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));
                            newScope.listOptionQuestion[i].option = listObjOptionChoice[i].Contents;
                        }
                        newScope.visibleButtonAddOption = true;


                    });
                });
                break;
            case "Dropdown":
                $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage).ready(function () {
                    var listOptionChoiceJSON = AngularServicesGetDataServey.GetListOptionChoiceByQuestion(IdQuestion);
                    listOptionChoiceJSON.then(function (result) {
                        var listObjOptionChoice = JSON.parse(result.data);

                        for (var i = 0; i < listObjOptionChoice.length; i++) {
                            NewOptionDropdownQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));
                            newScope.listOptionQuestion[i].option = listObjOptionChoice[i].Contents;
                        }
                        newScope.visibleButtonAddOption = true;


                    });
                });
                break;
            case "LinearScale":
                var listOptionChoiceJSON = AngularServicesGetDataServey.GetListOptionChoiceByQuestion(IdQuestion);
                listOptionChoiceJSON.then(function (result) {
                    var listObjOptionChoice = JSON.parse(result.data);
                   
                    var min = listObjOptionChoice[0].MinimumOflinearScale;
                    var max = listObjOptionChoice[0].MaximumOflinearScale;
                    
                    var valueChoice = listObjOptionChoice[0].ChoiceValueOflinearScale;
                    $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage).ready(function () {
                        NewOptionLinearScaleQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));
                        newScope.listOptionQuestion[0].min = min;
                        newScope.listOptionQuestion[0].max = max;
                        newScope.listOptionQuestion[0].choiceLinear = valueChoice;
                    });

                });
                
                break;
            case "Date":

                $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage).ready(function () {
                    NewOptionDateQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));

                });
                break;
        }
       
        
    }
    scopeQuestion.addItem = function () {
        var checkTypeQuestion = newScope.type;
        switch (checkTypeQuestion) {
            case "MultipleChoice":
                $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage).ready(function () {
                    NewOptionMultipleQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));
                });
                break;
            case "CheckBoxs":
                NewOptionCheckboxsQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));

                break;
            case "Dropdown":
                NewOptionDropdownQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));
                break;

        }

    }
    scopeQuestion.changeTypeQuestion = function () {
        var checkTypeQuestion = newScope.type;
        switch (checkTypeQuestion) {
            case "ShortAnswer":
                for (i = 0; i < newScope.listOptionQuestion.length; i++) {
                    newScope.listOptionQuestion[i].elementOption.remove();
                    newScope.listOptionQuestion[i].$destroy();

                }
                newScope.listOptionQuestion = [];
                newScope.visibleButtonAddOption = false;
                $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage).ready(function () {
                    NewOptionShortAnswerQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));

                });
                break;
            case "Paragraph":
                for (i = 0; i < newScope.listOptionQuestion.length; i++) {
                    newScope.listOptionQuestion[i].elementOption.remove();
                    newScope.listOptionQuestion[i].$destroy();
                }
                newScope.listOptionQuestion = [];
                newScope.visibleButtonAddOption = false;
                NewOptionParagraphQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));
                break;
            case "MultipleChoice":
                for (i = 0; i < newScope.listOptionQuestion.length; i++) {
                    newScope.listOptionQuestion[i].elementOption.remove();
                    newScope.listOptionQuestion[i].$destroy();

                }
                newScope.listOptionQuestion = [];
                newScope.visibleButtonAddOption = true;
                NewOptionMultipleQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));
                break;
            case "CheckBoxs":
                for (i = 0; i < newScope.listOptionQuestion.length; i++) {
                    newScope.listOptionQuestion[i].elementOption.remove();
                    newScope.listOptionQuestion[i].$destroy();

                }
                newScope.listOptionQuestion = [];
                newScope.visibleButtonAddOption = true;
                NewOptionCheckboxsQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));
                break;
            case "Dropdown":
                for (i = 0; i < newScope.listOptionQuestion.length; i++) {
                    newScope.listOptionQuestion[i].elementOption.remove();
                    newScope.listOptionQuestion[i].$destroy();

                }
                newScope.listOptionQuestion = [];
                newScope.visibleButtonAddOption = true;
                NewOptionDropdownQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));
                break;
            case "LinearScale":
                for (i = 0; i < newScope.listOptionQuestion.length; i++) {
                    newScope.listOptionQuestion[i].elementOption.remove();
                    newScope.listOptionQuestion[i].$destroy();

                }
                newScope.listOptionQuestion = [];
                newScope.visibleButtonAddOption = false;
                NewOptionLinearScaleQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));

                break;
            case "Date":
                for (i = 0; i < newScope.listOptionQuestion.length; i++) {
                    newScope.listOptionQuestion[i].elementOption.remove();
                    newScope.listOptionQuestion[i].$destroy();

                }
                newScope.listOptionQuestion = [];
                newScope.visibleButtonAddOption = false;
                NewOptionDateQuestion(newScope, compileMain, rootScopeMain, $("#question" + scopeQuestion.indexId + "_" + scopePage.idPage));
                break;
        }
    }

    ///

    scopeQuestion.showConfirm = function (ev) {
        finalTemplate.remove();
       for (var i = 0; i < scopePage.listQuestionScope.length; i++) {
                if (scopePage.listQuestionScope[i].indexId == scopeQuestion.indexId) {
                    scopePage.listQuestionScope.splice(i, 1);
                    scopeQuestion.$destroy();
                    break;
                }
            }
    };

}
function NewOptionMultipleQuestion(scope, compile, rootScope, bien) {
    var comiledHTML = angular.element("<div multiplechoice></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    newScope.elementOption = finalTemplate;
    newScope.showError = false;
    scope.listOptionQuestion.push(newScope);
    newScope.idOption = scope.idOption;
    scope.idOption++;
    newScope.removeOption = function () {
        finalTemplate.remove();
        for (var i = 0; i < scope.listOptionQuestion.length; i++)// find index item delete
        {
            if (scope.listOptionQuestion[i].idOption == newScope.idOption) {

                scope.listOptionQuestion.splice(i, 1); //delete data in list option
                newScope.$destroy();
                break;
            }
        }

    }

};
function NewOptionCheckboxsQuestion(scope, compile, rootScope, bien) {
    var comiledHTML = angular.element("<div checkboxs></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    newScope.elementOption = finalTemplate;
    scope.listOptionQuestion.push(newScope);
    newScope.removeOption = function () {
        finalTemplate.remove();
        newScope.$destroy();
    }
};
function NewOptionDateQuestion(scope, compile, rootScope, bien) {
    var comiledHTML = angular.element("<div datetemplate></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    newScope.elementOption = finalTemplate;
    scope.listOptionQuestion.push(newScope);

};
function NewOptionDropdownQuestion(scope, compile, rootScope, bien) {
    var comiledHTML = angular.element("<div dropdown></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    newScope.elementOption = finalTemplate;
    scope.listOptionQuestion.push(newScope);
    newScope.removeOption = function () {
        finalTemplate.remove();
        newScope.$destroy();
    }

};
function NewOptionLinearScaleQuestion(scope, compile, rootScope, bien) {
    var comiledHTML = angular.element("<div linearscale></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    newScope.elementOption = finalTemplate;
    scope.listOptionQuestion.push(newScope);

};
function NewOptionParagraphQuestion(scope, compile, rootScope, bien) {
    var comiledHTML = angular.element("<div paragraph></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    newScope.elementOption = finalTemplate;
    scope.listOptionQuestion.push(newScope);

};
function NewOptionShortAnswerQuestion(scope, compile, rootScope, bien) {
    var comiledHTML = angular.element("<div shortanswer></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    newScope.elementOption = finalTemplate;
    scope.listOptionQuestion.push(newScope);


};
myapp.directive('multiplechoice', function () {
    return {
        templateUrl: '/Frontend/App/createsurvey/QuestionTemplate/MultipleChoiceTemplate.html',
    };
});
myapp.directive('checkboxs', function () {
    return {
        templateUrl: '/Frontend/App/createsurvey/QuestionTemplate/CheckboxsTemplate.html',
    };
});
myapp.directive('datetemplate', function () {
    return {
        templateUrl: '/Frontend/App/createsurvey/QuestionTemplate/DateTemplate.html',
    };
});
myapp.directive('dropdown', function () {
    return {
        templateUrl: '/Frontend/App/createsurvey/QuestionTemplate/DropdownTemplate.html',
    };
});
myapp.directive('linearscale', function () {
    return {
        templateUrl: '/Frontend/App/createsurvey/QuestionTemplate/LinearScaleTemplate.html',
    };
});
myapp.directive('paragraph', function () {
    return {
        templateUrl: '/Frontend/App/createsurvey/QuestionTemplate/ParagraphTemplate.html',
    };
});
myapp.directive('shortanswer', function () {
    return {
        templateUrl: '/Frontend/App/createsurvey/QuestionTemplate/ShortAnswerTemplate.html',
    };
});
myapp.directive('serveytemplate', function () {
    return {
        templateUrl: '/Frontend/App/createsurvey/Templatesurveyitem.html',

    };
});
myapp.directive('pagetemplate', function () {
    return {
        templateUrl: '/Frontend/App/createsurvey/TemplatePage.html',

    };
});
function covertDateToString(dateSrc) {
    var day = dateSrc.getDate();
    var month = dateSrc.getMonth() + 1;
    var year = dateSrc.getYear() + 1900;
    var date = month + "/" + day + "/" + year;
    return date;
}

function dateCompare(date1, date2) {
    if (date1.getYear() > date2.getYear()) {
        return 1;
    }
    if (date1.getYear() < date2.getYear()) {
        return -1;
    }
    if (date1.getMonth() > date2.getMonth()) {
        return 1;
    }
    if (date1.getMonth() < date2.getMonth()) {
        return -1;
    }
    if (date1.getDate() > date2.getDate()) {
        return 1;
    }
    if (date1.getDate() < date2.getDate()) {
        return -1;
    }
    return 0;
};
///function dialog
function DialogDetailControllerCreateSurvey($location, AngularCreateSurvey, $scope, $mdDialog, $mdConstant, scopeMain, $mdMedia) {


    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.hide();
    };
    
   
    $scope.send = function (ev) {
       
        $mdDialog.hide();

    };
}
function DialogSucessController($scope, $mdDialog, $mdConstant, IdSurvey,$location)
{
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.ok = function () {
        $mdDialog.hide();
    }
    $scope.cancel = function () {
        $mdDialog.hide();
    };
    var host = $location.host();
    var port = $location.port();
    host +=":"+port+"/#/conductionsurvey?id=" + IdSurvey;
    $scope.linkSurvey = host;
}