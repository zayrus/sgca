utils.loadTemplate(['HeaderView', 'AboutView','DocumEditLayoutView','DocumEditSolLayoutView', 'DocumListLayoutView', 'DocumNavbar',
    'DocumEditMin', 'DocumShowDef','DocumEditCore','DocumEditPT', 'SearchEntitiesForm','DocumEditPTLayout','DocumEditPTItem',
    'DocumEditRE', 'DocumEditREItem','DocumEditEM','DocumEditEMItem','DocumEditEMHeader', 'DocumShowLayoutView',
    'DocumShowBranding', 'DocumShowHeader', 'DocumShowItemPTHeader', 'DocumShowItemLayoutView','DocumShowItemPTComposite',
    'DocumShowItemPTDetail','DocumShowItemREHeader','DocumShowItemREComposite','DocumShowItemREDetail', 
    'DocumShowItemPEHeader', 'DocumShowItemPEComposite', 'DocumShowItemPEDetail',
    'DocumRelatedLayout', 'DocumRelatedPRHeader', 'DocumRelatedPR', 'DocumRelatedDOC',
    'DocumShowItemPDHeader', 'DocumShowItemPDComposite',
    'DocumEditSO','DocumEditSOItem','DocumEditSOLayout',
    'DocumEditPSO','DocumEditPSOItems','DocumEditPSOHeader', 'DocumEditPSOSItems','DocumEditPSOSDetailsHeader','DocumEditPSOSDetails',
    'DocumShowItemSODetail','DocumShowItemSOComposite','DocumShowItemSOHeader',
    'ReportEditLayoutView', 'ReportEditCore', 'ReportNavbar','MailTemplateDefault','HomeShowLayoutView','HomeShowIntroView','HomeShowFeatureItemComposite','HomeShowFeatureItemDetail','HomeShowGalleryItemsView','DocumEditINS','DocumEditINSDetailHeader','DocumEditINSDetails',], function() {

    $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });
	
    console.log('main: DocManager.start')
    DocManager.start();
});
