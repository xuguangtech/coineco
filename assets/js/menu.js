var action = 1;

$(document).ready(function(){
	$('#nav-icon4').click(function(){
		$(this).toggleClass('open');

        var miniMenu = document.getElementById('miniMenu');

        var ratio = window.devicePixelRatio || 1;
        var w = screen.width * ratio;
        var h = screen.height * ratio;

        if(action == 1){

            if ($(window).width() <= 550) {
                if ($('.header-search').length) {
                    $("#miniMenu").animate({"top":"120px", "opacity":"1"}, 300);
                } else {
                    $("#miniMenu").animate({"top":"70px", "opacity":"1"}, 300);
                }
            } else {
                $("#miniMenu").animate({"top":"70px", "opacity":"1"}, 300);
            }

        action = 2;

        } else {

        $("#miniMenu").animate({"top":"-250px"}, 300);
            $("#miniMenu").promise().done(function(){
            $("#miniMenu").animate({"opacity":"0"}, 300);
            action = 1;

            });
        }

	});
});
