$(function() {
    var form = layui.form

    // layui中表单的相关验证
    form.verify({
        // 规定密码的规则
        pwd: [/^[\S]{6,12}$/, '密码必须是6~12为，且不能出现空格'],

        // 判断原密码和新密码是否一致
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '不能与原密码相同'
            }
        },

        // 校验新密码和确认密码
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })

    // 提交按钮
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                console.log(res);
                layui.layer.msg(res.message)

                // 更新密码之后，清空输入框
                $('.layui-form')[0].reset()
            }
        })
    })

})