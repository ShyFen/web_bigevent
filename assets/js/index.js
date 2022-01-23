$(function() {
    // 渲染用户信息
    getUserInfo()

    // 点击退出
    $('#btnLogout').on('click', function() {
        layui.layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')

            // 2. 重新跳转到登录页面
            location.href = './login.html'

            // 关闭 confirm 询问框，官方写法
            layui.layer.close(index)
        })
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            console.log(res);

            // 获取信息成功之后，调用renderAvatar这个函数来渲染头像
            renderAvatar(res.data)
        },

    })
}

// 获取头像的函数
function renderAvatar(user) {
    // 用户的姓名
    var name = user.nickname || user.username

    // 设置欢迎的内容
    $('#welcome').html('欢迎,' + name)

    // 头像
    if (user.user_pic !== null) {
        // 有头像
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', user.user_pic).show()
    } else {
        // 无头像
        $('.layui-nav-img').hide()

        // 获取到首字母，然后转大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }

}