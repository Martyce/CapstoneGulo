let datas = {};
let dtLen = 0;
let allDt = [];
let oItems = [];
let oVip = [];
let oFees = [];
let xctrlNo = 0;
let feeSend = {}
let fc = new Crud();
// SideNav Initialization
$(".button-collapse").sideNav();
$(document).ready(function () { // everything comes under document.ready 
    $('#mdp-demo').multiDatesPicker({
        altField: '#altField',
        minDate: 2,
        onSelect: function () {
            let z = $('#mdp-demo').multiDatesPicker('getDates');
            o.read("fordt/tbl_reservedates/fldCtrlNo/tbl_reservations/fldCtrlNo/tbl_reservedates.fldEventDate?dt=" + z[z.length - 1]).then(x => {
                let ox = [];
                x.map(y => {
                    if (y.fldRemarks == "Accepted") {
                        ox.push(y);
                    }
                });
                console.log(ox);
            });

            allDt = z;
            dtLen = z.length;
            let ls = '';
            for (let i = 0; i < z.length; i++) {
                ls += '<br><div> <h5>' + z[i] + '</h5> </div> <div class="input-form"> <label>Start Time:</label> <input type="time" id="ftime' + i + '" min="08:00:00" max="20:00:00" required> </div> <div class="input-form"> <label>End Time:</label> <input type="time" id="ttime' + i + '" min="08:00:00" max="20:00:00" required> </div>';
            }

            $('#items').html(ls);
        }

    });
});



setCtrlNo = () => {
    fc.read("tbl_reservations").then(data => {
        xctrlNo = data.length + 201801;
    })
}

setAllDates = () => {
    datas.dtEvent = [];
    for (let i = 0; i < dtLen; i++) {
        datas.dtEvent.push({
            actrlNo: 0,
            b: allDt[i],
            c: $('#ftime' + i).val(),
            d: $('#ttime' + i).val()
        });
    }
    console.log(datas);
}

setAllDet = () => {
    datas.evtDet = {
        actrlNo: 0,
        b: $('#evtFac').val(),
        c: $('#evtTitle').val(),
        d: $('#evtReq').val(),
        e: $('#evtOrg').val(),
        f: $('#evtCon').val(),
        g: $('#evtType').val() != "Others" ? $('#evtType').val() : $('#evtType_t').val(),
        h: $('#evtDesc').val(),
    }

    console.log(datas);
}



setAllEquip = () => {
    datas.evtMat = [];
    let smb = $('#smb').val();
    let amc = $('#amc').val();
    let xtbl = $('#xtbl').val();
    let mic = $('#mic').val();
    let spk = $('#spk').val();
    let wbd = $('#wbd').val();

    if (smb != "0" && smb != "") {
        datas.evtMat.push({
            actrlNo: 0,
            b: "Single Monoblock",
            c: smb
        });
    }

    if (amc != "0" && amc != "") {
        datas.evtMat.push({
            actrlNo: 0,
            b: "Arm Chairs",
            c: amc
        });
    }

    if (xtbl != "0" && xtbl != "") {
        datas.evtMat.push({
            actrlNo: 0,
            b: "Tables",
            c: xtbl
        });

    }

    if (mic != "0" && mic != "") {
        datas.evtMat.push({
            actrlNo: 0,
            b: "Microphones",
            c: mic
        });
    }

    if (spk != "0" && spk != "") {
        datas.evtMat.push({
            actrlNo: 0,
            b: "Speakers",
            c: spk
        });
    }

    if (wbd != "0" && wbd != "") {
        datas.evtMat.push({
            actrlNo: 0,
            b: "Whiteboard",
            c: wbd
        });
    }
    for (let i = 0; i < oItems.length; i++) {
        datas.evtMat.push({
            actrlNo: 0,
            b: oItems[i].b,
            c: oItems[i].c
        })
    }
    console.log(datas);
}


setAllOthers = () => {
    datas.rVip = [];


    datas.evtDet.i = $('#noOut').val();
    datas.evtDet.j = $('#noIn').val();
    datas.evtDet.k = $('#fc').val();
    datas.evtDet.l = $('#noUsher').val();
    datas.evtDet.m = getDate();
    datas.evtDet.n = 'Accepted';
    datas.evtDet.o = '1';
    datas.evtDet.p = '-';

    datas.rVip = oVip;

    console.log(datas);
}

