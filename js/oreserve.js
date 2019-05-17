let ctrlNo = "";
let user = "";
let evtDt = "";
let evtMat = "";
let evtSpk = "";
let o = new Crud();
uLog = JSON.parse(localStorage.userDet);
let updateType = "";
let allLogs = [];
let xallLogs = [];

o.read("tbl_logsfunc?ORDERBY=fldApprovalID DESC").then(x => {
    allLogs = x;
})

o.read("tbl_logsrooms?ORDERBY=fldApprovalID DESC").then(x => {
    xallLogs = x;
})


callDt = (yz = []) => {

    $(function () {
        var start = moment(new Date());
        var end = moment(new Date());

        function cb(start, end) {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }

        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);

        cb(start, end);

    });


    let tbl = $('#dtBasicExample').DataTable({
        "order": [[0, "desc"]],
        "scrollY": "490px",
        "scrollCollapse": true,
        'sort': true,
        retrieve: true,
        searching: true,
        data: yz,
        columns: [
            { 'data': 'fldCtrlNo' },
            { 'data': 'fldFacility' },
            { 'data': 'fldUserID' },
            { 'data': 'fldEventType' },
            { 'data': 'fldDateTimeReq' },
            {
                'data': 'fldRemarks',
                'render': function (stats) {
                    var color = "black";
                    var badge;
                    if (stats == "Rejected" || stats == "Cancelled") {
                        color = 'text-danger';
                        badge = 'badge badge-danger'
                    } else if (stats == "Accepted") {
                        color = 'text-success';
                        badge = 'badge badge-success'
                    } else {
                        color = 'text-warning';
                        badge = 'badge badge-warning'
                    }

                    return "<span class='" + badge + "'>" + stats + "</span></label>";
                }

            },
            {
                'data': 'fldCtrlNo',
                'render': function (id) {
                    return '<a onclick=sfunc("' + id + '") data-toggle="tooltip" title="Default tooltip"><span class="badge badge-pill blue">View</span></a>'
                }
            }
        ]
    }).clear().rows.add(yz).draw();
    $('.dataTables_length').addClass('bs-select');

    tbl.on('search.dt', function () {
        //number of filtered rows
        console.log(tbl.rows({ filter: 'applied' }).nodes().length);
        //filtered rows data as arrays
        console.log(tbl.rows({ filter: 'applied' }).data());
    })

    $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
        var start = picker.startDate;
        var end = picker.endDate;
        $.fn.dataTable.ext.search.push(
            function (settings, data, dataIndex) {
                var min = start;
                var max = end;
                let o = data[4].split("@");
                console.log(o[0].replace(/ /g, ''));
                var startDate = new Date(o[0].replace(/ /g, ''));
                if (min == null && max == null) {
                    return true;
                }
                if (min == null && startDate <= max) {
                    return true;
                }
                if (max == null && startDate >= min) {
                    return true;
                }
                if (startDate <= max && startDate >= min) {
                    return true;
                }
                return false;
            }
        );
        tbl.draw();

        $.fn.dataTable.ext.search.pop();
    });
}


