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

addEmployee = () => {
    let y = ox('emppass').value;
    let z = ox('empcpass').value;
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
        window.location.assign("users.html");
        o.rud("insert/tbl_gcuser", [x]);
    } else {
        window.alert("Password didn't Match");
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
            ls += '<td>' + y.fldRemarks + '</td>';
            ls += '<td><button class="btn btn-success"><i class="fa fa-check"></i></button><button class="btn btn-danger"><i class="fa fa-times"></i></button></td>';      
            ls += '<tr>';
        });

        ox('stdtable').innerHTML = ls;
    })
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
                ls += '<tr>';
            }
        });

        ox('emptable').innerHTML = ls;
    })
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

ox = (val) => {
    return document.getElementById(val);
}
