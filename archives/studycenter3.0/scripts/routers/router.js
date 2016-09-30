;define([
	'jquery',
	'director'
	],function($, Director){
		'user strict';
		var src = '';
		var login = function(){
			src = 'login';
		};
		var studycenterIndex = function(){
			src = 'studycenterIndex';
		};
		var courseStudyIn = function(){
			src = 'courseStudyIn';
		};
		var courseNotActivated = function(){
			src = 'courseNotActivated';
		};
		var courseActivated = function(){
			src = 'courseActivated';
		};
		var courseActivated = function(){
			src = 'courseActivated';
		};
		var courseIndex = function(){
			src = 'courseIndex';
		};
		var courseStudy = function(args1){
			src = 'courseStudy';
		};
		var courseAc = function(args1){
			src = 'courseAc';
		};
		var courseNote = function(args1){
			src = 'courseNote';
		};
		var myExam = function(){
			src = 'myExam';
		};
		var myNote = function(){
			src = 'myNote';
		};
		var myAc = function(){
			src = 'myAc';
		};
		var error = function(){
			src = 'error';
		};
		var index = function() {
			src = 'studycenterIndex';
		};
		var video = function(courseId, chapterId) {
			CAICUI.Loading = true;
			require(['views/video'], function(dom) {
				dom.init(courseId, chapterId);
			});
			return false;
		};
		var videoTask = function(courseId, chapterId, taskId) {
			CAICUI.Loading = true;
			require(['views/video'], function(dom) {
				dom.init(courseId, chapterId, taskId);
			});
			return false;
		};
		var videoProgress = function(courseId, chapterId, taskId, taskProgress) {
			CAICUI.Loading = true;
			require(['views/video'], function(dom) {
				dom.init(courseId, chapterId, taskId, taskProgress);
			});
			return false;
		};
		var pagination = function(){
			src = 'pagination';
		};
		var help = function(){
			src = 'help';
		}
		var routes = {
			'/studycenterLogin' : login,
			'/login' : studycenterIndex,
			'/studycenterIndex' : studycenterIndex,
			'/studycenterIndex#login' : studycenterIndex,
			'/courseStudyIn' : courseStudyIn,
			'/courseNotActivated' : courseNotActivated,
			'/courseActivated' : courseActivated,
			//'/courseIndex/:type' : courseIndex,
			'/courseStudy/:courseId' : courseStudy,
			'/courseAc/:courseId' : courseAc,
			'/courseNote/:courseId' : courseNote,
			'/myExam' : myExam,
			'/myNote' : myNote,
			'/myAc' : myAc,
			'/video/:courseId/:chapterId' : video,
			'/video/:courseId/:chapterId/:taskId' : videoTask,
			'/video/:courseId/:chapterId/:taskId/:taskprogress' : videoProgress,
			'/pagination' : pagination,
			'/help' : help
		};
		

		return  Router(routes).configure({
			before : function(){

				// 清除定时器
				clearInterval(CAICUI.render.timer);
				clearTimeout(CAICUI.render.courseIndexTips);
				clearTimeout(CAICUI.render.intervalTasksProgress);
				if(CAICUI.render.$this && CAICUI.domRender){
					CAICUI.render.$this.undelegateEvents();
				}
				var cookieUser = $.cookie('User');
				var cookieLoginInfo = $.cookie('loginInfo');
				if(!cookieLoginInfo||cookieLoginInfo=="null"){
					require(['views/login'], function(Login) {
						CAICUI.isNav = true;
						var login = new Login();
						login.render();
					});
					return false;
				}
				if($('#animate').length){
					$('.video-icon-task-courselist').trigger('click');
				}
				
			},
			on: function(args1) {

				if(src == 'studycenterLogin'){
					try{
						CAICUI.isNav = true;
						require(['views/login'], function(Login) {
							var login = new Login();
							var preHash = '#studycenterIndex';
							login.render(preHash);
						});
						return false;
					}catch(e){
						var tryNum = CAICUI.Storage.getStorage('tryNum');
						if(tryNum){
							tryNum++;
							CAICUI.Storage.setStorage({tryNum : tryNum});
						}else{
							CAICUI.Storage.setStorage({tryNum : 1});
						}
						if(CAICUI.Storage.getStorage('tryNum')<3){
							setTimeout(function(){
								window.location.reload();
							},3000)
							
						}else{
							window.localStorage.clear();
							window.location.href = "http://www.caicui.com"
						}
					};
				}
				require(['views/layout','views/'+src], function(Layout, Dom) {

					// if(CAICUI.isNav){
					//	 CAICUI.isNav = false;
					try{
						// if(!CAICUI.Loading && CAICUI.NavVideo){
						// 	CAICUI.Loading = true;
						// }else{
						// 	var layout = new Layout();
						// 	layout.render(src);
						// 	CAICUI.iGlobal.loading('#right');
						// }
						if(CAICUI.domRender){
							if(CAICUI.NavVideo){
								var layout = new Layout();
								layout.render(src);
								CAICUI.iGlobal.loading('#right');
							}
							// 清理缓存机制 ： 记录第一次登陆的时间，之后的登陆时间在第二天的三点之后清楚缓存，并重新记录登陆时间。
							var clearTime = $.cookie('clearTime');
							var newDate = new Date();
							if(clearTime){
								var newDateTime = newDate.getTime();
								if(newDateTime > clearTime){
									localStorage.clear();
									$.cookie('clearTime', newDateTime, {
										path: '/',
										expires: 36500
									});
								}
							}else{
								var newDateStr = newDate.getFullYear() + '/' + (+newDate.getMonth() +1) + '/' + newDate.getDate() + ' ';
								var newDateHours = newDate.getHours();
								var newDateMilliseconds = '';
								if(newDateHours<3){
									newDateStr +=  '3:00:00';
									newDateMilliseconds = (new Date(newDateStr)).getTime();
								}else{
									newDateStr +=  '24:00:00';
									newDateMilliseconds = (new Date(newDateStr)).getTime() + 3*60*60*1000;
								}
								$.cookie('clearTime', newDateMilliseconds, {
									path: '/',
									expires: 36500
								});
							}

							var dom = new Dom();
							dom.render(args1);
						}
						CAICUI.NavVideo = true;
						CAICUI.domRender = true;
					}catch(e){
						var tryNum = CAICUI.Storage.getStorage('tryNum');
						console.log(tryNum)
						if(tryNum){
							tryNum++;
							CAICUI.Storage.setStorage({tryNum : tryNum});
						}else{
							CAICUI.Storage.setStorage({tryNum : 1});
						}
						if(CAICUI.Storage.getStorage('tryNum')<3){
							setTimeout(function(){
								window.location.reload();
							},3000)
							
						}else{
							window.localStorage.clear();
							window.location.href = "http://www.caicui.com"
						}
					}
				});
			},
			notfound: function() {
				window.location.href = CAICUI.Common.loginLink;
			}
		});
	});