define(['tab'],function(tab){


    var frameActions = {
        'close': function(){
            window.close();
        }
    };

    



    var bindFrameEvent = function(){
        $(document.body).on('click' , function(e){
            var target = $(e.target);
            var action = target.data('action');
            while( !action && target.parent() && target.parent().length ){
                action = target.parent().data('action');
                target = target.parent();
            }
            action && frameActions[action] && frameActions[action]();
        });

    };


    return{
        init: function(){
            bindFrameEvent();

            tab.init();

        }
    };
});
