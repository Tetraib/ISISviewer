$(document).on("pageinit", function() {
    $(".minilist").niceScroll();
    $(".imageframe").niceScroll();
    $(".imageframe img").css({'max-height':'100%','max-width':'100%'});
    $(".imageframe img").removeAttr('style');
    $(".imageframe img").css({'height':'150%'});
});