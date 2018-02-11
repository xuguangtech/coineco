var activeOutput = '<!-- // Start Active -->';
var upcomingTBDOutput = '<!-- // Start Upcoming TBD -->';
var upcomingOutput = '<!-- // Start Upcoming -->';
var recentOutput = '<!-- Start Recent -->';

var allHelpers = [];
var allPreSaleHelpers = [];
var activeTab = 'presale-rounds-tab';

/* Config */
var sortingEnabled = false;
var enableCache = false;
var enableNoLimit = false;
var entriesPerPage = 30;
var consoleLogs = false;
var enabledLoadingIcons = false;
var doneTypingInterval = 0;
var enabledManualCategory = false;
var enabledScrollTrigger = true;
var turnOnNormalIcos = true;
var turnOnPreSaleIcos = true;

var timezone = window.timezone;
var clearifyLaunched = window.clearifyLaunched;

var readyToFetchMore = true;
var windowHeight;
var executeScrollMethod = false;
var rowHeight = 40;
var breakPoint = 100 + (rowHeight * entriesPerPage);
var breakPointStart = 100 + (rowHeight * entriesPerPage);
var breakPointMark = rowHeight * entriesPerPage;
var allHits;

//setup before functions
var typingTimer;

function scrollhandler() {

    scrollPosition = $(this).scrollTop();

    if (scrollPosition >= breakPoint) {
        executeScrollMethod = true;
        breakPoint += breakPointMark;
        if (consoleLogs === true) {
            console.log('new breakpoint: ' + breakPoint);
        }
    } else {
        executeScrollMethod = false;
    }

    if (executeScrollMethod && readyToFetchMore) {

        if (consoleLogs === true) {
            console.log('call next page');
        }

        readyToFetchMore = false;

        if (isPreSaleTabActive()) {
            $.each(allPreSaleHelpers, function( index, value ) {
                value.nextPage().search();
            });

        } else {
            $.each(allHelpers, function( index, value ) {
                value.nextPage().search();
            });
        }
    }
}

if (enabledScrollTrigger) {
    $(window).bind("scroll", scrollhandler);
}

setActiveTab();

