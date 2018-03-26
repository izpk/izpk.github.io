;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-studycenterIndex').html()),
			events : {
				"mouseenter .studyin-content-subjects" : "subjectEnter",
				"mouseleave .studyin-content-subjects" : "subjectLeave",
				'click .contarner-start' : 'list',
				'click .index-course-a' : 'changeNav',
				'click .courseIntro-nextShow-btn' : 'courseIntroNextShow',
				'click .courseIntro-close' : 'courseIntroClose',
				'click .courseIntro-email-a' : 'courseIntroEmail',
				'click .courseIntro-default' : 'wileyCourseStudy',
				'click .js-index-live' : 'indexLive',
				'mouseenter .js-index-live' : 'indexLiveEnter',
				'mouseleave .js-index-live' : 'indexLiveLeave',
				'click .teachingPlan-a' : 'changeClass',
				'click .teachingPlan-course-a' : 'changeClassCourse'
			},
			render : function(){
				// CAICUI.Request.ajax({
				// 	'server' : 'ccLogin',
				// 	'data' : {
				// 		'viewername':'ceshi',
				// 		'viewertoken':'cmapass18',
				// 		'roomid':'5F53B9A5D33EAEB19C33DC5901307461',
				// 		'userid':'CB735BE8334BC857',
				// 	},
				// 	done : function(data){
				// 		console.log(data)
				// 	},
				// 	fail : function(data){

				// 	}
				// });

				CAICUI.render.$this = this;
				
				CAICUI.render.indexOpenCourse = '';
				CAICUI.render.classIndex = 0;
				CAICUI.render.classCourseIndex = 0;
				CAICUI.render.$this.$el.html(CAICUI.render.$this.template({
					'data' : {
						'mycount' : '',
						'capabilityAssessment' : '',
						'RecentCourse' : '',
						'slideList' : '',
						'loginloglist' : '',
						'getExamDate' : '',
						'experience' : ''
					}
				}));

				// 班级课程nav
				CAICUI.render.$this.classCourseListAjax(function(data){
					if(data.classCourseList.studyIn && data.classCourseList.studyIn.length){
						CAICUI.render.classCourseList = data.classCourseList.studyIn;
						CAICUI.render.$this.classRender()
					}
				});
				this.mycount();
				// this.capabilityAssessment();
				this.slideList();
				this.loginloglist();
				this.getExamDate(function(){
					CAICUI.render.$this.learningcourse();
				});
				CAICUI.render.$this.getappointmentlist(function(data){
					if(data){
						var templateHtml = $('#template-index-live').html();
						var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
							"data" : data
						});
						$('body .index-top').append(addHtml);
					}
				});
				window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
			},
			classCourseListAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'node-classCourseList',
					'data' : {
						'token' : CAICUI.nodeToken
					},
					done : function(data){
						if(callback){
							callback(data);
						};
					}
				});
			},
			classCourseDetailAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'node-classCourseDetail',
					'data' : {
						'token' : CAICUI.nodeToken,
						'memberId' : CAICUI.nodeMemberId,
						'courseId' : CAICUI.render.classCourseList[CAICUI.render.classIndex].classCourse[CAICUI.render.classCourseIndex].courseId
					},
					done : function(data){
						if(callback){
							callback(data);
						};
					}
				});
			},
			classCourseDetailDom : function(){
				CAICUI.render.$this.classCourseDetailAjax(function(data){
					// 班级课程info
					var weekIngInfo = data.planInfo[parseInt(data.weekIngNum)];
					console.log(weekIngInfo)
					var templateHtml = $('#template-teachingPlan-info-left').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						"classCourseId" : data.courseInfo.courseId,
						"classCourseDetail" : weekIngInfo,
						"isClassCourseStart" : true,
						"isStudycenterIndex" : true
					});
					$('body .index-teachingPlan-info').html(addHtml);
					window.CAICUI.myScroll.refresh();
				});
			},
			classRender : function(){
				var templateHtml = $('#template-teachingPlan-nav').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					"classIndex" : CAICUI.render.classIndex,
					"classCourseIndex" : CAICUI.render.classCourseIndex,
					"classCourseList" : CAICUI.render.classCourseList
				});
				$('body .index-teachingPlan').html(addHtml);
				CAICUI.render.$this.classCourseDetailDom();
			},
			changeClass : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				if(that.hasClass('active')){
					return false;
				}
				var index = that.index();
				that.siblings().removeClass('active');
				that.addClass('active');
				CAICUI.render.classIndex = index;
				CAICUI.render.classCourseIndex = 0;
				this.classRender();
			},
			changeClassCourse : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				if(that.hasClass('active')){
					return false;
				}
				var index = that.index();
				that.siblings().removeClass('active');
				that.addClass('active');
				CAICUI.render.classCourseIndex = index;
				this.classRender();
			},
			indexLive : function(){
				if(CAICUI.render.isLiveClick){
				var iframeSrc = 'https://view.csslcloud.net/api/view/login?';
				var roomId = CAICUI.render.indexOpenCourse.liveRoomId;
				var manageId = CAICUI.render.indexOpenCourse.liveManageId;
				var roomPassword = CAICUI.render.indexOpenCourse.liveRoomPassword ? CAICUI.render.indexOpenCourse.liveRoomPassword : '0';

				iframeSrc += 'roomid=' + roomId;
				iframeSrc += '&userid=' + manageId;
				iframeSrc += '&autoLogin=' + 'true';
				if(CAICUI.User.nickname && CAICUI.User.nickname != ''){
					iframeSrc += '&viewername=' + CAICUI.User.nickname;
				}else{
					iframeSrc += '&viewername=' + CAICUI.User.memberId;
				}
				iframeSrc += '&viewertoken=' + roomPassword;
				CAICUI.iGlobal.addLiveAnimate(function(){
					console.log('#live/'+CAICUI.render.indexOpenCourse.id+'/'+roomId+'/'+manageId+'/'+roomPassword+'?return_link=#studycenterIndex&return_hash=on')
					window.location.hash = '#live/'+CAICUI.render.indexOpenCourse.id+'?return_hash=on&from=0';
				});
				}
			},
			indexLiveEnter : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var isLiveTime = CAICUI.render.$this.isLiveTime(CAICUI.render.indexOpenCourse.startTime,CAICUI.render.indexOpenCourse.endTime);
				if(isLiveTime){
					CAICUI.render.isLiveClick = true;
				}else{
					that.addClass('active')
				}
			},
			indexLiveLeave : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				that.removeClass('active')
			},
			getappointmentlist : function(callback){
				if(CAICUI.render.indexOpenCourse){
					if(callback){callback(CAICUI.render.indexOpenCourse)};
				}else{
					CAICUI.Request.ajax({
						'server' : 'getappointmentlist',
						'data' : {
							'memberId' : CAICUI.User.memberId
						},
						done : function(data){
							
							CAICUI.render.appointmentlist = data.data;
							var isTodayData = '';
							var todayArray = [];
							var newDate = new Date().getTime();
							for(var i=0;i<data.data.length;i++){
								isTodayData = data.data[i];
								var isToday = CAICUI.render.$this.isToday(isTodayData.startTime,isTodayData.endTime)
								console.log(isToday)
								if(isToday){
									if(newDate < isTodayData.endTime){
										todayArray.push(isTodayData);
									}
									
								}
							}
							if(todayArray && todayArray.length){
								var minTodayData = _.min(todayArray, function(stooge){ return stooge.startTime; })
								console.log(minTodayData)
								CAICUI.render.indexOpenCourse = minTodayData;
								// CAICUI.render.isLiveTime = CAICUI.render.$this.isLiveTime(minTodayData.startTime,minTodayData.endTime);
							}
							
							if(callback){callback(CAICUI.render.indexOpenCourse)};
						},
						fail : function(data){
							CAICUI.render.indexOpenCourse = {};
						}
					})
				}
			},
			isToday : function(startTime, endTime){
				var nowYear = new Date().getFullYear();
				var nowMonth = new Date().getMonth();
				var nowDate = new Date().getDate();
				var startTimeYear = new Date(startTime).getFullYear();
				var startTimeMonth = new Date(startTime).getMonth();
				var startTimeDate = new Date(startTime).getDate();
				var endTimeYear = new Date(endTime).getFullYear();
				var endTimeMonth = new Date(endTime).getMonth();
				var endTimeDate = new Date(endTime).getDate();
				var isToday = false;

				console.log(nowYear+'-'+nowMonth+'-'+nowDate);
				console.log(startTimeYear+'-'+startTimeMonth+'-'+startTimeDate);
				console.log(endTimeYear+'-'+endTimeMonth+'-'+endTimeDate);

				if(nowYear === startTimeYear){
					if(nowMonth === startTimeMonth){
						if(nowDate === startTimeDate){
							isToday = true;
						}
					}
				}
				if(nowYear === endTimeYear){
					if(nowMonth === endTimeMonth){
						if(nowDate === endTimeDate){
							isToday = true;
						}
					}
				}
				return isToday;
			},
			isLiveTime : function(){
				var isLiveTime = false;
				if(CAICUI.render.indexOpenCourse){
					var time = new Date().getTime();
					var startTime = CAICUI.render.indexOpenCourse.startTime;
					var endTime = CAICUI.render.indexOpenCourse.endTime;
					if(startTime < time && time < endTime){
						isLiveTime = true;
					}
					
					if(time < startTime){
						CAICUI.render.isLiveTimeBefore = true;
					}
					if(endTime < time){
						CAICUI.render.isLiveTimeAfter = true;
					}
				}
				return isLiveTime;
			},
			mycount : function(){
				if(CAICUI.render.mycount && CAICUI.render.mycount.length){
					$('body .nodeNum').html(CAICUI.render.mycount.nodeNum);
					$('body .acNum').html(CAICUI.render.mycount.questionNum + CAICUI.render.mycount.discuss);
				}else{


				CAICUI.Request.ajax({
					'server' : 'mycount',
					'data' : {
						'token' : CAICUI.User.token
					},
					done : function(data){
						CAICUI.render.mycount = data.data;
						$('body .nodeNum').html(data.data.nodeNum);
						$('body .acNum').html(data.data.questionNum + data.data.discuss);
					},
					fail : function(data){
						CAICUI.render.mycount = {};
					}
				})
				}
			},
			capabilityAssessment : function(){
				CAICUI.Request.ajax({
					'server' : 'capabilityAssessment',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.User.memberId
					},
					done : function(data){
						CAICUI.render.capabilityAssessment = data.data[0];
						var examNum = data.data[0] ? data.data[0].total : '0';
						$('body .examNum').html(examNum);
					},
					fail : function(data){
						CAICUI.render.capabilityAssessment = {};
					}
				})
			},
			learningcourse : function(){

				if(CAICUI.render.filterLastProgress){
					CAICUI.render.$this.learningcourseRender(CAICUI.render.filterLastProgress);
					
					// var templateHtml = $('#template-studycenterIndex-courseList').html();
					// var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					// 	RecentCourse : CAICUI.render.filterLastProgress
					// });
					// $('body .index-course-ul').html(addHtml);
					// $('body .index-course-li').each(function(index){
					// 	CAICUI.iGlobal.canvasRound('progress-round-' + index);
					// })
					// window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
				}else{
					CAICUI.Request.ajax({
						'server' : 'learningcourse',
						'data' : {
							'token' : CAICUI.User.token,
							'pageNo' : 1,
							'pageSize' : CAICUI.defaultPageSize
						},
						done : function(data){
							
							CAICUI.CACHE.Learningcourse = data.data.courselist;

							var learningcourse = data.data.courselist;
							var courseArr = [];
							for(var i=0;i<learningcourse.length;i++){
								courseArr.push(learningcourse[i].courseId);
							}
							if(courseArr && courseArr.length){
								CAICUI.Request.ajax({
									'server' : 'actionGetCourseProgress',
									'data' : {
										'token' : CAICUI.User.token,
										'memberId' : CAICUI.User.memberId,
										'courseId' : courseArr.toString()
									},
									done : function(ret){
										var newLastProgress = {
											RecentCourse : []
										};
										for(var i=0;i<learningcourse.length;i++){
											for(var j=0;j<ret.data.length;j++){
												if(learningcourse[i].courseId == ret.data[j].courseId && newLastProgress.RecentCourse.courseId != ret.data[j].courseId){
													var addRecentCourse = true;
													if(newLastProgress.RecentCourse && newLastProgress.RecentCourse.length){
														for(var k = 0;k<newLastProgress.RecentCourse.length;k++){
															
															if(newLastProgress.RecentCourse[k].courseId == ret.data[j].courseId){
																addRecentCourse = false;
															}
															
														}
													}
							            if(addRecentCourse){
		          							learningcourse[i].courseProgress = ret.data[j].courseProgress;
		          	            learningcourse[i].createDate = ret.data[j].createDate;

		          	            learningcourse[i].chapterId = ret.data[j].chapterId;
		          	            learningcourse[i].chapterName = ret.data[j].chapterName;
		          	            learningcourse[i].progress = ret.data[j].progress;
		          	            learningcourse[i].taskId = ret.data[j].taskId;
		          	            learningcourse[i].taskName = ret.data[j].taskName;
		          	            newLastProgress.RecentCourse.push(learningcourse[i])
							            }
												}
											}
										}
							      var filterLastProgress = newLastProgress.RecentCourse;
							      var i = 0,
							          len = filterLastProgress.length,
							          j, d;
							      for (i = 0; i < len; i++) {
							          for (j = 0; j < len; j++) {
							              if (parseInt(filterLastProgress[i].createDate) > parseInt(filterLastProgress[j].createDate)) {
							                  d = filterLastProgress[j];
							                  filterLastProgress[j] = filterLastProgress[i];
							                  filterLastProgress[i] = d;
							              }
							          }
							      }
							      if(filterLastProgress.length>3){
							      	var filterLastProgress = filterLastProgress.slice(0,3)
							      }
							      for(var i=0;i<filterLastProgress.length;i++){
							      	for (var j = 0;j<CAICUI.render.examDateData.length;j++) {
							      		if(filterLastProgress[i].subjectID == CAICUI.render.examDateData[j].categoryId){
							      			filterLastProgress[i].examinationDate = CAICUI.render.examDateData[j].examinationDate
							      		}
							      	}
							      }
							      // console.log(filterLastProgress)
										CAICUI.render.filterLastProgress = filterLastProgress;
										CAICUI.render.$this.learningcourseRender(filterLastProgress);
									}
								})
							}else{
								CAICUI.render.$this.learningcourseRender([]);
							}
						},
						fail : function(data){
							CAICUI.CACHE.Learningcourse = {};
							CAICUI.CACHE.RecentCourse = {};
							CAICUI.render.filterLastProgress = {};
						}
					})
				}
			},
			learningcourseRender : function(filterLastProgress){
				var templateHtml = $('#template-studycenterIndex-courseList').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					RecentCourse : filterLastProgress
				});
				$('body .index-course-ul').html(addHtml);
				$('body .index-course-li').each(function(index){
					CAICUI.iGlobal.canvasRound('progress-round-' + index);
				})
				window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
			},
			slideList : function(){
				if(CAICUI.render.slideList && CAICUI.render.slideList.length){
					var templateHtml = $('#template-studycenterIndex-activityList').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						"slideList" : CAICUI.render.slideList
					});
					$('body .index-activity-ul').html(addHtml);
					window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
				}else{


				CAICUI.Request.ajax({
					'server' : 'slide-list',
					'data' : {
						'tag' : '0',
						'valid' : 'true',
						'count' : '4'
					},
					done : function(data){
						CAICUI.render.slideList = data.data;
						var templateHtml = $('#template-studycenterIndex-activityList').html();
						var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
							"slideList" : data.data
						});
						$('body .index-activity-ul').html(addHtml);
						window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
					},
					fail : function(data){
						CAICUI.render.slideList = {};
					}
				})
				}
			},
			loginloglist : function(){
				if(CAICUI.render.loginloglist && CAICUI.render.loginloglist.length){
					$('body .loginloglist').html(CAICUI.render.loginloglist);
				}else{
				CAICUI.Request.ajax({
					'server' : 'loginloglist',
					'data' : {
						'memberid' : CAICUI.User.memberId,
						'pageNo' : 1,
						'pageSize' : 1
					},
					done : function(data){
						
						var loginloglist = data.data[0] ? CAICUI.iGlobal.stringData(data.data[0].loginTime/1000) : "第一次登录";
						CAICUI.render.loginloglist = loginloglist;

						$('body .loginloglist').html(loginloglist);
					},
					fail : function(data){
						CAICUI.render.loginloglist = {};
					}
				})
				}
			},
			getExamDate : function(callback){
				if(CAICUI.render.examDateData && CAICUI.render.examDateData.length){
					var data = CAICUI.render.examDateData[0];
					var getExamDate = data ? data.categorySign +' '+ CAICUI.iGlobal.getDate(data.examinationDate) : "暂无考试";
					$('body .getExamDate').html(getExamDate);
					if(callback){callback()};
				}else{
				CAICUI.Request.ajax({
					'server' : 'getExamDate',
					'data' : {
						'memberId' : CAICUI.User.memberId
					},
					done : function(data){
						CAICUI.render.examDateData = data.data;
						var data = data.data[0];
						var getExamDate = data ? data.categorySign +' '+ CAICUI.iGlobal.getDate(data.examinationDate) : "暂无考试";
						CAICUI.render.examDate = getExamDate;
						$('body .getExamDate').html(getExamDate);
						if(callback){callback()};
					},
					fail : function(data){
						CAICUI.render.examDate = {};
					}
				})
				}
			},
			changeNav : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.isNav = true;
				if(that.hasClass('js-coursestudy')){
					this.courseStudy(that);
				}
			},
			courselistFilter : function(stooges){
				var newCourseList = [];
				if(stooges && stooges.length){
					var courselistFilter = _.chain(stooges)
						.uniq('courseId')
						.pick(function(stooges){return stooges.lastTaskdate})
					 	.sortBy('lastTaskdate')
					 	.reverse()
					  .value();
					for(var i = 0; i< courselistFilter.length; i++){
						if(i>2){
							break;
						}
						if(courselistFilter[i] && courselistFilter[i].lastTaskdate){
							newCourseList.push(courselistFilter[i]);
						}
					}
				}
				return {
					"RecentCourse" : newCourseList
				};
			},
			subjectEnter : function(e) {
				var current = e.currentTarget;
				var oSubject = $(current);
				var oIndex = oSubject.index();
				var	oMask = oSubject.find(".subject-lf").find(".subject-mask");
				var oSubjectRt = oSubject.find(".subject-rt");
				oMask.stop(true,false).animate({
					"left" : "0"
				});
				var oCurrentSubject= {
					"mask" : oMask,
					"rt" : oSubjectRt
				};
				return oCurrentSubject;
			},
			subjectLeave : function(e) {
				var oMaskLeave = this.subjectEnter(e)["mask"];
				oMaskLeave.stop(true,false).animate({
					"left" : "-160px"
				});
			},
			courseStudy : function(that){
				// var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.courseIdActive = that.attr('data-courseId');
				var courseIntro = $.cookie('courseIntro-'+CAICUI.User.memberId);
				var popShow = true;
				if(courseIntro && courseIntro.length){
					courseIntro = JSON.parse(courseIntro);
					for(var i=0;i<courseIntro.length;i++){
						if(courseIntro[i] == CAICUI.render.courseIdActive){
							popShow = false;
						}
					}
				}
				CAICUI.render.orderItemId = that.attr('data-orderItemId');
				if(popShow){
					CAICUI.render.courseName = that.attr('data-courseName');
					CAICUI.render.courseSource = that.attr('data-courseSource');
					CAICUI.render.expirationTime = that.attr('data-expirationTime');

					if(CAICUI.render.courseSource == "wiley"){
						var wWidth = $(window).width();
						var width = wWidth*0.618;
						var minWidth = 980*0.618;
						var maxWidth = 1600*0.618;
						if(width < minWidth){
							width = minWidth;
						}else if(width > maxWidth){
							width = maxWidth;
						}
						CAICUI.render.firstOpenCourseSourcePop = $.cookie('firstOpenCourseSourcePop');
						if(CAICUI.render.firstOpenCourseSourcePop!="true"){
							$.cookie('firstOpenCourseSourcePop', true, {
								path: '/',
								expires: 36500
							});
							$('body').append('<iframe class="wiley-iframe" src="https://app.efficientlearning.com/pv5/v8/1/app/cfa2017/level2.html?auth=wj5FSziNSkafKB4OI%2BURB3bovRo%3D" width="0" height="0" frameborder="0"></iframe>')
						}
						CAICUI.render.closeIntro = layer.open({
							type: 1,
							title: false,
							shade: true,
							scrollbar: false,
							area: [width + 'px', 'auto'], //宽高
							closeBtn : 0,
							content: $("#courseIntro"),
							success: function() {
								$('.layui-layer-shade').css('filter', 'alpha(opacity=50)');
								$('.courseIntro-time').removeClass('hidden');
								$('.courseIntro-time-span').text(CAICUI.iGlobal.getDate(CAICUI.render.expirationTime));

								if(CAICUI.render.member && !CAICUI.render.memberReset){
									CAICUI.render.$this.popInit();
								}else{
									CAICUI.render.$this.getMember(function(){
										CAICUI.render.memberReset = false;
										CAICUI.render.$this.popInit();
									})
								}
								
							}
						});
					}else{
						
					}
				}else{
					

					this.wileyCourseStudyAjax();
				}
				
			},
			getMember : function(callback){
				CAICUI.Request.ajax({
					'server' : 'member',
					'data' : {
						'token' : CAICUI.User.token
					},
					done : function(data){
						if (data.state == 'success') {
							CAICUI.render.member = data.data;
							if(callback){callback()};
						} else {
							console.log('member:'+data)
						}
					},
					fail : function(data){
						console.log('member:'+data)
						// layer.msg('Sorry~ 课程激活失败！', function() {});
					}
				});
			},
			wileyCourseStudy : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				that.removeClass('courseIntro-default').addClass('courseIntro-disabled');
				this.wileyCourseStudyAjax(function(){
					that.removeClass('courseIntro-disabled').addClass('courseIntro-default');
					layer.close(CAICUI.render.closeIntro);
				});
			},
			wileyCourseStudyAjax : function(callback){
				layer.close(CAICUI.render.closeIntro);
					
				CAICUI.render.introLoading = layer.open({
					type: 1,
					title: false,
					shade: true,
					scrollbar: false,
					area: ['350px', 'auto'], //宽高
					closeBtn : 0,
					content: $("#courseIntroLoading"),
					success: function() {
						CAICUI.render.wileyCourseStudyTimeStart = new Date().getTime();
						CAICUI.Request.ajax({
							'server' : 'wileyCourseStudy',
							'data' : {
								'token' : CAICUI.User.token,
								'courseId' : CAICUI.render.courseIdActive,
								'orderItemId' : CAICUI.render.orderItemId,
								'courseSource' : 'wiley'
							},
							done : function(data){
								if (data.state == 'success' && data.data.status == "302" && data.data.url != "") {
									if(callback){callback()};

									var taskProgressData = {
											token:CAICUI.User.token,
											memberId:CAICUI.User.memberId,
											memberName:CAICUI.User.nickname,

											progress:1,
											total:1,
											
											taskId: CAICUI.render.courseIdActive,				
											chapterId:CAICUI.render.courseIdActive,
											courseId:CAICUI.render.courseIdActive,
											subjectId:CAICUI.render.courseIdActive,
											categoryId:CAICUI.render.courseIdActive,
											
											taskName:CAICUI.render.courseName,
											chapterName:CAICUI.render.courseName,
											courseName:CAICUI.render.courseName,
											subjectName : CAICUI.render.courseName,
											categoryName : CAICUI.render.courseName,
											state: 0
										}
									taskProgressData.isSupply = 0;
									taskProgressData.createDate = new Date().getTime();
									CAICUI.render.wileyCourseStudyTimeEnd = taskProgressData.createDate;
									CAICUI.Request.ajax({
										'server' : 'actionTaskProgress',
										'data' : {
											'token' : CAICUI.User.token,
											'message': JSON.stringify(taskProgressData)
										},
										done : function(data){
											console.log(data)
										}

									});


									CAICUI.render.$this.popLoadingInit();
									// window.open(data.data.url)
									CAICUI.render.$this.addAnimate(function(){
										var courseWileyIframe = $('#template-course-wiley-iframe').html();
										var addHtml = CAICUI.iGlobal.getTemplate(courseWileyIframe,{
											'title' : CAICUI.render.courseName,
											'wileyUrl' : data.data.url
										});
										$('#animate').html(addHtml);
										$('.js-wiley-iframe-close').on('click',function(){
											CAICUI.render.$this.removeAnimate();
										})
									})
								} else {
									console.log('wileyCourseStudy:'+data)
									CAICUI.render.$this.wileyCourseStudyLoading();
								}
							},
							fail : function(data){
								console.log('wileyCourseStudy:'+data)
								CAICUI.render.$this.wileyCourseStudyLoading();
								// layer.msg('Sorry~ ', function() {
								// 	that.removeClass('courseIntro-disabled').addClass('courseIntro-default');
								// });
							}
						});
					}
				});


				// this.wileyCourseStudyLoading();
				// return false;
				
			},
			wileyCourseStudyLoading : function(){
				$('.courseIntroLoading').addClass('active');
				var time = 5;
				CAICUI.render.introLoadingTimes = setInterval(function(){
					time--;
					if(time){
						$('.courseIntroLoading-time').text(time);
					}else{
						time = 0;
						clearInterval(CAICUI.render.introLoadingTimes);
						CAICUI.render.$this.popLoadingInit();
					}
					
				},1000)
			},
			popInit : function(){
				$('.courseIntro-footer').css('opacity',1);
				// CAICUI.render.member.email = '邮箱里面有中文';
				CAICUI.render.emailState = "" 
				if(!CAICUI.render.member.email){
					CAICUI.render.emailState = "邮箱为空";
				}else if(CAICUI.iGlobal.isChineseChar(CAICUI.render.member.email)){
					CAICUI.render.emailState = "邮箱里面有中文";
				}
				if(CAICUI.render.emailState){
					$('.courseIntro-email').css('opacity',1);
					$('.courseIntro-email-info').text(CAICUI.render.emailState);
					$('.courseIntro-btn').removeClass('courseIntro-default').addClass('courseIntro-disabled');
				}else{

				}
			},
			popLoadingInit : function(){
				if(CAICUI.render.firstOpenCourseSourcePop!='true' && CAICUI.render.wileyCourseStudyTimeEnd){
					var time = CAICUI.render.wileyCourseStudyTimeEnd-CAICUI.render.wileyCourseStudyTimeStart;
					console.log(time)
					if(time<3000){
						setTimeout(function(){
							$('.courseIntro-btn').removeClass('courseIntro-disabled').addClass('courseIntro-default');
							$('.courseIntroLoading').removeClass('active');
							$('.courseIntroLoading-time').text(5);
							layer.close(CAICUI.render.introLoading);
						},3-time)
						return false;
					}
				}
				$('.courseIntro-btn').removeClass('courseIntro-disabled').addClass('courseIntro-default');
				$('.courseIntroLoading').removeClass('active');
				$('.courseIntroLoading-time').text(5);
				layer.close(CAICUI.render.introLoading);
			},
			courseIntroNextShow : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var courseIntro = $.cookie('courseIntro-'+CAICUI.User.memberId);

				if(that.hasClass('active')){
					if(courseIntro && courseIntro.length){
						courseIntro = JSON.parse(courseIntro);
						for(var i=0;i<courseIntro.length;i++){
							if(courseIntro[i] == CAICUI.render.courseIdActive){
								courseIntro.splice(i,1)
							}
						}
					}
					that.removeClass('active');
				}else{
					if(courseIntro && courseIntro.length){
						courseIntro = JSON.parse(courseIntro);
						courseIntro.push(CAICUI.render.courseIdActive)
					}else{
						courseIntro = [CAICUI.render.courseIdActive]
					}
					that.addClass('active');
				}
				$.cookie('courseIntro-'+CAICUI.User.memberId, JSON.stringify(courseIntro), {
					path: '/',
					expires: 36500
				});
				// localStorage.setItem('courseIntro-'+CAICUI.User.memberId, JSON.stringify(courseIntro))
				// storage.setsingle('courseIntro-'+CAICUI.User.memberId, courseIntro)
			},
			courseIntroClose : function(){
				layer.close(CAICUI.render.closeIntro);
			},
			courseIntroEmail : function(){
				CAICUI.render.memberReset = true;
				layer.close(CAICUI.render.closeIntro);
			},
		  addAnimate : function(callback){
	    	var windowWidth = $(window).width();
	    	var windowHeight = $(window).height();
	    	$('body').prepend('<div id="animate" style="width:'+windowWidth+'px;"></div>');
	    	$('#animate').animate({
	    		'height' : windowHeight,
	    		'top' : '0'
	    	},300,function(){
	    		if(callback){callback();};
	    	})
		  },
		  removeAnimate : function(callback){
				$('#animate').animate({
					'height' : '0',
					'top' : '50%'
				},300,function(){
					$('#animate').remove();
					if(callback){callback();};
				})
			}
		});
		return Studycenter;
	});