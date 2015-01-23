utils.loadTemplate(['HomeView', 'HeaderView','MediaShowLayout', 'MediaDataView', 'MediaNavbar',
    'MediaShowHeadForm', 'SearchEntitiesForm', 'MediaShowStateForm'], function() {

    $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });


    console.log('main: MediaManagert.start');

    MediaManager.start();
});
