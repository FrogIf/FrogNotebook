# ajax请求重定向

```javascript
$(function () {
    /*
     * 全局使用complete方法, 
     * 后台在响应头中, 加入一个标记, 指示当前是否是登录状态
     * 多个ajaxComplete不会相互覆盖, 可以放心使用
     */
   $(document).ajaxComplete(function (event, xhr, settings) {
       var hasLogin = xhr.getResponseHeader("login");
       if(hasLogin === "false"){
          var win = window;
          while(win !== win.top){
             win = win.top;
          }
          // 或者直接指定一个路径
          win.location.reload();
       }
   })
})
```