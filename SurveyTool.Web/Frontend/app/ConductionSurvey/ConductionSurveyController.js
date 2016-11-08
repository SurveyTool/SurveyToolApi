myapp.controller("ConductionSurveyController", function (myShareServices,AngularServicesGetDataServey, $window, $scope, $location, $compile, $rootScope) {
    $scope.determinateValue = 0;
    $scope.discriptionSurvey = "Khảo sát học sinh";
    $scope.titleSurvey = "Student Survey";
    $scope.listQuestion = [];
    $scope.listSectionAcitve = [];
    ////////////////////////////////////////examble
    var pathAddress = $location.search();
    var IdSurvey = pathAddress.id;
    if (IdSurvey == null || IdSurvey == undefined) {
        window.location.href = "/404.html";
        return;
    }
    $scope.statusSurvey = true;
    $scope.errorSurvey = false;
    var infoCheck = AngularServicesGetDataServey.CheckValidDateSurvey(IdSurvey);
    infoCheck.success(function (result) {
        if(result.state==false)
        {
            $scope.statusSurvey = false;
            $scope.messageError = result.message;
            $scope.errorSurvey = true;
            return;
        }
       
    });
    //////
    var infoCheckNumberPerson = AngularServicesGetDataServey.CheckNumberPerson(IdSurvey);
    infoCheckNumberPerson.success(function (result) {
        if (result.state == false) {
            $scope.statusSurvey = false;
            $scope.messageError = result.message;
            $scope.errorSurvey = true;
            return;
        }
       
    });
    var ObjDataSurvey;
    var ObjListSection;
    var ObjDictionnaryTypeQuestion;
    $scope.indexPageSelect = 0;
    
    
    var listQuestionTypeJSON = AngularServicesGetDataServey.GetListQuestionType();// get list type question
    listQuestionTypeJSON.then(function (result) {
        ObjDictionnaryTypeQuestion = JSON.parse(result.data);
    });
    
    var bienjson = AngularServicesGetDataServey.GetDataSurvey(IdSurvey);//get data survey
    bienjson.then(function (result) {
        ObjDataSurvey = JSON.parse(result.data);
        $scope.titleSurvey = ObjDataSurvey.Title;
        $scope.discriptionSurvey = ObjDataSurvey.Discription;
        $scope.showAddAnother = ObjDataSurvey.AllowAddAnother;
        
        
    });

    var listSectionJson = AngularServicesGetDataServey.GetListSectionBySurvey(IdSurvey);// get list section of survey
    listSectionJson.then(function (result) {
        ObjListSection = JSON.parse(result.data);
        $scope.determinateValue = ($scope.indexPageSelect + 1 / ObjListSection.length) * 100;
        if (ObjListSection.length == 1) //check how many page, show or hide buton
        {
            $scope.buttonOncePage = true;
            $scope.buttonManyPage = false;
        }
        else {
            $scope.buttonOncePage = false;
            $scope.buttonManyPage = true;
            $scope.buttonNextPage = true;
           
        }
        ///////////////////////////Add Question
        $(document).ready(function () {
            var listQUestionJSON = AngularServicesGetDataServey.GetListQuestionBySection(ObjListSection[0].Id);
            listQUestionJSON.then(function (result) {
                var listObjQuestion = JSON.parse(result.data);
                $scope.listSectionAcitve.push($scope.indexPageSelect);
                for (var i = 0; i < listObjQuestion.length; i++)
                {
                    var typeQuestion;
                    for (var j = 0; j < ObjDictionnaryTypeQuestion.length; j++) {
                       
                        if (ObjDictionnaryTypeQuestion[j].Id == listObjQuestion[i].QuestionTypeId) {
                            typeQuestion = ObjDictionnaryTypeQuestion[j].NameTypeQuestion;
                        }
                    }
                    var data = {
                        questionId:listObjQuestion[i].Id,
                        questionName: listObjQuestion[i].Contents,
                        questionNumber: listObjQuestion[i].NumberQuestion + 1,
                        IsRequired: listObjQuestion[i].IsRequired
                    };
                    controlAddQuestion($scope, $compile, $rootScope, $("#middle-wizard"), data, typeQuestion, AngularServicesGetDataServey);

                    
                }
            });
        });

    });
    $scope.clickBack=function() // click back page, check show or hide button
    {
        if($scope.indexPageSelect>0)
        {
            $scope.indexPageSelect--;
            $scope.buttonNextPage = true;//allway show button
            $scope.buttonSubmit = false;
            $scope.determinateValue = (($scope.indexPageSelect + 1) / ObjListSection.length) * 100;
        }
        if($scope.indexPageSelect>0&&$scope.indexPageSelect<ObjListSection.length-1)
        {
            document.getElementById("buttonNextPage").disabled = false;
            document.getElementById("buttonBackPage").disabled = false;

        }
        else {
            if($scope.indexPageSelect==0)
            {
                document.getElementById("buttonNextPage").disabled = false;
                document.getElementById("buttonBackPage").disabled = true;
            }
            else {
                document.getElementById("buttonNextPage").disabled = true;
                document.getElementById("buttonBackPage").disabled = false;
            }
        }
        for (var j = 0; j < $scope.listQuestion.length; j++) {
            if ($scope.listQuestion[j].numberPage == $scope.indexPageSelect) {
                $scope.listQuestion[j].VisibleQuestion = true;
            }
            else {
                $scope.listQuestion[j].VisibleQuestion = false;
            }
        }
        


    
        
    }
    $scope.clickNext = function ()// click back next, check show or hide button
    {
        if (CheckValidChoice($scope) == false)
        {
            return;
        }
        if ($scope.indexPageSelect < (ObjListSection.length-1)) {
            $scope.indexPageSelect++;
            $scope.buttonNextPage = true;//allway show button
            $scope.buttonSubmit = false;
            $scope.determinateValue = (($scope.indexPageSelect+1)/ ObjListSection.length) * 100;
        }
        if ($scope.indexPageSelect > 0 && $scope.indexPageSelect < ObjListSection.length - 1) {
            document.getElementById("buttonNextPage").disabled = false;
            document.getElementById("buttonBackPage").disabled = false;
        }
        else {
            if ($scope.indexPageSelect == 0) {
                document.getElementById("buttonNextPage").disabled = false;
                document.getElementById("buttonBackPage").disabled = true;
            }
            else {
                
                document.getElementById("buttonNextPage").disabled = true;
                document.getElementById("buttonBackPage").disabled = false;
                $scope.buttonNextPage = false;
                $scope.buttonSubmit = true;
                if (myShareServices.checkPreviewOrConductSurvey == true) {
                    document.getElementById("buttonSubmit").disabled = true;
                }
                else {
                    document.getElementById("buttonSubmit").disabled = false;
                }
            }
        }

        /////////////////////
        for (var i = 0; i < $scope.listSectionAcitve.length; i++) {
            if ($scope.listSectionAcitve[i] == $scope.indexPageSelect)// check page is actived
            {
                for (var j = 0; j < $scope.listQuestion.length; j++) {
                    if ($scope.listQuestion[j].numberPage == $scope.indexPageSelect) {
                        $scope.listQuestion[j].VisibleQuestion = true;
                    }
                    else {
                        $scope.listQuestion[j].VisibleQuestion = false;
                    }
                }
                return;
            }
            
        }

        var IdSection; // case: page not actived
        for (var i = 0; i < ObjListSection.length; i++) {

            if ($scope.indexPageSelect == ObjListSection[i].NumberSection)//get Id section with indexPageSelect
            {
                IdSection = ObjListSection[i].Id;
            }
        }
        for (var i = 0; i < $scope.listQuestion.length; i++)
        {
            $scope.listQuestion[i].VisibleQuestion = false;
        }
        $(document).ready(function () {
            var listQUestionJSON = AngularServicesGetDataServey.GetListQuestionBySection(IdSection);
            listQUestionJSON.then(function (result) {
                var listObjQuestion = JSON.parse(result.data);
                $scope.listSectionAcitve.push($scope.indexPageSelect);
                for (var i = 0; i < listObjQuestion.length; i++) {
                    var typeQuestion;
                    for (var j = 0; j < ObjDictionnaryTypeQuestion.length; j++) {

                        if (ObjDictionnaryTypeQuestion[j].Id == listObjQuestion[i].QuestionTypeId) {
                            typeQuestion = ObjDictionnaryTypeQuestion[j].NameTypeQuestion;
                        }
                    }
                    var data = {
                        questionId: listObjQuestion[i].Id,
                        questionName: listObjQuestion[i].Contents,
                        questionNumber: listObjQuestion[i].NumberQuestion + 1,
                        IsRequired: listObjQuestion[i].IsRequired
                    };
                    controlAddQuestion($scope, $compile, $rootScope, $("#middle-wizard"), data, typeQuestion, AngularServicesGetDataServey);


                }
            });
        });
    }
    $scope.submitData=function()
    {
        if (CheckValidChoice($scope) == false) {
            return;
        }
        var bien = $scope.listQuestion[0].dataChoice;
        var data = {
            message: ObjDataSurvey.EndPage
        }
        for (var i = 0; i < $scope.listQuestion.length; i++)
        {
            $scope.listQuestion[i].VisibleQuestion = false;
        }
        $scope.buttonOncePage = false;
        $scope.buttonManyPage = false;
        var listDataInputUser = [];
        ///////////////////get data
        for (var i = 0; i < $scope.listQuestion.length; i++)
        {
            var tempRecord = {};
            tempRecord.IdQuestion = $scope.listQuestion[i].data.questionId;
            tempRecord.typeQuestion = $scope.listQuestion[i].typeQuestion;
            switch ($scope.listQuestion[i].typeQuestion) {
                case "ShortAnswer":
                    tempRecord.dataText = $scope.listQuestion[i].dataChoice;
                    break;
                case "Paragraph":
                    tempRecord.dataText = $scope.listQuestion[i].dataChoice;
                    break;
                case "MultipleChoice":
                    tempRecord.dataText = $scope.listQuestion[i].dataChoice;
                    break;
                case "CheckBoxs":
                    tempRecord.dataText = $scope.listQuestion[i].dataChoice;
                    break;
                case "Dropdown":
                    tempRecord.dataText = $scope.listQuestion[i].dataChoice;
                    break;
                case "LinearScale":
                    tempRecord.dataText = $scope.listQuestion[i].dataChoice;
                    if ($scope.listQuestion[i].showComment == true)
                    {
                        tempRecord.dataComment = $scope.listQuestion[i].commentdata;
                    }
                    break;
                case "Date":
                    tempRecord.dataText = $scope.listQuestion[i].dataChoice;
                    break;
            }
            listDataInputUser.push(tempRecord);
            
        }
        var dataInput = {};
        dataInput.listAnswer = listDataInputUser;
        AngularServicesGetDataServey.PostDataInput(dataInput);
        //////////////////////////
        AddEndPage($scope, $compile, $rootScope, $("#middle-wizard"), data, $window);
    }
    
});
function controlAddQuestion(scope, compile, rootScope, bien, data, typeQuestion, AngularServicesGetDataServey)
{
    switch(typeQuestion)
    {
        case "ShortAnswer":
            AddOptionShortAnswerQuestion(scope, compile, rootScope, bien, data);
            break;
        case "Paragraph":
            AddOptionParagraphQuestion(scope, compile, rootScope, bien, data);
            break;
        case "MultipleChoice":
            var listOptionChoiceJSON = AngularServicesGetDataServey.GetListOptionChoiceByQuestion(data.questionId);
            listOptionChoiceJSON.then(function (result) {
                var listObjOptionChoice = JSON.parse(result.data);
                var dataOption=[];
                for(var i=0;i<listObjOptionChoice.length;i++)
                {
                    var tempOptionChoice = {};
                    tempOptionChoice.label = listObjOptionChoice[i].Contents;
                    dataOption.push(tempOptionChoice);
                }
                data.dataOption = dataOption;
            });
            AddOptionMultipleQuestion(scope, compile, rootScope, bien, data);
            break;
        case "CheckBoxs":
            var listOptionChoiceJSON = AngularServicesGetDataServey.GetListOptionChoiceByQuestion(data.questionId);
            listOptionChoiceJSON.then(function (result) {
                var listObjOptionChoice = JSON.parse(result.data);
                var dataOption = [];
                for (var i = 0; i < listObjOptionChoice.length; i++) {
                    var tempOptionChoice = {};
                    tempOptionChoice.label = listObjOptionChoice[i].Contents;
                    dataOption.push(tempOptionChoice);
                }
                data.dataOption = dataOption;
            });
            AddOptionCheckBoxsQuestion(scope, compile, rootScope, bien, data)
            break;
        case "Dropdown":
            var listOptionChoiceJSON = AngularServicesGetDataServey.GetListOptionChoiceByQuestion(data.questionId);
            listOptionChoiceJSON.then(function (result) {
                var listObjOptionChoice = JSON.parse(result.data);
                var dataOption = [];
                for (var i = 0; i < listObjOptionChoice.length; i++) {
                    var tempOptionChoice = {};
                    tempOptionChoice.label = listObjOptionChoice[i].Contents;
                    dataOption.push(tempOptionChoice);
                }
                data.dataOption = dataOption;
                
            });
            AddOptionDropdownQuestion(scope, compile, rootScope, bien, data);
            break;
        case "LinearScale":
            var listOptionChoiceJSON = AngularServicesGetDataServey.GetListOptionChoiceByQuestion(data.questionId);
            listOptionChoiceJSON.then(function (result) {
                var listObjOptionChoice = JSON.parse(result.data);
                var dataOption = [];
                var min = listObjOptionChoice[0].MinimumOflinearScale;
                var max = listObjOptionChoice[0].MaximumOflinearScale;
                for (var i = min; i <= max-min+1; i++) {
                    var tempOptionChoice = {};
                    tempOptionChoice.label = i;
                    tempOptionChoice.value = i;
                    dataOption.push(tempOptionChoice);
                }
                data.dataOption = dataOption;
                data.valueChoice = listObjOptionChoice[0].ChoiceValueOflinearScale;
            });
            AddOptionLinearScaleQuestion(scope, compile, rootScope, bien, data);
            break;
        case "Date":
            AddOptionDateQuestion(scope, compile, rootScope, bien, data);
            break;
    }
}
function AddOptionMultipleQuestion(scope, compile, rootScope, bien, data) {
    var comiledHTML = angular.element("<div multiplechoicetemplate></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);//khai bao cac bien moi = cac bien truyen vao
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    scope.listQuestion.push(newScope);
    newScope.data=data;
    newScope.questionName = "";
    newScope.questionNumber = '1';
    newScope.numberPage = scope.indexPageSelect;
    newScope.VisibleQuestion = true;
    newScope.typeQuestion = "MultipleChoice";
    if(data.IsRequired==true)
    {
        newScope.Required = true;
    }
    newScope.showRequired = false;
};
function AddOptionShortAnswerQuestion(scope, compile, rootScope, bien, data) {
    var comiledHTML = angular.element("<div shortanswertemplate></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);//khai bao cac bien moi = cac bien truyen vao
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    scope.listQuestion.push(newScope);
    newScope.data = data;
    newScope.numberPage = scope.indexPageSelect;
    newScope.VisibleQuestion = true;
    newScope.typeQuestion = "ShortAnswer";
    if (data.IsRequired == true) {
        newScope.Required = true;
    }
    newScope.showRequired = false;
};
function AddOptionLinearScaleQuestion(scope, compile, rootScope, bien, data) {
    var comiledHTML = angular.element("<div linearscaletemplate></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);//khai bao cac bien moi = cac bien truyen vao
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    newScope.data = data;
    scope.listQuestion.push(newScope);
    
    newScope.choiceValueLinearScale = function (valueChoice) {
         newScope.dataChoice = valueChoice;
        if (valueChoice <= data.valueChoice) {/////temp value
            newScope.showComment = true;
        }
        else {
            newScope.showComment = false;
        }
    };
    newScope.numberPage = scope.indexPageSelect;
    newScope.VisibleQuestion = true;
    newScope.typeQuestion = "LinearScale";
    if (data.IsRequired == true) {
        newScope.Required = true;
    }
    newScope.showRequired = false;
};
function AddOptionParagraphQuestion(scope, compile, rootScope, bien, data) {
    var comiledHTML = angular.element("<div paragraphTemplate></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);//khai bao cac bien moi = cac bien truyen vao
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    scope.listQuestion.push(newScope);
    newScope.data = data;
    newScope.numberPage = scope.indexPageSelect;
    newScope.VisibleQuestion = true;
    newScope.typeQuestion = "Paragraph";
    if (data.IsRequired == true) {
        newScope.Required = true;
    }
    newScope.showRequired = false;
};
function AddOptionDateQuestion(scope, compile, rootScope, bien, data) {
    var comiledHTML = angular.element("<div datestemplate></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);//khai bao cac bien moi = cac bien truyen vao
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    scope.listQuestion.push(newScope);
    newScope.data = data;
    newScope.numberPage = scope.indexPageSelect;
    newScope.VisibleQuestion = true;
    newScope.typeQuestion = "Date";
    if (data.IsRequired == true) {
        newScope.Required = true;
    }
    newScope.showRequired = false;
};
function AddOptionCheckBoxsQuestion(scope, compile, rootScope, bien, data) {
    var comiledHTML = angular.element("<div checkboxstemplate></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);//khai bao cac bien moi = cac bien truyen vao
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    scope.listQuestion.push(newScope);
    newScope.data=data;
    newScope.selected = [];
    newScope.dataChoice=[];
    newScope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item);
        }
        newScope.dataChoice = list;
    };
    newScope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };
    newScope.numberPage = scope.indexPageSelect;
    newScope.VisibleQuestion = true;
    newScope.typeQuestion = "CheckBoxs";
    if (data.IsRequired == true) {
        newScope.Required = true;
    }
    newScope.showRequired = false;
};
function AddOptionDropdownQuestion(scope, compile, rootScope, bien, data) {
    var comiledHTML = angular.element("<div dropdowntemplate></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);//khai bao cac bien moi = cac bien truyen vao
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    scope.listQuestion.push(newScope);
    newScope.data = data;
    newScope.showRequired = false;
    newScope.numberPage = scope.indexPageSelect;
    newScope.VisibleQuestion = true;
    newScope.typeQuestion = "Dropdown";
    if (data.IsRequired == true) {
        newScope.Required = true;
    }
};
function AddEndPage(scope, compile, rootScope, bien, data,window) {
    var comiledHTML = angular.element("<div endpagetemplate></div>");
    var newScope = rootScope.$new();
    var linkFun = compile(comiledHTML);//khai bao cac bien moi = cac bien truyen vao
    var finalTemplate = linkFun(newScope);
    bien.append(finalTemplate);
    newScope.endPageMessage = data.message;
    newScope.refeshPage=function()
    {
        window.location.reload();
    }
    newScope.showAddAnother = scope.showAddAnother;
};
myapp.directive('multiplechoicetemplate', function () {
    return {
        templateUrl: '/Frontend/app/conductionsurvey/questiontemplate/MultipleChoiceTemplate.html',
    };
});
myapp.directive('linearscaletemplate', function () {
    return {
        templateUrl: '/Frontend/app/conductionsurvey/questiontemplate/LinearScaleTemplate.html',
    };
});
myapp.directive('shortanswertemplate', function () {
    return {
        templateUrl: '/Frontend/app/conductionsurvey/questiontemplate/ShortAnswerTemplate.html',
    };
});
myapp.directive('paragraphtemplate', function () {
    return {
        templateUrl: '/Frontend/app/conductionsurvey/questiontemplate/ParagraphTemplate.html',
    };
});
myapp.directive('datestemplate', function () {
    return {
        templateUrl: '/Frontend/app/conductionsurvey/questiontemplate/DateTempalte.html',
    };
});
myapp.directive('dropdowntemplate', function () {
    return {
        templateUrl: '/Frontend/app/conductionsurvey/questiontemplate/DropdownTemplate.html',
    };
});
myapp.directive('checkboxstemplate', function () {
    return {
        templateUrl: '/Frontend/app/conductionsurvey/questiontemplate/CheckBoxsTemplate.html',
    };
});
myapp.directive('templatequestion', function () {
    return {
        templateUrl: '/Frontend/app/conductionsurvey/ConductionSurvey.html',
    };
});
myapp.directive('endpagetemplate', function () {
    return {
        templateUrl: '/Frontend/app/conductionsurvey/questiontemplate/EndPage.html',
    };
});
function CheckValidChoice(scope) {
    for (var i = 0; i < scope.listQuestion.length; i++) {
        var type = scope.listQuestion[i].typeQuestion;
        switch (type) {
            case "ShortAnswer":
                if (scope.listQuestion[i].numberPage == scope.indexPageSelect) {
                    if (scope.listQuestion[i].Required == true) {
                        if (scope.listQuestion[i].dataChoice == undefined) {
                            scope.listQuestion[i].showRequired = true;
                            return false;
                        }
                        else {
                            scope.listQuestion[i].showRequired = false;
                        }
                    }
                }

                break;
            case "Paragraph":
                if (scope.listQuestion[i].numberPage == scope.indexPageSelect) {
                    if (scope.listQuestion[i].Required == true) {
                        if (scope.listQuestion[i].dataChoice == undefined) {
                            scope.listQuestion[i].showRequired = true;
                            return false;
                        }
                        else {
                            scope.listQuestion[i].showRequired = false;
                        }
                    }
                }

                break;
            case "MultipleChoice":
                if (scope.listQuestion[i].numberPage == scope.indexPageSelect) {
                    if (scope.listQuestion[i].Required == true) {
                        if (scope.listQuestion[i].dataChoice == undefined) {
                            scope.listQuestion[i].showRequired = true;
                            return false;
                        }
                        else {
                            scope.listQuestion[i].showRequired = false;
                        }
                    }
                }

                break;
            case "CheckBoxs":
                if (scope.listQuestion[i].numberPage == scope.indexPageSelect) {
                    if (scope.listQuestion[i].Required == true) {
                        if (scope.listQuestion[i].dataChoice == undefined||
                            scope.listQuestion[i].dataChoice.length==0) {
                            scope.listQuestion[i].showRequired = true;
                            return false;
                        }
                        else {
                            scope.listQuestion[i].showRequired = false;
                        }
                    }
                }

                break;
            case "Dropdown":
                if (scope.listQuestion[i].numberPage == scope.indexPageSelect) {
                    if (scope.listQuestion[i].Required == true) {
                        if (scope.listQuestion[i].dataChoice == undefined) {
                            scope.listQuestion[i].showRequired = true;
                            return false;
                        }
                        else {
                            scope.listQuestion[i].showRequired = false;
                        }
                    }
                }

                break;
            case "LinearScale":
                if (scope.listQuestion[i].numberPage == scope.indexPageSelect) {
                    if (scope.listQuestion[i].Required == true) {
                        if (scope.listQuestion[i].dataChoice == undefined) {
                            scope.listQuestion[i].showRequired = true;
                            return false;
                        }
                        else {
                            scope.listQuestion[i].showRequired = false;
                        }
                    }
                    if (scope.listQuestion[i].dataChoice <= scope.listQuestion[i].data.valueChoice) {
                        if (scope.listQuestion[i].commentdata == undefined) {
                            scope.listQuestion[i].inputComment = true;
                            return false;
                        }
                    }

                }

                break;
            case "Date":
                if (scope.listQuestion[i].numberPage == scope.indexPageSelect) {
                    if (scope.listQuestion[i].Required == true) {
                        if (scope.listQuestion[i].dataChoice == undefined) {
                            scope.listQuestion[i].showRequired = true;
                            return false;
                        }
                        else {
                            scope.listQuestion[i].showRequired = false;
                        }
                    }
                }

                break;
        }

    }
    return true;
}