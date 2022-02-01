$(function() {

    var layer = layui.layer
    var form = layui.form

    initArtCateList()


    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg = res.message
                }
                // console.log(res);
                // 只要导入了template就可以调用这个函数 template()
                // 将返回回来的字符串给tbody
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

            }
        })
    }

    // 添加类别的弹出层
    var indexAdd = null; //这个参数是为了添加成功之后关闭弹出层的
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            // 这个type是1的时候，就没有确定按钮了
            type: 1,
            // area可以修改这个框的宽高
            area: ['400px', '250px'],
            title: '添加',
            // 这里是弹出层里面的内容的，拿到标签内容
            content: $('#dialog-add').html()
        })
    })

    // 因为添加时弹出框，是即时生成的，所以绑定submit事件的时候，要用到代理的形式
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 新增成功，调用列表函数，重新渲染
                initArtCateList()
                layer.msg(res.message)

                // 新增成功之后，关闭弹出层
                layer.close(indexAdd)
            }
        })
    })


    // 通过代理形式为 编辑 添加绑定事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出 编辑 
        indexEdit = layer.open({
            // 这个type是1的时候，就没有确定按钮了
            type: 1,
            // area可以修改这个框的宽高
            area: ['400px', '250px'],
            title: '修改文章分类',
            // 这里是弹出层里面的内容的，拿到标签内容
            content: $('#dialog-edit').html()
        })

        // 在html页面的编辑中添加了一个自定义属性，存放id值，
        var id = $(this).attr('data-id');
        // console.log(id);
        // 发起请求，获取对应的分类的数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })

    })

    // 通过代理的形式为修改分类的表单，绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                layer.msg(res.message)
                    // 关闭弹出层
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理的形式为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function(e) {
        e.preventDefault()
        var id = $(this).attr('data-id');
        // console.log(id);
        // layui的模板，提示用户是否要删除
        layer.confirm('确认删除', {
            icon: 3,
            title: '提示',
        }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        layer.msg(res.message)
                    }
                    layer.msg(res.message)
                }
            })
            layer.close(index)
            initArtCateList()
        })
    })

})