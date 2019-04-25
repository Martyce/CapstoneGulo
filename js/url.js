let url = "http://www.gordoncollegeccs-ssite.net/macionmart/capstoneapi/"



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