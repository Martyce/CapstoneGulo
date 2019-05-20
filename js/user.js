let o = new Crud();
getEUser = (val) => {
    o.read(url + val).then(x => {
        console.log(x);
    });
}

$('#uploads_csv').on("submit", function (e) {
    e.preventDefault(); //form will not submitted  
    $.ajax({
        url: url + "/uploadcsv.php",
        method: "POST",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
            if (data == 'Error1') {
                alert("Invalid File");
            }
            else if (data == "Error2") {
                alert("Please Select File");
            }
        }
    })
});

addStudent = () => {

    if (ox('stdno').value == "" || ox('stdpass').value == "" || ox('stduname').value == "" || ox('stdfname').value == "" || ox('stduname').value == "" || ox('stdcont').value == "") {
        window.alert("Please make sure all required fields are filled out correctly");
    }

    else {


        let y = ox('stdpass').value;
        let z = ox('stdcpass').value;
        if (z == y) {
            let x = {
                a: ox('stdno').value,
                b: ox('stdfname').value,
                c: ox('stduname').value,
                d: ox('stdpass').value,
                e: ox('stddept').value,
                f: ox('stdcont').value,
                h: "Student",
                i: "Active"
            }
            console.log(x);
            window.alert("Student Successfully Added");
            window.location.assign("users.html");
            o.rud("insert/tbl_gcuser", [x]);
        } else {
            window.alert("Password didn't Match");
        }
    }
}

addEmployee = () => {
    if (ox('empno').value == "" || ox('emppass').value == "" || ox('empfname').value == "" || ox('empuname').value == "" || ox('empcont').value == "") {
        window.alert("Please make sure all required fields are filled out correctly");
    }

    else {
        let y = ox('emppass').value;
        let z = ox('empcpass').value;
        if (y.length < 8) {
            window.alert("Password is Less than 8 characters");
        } else {
            if (z == y) {
                let x = {
                    a: ox('empno').value,
                    b: ox('empfname').value,
                    c: ox('empuname').value,
                    d: ox('emppass').value,
                    e: ox('empdept').value,
                    f: ox('empcont').value,
                    h: ox('emppos').value,
                    i: "Active"
                }
                console.log(x);
                window.alert("Employee Successfully Added");
                o.rud("insert/tbl_gcuser", [x]).then(x => {
                    window.location.assign("users.html");
                });
            } else {
                window.alert("Password didn't Match");
            }
        }
    }
}

getStudent = () => {
    o.read("tbl_gcuser/fldAccType/Student").then(x => {
        let ls = "";

        x.map(y => {
            ls += '<tr>';
            ls += '<td>' + y.fldseId + '</td>';
            ls += '<td>' + y.fldFullname + '</td>';
            ls += '<td>' + y.fldUsername + '</td>';
            ls += '<td>' + y.fldDepartment + '</td>';
            ls += '<td>' + y.fldContactNo + '</td>';
            ls += '<td id="rseId' + y.fldseId + '">' + y.fldRemarks + '</td>';
            if (y.fldRemarks == "Pending") {
                ls += '<td id="seId' + y.fldseId + '"><button class="btn btn-success" onClick="updateStudent(\'Active\' , ' + y.fldseId + ')"><i class="fa fa-check"></i></button><button onClick="updateStudent(\'Inactive\' , ' + y.fldseId + ')" class="btn btn-danger"><i class="fa fa-times"></i></button></td>';
            } else {
                ls += '<td><button onClick="editStudent(' + y.fldseId + ')" class="btn btn-warning btn-rounded btn-sm" data-toggle="modal" data-target="#modalEditN"><i class="fa fa-pencil"></i></button></td>';
            }
            ls += '<tr>';
        });

        ox('stdtable').innerHTML = ls;
    })
}


let tbup = 0;
editStudent = (val) => {
    tbup = val;
    o.read("tbl_gcuser/fldseId/" + val).then(x => {
        $("#sestdno").val(x[0].fldseId);
        $("#sestdfname").val(x[0].fldFullname);
        $("#sestduname").val(x[0].fldUsername);
        $("#sempdept").val(x[0].fldDepartment).change();
        $("#semrem").val(x[0].fldRemarks).change();
    })
}

updateEditStudent = () => {
    let dt = {
        fldseId: $("#sestdno").val(),
        fldFullname: $("#sestdfname").val(),
        fldUsername: $("#sestduname").val(),
        fldDepartment: $("#sempdept").val(),
        fldRemarks: $("#semrem").val()
    }
    o.rud("update/tbl_gcuser/fldseId/" + tbup, [dt]).then(x => {
        window.alert("Student details updated");

        getStudent();
        $('#modalEditN').modal('hide');
    })
}

resetPwEditStudent = () => {
    let pwd = {
        fldPassword: "default123!"
    }
    o.rud("update/tbl_gcuser/fldseId/" + tbup, [pwd]).then(x => {
        window.alert("Password restored to default");
        getStudent();
        $('#modalEditN').modal('hide');
    })
}



editEmp = (val) => {
    tbup = val;
    o.read("tbl_gcuser/fldseId/" + val).then(x => {
        $("#uestdno").val(x[0].fldseId);
        $("#uestdfname").val(x[0].fldFullname);
        $("#uestduname").val(x[0].fldUsername);
        $("#uempdept").val(x[0].fldDepartment).change();
        $("#uemrem").val(x[0].fldRemarks).change();
    })
}

updateEditEmp = () => {
    let dt = {
        fldseId: $("#uestdno").val(),
        fldFullname: $("#uestdfname").val(),
        fldUsername: $("#uestduname").val(),
        fldDepartment: $("#uempdept").val(),
        fldRemarks: $("#uemrem").val()
    }
    o.rud("update/tbl_gcuser/fldseId/" + tbup, [dt]).then(x => {
        window.alert("Employee details updated");
        getEmployee();
        $('#modalEditU').modal('hide');
    })
}