instantsearch.widgets.addResults = function addResults($args, firstRendering) {
    return {

        getConfiguration: function(currentSearchParams) {

            var localCategory = $args['category'];

            if (consoleLogs === true) {
                console.log(localCategory + ' | Config:');
                console.log(currentSearchParams);
                console.log('----');
            }

            currentSearchParams.hitsPerPage = entriesPerPage;

            return currentSearchParams;
        },

        init: function(params) {

            var localCategory = $args['category'];
            var isPresale = $args['isPreSale'];

            if (isPresale === true) {

               console.log(params.helper);

                allPreSaleHelpers.push(params.helper);
            } else {

                if (localCategory === 'active' || localCategory === 'recent') {
                    params.helper.setIndex($args['indexName'] + '-active');
                } else {
                    params.helper.setIndex($args['indexName']);
                }

                allHelpers.push(params.helper);
            }

            if (consoleLogs === true) {
                console.log(localCategory + ' | init:');
                console.log(localCategory + ' | sortingEnabled: ' + sortingEnabled);
                console.log(localCategory + ' | enableNoLimit: ' + enableNoLimit);
                console.log(localCategory + ' | entriesPerPage: ' + entriesPerPage);
                console.log(localCategory + ' | timerSet: ' + true);
                console.log(localCategory + ' | enabledLoadingIcons: ' + enabledLoadingIcons);
                console.log(localCategory + ' | doneTypingInterval (ms): ' + doneTypingInterval);
                console.log(localCategory + ' | enabledManualCategory: ' + enabledManualCategory);
                console.log(localCategory + ' | enabledScrollTrigger: ' + enabledScrollTrigger);
                console.log(localCategory + ' | Page 2: ' + params.helper.getQueryParameter('page'));
                console.log('----');
            }

            if (enabledLoadingIcons) {
                turnOnLoadingIcons();
            }

            $($args['container']).on('keyup', function() {
                clearTimeout(typingTimer);

                typingTimer = setTimeout(function () {

                    if (!enableCache) {
                        if (consoleLogs === true) {
                            console.log(localCategory + ' | Clearing Cache');
                        }

                        if (isPreSaleTabActive()) {
                            $.each(allPreSaleHelpers, function( index, value ) {
                                value.client.clearCache();
                            });

                        } else {
                            $.each(allHelpers, function( index, value ) {
                                value.client.clearCache();
                            });
                        }
                    }

                    if (consoleLogs === true) {
                        console.log(localCategory + ' | Key Up');
                    }

                    if (isPreSaleTabActive()) {
                        $.each(allPreSaleHelpers, function( index, value ) {
                            value.setQuery($($args['container']).val()).search();
                        });

                    } else {
                        $.each(allHelpers, function( index, value ) {
                            value.setQuery($($args['container']).val()).search();
                        });
                    }

                    if (enabledLoadingIcons && $($args['container']).val() === '') {
                        turnOnLoadingIcons();
                    }

                }, doneTypingInterval);
            });

            $($args['container']).on('keydown', function(event) {

                if (event.keyCode == 13) {
                    event.preventDefault();
                }

                clearTimeout(typingTimer);
            });

        },

        render: function(params) {

            var newSearch = false;
            readyToFetchMore = true;

            var category = $args['category'];
            var hits = params.results.hits;

            var pageNumber = params.results.page;
            var indexName = params.results.index;
            var pageCount = params.results.nbPages - 1;
            var isPreSale = false;

            if( indexName.indexOf('presale') >= 0){
                isPreSale = true;
            }

            if (isPreSale === true && turnOnPreSaleIcos !== true) {
                if (consoleLogs === true) {
                    console.log('We cannot show presale icos' + indexName);
                }

                return true;
            }

            if (isPreSale === false && turnOnNormalIcos !== true) {
                if (consoleLogs === true) {
                    console.log('We cannot show normal icos' + indexName);
                }

                return true;
            }

            if (pageNumber === 0) { // because '0' means we changed the query

                if (enabledScrollTrigger) {

                    readyToFetchMore = true;
                    breakPoint = breakPointStart;

                    if (consoleLogs === true) {
                        console.log('readyToFetchMore = true');
                        console.log('new breakpoint: ' + breakPoint);
                    }
                }

                newSearch = true;
                allHits = hits;

                if (consoleLogs === true) {
                    console.log(category + ' | page 0');
                }

                cleanUpHtmlStrings(category);

            } else {

                if (enableNoLimit) {

                    if (consoleLogs === true) {
                        console.log(localCategory + ' | allHitsMerge');
                    }

                    allHits = arrayConcat(hits, allHits);
                } else {
                    cleanUpHtmlStrings(category);
                }

                allHits = arrayConcat(hits, allHits);
            }

            if (consoleLogs === true) {
                console.log(category + ' | Index Name: ' + indexName);
                console.log(category + ' | Page Number ' + pageNumber);
                console.log(category + ' | Page Count: ' + pageCount);
            }

            if (params.results.nbHits > 0) {

                readyToFetchMore = true;

                if (consoleLogs === true) {
                    console.log(category + ' | readyToFetchMore = true');
                }

            } else if (params.results.nbHits === 0 && params.state.page === params.results.nbPages) {
                readyToFetchMore = false;
                if (consoleLogs === true) {
                    console.log(category + ' | readyToFetchMore = false');
                }
            }

            if (enableNoLimit && pageNumber < pageCount) {
                // params.helper.nextPage().search();
            } else {

                if (enableNoLimit) {
                    generateICOs(allHits, category, isPreSale);
                } else {
                    generateICOs(hits, category, isPreSale);
                }

                addICOsToHomepage(category, newSearch, isPreSale);
                addNothingWasFound(category, isPreSale);
            }
        }
    }
};

function setActiveTab() {
    $( "#landing-page-icos-tabs" ).on( "tabsbeforeactivate", function( event, ui ) {
        var activatedTab = $(ui.newPanel); // activated tab
        activeTab = activatedTab.attr('id');
    } );
}

function isPreSaleTabActive()
{
    if (activeTab === 'presale-rounds-tab') {
        return true;
    }

    return false;
}

function cleanUpHtmlStrings(category) {
    if (category === 'active') {
        activeOutput = '<!-- // Start Active -->';
    }

    if (category === 'upcoming') {
        upcomingTBDOutput = '<!-- // Start Upcoming TBD -->';
        upcomingOutput = '<!-- // Start Upcoming -->';
    }

    if (category === 'recent') {
        recentOutput = '<!-- Start Recent -->';
    }
}

function arrayConcat(arr1, arr2) {
    return $.merge(arr2, arr1);
}

function turnOnLoadingIcons() {
    $('.message').empty();
    $('.message').hide();
    $('.listings').empty();
    $('.new-loader').show();
}

function turnOffLoadingIcons() {
    $('.new-loader').hide();
}

