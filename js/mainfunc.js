let ArrDataHolder = [];
let datas = [JSON.parse('{"assets": [] }'), JSON.parse('{"costs": [] }'), JSON.parse('{"rates": [] }'), JSON.parse('{"items": [] }')];
let yearlyCost = [];
let costUsed = [];
let itemCount = 0;
try {
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {},
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
            }]
            }
        }
    });
} catch (err) {

}

getData();
console.log(datas);
getDataItems();
noItems();

$.fn.serializemyObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};



function saveData() {
    localStorage.myArr = JSON.stringify(datas);
}

function getData() {
    try {
        var myDatas = JSON.parse(localStorage.myArr);
        datas = myDatas;
    } catch (err) {

    }
}




function insertAsset() {
    let aType = $("#assetType").val();
    let nLC = $("#noLifeCycle").val();
    let jsonObj;

    jsonObj = JSON.parse('{ "assetType":"' + aType + '", "noLifeCycle":"' + nLC + '"}');
    datas[0].assets.push(jsonObj);
    console.log(datas[0].assets);
    console.log(datas);
    viewAssets();
    saveData();
}

function getDataItems() {
    $.ajaxSetup({
        async: false
    });
    $.getJSON("http://gordoncollegeccs-ssite.net/pems/apis/myapi/select/tbl_lccasset/fldUserID/"+localStorage.companyID, function (data) {
        for (let i = 0; i < data.length; i++) {
            let jsonObj;
            jsonObj = JSON.parse('{ "assetType":"' + data[i].fldAssetType + '", "noLifeCycle":"' + data[i].fldYrs + '"}');
            datas[0].assets.push(jsonObj);
        }
    });
    
    $.getJSON("http://gordoncollegeccs-ssite.net/pems/apis/myapi/select/tbl_lccacosts/fldUserID/"+localStorage.companyID, function (data) {
        for (let i = 0; i < data.length; i++) {
            let jsonObj;
            jsonObj = JSON.parse('{ "costName":"' + data[i].fldCostName + '", "costType":"' + data[i].fldCostType + '"}');
            datas[1].costs.push(jsonObj);
        }
    });    

    for (var i = 0; i < datas[0].assets.length; i++) {
        $('#assetAndYear').append($('<option>', {
            value: datas[0].assets[i].noLifeCycle,
            text: datas[0].assets[i].assetType + " - " + datas[0].assets[i].noLifeCycle
        }));
    }

    for (var j = 0; j < datas[1].costs.length; j++) {
        $('#listofCost').append($('<option>', {
            value: datas[1].costs[j].costName,
            text: datas[1].costs[j].costName
        }));
    }
}

function insertCost() {
    let cName = $("#costName").val();
    let cType = $("#costType option:selected").text();
    let eRate = $("#escalationRate").val();
    let ocType = $("#otCostType option:selected").text();
    let jsonObj;


    if (cType == "Recurring Cost") {
        jsonObj = JSON.parse('{ "costName":"' + cName + '", "costType":"' + cType + '", "escalationRate": "' + eRate + '"}');
    } else {
        jsonObj = JSON.parse('{ "costName":"' + cName + '", "costType":"' + cType + '", "oneTimeCostType": "' + ocType + '"}');
    }


    datas[1].costs.push(jsonObj);
    console.log(datas);
    viewCosts();
    saveData();


}

function insertRate() {
    let dRate = $("#discountRate").val();
    let jsonObj;

    jsonObj = JSON.parse('{ "discountRate":"' + dRate + '"}');
    datas[2].rates = jsonObj;
    console.log(datas);
    saveData();
}

function selectYear(val) {
    yearlyCost = [];
    let jsonObj;
    myChart.data.labels = [];
    myChart.update();

    for (let i = 0; i < val; i++) {
        jsonObj = JSON.parse('{ "YearNumber": "' + (i + 1) + '", "Items": [] }');
        yearlyCost.push(jsonObj);
        myChart.data.labels.push("Year " + (i + 1));
    }
    myChart.update();
    console.log(yearlyCost);
}




