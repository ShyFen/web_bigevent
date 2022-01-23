$(function() {
    var form = layui.form
    var layer = layui.layer

    // 自己配置昵称的要求
    form.verify({
        nickname: function(value) {
            if (value.length > 6 || value.length <= 0) {
                return '昵称的长度在1~6之间!'
            }
        }
    })

    // 初始化用户信息，获取
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);

                // 使用form.val快速的给表单赋值
                // formUserInfo在html页面中是对应的,也就是给这个表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    initUserInfo()

    // 重置表单的数据,按钮
    $('#btnReset').on('click', function(e) {
        e.preventDefault()

        // 调用用户信息的函数
        initUserInfo()
    })

    // 更新用户信息,监听表单的提交
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('更新成功')
                console.log(res);
                // 在iframe中如何渲染index.html这个父页面，用window.parent方法
                // 在index.html中有个方法是渲染用户信息的，再调用这个函数，就可以重新渲染用户信息了
                window.parent.getUserInfo()
            }
        })
    })

    // 重置密码

})