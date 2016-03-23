;(function (win, doc, $, undefined) {
    var conf = {
        'name': 'RongCloudWebSDK',
        'isPCBrowser': false,
        'keyboardHeight': 0,
        'winWidth': 0,
        'winHeight': 0,
        'statuHeight': 0,
        'RongIMVoice': false
    };
    conf.pc = {
        'MinWidth': 960,
        'FooterMinHeight': 60,
        'Mt': $(".left").css('margin-top'),
        'Mb': 20
    };
    conf.scroll = {
        'cursorcolor': "#78d0f4",
        'cursoropacitymax': 1,
        'touchbehavior': true,
        'cursorwidth': "5px",
        'cursorborder': "0",
        'cursorborderradius': "5px"
    };
    conf.popBox = {
        'title': '创建讨论组',
        'left_subtitle': '我的好友',
        'defaultTitle': '讨论组',  //只读，不建议代码修改
        'discussionTitle': '讨论组',
        'right_subtitle': '已选择的好友'
    };
    conf.popBox.html = {};
    conf.popBox.html.discussion = [
        '<div class="light_popBox_backlayer"></div>',
        '<div class="popBox_frontlayer">',
        '<div class="light_popBox_MainWrapper">',
        '<div class="light_popBox_title">',
            '<span style="float:left" onselectstart="return false">' + conf.popBox.title + '</span>',
            '<span style=""><font class="discussionTitle" style="margin-left: 0px; line-height: 16px;">'+conf.popBox.defaultTitle+'</font><font class="pen"></font></span>',
        '<span class="light_popBox_close">',
        '<a href="javascript:void(0)" onselectstart="return false" id="light_popBox_close">',
        '<img style="margin-top:12px;" src="./static/images/icon_close.png">',
        '</a>',
        '</span>',
        '</div>',
        '<div class="light_popBox_content">',
        '<div class="light_popBox_friendList">',
            '<div class="discussion_subtitle"><span>' + conf.popBox.left_subtitle + '</span></div>',
        '<div class="discussion_listAddr"><ul></ul></div>',
        '</div>',
        '<div class="discussion_userList">',
            '<div class="discussion_subtitle"><span>' + conf.popBox.right_subtitle + '</span></div>',
        '<div class="discussion_listAddr"><ul></ul></div>',
        '</div>',
        '</div>',
        '<div class="light_popBox_opear">',
        '<span class="light_popBox_notice">最多只能选择49个好友</span>',
        '<span class="sub">',
        '<a href="javascript:void(0)" target="_blank">立即创建</a>',
        '</span>',
        '</div></div>',
        '</div>'
    ].join('');
    var lib = {};
    lib.clone = function (obj) {
        var that = this;
        if (typeof(obj) != 'object') return obj;
        if (obj == null) return obj;
        var newObj = {};
        for (var i in obj) {
            newObj[i] = that.clone(obj[i]);
        }
        return newObj;
    };
    lib.delay = function (d) {
        for (var t = Date.now(); Date.now() - t <= d;);
    };
    lib.uniqueArray = function(arr){
        var res = [];
        var json = {};
        for(var i = 0; i < arr.length; i++){
            if(!json[arr[i]]){
                res.push(arr[i]);
                json[arr[i]] = 1;
            }
        }
        return res;
    };

    //经常用的是通过遍历,重构数组.
    Array.prototype.remove=function(val) {
        var dx = this.getIndexByValue(val);
        if(isNaN(dx)||dx>this.length){return false;}
        for(var i=0,n=0;i<this.length;i++)
        {
            if(this[i]!=this[dx])
            {
                this[n++]=this[i]
            }
        }
        this.length-=1
    };

    //在数组中获取指定值的元素索引
    Array.prototype.getIndexByValue = function(value){
        var index = -1;
        for (var i = 0; i < this.length; i++)
        {
            if (this[i] == value)
            {
                index = i;
                break;
            }
        }
        return index;
    };

    var self = {};
    self.conf = conf;
    self.isPCBrowser = function () {
        conf.winWidth = $(window).width();
        return conf.winWidth > conf.pc.MinWidth;
    };

    self.setBoxHeight = function (heigh) {
        var winHeight = $(window).height();
        if (heigh && typeof(heigh) == "number") {
            winHeight = heigh;
        }
        ;

        var otherHeight = 0;
        if (self.isPCBrowser()) {
            otherHeight = conf.pc.FooterMinHeight + conf.pc.Mb + 25;  //上下空隙间距
            $(".bro_notice").show();
            $(".left").show();
            $(".right_box").show();
        } else {
            if ($(".right_box").is(":visible") == true) {
                $(".left").hide();
            }
        }
        var intBoxHeight = winHeight - otherHeight;
        var intBoxMinHeight = $(".left").css('min-height');
        intBoxMinHeight = parseInt(intBoxMinHeight);
        if (intBoxHeight > intBoxMinHeight) {
            $(".left").height(intBoxHeight);
            $(".right_box").height(intBoxHeight);
        } else {
            $(".left").height(intBoxMinHeight);
            $(".right_box").height(intBoxMinHeight);
        }
        $(".right").height($(".right_box").height());
        self.setListHeight();
        self.setDialogBoxHeight();
    };
    self.setListHeight = function () {
        var intListHeight = 0;
        var intHeaderHeight = $(".dialog_header").height();
        var intOperHeight = 0;
        var boxMb = 0;
        if ($(".listOperatorContent") && $(".listOperatorContent").is(":visible")) {
            intOperHeight = $(".listOperatorContent").height();
            boxMb = conf.pc.Mb;
        }
        var intBoxHeight = $(".left").height();
        intListHeight = intBoxHeight - intHeaderHeight - intOperHeight - boxMb;
        $(".list").height(intListHeight);
    };
    self.setDialogBoxHeight = function () {
        var intBoxHeight = $(".right").height();
        var intMsgBoxHeight = 0;
        if (self.isPCBrowser()) {
            intMsgBoxHeight = $(".msg_box").outerHeight();
        } else {
            intMsgBoxHeight = 44;
        }
        var otherHeight = intMsgBoxHeight + $(".dialog_box_header").outerHeight();
        if ($(".pagetion_list") && $(".pagetion_list").is(":visible") == true) {
            otherHeight = $(".pagetion_list").height() + conf.pc.Mb;
        }
        var msgBoxHeight = intBoxHeight - otherHeight;
        $(".dialog_box").css('height', msgBoxHeight);
    };
    /**
     * 定位单条未读消息数
     */
    self.locateNum = function (index, obj) {
        var padding = 3;
        var intWidth = $(obj).width();
        var val = $(obj).html();
        if (val && val > 0) {
            $(obj).css('display', 'inline-block');
            $(obj).css('padding', padding);
            $(obj).css('margin-left', -intWidth / 2 - 6);
        } else {
            $(obj).hide();
        }
    };
    self.locateMsgStatu = function (index, obj) {
        var prevHeight = $(obj).prev("div").height();
        var marTop = (prevHeight - $(obj).height()) / 2 + 1.5 * $(obj).height();
        $(obj).css("margin-top", -marTop);
    };

    self.back = function () {
        if ($(".right_box").is(":visible")) {
            $(".right_box").hide();
            $(".left").show();
            if (!$(".listAddr").is(":visible")) {
                $(".listConversation").hide();
                $(".listConversation").show();
            } else {
                $(".listAddr").hide();
                $(".listAddr").show();
            }
        } else {
            $(".listAddr").hide();
            $(".listConversation").show();
            $(".logOut").show();
            $(".addrBtnBack").hide();
        }
    };
    var popBox = {};
    var discussionList = {
        'currentDiscusionUserList': [], //当前讨论组的用户列表
        'newUserList': [],  //添加或删除生成的讨论组临时用户列表
        'newDiscussionTitle': conf.popBox.newDiscussionTitle//新建讨论组绑定popBox title
    };
    var discussion = {};
    /**
     * 修改讨论组名称
     */
    discussion.changeTitle = function(ev) {
        var objTitle = $(this).prev("font");
        if ($(this).text() == '确认') {
            conf.popBox.discussionTitle = objTitle.text();
            objTitle.removeAttr('contenteditable');
            objTitle.css('border', 'none');
            $(this).text('');
            $(this).removeAttr('style');
            $(this).css({
                width: '16px'
            });
        } else if ($(this).text() == '') {
            objTitle.selectstart = function() {};
            objTitle.attr('contenteditable', 'true')
                .css({
                    "cursor": 'initial',
                    "border-bottom": '1px solid #333'
                });
            $(this).css({
                width: 'auto',
                background: 'none'
            }).text("确认");
        };
    };
    /**
     * 讨论组添加成员
     */
    discussion.addUserTodiscussion = function(ev) {
        var obj = $(this);
        var userId = $(this).attr('targetid');
        discussionList.newUserList = discussionList.currentDiscusionUserList;
        var userToDiscussionObj = $(".discussion_userList .discussion_listAddr").find("ul");
        if (obj.hasClass('discussion_selected')) {
            obj.removeClass('discussion_selected').removeClass('discussion_selected_delete');
            discussionList.newUserList.remove(userId);
            userToDiscussionObj.find("li").each(function(index, el) {
                if ($(this).attr("targetid") == userId) {
                    $(this).remove();
                    return false;
                };
            });
        } else {
            obj.addClass('discussion_selected');
            discussionList.newUserList.push(userId);
            var userToDiscussionStr = '<li targetType="4" targetId="{0}" targetName="{1}"><span class="user_img"><img src="static/images/personPhoto.png"/></span> <span class="user_name">{1}</span><a href="javascript:void(0)" class="discussion_delete_user"></a></li>';
            var _html = String.stringFormat(userToDiscussionStr, userId, obj.attr("targetname"));
            userToDiscussionObj.append(_html);
        }
        discussionList.newUserList = lib.uniqueArray(discussionList.newUserList);
    };
    /**
     * 从讨论组临时列表删除
     */
    discussion.removeUserFromList = function(ev) {
        var objParent = $(this).parent();
        var userId = objParent.attr("targetid");
        var friendListObj = $(".light_popBox_friendList");
        friendListObj.find("li").each(function(index, el) {
            if ($(this).attr("targetid") == userId) {
                $(this).removeClass('discussion_selected');
                objParent.remove();
                discussionList.newUserList.remove(userId);
                return false;
            };
        });
        discussionList.newUserList = lib.uniqueArray(discussionList.newUserList);
    }
    /**
     * 加载好友列表
     * @return {[type]} [description]
     */
    popBox.init = function() {
        var friendList = [{"id":"6751","username":"\u674e\u6dfc","portrait":""},{"id":"6752","username":"vee","portrait":"http:\/\/www.gravatar.com\/avatar\/97d271900631dc9ea9810a1784b4407b?s=82"},{"id":"6754","username":"Ariel@iPhone","portrait":"http:\/\/www.gravatar.com\/avatar\/3f56d1043edd4b9657c465ac7a507067?s=82"},{"id":"6755","username":"Ariel@MX4","portrait":"http:\/\/www.gravatar.com\/avatar\/daf372fb788d682a987d8755377aa0f6?s=82"},{"id":"6758","username":"Z","portrait":"http:\/\/www.gravatar.com\/avatar\/977de4c12fcf7c01b0c0a4daa29cdcd5?s=82"},{"id":"6759","username":"ypx","portrait":"http:\/\/www.gravatar.com\/avatar\/62c95e14a963d0d8399f68412beb7474?s=82"},{"id":"6761","username":"osworker","portrait":"http:\/\/www.gravatar.com\/avatar\/2e880f2735c247cfa2c2ae6b484852ae?s=82"},{"id":"6762","username":"Shasta","portrait":"http:\/\/www.gravatar.com\/avatar\/8a7a7572c98e6c1c6eeb60bb90716c60?s=82"},{"id":"6764","username":"123","portrait":"http:\/\/www.gravatar.com\/avatar\/2b3779b9472cddf89283cb1a0c4b33c1?s=82"},{"id":"6766","username":"ioo","portrait":"http:\/\/www.gravatar.com\/avatar\/b81487917c4061a856f00216d74ab551?s=82&d=wavatar"},{"id":"6768","username":"fspinach","portrait":"http:\/\/www.gravatar.com\/avatar\/866c63a48518fa611f9331f5220d4f8d?s=82"},{"id":"6769","username":"xk","portrait":"http:\/\/www.gravatar.com\/avatar\/55d2142db5ed590c6fbdc78a5854884a?s=82"},{"id":"6770","username":"\u55f7\u513f","portrait":"http:\/\/www.gravatar.com\/avatar\/c5a3b616ee7fb304a8595de25fc00e67?s=82"},{"id":"6771","username":"\u7a7f\u8863\u7a7f\u8863","portrait":"http:\/\/www.gravatar.com\/avatar\/b2fb387ef252129ec6a127d673b2d3b8?s=82"},{"id":"6772","username":"eiuqohoagh","portrait":"http:\/\/www.gravatar.com\/avatar\/aaf41c0fc91216b3b383716c1b0feb51?s=82"},{"id":"6773","username":"Ivan","portrait":"http:\/\/www.gravatar.com\/avatar\/9bf4b6064c992f9981c0d873d24363c2?s=82"},{"id":"6775","username":"yangyonghui","portrait":"http:\/\/www.gravatar.com\/avatar\/bd120cd684f5b27348aeaf8c4937960c?s=82"},{"id":"6778","username":"seefar","portrait":"http:\/\/www.gravatar.com\/avatar\/ab53807ac5a59750f22ba4af3cd710f4?s=82"},{"id":"6780","username":"\u64e6\u9664","portrait":"http:\/\/www.gravatar.com\/avatar\/a25472e1ac85cf9b6a0c805957b2d572?s=82"},{"id":"6781","username":"dfdfd","portrait":"http:\/\/www.gravatar.com\/avatar\/4f50967a711fa8476aeaa43cfc9abfa7?s=82"},{"id":"6783","username":"qwe","portrait":"http:\/\/www.gravatar.com\/avatar\/0202716f34cdff5f9264f5131005aa11?s=82"},{"id":"6785","username":"123456","portrait":"http:\/\/www.gravatar.com\/avatar\/0b8fa3a759be7baceaece1dce6b6d250?s=82"},{"id":"6786","username":"chai","portrait":"http:\/\/www.gravatar.com\/avatar\/b67bc798d6d47be3b99c99dbed7e8e92?s=82"},{"id":"6787","username":"\u7d2b\u9f99","portrait":"http:\/\/www.gravatar.com\/avatar\/cd2d00c50d700a95dc1a285635b66528?s=82"},{"id":"6788","username":"\u5c0f\u9093","portrait":"http:\/\/www.gravatar.com\/avatar\/dee62ee6a394945a919f16ff772db5d4?s=82"},{"id":"6789","username":"278129","portrait":"http:\/\/www.gravatar.com\/avatar\/3d660b8557af39cd2c7b6a9a2f3818bd?s=82"},{"id":"6790","username":"hb","portrait":"http:\/\/www.gravatar.com\/avatar\/f91864a3769ed8d87a4b9f7fcba05e94?s=82"},{"id":"6791","username":"\u5f20\u4e09","portrait":"http:\/\/www.gravatar.com\/avatar\/178746ca5f3a215d054fedc8755434f9?s=82"},{"id":"6792","username":"\u5f20\u4e8c","portrait":"http:\/\/www.gravatar.com\/avatar\/6f57ef9b1a11237685451dbc4ff677d8?s=82"},{"id":"6793","username":"\u5f20\u4e00","portrait":"http:\/\/www.gravatar.com\/avatar\/96ca112479051682519f0cc0463baf5c?s=82"},{"id":"6794","username":"\u5f20\u4e8c","portrait":"http:\/\/www.gravatar.com\/avatar\/62c0e91e9045b75c847123b5b5c87e6c?s=82"},{"id":"6795","username":"\u64a9\u64a9\u64a9\u64a9","portrait":"http:\/\/www.gravatar.com\/avatar\/e0de9c3aa1463e1a2d45aa53ea106826?s=82"},{"id":"6796","username":"\u60a8","portrait":"http:\/\/www.gravatar.com\/avatar\/2968dbb4ec6d3f1539b154570bd2807b?s=82"},{"id":"6797","username":"\u5f20\u4e94","portrait":"http:\/\/www.gravatar.com\/avatar\/617c56dbce5497a9c3aa8d53c07a3f90?s=82"},{"id":"6798","username":"\u54ea\u91cc","portrait":"http:\/\/www.gravatar.com\/avatar\/8a25a2ab6019c31b5e2401b7ef3e0048?s=82"},{"id":"6799","username":"\u79bb\u5f00\u4e86","portrait":"http:\/\/www.gravatar.com\/avatar\/aa2ee100ae74fa2f031ffafc1c9da0a7?s=82"},{"id":"6801","username":"DragonJ","portrait":"http:\/\/www.gravatar.com\/avatar\/d6a2342c6a074d443bcafed35a70a5b4?s=82"},{"id":"6802","username":"test-a","portrait":"http:\/\/www.gravatar.com\/avatar\/5a1041f491a798a117a57126fffa741e?s=82"},{"id":"6803","username":"jimmy509","portrait":"http:\/\/www.gravatar.com\/avatar\/d72e3ebb85fdcb209d5d0be00c750931?s=82"},{"id":"6804","username":"jimmy509","portrait":"http:\/\/www.gravatar.com\/avatar\/effa885b75cd086447d9545e51a34d4f?s=82"},{"id":"6805","username":"e-lcq","portrait":"http:\/\/www.gravatar.com\/avatar\/ee3be8d01e780714a084fb9916250f00?s=82&d=wavatar"},{"id":"6806","username":"\u8bb0\u5f55","portrait":"http:\/\/www.gravatar.com\/avatar\/dc61d3a1033bc530a58b07a65ee7afaf?s=82"},{"id":"6810","username":"123456","portrait":"http:\/\/www.gravatar.com\/avatar\/389ba50c68306b82a4c4491c9e9282d8?s=82"},{"id":"6812","username":"Miao","portrait":"http:\/\/www.gravatar.com\/avatar\/78f12005068409eb4133d77860b1fb10?s=82"},{"id":"6813","username":"\u5434\u9e4f\u8f89","portrait":"http:\/\/www.gravatar.com\/avatar\/31b3b8d631d2f0fb9fcb0293521025ae?s=82"},{"id":"6814","username":"wgy","portrait":"http:\/\/www.gravatar.com\/avatar\/20902afd7d84181bdc2642696e309821?s=82&d=wavatar"},{"id":"6815","username":"qq123","portrait":"http:\/\/www.gravatar.com\/avatar\/2351d86237db01dd48236fbd3f066ef4?s=82"},{"id":"6816","username":"123456","portrait":"http:\/\/www.gravatar.com\/avatar\/25d5ab25791bdc4e9fd72ad43da92a6c?s=82"},{"id":"6817","username":"\u848b\u4f1f","portrait":"http:\/\/www.gravatar.com\/avatar\/098abf4e6bd7fbbca76bf1e186e00e6a?s=82"},{"id":"6818","username":"qwe1","portrait":"http:\/\/www.gravatar.com\/avatar\/d8c881b8e7309202536f41ea9026c8ca?s=82"}];
        for (i in friendList) {
            var friendListObj = $(".light_popBox_friendList .discussion_listAddr").find("ul");
            var item = friendList[i];
            var friendListStr = '<li targetType="4" targetId="{0}" targetName="{1}"><span class="user_img"><img src="static/images/personPhoto.png"/></span> <span class="user_name">{1}</span><a href="javascript:void(0)" class="discussion_select_user"></a></li>';
            var _html = String.stringFormat(friendListStr, item.id, item.username);
            friendListObj.append(_html);
        };
    };
    /**
     * 绑定弹出窗口的事件
     * @return {[type]} [description]
     */
    popBox.bind = function() {
        popBox.reLocate();
        $(window).bind("resize", popBox.reLocate);
        var light_app_obj=$(".light_popBox_title");
        light_app_obj.on("mousedown", popBox.move);
        $(".light_popBox_title").off('mousedown');
        $(".light_popBox_title").delegate('font.pen', 'click', discussion.changeTitle);
        $(".light_popBox_friendList").delegate('.discussion_selected', 'mouseover',
            function(event) {
                $(this).addClass('discussion_selected_delete');
            });//好友列表选择
        $(".light_popBox_friendList").delegate('.discussion_selected', 'mouseout',
            function(event) {
                $(this).removeClass('discussion_selected_delete');
            });//好友列表选择
        $(".discussion_userList").delegate('.discussion_delete_user', 'click',
            discussion.removeUserFromList); //讨论组临时列表
        $(".light_popBox_friendList .discussion_listAddr").delegate('li',
            'click', discussion.addUserTodiscussion);   //好友列表选择
        $(".light_popBox_close").bind('click', popBox.close);
    };
    /**
     * 关闭讨论组创建窗口
     * @return {[type]} [description]
     */
    popBox.close = function(ev) {
        discussionList.newUserList = [];
        $(".popBox_frontlayer").remove();
        $(".light_popBox_backlayer").remove();
    };

    /**
     * 重定位弹框
     * @return {[type]} [description]
     */
    popBox.reLocate = function() {
        if($(".light_popBox_MainWrapper").length > 0){
            var winHeight = document.documentElement.clientHeight||document.body.clientHeight;
            var winWidth = document.documentElement.clientWidth || document.body.clientWidth;
            var height = $(".light_popBox_MainWrapper").height();
            var width = $(".light_popBox_MainWrapper").width();
            var left = winWidth/2 - width/2;
            var top = winHeight/2 - height/2;
            $(".light_popBox_MainWrapper").css("top", top+"px");
            $(".light_popBox_MainWrapper").css("left", left+"px");
        }
    };
    /**
     * 移动弹框
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    popBox.move = function(ev) {
        var oDiv=$(".light_popBox_MainWrapper").get(0);
        var oEvent = ev || event;
        var dargX = oEvent.clientX - oDiv.offsetLeft;
        var dargY = oEvent.clientY - oDiv.offsetTop;
        document.onmousemove = function(ev){
            var oEvent = ev||event;
            var Left = oEvent.clientX - dargX;
            var Top = oEvent.clientY - dargY;
            if (Left<0){
                Left=0;
            }
            if(Left>document.documentElement.clientWidth-oDiv.offsetWidth){
                Left = document.documentElement.clientWidth-oDiv.offsetWidth;
            }
            if (Top<0)
            {
                Top=0;
            }
            if (Top>document.documentElement.clientHeight-oDiv.offsetHeight)
            {
                Top = document.documentElement.clientHeight-oDiv.offsetHeight;
            }
            oDiv.style.left = Left + "px";
            oDiv.style.top = Top + "px";
        };
        document.onmouseup = function(){
            document.onmousemove = null;
            document.onmouseup = null;
        };
        return false;
    };
    /**
     * 创建讨论组
     * @return {[type]} [description]
     */
    self.createDiscussion = function() {
        //新建聊天组，存储临时聊天组用户列表
        discussionList.newDiscusion = {};
        var html = conf.popBox.html.discussion;
        $("body").append(html);
        popBox.init();
        popBox.bind();
        $(".settingView").hide();
    };

    self.createOrientationChangeProxy = function (fn) {
        return function () {
            if ($(".RongIMexpressionWrap").is(":visible")) {
                $("#RongIMexpression").trigger('click');
            };
            $(".textarea").blur();
            clearTimeout(fn.orientationChangeTimer);
            var args = Array.prototype.slice.call(arguments, 0);
            fn.orientationChangeTimer = setTimeout(function () {
                var ori = window.orientation;
                if (ori != fn.lastOrientation) {
                    fn.apply(null, args);
                }
                fn.lastOrientation = ori;
            }, 800);
        };
    };
    self.changeView = function () {
        setTimeout(function () {
                var height = 0;
                $(".textarea").focus();
                window.scrollTo(0, 0);
                if (window.orientation == 180 || window.orientation == 0) {
                    height = self.winHeight - conf.statuHeight;
                    //$("body").append('<link href="/static/css/main.css" rel="stylesheet">');
                } else {
                    height = self.winWidth - conf.statuHeight;
                    //$("body").append('<link href="/static/css/main.css" rel="stylesheet">');
                }
                self.setBoxHeight()
            },
            500);
    };
    self.setStatuHeight = function () {
        var winBodyHeight = $(window).height();
        var height = 0;
        if (window.orientation == 180 || window.orientation == 0) {
            height = window.screen.height - winBodyHeight;
        } else {
            height = window.screen.width - winBodyHeight;
        }
        conf.statuHeight = height;
    };
    self.bind = function () {
        self.winHeight = window.screen.height;
        self.winWidth = window.screen.width;
        self.setStatuHeight();
        if ('onorientationchange' in window) {
            window.addEventListener("orientationchange", self.createOrientationChangeProxy(function () {
                if (window.orientation == 0 || window.orientation == 180 || window.orientation == 90 || window.orientation == -90) {
                    self.changeView();
                }
            }), false);
        } else {
            $(window).bind("resize", self.setBoxHeight);
        }
        $("#createDiscussion").on('click', self.createDiscussion);
        $(".conversation_msg_num").on('change', self.locateNum);
        $(".status").on('change', self.locateMsgStatu);
        $(".btnBack").on('click', self.back);
        $(".setting").bind('click', function () {
            $(".settingView").toggle();
        });
        $(".conversationBtn").click(function (event) {
            $(".phone_dialog_header>.logOut").show();
            $(".addrBtnBack").hide();
            $(".conversationBtn").addClass('selected');
            $(".addrBtn").removeClass('selected');
            $(".list").hide();
            $(".listConversation").show();
        });
        $(".addrBtn").click(function (event) {
            $(".phone_dialog_header>.logOut").hide();
            $(".addrBtnBack").show();
            $(".addrBtn").addClass('selected');
            $(".conversationBtn").removeClass('selected');
            $(".list").hide();
            $(".listAddr").show();
        });
        $("#RongIMexpression").bind('click', function () {
            var RongIMexpressionObj = $(".RongIMexpressionWrap");
            var intExpressHeight = RongIMexpressionObj.innerHeight();
            if (RongIMexpressionObj.is(":visible")) {
                $(".dialog_box").height($(".dialog_box").height() + intExpressHeight);
                RongIMexpressionObj.hide()
            } else {
                $(".dialog_box").height($(".dialog_box").height() - intExpressHeight);
                RongIMexpressionObj.show()
            }
            // RongIMexpressionObj.slideToggle();
        });
        $(".textarea").bind('focus', self.virtualKeyboardHeight);
//        $("body").bind('click', function() {$(this).trigger('mouseleave');alert(1111);});
        $(".list").delegate('li', 'click', function () {
            if (!self.isPCBrowser()) {
                $(".left").hide();
                $(".right_box").show();
            };
        });
        $(".dialog_box").bind('DOMNodeInserted', self.autoScroll);
        $(".dialog_box").delegate('img', 'click', function (event) {
            var url = $(this).attr('bigUrl');
            self.showImg({'img': url, 'oncomplete': self.showBigImg});
        });
        $(".dialog_box").delegate('.voice', 'click', function (event) {
            if (typeof(conf.RongIMVoice) == 'boolean' && conf.RongIMVoice) {
                RongIMClient.voice.play($(this).next().val());
            }
        });

        $("body").delegate('.light_notice_backlayer', 'click', function (event) {
            $('.light_notice_backlayer').remove();
            $(".frontlayer").remove();
        });
        $("body").delegate('.frontlayer', 'click', function (event) {
            $('.light_notice_backlayer').remove();
            $(".frontlayer").remove();
        });
        $("#mainContent").bind('keypress', function (event) {
            if (event.ctrlKey && event.keyCode == "13") {
                $('#send').trigger('click');
            }
        }).bind("click", function () {
            if ($(".RongIMexpressionWrap").is(":visible"))
                $("#RongIMexpression").trigger('click');
        });

    };
    self.showBigImg = function () {
        var html = '<div class="light_notice_backlayer"></div>';
        var frontLayer = '<div class="frontlayer"></div>';
        var winWidth = $(window).width();
        var winHeight = $(window).height();
        var style = '';
        var left = 0;
        var top = 0;
        var width = this.width;
        if (width > winWidth) {
            width = winWidth;
        } else {
            left = (winWidth - width) / 2;
        }
        if (this.height < winHeight) {
            top = (winHeight - this.height) / 2;
        }
        //style = 'left: ' + left + 'px; top: ' + top + 'px';
        this.obj.style.width = width + 'px';
        $("body").append($(html));
        var Layer = $(frontLayer);
        //var obj = this.obj.outerHTML;
        Layer.css('left', left + 'px');
        Layer.css('top', top + 'px');

        Layer.append(this.obj);
        $("body").append(Layer);
    };
    self.showImg = function (cfg) {
        var img = new Image();
        img.src = cfg.img;
        var callback = cfg.oncomplete;
        img.onload = function () {
            callback.call({"width": img.width, "height": img.height, "obj": img}, null);
        }
    };
    self.autoScroll = function () {
        var scrollHeight = $('.dialog_box')[0].scrollHeight;
        $('.dialog_box').scrollTop(scrollHeight);
    };
    self.drawExpressionWrap = function () {
        var RongIMexpressionObj = $(".RongIMexpressionWrap");
        if (win.RongIMClient) {
            var arrImgList = RongIMClient.Expression.getAllExpression(60, 0);
            if (arrImgList && arrImgList.length > 0) {
                for (var objArr in arrImgList) {    //扩展 Array prototype 使用for in问题
                    var imgObj = arrImgList[objArr].img;
                    if (!imgObj) {
                        continue;
                    };
                    imgObj.setAttribute("alt", arrImgList[objArr].chineseName);
                    imgObj.setAttribute("title", arrImgList[objArr].chineseName);
//                    imgObj.alt = arrImgList[objArr].chineseName;
                    var newSpan = $('<span class="RongIMexpression_' + arrImgList[objArr].englishName + '"></span>');
                    newSpan.append(imgObj);
                    RongIMexpressionObj.append(newSpan);
                }
            }
            $(".RongIMexpressionWrap>span").bind('click', function (event) {
                $(".textarea")[0].value+="[" + $(this).children().first().attr("alt") + "]";
//                $(".textarea").append($(this).clone());
            });
        }
        ;
    };
    self.virtualKeyboardHeight = function () {
        //var sx = $(window).scrollLeft(), sy = $(window).scrollTop();
        //var naturalHeight = window.innerHeight;
        //window.scrollTo(sx, document.body.scrollHeight);
        //var keyboardHeight = naturalHeight - window.innerHeight;
        //window.scrollTo(sx, sy);
        //conf.keyboardHeight = keyboardHeight;
        //return keyboardHeight;
    };
    self.getWinHeight = function (event) {
        if (event && event.type == 'orientationchange') {
            return conf.winWidth;
        } else {
            return $(window).height();
        }
    }
    self.init = function () {
        conf.winWidth = $(window).width();
        conf.winHeight = $(window).height();
        self.setBoxHeight();
        self.bind();

        self.drawExpressionWrap();

        var newConf = conf.scroll;
        newConf = lib.clone(newConf);
        var listAddr = lib.clone(conf.scroll);
        var newConf1 = lib.clone(conf.scroll);
        $(".listConversation").niceScroll(conf.scroll);
        $(".listAddr").niceScroll(listAddr);
        $('.dialog_box').niceScroll(newConf);
        $(".RongIMexpressionWrap").niceScroll(newConf1);
        $(".conversation_msg_num").each(self.locateNum);
        $(".status").each(self.locateMsgStatu);
        self.autoScroll();
        if (typeof(conf.RongIMVoice) == 'boolean' && !conf.RongIMVoice) {
            conf.RongIMVoice = RongIMClient.voice.init();
        }
    };
    win[conf.name] = self;
})(window, document, window.jQuery);


$().ready(function ($) {
    $(document).delegate(".user_img img,.owner_image img","error",function () {
        this.setAttribute("src", "static/images/user.png");
    });
    if (window.RongCloudWebSDK) {
        RongCloudWebSDK.init();
    }
    ;
    function stopScrolling(touchEvent) {
        touchEvent.preventDefault();
    }

    $("body").bind("touchmove", stopScrolling);
    var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    if (docElm.fullscreenEnabled) {
        docElem.exitFullscreen();
    }

});