function generateICOs(icos, category, isPreSale) {

    if (icos.length === 0) {
        addNothingWasFound();
    }

    if (consoleLogs === true) {
        console.log(category + ' | Found ' + icos.length + ' ICOs');
    }

    if ($("#user").text().length > 0) {
        var user = 'yes';
    } else {
        var user = 'no';
    }

    if ($("#myList").text().length > 0) {
        var myList = 'yes';
    } else {
        var myList = 'no';
    }


    var activeFeaturedICOs = [];
    var activeICOs = [];
    var upcomingICOs = [];
    var recentICOs = [];


    $.each(icos, function (key, ico) {

        ico.category = category;

        if (enabledManualCategory) {
            ico.category = getCategory(ico);
        }

        if (isPreSale) {
            ico.featuredListing = ico.preFeaturedListing;
        }


        if (ico.category === 'active') {
            ico.DaysTillEnd = getDaysTillEnd(ico, isPreSale);

            if (ico.featuredListing == true) {
                activeFeaturedICOs.push(ico);
            } else {
                activeICOs.push(ico);
            }
        }

        if (ico.category === 'upcoming') {
            upcomingICOs.push(ico);
        }

        if (ico.category === 'recent') {
            recentICOs.push(ico);
        }
    });

    if (sortingEnabled) {
        activeFeaturedICOs.sort(function(x,y) {
            return  new Date(x.endDate).getTime() - new Date(y.endDate).getTime();
        });

        activeICOs.sort(function(x,y) {
            return  new Date(x.endDate).getTime() - new Date(y.endDate).getTime();
        });
    }

    if (category === 'active') {
        addIcos(activeFeaturedICOs, category, isPreSale);
        addIcos(activeICOs, category, isPreSale);
        activeOutput += '<!-- // End Active -->';
    }

    if (category === 'upcoming') {
        addIcos(upcomingICOs, category, isPreSale);
        upcomingTBDOutput += '<!-- // End Upcoming TBD -->';
        upcomingOutput += '<!-- // End Upcoming -->';
    }

    if (category === 'recent') {
        addIcos(recentICOs, category, isPreSale);
        recentOutput += '<!-- // End Recent -->';
    }
}

function addICOsToHomepage(category, newSearch, isPreSale) {

    if (enabledLoadingIcons) {
        turnOffLoadingIcons();
    }

    if (isPreSale === true) {
        addICOsToPreSaleTab(category, newSearch);
        // addFirstPreIcoId();
    } else {
        addICOsToNormalTab(category, newSearch);
        addFirstIcoId();
    }
}

function addFirstPreIcoId() {
    var preIcosChildren = $('.listings.presale').children();
    var firstElement = preIcosChildren.first();
    firstElement.attr("id", 'firstPreSaleListing');
    firstElement.attr("data-step", '6');
    firstElement.attr("data-intro", "Hovering your mouse over any ICO listing will reveal a link to the ICO website and to the ICO Alert Report (if available).");
    firstElement.attr("data-position", "top");
    firstElement.attr("data-scrollTo", "tooltip");
}

function addFirstIcoId() {
    var preIcosChildren = $('.listings.normal').children();
    var firstElement = preIcosChildren.first();
    firstElement.attr("id", 'firstSaleListing');
    firstElement.attr("data-step", '3');
    firstElement.attr("data-intro", "Hovering your mouse over any ICO listing will reveal a link to the ICO website and to the ICO Alert Report (if available).");
    firstElement.attr("data-position", "top");
    firstElement.attr("data-scrollTo", "tooltip");
}

function addICOsToNormalTab(category, newSearch) {
    if (enableNoLimit || newSearch) {

        if (category === 'active') {
            $('#active-listed-ico .listings').html(activeOutput); // replace all existing content
        }

        if (category === 'upcoming') {
            $('#upcoming-listed-ico .not-tbd').html(upcomingOutput); // replace all existing content
            $('#upcoming-listed-ico .all-tbd').html(upcomingTBDOutput); // replace all existing content
        }

        if (category === 'recent') {
            $('#recent-sorted .listings').html(recentOutput); // replace all existing content
        }

    } else {

        if (category === 'active') {
            $('#active-listed-ico .listings').append(activeOutput); // replace all existing content
        }

        if (category === 'upcoming') {
            $('#upcoming-listed-ico .not-tbd').append(upcomingOutput); // replace all existing content
            $('#upcoming-listed-ico .all-tbd').append(upcomingTBDOutput); // replace all existing content
        }

        if (category === 'recent') {
            $('#recent-sorted .listings').append(recentOutput); // replace all existing content
        }
    }
}

