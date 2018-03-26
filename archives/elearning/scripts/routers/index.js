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
		
		var teachingPlan = function(args1){
			src = 'classCourse-teachingPlan';
		};
		var courseAc = function(args1){
			src = 'courseAc';
		};
		var courseResources = function(args1){
			src = 'courseResources';
		};
		var courseNote = function(args1){
			src = 'courseNote';
		};
		var classCourseAc = function(args1){
			src = 'classCourse-ac';
		};
		var classCourseResources = function(args1){
			src = 'classCourse-resources';
		};
		var classCourseNote = function(args1){
			src = 'classCourse-note';
		};
		var questionBank = function(){
			src = 'questionBank';
		};
		var studyReport = function(){
			src = 'classCourse-studyReport';
		};
		// var examReport = function(){
		// 	src = 'examReport';
		// };
		var examReport = function(knowledgePointId, examenNum) {
			CAICUI.Loading = true;
			require(['views/questions-examReport'], function(dom) {
				var dom = new dom();
				dom.render(knowledgePointId, examenNum);
			});
			return false;
		};
		var myCourse = function(){
			src = 'myCourse';
		};
		var classCourse = function(){
			src = 'classCourse';
		};
		var classCourseStudy = function(courseId){
			src = 'classCourse-study';
			// CAICUI.Loading = true;
			// require(['views/layout','views/'+src], function(Layout, Dom) {
			// 	if(CAICUI.NavVideo){
			// 		CAICUI.NavVideo = false;
			// 		var layout = new Layout();
			// 		layout.render(src);
			// 	}
			// 	// CAICUI.iGlobal.loading('#right');

			// 	var dom = new Dom();
			// 	dom.render(courseId);
			// });
			// return false;
		};
		// var questionBankList = function(){
		// 	src = 'questionBankList';
		// };
		var questionBankList = function(type, certificate, subject) {
			src = 'questionBankList';
			CAICUI.Loading = true;
			require(['views/layout','views/'+src], function(Layout, Dom) {
				if(CAICUI.NavVideo){
					CAICUI.NavVideo = false;
					var layout = new Layout();
					layout.render(src);
				}
				CAICUI.iGlobal.loading('#right');

				var dom = new Dom();
				dom.render(type, certificate, subject);
			});
			return false;
		};
		var myExam = function(type){
			src = 'myExam';
		};
		var myExamType = function(type){
			src = 'myExam';
			CAICUI.Loading = true;
			require(['views/layout','views/'+src], function(Layout, Dom) {
				if(CAICUI.NavVideo){
					CAICUI.NavVideo = false;
					var layout = new Layout();
					layout.render(src);
				}
				CAICUI.iGlobal.loading('#right');

				var dom = new Dom();
				dom.render(type);
			});
			return false;
		};
		var myNote = function(){
			src = 'myNote';
		};
		var myAc = function(){
			src = 'myAc';
		};
		var myAcType = function(type){
			src = 'myAc';
			CAICUI.Loading = true;
			require(['views/layout','views/'+src], function(Layout, Dom) {
				if(CAICUI.NavVideo){
					CAICUI.NavVideo = false;
					var layout = new Layout();
					layout.render(src);
				}
				CAICUI.iGlobal.loading('#right');

				var dom = new Dom();
				dom.render(type);
			});
			return false;
		};
		var error = function(){
			src = 'error';
		};
		var index = function() {
			src = 'studycenterIndex';
		};
		
		var videoIsEnd = function(isEnd) {
			CAICUI.Loading = true;
			require(['views/video'], function(dom) {
				dom.init(isEnd);
			});
			return false;
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
		var questionsRealImitate = function(type, id){
			CAICUI.Loading = true;
			require(['views/questions-realImitate'], function(dom) {
				var dom = new dom();
				dom.render(type, id);
			});
			return false;
		};
		var questionsTestSite = function(type, id){
			CAICUI.Loading = true;
			require(['views/questions-testSite'], function(dom) {
				var dom = new dom();
				dom.render(type, id);
			});
			return false;
		};
		var questions = function(type, id){
			CAICUI.Loading = true;
			require(['views/questions'], function(dom) {
				var dom = new dom();
				dom.render(type, id);
			});
			return false;
		};
		var questionsVideo = function(knowledgepointid){
			CAICUI.Loading = true;
			require(['views/questions-knowledge'], function(dom) {
				var dom = new dom();
				dom.render(knowledgepointid);
			});
			return false;
		};
		var questionsStyle = function(){
			CAICUI.Loading = true;
			require(['views/questionsStyle'], function(dom) {
				var dom = new dom();
				dom.render();
			});
			return false;
		};
		var pagination = function(){
			src = 'pagination';
		};
		var help = function(){
			src = 'help';
		}
		var live = function(opencourseid){
			CAICUI.Loading = true;
			require(['views/live'], function(dom) {
				var dom = new dom();
				dom.render(opencourseid);
			});
			return false;
		}
		var payCallback = function(){
			src = 'payCallback';
		};
		var activationCourse = function(){
			src = 'activationCourse'
		}
		var learningPlan = function(){
			src = 'learningPlan'
		}
		var learningPlanPreview = function(){
			src = 'learningPlanPreview'
		}
		var routes = {
			// '/studycenterLogin' : login,
			'/login' : studycenterIndex,
			'/studycenterIndex' : studycenterIndex,
			'/studycenterIndex#login' : studycenterIndex,
			'/myCourse/:type' : myCourse,
			'/courseStudyIn' : courseStudyIn,
			'/courseNotActivated' : courseNotActivated,
			'/courseActivated' : courseActivated,
			//'/courseIndex/:type' : courseIndex,
			'/courseStudy/:courseId' : courseStudy,
			'/classCourse/:type' : classCourse,
			'/classCourseStudy/:courseId' : classCourseStudy,
			'/teachingPlan/:courseId' : teachingPlan,
			'/courseAc/:courseId' : courseAc,
			'/courseResources/:courseId' : courseResources,
			'/courseNote/:courseId' : courseNote,
			'/classCourseAc/:courseId' : classCourseAc,
			'/classCourseResources/:courseId' : classCourseResources,
			'/classCourseNote/:courseId' : classCourseNote,
			'/questionBank' : questionBank,
			'/questionBankList/:type/:certificate/:subject' : questionBankList,
			'/myExam' : myExam,
			'/myExam/:type' : myExamType,
			'/myNote' : myNote,
			'/myAc' : myAc,
			'/myAc/:type' : myAcType,
			'/video/:isend' : videoIsEnd,
			'/video/:courseId/:chapterId' : video,
			'/video/:courseId/:chapterId/:taskId' : videoTask,
			'/video/:courseId/:chapterId/:taskId/:taskprogress' : videoProgress,
			'/questionsRealImitate/:type/:id' : questionsRealImitate,
			'/questionsTestSite/:type/:id' : questionsTestSite,
			'/questions/:type/:id' : questions,
			'/questionsVideo/:knowledgepointid' : questionsVideo,
			'/questionsStyle' : questionsStyle,
			'/pagination' : pagination,
			'/help' : help,
			'/live/:opencourseid' : live,
			'/payCallback' : payCallback,
			'/activationCourse' : activationCourse,
			'/learningPlan' : learningPlan,
			'/learningPlanPreview' : learningPlanPreview,
			'/studyReport' : studyReport,
			'/examReport/:knowledgePointId/:examenNum' : examReport
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
				/*
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
							},1000)
							
						}else{
							window.localStorage.clear();
							window.location.href = window.origin
						}
					};
				};
				*/
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
								CAICUI.NavVideo = false;
								var layout = new Layout();
								layout.render(src);
								CAICUI.iGlobal.loading('#right');
							}
							// 清理缓存机制 ： 记录第一次登录的时间，之后的登录时间在第二天的三点之后清楚缓存，并重新记录登录时间。
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
						// CAICUI.NavVideo = true;
						CAICUI.domRender = true;
					}catch(e){
						console.log(e)
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
								// window.location.reload();
							},1000)
						}else{
							console.log(2)
							window.localStorage.clear();
							window.location.href = window.origin
						}
					}
				});
			},
			notfound: function() {
				window.location.href = '#studycenterIndex';
			}
		});
	});