$(function(){
    /*

    jwplayer("play2").setup({
        file: "/uploads/myVideo.mp4",
        image: "/uploads/myPoster.jpg"
    });
    */

    jwplayer("play1").setup({
        flashplayer: "lib/jwplayer.flash.swf",
        file: "http://cda.gob.ar/content/videos/clips/5/10355_700.mp4",


        // autostart: true,
        // controlbar: none|bottom,
        // duration: 57,
        width: 640,
        height: 480,
        image: "/files/assets/2013/10/07/1381156228011_puniversos_500x500_9.jpg"
    });

    jwplayer("play2").setup({
        flashplayer: "lib/jwplayer.flash.swf",
    });


});

