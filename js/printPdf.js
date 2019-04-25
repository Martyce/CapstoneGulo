       var doc = new jsPDF('a4');

	doc.internal.scaleFactor = 7;
    doc.addHTML($('#mybody')[0], 0, 5, {
	  'background': '#fff',
	  'pagesplit': true,
	  margin: {
		  top: 20,
		  bottom: 20,
	  }
    }, function() {    
    doc.addFont('fonts/calibri.ttf', 'Calibri', 'normal');
	doc.setFont('Calibri');
    doc.setFontType("bold");
    doc.setFontSize(300);
	
    doc.save('sample-file.pdf');

    });

