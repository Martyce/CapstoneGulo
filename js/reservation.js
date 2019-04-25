let ctrlNo = "";
let user = "";
let evtDt = "";
let evtMat = "";
let evtSpk = "";
let o = new Crud();
uLog = JSON.parse(localStorage.userDet);




loadAllDatas = () => {
    fetch(url + "fullfunc/tbl_reservations").then(res => res.json()).then(function (data) {
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


    });


}




pullData = async (val) => {
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

            if (x.fldRemarks == "In progress") {
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


let sfunc = (x) => {
    $("#bdown").css("display", "flex");
    $("#adown").css("display", "none");
    ctrlNo = x;
    pullData(x);
}
let sAlert = () => {
    swal({
        title: "Transaction # is successfully accepted",
        text: "The transaction will now be forwarded to MIS, Supply, Security and Maintenance Office",
        type: "success",
        timer: 3000,
        showConfirmButton: false
    },
        function () {
            window.location.assign('reservations.html');
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

    return month + "/" + day + "/" + year + " " + h + ":" + m + ":" + s;
}

let submitData = (val) => {
    let data = {};
    let x = {};
    if (val == "Processing") {
        data = {
            aCrl: ctrlNo,
            b: uLog.UserID,
            c: uLog.fldDept,
            d: getDate(),
            e: val,
            f: 2,
            g: 1,
            h: 2,
            i: 2,
            j: 2,
            k: 2,
            l: 2
        };
        x = {
            fldRemarks: "Accepted",
            fldApprovalCount: "2"
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
            h: 0,
            i: 0,
            j: 0,
            k: 0,
            l: 2
        };
        x = {
            fldRejected: $('#cancelReason').val(),
            fldRemarks: 'Cancelled',
            fldApprovalCount: "2"
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
            h: 0,
            i: 0,
            j: 0,
            k: 0,
            l: 2
        };
        x = {
            fldRejected: $('#rejectReason').val(),
            fldRemarks: 'Rejected',
            fldApprovalCount: "2"
        };
    }
    console.log(x);
    o.rud("insert/tbl_logsfunc", [data]).then(res => {
        o.rud("update/tbl_reservations/fldCtrlNo/" + ctrlNo, [x]).then(y => {
            sAlert();
        })
    });
}




let getU = (param) => {
    var vars = {};
    window.location.href.replace(location.hash, '').replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function (m, key, value) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if (param) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
}

if(getU('ctrlNo') !== null){
    sfunc(getU('ctrlNo'));
}