genPull = () => {
    if (uLog.Authorize == "Dean" || uLog.Authorize == "Department Head") {
        updateType = "In progress";
        o.read("fullfunc/tbl_reservations").then(data => {
            let longString = "";
            let yz = [];
            data.map(x => {
                if (x.fldDepartment == uLog.fldDept) {
                    // longString += '<tr>';
                    // longString += '<td>' + x.fldRoomCtrlNo + '</td>';
                    // longString += '<td>' + x.fldFacility + '</td>';
                    // longString += '<td>' + x.fldUserID + '</td>';
                    // longString += '<td>' + x.fldEventType + '</td>';
                    // longString += '<td>' + x.fldRemarks + '</td>';
                    // longString += '<td><a onclick=sfunc("' + x.fldRoomCtrlNo + '")><span class="badge badge-pill blue">View</span></a></td>';
                    // longString += '</tr>';
                    yz.push(x);
                }
            });

            callDt(yz);
        });
    }

    if (uLog.fldDept == "AcademicAffairs") {
        updateType = "Processing";
        o.read("tbl_roomreservations?ORDERBY=fldRoomCtrlNo DESC").then(data => {
            let longString = "";
            data.map(x => {
                longString += '<tr>';
                longString += '<td>' + x.fldRoomCtrlNo + '</td>';
                longString += '<td>' + x.fldFacility + '</td>';
                longString += '<td>' + x.fldUserID + '</td>';
                longString += '<td>' + x.fldEventType + '</td>';
                longString += '<td>' + x.fldRemarks + '</td>';
                longString += '<td><a onclick=sfunc("' + x.fldRoomCtrlNo + '")><span class="badge badge-pill blue">View</span></a></td>';
                longString += '</tr>';
            });

            $("#tbl_items").html(longString);
        });
    }

    if (uLog.fldDept == "Registrar") {
        updateType = "Finalizing";
        o.read("tbl_roomreservations?ORDERBY=fldRoomCtrlNo DESC").then(data => {
            let longString = "";
            data.map(x => {
                if ((x.fldRemarks == 'Finalizing' || x.fldRemarks == 'Processing' || x.fldRemarks == 'Accepted') && parseInt(x.fldApprovalCount) > 0) {
                    if (x.fldRemarks != 'Rejected') {
                        longString += '<tr>';
                        longString += '<td>' + x.fldRoomCtrlNo + '</td>';
                        longString += '<td>' + x.fldFacility + '</td>';
                        longString += '<td>' + x.fldUserID + '</td>';
                        longString += '<td>' + x.fldEventType + '</td>';
                        longString += '<td>' + x.fldRemarks + '</td>';
                        longString += '<td><a onclick=sfunc("' + x.fldRoomCtrlNo + '")><span class="badge badge-pill blue">View</span></a></td>';
                        longString += '</tr>';
                    } else {
                        if (parseInt(xCheckData(x.fldRoomCtrlNo).fldNotifyRegistrar) > 0) {
                            longString += '<tr>';
                            longString += '<td>' + x.fldRoomCtrlNo + '</td>';
                            longString += '<td>' + x.fldFacility + '</td>';
                            longString += '<td>' + x.fldUserID + '</td>';
                            longString += '<td>' + x.fldEventType + '</td>';
                            longString += '<td>' + x.fldRemarks + '</td>';
                            longString += '<td><a onclick=sfunc("' + x.fldRoomCtrlNo + '")><span class="badge badge-pill blue">View</span></a></td>';
                            longString += '</tr>';
                        }
                    }
                }
            });

            $("#tbl_items").html(longString);
        });
    }

    if (uLog.fldDept == "Supply") {
        updateType = "Finalizing";
        o.read("fullfunc/tbl_reservations").then(data => {
            let longString = "";
            let yz = [];
            data.map(x => {
                if ((x.fldRemarks == 'Resend' || x.fldRemarks == 'Finalizing' || x.fldRemarks == 'Accepted' || x.fldRemarks == 'Cancelled' || x.fldRemarks == 'Rejected') && parseInt(x.fldApprovalCount) > 1) {
                    if (x.fldRemarks != 'Rejected') {
                        // longString += '<tr>';
                        // longString += '<td>' + x.fldCtrlNo + '</td>';
                        // longString += '<td>' + x.fldFacility + '</td>';
                        // longString += '<td>' + x.fldUserID + '</td>';
                        // longString += '<td>' + x.fldEventType + '</td>';
                        // longString += '<td>' + x.fldRemarks + '</td>';
                        // longString += '<td><a onclick=sfunc("' + x.fldCtrlNo + '")><span class="badge badge-pill blue">View</span></a></td>';
                        // longString += '</tr>';
                        yz.push(x);
                    } else {
                        if (parseInt(CheckData(x.fldCtrlNo).fldNotifySupply) > 0) {
                            // longString += '<tr>';
                            // longString += '<td>' + x.fldCtrlNo + '</td>';
                            // longString += '<td>' + x.fldFacility + '</td>';
                            // longString += '<td>' + x.fldUserID + '</td>';
                            // longString += '<td>' + x.fldEventType + '</td>';
                            // longString += '<td>' + x.fldRemarks + '</td>';
                            // longString += '<td><a onclick=sfunc("' + x.fldCtrlNo + '")><span class="badge badge-pill blue">View</span></a></td>';
                            // longString += '</tr>';
                            yz.push(x);
                        }
                    }
                }
            });

            callDt(yz);
        });
    }


    if (uLog.fldDept == "MIS") {
        updateType = "Accepted";
        o.read("fullfunc/tbl_reservations").then(data => {
            let longString = "";
            let yz = [];
            data.map(x => {
                if ((x.fldRemarks == 'Resend' || x.fldRemarks == 'Finalizing' || x.fldRemarks == 'Accepted' || x.fldRemarks == 'Cancelled' || x.fldRemarks == 'Rejected') && parseInt(x.fldApprovalCount) > 1) {
                    if (x.fldRemarks != 'Rejected') {
                        // longString += '<tr>';
                        // longString += '<td>' + x.fldCtrlNo + '</td>';
                        // longString += '<td>' + x.fldFacility + '</td>';
                        // longString += '<td>' + x.fldUserID + '</td>';
                        // longString += '<td>' + x.fldEventType + '</td>';
                        // longString += '<td>' + x.fldRemarks + '</td>';
                        // longString += '<td><a onclick=sfunc("' + x.fldCtrlNo + '")><span class="badge badge-pill blue">View</span></a></td>';
                        // longString += '</tr>';
                        yz.push(x);
                    } else {
                        if (parseInt(CheckData(x.fldCtrlNo).fldNotifyMIS) > 0) {
                            // longString += '<tr>';
                            // longString += '<td>' + x.fldCtrlNo + '</td>';
                            // longString += '<td>' + x.fldFacility + '</td>';
                            // longString += '<td>' + x.fldUserID + '</td>';
                            // longString += '<td>' + x.fldEventType + '</td>';
                            // longString += '<td>' + x.fldRemarks + '</td>';
                            // longString += '<td><a onclick=sfunc("' + x.fldCtrlNo + '")><span class="badge badge-pill blue">View</span></a></td>';
                            // longString += '</tr>';
                            yz.push(x);
                        }
                    }
                }
            });

            callDt(yz);


        });

    }

    if (uLog.fldDept == "Security" || uLog.fldDept == "Maintenance") {
        updateType = "Accepted";
        o.read("tbl_reservations?ORDERBY=fldCtrlNo DESC").then(data => {
            let yz = [];
            data.map(x => {
                if ((x.fldRemarks == 'Resend' || x.fldRemarks == 'Finalizing' || x.fldRemarks == 'Accepted' || x.fldRemarks == 'Cancelled' || x.fldRemarks == 'Rejected') && parseInt(x.fldApprovalCount) > 1) {
                    if (x.fldRemarks != 'Rejected') {
                        // longString += '<tr>';
                        // longString += '<td>' + x.fldCtrlNo + '</td>';
                        // longString += '<td>' + x.fldFacility + '</td>';
                        // longString += '<td>' + x.fldUserID + '</td>';
                        // longString += '<td>' + x.fldEventType + '</td>';
                        // longString += '<td>' + x.fldRemarks + '</td>';
                        // longString += '<td><a onclick=sfunc("' + x.fldCtrlNo + '")><span class="badge badge-pill blue">View</span></a></td>';
                        // longString += '</tr>';
                        yz.push(x);
                    }
                }
            });

            callDt(yz);
        });
    }

}
let CheckData = (val) => {
    for (let i = 0; i < allLogs.length; i++) {
        if (allLogs[i].fldCtrlNo == val) {
            console.log(allLogs[i])
            return allLogs[i];
        }
    }
    return false;
}