function addICOsToPreSaleTab(category, newSearch) {
    if (enableNoLimit || newSearch) {

        if (category === 'active') {
            $('#presale-active-listed-ico .listings').html(activeOutput); // replace all existing content
        }

        if (category === 'upcoming') {
            $('#presale-upcoming-listed-ico .not-tbd').html(upcomingOutput); // replace all existing content
            $('#presale-upcoming-listed-ico .all-tbd').html(upcomingTBDOutput); // replace all existing content
        }

        if (category === 'recent') {
            $('#presale-recent-sorted .listings').html(recentOutput); // replace all existing content
        }

    } else {

        if (category === 'active') {
            $('#presale-active-listed-ico .listings').append(activeOutput); // replace all existing content
        }

        if (category === 'upcoming') {
            $('#presale-upcoming-listed-ico .not-tbd').append(upcomingOutput); // replace all existing content
            $('#presale-upcoming-listed-ico .all-tbd').append(upcomingTBDOutput); // replace all existing content
        }

        if (category === 'recent') {
            $('#presale-recent-sorted .listings').append(recentOutput); // replace all existing content
        }
    }
}

function addNothingWasFound(category, isPreSale) {

    if (isPreSale === true) {
        addNothingWasFoundForPreSaleTab(category)
    } else {
        addNothingWasFoundForNormalTab(category)
    }
}

function addNothingWasFoundForNormalTab(category) {
    if (category === 'active') {
        addNothingWasFoundForActive();
    }

    if (category === 'upcoming') {
        addNothingWasFoundForUpcoming();
    }

    if (category === 'recent') {
        addNothingWasFoundForRecent();
    }
}

function addNothingWasFoundForPreSaleTab(category) {
    if (category === 'active') {
        addNothingWasFoundForActivePresale();
    }

    if (category === 'upcoming') {
        addNothingWasFoundForUpcomingPresale();
    }

    if (category === 'recent') {
        addNothingWasFoundForRecentPresale();
    }
}

function addNothingWasFoundForActive() {
    var activeCount = $("#active-listed-ico").find('.listings').children().length;

    if(activeCount === 0) {
        $("#active-listed-ico").find('.message').show().text('Sorry, there are no matches.');
    } else {
        $("#active-listed-ico").find('.message').hide().text('');
    }
}

function addNothingWasFoundForUpcoming() {
    var upcomingCount = $(".not-tbd.listings").children().length +  $(".all-tbd.listings").children().length;

    if(upcomingCount === 0) {
        $("#upcoming-listed-ico").find('.message').show().text('Sorry, there are no matches.');
    } else {
        $("#upcoming-listed-ico").find('.message').hide().text('');
    }
}

function addNothingWasFoundForRecent() {
    var recentCount = $("#recent-listed-ico").find('.listings').children().length;

    if(recentCount === 0) {
        $("#recent-listed-ico").find('.message').show().text('Sorry, there are no matches.');
    } else {
        $("#recent-listed-ico").find('.message').hide().text('');
    }
}

function addNothingWasFoundForRecentPresale() {
    var recentCount = $("#presale-recent-listed-ico").find('.listings').children().length;

    if(recentCount === 0) {
        $("#presale-recent-listed-ico").find('.message').show().text('Sorry, there are no matches.');
    } else {
        $("#presale-recent-listed-ico").find('.message').hide().text('');
    }
}

function addNothingWasFoundForActivePresale() {
    var activeCount = $("#presale-active-listed-ico").find('.listings.presale').children().length;

    if(activeCount === 0) {
        $("#presale-active-listed-ico").find('.message').show().text('Sorry, there are no matches.');
    } else {
        $("#presale-active-listed-ico").find('.message').hide().text('');
    }
}

function addNothingWasFoundForUpcomingPresale() {
    var upcomingCount = $(".presale.not-tbd.listings").children().length +  $(".presale.all-tbd.listings").children().length;

    if(upcomingCount === 0) {
        $("#presale-upcoming-listed-ico").find('.message').show().text('Sorry, there are no matches.');
    } else {
        $("#presale-upcoming-listed-ico").find('.message').hide().text('');
    }
}

