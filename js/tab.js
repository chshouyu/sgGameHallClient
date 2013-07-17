define( ['conf','utpl' , 'utils' ,'iframe' , 'event' ] , function(conf , utpl , utils , iframe , event){
    var CURR_CN = 'current';
    var TAB_HTML = utpl.compile('<li id="MainTab{{guid}}" data-target="MainIframe{{guid}}" data-force="{{force}}">{{ name|raw }}</li>');
    var TARGET_HTML = utpl.compile('<li id="MainIframe{{guid}}" data-target="MainTab{{guid}}"><iframe src="{{url}}"></iframe></li>');

    var tabWrp = $('header .tab');
    var targetWrp = $('#GameHall');


    var bindEvent = function(){
        tabWrp.on('click' , 'li' , function(){
            if( $(this).hasClass(CURR_CN) )
                return;

            var lis = tabWrp.find('li');
            var currentIdx;
            var current = this;
            lis.forEach(function(item,idx){
                if( item == current ){
                    currentIdx = idx;
                }
            });
            focusTab(currentIdx);
        }).on('mouseup' , 'li' , function(e){
            var li = $(this);
            if( +li.data('force') == 1 )
                return;
            if( e.button == 1 ){//mouse middle btn
                removeTab( li.attr('id') );
            }
        });
        
    };

    var focusTab = function(idx){
        idx  = (idx < 0) ? ( tabWrp.find('li').length + idx ) :idx;
        tabWrp.find('li').forEach(function(item){
            $(item).removeClass(CURR_CN);
        });
        targetWrp.find('li').forEach(function(item){
            $(item).removeClass(CURR_CN);
        });
        tabWrp.find('li').eq(idx).addClass(CURR_CN);
        targetWrp.find('li').eq(idx).addClass(CURR_CN);
    };

    var removeTab = function(id){
        id = id.indexOf('#') ==0 ? id : ('#'+id);
        var el = $(id);
        var target = $('#' + el.data('target'));
        el.remove();
        target.remove();
        focusTab(-1);
    };
    
    return {
        init: function(){
            bindEvent();

            event.addEventListener('tab:updateTitle' , function(title,frame){
                var tab = $('#' + $(frame).parent().data('target'));
                tab.html(title);
            });
            event.addEventListener('tab:open' , function(url){
                this.add('' , url , false , true);
            }.bind(this));
            event.addEventListener('tab:update' , function(url , frame){
                var frameId = $(frame).parent().attr('id');
                var li = $('#' + $(frame).parent().data('target'));
                var force = +li.data('force');
                removeTab(frameId);
                this.add('',url , force ,true);
            }.bind(this));
        },
        focus: function(idx){
            focusTab(idx);
        },
        add: function( name, url , force , focus){
            url = (url.indexOf('http') == 0) ? url : conf.GHUrl + url;
            var guid = utils.guid();
            tabWrp.append(TAB_HTML( {name:name , guid:guid , force: +force || 0 } ));
            targetWrp.append( TARGET_HTML( {url:url , guid:guid} ) );

            if( focus ){
                focusTab(-1);
            }
            var ifel = targetWrp.find('li').last().find('iframe')[0];

            iframe.inject(ifel);
        },
        remove: function(id){
            removeTab(id);
        },
        updateTitle: function(title){
            tabWrp.find('li').last().html(title);
        }
    };


});
