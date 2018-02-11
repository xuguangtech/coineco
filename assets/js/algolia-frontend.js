/* global instantsearch */

var algoliaAppId = window.algoliaAppId;
var algoliaSearchKey = window.algoliaSearchKey;
var algoliaIndexName = window.algoliaIndexName;
var timezone = window.timezone;
var algoliaSearchOnTabChange = window.algoliaSearchOnTabChange;

var normalIcosStarted = false;

/* ACTIVE */

var activeQuery = 'startDate <= ' + getTodayTimestamp() + ' AND endDate > ' + getTodayTimestamp() + ' AND startDate > 0 AND endDate > 0';

var searchActive = instantsearch({
    appId: algoliaAppId,
    apiKey: algoliaSearchKey,
    indexName: algoliaIndexName + '-active',
    urlSync: {
        mapping: {'p': 'page'},
        trackedParameters: ['query']
    },
    searchParameters: {
        facets: ['title'],
        filters: activeQuery
    }
});

searchActive.addWidget(
    instantsearch.widgets.searchBox({
        container: '#filter',
        queryHook: function (query, searchActive) {
            // searchActive(query);
        }
    })
);

searchActive.addWidget(
    instantsearch.widgets.addResults(
        {
            container: '#filter',
            category: 'active',
            indexName: algoliaIndexName,
            isPreSale: false
        }
    )
);


/* UPCOMING */

var upcomingQuery = 'startDate > ' + getTodayTimestamp() + ' OR startDate = -1';

var upcomingSearch = instantsearch({
    appId: algoliaAppId,
    apiKey: algoliaSearchKey,
    indexName: algoliaIndexName,
    urlSync: {
        mapping: {'p': 'page'},
        trackedParameters: ['query']
    },
    searchParameters: {
        facets: ['title'],
        filters: upcomingQuery
    }
});

upcomingSearch.addWidget(
    instantsearch.widgets.searchBox({
        container: '#filter',
        queryHook: function (query, upcomingSearch) {
            // console.log('title: query: ' + query);
            // upcomingSearch(query);
        }
    })
);


upcomingSearch.addWidget(
    instantsearch.widgets.addResults(
        {
            container: '#filter',
            category: 'upcoming',
            indexName: algoliaIndexName,
            isPreSale: false
        }
    )
);

/* RECENT */

var recentQuery = 'endDate > 0 AND endDate < ' + getTodayTimestamp();

var recentSearch = instantsearch({
    appId: algoliaAppId,
    apiKey: algoliaSearchKey,
    indexName: algoliaIndexName + '-active',
    urlSync: {
        mapping: {'p': 'page'},
        trackedParameters: ['query']
    },
    searchParameters: {
        facets: ['title'],
        filters: recentQuery
    },
});

recentSearch.addWidget(
    instantsearch.widgets.searchBox({
        container: '#filter',
        queryHook: function (query, recentSearch) {
            // console.log('title: query: ' + query);
            // recentSearch(query);
        }
    })
);

recentSearch.addWidget(
    instantsearch.widgets.addResults(
        {
            container: '#filter',
            category: 'recent',
            indexName: algoliaIndexName,
            isPreSale: false
        }
    )
);

/** PRE-SALE  */

/* ACTIVE */

var preSaleActiveQuery = 'preSaleStartDate <= ' + getTodayTimestamp() + ' AND preSaleEndDate > ' + getTodayTimestamp() + ' AND preSaleStartDate > 0 AND preSaleEndDate > 0';

var preSaleSearchActive = instantsearch({
    appId: algoliaAppId,
    apiKey: algoliaSearchKey,
    indexName: algoliaIndexName + '-active-presale',
    urlSync: {
        mapping: {'p': 'page'},
        trackedParameters: ['query']
    },
    searchParameters: {
        facets: ['title', 'preSale'],
        filters: preSaleActiveQuery,
        facetsRefinements: {
            preSale: [true]
        }
    }
});

preSaleSearchActive.addWidget(
    instantsearch.widgets.searchBox({
        container: '#filter',
        queryHook: function (query, preSaleSearchActive) {
            // preSaleSearchActive(query);
        }
    })
);

