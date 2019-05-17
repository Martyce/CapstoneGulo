let ctrlNo = "";
let user = "";
let evtDt = "";
let evtMat = "";
let evtSpk = "";
let o = new Crud();
uLog = JSON.parse(localStorage.userDet);

loadAllDatas = () => {
    fetch(url + "tbl_equipreservations?ORDERBY=fldEqID DESC").then(res => res.json()).then(function (data) {
        let yz = [];
        data.map(x => {
            if ((x.fldRemarks != 'Renew')) {
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
            "order": [[0, "desc"]],
            "scrollY": "490px",
            "scrollCollapse": true,
            'sort': true,
            retrieve: true,
            searching: true,
            data: yz,
            columns: [
                { 'data': 'fldEqID' },
                { 'data': 'fldUserID' },
                { 'data': 'fldDepartment' },
                { 'data': 'fldDateBorrowFrom' },
                { 'data': 'fldDateBorrowTo' },
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
                        }
                        else if (stats == "Pending") {
                            color = 'text-success';
                            badge = 'badge badge-primary'
                        } else {
                            color = 'text-warning';
                            badge = 'badge badge-warning'
                        }

                        return "<span class='" + badge + "'>" + stats + "</span></label>";
                    }

                },
                {
                    'data': 'fldEqID',
                    'render': function (id) {
                        return '<a onclick=sfunc("' + id + '") data-toggle="tooltip" title="Default tooltip"><span class="badge badge-pill blue">View</span></a>'
                    }
                }
            ]
        }).clear().rows.add(yz).draw();
        $('.dataTables_length').addClass('bs-select');
    });


}




pullData = async (val) => {
    await fetch(url + "tbl_equipreservations/fldEqID/" + val).then(res => res.json()).then(function (data) {
        console.log(data);
        data.map(x => {
            $('#evName').html(x.fldVenue);
            $('#evType').html(x.fldDepartment);
            $('#evDesc').html(x.fldDateBorrowFrom);
            $('#evFac').html(x.fldDateBorrowTo);
            user = x.fldUserID;
            $('#tNo').html(x.fldEqID);
            console.log(x.fldRemarks);
            if (x.fldRemarks == "Pending") {
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

    fetch(url + "tbl_equipspec/fldEqID/" + val).then(res => res.json()).then(function (data) {
        let ls = "";
        data.map(x => {

            ls+= '<tr>';
            ls+= '<td>'+ x.fldItemName +'</td>';
            ls+= '<td>'+ x.fldItemQty +'</td>';
            ls+= '<td>'+  x.fldItemRemarks +'</td>';
            ls+= '</tr>';
            //ls += '<p class="text-left font-weight-light" id="fldTime">' + x.fldItemName + ' - ' + x.fldItemQty + ' Status: ' + x.fldItemRemarks + '</p>'
        });

        $('#pending_tbldata').html(ls);
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
            window.location.assign('equipreservations.html');
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
    if (val == "Pending") {
        val = "Processing";
        data = {
            aCrl: ctrlNo,
            b: uLog.UserID,
            c: uLog.fldDept,
            d: getDate(),
            e: val,
            f: 1,
            g: 2,
            h: 1,
            i: 1,
            j: 1,
            k: 2
        };
        x = {
            fldRemarks: val,
            fldApprovalCount: "1"
        };
    } else if (val == "Cancel") {
        data = {
            aCrl: ctrlNo,
            b: uLog.UserID,
            c: uLog.fldDept,
            d: getDate(),
            e: val,
            f: 2,
            g: 1,
            h: 1,
            i: 1,
            j: 1,
            k: 2
        };
        x = {
            fldRejected: $('#cancelReason').val(),
            fldRemarks: 'Cancelled',
            fldApprovalCount: "0"
        };
    } else {
        data = {
            aCrl: ctrlNo,
            b: uLog.UserID,
            c: uLog.fldDept,
            d: getDate(),
            e: val,
            f: 2,
            g: 1,
            h: 1,
            i: 1,
            j: 1,
            k: 2
        };
        x = {
            fldRejected: $('#rejectReason').val(),
            fldRemarks: 'Rejected',
            fldApprovalCount: "0"
        };
    }
    console.log(x);
    o.rud("insert/tbl_logsequip", [data]).then(res => {
        o.rud("update/tbl_equipreservations/fldEqID/" + ctrlNo, [x]).then(y => {
            sAlert();
        })
    });
}

let sback = () => {
    $("#bdown").css("display", "none");
    $("#adown").css("display", "block");
}





