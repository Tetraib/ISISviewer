$(document).on("pageinit", function() {
    // initialize selected frame
    var selectedframe = "frame1";
    $("#"+selectedframe).addClass("frameborder");
    
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
    'max-height': '100%'
    ,'max-width': '100%'
    ,'bottom': '0'
    });
     

    
    //Click on image frame
    $(".imageframe").on("mousedown", function() {
        $(".imageframe").removeClass("frameborder");
        $(this).addClass("frameborder");
        selectedframe = $(this).attr('id');
    });
    
    // Click on minidiv
    $(".minidiv").on("click", function(){
        var selectedimage;
        selectedimage = $(this).children("img").attr("src");
        console.log(selectedimage);
        $("#"+selectedframe +" img").attr("src", selectedimage);
    });
    
    //Click btn toolbar
    var selectedfunction = "nofunction";
    $('#'+selectedfunction).addClass("ui-btn-active");
    $(".btntoolbar").on("click", function(){
       
        selectedfunction = $(this).attr('id');
        $(".btntoolbar").removeClass("ui-btn-active");
        $(this).addClass("ui-btn-active");
    });
});