let url = "http://www.gordoncollegeccs-ssite.net/macionmart/capstoneapi/"
let userDet = {};

uLogOut = () => {
    localStorage.removeItem('userDet');
    window.location.assign('../index.html');
}


checkLogin = () =>{
    if(localStorage.userDet === undefined){
        window.location.assign("../index.html");
    }
}

checkLogOut = () =>{

}

getAccDet = () =>{
    userDet = JSON.parse(localStorage.userDet);
    $('#fullName').html(userDet.fldFullName);
    $('#officeName').html(userDet.fldDept + "   Office");
}

getUpdateset = () =>{
    userDet = JSON.parse(localStorage.userDet);
    let fullName = userDet.fldFullName.split(" ");
    $('#userdept').val(userDet.fldDept);    
    $('#userfname').val(fullName[0]);    
    $('#usermname').val(fullName[1]);    
    
    $('#userlname').val(fullName[2]);    
    $('#usercnum').val(userDet.fldContactNo);    
}