let xCheckData = (val) => {
    for (let i = 0; i < xallLogs.length; i++) {
        if (xallLogs[i].fldCtrlNo == val) {
            console.log(xallLogs[i])
            return xallLogs[i];
        }
    }
    return false;
}

pullUser = (user) => {
    fetch(url + "tbl_gcuser/fldseId/" + user).then(res => res.json()).then(function (xdata) {

        if (xdata.length == 0) {
            $('#sxfname').html(x.fldUserID);
            $('#dept').html(x.fldDepartment);
            $('#cno').html(x.fldContactNumber);
            $('#email').html("-");
        }

        xdata.map(xy => {
            $('#sxfname').html(xy.fldFullname);
            $('#dept').html(xy.fldDepartment);
            $('#cno').html(xy.fldContactNo);
            $('#email').html(xy.fldUsername);
        })

    });
}

pullData = async (val) => {



    if (uLog.fldDept == "AcademicAffairs" || uLog.fldDept == "Registrar") {
        $("#xRm").css("display", "none");
        $("#bxRm").css("display", "block");

        await fetch(url + "tbl_roomreservations/fldRoomCtrlNo/" + val).then(res => res.json()).then(function (data) {
            console.log(data);
            data.map(x => {
                $('#evName').html(x.fldEventName);
                $('#evType').html(x.fldEventType);
                $('#evDesc').html(x.fldEventDesc);
                $('#evFac').html(x.fldFacility);
                user = x.fldUserID;
                $('#tNo').html(x.fldRoomCtrlNo);

                pullUser(user);

            });
        });


        fetch(url + "tbl_roomreservedates/fldRoomCtrlNo/" + val).then(res => res.json()).then(function (data) {
            let ls = "";
            data.map(x => {
                ls += '<p class="text-left font-weight-light" id="fldTime">' + x.fldEventFrom + ' - ' + x.fldEventTo + ' @ ' + x.fldEventDate + '</p>'
            });

            $('#evtDts').html(ls);
        });

    } else {

        await fetch(url + "tbl_reservations/fldCtrlNo/" + val).then(res => res.json()).then(function (data) {
            console.log(data);
            data.map(x => {
                $('#evName').html(x.fldEventName);
                $('#evType').html(x.fldEventType);
                $('#evDesc').html(x.fldEventDesc);
                $('#evFac').html(x.fldFacility);
                $('#OutGC').html(x.fldOutsideGC);
                $('#InGC').html(x.fldInsideGC);
                $('#fdCater').html(x.fldFoodCater);
                $('#ushers').html(x.fldUshers);
                user = x.fldUserID;
                $('#tNo').html(x.fldCtrlNo);

                pullUser(user); 
                if (uLog.Authorize == "Dean" || uLog.Authorize == "Department Head") {
                    $("#bxRm").css("display", "none");
                    if (x.fldRemarks == "Pending") {
                        $("#xRm").css("display", "block");
                    } else {
                        $("#xRm").css("display", "none");
                    }
                }

                if (uLog.fldDept == "Supply") {
                    $("#bxRm").css("display", "none");
                    if (x.fldRemarks == "Processing") {
                        $("#xRm").css("display", "block");
                    } else {
                        $("#xRm").css("display", "none");
                    }
                }

                if (uLog.fldDept == "MIS") {
                    $("#bxRm").css("display", "none");
                    if (x.fldRemarks == "Finalizing") {
                        $("#xRm").css("display", "block");
                    } else {
                        $("#xRm").css("display", "none");
                    }
                }

                if (uLog.fldDept == "Security" || uLog.fldDept == "Maintenance") {
                    $("#bxRm").css("display", "none");
                    $("#xRm").css("display", "none");

                }
            });
        });

        fetch(url + "tbl_gcuser/fldseId/" + user).then(res => res.json()).then(function (data) {
            data.map(x => {
                console.log(x);
                $('#sxfname').html(x.fldFullName);
                $('#dept').html(x.fldDept);
                $('#cno').html(x.fldContactNo);
                $('#email').html("-");
            })
        });

        fetch(url + "tbl_reservedates/fldCtrlNo/" + val).then(res => res.json()).then(function (data) {
            let ls = "";
            data.map(x => {
                ls += '<p class="text-left font-weight-light" id="fldTime">' + x.fldEventFrom + ' - ' + x.fldEventTo + ' @ ' + x.fldEventDate + '</p>'
            });

            $('#evtDts').html(ls);
        });

        fetch(url + "tbl_rvip/fldCtrlNo/" + val).then(res => res.json()).then(function (data) {
            let ls = "";
            data.map(x => {
                ls += '<p class="text-left font-weight-light">' + x.fldFullName + '</p>'
            });

            $('#rvip').html(ls);
        });

        fetch(url + "tbl_materials/fldCtrlNo/" + val).then(res => res.json()).then(function (data) {
            let ls = "";
            data.map(x => {
                ls += '<tr>';
                ls += '<td>' + x.fldMatName + '</td>';
                ls += '<td>' + x.fldMatQty + '</td>';
                ls += '</tr>';
            });

            $('#pending_tbldata').html(ls);
        });
    }
}




