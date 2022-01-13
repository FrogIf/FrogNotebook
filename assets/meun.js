var active_url = '';
const baseUrl = location.pathname;
$(function () {
    console.log(baseUrl);
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
            $(".article-content").load(getAbsolutePath(active_url));
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
})

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