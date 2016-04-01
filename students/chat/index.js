var demo = angular.module("demo", ["RongWebIMWidget"]);

demo.controller("main", ["$scope", "WebIMWidget", function($scope,
	WebIMWidget) {

	$scope.show = function() {
		WebIMWidget.show();
	}

	$scope.hidden = function() {
		WebIMWidget.hidden();
	}

	$scope.server = WebIMWidget;
	$scope.targetType = 1;

	$scope.setconversation = function() {
		WebIMWidget.setConversation(Number($scope.targetType), $scope.targetId, "自定义:" + $scope.targetId);
	}

	angular.element(document).ready(function() {

		WebIMWidget.init({
			appkey: "z3v5yqkbvt8l0",
			token: "fM75RS4bSLu4InfNS/VFK3ic37xlqnDFhgdhgmShDqNxLdxQbhy8GilpLEyard9sVG3YSeeqDP27JnbfbTlWHQ==",
			style: {
				width: 500,
				height: 500,
				bottom: 0,
				left: 0
			},
			displayConversationList: true,
			displayMinButton: true,
			conversationListPosition: WebIMWidget.EnumConversationListPosition.left,
			onSuccess: function() {
				//初始化完成
				console.log("初始化完成");
			},
			onError: function(error) {
				console.log("error:" + error);
			}
		});

		WebIMWidget.show();

		WebIMWidget.setUserInfoProvider(function(targetId, obj) {
			obj.onSuccess({
				name: "陌：" + targetId
			});
		});

		// WebIMWidget.onCloseBefore=function(obj){
		//   console.log("关闭前");
		//   setTimeout(function(){
		//     obj.close();
		//   },1000)
		// }

		WebIMWidget.onClose = function() {
			console.log("已关闭");
		}

		WebIMWidget.show();

		//设置会话
//		WebimWidget.setConversation(EnumConversationType.PRIVATE, "cc", "张敏");

	});

}]);