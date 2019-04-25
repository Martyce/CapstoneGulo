
    function viewNum(val){
        let longString = "";
        
        for(var i = 0; i < val; i++){
            longString += "<div class='cardforms'>";
            longString += '<input type="text" id="brandName_no'+i+'" placeholder="Brand Name">';
            longString += '<input type="text" id="initialCost_no'+i+'" placeholder="Initial Cost">';
            longString += '<input type="text" id="maintenanceFee_no'+i+'" placeholder="Maintenance Fee">';
            longString += '<input type="text" id="kWh_no'+i+'" placeholder="kWh" onblur="getDataChart('+i+')">';
            longString += '</div><br>';
        }
        $('#items').html(longString);
    }
    
    function getYearsChart(val){
        myChart.data.labels = [];

        let years = $('#years').val();
        let pos = ((1 + parseInt(years))/2)-1;
        
        myChart.data.labels.push("Year Number 1");    
        myChart.data.labels.push("Year Number " + Math.round(pos));    
        myChart.data.labels.push("Year Number " + years);    
        
        myChart.update();
    }
    
    function getDataChart(val){
        let years = $('#years').val();        
        let jsonObj = "";
        let parsedObj = "";
        let itemdata = [];
        let hrs = $('#hrs').val();
        let brandName = $('#brandName_no'+val).val();
        let initialCost = $('#initialCost_no'+val).val();
        let maintenanceFee = $('#maintenanceFee_no'+val).val();
        let kWh = $('#kWh_no'+val).val();
        kWh = ((kWh * hrs) * 365) * years;
        
        itemdata[0] = initialCost;
        itemdata[1] = maintenanceFee;
        itemdata[2] = kWh;
        
        
        jsonObj = JSON.parse('{ "label":"'+ brandName + '", "data":[' +itemdata+ ' ], "backgroundColor": "transparent", "borderColor": "'+pickRandomColor()+'"}');
        
        
        if(isNaN(checkChartArr(brandName))){
            console.log(jsonObj);
            myChart.data.datasets.push(jsonObj);
        } else{
            console.log(jsonObj);
            myChart.data.datasets.splice(checkChartArr(brandName), 1, jsonObj);  
        }
        myChart.update();
    }
    
    function checkChartArr(val){
        for(let i = 0; i < myChart.data.datasets.length; i++){
            if(val==myChart.data.datasets[i].label){
                return i;
            }
        }
        return "false";
    }
    
    //Chart
    
pickRandomColor();
    function pickRandomColor(){
       /* var CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];*/

        let CSS_COLORS = ["red", "blue", "green", "aqua", "black", "orange", "Aquamarine", "indigo", "brown", "green", "DarkOrchid", "CornflowerBlue", "Fuchsia", "Crimson", "DarkGoldenRod", "Chartreuse", "Purple"];
        
        return CSS_COLORS[Math.floor(Math.random() * 16) + 1];
    }
 var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {},
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
        }
    });