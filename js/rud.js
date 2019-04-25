class Crud {

    constructor() {
    }

    rud(tbl, data) {
        return fetch(url + tbl, {
            method: "POST",
            body: JSON.stringify(data)
        }).then(res => res.json()).then(function (data) {
            return data;
        })
    }

    async read(tbl) {
        let x = await fetch(url + tbl).then(res => res.json()).then(function (data) {
            return data;
        });

        return x;
    }

    uLogin(un, pw) {
        let data = {
            un: un.value,
            pw: pw.value
        }
        console.log(data);
        fetch(url + "login", {
            method: "POST",
            body: JSON.stringify(data)
        }).then(res => res.json()).then(function (data) {
            console.log(data);
            if (data.Authorize != "False") {
                console.log("True")
                if (data.Authorize == "Deptartment Head" || data.Authorize == "Dean" || data.fldDept == "MIS" || data.fldDept == "Supply" || data.fldDept == "Security" || data.fldDept == "MIS" || data.fldDept == "Maintenance" || data.fldDept == "AcademicAffairs" || data.fldDept == "Registrar") {
                    window.location.assign("OTOffice/reservations.html");
                    localStorage.userDet = JSON.stringify(data);
                } else if (data.fldDept == "VPOffice") {
                    window.location.assign("VPOffice/index.html");

                    localStorage.userDet = JSON.stringify(data);
                } else {
                    swal({
                        title: "Invalid Login Credentials",
                        text: "Please Double Check your details",
                        type: "error",
                        timer: 3000,
                        showConfirmButton: true
                    })
                }
            } else {
                swal({
                    title: "Invalid Login Credentials",
                    text: "Please Double Check your details",
                    type: "error",
                    timer: 3000,
                    showConfirmButton: true
                })
            }
        });
    }

}