function noItems() {
    var los = document.getElementById('wxpForm').innerHTML;
    document.getElementById('wxp').innerHTML += los;
}

noItems_t();
function noItems_t() {
    var los = document.getElementById('eaForm').innerHTML;
    document.getElementById('ea').innerHTML += los;
}

noItems_s();
function noItems_s() {
    var los = document.getElementById('smnForm').innerHTML;
    document.getElementById('smn').innerHTML += los;
}


noItems_x();
function noItems_x() {
    var los = document.getElementById('chrForm').innerHTML;
    document.getElementById('chr').innerHTML += los;
}


function insertItem(val) {
    let myStr = "#item_no" + val;
    let fVal = $(myStr).val();
    datas[3].items[val] = fVal;
    console.log(datas);
}

function addCostUsed() {
    let cType = $("#listofCost option:selected").text();
    costUsed.push(getCostDetails(cType));
    console.log(costUsed);
    viewCostList()
}


function getCostDetails(val) {
    for (let i = 0; i < datas[1].costs.length; i++) {
        if (datas[1].costs[i].costName == val) {
            return datas[1].costs[i];
        }
    }
}

function showTable() {
    let ArrTotal = [];
    for (let x = 0; x < datas[3].items.length; x++) {
        document.getElementById("itemsNo").innerHTML += "<tr id='itemNo" + (x + 1) + "'><td>" + document.getElementById("item_no" + x).value + "</td></tr>";
    }

    for (let i = 0; i < yearlyCost.length; i++) {
        document.getElementById("YearlyHead").innerHTML += "<th>Year" + (i + 1) + "</th>";
        for (let k = 0; k < yearlyCost[i].Items.length; k++) {
            document.getElementById("itemNo" + (k + 1)).innerHTML += "<td>" + yearlyCost[i].Items[k].TotalCost + ".00</td>";
            ArrTotal[k] += parseInt(yearlyCost[i].Items[k].TotalCost);
        }
    }

    document.getElementById("YearlyHead").innerHTML += "<th>Total</th>";



}

function showChart() {
    let myJsonObj = "";
    let jsonObj = "";
    let ArrTotal = [];
    let lowestkey = 0;
    let lowestval = 0;
    ArrDataHolder = [];
    myChart.data.datasets = [];
    myChart.update();

    for (let x = 0; x < datas[3].items.length; x++) {
        myJsonObj = '{ "ItemNumber": "' + (x + 1) + '", "YearlyCost": [] }';
        ArrDataHolder.push(JSON.parse(myJsonObj));
    }

    for (let aj = 0; aj < itemCount; aj++) {
        ArrTotal[aj] = 0;
    }

    for (let i = 0; i < yearlyCost.length; i++) {
        for (let k = 0; k < yearlyCost[i].Items.length; k++) {
            ArrDataHolder[k].YearlyCost[i] = yearlyCost[i].Items[k].TotalCost;
            ArrTotal[k] += yearlyCost[i].Items[k].TotalCost;
        }
    }

    lowestkey = 0;
    lowestval = parseInt(ArrTotal[0]);
    for (let j = 0; j < itemCount; j++) {

        if (lowestval > parseInt(ArrTotal[j])) {
            lowestval = parseInt(ArrTotal[j]);
            lowestkey = j;
        }

        document.getElementById("itemNo" + (j + 1)).innerHTML += "<td><strong>" + ArrTotal[j] + ".00</strong></td>";
    }

    for (let z = 0; z < datas[3].items.length; z++) {
        jsonObj = JSON.parse('{ "label":"' + datas[3].items[z] + '", "data":[' + ArrDataHolder[z].YearlyCost + ' ], "backgroundColor": "transparent", "borderColor": "' + pickRandomColor() + '"}');
        myChart.data.datasets.push(jsonObj);
    }

    console.log(ArrDataHolder);

    myChart.update();

    document.getElementById("itemNo" + (lowestkey + 1)).style.backgroundColor = "green";
    document.getElementById("itemNo" + (lowestkey + 1)).style.color = "white";
}