function addIcos(icos, category, isPreSale) {
    $.each(icos, function (key, ico) {

        var cat = category;


        var tbd = 'no';

        if (ico.startDate < 0 || ico.DaysTillEnd == '') {
            tbd = 'yes';
        }

        var featured = ico.featuredListing;

        if (isPreSale == true) {
            featured = ico.preFeaturedListing;
        }


        if (featured == true) {
            featured = "featured";
        } else {
            featured = "";
        }

        var startMonth = ico.startMonth;
        var startDay = ico.startDay;

        if (isPreSale === true) {
            startMonth = ico.preSaleStartMonth;
            startDay = ico.preSaleStartDay;
            tbd = 'no';
        }

        var reportAvailable = ico.reportAvailable;
        var reportUrl = ico.reportLink;
        var website = ico.website;

        var verified = false;

        if (clearifyLaunched && ico.verified && ico.verified === true) {
            verified = true;
        }

        if (cat == 'active') {

            var day = 'DAYS';

            if (ico.DaysTillEnd == 1) {
                day = 'DAY';
            }

            if (featured == 'featured') {
                activeOutput += '<div onClick="void(0)" class="ico-wrap ' + cat + ' ' + featured + '" data-ico-type="' + cat + '" data-tags="' + ico.title + ' ' + ico.description + '">';
                activeOutput += '<div class="ico">';
                activeOutput += '<div class="date ">';
                activeOutput += '<p>' + ico.DaysTillEnd + '<br/><span>' + day + '<br/> LEFT</span></p>';
                activeOutput += '</div>'; // Date
                activeOutput += '<div class="about">';
                activeOutput += '<h3><span class="upper">' + ico.title + ' &mdash; </span>' + ico.description + '</h3>';
                activeOutput += '</div>'; // About

                if (clearifyLaunched == true) {
                    if (verified == true) {
                        activeOutput += '<div class="report-mod clearify-tbd-icon small-ico-icons"></div>';
                    } else {
                        activeOutput += '<div class="disabled-icon"><div class="report-mod clearify-tbd-icon small-ico-icons"></div></div>';

                    }

                    if (reportAvailable == 'yes' && reportUrl) {
                        activeOutput += '<div class="report-mod report-icon small-ico-icons"></div>';
                    } else {
                        activeOutput += '<div class="report-mod report-tbd-icon small-ico-icons"></div>';
                    }

                } else {
                    if (reportAvailable == 'yes' && reportUrl) {
                        activeOutput += '<div class="report-mod report-icon"></div>';
                    } else {
                        activeOutput += '<div class="report-mod report-tbd-icon"></div>';
                    }
                }

                activeOutput += '</div>'; // ICO
                activeOutput += '<div class="ico-links">';
                activeOutput += '<div class="website black"><a href="' + website + '" target="_blank"><i class="fa fa-link" aria-hidden="true"></i><p>View Website</p></a></div>'; // Website
                if (reportAvailable == 'yes' && reportUrl) {
                    activeOutput += '<div class="report purp"><a target="_blank" href= "'+ reportUrl +'"><i class="fa fa-file-o" aria-hidden="true"></i><p>View Report</p></a></div>'; // Report Available
                } else {
                    activeOutput += '<div class="report request-toggle black" data-title="' + ico.title + '"><i class="fa fa-file-o" aria-hidden="true"></i><p>Request Report</p></div>'; // Request Report
                }
                // if (myList == 'yes') {
                // 	if (user == 'yes') {
                // 		activeOutput += '<div class="like-unlike black"><a href="index.php/actions/like/add?id=' + ico.icoID + '"><i class="fa fa-thumbs-up" aria-hidden="true"></i><p>Add to List</p></a></div>'; // Add to List
                // 	} else {
                // 		activeOutput += '<div class="like-unlike black"><div class="login-toggle"><i class="fa fa-thumbs-up" aria-hidden="true"></i><p>Add to List</p></div></div>'; // Login
                // 	}
                // }
                activeOutput += '</div>'; // ICO Links
                activeOutput += '</div>'; // ICO Wrap
            } else {
                activeOutput += '<div onClick="void(0)" class="ico-wrap active" data-ico-type="' + cat + '" data-tags="' + ico.title + ' ' + ico.description + '">';
                activeOutput += '<div class="ico">';
                activeOutput += '<div class="date ">';
                activeOutput += '<p>' + ico.DaysTillEnd + '<br/><span>' + day + '<br/> LEFT</span></p>';
                activeOutput += '</div>'; // Date
                activeOutput += '<div class="about">';
                activeOutput += '<h3><span class="upper">' + ico.title + ' &mdash; </span>' + ico.description + '</h3>';
                activeOutput += '</div>'; // About
                if (clearifyLaunched == true) {
                    if (verified == true) {
                        activeOutput += '<div class="report-mod clearify-tbd-icon small-ico-icons"></div>';
                    } else {
                        activeOutput += '<div class="disabled-icon"><div class="report-mod clearify-tbd-icon small-ico-icons"></div></div>';

                    }

                    if (reportAvailable == 'yes' && reportUrl) {
                        activeOutput += '<div class="report-mod report-icon small-ico-icons"></div>';
                    } else {
                        activeOutput += '<div class="report-mod report-tbd-icon small-ico-icons"></div>';
                    }

                } else {
                    if (reportAvailable == 'yes' && reportUrl) {
                        activeOutput += '<div class="report-mod report-icon"></div>';
                    } else {
                        activeOutput += '<div class="report-mod report-tbd-icon"></div>';
                    }
                }
                activeOutput += '</div>'; // ICO
                activeOutput += '<div class="ico-links">';
                activeOutput += '<div class="website black"><a href="' + website + '" target="_blank"><i class="fa fa-link" aria-hidden="true"></i><p>View Website</p></a></div>'; // Website
                if (reportAvailable == 'yes' && reportUrl) {
                    activeOutput += '<div class="report purp"><a target="_blank" href= "'+ reportUrl +'"><i class="fa fa-file-o" aria-hidden="true"></i><p>View Report</p></a></div>'; // Report Available
                } else {
                    activeOutput += '<div class="report request-toggle black" data-title="' + ico.title + '"><i class="fa fa-file-o" aria-hidden="true"></i><p>Request Report</p></div>'; // Request Report
                }
                // if (myList == 'yes') {
                // 	if (user == 'yes') {
                // 		activeOutput += '<div class="like-unlike black"><a href="index.php/actions/like/add?id=' + ico.icoID + '"><i class="fa fa-thumbs-up" aria-hidden="true"></i><p>Add to List</p></a></div>'; // Add to List
                // 	} else {
                // 		activeOutput += '<div class="like-unlike black"><div class="login-toggle"><i class="fa fa-thumbs-up" aria-hidden="true"></i><p>Add to List</p></div></div>'; // Login
                // 	}
                // } // Hide if MyList is turned off
                activeOutput += '</div>'; // ICO Links
                activeOutput += '</div>'; // ICO Wrap
            }
        } else if (cat == 'upcoming') {
            if (featured == 'featured') {
                upcomingOutput += '<div onClick="void(0)" class="ico-wrap upcoming ' + featured + '" data-ico-type="' + cat + '" data-tags="' + ico.title + ' ' + ico.description + '">';
                upcomingOutput += '<div class="ico">';
                upcomingOutput += '<div class="date upcoming-date">';
                upcomingOutput += '<p>' + startDay + '<br /><span class="upper">' + startMonth + '</span></p>';
                upcomingOutput += '</div>'; // Date
                upcomingOutput += '<div class="about">';
                upcomingOutput += '<h3><span class="upper">' + ico.title + ' &mdash; </span>' + ico.description + '</h3>';
                upcomingOutput += '</div>'; // About
                if (clearifyLaunched == true) {
                    if (verified == true) {
                        upcomingOutput += '<div class="report-mod clearify-tbd-icon small-ico-icons"></div>';
                    } else {
                        upcomingOutput += '<div class="disabled-icon"><div class="report-mod clearify-tbd-icon small-ico-icons"></div></div>';

                    }

                    if (reportAvailable == 'yes' && reportUrl) {
                        upcomingOutput += '<div class="report-mod report-icon small-ico-icons"></div>';
                    } else {
                        upcomingOutput += '<div class="report-mod report-tbd-icon small-ico-icons"></div>';
                    }

                } else {
                    if (reportAvailable == 'yes' && reportUrl) {
                        upcomingOutput += '<div class="report-mod report-icon"></div>';
                    } else {
                        upcomingOutput += '<div class="report-mod report-tbd-icon"></div>';
                    }
                }
                upcomingOutput += '</div>'; // ICO
                upcomingOutput += '<div class="ico-links">';
                upcomingOutput += '<div class="website black"><a href="' + website + '" target="_blank"><i class="fa fa-link" aria-hidden="true"></i><p>View Website</p></a></div>'; // Website
                if (reportAvailable == 'yes' && reportUrl) {
                    upcomingOutput += '<div class="report purp"><a target="_blank" href= "'+ reportUrl +'"><i class="fa fa-file-o" aria-hidden="true"></i><p>View Report</p></a></div>'; // Report Available
                } else {
                    upcomingOutput += '<div class="report request-toggle black" data-title="' + ico.title + '"><i class="fa fa-file-o" aria-hidden="true"></i><p>Request Report</p></div>'; // Request Report
                }
                // if (myList == 'yes') {
                // 	if (user == 'yes') {
                // 		upcomingOutput += '<div class="like-unlike black"><a href="index.php/actions/like/add?id=' + ico.icoID + '"><i class="fa fa-thumbs-up" aria-hidden="true"></i><p>Add to List</p></a></div>'; // Add to List
                // 	} else {
                // 		upcomingOutput += '<div class="like-unlike black"><div class="login-toggle"><i class="fa fa-thumbs-up" aria-hidden="true"></i><p>Add to List</p></div></div>'; // Login
                // 	}
                // } // Hide if MyList is turned off
                upcomingOutput += '</div>'; // ICO Links
                upcomingOutput += '</div>'; // ICO Wrap
            } else if (tbd == 'yes') {
                upcomingTBDOutput += '<div onClick="void(0)" class="ico-wrap upcoming tbd" data-ico-type="' + cat + '" data-tags="' + ico.title + ' ' + ico.description + '">';
                upcomingTBDOutput += '<div class="ico">';
                upcomingTBDOutput += '<div class="date upcoming-date">';
                upcomingTBDOutput += '<p style="margin-top: 27px;"><span>TBD</span></p>';
                upcomingTBDOutput += '</div>'; // Date
                upcomingTBDOutput += '<div class="about">';
                upcomingTBDOutput += '<h3><span class="upper">' + ico.title + ' &mdash; </span>' + ico.description + '</h3>';
                upcomingTBDOutput += '</div>'; // About
                if (clearifyLaunched == true) {
                    if (verified == true) {
                        upcomingTBDOutput += '<div class="report-mod clearify-tbd-icon small-ico-icons"></div>';
                    } else {
                        upcomingTBDOutput += '<div class="disabled-icon"><div class="report-mod clearify-tbd-icon small-ico-icons"></div></div>';

                    }

                    if (reportAvailable == 'yes' && reportUrl) {
                        upcomingTBDOutput += '<div class="report-mod report-icon small-ico-icons"></div>';
                    } else {
                        upcomingTBDOutput += '<div class="report-mod report-tbd-icon small-ico-icons"></div>';
                    }

                } else {
                    if (reportAvailable == 'yes' && reportUrl) {
                        upcomingTBDOutput += '<div class="report-mod report-icon"></div>';
                    } else {
                        upcomingTBDOutput += '<div class="report-mod report-tbd-icon"></div>';
                    }
                }
                upcomingTBDOutput += '</div>'; // ICO
                upcomingTBDOutput += '<div class="ico-links">';
                upcomingTBDOutput += '<div class="website black"><a href="' + website + '" target="_blank"><i class="fa fa-link" aria-hidden="true"></i><p>View Website</p></a></div>'; // Website
                if (reportAvailable == 'yes' && reportUrl) {
                    upcomingTBDOutput += '<div class="report purp"><a target="_blank" href= "'+ reportUrl +'"><i class="fa fa-file-o" aria-hidden="true"></i><p>View Report</p></a></div>'; // Report Available
                } else {
                    upcomingTBDOutput += '<div class="report request-toggle black" data-title="' + ico.title + '"><i class="fa fa-file-o" aria-hidden="true"></i><p>Request Report</p></div>'; // Request Report
                }
                // if (myList == 'yes') {
                // 	if (user == 'yes') {
                // 		upcomingTBDOutput += '<div class="like-unlike black"><a href="index.php/actions/like/add?id=' + ico.icoID + '"><i class="fa fa-thumbs-up" aria-hidden="true"></i><p>Add to List</p></a></div>'; // Add to List
                // 	} else {
                // 		upcomingTBDOutput += '<div class="like-unlike black"><div class="login-toggle"><i class="fa fa-thumbs-up" aria-hidden="true"></i><p>Add to List</p></div></div>'; // Login
                // 	}
                // } // Hide if MyList is turned off
                upcomingTBDOutput += '</div>'; // ICO Links
                upcomingTBDOutput += '</div>'; // ICO Wrap
            } else {
                upcomingOutput += '<div onClick="void(0)" class="ico-wrap upcoming" data-ico-type="' + cat + '" data-tags="' + ico.title + ' ' + ico.description + '">';
                upcomingOutput += '<div class="ico">';
                upcomingOutput += '<div class="date upcoming-date">';
                upcomingOutput += '<p>' + startDay + '<br /><span class="upper">' + startMonth + '</span></p>';
                upcomingOutput += '</div>'; // Date
                upcomingOutput += '<div class="about">';
                upcomingOutput += '<h3><span class="upper">' + ico.title + ' &mdash; </span>' + ico.description + '</h3>';
                upcomingOutput += '</div>'; // About
                if (clearifyLaunched == true) {
                    if (verified == true) {
                        upcomingOutput += '<div class="report-mod clearify-tbd-icon small-ico-icons"></div>';
                    } else {
                        upcomingOutput += '<div class="disabled-icon"><div class="report-mod clearify-tbd-icon small-ico-icons"></div></div>';

                    }

                    if (reportAvailable == 'yes' && reportUrl) {
                        upcomingOutput += '<div class="report-mod report-icon small-ico-icons"></div>';
                    } else {
                        upcomingOutput += '<div class="report-mod report-tbd-icon small-ico-icons"></div>';
                    }

                } else {
                    if (reportAvailable == 'yes' && reportUrl) {
                        upcomingOutput += '<div class="report-mod report-icon"></div>';
                    } else {
                        upcomingOutput += '<div class="report-mod report-tbd-icon"></div>';
                    }
                }
                upcomingOutput += '</div>'; // ICO
                upcomingOutput += '<div class="ico-links">';
                upcomingOutput += '<div class="website black"><a href="' + website + '" target="_blank"><i class="fa fa-link" aria-hidden="true"></i><p>View Website</p></a></div>'; // Website
                if (reportAvailable == 'yes' && reportUrl) {
                    upcomingOutput += '<div class="report purp"><a target="_blank" href= "'+ reportUrl +'"><i class="fa fa-file-o" aria-hidden="true"></i><p>View Report</p></a></div>'; // Report Available
                } else {
                    upcomingOutput += '<div class="report request-toggle black" data-title="' + ico.title + '"><i class="fa fa-file-o" aria-hidden="true"></i><p>Request Report</p></div>'; // Request Report
                }
                // if (myList == 'yes') {
                // 	if (user == 'yes') {
                // 		upcomingOutput += '<div class="like-unlike black"><a href="index.php/actions/like/add?id=' + ico.icoID + '"><i class="fa fa-thumbs-up" aria-hidden="true"></i><p>Add to List</p></a></div>'; // Add to List
                // 	} else {
                // 		upcomingOutput += '<div class="like-unlike black"><div class="login-toggle"><i class="fa fa-thumbs-up" aria-hidden="true"></i><p>Add to List</p></div></div>'; // Login
                // 	}
                // } // Hide if MyList is turned off
                upcomingOutput += '</div>'; // ICO Links
                upcomingOutput += '</div>'; // ICO Wrap
            }
        } else if (cat == 'recent') {
            recentOutput += '<div onClick="void(0)" class="ico-wrap recent" data-ico-type="' + cat + '" data-tags="' + ico.title + ' ' + ico.description + '">';
            recentOutput += '<div class="ico">';
            recentOutput += '<div class="date">';
            recentOutput += '<p style="margin-top: 27px;"><span>ENDED</span></p>';
            recentOutput += '</div>'; // Date
            recentOutput += '<div class="about">';
            recentOutput += '<h3><span class="upper">' + ico.title + ' &mdash; </span>' + ico.description + '</h3>';
            recentOutput += '</div>'; // About
            if (reportAvailable == 'yes' && reportUrl) {
                recentOutput += '<div class="report-mod report-icon"></div>';
            } else {
                recentOutput += '<div class="report-mod report-tbd-icon"></div>';
            }
            recentOutput += '</div>'; // ICO
            recentOutput += '<div class="ico-links">';
            recentOutput += '<div class="website recent-website black"><a href="' + website + '" target="_blank"><i class="fa fa-link" aria-hidden="true"></i><p>View Website</p></a></div>'; // Website
            recentOutput += '</div>'; // ICO Links
            recentOutput += '</div>'; // ICO Wrap
        }
    });
}

