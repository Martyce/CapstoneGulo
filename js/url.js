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
    $('#officeName').html(userDet.fldDept + " Office");
}