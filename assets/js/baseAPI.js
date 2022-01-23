// 这是一个调用$.get() $.post() $.ajax()函数之前会调用的函数
// 在这个函数里面可以给ajax提供配置对象，也就是请求的路径
$.ajaxPrefilter(function(options) {
    // options.url:是请求的路径，在发情请求的时候，可以不用根路径，那么这个options.url也就不含根路径
    // options.url也就会是/api/login等。所以这里要拼接一下根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 为有权限的接口设置请求头
    // 包含'/my'才需要加请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全统一挂载complete回调函数
    // 不论成功还是失败都会调用这个函数
    // 这个函数在这里是用来：判断是否进行登录才进入的主页，如果没有登录直接进入主页，就强制跳转到登录页面
    options.complete = function(res) {
        // console.log('complete:' + res);
        // 在这个回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token
            localStorage.removeItem('token')

            // 2.强制跳转到登录页面
            location.href = './login.html'
        }
    }


})