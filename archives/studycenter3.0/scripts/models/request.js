define(['jquery',  'common', 'layer'],function($,  Common, layer){
	'user strict';
	var server = {
		'token' : {
			'url' : '/api/v2.1/getToken',
			'data' : Common.product.pcWeb
		},
		'login' : {
			'url' : '/api/v2.1/login',
			'type' : 'post'
		},
		'logout' : {
			'url' : '/api/v2.1/logout'
		},
		'loginloglist' : {
			'url' : '/api/v3/user/loginloglist'
		},
		'getExamDate' : {
			'url' : '/api/v2.1/study/getExamDate'
		},
		'message-list' : {
			'url' : '/api/v2/message/list'
		},
		'mycount' : {
			'url' : '/api/studytools/mycount/v2.1'
		},
		'capabilityAssessment' : {
			'url' : '/api/v2/capabilityAssessment'
		},
		'slide-list' : {
			'url' : '/api/v2.1/slide/list'
		},
		'exam-list' : {
			'url' : '/api/v2/exam/list'
		},
		'learningcourse' : {
			'url' : '/api/v2.1/learning/learningcourse'
		},
		'noActivecourse' : {
			'url' : '/api/v2.1/learning/noActivecourse'
		},
		'expirationcourse' : {
			'url' : '/api/v2.1/learning/expirationcourse'
		},
		'courseBaseInfo' : {
			'url' : '/api/v2.1/course/courseBaseInfo',
			'type' : 'POST'
		},
		'courseDetail' : {
			'url' : '/api/v2.1/course/courseDetail'
		},
		'getTasksProgress' : {
			'url' : '/api/v2/study/getTasksProgress'
		},
		'course_info' : {
			'url' : '/api/v2/course/info'
		},
		'coursestatus' : {
			'url' : '/api/v2.1/study/coursestatus'
		},
		'handout' : {
			'url' : '/api/v2/course/handout'
		},
		'bbslist' : {
			'url' : '/api/studytools/bbslist/v1.0'
		},
		'bbsdetail' : {
			'url' : '/api/studytools/bbsdetail/v1.0'
		},
		'bbslist_myJoin' : {
			'url' : '/api/studytools/bbslist_myJoin/v1.0'
		},
		'bbs_praise' : {
			'url' : '/api/studytools/bbs_praise/v1.0'
		},
		'bbsreply' : {
			'url' : '/api/studytools/bbsreply/v1.0',
			'type' : 'POST'
		},
		'bbssave' : {
			'url' : '/api/studytools/bbssave/v1.0',
			'type' : 'POST'
		},
		'bbs_del' : {
			'url' : '/api/studytools/bbs_del/v1.0'
		},
		'course-node' : {
			'url' : '/api/v2/course/node'
		},
		'nodelist' : {
			'url' : '/api/studytools/nodelist/v2.1'
		},
		'nodedetail' : {
			'url' : '/api/studytools/nodedetail/v2.1'
		},
		'node-list' : {
			'url' : '/api/v2/note/list'
		},
		'nodesave' : {
			'url' : '/api/studytools/nodesave/v2.1',
			'type' : 'POST'
		},
		'coursechapternodecount' : {
			'url' : '/api/studytools/coursechapternodecount/v2.1',
			'type' : 'POST'
		},
		'myallcoursechapternodecount' : {
			'url' : '/api/studytools/myallcoursechapternodecount/v2.1',
			'type' : 'POST'
		},
		'delmycontent' : {
			'url' : '/api/studytools/delmycontent/v2.1'
		},
		'ad_discuss' : {
			'url' : '/api/studytools/ad_discuss/v2.1'
		},
		'timeList' : {
			'url' : '/api/v2/exam/timeList'
		},
		'active' : {
			'url' : '/api/v2/course/active'
		},
		'bbs_forumlistShow' : {
			'url' : '/api/studytools/bbs_forumlistShow/v1.0'
		},
		'addLMG' : {
			'url' : '/api/v2/lessonMessage/addLMG',
			'type' : 'POST'
		},
		'version' : {
			'url' : '/api/course/courselist/version/v3/'
		},
		'exercisePointCountCache' : {
			'url' : '/api/extendapi/examen/get_exercise_point_count_cache',
			'type' : 'POST'
		},
		'exerciseKnowledgeMemberStatus' : {
			'url' : '/api/userAction/examen/get_exercise_knowledge_member_status',
			'type' : 'POST'
		},
		'userKnowledgePointExerciseList' : {
			'url' : '/api/userAction/examen/get_user_knowledge_point_exercise_list'
		},
		'setMemberExerciseLog' : {
			'url' : '/api/userAction/examen/setMemberExerciseState'
		},
		'getNidExerciseDetail' : {
			'url' : '/api/teachsource/examen/getNidExerciseDetail'
		}
	};
	
	return {
		ajax : function(args){
			
			// var hostName = "";
			// if(thatServer.hostName){
			// 	hostName = thatServer.hostName;
			// }else{
			// 	hostName = Common.host.name;
			// }
			
			var url = '';
			var type = 'get';
			var data = '';
			if(args.url){
				url = args.url
			}else{
				var thatServer = server[args.server];
				var hostName = args.hostName?args.hostName:Common.host.name;
				if(args.hostName){
					hostName = args.hostName;
				}
				url = hostName + thatServer.url  + "?verTT=" + new Date().getTime();
				type = thatServer.type;
				data = thatServer.data || args.data;
			}
			
			
			//var thatServerData = thatServer.data ? thatServer.data : args.data;
			$.ajax({
				url : url,
				type : type,
				data : data,
				success : function(data){

					if (typeof data == "string") {
					  data = JSON.parse(data);
					}
					if (data.msg == "nologin") {
						layer.msg('Sorry~ 您的账号在其它地方登录', function() {
							window.location.href = CAICUI.Common.loginLink;
						});

          } else if (data.state == "success") {
            args.done(data)
          } else if (data.state == "error" || data.msg == "error") {
            args.fail(data)
          } else {
          	args.fail(data)
          }
				},
				error : function(data){
				}
			})
		},
		promise : function(args){
			var thatServer = server[args.server];
			var hostName = thatServer.hostName?thatServer.hostName:Common.host.name;
			var url = hostName + thatServer.url  + "?verTT=" + new Date().getTime();
			var type = thatServer.type || 'get';
			var data = thatServer.data || args.data;
			var promise = new Promise(function(resolve, reject) {
				$.ajax({
					url : url,
					type : type,
					data : data,
					success : function(data){
						if (typeof data == "string") {
						  data = JSON.parse(data);
						}
						if (data.msg == "nologin") {
							window.location.href = CAICUI.Common.loginLink;
	          } else if (data.state == "success") {
	            resolve(data);
	          } else if (data.state == "error" || data.msg == "error") {
	            reject(statusText);
	          } else {
	          	reject(statusText);
	          }
					},
					error : function(data){
						reject(statusText);
					}
				})
    	});
    	return promise;
		}
	} 
});