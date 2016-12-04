myapp.controller('ResultSurveyController', function (myShareServices, $http, $cookieStore, AngularServicesGetDataServey, AngularServicesDasboard, AngularServicesGetDataServey, $scope, $location, $compile, $rootScope) {
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
    $scope.checkTypeSort = true;//change type sort increase:true - Decrease:false
    $scope.checkTypeFilter = false;//check exists filter
    var address = $location.search();
    var IdSurvey = address.id;
    if(IdSurvey==null||IdSurvey==undefined)
    {
        window.location.href = "/404.html";
    }
    var ObjDataSurvey
    /////////////////////////////////////////////
    var bienjson = AngularServicesGetDataServey.GetDataSurvey(IdSurvey);//get data survey
    bienjson.then(function (result) {
        ObjDataSurvey = JSON.parse(result.data);
        $scope.titleSurvey = ObjDataSurvey.Title;
        $scope.discriptionSurvey = ObjDataSurvey.Discription;
        $scope.nameSurvey = ObjDataSurvey.Title;
        var dateStart=new Date(ObjDataSurvey.DateStart);
        $scope.dateStart = dateStart.getDate() + "/" + (dateStart.getMonth() + 1) + "/" + (dateStart.getYear()+1900);
        var deadline = new Date(ObjDataSurvey.Deadline);
        $scope.deadline = deadline.getDate() + "/" + (deadline.getMonth() + 1) + "/" + (deadline.getYear() + 1900);

    });
    $scope.sortType = "";
    $scope.sortReverse = false;
    var dataAnswerJson = AngularServicesDasboard.GetResultAnswer(IdSurvey);
    $scope.listAnswerObj = [];
    $scope.contentAnswerRows = [];
    $scope.ObjDictionnaryTypeQuestion=[];
    $scope.numberRow = [];
    $scope.numberColumn = [];
    var listQuestionTypeJSON = AngularServicesGetDataServey.GetListQuestionType();// get list type question
    listQuestionTypeJSON.then(function (result) {
        $scope.ObjDictionnaryTypeQuestion = JSON.parse(result.data);
        loadData($scope, $compile, $rootScope, IdSurvey, AngularServicesDasboard);
    });
    
    $("#reportSurvey").ready(function () {
        $scope.dataTableExcel = $("#reportSurvey").tableExport({
            headings: true,                     // (Boolean), display table headings (th/td elements) in the <thead> 
            footers: true,                      // (Boolean), display table footers (th/td elements) in the <tfoot> 
            formats: ["xls", "csv", "txt"],     // (String[]), filetype(s) for the export 
            fileName: "id",                     // (id, String), filename for the downloaded file 
            bootstrap: true,                    // (Boolean), style buttons using bootstrap 
            position: "top",                 // (top, bottom), position of the caption element relative to table 
            ignoreRows: null,                   // (Number, Number[]), row indices to exclude from the exported file 
            ignoreCols: null,                   // (Number, Number[]), column indices to exclude from the exported file 
            ignoreCSS: ".tableexport-ignore"    // (selector, selector[]), selector(s) to exclude from the exported file 
        });
    });
    ///////
    $scope.showIcon = false;
    $scope.titleClick= function()
    {
        $scope.showIcon = true;
    }
    ///////
    $scope.showTitle = true;
    $scope.filterData = function () {
        if ($scope.checkTypeFilter == false) {
            document.getElementById("filterDataId").style.background = '#808080';
            $scope.showFilter = true;
            $scope.checkTypeFilter = true;
            dataFull = $scope.contentAnswerRows;
            $scope.showTitle = false;
        }
        else {
            document.getElementById("filterDataId").style.backgroundColor = 'Transparent';
            $scope.showFilter = false;
            $scope.checkTypeFilter = false;
            $scope.numberRow = [];
            for (var i = 0; i < dataFull.length; i++) {
                $scope.numberRow.push(i);
            }
            $scope.contentAnswerRows = dataFull;
            $scope.showTitle = true;
        }

    }
    var dataFull;

    var listConstraints = [];
    $scope.filterChoice = function (objData,selected)
    {
        if (selected.length == 0)
        {
            objData.filterText = "";
        }
        else
        {
            objData.filterText = "";
            for (var i = 0; i < selected.length; i++)
            {
                if((i+1)!=selected.length)
                {
                    objData.filterText += selected[i]+",";
                }
                else
                {
                    objData.filterText += selected[i];
                }
            }
            
        }
        $scope.filterText(objData,true);
    }
    $scope.filterText = function (objData, checkTypeFilterChoice) {
        var dataCurrent = [];
        var index = getIndexArrayObj(objData.Contents, $scope.listAnswerObj);
        var indexListConstraints = getIndexFromArray(index, listConstraints);
        if (indexListConstraints != -1) {
            listConstraints[indexListConstraints].value = objData.filterText;
        }
        else {
            var tempConstranin = {};
            tempConstranin.index = index;
            tempConstranin.value = objData.filterText;
            listConstraints.push(tempConstranin);
        }

        for (var i = 0; i < dataFull.length; i++) {
            var checkFlag = true;
            for (var j = 0; j < listConstraints.length; j++) {
              
                
                var checkFlagChoice = false;
                var checkInChoiceOrText = 0;
                    switch ($scope.listAnswerObj[0][listConstraints[j].index].QuestionTypeText)
                    {
                        case "CheckBoxs":
                            checkInChoiceOrText = 1;
                            paths = listConstraints[j].value.split(",");
                            for (var k = 0; k < paths.length; k++)
                            {
                              //var check = paths[0];
                                if (convertUtf8ToAscii(dataFull[i][listConstraints[j].index]).search(convertUtf8ToAscii(paths[k])) != -1) {
                                    checkFlagChoice = true;
                                }

                            }
                            break;
                        case "Dropdown":
                            checkInChoiceOrText = 1;
                            paths = listConstraints[j].value.split(",");
                            for (var k = 0; k < paths.length; k++) {
                                //var check = paths[0];
                                if (dataFull[i][listConstraints[j].index] == paths[k] || paths[k]=="") {
                                    checkFlagChoice = true;
                                }

                            }
                            break;
                        case "MultipleChoice":
                            checkInChoiceOrText = 1;
                            paths = listConstraints[j].value.split(",");
                            for (var k = 0; k < paths.length; k++) {
                                //var check = paths[0];
                                if (dataFull[i][listConstraints[j].index] ==paths[k] || paths[k] == "") {
                                    checkFlagChoice = true;
                                }

                            }
                            break;
                        default:
                            if (convertUtf8ToAscii(dataFull[i][listConstraints[j].index]).toLowerCase().search(convertUtf8ToAscii(listConstraints[j].value.toLowerCase())) == -1)
                            {
                                checkFlag = false;
                           
                            }
                            break;
                            
                }
                    if (checkFlagChoice == false && checkInChoiceOrText == 1) {
                        checkFlag = false;
                    }

            }
            if (checkFlag == true) {
                dataCurrent.push(dataFull[i]);
            }
        }


        $scope.contentAnswerRows = [];
        $scope.numberRow = [];
        for (var i = 0; i < dataCurrent.length; i++) {
            $scope.numberRow.push(i);
        }
        $scope.contentAnswerRows = dataCurrent;
    }
    $scope.refeshResult = function () {
        loadData($scope,$compile,$rootScope, IdSurvey, AngularServicesDasboard);

    }
    $scope.sortItem = function (titleItem, check, idColor) {
        var index = getIndexArrayObj(titleItem, $scope.listAnswerObj);
        $scope.checkTypeSort = check;
        sortControl($scope,index);
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
   
    $scope.options = {
        chart: {
            type: 'pieChart',
            height: 500,
            x: function (d) { return d.key; },
            y: function (d) { return d.y; },
            showLabels: true,
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true,
            zoomed: function (x1, y1) {
                var domains = { x1: 10, x2: 10, y1: 1, y2: 1 };
                return domains;
            },
            legend: {
                margin: {
                    top: 5,
                    right: 35,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };

    
    
});
function LoadReportChart($scope, $compile, $rootScope)
{
    var dem=0;
    for(var i=0;i<$scope.listAnswerObj[0].length;i++)
    {
        switch (ConvertIdToNameQuestionType($scope.ObjDictionnaryTypeQuestion, $scope.listAnswerObj[0][i].QuestionTypeId)) {
            case "MultipleChoice":
                dem++;
                var listData = [];
                for (var j = 0; j < $scope.listAnswerObj[i+1].length; j++)
                {
                    CheckContainInList(listData, $scope.listAnswerObj[i + 1][j].AnswerText);
                }
                
                AddChart($scope, $compile, $rootScope, $scope.listAnswerObj[0][i].Contents, listData)

                break;
            case "CheckBoxs":
                dem++;
                var listData = [];
                var listString = [];
                for (var j = 0; j < $scope.listAnswerObj[i + 1].length; j++) {
                    var tempListString = $scope.listAnswerObj[i + 1][j].AnswerText.split(",");
                    for(var k=0;k<tempListString.length;k++)
                    {
                        listString.push(tempListString[k].trim());
                    }
                    
                }

                for(var j=0;j<listString.length;j++)
                {
                    CheckContainInList(listData, listString[j]);
                }
                AddChart($scope, $compile, $rootScope, $scope.listAnswerObj[0][i].Contents, listData)
                break;
            case "Dropdown":
                dem++;
                var listData = [];
                for (var j = 0; j < $scope.listAnswerObj[i + 1].length; j++) {
                    CheckContainInList(listData, $scope.listAnswerObj[i + 1][j].AnswerText);
                }

                AddChart($scope, $compile, $rootScope, $scope.listAnswerObj[0][i].Contents, listData)

                break;
            case "LinearScale":
                dem++;
                var listData = [];
                for (var j = 0; j < $scope.listAnswerObj[i + 1].length; j++) {
                    CheckContainInList(listData, $scope.listAnswerObj[i + 1][j].AnswerNumber.toString());
                }

                AddChart($scope, $compile, $rootScope, $scope.listAnswerObj[0][i].Contents, listData)

                break;


        }
    }
    if(dem==0)
    {
        $scope.notDataResult = false;
    }
    else {
        $scope.notDataResult = true;
    }
}
function AddChart($scope,$compile,$rootScope, nameChart, listData)
{
    var comiledHTML = angular.element("<li templatechart></li>");
    var scopeChart = $rootScope.$new();

    var linkFun = $compile(comiledHTML);
    var finalTemplate = linkFun(scopeChart);
    $("#idChart").append(finalTemplate);
    scopeChart.options = {
        chart: {
            type: 'pieChart',
            height: 230,
           width:230,
            x: function (d) { return d.key; },
            y: function (d) { return d.y; },
            showLabels: true,
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true,


        }
    };
    scopeChart.data = listData;
    scopeChart.nameQuestion = nameChart;
}
myapp.directive('templatechart', function () {
    return {
        templateUrl: '/Frontend/App/resultsurvey/templatechart.html',

    };
});
function CheckContainInList(listData, value)
{
    for(var i=0;i<listData.length;i++)
    {
        var nmc = value.localeCompare(listData[i].key);
        if (nmc == 0)
        {
            listData[i].y++;
            return;
        }
    }
    var tempData = {};
    tempData.key = value;
    tempData.y = 1;
    listData.push(tempData);
    return;
}
function ConvertIdToNameQuestionType(ObjDictionnaryTypeQuestion, idType) {
    for (var i = 0; i < ObjDictionnaryTypeQuestion.length; i++) {
        if (ObjDictionnaryTypeQuestion[i].Id == idType) {
            return ObjDictionnaryTypeQuestion[i].NameTypeQuestion;
        }
    }
    return null;

}
function getIndexArrayObj(value, listArray)
{
    for (var i = 0; i < listArray[0].length; i++) {
        if (value == listArray[0][i].Contents) {
            return i;
        }
    }
    return -1;
}
function getIndexFromArray(value, listData)
{
    for(var i=0;i<listData.length;i++)
    {
        if(listData[i].index==value)

        {
            return i;
        }
    }
    return -1;
}
function convertUtf8ToAscii(str) {
    var combining = /[\u0300-\u036F]/g;

    return str.normalize('NFKD').replace(combining, '');
}
function customCompare($scope, i, j,index)
{
    switch (ConvertIdToNameQuestionType($scope.ObjDictionnaryTypeQuestion, $scope.listAnswerObj[0][index].QuestionTypeId)) {
        case "LinearScale":
            var parts1 = $scope.contentAnswerRows[i][index].split(".");
            var parts2 = $scope.contentAnswerRows[j][index].split(".");
            if (parseInt(parts1[0])>parseInt(parts2[0]))
            {
                return true;
            }
            
            break;
        case "Date":
            var parts1 = $scope.contentAnswerRows[i][index].split("-");
            var date1 = new Date(parts1[2], parts1[1] - 1, parts1[0]);
            var parts2 = $scope.contentAnswerRows[j][index].split("-");
            var date2 = new Date(parts2[2], parts2[1] - 1, parts2[0]);
            if (dateCompare(date1, date2) == 1)
            {
                return true;
            }

            break;
        default:
            if ($scope.contentAnswerRows[i][index] > $scope.contentAnswerRows[j][index])
            {
                return true;
            }        
            break;


    }
    return false;
}
function sortControl($scope,index)
{
    quickSort($scope, 0, $scope.contentAnswerRows.length - 1, index);
    //for (var i = 0; i < $scope.contentAnswerRows.length - 1; i++) {
    //    for (var j = i + 1; j < $scope.contentAnswerRows.length; j++) {
    //        if ($scope.checkTypeSort == true) {
    //            if (customCompare($scope, i, j, index) == true) {
    //                var t = $scope.contentAnswerRows[i];
    //                $scope.contentAnswerRows[i] = $scope.contentAnswerRows[j];
    //                $scope.contentAnswerRows[j] = t;
    //                var t2 = $scope.contentAnswerRows[i][0];
    //                $scope.contentAnswerRows[i][0] = $scope.contentAnswerRows[j][0];
    //                $scope.contentAnswerRows[j][0] = t2;
    //            }

    //        }
    //        else {
    //            if (customCompare($scope, i, j, index) == false) {
    //                var t = $scope.contentAnswerRows[i];
    //                $scope.contentAnswerRows[i] = $scope.contentAnswerRows[j];
    //                $scope.contentAnswerRows[j] = t;
    //                var t2 = $scope.contentAnswerRows[i][0];
    //                $scope.contentAnswerRows[i][0] = $scope.contentAnswerRows[j][0];
    //                $scope.contentAnswerRows[j][0] = t2;

    //            }
    //        }
    //    }
    //}
}
function swap($scope, i, j,index) {
    var t = $scope.contentAnswerRows[i];
    $scope.contentAnswerRows[i] = $scope.contentAnswerRows[j];
    $scope.contentAnswerRows[j] = t;
    var t2 = $scope.contentAnswerRows[i][0];
    $scope.contentAnswerRows[i][0] = $scope.contentAnswerRows[j][0];
    $scope.contentAnswerRows[j][0] = t2;
}
function partition($scope, pivot, left, right, myIndex) {
    var pivotValue = $scope.contentAnswerRows[pivot],
        partitionIndex = left;

    for (var i = left; i < right; i++) {
        if ($scope.checkTypeSort == true) {
            if (customCompare($scope, i, pivot, myIndex) == false) {
                swap($scope, i, partitionIndex, myIndex);
                partitionIndex++;
            }
        }
        else
        {
            if (customCompare($scope, i, pivot, myIndex) == true) {
                swap($scope, i, partitionIndex, myIndex);
                partitionIndex++;
            }
        }
    }
    swap($scope, right, partitionIndex, myIndex);
    return partitionIndex;
}

function quickSort($scope, left, right,myIndex) {
    var len = $scope.contentAnswerRows.length,
    pivot,
    partitionIndex;


    if (left < right) {
        pivot = right;
        partitionIndex = partition($scope, pivot, left, right, myIndex);

        //sort left and right
        quickSort($scope, left, partitionIndex - 1, myIndex);
        quickSort($scope, partitionIndex + 1, right, myIndex);
    }
    return $scope;
}
function loadData($scope,$compile,$rootScope, IdSurvey, AngularServicesDasboard)
{
    var listAnswerObj = [];
    var numberRow = [];
    var numberColumn = [];
    var contentAnswerRows = [];
    dataAnswerJson = AngularServicesDasboard.GetResultAnswer(IdSurvey);
    dataAnswerJson.success(function (result) {
        for (var i = 0; i < result.length; i++) {
            var tempAnswerObj = JSON.parse(result[i]);
            listAnswerObj.push(tempAnswerObj);
        }
        for (var i = 0; i < listAnswerObj[0].length; i++) {
            listAnswerObj[0][i].QuestionTypeText = ConvertIdToNameQuestionType($scope.ObjDictionnaryTypeQuestion, listAnswerObj[0][i].QuestionTypeId)
            listAnswerObj[0][i].ListDistanceItem = [];
            listAnswerObj[0][i].ListDistanceItemSelect = [];
            switch (listAnswerObj[0][i].QuestionTypeText) {
                case "MultipleChoice":
                    for (var j = 0; j < listAnswerObj[i + 1].length; j++)
                    {
                        listAnswerObj[0][i].ListDistanceItem=AddDistanceItemInList(listAnswerObj[0][i].ListDistanceItem, listAnswerObj[i + 1][j].AnswerText);
                    }
                    break;
                case "CheckBoxs":
                    for (var j = 0; j < listAnswerObj[i + 1].length; j++) {
                        paths = listAnswerObj[i + 1][j].AnswerText.split(",");
                        for (var k = 0; k < paths.length; k++)
                        {
                            listAnswerObj[0][i].ListDistanceItem = AddDistanceItemInList(listAnswerObj[0][i].ListDistanceItem, paths[k].trim());
                        }
                        
                    }
                    break;
                case "Dropdown":
                    for (var j = 0; j < listAnswerObj[i + 1].length; j++) {
                        listAnswerObj[0][i].ListDistanceItem = AddDistanceItemInList(listAnswerObj[0][i].ListDistanceItem, listAnswerObj[i + 1][j].AnswerText);
                    }
                    break;
            }
            if (listAnswerObj[0][i].Contents.length > 10) {
                listAnswerObj[0][i].TitleQuestion = listAnswerObj[0][i].Contents.slice(0, 10);
                listAnswerObj[0][i].TitleQuestion += "...";
                listAnswerObj[0][i].reduceString = true;

            }
            else {
                listAnswerObj[0][i].TitleQuestion = listAnswerObj[0][i].Contents;
                listAnswerObj[0][i].reduceString = false;
            }
        }
        var tempTitle = {};//////////////////////////////add coulmn (stt, date submit,..)
        tempTitle.Contents = "STT";
        tempTitle.QuestionTypeId = 1;
        listAnswerObj[0].unshift(tempTitle);
        var tempDateSubmit = {};
        tempDateSubmit.Contents="Date Submit"
        listAnswerObj[0].push(tempDateSubmit);
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
            var datetemp;////
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
            tempdate = listAnswerObj[2][i].AnswerTime;
            tempAnswer.push(tempdate);
            contentAnswerRows.push(tempAnswer);

        }
        $scope.listAnswerObj = listAnswerObj;
        $scope.numberRow = numberRow;
        numberColumn.push(numberColumn.length);
        $scope.numberColumn = numberColumn;
        $scope.contentAnswerRows = contentAnswerRows;
        $scope.numberRecord = $scope.numberRow.length;
        var myNode = document.getElementById("idChart");
        while (myNode.firstChild) { // remove all chart
            myNode.removeChild(myNode.firstChild);
        }
        LoadReportChart($scope, $compile, $rootScope);//add new chart
    });
}
function AddDistanceItemInList(list,item)
{
    for(var i=0;i<list.length;i++)
    {
        if(list[i] == item)
        {
            return list;
        }
    }
    list.push(item);
    return list;
}

//var result = quickSort(items, 0, items.length - 1);