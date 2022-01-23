$(function() {
    // 1.获取裁剪区的DOM元素
    var $image = $('#image')

    // 2.配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,

        // 指定预览区域,这是个类名
        preview: '.img-preview'
    }

    // 3.创建裁剪区域
    $image.cropper(options)

    // 表面上是点击上传，实际是点击上传的时候，点击了选择文件
    $('#btnChooseImage').on('click', function(e) {
        $('#file').click()
    })

    // 挑选图片
    $('#file').on('change', function(e) {
        console.log(e);

        // e.target.files：这里有图片的数据
        var filelist = e.target.files;
        // console.log(filelist);
        if (filelist.length === 0) {
            return layui.layer.msg('请选择图片')
        }

        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 将文件转化成路径
        var imgURL = URL.createObjectURL(file);
        // 重新初始化裁剪区域
        $image.cropper('destroy').attr('src', imgURL).cropper(options)
    })

    // 为确定按钮绑定点击事件
    $('#btnUpload').on('click', function(e) {
        // 1.拿到用户裁剪之后的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 2.调用接口，把头像上传到服务器
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                window.parent.getUserInfo()
            }
        })
    })

})