function getCategory(ico) {

    var today = getTodayTimestamp();

    if (ico.startDate <= today && ico.endDate > today) {
        return 'active';
    }

    if (ico.startDate > today) {
        return 'upcoming';
    }

    if (ico.startDate <= today) {
        return 'recent';
    }

    return '';
}

function getDaysTillEnd(ico, isPreSale) {

    var days = 0;

    if (isPreSale === true) {

        if (ico.preSaleStartDate === '' || ico.preSaleEndDate === 'null' || ico.preSaleEndDate === -1) {
            return '';
        }

        days = presaleDaysTillEnd(ico);

    } else {

        if (ico.endDate === '' || ico.endDate === 'null' || ico.endDate === -1) {
            return '';
        }

        days = normalDaysTillEnd(ico);
    }

    return days;
}

function normalDaysTillEnd(ico) {
    var startDate = moment(getTodayTimestamp()*1000);
    var endDate = moment(ico.endDate*1000);

    return endDate.diff(startDate, 'days') + 1;
}

function presaleDaysTillEnd(ico) {
    var startDate = moment(getTodayTimestamp()*1000);
    var endDate = moment(ico.preSaleEndDate*1000);

    return endDate.diff(startDate, 'days') + 1;
}

function getToday() {
    return moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
}

function getTodayTimestamp() {
    // return moment().tz(timezone).unix();
    return moment().unix();
}
