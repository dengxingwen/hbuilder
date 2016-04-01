/**
 * 本代码中的SDK代码均为最新版0.9.9版本
 * 修改本Demo的代码时注意SDK版本兼容性
 * Author:张亚涛
 * Date:2015-6-8
 */

$(function(undefined) {
	//姓名列表变量
	var stuNameList = {};
	stuNameList = JSON.parse(localStorage.stuNameList);
	
	//私有变量
	var currentConversationTargetId = "aa",
		conver, _historyMessagesCache = {},
		token = "",
		_html = "",
		namelist = {
			"group001": "融云群一",
			"group002": "融云群二",
			"group003": "融云群三",
			"kefu114": "客服"
		},
		audio = document.getElementsByTagName("audio")[0],
		//		//是否开启声音
		hasSound = true,
		//登陆人员信息默认值
		owner = {
//			id: "cc",
//			portrait: "http://rongcloud-web.qiniudn.com/docs_demo_rongcloud_logo.png",
//			name: "张敏"
		},
		//初始化登陆人员信息
		list = location.search.slice(1).split('&'),
		$scope = {};
		
		//token = "fM75RS4bSLu4InfNS/VFK3ic37xlqnDFhgdhgmShDqNxLdxQbhy8GilpLEyard9sVG3YSeeqDP27JnbfbTlWHQ==";
		token = localStorage.token;
		
		//获取本地本人信息
		var myinfo = JSON.parse(localStorage.myInfo);
		
		owner = {
			id: myinfo['id'],
			portrait: myinfo['photo'],
			name: myinfo['username']
		}
		
		
	//var conversationStr = '<li targetType="{1}" targetId="{aa}" targetName="{邓兴稳}"><span class="user_img"><img src={3} onerror="this.src=\'http://ww2.sinaimg.cn/crop.0.0.1440.1440.1024/a219013ejw8eup91e3jxuj214014076y.jpg\'"/><font class="conversation_msg_num {4}">{5}</font></span><span class="conversationInfo"><p style="margin-top: 10px"><font class="user_name">{6}</font><font class="date" >{7}</font></p></span></li>';
	//var historyStr = '<div class="xiaoxiti {0} user"><div class="user_img"><img onerror="this.src=\'../images-rong/personPhoto.png\'" src="{1}"/></div><span>{2}</span><div class="msg"><div class="msgArrow"><img src="../images-rong/{3}"> </div><span></span>{4}</div><div messageId="{5}" class="status"></div></div><div class="slice"></div>';

	var conversationStr = '<li targetType="{0}" targetId="{1}" targetName="{2}"><span class="user_img"><img src={3} onerror="this.src=\'../../images-rong/personPhoto.png\'"/><font class="conversation_msg_num {4}">{5}</font></span><span class="conversationInfo"><p style="margin-top: 10px"><font class="user_name">{6}</font><font class="date" >{7}</font></p></span></li>';
	var historyStr = '<div class="xiaoxiti {0} user"><div class="user_img"><img onerror="this.src=\'../../images-rong/personPhoto.png\'" src="{1}"/></div><span>{2}</span><div class="msg"><div class="msgArrow"><img src="../../images-rong/{3}"> </div><span></span>{4}</div><div messageId="{5}" class="status"></div></div><div class="slice"></div>';
	var friendListStr = "";
	
	if(stuNameList.length != 0){
		for (var i=0; i<stuNameList.length; i++) {
			var str = '<li targetType="1" targetId='+stuNameList[i]["id"]+' targetName='+stuNameList[i]["username"]+'><span class="user_img"><img src="http://ww2.sinaimg.cn/crop.0.0.1440.1440.1024/a219013ejw8eup91e3jxuj214014076y.jpg"/></span><span class="user_name">'+stuNameList[i]["username"]+'</span></li>';
			friendListStr += str;
		}
	}else{
	    friendListStr = '<li targetType="1" targetId="aa" targetName="邓兴稳"><span class="user_img"><img src="http://ww2.sinaimg.cn/crop.0.0.1440.1440.1024/a219013ejw8eup91e3jxuj214014076y.jpg"/></span> <span class="user_name">邓兴稳</span></li><li targetType="1" targetId="bb" targetName="mark"><span class="user_img"><img src="http://ww2.sinaimg.cn/crop.0.0.1440.1440.1024/a219013ejw8eup91e3jxuj214014076y.jpg"/></span> <span class="user_name">mark</span></li>';
	}
	
	
	
	//var discussionStr = '<li targetId="{0}" targetName="{1}" targetType="{2}"><span class="user_img"><img src="../images-rong/user.png"/></span><span class="user_name">{3}</span></li>';
	////	if (list.length == 3) {
	////		$.each(list, function(i, item) {
	////			var val = item.split("=");
	////			owner[val[0]] = decodeURIComponent(val[1]);
	////		});
	$("img[RCTarget='owner.portrait']").attr("src", owner.portrait);
	$('span[RCTarget="owner.name"]').html(owner.name);
	////	} else {
	////		//      location.href = "login.html";
	////		return;
	////	}
	//	//未读消息数
	$scope.totalunreadcount = 0;
	//	//会话列表
	$scope.ConversationList = [];
	//	//好友列表
	$scope.friendsList = [];
	//	//会话标题
	$scope.conversationTitle = "";
	//
	//	//开启关闭声音
	//	$("#closeVoice").click(function() {
	//		hasSound = !hasSound;
	//		this.innerHTML = hasSound ? "开启声音" : "关闭声音";
	//	});
	//	//退出
	//	$(".logOut>a,#close").click(function() {
	//		$.get("/logout?_=" + Date.now()).done(function() {
	//			if (RongIMClient.getInstance) {
	//				RongIMClient.getInstance().disconnect();
	//			}
	//		}).always(function() {
	//			location.href = "login.html";
	//		})
	//	});
	//	$.get("/discussion?_=" + Date.now(), function(data) {
	//		if (data.code == 200) {
	//			_html = "";
	//			data.result.forEach(function(item) {
	//				_html += String.stringFormat(discussionStr, item.id, item.name, RongIMClient.ConversationType.DISCUSSION.valueOf(), item.name);
	//			});
	//			$("#discussion").html(_html || "<li>没有加入任何讨论组</li>");
	//		}
	//	});
	//	$.get("/friends?_=" + Date.now(), function(data) {
	//		if (data.code == 200) {
	//			_html = "";
	//			$scope.friendsList = data.result.slice(0, 200);
	//			$scope.friendsList.forEach(function(item) {
	//				_html += String.stringFormat(friendListStr, item.id, item.username)
	//			});
	$("#friendsList").html(friendListStr);
	//		}
	//	}, "json");

	$("#friendsList,#conversationlist").delegate('li', 'touch click', function() {
		if (this.parentNode.id == "conversationlist") {
			$("font.conversation_msg_num", this).hide().html("");
		}
		getHistory(this.getAttribute("targetId"), this.getAttribute("targetName"), this.getAttribute("targetType"));
	});
	$("div.listAddr li:lt(4)").click(function() {
		getHistory(this.getAttribute("targetId"), this.getAttribute("targetName"), this.getAttribute("targetType"));
	});
	//var isJointed = false;
	//		$("#discussionRoom").delegate('li', 'click', function() {
	//			if (isJointed === false) {
	//				RongIMClient.getInstance().joinChatRoom(this.getAttribute("targetId"), 10, {
	//					onSuccess: function() {
	//						$("#notice").show().css({
	//							"color": "green"
	//						}).text("加入聊天室成功").delay(2000).fadeOut("slow");
	//						isJointed = true;
	//					},
	//					onError: function() {
	//						$("#notice").show().css({
	//							"color": "green"
	//						}).text("加入聊天室失败").delay(2000).fadeOut("slow");
	//					}
	//				});
	//			}
	//			getHistory(this.getAttribute("targetId"), this.getAttribute("targetName"), this.getAttribute("targetType"));
	//		});
	$("#send").click(function() {
		if (!conver && !currentConversationTargetId) {
			alert("请选中需要聊天的人");
			return;
		}

		var con = $("#mainContent").val().replace(/\[.+?\]/g, function(x) {
			return RongIMClient.Expression.getEmojiObjByEnglishNameOrChineseName(x.slice(1, x.length - 1)).tag || x;
		});
		if (con == "") {
			alert("不允许发送空内容");
			return;
		}
		if (RongIMClient.getInstance().getConversation(RongIMClient.ConversationType.setValue(conver), currentConversationTargetId) === null) {
			RongIMClient.getInstance().createConversation(RongIMClient.ConversationType.setValue(conver), currentConversationTargetId, $("#conversationTitle").text());
		}
		//发送消息
		var content = new RongIMClient.MessageContent(RongIMClient.TextMessage.obtain(myUtil.replaceSymbol(con)));
		RongIMClient.getInstance().sendMessage(RongIMClient.ConversationType.setValue(conver), currentConversationTargetId, content, null, {
			onSuccess: function() {
				console.log("send successfully");
			},
			onError: function(x) {
				var info = '';
				switch (x) {
					case RongIMClient.callback.ErrorCode.TIMEOUT:
						info = '超时';
						break;
					case RongIMClient.callback.ErrorCode.UNKNOWN_ERROR:
						info = '未知错误';
						break;
					case RongIMClient.SendErrorStatus.REJECTED_BY_BLACKLIST:
						info = '在黑名单中，无法向对方发送消息';
						break;
					case RongIMClient.SendErrorStatus.NOT_IN_DISCUSSION:
						info = '不在讨论组中';
						break;
					case RongIMClient.SendErrorStatus.NOT_IN_GROUP:
						info = '不在群组中';
						break;
					case RongIMClient.SendErrorStatus.NOT_IN_CHATROOM:
						info = '不在聊天室中';
						break;
					default:
						info = x;
						break;
				}
				$(".dialog_box div[messageId='" + content.getMessage().getMessageId() + "']").addClass("status_error");
				console.log('发送失败:' + info);
			}
		});
		addHistoryMessages(content.getMessage());
		initConversationList();
		$("#mainContent").val("");
	});
	//初始化SDK
	RongIMClient.init("z3v5yqkbvt8l0"); //e0x9wycfx7flq z3v5yqkbv8v30

	//  $.ajax({
	//      type: "get",
	//      url: "/token?_=" + Date.now(),
	//      dataType: "json"
	//  }).done(function (data) {
	//      if (data.code == 200) {
	
	//链接融云
	RongIMClient.connect(token, {
		onSuccess: function(x) {
			console.log("connected，userid＝" + x);

			//链接成功之后同步会话列表
			RongIMClient.getInstance().syncConversationList({
				onSuccess: function() {
					//同步会话列表
					setTimeout(function() {
						$scope.ConversationList = RongIMClient.getInstance().getConversationList();
						var temp = null;
						for (var i = 0; i < $scope.ConversationList.length; i++) {
							temp = $scope.ConversationList[i];
							switch (temp.getConversationType()) {
								case RongIMClient.ConversationType.CHATROOM:
									temp.setConversationTitle('聊天室');
									console.log("聊天室");
									break;
								case RongIMClient.ConversationType.CUSTOMER_SERVICE:
									temp.setConversationTitle('客服');
									console.log("客服");
									break;
								case RongIMClient.ConversationType.DISCUSSION:
									temp.setConversationTitle('讨论组:' + temp.getTargetId());
									console.log("讨论组");
									break;
								case RongIMClient.ConversationType.GROUP:
									temp.setConversationTitle(namelist[temp.getTargetId()] || '未知群组');
									console.log("群组");
									break;
								case RongIMClient.ConversationType.PRIVATE:
									console.log("私聊");
									console.log("陌生人");
									temp.getConversationTitle() || temp.setConversationTitle('陌生人:' + temp.getTargetId());
							}
						}
						initConversationList();
					}, 1000);
				},
				onError: function() {
					$scope.ConversationList = RongIMClient.getInstance().getConversationList();
				}
			})
		},
		onError: function(c) {
			var info = '';
			switch (c) {
				case RongIMClient.callback.ErrorCode.TIMEOUT:
					info = '超时';
					break;
				case RongIMClient.callback.ErrorCode.UNKNOWN_ERROR:
					info = '未知错误';
					break;
				case RongIMClient.ConnectErrorStatus.UNACCEPTABLE_PROTOCOL_VERSION:
					info = '不可接受的协议版本';
					break;
				case RongIMClient.ConnectErrorStatus.IDENTIFIER_REJECTED:
					info = 'appkey不正确';
					break;
				case RongIMClient.ConnectErrorStatus.SERVER_UNAVAILABLE:
					info = '服务器不可用';
					break;
				case RongIMClient.ConnectErrorStatus.TOKEN_INCORRECT:
					info = 'token无效';
					break;
				case RongIMClient.ConnectErrorStatus.NOT_AUTHORIZED:
					info = '未认证';
					break;
				case RongIMClient.ConnectErrorStatus.REDIRECT:
					info = '重新获取导航';
					break;
				case RongIMClient.ConnectErrorStatus.PACKAGE_ERROR:
					info = '包名错误';
					break;
				case RongIMClient.ConnectErrorStatus.APP_BLOCK_OR_DELETE:
					info = '应用已被封禁或已被删除';
					break;
				case RongIMClient.ConnectErrorStatus.BLOCK:
					info = '用户被封禁';
					break;
				case RongIMClient.ConnectErrorStatus.TOKEN_EXPIRE:
					info = 'token已过期';
					break;
				case RongIMClient.ConnectErrorStatus.DEVICE_ERROR:
					info = '设备号错误';
					break;
			}
			console.log("失败:" + info);
		}
	});
	//      } else {
	//          alert("获取token失败,请重新登录");
	//          location.href = "login.html";
	//      }
	//  }).fail(function () {
	//      alert("获取token失败");
	//      location.href = "login.html";
	//  });
	//链接状态监听器
	RongIMClient.setConnectionStatusListener({
		onChanged: function(status) {
			switch (status) {
				//链接成功
				case RongIMClient.ConnectionStatus.CONNECTED:
					console.log('链接成功');
					break;
					//正在链接
				case RongIMClient.ConnectionStatus.CONNECTING:
					console.log('正在链接');
					break;
					//重新链接
				case RongIMClient.ConnectionStatus.RECONNECT:
					console.log('重新链接');
					break;
					//其他设备登陆
				case RongIMClient.ConnectionStatus.OTHER_DEVICE_LOGIN:
					//连接关闭
				case RongIMClient.ConnectionStatus.CLOSURE:
					//未知错误
				case RongIMClient.ConnectionStatus.UNKNOWN_ERROR:
					//登出
				case RongIMClient.ConnectionStatus.LOGOUT:
					//用户已被封禁
				case RongIMClient.ConnectionStatus.BLOCK:
//					location.href = "/WebIMDemo/login.html";
					break;
			}
		}
	});
	//接收消息监听器
	RongIMClient.getInstance().setOnReceiveMessageListener({
		onReceived: function(data) {
			//打印收到的消息
			console.log(data.getContent());
//			if (hasSound) {
				audio.play();
				console.log("播放音频");
//			}

			//如果接收的消息为通知类型或者状态类型的消息，什么都不执行
			if (data instanceof RongIMClient.NotificationMessage || data instanceof RongIMClient.StatusMessage) {
				return;
			}

			$scope.totalunreadcount = RongIMClient.getInstance().getTotalUnreadCount();
			$("#totalunreadcount").show().html($scope.totalunreadcount);

			//设置会话名称
			var tempval = RongIMClient.getInstance().getConversation(data.getConversationType(), data.getTargetId());
			if (tempval.getConversationTitle() == undefined) {
				switch (data.getConversationType()) {
					case RongIMClient.ConversationType.CHATROOM:
						console.log("聊天室");
						tempval.setConversationTitle('聊天室');
						break;
					case RongIMClient.ConversationType.CUSTOMER_SERVICE:
						console.log("客服");
						tempval.setConversationTitle('客服');
						break;
					case RongIMClient.ConversationType.DISCUSSION:
						console.log("讨论组");
						tempval.setConversationTitle('讨论组:' + data.getTargetId());
						break;
					case RongIMClient.ConversationType.GROUP:
						console.log("未知群组");
						tempval.setConversationTitle(namelist[temp.getTargetId()] || '未知群组');
						break;
					case RongIMClient.ConversationType.PRIVATE:
						console.log("私聊");
						var person = $scope.friendsList.filter(function(item) {
							return item.id == data.getTargetId();

						})[0];
						person ? tempval.setConversationTitle(person.username) : RongIMClient.getInstance().getUserInfo(data.getTargetId(), {
							onSuccess: function(x) {
								tempval.setConversationTitle(x.getUserName());
							},
							onError: function() {
								console.log("陌生人error");
								tempval.setConversationTitle("陌生人Id：" + data.getTargetId());
							}
						});
						break;
					default:
						tempval.setConversationTitle('该会话类型未解析:' + data.getConversationType() + data.getTargetId());
						break;
				}
			}

			if (currentConversationTargetId != data.getTargetId()) {
				if (document.title != "[新消息]融云 Demo - Web SDK") document.title = "[新消息]融云 Demo - Web SDK";
				if (!_historyMessagesCache[data.getConversationType().valueOf() + "_" + data.getTargetId()]) _historyMessagesCache[data.getConversationType() + "_" + data.getTargetId()] = [data];
				else _historyMessagesCache[data.getConversationType().valueOf() + "_" + data.getTargetId()].push(data);
			} else {
				addHistoryMessages(data);
			}
			initConversationList();
		}
	});
	//渲染历史记录
	function addHistoryMessages(item) {
		$scope.historyMessages.push(item);
		$(".dialog_box:first").append(String.stringFormat(historyStr, item.getMessageDirection() == RongIMClient.MessageDirection.RECEIVE ? "other_user" : "self", item.getMessageDirection() == RongIMClient.MessageDirection.SEND ? owner.portrait : "../images-rong/personPhoto.png", "", item.getMessageDirection() == RongIMClient.MessageDirection.RECEIVE ? 'white_arrow.png' : 'blue_arrow.png', myUtil.msgType(item), item.getMessageId()));
	}

	//加载会话列表
	function initConversationList() {
		_html = "";
		$scope.ConversationList.forEach(function(item) {
			_html += String.stringFormat(conversationStr, item.getConversationType().valueOf(), item.getTargetId(), item.getConversationTitle(), "http://ww2.sinaimg.cn/crop.0.0.1440.1440.1024/a219013ejw8eup91e3jxuj214014076y.jpg", item.getUnreadMessageCount() == 0 ? "hidden" : "", item.getUnreadMessageCount(), item.getConversationTitle(), new Date(+item.getLatestTime()).toString().split(" ")[4]);
		});
		$("#conversationlist").html(_html);
	}

	//加载历史记录
	function getHistory(id, name, type, again) {
		if (!window.Modules) //检测websdk是否已经加载完毕
			return;
		conver = type;
		currentConversationTargetId = id;
		if (!_historyMessagesCache[type + "_" + currentConversationTargetId]) _historyMessagesCache[type + "_" + currentConversationTargetId] = [];
		$scope.historyMessages = _historyMessagesCache[type + "_" + currentConversationTargetId];

		if ($scope.historyMessages.length == 0 && !again) {
			RongIMClient.getInstance().getHistoryMessages(RongIMClient.ConversationType.setValue(conver), currentConversationTargetId, 5, {
				onSuccess: function(has, list) {
					console.log("是否有剩余消息：" + has);
					_historyMessagesCache[type + "_" + currentConversationTargetId] = list;
					getHistory(currentConversationTargetId, name, conver, 1);
				},
				onError: function() {
					console.log('获取历史消息失败');
					getHistory(currentConversationTargetId, name, conver, 1);
				}
			});
			return;
		}
		$scope.conversationTitle = name;
		var tempval = RongIMClient.getInstance().getConversation(RongIMClient.ConversationType.setValue(conver), currentConversationTargetId)
		$("#conversationTitle").next().remove();
		if (type == RongIMClient.ConversationType.CHATROOM) { //聊天室
			$("#conversationTitle").after('<span class="setDialog"></span>');
		}
		$("#conversationTitle").html($scope.conversationTitle);
		_html = "";
		$scope.historyMessages.forEach(function(item) {
			_html += String.stringFormat(historyStr, item.getMessageDirection() == 0 ? "other_user" : "self", item.getMessageDirection() == 1 ? owner.portrait : "images-rong/personPhoto.png", "", item.getMessageDirection() == 0 ? 'white_arrow.png' : 'blue_arrow.png', myUtil.msgType(item), item.getMessageId());
		});
		if (again == 1 && _html) {
			_html += "<div class='historySymbol'>已上为历史消息</div>";
		}
		$(".dialog_box:first").html(_html);
		if (tempval === null) {
			return;
		}
		tempval.setUnreadMessageCount(0);
		RongIMClient.getInstance().clearMessagesUnreadStatus(RongIMClient.ConversationType.setValue(type), currentConversationTargetId);
		$scope.totalunreadcount = RongIMClient.getInstance().getTotalUnreadCount();
		if ($scope.totalunreadcount <= 0 && /^\[新消息\]/.test(document.title)) {
			document.title = "融云 Demo - Web SDK";
		}
		$("#totalunreadcount").html($scope.totalunreadcount);
		if ($scope.totalunreadcount == 0) {
			$("#totalunreadcount").hide();
		}
	}
});

