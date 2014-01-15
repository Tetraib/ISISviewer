$(document).on("pageinit", function() {
    // initialize selected frame
    var selectedframe = "frame1";
    $("#" + selectedframe).addClass("frameborder");

    //disable image drag and drop
    $('.imageframe, .minidiv').on('dragstart', function(event) {
        event.preventDefault();
    });

    //custom scrollbar
    $(".minilist").niceScroll();
    $(".imageframe").niceScroll();

    //set the zomm level
    $(".imageframe img").css({
        // Delete max-height / max-width and bottom for zooming
        'max-height': '100%',
        'max-width': '100%',
        'bottom': '0'
    });



    //Click on image frame
    $(".imageframe").on("mousedown", function() {
        $(".imageframe").removeClass("frameborder");
        $(this).addClass("frameborder");
        selectedframe = $(this).attr('id');
    });
    // Click on minidiv
    $(".minidiv").on("click", function() {
        var selectedimage;
        selectedimage = $(this).children("img").attr("src");
        $("#" + selectedframe + " img").attr("src", selectedimage);
    });

    //Click btn toolbar
    var selectedfunction = "nofunction";
    $('#' + selectedfunction).addClass("ui-btn-active");
    $(".btntoolbar").on("click", function() {

        selectedfunction = $(this).attr('id');
        $(".btntoolbar").removeClass("ui-btn-active");
        $(this).addClass("ui-btn-active");

        switch (selectedfunction) {
        case "nofunction":
            $(".imageframe").off('mouseenter');
            $("#frames").off('mousemove');
            break;
        case "magniglass":
            //
            // mag glass
            var native_width;
            var native_height;
            var imageover;

            var image_offset;
            var zoomlevel = 1.5;
            var image_object = new Image();
            //Set image mag
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

            $("#frames").on("mousemove", function(e) {
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
            console.log("lightcontr");
            break;
        }
    });



});