preSaleSearchActive.addWidget(
    instantsearch.widgets.addResults(
        {
            container: '#filter',
            category: 'active',
            indexName: algoliaIndexName + '-active-presale',
            isPreSale: true
        }
    )
);


/* UPCOMING */

var preSaleUpcomingQuery = 'preSaleStartDate > ' + getTodayTimestamp() + ' OR preSaleStartDate < 1';

var preSaleUpcomingSearch = instantsearch({
    appId: algoliaAppId,
    apiKey: algoliaSearchKey,
    indexName: algoliaIndexName + '-presale',
    urlSync: {
        mapping: {'p': 'page'},
        trackedParameters: ['query']
    },
    searchParameters: {
        facets: ['title', 'preSale'],
        filters: preSaleUpcomingQuery,
        facetsRefinements: {
            preSale: [true]
        }
    }
});

preSaleUpcomingSearch.addWidget(
    instantsearch.widgets.searchBox({
        container: '#filter',
        queryHook: function (query, preSaleUpcomingSearch) {
            // console.log('title: query: ' + query);
            // preSaleUpcomingSearch(query);
        }
    })
);


preSaleUpcomingSearch.addWidget(
    instantsearch.widgets.addResults(
        {
            container: '#filter',
            category: 'upcoming',
            indexName: algoliaIndexName + '-presale',
            isPreSale: true
        }
    )
);

/* RECENT */

var preSaleRecentQuery = 'preSaleEndDate > 0 AND preSaleEndDate < ' + getTodayTimestamp();

var preSaleRecentSearch = instantsearch({
    appId: algoliaAppId,
    apiKey: algoliaSearchKey,
    indexName: algoliaIndexName + '-active-presale',
    urlSync: {
        mapping: {'p': 'page'},
        trackedParameters: ['query']
    },
    searchParameters: {
        facets: ['title', 'preSale'],
        filters: preSaleRecentQuery,
        facetsRefinements: {
            preSale: [true]
        }
    }
});

preSaleRecentSearch.addWidget(
    instantsearch.widgets.searchBox({
        container: '#filter',
        queryHook: function (query, recentSearch) {
            // console.log('title: query: ' + query);
            // preSaleRecentSearch(query);
        }
    })
);

preSaleRecentSearch.addWidget(
    instantsearch.widgets.addResults(
        {
            container: '#filter',
            category: 'recent',
            indexName: algoliaIndexName + '-active-presale',
            isPreSale: true
        }
    )
);

$( "#landing-page-icos-tabs" ).on( "tabsbeforeactivate", function( event, ui ) {
    console.log('activated tab');
    console.log(ui.newTab);

    var activatedTab = $(ui.newPanel); // activated tab

    if (activatedTab.attr('id') === 'presale-rounds-tab') {

        if (algoliaSearchOnTabChange === true) {
            preSaleSearchActive.helper.setQuery($('#filter').val()).search();
            preSaleUpcomingSearch.helper.setQuery($('#filter').val()).search();
            preSaleRecentSearch.helper.setQuery($('#filter').val()).search();
        }
    }

    if (activatedTab.attr('id') === 'normal-rounds-tab') {
        // if (normalIcosStarted === false) {
        //     searchActive.start();
        //     upcomingSearch.start();
        //     recentSearch.start();
        //
        //     normalIcosStarted = true;
        // }

        if (algoliaSearchOnTabChange === true) {
            searchActive.helper.setQuery($('#filter').val()).search();
            upcomingSearch.helper.setQuery($('#filter').val()).search();
            recentSearch.helper.setQuery($('#filter').val()).search();
        }
    }
} );

preSaleSearchActive.start();
preSaleUpcomingSearch.start();
preSaleRecentSearch.start();

searchActive.start();
upcomingSearch.start();
recentSearch.start();

$('#landing-page-icos-tabs').show();

function getTodayTimestamp() {
    // return moment().tz(timezone).unix();
    return moment().unix();
}