String.stringFormat = function(str) {
	for (var i = 1; i < arguments.length; i++) {
		str = str.replace(new RegExp("\\{" + (i - 1) + "\\}", "g"), arguments[i] != undefined ? arguments[i] : "");
	}
	return str;
};
var myUtil = {
	msgType: function(message) {
		switch (message.getMessageType()) {
			case RongIMClient.MessageType.TextMessage:
				return String.stringFormat('<div class="msgBody">{0}</div>', this.initEmotion(this.symbolReplace(message.getContent())));
			case RongIMClient.MessageType.ImageMessage:
				return String.stringFormat('<div class="msgBody">{0}</div>', "<img class='imgThumbnail' src='data:image/jpg;base64," + message.getContent() + "' bigUrl='" + message.getImageUri() + "'/>");
			case RongIMClient.MessageType.VoiceMessage:
				return String.stringFormat('<div class="msgBody voice">{0}</div><input type="hidden" value="' + message.getContent() + '">', "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + message.getDuration());
			case RongIMClient.MessageType.LocationMessage:
				return String.stringFormat('<div class="msgBody">{0}</div>{1}', "[位置消息]" + message.getPoi(), "<img src='data:image/png;base64," + message.getContent() + "'/>");
			default:
				return '<div class="msgBody">' + message.getMessageType().toString() + ':此消息类型Demo未解析</div>'
		}
	},
	initEmotion: function(str) {
		var a = document.createElement("span");
		return RongIMClient.Expression.retrievalEmoji(str, function(img) {
			a.appendChild(img.img);
			var str = '<span class="RongIMexpression_' + img.englishName + '">' + a.innerHTML + '</span>';
			a.innerHTML = "";
			return str;
		});
	},
	symbolReplace: function(str) {
		if (!str) return '';
		str = str.replace(/&/g, '&amp;');
		str = str.replace(/</g, '&lt;');
		str = str.replace(/>/g, '&gt;');
		str = str.replace(/"/g, '&quot;');
		str = str.replace(/'/g, '&#039;');
		return str;
	},
	replaceSymbol: function(str) {
		if (!str) return '';
		str = str.replace(/&amp;/g, '&');
		str = str.replace(/&lt;/g, '<');
		str = str.replace(/&gt;/g, '>');
		str = str.replace(/&quot;/g, '"');
		str = str.replace(/&#039;/g, "'");
		str = str.replace(/&nbsp;/g, " ");
		return str;
	}
};