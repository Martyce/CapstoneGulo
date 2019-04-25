
let fc = new Crud();

updateAcc = () => {
    userDet = JSON.parse(localStorage.userDet);
    let dt = {
        fldFullName: $('#userfname').val() + " " + $('#usermname').val() + " " + $('#userlname').val(),
        fldContactNo: $('#usercnum').val()
    }
    fc.rud("update/tbl_gcuser/fldseId/" + userDet.UserID, [dt]).then(x => {
        console.log(x);
        userDet = JSON.parse(localStorage.userDet);
        userDet.fldFullName = dt.fldFullName;
        userDet.fldContactNo = dt.fldContactNo;
        localStorage.userDet = JSON.stringify(userDet);


        swal({
            title: "Account Updated!",
            text: "Your account is successfully updated",
            type: "success",
            timer: 3000,
            showConfirmButton: true
        },
            function () {
            }
        );
    })
}

updatePass = () => {
    userDet = JSON.parse(localStorage.userDet);
    if ($('#cpass').val() == $('#npass').val()) {
        fc.read("tbl_gcuser/fldseId/" + userDet.UserID).then(x => {
            console.log(x);
            let dt = {
                fldPassword: $('#npass').val()
            };

            if ($('#opass').val() == x[0].fldPassword) {
                fc.rud("update/tbl_gcuser/fldseId/" + userDet.UserID, [dt]).then(x => {
                    console.log(x);

                    swal({
                        title: "Password succesfully Changed",
                        text: "Your password is successfully updated",
                        type: "success",
                        timer: 3000,
                        showConfirmButton: true
                    },
                        function () {
                            $('#cpass').val("");
                            $('#npass').val("");
                            $('#opass').val("");
                        }
                    );
                })
            } else {
                swal({
                    title: "Wrong Old Password",
                    type: "error",
                    timer: 3000,
                    showConfirmButton: true
                },
                    function () {
                    }
                );
            }
        })
    } else {
        swal({
            title: "Password didn't match",
            type: "error",
            timer: 3000,
            showConfirmButton: true
        },
            function () {
            }
        );
    }

}