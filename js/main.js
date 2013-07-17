define('main' , ['conf','frame' , 'tab'] , function(conf, frame , tab){

    return{
        init: function(){
            frame.init();
            
            tab.add('<b></b>我的游戏' , conf.GHUrl+ '/static/mini/mygame.html' , true );
            tab.add('游戏大厅' , conf.GHUrl , true , true);
        }
    }
});


