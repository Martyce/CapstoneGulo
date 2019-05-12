
let callTap = () => {
    o.read("tbl_reservations/fldRemarks/In progress").then(x => {
        console.log(x);
        let ls = "";


        if (x.length > 0) {
            ls = x.length;

            swal({
                title: "You have " + x.length + " pending approval",
                text: "Do you wish to view it now?",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: 'Yes!',
                cancelButtonText: 'No',
            }, function (isConfirm) {
                console.log(isConfirm);
                if (isConfirm) {
                    window.location.assign("reservations.html");
                }
            });
        }



        $('#frl').html(ls);


    })
}


callTap();