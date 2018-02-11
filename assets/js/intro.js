var stepOneElementId = "menu-logo";
var stepTwoElementId = "icos-sorted";
var stepThreeElementId = "firstSaleListing";
var stepFourElementId = "ui-id-1";
var stepFiveElementId = "live-search";

var stepOneElementIdSelector = "#" + stepOneElementId;
var stepTwoElementIdSelector = "#" + stepTwoElementId;
var stepFourthElementIdSelector = "#" + stepFourElementId;
var stepFifthElementIdSelector = "#" + stepFiveElementId;


$(document).ready(function(){
    console.log('Intro init');

    $('.intro-button').click(function () {
        turnOffAlgoliaTabsSearch();
        demo();
    });

    function demo() {

        updateDemoElements();

        introJs().onchange(function(targetElement) {

            switch (targetElement.id)
            {
                case stepOneElementId:
                    break;
                case stepTwoElementId:
                    openNormalTab();
                    break;
                case stepThreeElementId:
                    openFirstNormalIco();
                    break;
                case stepFourElementId:
                    closeFirstNormalIco();
                    openPreIcoTab();
                    break;
                case stepFiveElementId:
                    break;
            }
        }).onexit(function() {
            turnOnAlgoliaTabsSearch();
            openPreIcoTab();
        }).oncomplete(function() {
            turnOnAlgoliaTabsSearch();
            openPreIcoTab();
        }).start();
    }

    function turnOnAlgoliaTabsSearch() {
        window.algoliaSearchOnTabChange = true;
    }

    function turnOffAlgoliaTabsSearch() {
        window.algoliaSearchOnTabChange = false;
    }

    function openNormalTab() {
        $('#landing-page-icos-tabs').tabs( "option", "active", 1);
    }

    function openPreIcoTab() {
        $('#landing-page-icos-tabs').tabs( "option", "active", 0);
    }

    function openFirstNormalIco() {
        console.log('opening element');
        $('#firstSaleListing').children().first().addClass('hover-ico');
    }

    function closeFirstNormalIco() {
        $('#firstSaleListing').children().first().removeClass('hover-ico');
    }

    function updateDemoElements() {
        var stepOneElement = $(stepOneElementIdSelector);
        stepOneElement.attr("data-step", '1');
        stepOneElement.attr("data-intro", "Welcome to ICO Alert, your trusted source for ICO information.");
        stepOneElement.attr("data-position", "bottom-right-aligned");
        stepOneElement.attr("data-scrollTo", "tooltip");


        var stepTwoElement = $(stepTwoElementIdSelector);
        stepTwoElement.attr("data-step", '2');
        stepTwoElement.attr("data-intro", "ICO Alert Calendar introduction");
        stepTwoElement.attr("data-position", "top");
        stepTwoElement.attr("data-scrollTo", "tooltip");


        // Is Added During Algolia ICOs generation in algolia-results-widget.js addFirstIcoId()
        // var stepThreeElement = $(stepThreeElementIdSelector);
        // console.log(stepThreeElement);
        // stepThreeElement.attr("data-step", '3');
        // stepThreeElement.attr("data-intro", "Hovering your mouse over any ICO listing will reveal a link to the ICO website and to the ICO Alert Report (if available).");
        // stepThreeElement.attr("data-position", "top");
        // stepThreeElement.attr("data-scrollTo", "tooltip");

        var stepFourElement = $(stepFourthElementIdSelector);
        stepFourElement.attr("data-step", '4');
        stepFourElement.attr("data-intro", "In addition to a calendar of Active and Upcoming initial coin offerings, you may also filter our calendar for Pre-Sale / Pre-ICO listings only. Pre-sales typically offer bonuses to investors for purchasing their tokens prior to the actual ICO.");
        stepFourElement.attr("data-position", "top");
        stepFourElement.attr("data-scrollTo", "tooltip");


        var stepFiveElement = $(stepFifthElementIdSelector);
        stepFiveElement.attr("data-step", '5');
        stepFiveElement.attr("data-intro", "You can also use the search feature to conveniently filter for ICOs by keywords, industry, or platform.");
        stepFiveElement.attr("data-position", "bottom-left-aligned");
        stepFiveElement.attr("data-scrollTo", "tooltip");
    }

});
