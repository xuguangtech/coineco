var postUrl = window.emailSignupUrl;

$(document).ready(function () {


    $("#email-forms-holder").flip({
        trigger: 'manual'
    });
    $("#email-forms-holder").show();

    $('#email-sign-up-input').keypress(function (e) {
        if (e.which == 13) {
            submitEmailForm();
            return false;
        }
    });

    $( ".close-icon" ).click(function( event ) {

        var element = $("#email-forms-holder");
        var animation = 'bounceOutDown';

        element.addClass('animated ' + animation);

        var postData = {};
        postData[window.csrfTokenName] = window.csrfTokenValue;

        $.ajax({
            'type': 'post',
            'contentType': 'application/x-www-form-urlencoded; charset=UTF-8',
            'cache': false,
            'url': '/actions/solspacemailchimp/ajax/addCookie',
            'dataType': 'json',
            'timeout': 50000000,
            'data': postData
        }).done(function (data) {
            console.log('Cookie set successfully');
        }).error(function (jqXHR, textStatus, errorThrown) {
            console.log("Something went wrong: " + jQuery.parseJSON(jqXHR.responseText)['error']);
        });


    });

    $( "#emailSignUpButton" ).click(function( event ) {
        submitEmailForm();
    });

    function submitEmailForm() {
        var postData = {
            'email': $('#email-sign-up-input').val()
        };

        postData[window.csrfTokenName] = window.csrfTokenValue;

        console.log(postData);

        $.ajax({
            'type': 'post',
            'contentType': 'application/x-www-form-urlencoded; charset=UTF-8',
            'cache': false,
            'url': '/actions/solspacemailchimp/ajax/sendSignUp',
            'dataType': 'json',
            'timeout': 50000000,
            'data': postData
        }).done(function (data) {

            $(".email-back").show();
            $("#email-forms-holder").flip(true);
            $(".email-front").hide();

        }).error(function (jqXHR, textStatus, errorThrown) {

            var element = $('.email-form-wrapper');
            var animation = 'shake';

            element.addClass('animated ' + animation);
            window.setTimeout( function(){
                element.removeClass('animated ' + animation);
            }, 2000);

            console.log("Something went wrong: " + jQuery.parseJSON(jqXHR.responseText)['error']);
        });
    }

});