$(document).on("pageinit", function() {
    // initialize selected frame
    var selectedframe;

    //disable image drag and drop
    $('.imageframe, .minidiv').on('dragstart', function(event) {
        event.preventDefault();
    });
    //custom scrollbar
    $(".minilist").niceScroll();
    // For frame 100%
    // $(".imageframe").niceScroll();

    //set the zomm level
    $(".imageframe img").css({
        // Delete max-height / max-width / bottom  for 100% frame
        'max-height': '100%',
        'max-width': '100%',
        'bottom': '0'
    });
    //Click on image frame
    $(".imageframe").on("vmousedown", function() {
        $(".imageframe").removeClass("frameborder");
        $(this).addClass("frameborder");
        selectedframe = $(this).attr('id');
    });
    // Click on minidiv
    $(".minidiv").on("vclick", function() {
        var selectedimage;
        selectedimage = $(this).children("img").attr("src");
        $("#" + selectedframe + " img").attr("src", selectedimage);
    });
    //Click btn toolbar
    var selectedfunction = "nofunction";
    $('#' + selectedfunction).addClass("ui-btn-active");
    $(".btntoolbar").on("vclick", function() {
        selectedfunction = $(this).attr('id');
        $(".btntoolbar").removeClass("ui-btn-active");
        $(this).addClass("ui-btn-active");
        var imageover;
        switch (selectedfunction) {
        case "nofunction":
            // cancel all functions
            $(".imageframe").off('mouseenter');
            $("#frames").off('vmousemove');
            $(".imageframe").off("vmousedown.lightcontr");
            $(document).off("vmousemove");
            $(document).off("vmouseup");
            break;
        case "magniglass":
            $(".imageframe").off("vmousedown.lightcontr");
            $(document).off("vmousemove");
            $(document).off("vmouseup");
            // MAG GLASS
            var native_width;
            var native_height;
            var image_offset;
            var zoomlevel = 1.5;
            var image_object = new Image();
            //Set mag image background
            $(".imageframe").on('mouseenter', function() {
                if (imageover != "#" + $(this).attr('id') + " img") {
                    imageover = "#" + $(this).attr('id') + " img";
                    image_object.src = $(imageover).attr("src");
                    image_object.onload = function() {
                        native_width = (image_object.width) * zoomlevel;
                        native_height = (image_object.height) * zoomlevel;
                        image_offset = $(imageover).offset();
                        $('#mag').css({
                            'background': "url(" + $(imageover).attr("src") + ") no-repeat",
                            'background-size': native_width
                        });
                    };
                }
            });
            $("#frames").on("vmousemove", function(e) {
                //check if image is loaded
                if (image_offset) {
                    var mx = e.pageX - image_offset.left;
                    var my = e.pageY - image_offset.top;
                    if (mx < $(imageover).width() && my < $(imageover).height() && mx > 0 && my > 0) {
                        $("#mag").fadeIn(100);
                        //move mag div
                        var px = e.pageX - $("#mag").width() / 2;
                        var py = e.pageY - $("#mag").height() / 2;
                        var rx = Math.round(mx / $(imageover).width() * native_width - $("#mag").width() / 2) * -1;
                        var ry = Math.round(my / $(imageover).height() * native_height - $("#mag").height() / 2) * -1;
                        var bgp = rx + "px " + ry + "px";
                        $('#mag').css({
                            'left': px,
                            'top': py,
                            'backgroundPosition': bgp
                        });
                    }
                    else {
                        $("#mag").fadeOut(100);
                    }
                }
            });
            break;
        case "lightcontr":
            $(".imageframe").off('mouseenter');
            $("#frames").off('vmousemove');
            //LIGHT AND CONTRAST

            $(".imageframe").on("vmousedown.lightcontr", function(e) {
                //get the initial cursor position
                var initialpx = e.pageX;
                var initialpy = e.pageY;
                var imagetochange = "#" + $(this).attr("id") + " img";
                $(document).on("vmousemove", function(e) {
                    //get the difference with initial position of cursor
                    var decalgey = initialpy - e.pageY;
                    var decalgex = initialpx - e.pageX;
                    //change css valu of the image
                    $(imagetochange).css({
                        "-webkit-filter": "contrast(" + (1 + decalgey / 200) + ") brightness(" + (1 + decalgex / 200) + ")"
                    });
                });
            });
            $(document).on("vmouseup", function() {
                $(document).off("vmousemove");
            });
            break;
        }
    });
    //
    //Display grid
   var displaygrid = function(){
        var selectedgrid;
        var autoframe = [11,12,13,22,23,23,24,24,33,34,34,34,35,35,35,44,45,45,45,45,55,55,55,55,55];
        var framelist = [11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35, 41, 42, 43, 44, 45, 51, 52, 53, 54, 55];
        if($("#gridchoice option:selected").val()=="auto"){
            selectedgrid=autoframe[$('.minidiv').length-1];
            console.log($('.minidiv').length);
        }else{
                selectedgrid = $("#gridchoice option:selected").val();

        }
        var selectedgridten = Math.floor(selectedgrid / 10);
        var selectedgridunit = selectedgrid % 10;
        for (var i = 0; i < framelist.length; i++) {
            var framelistten = Math.floor(framelist[i] / 10);
            var framelisunit = framelist[i] % 10;
            if (framelistten > selectedgridten || framelisunit > selectedgridunit) {
                $("#frame" + framelist[i]).css({
                    opacity: 0
                });
                $("#frame" + framelist[i]).css({
                    visibility: 'hidden'
                });
            }
            else {
                $("#frame" + framelist[i]).css({
                    visibility: 'visible'
                });
                $("#frame" + framelist[i]).attr('class', 'imageframe').css({
                    opacity: 1
                }).addClass("splith_" + selectedgridunit + "-" + framelisunit).addClass("splitv_" + selectedgridten + "-" + framelistten * 10);
            }
        }
    };
    displaygrid();
    $("#gridchoice").on("change", function() {
        displaygrid();
    });

});