function pickRandomColor() {
    let CSS_COLORS = ["red", "blue", "green", "aqua", "black", "orange", "Aquamarine", "indigo", "brown", "green", "DarkOrchid", "CornflowerBlue", "Fuchsia", "Crimson", "DarkGoldenRod", "Chartreuse", "Purple"];
    return CSS_COLORS[Math.floor(Math.random() * 16) + 1];
}

function generateItemVals() {
    var mylongString = "";
    mylongString = "<form><input type='hidden'></form>";
    $("#itemVals").html(mylongString);
    for (let i = 0; i < datas[3].items.length; i++) {
        mylongString += "<br><br><h5>Item Number" + (i + 1) + "</h5>";
        for (let j = 0; j < costUsed.length; j++) {
            mylongString += "<form id='form_" + i + "_" + j + "' role='form' class='row'>";

            mylongString += "<label for='itemNo_(" + (i + 1) + "_costNumber_" + j + ")'>" + costUsed[j].costName + ":</label>";

            mylongString += "<input type='number' class='form-control' name = 'costValue' id='itemNo_(" + (i + 1) + "_costNumber_" + j + ")' style='text-align:right'>";

            mylongString += "<input type='hidden' name='costName' value = '" + costUsed[j].costName + "' id='itemNoCost_(" + (i + 1) + "_costNumber_" + j + ")'>";
            if (isNaN(costUsed[j].escalationRate)) {
                mylongString += "<input type='hidden' name='OneTimeValue' id='escalationNo_(" + (i + 1) + "_costNumber_" + j + ")' value='" + costUsed[j].oneTimeCostType + "'>";
                mylongString += "<input type='hidden' name='costType' value='OneTimeValue'>";
            } else {
                mylongString += "<input type='hidden' name='EscalationValue' id='escalationNo_(" + (i + 1) + "_costNumber_" + j + ")' value='" + costUsed[j].escalationRate + "'>";
                mylongString += "<input type='hidden' name='costType' value='EscalationValue'>";
            }
            mylongString += "</form>";
        }
    }
    $("#itemVals").html(mylongString);
}

function summarizeForms() {
    var stpFourString = "";

    for (let k = 0; k < itemCount; k++) {
        stpFourString += "<tr><th>Item Number" + (k + 1) + ": <strong>" + document.getElementById("item_no" + k).value + "</strong><br>Cost List</th></tr>";
        for (let l = 0; l < costUsed.length; l++) {
            let myString = 'itemNo_(' + (k + 1) + '_costNumber_' + l + ')';
            stpFourString += "<tr><td>" + costUsed[l].costName + "</td><td> " + document.getElementById(myString).value + ".00</td></tr>";
        }
    }


    $("#step4costsval").html(stpFourString);


}

function getFormsVal() {
    let totalCost = 0;
    let jsonObj = "";
    for (let i = 0; i < yearlyCost.length; i++) {
        for (let j = 0; j < datas[3].items.length; j++) {
            totalCost = 0;
            jsonObj = JSON.parse('{ "ItemNumber": "' + (j + 1) + '", "Costs": [] }');
            yearlyCost[i].Items.push(jsonObj);
            for (let k = 0; k < costUsed.length; k++) {
                var strVar = "#form_" + j + "_" + k;
                console.log(strVar);
                console.log(yearlyCost);
                let parsedJSON = $(strVar).serializemyObject();
                let escalatedVal = 0;
                if (parsedJSON.costType == "EscalationValue" && (i + 1) > 1) {
                    escalatedVal = (((parseFloat(parsedJSON.EscalationValue).toFixed(2) / 100) * parseInt(parsedJSON.costValue)) * i) + parseInt(parsedJSON.costValue);
                    escalatedVal = getRecurringCost(escalatedVal, (i + 1));
                    parsedJSON.costValue = escalatedVal;
                    yearlyCost[i].Items[j].Costs.push(parsedJSON);
                    parsedJSON.costValue = parseInt(parsedJSON.costValue);
                    totalCost += parsedJSON.costValue;
                } else if (parsedJSON.costType == "EscalationValue" && i == 0) {
                    parsedJSON.costValue = parseFloat(parsedJSON.costValue).toFixed(2);
                    yearlyCost[i].Items[j].Costs.push(parsedJSON);
                    parsedJSON.costValue = parseInt(parsedJSON.costValue);
                    totalCost += parseInt(parsedJSON.costValue);
                } else {
                    if (parsedJSON.OneTimeValue == "Initial Year") {
                        if (i == 0) {
                            parsedJSON.costValue = parseInt(parsedJSON.costValue);
                            yearlyCost[i].Items[j].Costs.push(parsedJSON);
                            parsedJSON.costValue = parseInt(parsedJSON.costValue);
                            totalCost += parsedJSON.costValue;
                        }
                    } else {
                        if (i == (yearlyCost.length - 1)) {
                            parsedJSON.costValue = getOneTimeCost(parsedJSON.costValue);
                            yearlyCost[i].Items[j].Costs.push(parsedJSON);
                            parsedJSON.costValue = parseInt(parsedJSON.costValue);
                            totalCost += parsedJSON.costValue;
                        }
                    }
                }
            }
            yearlyCost[i].Items[j].TotalCost = totalCost;
        }
    }
    console.log(yearlyCost);
    showTable();
    showChart();


}


