// Report
$('.report-toggle').on('click', function(e) {
	e.preventDefault();
	$('#popupReport').toggleClass('is-visible');
	$('#overlayReport').toggleClass('is-visible');
});

// Donation
$('.donation-toggle').on('click', function(e) {
	e.preventDefault();
	$('#popupDonation').toggleClass('is-visible');
	$('#overlayDonation').toggleClass('is-visible');
});

// Login
$('.login-toggle').on('click', function(e) {
	e.preventDefault();
	$('#popupLogin').toggleClass('is-visible');
	$('#overlayLogin').toggleClass('is-visible');
});

// Notify
$('.notify-toggle').on('click', function(e) {
	e.preventDefault();
	$('#popupNotify').toggleClass('is-visible');
	$('#overlayNotify').toggleClass('is-visible');
});

$('body').on('click', '.request-toggle', function(e) {
	var popup = $('#popupRequest');
    var input = $('#popupRequest input[id="mce-ICO"]');
	var icoTitle = $(this).context.getAttribute('data-title');
    input.val(icoTitle);

    e.preventDefault();
    popup.toggleClass('is-visible');
    $('#overlayRequest').toggleClass('is-visible');
});

// Request
$('.register-toggle').on('click', function(e) {
	e.preventDefault();
	$('#popupRegister').toggleClass('is-visible');
	$('#overlayRegister').toggleClass('is-visible');
});
