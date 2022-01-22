$(function() {

    // 1.点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 2.点击“去登录”链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer

    // 通过form.verify()函数自定义校验规则，
    form.verify({
        // 校验密码必须是6-12位，且不能出现空格
        pwd: [/^[\S]{6,12}$/, '密码必须是6-12位，且不能出现空格'],

        // 校验再次输入密码是否一致
        repwd: function(value) {
            // value是用户再次输入的密码
            // 找到用户输入的密码,
            var pwd = $('.reg-box [name=password]').val()
            if (value !== pwd) {
                return '两次输入的密码不一致!'
            }
        }
    })


    // 监听注册表单的提交事件，判断是否注册成功
    $('#form_reg').on('submit', function(e) {
        // 阻止默认的跳转行为
        e.preventDefault()
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg(res.message);
            // 模拟人的点击行为，当注册成功之后，自动跳转到登录页面
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认行为
        e.preventDefault()

        // 快速获取表单中的数据，比上面的data要简单一点
        // var data = $(this).serialize()
        var data = {
            username: $('#form_login [name=username]').val(),
            password: $('#form_login [name=password]').val()
        }
        $.post('/api/login', data, function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg(res.message)
            console.log(res.token);

            // 将登录成功之后返回的token保存到localStorage中
            localStorage.setItem('token', res.token)

            // 登录成功就跳转到后台
            // location.href = './index.html'
        })
    })

})