resetPwEditEmp = () => {
    let pwd = {
        fldPassword: "default123!"
    }
    o.rud("update/tbl_gcuser/fldseId/" + tbup, [pwd]).then(x => {
        window.alert("Employee restored to default");
        getEmployee();
        $('#modalEditU').modal('hide');
    })
}


filterStudent = (val) => {
    o.read("tbl_gcuser/fldAccType/Student?LIKE=" + $('#stdfilterby').val() + " " + val).then(x => {
        let ls = "";

        x.map(y => {
            ls += '<tr>';
            ls += '<td>' + y.fldseId + '</td>';
            ls += '<td>' + y.fldFullname + '</td>';
            ls += '<td>' + y.fldUsername + '</td>';
            ls += '<td>' + y.fldDepartment + '</td>';
            ls += '<td>' + y.fldContactNo + '</td>';
            ls += '<td id="rseId' + y.fldseId + '">' + y.fldRemarks + '</td>';
            if (y.fldRemarks == "Pending") {
                ls += '<td id="seId' + y.fldseId + '"><button class="btn btn-success" onClick="updateStudent(\'Active\' , ' + y.fldseId + ')"><i class="fa fa-check"></i></button><button onClick="updateStudent(\'Inactive\' , ' + y.fldseId + ')" class="btn btn-danger"><i class="fa fa-times"></i></button></td>';
            }
            ls += '<tr>';
        });

        ox('stdtable').innerHTML = ls;
    })

    if (val == "" || val == undefined) {
        getStudent();
    }
}

updateStudent = (val, seId) => {
    if (val == "Active") {
        let data = {
            fldRemarks: 'Active'
        }
        o.rud("update/tbl_gcuser/fldseId/" + seId, [data]).then(x => {
            console.log(x);
            $('#seId' + seId).css("display", "none");
            $('#rseId' + seId).html("Active");

        })
    } else {
        let data = {
            fldRemarks: 'Inactive'
        }
        o.rud("update/tbl_gcuser/fldseId/" + seId, [data]).then(x => {
            console.log(x);
            $('#seId' + seId).css("display", "none");
            $('#rseId' + seId).html("Inactive");
        })
    }
}

getEmployee = () => {
    o.read("tbl_gcuser").then(x => {
        let ls = "";

        x.map(y => {
            if (y.fldAccType != "Student") {
                ls += '<tr>';
                ls += '<td>' + y.fldseId + '</td>';
                ls += '<td>' + y.fldFullname + '</td>';
                ls += '<td>' + y.fldUsername + '</td>';
                ls += '<td>' + y.fldDepartment + '</td>';
                ls += '<td>' + y.fldContactNo + '</td>';
                ls += '<td>' + y.fldAccType + '</td>';
                ls += '<td>' + y.fldRemarks + '</td>';
                ls += '<td><button onclick="editEmp('+ y.fldseId +')" class="btn btn-warning btn-rounded btn-sm" data-toggle="modal" data-target="#modalEditU"><i class="fa fa-pencil"></i></button></td>';

                ls += '<tr>';
            }
        });

        ox('emptable').innerHTML = ls;
    })
}


filterEmployee = (val) => {
    o.read("tbl_gcuser?LIKE=" + $('#empfilterby').val() + " " + val).then(x => {
        let ls = "";

        x.map(y => {
            if (y.fldAccType != "Student") {
                ls += '<tr>';
                ls += '<td>' + y.fldseId + '</td>';
                ls += '<td>' + y.fldFullname + '</td>';
                ls += '<td>' + y.fldUsername + '</td>';
                ls += '<td>' + y.fldDepartment + '</td>';
                ls += '<td>' + y.fldContactNo + '</td>';
                ls += '<td>' + y.fldAccType + '</td>';
                ls += '<td>' + y.fldRemarks + '</td>';
                ls += '<tr>';
            }
        });

        ox('emptable').innerHTML = ls;
    })

    if (val == "" || val == undefined) {
        getEmployee();
    }
}


getOut = () => {
    o.read("tbl_users").then(x => {
        let ls = "";

        x.map(y => {
            if (y.fldAccType != "Student") {
                ls += '<tr>';
                ls += '<td>' + y.fldUserID + '</td>';
                ls += '<td>' + y.fldFullName + '</td>';
                ls += '<td>' + y.fldEmailAdd + '</td>';
                ls += '<td>' + y.fldDept + '</td>';
                ls += '<td>' + y.fldContactNo + '</td>';
                ls += '<td>' + y.fldRemarks + '</td>';
                ls += '<td><button class="btn btn-warning"><i class="fa fa-pencil"></i></button></td>';
                ls += '<tr>';
            }
        });

        ox('outable').innerHTML = ls;
    })
}


filterUser = (val) => {
    o.read("tbl_users?LIKE=" + $('#userfilterby').val() + " " + val).then(x => {
        let ls = "";

        x.map(y => {
            if (y.fldAccType != "Student") {
                ls += '<tr>';
                ls += '<td>' + y.fldUserID + '</td>';
                ls += '<td>' + y.fldFullName + '</td>';
                ls += '<td>' + y.fldEmailAdd + '</td>';
                ls += '<td>' + y.fldDept + '</td>';
                ls += '<td>' + y.fldContactNo + '</td>';
                ls += '<td>' + y.fldRemarks + '</td>';
                ls += '<td><button class="btn btn-warning"><i class="fa fa-pencil"></i></button></td>';
                ls += '<tr>';
            }
        });

        ox('outable').innerHTML = ls;
    })

    if (val == "" || val == undefined) {
        getOut();
    }
}

ox = (val) => {
    return document.getElementById(val);
}
