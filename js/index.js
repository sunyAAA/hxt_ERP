"use strict";

/**
 * Created by xsann on 2017/8/23.
 */

$(function () {
    //工具函数：时间戳格式化
    Date.prototype.format = function (format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var i in date) {
            if (new RegExp("(" + i + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[i] : ("00" + date[i]).substr(("" + date[i]).length));
            }
        }
        return format;
    };
    //表格切换行为绑定
    $('#select-box').on('click', 'a.table-toggle', function (e) {
        e.preventDefault();
        showTable($(this).data('tid'));
    });
    //modal 行为绑定
    $('#modal-box').on('click', 'a.modal-toggle', function (e) {
        e.preventDefault();
        showModal($(this).data('mid'));
    });
    $('.w3-modal-content').click(function (e) {
        e.stopPropagation();
    });
    $('.w3-modal').click(function () {
        $(this).removeClass('modal-show');
    });
    //出库表编码输入获取信息行为绑定
    $('#out-pid').on('blur', function () {
        var pid = $(this).val();
        //getTotalByPid(pid);
        getOutList(pid);
    });
    $('#outList').on('click', 'td>a', function () {
        var orderId = $('#out-orderId').val();
        var cid = $(this).data('cid');
        var count = $(this).parent().prev().children('input').val();
        var max = $(this).parent().prev().children('input').attr('max');
        var $info = $('p.out-info');
        if (!orderId) {
            $info.html('* 请输入订单编号 *');
            return;
        } else if (parseInt(count) > max) {
            $info.html('发货数量有误或超出范围');
            return;
        } else if (orderId && cid && count) {
            $info.html('');
            updateOut(orderId, cid, count);
        }
    });
    $('#btn-out').click(function () {
        modalHide();
    });
    //入库表 行为绑定
    for (var i = 1; i < 32; i++) {
        var html = "<option value=\"" + i + "\">" + i + "</option>  ";
        if (i < 13) {
            $('#in-month').append(html);
            $('#in-day').append(html);
            $('#accMouth').append(html);
        } else {
            $('#in-day').append(html);
        }
    }
    for (var _i = new Date().getFullYear(); _i >= 2012; _i--) {
        var optYear = "<option value=\"" + _i + "\">" + _i + "</option>  ";
        $('#in-year').append(optYear);
    }
    $('#in-pid').on('blur', function () {
        var pid = $(this).val();
        formCompletion(pid);
    });
    $('#btn-in').click(function () {
        if (checkFormIn()) {
            var data = $('#form-in').serialize();
            updateIn(data);
        }
    });
    $('.btn-complete').click(function () {
        modalHide();
    });
    //  日志查询初始化
    $('#accYear').val(new Date().getFullYear()).change(accountSelectByDate);
    $('#accMouth').val(new Date().getMonth() + 1).change(accountSelectByDate);
    //删除功能
    $('#delete-pid').on('blur', function () {
        var pid = $(this).val();
        showDeleteList(pid);
    });
    $('#deleteList').on('click', 'a.a-delete', function () {
        var cid = $(this).data('cid');
        updateDelete(cid);
    });
    $('#btn-delete').click(function () {
        modalHide();
    });
    //修改功能
    $('#revise-pid').on('blur', function () {
        var pid = $(this).val();
        if (pid) {
            getReviseData(pid);
        }
    });
    $('#btn-revise').click(function () {
        if (checkFormRevise()) {
            if ($('#revise-pid').val()) {
                var data = 'pid=' + $('#revise-pid').val() + '&' + $('#form-revise').serialize();
                updateRevise(data);
            }
        }
    });
    //登录功能
    $('#btn-login').click(function (e) {
        e.preventDefault();
        checkLoginForm();
    });
    //登出功能
    $('#btn-quit').click(function () {
        sessionStorage.removeItem('uname');
        location.reload();
    });
    //打印和导出
    $('#goPrint').click(function () {
        window.print();
    });
    $('#goExcel').click(function () {
        $('div.table-show>table').table2excel({
            exclude: ".noExl",
            name: "Worksheet Name",
            filename: new Date().format('yy-MM-dd'),
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true
        });
    });
    init();
});
//页面初始化
function init() {
    checkLogin();
    update();
    getAccountInit();
}
//表格切换
function showTable(tid) {
    $('div.table-show').removeClass('table-show');
    $(tid).addClass('table-show');
    switch (tid) {
        case "#table-detail":
            update();
            break;
        case "#table-total":
            updateTotal();
            break;
        case "#table-account":
            updateAccount();
            break;
        default:
            break;
    }
}
//modal 显示
function showModal(mid) {
    $('div.modal-show').removeClass('modal-show');
    $(mid).addClass('modal-show');
}
//modal 隐藏
function modalHide() {
    $('div.modal-show').removeClass('modal-show');
    showTable('#table-detail');
}
//table-detail 视图更新
function update() {
    $.ajax({
        type: 'GET',
        url: 'data/getAll.php',
        success: function success(data) {
            var html = '';
            var info = "";
            var success = "w3-light-grey";
            var style = info;
            for (var i = 0; i < data.length; i++) {
                var p = data[i];
                var changeTime = p.mdate == 0 ? '无记录' : new Date(p.mdate / 1).format('yyyy-MM-dd');
                var inTime = new Date(p.inTime / 1).format('yyyy-MM-dd');
                if (i > 0) {
                    var n = data[i - 1];
                    if (p.pid != n.pid) {
                        style = style === info ? success : info;
                    }
                }
                html += '<tr class=' + style + '>\n                 <td>' + p.pid + '</td>\n                 <td>' + p.name + '</td>\n                 <td>' + p.spec + '</td>\n                 <td>' + parseFloat(p.count) + '</td>\n     <td>' + p.unit + '</td>\n            <td>' + inTime + '</td>\n                 <td>' + changeTime + '</td>\n       <td>' + p.depot + '</td>\n          <td>' + p.breed + '</td>\n             </tr>\n                   ';
            }
            $('#tb-detail').html(html);
        }
    });
}
//table-total   视图更新
function updateTotal() {
    $.ajax({
        type: 'GET',
        url: 'data/getTotal.php',
        success: function success(data) {
            var html = '';
            var info = "";
            var success = "w3-light-grey";
            var style = info;
            for (var i = 0; i < data.length; i++) {
                var p = data[i];
                if (i > 0) {
                    var n = data[i - 1];
                    if (p[0] != n[0]) {
                        style = style === info ? success : info;
                    }
                }
                html += '<tr class=' + style + '>\n                            <td>' + p[0] + '</td>\n                            <td>' + p[1] + '</td>\n                            <td>' + p[2] + '</td>\n                            <td class="text-primary"><b>' + parseFloat(p[3]) + '</b></td>\n                            <td>' + p[4] + '</td>\n   <td>' + p[5] + '</td>\n         <td>' + p[6] + '</td>\n            </tr>';
            }
            $('#tb-total').html(html);
        }
    });
}
//table-account 视图更新
function updateAccount(year, month, limit) {
    if (!year) {
        year = new Date().getFullYear();
    }
    if (!month) {
        month = new Date().getMonth() + 1;
    }
    $.ajax({
        type: 'GET',
        url: 'data/getAccount.php',
        data: { accYear: year, accMonth: month, accLimit: limit },
        success: function success(data) {
            if (data.length) {
                var html;
                for (var i = 0; i < data.length; i++) {
                    var p = data[i];
                    var time = new Date(p.aTime / 1).format('MM-dd hh:mm');
                    if (p.aType == "出库") {
                        html += '<tr class=""><td>' + p.orderId + '</td><td>' + p.aType + '</td>';
                    } else {
                        html += '<tr class="w3-light-grey"><td>' + p.orderId + '</td><td>' + p.aType + '</td>';
                    }
                    html += '<td><b>' + time + '</b></td><td>' + p.pid + '</td>\n                        <td>' + p.name + '</td>\n                        <td>' + p.spec + '</td>\n                        <td>' + p.unit + '</td>\n     <td>' + p.depot + '</td>\n                   <td><b>' + parseFloat(p.aCount) + '</b></td>\n                    </tr>';
                }
                $('#tb-account').html(html);
            } else {
                alert('无相关数据');
            }
        }
    });
}
function getAccountInit(year, month) {
    //account表头日期初始化    查询功能
    if (!year) {
        year = $('#accYear').val();
    }
    if (!month) {
        year = $('#accMonth').val();
    }
    //分页初始化
    $.ajax({
        type: 'GET',
        url: 'data/getAccountInit.php',
        data: { accYear: year, accMonth: month },
        success: function success(data) {
            if (data) {
                var i = Math.ceil(data[0] / 200),
                    html;
                $('.accTotal').html(i);
                for (var n = 1, m = 0; n <= i; n++, m++) {
                    html += '<option value="' + m + '">第 ' + n + ' 页</option>';
                }
                $('#accLimit').html(html).append($('<option value="all">显示全部（按月份导出为EXL）</option>')).change(getAccountByPager);
            }
        }
    });
}
//table-account 按日期查询功能
function accountSelectByDate() {
    var year = $('#accYear').val();
    var month = $('#accMouth').val();
    getAccountInit(year, month);
    updateAccount(year, month);
}
function getAccountByPager() {
    var year = $('#accYear').val();
    var month = $('#accMouth').val();
    var limit = $('#accLimit').val();
    updateAccount(year, month, limit);
}
function getOutList(pid) {
    $.ajax({
        type: 'GET',
        url: 'data/getByPid.php',
        data: { pid: pid },
        success: function success(data) {
            var html,
                total = 0;
            if (data.length) {
                for (var i = 0; i < data.length; i++) {
                    var p = data[i];
                    total += parseFloat(p.count);
                    if (p.pid === pid) {
                        var inTime = new Date(p.inTime / 1).format('yyyy-MM-dd');
                        html += '<tr>\n                                                             <td>' + p.name + '</td>\n                                <td class="td-count">' + parseFloat(p.count) + '</td>\n                                <td>' + p.unit + '</td>\n                                <td>' + inTime + '</td>\n                   <td>' + p.depot + '</td>\n              <td>\n                                    <input class="w3-input" type="number" min="0" max=' + p.count + ' name="count">\n                                </td>\n                                <td><a href="#" data-cid="' + p.cid + "\" class=\"w3-btn-block w3-green\">\u786E\u8BA4\u53D1\u8D27</a></td>\n                            </tr>";
                    }
                }
            } else {
                html += "<tr><td colspan=\"7\"><div class=\"w3-container w3-green\">\n            <h4>\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u5546\u54C1\u7F16\u7801 </h4>\n            <span onclick=\"this.parentElement.style.display='none'\" class=\"w3-closebtn\">x</span>\n        </div></td></tr>   ";
            }
            $('#outList').html(html);
            $('.getCount').html(total);
        }
    });
}
//ajax 出库功能、同时更新出库表
function updateOut(orderId, cid, count) {
    $.ajax({
        type: 'GET',
        url: 'data/update.php',
        data: { orderId: orderId, cid: cid, count: count },
        success: function success(data) {
            if (data.msg === 'succ') {
                $('.out-succ-alert').attr('style', 'display:block');
                getOutList($('#out-pid')[0].value);
                setTimeout(function () {
                    $('.out-succ-alert').attr('style', 'display:none');
                }, 3500);
            } else {
                $('.out-err-alert').attr('style', 'display:block');
                setTimeout(function () {
                    $('.out-err-alert').attr('style', 'display:none');
                }, 3500);
            }
        }
    });
}
//ajax 入库功能-表单检查
function checkFormIn() {
    $('#form-in input').each(function () {
        if ($(this).val() === '') {
            $('p.in-info').html('请保证数据完整性');
            return false;
        } else {
            $('p.in-info').html('');
        }
    });
    return true;
}
//ajax 入库表单补全功能
function formCompletion(pid) {
    $.ajax({
        type: 'GET',
        url: 'data/getAll.php',
        data: { 'in-pid': pid },
        success: function success(data) {
            if (data) {
                $('#in-name').val(data.name);
                $('#in-spec').val(data.spec);
                $('#in-unit').val(data.unit);
                $('#in-breed').val(data.breed);
            }
        }
    });
}
//ajax 入库表单提交功能
function updateIn(data) {
    $.ajax({
        type: 'POST',
        url: 'data/add.php',
        data: data,
        success: function success(data) {
            if (data.msg = 'succ') {
                $('#form-in')[0].reset();
                $('.in-succ-alert').attr('style', 'display:block');
                setTimeout(function () {
                    $('.in-succ-alert').attr('style', 'display:none');
                }, 3500);
                return true;
            } else {
                alert(data.msg);
            }
        }
    });
}
//ajax 删除表单获取信息
function showDeleteList(pid) {
    $.ajax({
        type: 'GET',
        url: 'data/getByPid.php',
        data: { pid: pid },
        success: function success(data) {
            var html = '';
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    var p = data[i];
                    if (p.pid === pid) {
                        var inTime = new Date(p.inTime / 1).format('yyyy-MM-dd');
                        html += ' <tr>\n                                               <td>' + p.name + '</td>\n                                               <td>' + p.unit + '</td>\n                        <td class="text-primary">' + inTime + '</td>\n  <td>' + parseFloat(p.count) + '</td>\n  <td>' + p.depot + '</td>\n                      <td><a data-cid="' + p.cid + "\" href=\"#\" class=\"w3-btn-block w3-green a-delete\">\u5220\u9664</a></td>\n                    </tr>";
                    }
                }
            }
            $('#deleteList').html(html);
        }
    });
}
//ajax 删除功能、更新视图
function updateDelete(cid) {
    $.ajax({
        type: 'GET',
        url: 'data/delete.php',
        data: { cid: cid },
        success: function success(data) {
            if (data.msg === 'succ') {
                showDeleteList($('#delete-pid').val());
            }
        }
    });
}
//ajax 修改功能获取修改信息
function getReviseData(pid) {
    $.ajax({
        type: 'GET',
        url: 'data/revise.php',
        data: { pid: pid },
        success: function success(data) {
            if (data) {
                var html;
                html += "<td>" + data.name + "</td> <td>" + data.spec + "</td><td>" + data.unit + "</td><td>" + data.breed + "</td> ";
                $('#reviseTr').html(html);
            }
        }
    });
}
//修改功能表单验证
function checkFormRevise() {
    $('.revise-group input').each(function () {
        if ($(this).val() === '') {
            $('p.revise-info').addClass('w3-text-red').html('数据不可为空');
            return false;
        }
    });
    return true;
}
//ajax 修改功能、更新视图
function updateRevise(data) {
    $.ajax({
        type: 'POST',
        url: 'data/revise.php',
        data: data,
        success: function success(obj) {
            if (obj.msg = 'succ') {
                getReviseData($('#revise-pid').val());
            }
        }
    });
}
//login功能
function checkLogin() {
    if (sessionStorage['uname']) {
        completeLogin();
    }
}
function checkLoginForm() {
    if ($('#uname').val() && $("#upwd").val()) {
        $.ajax({
            type: 'POST',
            data: $('#form-login').serialize(),
            url: 'data/login.php',
            success: function success(data) {
                if (data.msg === 'succ') {
                    sessionStorage['uname'] = $('#uname').val();
                    completeLogin();
                } else {
                    $('#login-info').html('*用户名或密码错误*');
                }
            }

        });
    } else {
        $('#login-info').html('*请输入用户名和密码*');
    }
}
function completeLogin() {
    $('#form-login').addClass('w3-hide');
    $('nav>ul').removeClass('w3-hide');
    $('#btn-quit').removeClass('w3-hide');
    $('.login-title').html('登录成功，当前权限为：管理员').addClass('w3-center w3-text-teal');
}