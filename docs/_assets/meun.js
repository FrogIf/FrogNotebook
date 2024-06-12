var active_url = '';
const baseUrl = location.pathname;
function scrollToTarget(index){
    $('.article-content').find("h1,h2,h3,h4,h5,h6").each((i, ele) => {
        if(index == i){
            ele.scrollIntoView({ behavior: "smooth" });
        }
    });
}
$(function () {
    $('.menu-btn').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    })
    $('.article-container').click(function (e) {
        menuClose();
    })
    $('.article-item').click(function(e){
        var url = $(e.target).data("url");
        if(url != active_url){
            active_url = url;
            history.pushState('', '', baseUrl + active_url);
            $(".catalog-content").empty();
                $(".catalog-container").hide();
            $(".article-content").load(getAbsolutePath(active_url), function(){
                scrollTo(0, 0);
            });
            if(window.sessionStorage){
                window.sessionStorage.setItem("articleUrl", active_url);
            }
        }
    })

    var articleUrl = '';
    var firstUrl = '';
    if($('.article-item').length > 0){
        firstUrl = $($('.article-item')[0]).data("url");
    }
    if(window.sessionStorage){
        articleUrl = window.sessionStorage.getItem("articleUrl");
    }
    if(articleUrl != null && articleUrl.trim() != ''){
        active_url = articleUrl;
    }else{
        active_url = firstUrl;
    }

    var find = false;
    if($('.article-item').length > 0){
        $('.article-item').each((i, ele) => {
            find = $(ele).data("url") == active_url;
            return !find;
        });
    }
    if(!find){
        active_url = firstUrl;
    }
    history.pushState('', '', baseUrl + active_url);
    $(".article-content").load(getAbsolutePath(active_url));
    menuOpen();

    $('.catalog-btn').click(function (e) {
        $(".catalog-content").empty();
        $(".catalog-container").toggle();
        if($(".catalog-container").is(':hidden')){ return; }

        let allElements = new Array();
        $('.article-content').find("h1,h2,h3,h4,h5,h6").each((index, ele) => {
            allElements.push(ele);
        });
        
        function buildDom(level, index, context){
            for(let i = index; i < allElements.length; i++){
                let ele = allElements[i];
                let dom = $(ele);
                let l = parseInt(dom.get(0).tagName.substring(1));
                if(l == level){
                    context.text += '<li><a href="javascript:void(0);" onclick="scrollToTarget('+i+')">'+dom.text()+'</a></li>';
                }else if(l > level){
                    context.text += '<ul>';
                    i = buildDom(l, i, context);
                    context.text += '</ul>';
                }else{
                    return i;
                }
            }
            return allElements.length;
        }
        let context = { text : '<ul>'};
        buildDom(1, 0, context);
        context.text += '</ul>';
        $(".catalog-content").append(context.text);
    })
})

function buildCatalog(dom, level, parentNode){
    for(let i = level; i < 7; i++){
        let children = new Array();
        $(dom).find("h" + i).each((index, ele) => {
            children.push(ele);
        });
        if(children.length > 0){
            for(let j = 0; j < children.length; j++){
                let cDom = children[j];
                let node = {
                    title : $(cDom).text(),
                    children : new Array()
                };
                parentNode.children.push(node);
                buildCatalog(cDom, i, node);
            }
            break;
        }
    }
}

function getAbsolutePath(activeUrl){
    if(activeUrl.startsWith("/")){
        return activeUrl;
    }else if(activeUrl.startsWith(".")){
        return baseUrl + activeUrl.substring(1);
    }else{
        return baseUrl + activeUrl;
    }
}

function toggleMenu(){
    if ($('.menu-container').hasClass('open')){
        menuClose();
    }else{
        menuOpen();
    }
}


function menuOpen(){
    $('.menu-container').addClass('open');
    $('.article-container').addClass('compress');
}

function menuClose(){    
    $('.menu-container').removeClass('open');
    $('.article-container').removeClass('compress');
}