function getOneTimeCost(val) {
    let total = val / (1 + (datas[2].rates.discountRate / 100));
    return parseFloat(total).toFixed(2);
}

function getRecurringCost(val, year) {
    if (year == 1) {
        return val;
    } else {
        let total = (val * Math.pow(1 + (datas[2].rates.discountRate / 100), year)) / ((datas[2].rates.discountRate / 100) * Math.pow((1 + (datas[2].rates.discountRate / 100)), year));
        return parseFloat(total).toFixed(2);
    }
}


//MAIN

function PrintElem(elem) {

    localStorage.chartData = document.getElementById("myChart").toDataURL();
    Popup($('<div/>').append($(elem).clone()).html());
}

var vlongString;

function Popup(data) {



    var mywindow = window.open('', '_blank');


    mywindow.document.write('<head><link href="assets/css/printstyle.css" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet"></head>');
    mywindow.document.write('<body><div id="mybody">');
    mywindow.document.write('<div style="text-align: right;margin-right: 200px;">' + getDate() + '</div>');
    mywindow.document.write('<center><br><br><br><h1>Life Cycle Cost Analysis Result</h1><br><br></center>');


    mywindow.document.write('<center><img id="url" width="1000px" src=' + localStorage.chartData + '><br><br><h2>Life Cycle Cost Analysis Chart Table Data</h2>' + data + '</center></div><center>');

    mywindow.document.write('</center>')

    mywindow.document.write('<script type="text/javascript" src="js/jquery-3.2.0.min.js"></script><script type="text/javascript" src="js/Chart.min.js"></script><script type="text/javascript" src="js/Chart.bundle.min.js"></script><script type="text/javascript" src="js/mainfunc.js"></script>');
    mywindow.document.write('<script type="text/javascript" src="js/jspdf.min.js"></script>');
    mywindow.document.write('<script type="text/javascript" src="js/printPdf.js"></script>');
    mywindow.document.write('');
    mywindow.document.write('</body></html>');
    mywindow.focus();
    
    
    window.location.assign("../propertycard/purchase-request.html");
    return true;

}


function viewCostList() {
    let longString = "";
    for (let i = 0; i < costUsed.length; i++) {
        longString += "<tr>";
        longString += "<td>" + costUsed[i].costName + "</td>";
        longString += "<td>" + costUsed[i].costType + "</td>";
        longString += "<td><button type='button' onclick='remCostUsed(" + i + ")' class='btn red white-text'><i class='fa fa-remove'></i></td>";
        longString += "</tr>";
        longString += "</tr>";
    }
    $("#usedCostList").html(longString);
}

function remCostUsed(val) {
    costUsed.splice(val, 1);
    viewCostList();
}

function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    return today = mm + '/' + dd + '/' + yyyy;

}

/* b6 */

