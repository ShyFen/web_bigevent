$(function() {

    var layer = layui.layer
    var form = layui.form

    initCart()

    // 初始化富文本编辑器
    initEditor()

    // // 加载文章分类的方法
    function initCart() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })


    // 监听隐藏按钮的变化事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        var files = e.target.files

        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }

        // 根据文件创建对应的url地址
        var newImageURL = URL.createObjectURL(files[0])

        // 为裁剪区重新设置图片
        $image.cropper('destroy').attr('src', newImageURL).cropper(options)

    })

    // 定义文章的发布状态，发布或者草稿
    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 为表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()

        // 快速创建一个formDate对象
        var fd = new FormData($(this)[0])

        // 将发布状态存到fd中
        fd.append('state', art_state)

        // 将裁剪区放到fd中
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })


    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // 发布文章成功后，跳转到文章列表页面
                location.href = './art_list.html'
            }
        })
    }

})