let sfunc = (x) => {
    $("#bdown").css("display", "flex");
    $("#adown").css("display", "none");
    ctrlNo = x;
    pullData(x);

}

let sback = () => {
    $("#bdown").css("display", "none");
    $("#adown").css("display", "block");
}

let sAlert = () => {
    swal({
        title: "Transaction # is successfully accepted",
        text: "Please let wait until the various offices accept",
        type: "success",
        timer: 3000,
        showConfirmButton: false
    },
        function () {
            o.read("http://www.gordoncollegeccs-ssite.net/macionmart/samplepush/push.php?channel=VPOffice").then(x=>{

            });
            window.location.assign('reservations.html')
        }
    );
}

let submitData = (val) => {
    let data = {};
    let x = {};
    if (uLog.fldDept == "AcademicAffairs" || uLog.fldDept == "Registrar") {
        if (val == "Accepted") {
            if (updateType == "Processing") {
                x = {
                    fldRemarks: updateType,
                    fldApprovalCount: "1"
                }
                data = {
                    aCrl: ctrlNo,
                    b: uLog.UserID,
                    c: uLog.fldDept,
                    d: getDate(),
                    e: updateType,
                    f: 1,
                    g: 2,
                    h: 0,
                    i: 0,
                }
            } else {
                x = {
                    fldRemarks: updateType,
                    fldApprovalCount: "2"
                }
                data = {
                    aCrl: ctrlNo,
                    b: uLog.UserID,
                    c: uLog.fldDept,
                    d: getDate(),
                    e: updateType,
                    f: 1,
                    g: 1,
                    h: 2,
                    i: 0,
                }
            }

        } else {

            x = {
                fldRemarks: 'Rejected',
                fldRejected: $('#rejectReason').val()
            }

            if (updateType == "Processing") {
                x.fldApprovalCount = "1"

                data = {
                    aCrl: ctrlNo,
                    b: uLog.UserID,
                    c: uLog.fldDept,
                    d: getDate(),
                    e: "Rejected",
                    f: 1,
                    g: 0,
                    h: 0,
                    i: 2
                }
            } else {
                x.fldApprovalCount = "2"

                data = {
                    aCrl: ctrlNo,
                    b: uLog.UserID,
                    c: uLog.fldDept,
                    d: getDate(),
                    e: "Rejected",
                    f: 2,
                    g: 1,
                    h: 0,
                    i: 2
                }
            }

        }
        o.rud("insert/tbl_logsrooms", [data]).then(res => {
            console.log(res);
            o.rud("update/tbl_roomreservations/fldRoomCtrlNo/" + ctrlNo, [x]).then(y => {
                sAlert();
            })
        });
    } else {
        if (val == "Accepted") {

            if (updateType == "In progress") {
                x = {
                    fldRemarks: updateType,
                    fldApprovalCount: "1"
                }
                data = {
                    aCrl: ctrlNo,
                    b: uLog.UserID,
                    c: uLog.fldDept,
                    d: getDate(),
                    e: updateType,
                    f: 1,
                    g: 2,
                    h: 0,
                    i: 0,
                    j: 0,
                    k: 0,
                    l: 0
                }
            }

            if (updateType == "Finalizing") {
                x = {
                    fldRemarks: updateType,
                    fldApprovalCount: "3"
                }
                data = {
                    aCrl: ctrlNo,
                    b: uLog.UserID,
                    c: uLog.fldDept,
                    d: getDate(),
                    e: updateType,
                    f: 1,
                    g: 1,
                    h: 1,
                    i: 2,
                    j: 0,
                    k: 0,
                    l: 0
                }
            }

            if (updateType == "Accepted") {
                x = {
                    fldRemarks: updateType,
                    fldApprovalCount: "4"
                }
                data = {
                    aCrl: ctrlNo,
                    b: uLog.UserID,
                    c: uLog.fldDept,
                    d: getDate(),
                    e: updateType,
                    f: 1,
                    g: 1,
                    h: 1,
                    i: 1,
                    j: 2,
                    k: 2,
                    l: 2
                }
            }

        } else {
            x = {
                fldRemarks: 'Rejected',
                fldRejected: $('#rejectReason').val()
            }

            if (updateType == "In progress") {
                x.fldApprovalCount = "1"

                data = {
                    aCrl: ctrlNo,
                    b: uLog.UserID,
                    c: uLog.fldDept,
                    d: getDate(),
                    e: "Rejected",
                    f: 1,
                    g: 0,
                    h: 0,
                    i: 0,
                    j: 0,
                    k: 0,
                    l: 2
                }
            }

            if (updateType == "Finalizing") {
                x.fldApprovalCount = "3"

                data = {
                    aCrl: ctrlNo,
                    b: uLog.UserID,
                    c: uLog.fldDept,
                    d: getDate(),
                    e: "Rejected",
                    f: 2,
                    g: 2,
                    h: 1,
                    i: 0,
                    j: 0,
                    k: 0,
                    l: 2
                }
            }

            if (updateType == "Accepted") {
                x = {
                    fldRemarks: updateType,
                    fldApprovalCount: "4"
                }
                data = {
                    aCrl: ctrlNo,
                    b: uLog.UserID,
                    c: uLog.fldDept,
                    d: getDate(),
                    e: "Rejected",
                    f: 2,
                    g: 2,
                    h: 2,
                    i: 1,
                    j: 0,
                    k: 0,
                    l: 2
                }
            }
        }
        o.rud("insert/tbl_logsfunc", [data]).then(res => {
            console.log(res);
            o.rud("update/tbl_reservations/fldCtrlNo/" + ctrlNo, [x]).then(y => {
                sAlert();

                fetch("http://")
            })
        });
    }

}


getDate = () => {
    let currentDate = new Date()
    let day = currentDate.getDate()
    let month = currentDate.getMonth() + 1
    let year = currentDate.getFullYear()

    var h = currentDate.getHours();
    var m = currentDate.getMinutes();
    var s = currentDate.getSeconds();

    return month + "/" + day + "/" + year + " " + h + ":" + m + ":" + s;
}




