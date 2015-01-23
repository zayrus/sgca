utils.loadTemplate(['HomeView', 'HeaderView','MediaShowLayout', 'MediaDataView', 'MediaNavbar',
    'MediaShowHeadForm', 'SearchEntitiesForm', 'MediaShowStateForm',
	'DocumEditLayoutView', 'DocumListLayoutView', 'DocumNavbar',
    'ProductionEditLayoutView', 'ProductionListLayoutView', 'ProductionNavbar',
    'ProductionEditCore', 'ProductionEditASLayout', 'ProductionEditASHeader', 'ProductionEditASItem',
    'MediaShowHeadView','MediaShowEntitiesForm','MediaShowSelectorForm'
     ], function() {

    $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });


    console.log('main: studio.start');

    StudioManager.start();
});



/*
utils.loadTemplate(['HomeView', 'HeaderView', 'AboutView',
	'DocumEditLayoutView', 'DocumListLayoutView', 'DocumNavbar',
    'DocumEditMin', 'DocumShowDef','DocumEditCore','DocumEditPT', 'SearchEntitiesForm','DocumEditPTLayout','DocumEditPTItem',
    'DocumEditRE', 'DocumEditREItem','DocumEditEM','DocumEditEMItem','DocumEditEMHeader', 'DocumShowLayoutView',
    'DocumShowBranding', 'DocumShowHeader', 'DocumShowItemPTHeader', 'DocumShowItemLayoutView','DocumShowItemPTComposite',
    'DocumShowItemPTDetail','DocumShowItemREHeader','DocumShowItemREComposite','DocumShowItemREDetail', 
    'DocumShowItemPEHeader', 'DocumShowItemPEComposite', 'DocumShowItemPEDetail',
    'DocumRelatedLayout', 'DocumRelatedPRHeader', 'DocumRelatedPR', 'DocumRelatedDOC',
    'DocumShowItemPDHeader', 'DocumShowItemPDComposite',
    'ReportEditLayoutView', 'ReportEditCore', 'ReportNavbar' ], function() {

*/