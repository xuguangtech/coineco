var enabledLogging = true;

$(document).ready(function () {
    log('ico tabs initiated');
});

function log(message) {

    if (enabledLogging === true) {
        console.log(message);
    }
}