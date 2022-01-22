// 这是一个调用$.get() $.post() $.ajax()函数之前会调用的函数
// 在这个函数里面可以给ajax提供配置对象，也就是请求的路径
$.ajaxPrefilter(function(options) {
    // options.url:是请求的路径，在发情请求的时候，可以不用根路径，那么这个options.url也就不含根路径
    // options.url也就会是/api/login等。所以这里要拼接一下根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
})