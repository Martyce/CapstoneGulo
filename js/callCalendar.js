$.ajaxSetup({
    async: false
});

chkDate(mdt);
var luserId = 1;
var allDatas = [];
var mdt = new Date();
var dtNow = mdt.getFullYear() + "-" + (addZero(mdt.getMonth() + 1)) + "-" + addZero(mdt.getDate());
let o = new Crud();

function chkDate(dtVal) {
    let longString = "";
    $.getJSON("http://localhost" + "/myapi/select/tbl_reservation/fldDate/" + dtVal, function (data) {
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].fldUserID == luserId && data[i].fldRemarks != "Cancelled") {
                    longString += '<a href=# onclick="getTransactionDetails(' + data[i].fldTransactionNo + ')">Transaction Number - ' + data[i].fldTransactionNo + '</a><hr>';
                }
            }
        } else {
            longString += '<p class="grey-text">You have no reservations within this day</p>';/*
            longString += '<button class="btn btn-amber darken-4"><i class="fa fa-plus"></i> Reserve</button>';   */
        }
        $("#reserveData").html(longString);
    });
}

let fillCalendar = async () => {
    var myArr = [];

    await fetch(url + "/tbl_reservedates/fldCtrlNo/tbl_reservations/fldCtrlNo/").then(res => res.json()).then(function (data) {
        console.log(data);
        data.map(x => {
            let fdt = x.fldEventDate;
            let dt = fdt.split("/");
            fdt = dt[2] + "-" + dt[0] + "-" + dt[1];
            let cx = "";

            if (x.fldFacility == "Function Hall") {
                cx = "#00b894";
            } else {
                cx = "#74b9ff";
            }

            if (x.fldRemarks == "Accepted") {
                let y = {
                    id: x.fldTimeID,
                    title: x.fldEventName,
                    color: cx,
                    start: fdt + 'T' + x.fldEventFrom + ":00",
                    end: fdt + 'T' + x.fldEventTo + ":00",
                    url: "reservations.html?ctrlNo="+x.fldCtrlNo
                }
                myArr.push(y);
            }
        });
        console.log(myArr);
        allDatas = myArr;
        callCalen();
    });


}

function formatDt(val) {
    console.log(val);
    let dt = val.split("/");

    return dt[2] + "-" + dt[0] + "-" + dt[1];
}


function addZero(val) {
    if (val < 10) {
        return "0" + val;
    } else {
        return val;
    }
}

function callCalen() {
    var dt = new Date();
    $('#calendar').fullCalendar({
        selectable: true,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month, agendaWeek, agendaDay, listWeek'
        },
        editable: true,

        eventDrop: function (event, dayDelta, revertFunc) {
            let z = new Date(event.start);
            let j = z.getDate();
            let k = (z.getMonth() + 1);
            if (j < 10) {
                j = "0" + j;
            }
            if (k < 10) {
                k = "0" + k;
            }
            let ndt = k + "/" + j + "/" + z.getFullYear();
            let nt = event.start.format().split("T");
            let xt = nt[1].split(":");
            let ut = xt[0] + ":" + xt[1];


            if (!confirm("Are you sure about this change?")) {
                revertFunc();
            } else {
                let x = {
                    fldEventDate: ndt,
                    fldEventFrom: ut
                }
                o.rud("update/tbl_reservedates/fldTimeID/" + event.id, [x]).then(res => {
                    console.log(res);
                })
            }

        },
        eventResize: function (event, delta, revertFunc) {

            let nt = event.end.format().split("T");
            let xt = nt[1].split(":");
            let ut = xt[0] + ":" + xt[1];
            if (!confirm("is this okay?")) {
                revertFunc();
            }
            else {
                let x = {
                    fldEventTo: ut
                }
                o.rud("update/tbl_reservedates/fldTimeID/" + event.id, [x]).then(res => {
                    console.log(res);
                })
            }

        },
        defaultDate: dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate(),
        navLinks: true, // can click day/week names to navigate views
        eventLimit: true, // allow "more" link when too many events
        events: allDatas,
        dayClick: function (date) {
            chkDate(String(date.format()));
        },
        eventRender: function (event, element) {     // a callback
            console.log("hey");
        }
    })
}


fillCalendar();