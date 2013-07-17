define(function(){


    var overrideIframeFuncs= function(iwindow , frame){
        iwindow.open = function(url){
            iwindow.parent.Event.dispatchEvent('tab:open' , url);
        };
        iwindow.document.body.addEventListener('click' , function(e){
            var el = $(e.target);
            if( el.prop('tagName').toLowerCase() != 'a' ){
                el = el.parent('a');
            }
            if( el.length && el.prop('tagName').toLowerCase() == 'a'){
                e.preventDefault();
                if( el.attr('target') == '_blank' ){
                    iwindow.parent.Event.dispatchEvent('tab:open' , el.attr('href'));
                }else{
                    iwindow.parent.Event.dispatchEvent('tab:update' , el.attr('href') , frame);
                }
            }
        });

    };

    return{
        inject: function(iframe){
            iframe = $(iframe);
            iframe.forEach(function(item){
                var iwindow = item.contentWindow;
                iwindow.addEventListener('load' , function(){
                    iwindow.parent.Event.dispatchEvent( 'tab:updateTitle' ,iwindow.document.title , item);
                    overrideIframeFuncs(iwindow , item);
                });

            });
            
        }
    };
});
