$(function() {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义查询的参数对象，将来请求数据的时候，需要将请求参数提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //分类文章的id
        state: '' //文章发布时的状态
    }

    initTable()
    initCate()



    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                layer.msg(res.message)
                var htmlStr = template('tpl-table', res);
                // 将htmlStr填充到tbody中
                $('tbody').html(htmlStr)

                // 渲染分页
                renderPage(res.total)
            }
        })
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 获取文章所有分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name = cate_id]').html(htmlStr);
                // 告诉layui，要重新渲染,不然渲染不出来
                form.render()
            }
        })
    }

    // 为筛选的表单提供一个submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        // 获取表单中的分类和状态数据
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state').val()

        // 更新 对象q 中的数据
        q.cate_id = cate_id
        q.state = state

        // 根据筛选条件，重新渲染表单数据
        initTable()
    })

    // 渲染分页
    function renderPage(total) {
        // 调用laypage.render()的方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //存放容器，将容器的id显示过来，不带#
            count: total,
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //设置默认被选中的分页

            // 默认的layout就是'prev','page','next'这三个参数，而且顺序也很重要
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 当点击某一页的时候，需要使用这个回调函数 jump 
            // 触发jump回调的方法有两个：
            // 1.点击页码的时候
            // 2.只要调用了 laypage.render()方法，就会触发jump回调
            // jump的第二个参数是一个布尔值，为true的时候是方法二，为undefined的时候是方法一
            jump: function(obj, first) {
                // obj中的curr赋值给q的页码数
                q.pagenum = obj.curr
                console.log(obj.curr);

                // 把最近的一页显示几条的数据，给q
                q.pagesize = obj.limit

                // !first:表示方法一，才能调用initTable() 不然如果直接调用initTable 就会陷入死循环
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除文章
    $('tbody').on('click', '.btn-delete', function(e) {
        // e.preventDefault()
        console.log('ok');
        // 获取文章的id
        var id = $(this).attr('data-id')

        // 获取删除按钮的个数
        var len = $('.btn-delete').length

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)

                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })

    })
})