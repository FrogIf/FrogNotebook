var active_url = '';
$(function () {
    $('.menu-btn').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        if ($('.menu-container').hasClass('open')) {
            $('.menu-container').removeClass('open');
            $('.article-container').removeClass('compress');
        }else{
            $('.menu-container').addClass('open');
            $('.article-container').addClass('compress');
        }
    })
    $('.article-container').click(function (e) {
        if ($('.menu-container').hasClass('open')){
            $('.menu-container').removeClass('open');
            $('.article-container').removeClass('compress');
        }
    })
    $('.article-item').click(function(e){
        var url = $(e.target).data("url");
        if(url != active_url){
            active_url = url;
            $(".article-content").load(active_url);
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
    $(".article-content").load(active_url);
})