setAllFees = () => {
    console.log(oFees);
    let finalDt = {
        actrlNo: xctrlNo,
        dCharge: ""
    };

    if (parseInt($('#spacefee').val()) != 0) {
        let x = {
            actrlNo: 0,
            b: "Space Fee",
            c: $('#spacefee').val()
        }
        oFees.push(x);
    }

    if (parseInt($('#tablefee').val()) != 0) {
        let x = {
            actrlNo: 0,
            b: "Table Fee",
            c: $('#tablefee').val()
        }
        oFees.push(x);
    }

    if (parseInt($('#chairfee').val()) != 0) {
        let x = {
            actrlNo: 0,
            b: "Chair Fee",
            c: $('#chairfee').val()
        }
        oFees.push(x);
    }

    if (parseInt($('#projectorfee').val()) != 0) {
        let x = {
            actrlNo: 0,
            b: "Projector Fee",
            c: $('#projectorfee').val()
        }
        oFees.push(x);
    }

    oFees.map((x,i)=>{
        finalDt.dCharge += i != oFees.length -1 ? oFees[i].b + " - " +  oFees[i].c + " | " : oFees[i].b + " - " +  oFees[i].c;
    });
    feeSend = finalDt;
    console.log(finalDt);   
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


addOtheritem = () => {
    let x = {
        actrlNo: 0,
        b: $('#oIn').val(),
        c: $('#oIq').val()
    }
    oItems.push(x);
    $('#oIn').val("");
    $('#oIq').val("");
    viewOtherItem();
}

viewOtherItem = () => {
    let ls = "";
    for (let i = 0; i < oItems.length; i++) {
        ls += '<tr>';
        ls += '<td><h5>' + oItems[i].b + '</h5></td>';
        ls += '<td><h5> - ' + oItems[i].c + '</h5></td>';
        ls += '<td> - <a onclick="remItem(' + i + ')" style="color: red"><i class="fa fa-close"></i></a></td>';
        ls += '</tr>';
    }

    $('#oItem').html(ls);
}

remItem = (val) => {
    oItems.splice(val, 1);
    viewOtherItem();
}

addVip = () => {
    let x = {
        actrlNo: 0,
        b: $('#gvip').val()
    }
    oVip.push(x);
    $('#gvip').val("");
    viewVip();

}


viewVip = () => {
    let ls = '';
    for (let i = 0; i < oVip.length; i++) {
        ls += '<div style="flex-center"><h4>' + oVip[i].b + ' - <a onclick="remVip(' + i + ')" style="color:red"><i class="fa fa-close"></i></a></h4> </div>';

    }
    $('#rvip').html(ls);
}

remVip = (val) => {
    oVip.splice(val, 1);
    viewVip();
}

addFee = () => {
    let x = {
        actrlNo: 0,
        b: $('#feename').val(),
        c: $('#feeamt').val()
    }
    oFees.push(x);
    $('#feeamt').val("");
    $('#feename').val("");
    viewFee();

}

viewFee = () => {
    let ls = '';
    for (let i = 0; i < oFees.length; i++) {
        ls += '<div style="flex-center"><h4>' + oFees[i].b + ' - &#8369; ' + oFees[i].c + ' <a onclick="remFee(' + i + ')" style="color:red"><i class="fa fa-close"></i></a></h4> </div>';
    }
    $('#ofees').html(ls);
}

remFee = (val) => {
    oFees.splice(val, 1);
    viewFee();
}

viewData = () => {
    $('#xevtFac').html(datas.evtDet.b);
    $('#xevtName').html(datas.evtDet.c);
    $('#xevtReq').html(datas.evtDet.d);
    $('#xevtDept').html(datas.evtDet.e);
    $('#xevtCont').html(datas.evtDet.f);
    $('#xevtType').html(datas.evtDet.g);
    $('#xevtDesc').html(datas.evtDet.h);
    $('#xevtOut').html(datas.evtDet.i);
    $('#xevtIn').html(datas.evtDet.j);
    $('#xevtCater').html(datas.evtDet.k);
    $('#xevtUsher').html(datas.evtDet.l);

    let dte = "";
    datas.dtEvent.map(x => {
        dte += '<tr>';
        dte += '<td>' + x.b + '</td>';
        dte += '<td>' + x.c + '</td>';
        dte += '<td>' + x.d + '</td>';
        dte += '</tr>';
    })
    $('#tblDt').html(dte);

    let dtm = "";
    datas.evtMat.map(x => {
        dtm += '<tr>';
        dtm += '<td>' + x.b + '</td>';
        dtm += '<td>' + x.c + '</td>';
        dtm += '</tr>';
    });
    $('#tblMat').html(dtm);

    let xrvipl = "";
    datas.rVip.map(x => {
        xrvipl += '<tr>';
        xrvipl += '<td>' + x.b + '</td>';
        xrvipl += '</tr>';
    })

    $('#xtblrvip').html(xrvipl);
}


setAll = () => {
    setCtrlNo();
    setAllDates();
    setAllDet();
    setAllEquip();
    setAllOthers();
    setAllFees();
    viewData();
}

sendData = () => {
    let x = confirm("Are you sure?");

    if (x) {
        let logsData = {
            aCrl: xctrlNo,
            b: datas.evtDet.d,
            c: datas.evtDet.e,
            d: getDate(),
            e: "Accepted",
            f: 1,
            g: 1,
            h: 2,
            i: 2,
            j: 2,
            k: 2,
            l: 2
        }


        datas.evtDet.actrlNo = xctrlNo;

        datas.dtEvent.map((x, i) => {
            datas.dtEvent[i].actrlNo = xctrlNo
        });

        datas.evtMat.map((x, i) => {
            datas.evtMat[i].actrlNo = xctrlNo
        });

        datas.rVip.map((x, i) => {
            datas.rVip[i].actrlNo = xctrlNo
        })

        oFees.map((x, i)=>{
            oFees[i].actrlNo = xctrlNo;
        });

        feeSend.actrlNo = xctrlNo;
        fc.rud("insert/tbl_logsfunc/", [logsData]).then(y => {

        });

        fc.rud("insert/tbl_reservations/", [datas.evtDet]).then(y => {

        });


        fc.rud("insert/tbl_reservedates/", datas.dtEvent).then(y => {

        });

        fc.rud("insert/tbl_materials/", datas.evtMat).then(y => {

        });


        fc.rud("insert/tbl_billings/", [feeSend]).then(y => {

        });        

        fc.rud("insert/tbl_rvip/", datas.rVip).then(y => {
            swal({
                title: "Your transaction has been made",
                text: "Please wait until the various offices accept",
                type: "success",
                timer: 3000,
                showConfirmButton: false
            },
                function () {
                    window.location.assign('reservations.html?ctrlNo=' + xctrlNo);
                }
            );
        });

    }
}

var container = document.querySelector('.custom-scrollbar');
Ps.initialize(container, {
    wheelSpeed: 2,
    wheelPropagation: true,
    minScrollbarLength: 20
});
