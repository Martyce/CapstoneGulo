let ctrlNo = "";
let user = "";
let evtDt = "";
let evtMat = "";
let evtSpk = "";
let o = new Crud();
uLog = JSON.parse(localStorage.userDet);

loadAllDatas = () => {
    fetch(url + "tbl_roomreservations?ORDERBY=fldRoomCtrlNo DESC").then(res => res.json()).then(function (data) {
        let yz = [];
        data.map(x => {
            if ((x.fldRemarks != "Pending" && x.fldRemarks != 'Renew') && parseInt(x.fldApprovalCount) > 0) {
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
        });

        $('#dtBasicExample').DataTable({
            "order": [[ 0, "desc" ]],
            "scrollY": "490px",
            "scrollCollapse": true,
            'sort': true,
            retrieve: true,
            searching: true,
            data: yz,
            columns: [
                { 'data': 'fldRoomCtrlNo' },
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
                    'data': 'fldRoomCtrlNo',
                    'render': function (id) {
                        return '<a onclick=sfunc("' + id + '") data-toggle="tooltip" title="Default tooltip"><span class="badge badge-pill blue">View</span></a>'
                    }
                }
            ]
        }).clear().rows.add( yz ).draw();
        $('.dataTables_length').addClass('bs-select');
    });


}




pullData = async (val) => {
    await fetch(url + "tbl_roomreservations/fldRoomCtrlNo/" + val).then(res => res.json()).then(function (data) {
        console.log(data);
        data.map(x => {
            $('#evName').html(x.fldEventName);
            $('#evType').html(x.fldEventType);
            $('#evDesc').html(x.fldEventDesc);
            $('#evFac').html(x.fldFacility);
            user = x.fldUserID;
            $('#tNo').html(x.fldCtrlNo);
            console.log(x.fldRemarks);
            if (x.fldRemarks == "Finalizing") {
                $("#xRm").css("display", "block");
                $("#yRm").css("display", "none");
            } else {
                if (x.fldRemarks == "Rejected") {
                    $("#xRm").css("display", "none");
                    $("#yRm").css("display", "none");
                } else {
                    $("#xRm").css("display", "none");
                    $("#yRm").css("display", "block");
                }
            }

        });
    });

    fetch(url + "tbl_users/fldUserID/" + user).then(res => res.json()).then(function (data) {
        data.map(x => {
            console.log(x);
            $('#sxfname').html(x.fldFullName);
            $('#dept').html(x.fldDept);
            $('#cno').html(x.fldContactNo);
            $('#email').html(x.fldEmailAdd);
        })
    });

    fetch(url + "tbl_roomreservedates/fldRoomCtrlNo/" + val).then(res => res.json()).then(function (data) {
        let ls = "";
        data.map(x => {
            ls += '<p class="text-left font-weight-light" id="fldTime">' + x.fldEventFrom + ' - ' + x.fldEventTo + ' @ ' + x.fldEventDate + '</p>'
        });

        $('#evtDts').html(ls);
    });


}


let sfunc = (x) => {
    $("#bdown").css("display", "flex");
    $("#adown").css("display", "none");
    ctrlNo = x;
    pullData(x);
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
            window.location.assign('roomreservations.html');
        }
    );
}

getDate = () => {
    let currentDate = new Date()
    let day = currentDate.getDate()
    let month = currentDate.getMonth() + 1
    let year = currentDate.getFullYear()

    var h = currentDate.getHours();
    var m = currentDate.getMinutes();
    var s = currentDate.getSeconds();

    return month + "/" + day + "/" + year + " @ " + h + ":" + m + ":" + s;
}

let submitData = (val) => {
    let data = {};
    let x = {};
    if (val == "Processing") {
        val = "Accepted";
        data = {
            aCrl: ctrlNo,
            b: uLog.UserID,
            c: uLog.fldDept,
            d: getDate(),
            e: val,
            f: 1,
            g: 1,
            h: 1,
            i: 2
        };
        x = {
            fldRemarks: val,
            fldApprovalCount: "3"
        };
    } else if (val == "Cancel") {
        data = {
            aCrl: ctrlNo,
            b: uLog.UserID,
            c: uLog.fldDept,
            d: getDate(),
            e: val,
            f: 1,
            g: 1,
            h: 1,
            i: 2
        };
        x = {
            fldRejected: $('#cancelReason').val(),
            fldRemarks: 'Cancelled',
            fldApprovalCount: "3"
        };
    } else {
        data = {
            aCrl: ctrlNo,
            b: uLog.UserID,
            c: uLog.fldDept,
            d: getDate(),
            e: val,
            f: 1,
            g: 1,
            h: 1,
            i: 2
        };
        x = {
            fldRejected: $('#rejectReason').val(),
            fldRemarks: 'Rejected',
            fldApprovalCount: "3"
        };
    }
    console.log(x);
    o.rud("insert/tbl_logsrooms", [data]).then(res => {
        o.rud("update/tbl_roomreservations/fldRoomCtrlNo/" + ctrlNo, [x]).then(y => {
            sAlert();
        })
    });
}




