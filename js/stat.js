
let datas = {};
getDatas = () => {
    fetch(url + "tbl_reservations/fldRemarks/Accepted/").then(res => res.json()).then(data => {
        datas.res = data.length;
        fetch(url + "tbl_roomreservations/fldRemarks/Accepted/").then(res => res.json()).then(data => {
            datas.rres = data.length;
            fetch(url + "tbl_equipreservations/fldRemarks/Accepted/").then(res => res.json()).then(data => {
                datas.eres = data.length;
                callChart();
            });
        });
    });
    console.log(datas);
}

convDte = (val) => {
    var months = ["", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    return months[val];
}

getUser = () => {
    fetch(url + "tbl_gcuser").then(res => res.json()).then(data => {
        let studentCount = 0;
        let employeeCount = 0;
        data.map(x => {
            if (x.fldAccType == "Student") {
                studentCount++;
            } else {
                employeeCount++;
            }
        });
        $('#tos').html(studentCount);
        $('#toe').html(employeeCount);

    });

    fetch(url + "tbl_users").then(res => res.json()).then(data => {
        $('#too').html(data.length);
    });

    fetch(url + "getdb.php?q=mrm").then(res => res.json()).then(data => {
        let ls = "";
        data.map((x, i) => {
            ls += '<tr>';
            ls += '<td>' + (i + 1) + '</td>';
            ls += '<td>' + x.Fields + '</td>';
            ls += '<td>' + x.fldNumbers + '</td>';
            ls += '</tr>'
        });
        $('#mrm').html(ls);
    })

    fetch(url + "getdb.php?q=meq").then(res => res.json()).then(data => {
        let ls = "";
        data.map((x, i) => {
            ls += '<tr>';
            ls += '<td>' + (i + 1) + '</td>';
            ls += '<td>' + x.Fields + '</td>';
            ls += '<td>' + x.fldItemQty + '</td>';
            ls += '</tr>'
        });
        $('#meq').html(ls);
    })

    fetch(url + "getdb.php?q=weeklystat").then(res => res.json()).then(data => {
        let ls = "";

        let xlabels = [];
        let datas = [];

        data.map((x, i) => {
            xlabels.push("Week Number " + x.week);
            datas.push(x.Count);
            ls += '<tr>';
            ls += '<td> Week ' + x.week + '</td>';
            ls += '<td>' + x.Count + '</td>';
            ls += '</tr>'
        });
        $('#wstat').html(ls);



        var ctx = document.getElementById("fac").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xlabels,
                datasets: [{
                    label: '# of Reservations',
                    data: datas,
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 159, 64, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    });

    fetch(url + "getdb.php?q=monthlystat").then(res => res.json()).then(data => {
        let ls = "";
        let xlabels = [];
        let datas = [];
        data.map((x, i) => {
            xlabels.push(convDte(x.Month));
            datas.push(x.Count);
            ls += '<tr>';
            ls += '<td>' + convDte(x.Month) + '</td>';
            ls += '<td>' + x.Count + '</td>';
            ls += '</tr>'
        });
        $('#mstat').html(ls);

        var ctx = document.getElementById("labroom").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xlabels,
                datasets: [{
                    label: '# of Reservation',
                    data: datas,
                    backgroundColor: [
                        'rgba(25, 200, 100, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(25, 200, 100, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    });


    fetch(url + "getdb.php?q=yearlystat").then(res => res.json()).then(data => {
        let ls = "";
        let xlabels = [];
        let datas = [];
        data.map((x, i) => {
            xlabels.push(x.Year);
            datas.push(x.Count);
            ls += '<tr>';
            ls += '<td>' + x.Year + '</td>';
            ls += '<td>' + x.Count + '</td>';
            ls += '</tr>'
        });
        $('#ystat').html(ls);


        var ctx = document.getElementById("equip").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xlabels,
                datasets: [{
                    label: '# of Reservations',
                    data: datas,
                    backgroundColor: [
                        'rgba(75, 150, 200, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(75, 150, 200, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });
}
getUser();


getDatas();
callChart = () => {
    let ctx = document.getElementById("monthly").getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Rooms and Laboratories", "Function Rooms", "Equipments"],
            datasets: [{
                label: '# of Reservations',
                data: [datas.rres, datas.res, datas.eres],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
