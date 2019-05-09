uLog = JSON.parse(localStorage.userDet);

callNav = () =>{
    if(uLog.fldDept == "MIS" || uLog.fldDept == "Supply"){
        $('#roomres').css("display", "none");
    } else {
        $('#roomres').css("display", "block");
    }
}

callNav();