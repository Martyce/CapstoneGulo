printRes = (val, mobj, bobj = {}) =>{
    let ls = "";
    for(let i = 0; i < mobj.length; i++){
    let xls = document.getElementById(val).innerHTML;
    xls = xls.replace(/{{/g, "");
    xls = xls.replace(/}}/g, "");			
        for(let j in mobj[i]){
            console.log(j + " - " + mobj[i][j]);
            xls = xls.replace(new RegExp("\\b"+j+"\\b", 'g'), mobj[i][j]);
            for(let y in bobj){
                if(y == j){
                    if(mobj[i][j] != bobj[y]){
                        xls = "";
                    }
                }
            }
        }
        ls += xls;
    }
    document.getElementById(val).innerHTML = "";
    document.getElementById(val).innerHTML = ls;
}