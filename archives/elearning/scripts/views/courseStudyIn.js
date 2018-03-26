;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'div',
			className : 'course-content',
			// el : 'body #right',
			template : _.template($('#template-course-studyIn').html()),
			events : {
				// "mouseenter .studyin-content-subjects" : "subjectEnter",
				// "mouseleave .studyin-content-subjects" : "subjectLeave",
				"click .studyin-content-subjects" : "subjectClick",
				// "click .studyin-content-header" : "iconClick",
				"click .studyin-type" : "typeClick",
				"click .js-coursestudy" : 'courseStudy',
				'click .courseIntro-nextShow-btn' : 'courseIntroNextShow',
				'click .courseIntro-close' : 'courseIntroClose',
				'click .updateCourse-close' : 'updateCourseClose',
				'click .courseIntro-email-a' : 'courseIntroEmail',
				'click .courseIntro-default' : 'wileyCourseStudy',
				'click .js-locking-tipsPop' : 'lockingTipsPop',
				'click .updateCourse-btn' : 'updateCourseAjax'
			},
			render : function(){
				this.$el.html(this.template());

				CAICUI.render.courseStudyIn = this;
				this.learningcourse(function(data){

					var templateHtml = $('#template-course-studyIn-list').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						'data' : data
					});
					$('body .course-content').html(addHtml);


					// CAICUI.render.courseStudyIn.$el.html(CAICUI.render.courseStudyIn.template({
					// 	'data' : data
					// }));
					$('.current-progress').each(function(){
						var that = $(this);
						var progress = parseInt(that.attr('data-progress'));
						if(progress){
							that.addClass('active');
							that.animate({
								width: (progress/100)*90
							},1000);
						}
					});
					window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
					setTimeout(function(){
						CAICUI.render.updateCourseIndex = 0;
						if(CAICUI.render.courseStudyIn.updateCourse){
							CAICUI.render.courseStudyIn.updateCourse();
						}
						
					},50);
					
				});
				return this;
			},
			updateCourse : function(){
				var index = 0;
				if(CAICUI.render.updateCourseIndex){
					index = CAICUI.render.updateCourseIndex;
				}
				CAICUI.render.updateCourseIndex++;
				if(index >= CAICUI.render.Learningcourse.length){
					return false;
				}
				CAICUI.render.courseGroupId = CAICUI.render.Learningcourse[index].courseGroupId;
				CAICUI.render.orderItemId = CAICUI.render.Learningcourse[index].orderID_item_id;
				CAICUI.render.courseStudyIn.getmembernotprocnoticelist(CAICUI.render.courseGroupId,CAICUI.render.orderItemId);
			},
			getmembernotprocnoticelist : function(courseGroupId,orderItemId){
				CAICUI.Request.ajax({
					'server' : 'getmembernotprocnoticelist',
					'data' : {
						'courseGroupId' : courseGroupId,
						'orderItemId' : orderItemId
					},
					done : function(data){
						if(data.data && data.data.length){
							CAICUI.render.courseStudyIn.createUpdateCourse(data.data[0]);
						}else{
							CAICUI.render.courseStudyIn.updateCourse();
						}
					},
					fail : function(data){
						console.log(data)
					}
				});
			},
			createUpdateCourse : function(data){
				var wWidth = $(window).width();
				var width = wWidth*0.618;
				var minWidth = 980*0.618;
				var maxWidth = 1600*0.618;
				if(width < minWidth){
					width = minWidth;
				}else if(width > maxWidth){
					width = maxWidth;
				}

				CAICUI.render.updateCourse = layer.open({
					type: 1,
					title: false,
					shade: true,
					scrollbar: false,
					area: [width + 'px', 'auto'], //宽高
					closeBtn : 0,
					content: $("#updateCourse"), // courseIntro  updateCourse
					success: function() {
						$('body #updateCourse .updateCourse-content').text(data.content);
					}
				});

			},
			updateCourseClose : function(){
				layer.close(CAICUI.render.updateCourse);
				CAICUI.render.courseStudyIn.updateCourse();
			},
			updateCourseAjax : function(e){
				
				var that = CAICUI.iGlobal.getThat(e);
				console.log(that.attr('class'))
				var state = 0;
				if(that.hasClass('updateCourse-default')){
					state = 1;
				}
				$('body .updateCourse').find('.loader-box').removeClass('hidden');
				CAICUI.Request.ajax({
					'server' : 'membercheck',
					'data' : {
						'courseGroupId' : CAICUI.render.courseGroupId,
						'itemId' : CAICUI.render.orderItemId,
						'state' : state
					},
					done : function(data){
						console.log(data)
						$('body .updateCourse').find('.loader-box').addClass('hidden');
						layer.close(CAICUI.render.updateCourse);
						CAICUI.render.courseStudyIn.updateCourse();
					},
					fail : function(data){
						console.log(data)
						// CAICUI.render.courseStudyIn.updateCourse();
					}
				});
			},
			learningcourse : function(callback){
				// if(!CAICUI.CACHE.Learningcourse || !CAICUI.CACHE.Learningcourse.length){
					CAICUI.Request.ajax({
						'server' : 'learningcourse',
						'data' : {
							'token' : CAICUI.User.token,
							'pageNo' : 0,
							'pageSize' : CAICUI.defaultPageSize
						},
						done : function(data){
							// var data = {"data":{"total":1,"courselist":[{"categoryIndex":20,"effectiveDay":0,"taskTotal":"0","isU":"true","courseBkImage":null,"categoryId":"ff80808149cc09f70149f3e7b9534654","courseId":"470ca3508ca27a76de6217ec04bb84e2","outline":"","teacherName":"柳豆豆","lastmodifyTime":1484551520,"orderID_item_id":"40288a0659a6b6860159a6c2d477000a","categoryName":"CFA","subjectName":"L1基础课","courseIndex":50,"expirationTime":1500200911,"subjectID":"ff80808149cc09f70149f3e860fa4655","buyTime":1484561503,"teacherImage":"/upload/201607/95032916d79146928118cc61cfb9f417.png","versionId":"470ca3508ca27a76de6217ec04bb84e2","teacherHonor":"CPA高级讲师","subjectIndex":50,"courseSource":"wiley","availability":"","courseName":"CFA Level I 英文"}],"pageNo":0,"pageSize":999},"state":"success","msg":""}
							CAICUI.render.Learningcourse = data.data.courselist;
							CAICUI.CACHE.Learningcourse = data.data.courselist;
							var courseArr = [];
							for(var i=0;i<data.data.courselist.length;i++){
								courseArr.push(data.data.courselist[i].courseId);
							}
							CAICUI.Request.ajax({
								'server' : 'actionGetCourseProgress',
								'data' : {
									'token' : CAICUI.User.token,
									'memberId' : CAICUI.User.memberId,
									'courseId' : courseArr.toString()
								},
								done : function(ret){
									
									for(var i=0;i<CAICUI.CACHE.Learningcourse.length;i++){
										for(var j=0;j<ret.data.length;j++){
											if(CAICUI.CACHE.Learningcourse[i].courseId == ret.data[j].courseId){

												CAICUI.CACHE.Learningcourse[i].courseProgress = ret.data[j].courseProgress;
						            CAICUI.CACHE.Learningcourse[i].createDate = ret.data[j].createDate;

						            CAICUI.CACHE.Learningcourse[i].chapterId = ret.data[j].chapterId;
						            CAICUI.CACHE.Learningcourse[i].chapterName = ret.data[j].chapterName;
						            CAICUI.CACHE.Learningcourse[i].progress = ret.data[j].progress;
						            CAICUI.CACHE.Learningcourse[i].taskId = ret.data[j].taskId;
						            CAICUI.CACHE.Learningcourse[i].taskName = ret.data[j].taskName;
											}
										}
									}
									var filterLearningcourseData = CAICUI.render.courseStudyIn.filterLearningcourseData(CAICUI.CACHE.Learningcourse);
									if(callback){
										callback({
											"courseListNav" : filterLearningcourseData.courseListNav,
											"courseLists" : filterLearningcourseData.courseLists
										})
									}
								}
							})


							
						},
						fail : function(data){
							callback({
								"courseListNav" : {},
								"courseLists" : {}
							});
						}
					})
				// }else{
					
				// 	var filterLearningcourseData = this.filterLearningcourseData(CAICUI.CACHE.Learningcourse);
				// 	callback({
				// 		"courseListNav" : filterLearningcourseData.courseListNav,
				// 		"courseLists" : filterLearningcourseData.courseLists
				// 	});
				// }
			},
			filterLearningcourseData : function(data){
				var stooges = data;
				var courseListNav = _.chain(stooges)
				 	.map(function(stooge){ return stooge.categoryName ; })
				  .uniq()
				  .value();
				var courseListIndex = _.chain(stooges)
				 	.map(function(stooge){ return stooge.categoryIndex ; })
				  .uniq()
				  .value();
				var courseLists = [];
				for(var i=0;i<courseListNav.length;i++){
					courseLists.push({
						"categoryName" : courseListNav[i],
						"categoryIndex" : courseListIndex[i],
						"list" : []
					});
					_.each(stooges,function(element, index, list){
						if(element.categoryName == courseListNav[i]){
							if(courseLists && courseLists[i] && courseLists[i].list){
								courseLists[i].list.push(element)
								// var add = true;
								// _.each(courseLists[i].list,function(ele, index, list){
								// 	if(element.courseId == ele.courseId){
								// 		add = false;
								// 	}
								// });
								// if(add){
								// 	courseLists[i].list.push(element);
								// }
							}else{
								courseLists[i].list= [element];
							}
							
						}
					});
				}
				for(var i=0;i<courseLists.length;i++){
					courseLists[i].newList = []
					var stooge = courseLists[i].list
					var subjectNameArray = _.chain(stooge)
					 	.map(function(stooge){ return stooge.subjectName ; })
					  .uniq()
					  .value();
					var subjectIndexArray = _.chain(stooge)
					 	.map(function(stooge){ return stooge.subjectIndex ; })
					  .uniq()
					  .value();
				  for(var j=0;j<subjectNameArray.length;j++){
				  	courseLists[i].newList.push({
				  		"subjectName" : subjectNameArray[j],
				  		"subjectIndex" : subjectIndexArray[j],
							"list" : []
				  	})
				  	_.each(courseLists[i].list,function(element, index, list){
							if(element.subjectName == subjectNameArray[j]){

								if(courseLists[i].newList[j].list){
									//courseLists[i].newList[j].list.push(element);
									var add = true;
									_.each(courseLists[i].newList[j].list,function(ele, index, list){
										if(element.courseId == ele.courseId){
											add = false;
										}
									});
									if(add){
										courseLists[i].newList[j].list.push(element);
									}
								}else{
									courseLists[i].newList[j].list= [element];
								}
								
							}
						});
				  }
				}
				var courseLists = _.sortBy(courseLists, 'categoryIndex');
				_.each(courseLists,function(element, index){
					courseLists[index].newList =  _.sortBy(element.newList, 'subjectIndex');
					_.each(courseLists[index].newList,function(elements, item){
						courseLists[index].newList[item].list =  _.sortBy(elements.list, 'courseIndex');
					})
				})
				return {
					"courseListNav" : courseListNav,
					"courseLists" : courseLists
				}
			},
			subjectEnter : function(e){
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
			subjectLeave : function(e){
				var oMaskLeave = this.subjectEnter(e)["mask"];
				oMaskLeave.stop(true,false).animate({
					"left" : "-160px"
				})
			},
			subjectClick : function(e){
				var oSubjectClick = this.subjectEnter(e)["rt"];
				oSubjectClick.parent().parent().addClass("active").siblings().removeClass("active");
			},
			iconClick : function(e){
				var current = e.currentTarget;
				var oIcon = $(current);
				oIcon.find('.subject-type-rt').toggleClass("stop");
				oIcon.next(".studyin-content-subject").toggleClass("stop");
				// oIcon.toggleClass("stop");
				// oIcon.parent().next(".studyin-content-subject").toggleClass("stop");
				CAICUI.myScroll.refresh();
			},
			typeClick : function(e){
				var current = e.currentTarget;
				var oType = $(current);
				var index = oType.index();
				oType.addClass("active").siblings().removeClass("active");
				$('.studyin-contents').removeClass("active").eq(index).addClass('active');
				CAICUI.myScroll.refresh();
			},
			courseStudy : function(e){
				var that = CAICUI.iGlobal.getThat(e);
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
							console.log(CAICUI.render.firstOpenCourseSourcePop)
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
									CAICUI.render.courseStudyIn.popInit();
								}else{
									CAICUI.render.courseStudyIn.getMember(function(){
										CAICUI.render.memberReset = false;
										CAICUI.render.courseStudyIn.popInit();
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
						layer.msg('Sorry~ 课程激活失败！', function() {});
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


									CAICUI.render.courseStudyIn.popLoadingInit();
									// window.open(data.data.url)
									CAICUI.render.courseStudyIn.addAnimate(function(){
										var courseWileyIframe = $('#template-course-wiley-iframe').html();
										var addHtml = CAICUI.iGlobal.getTemplate(courseWileyIframe,{
											'title' : CAICUI.render.courseName,
											'wileyUrl' : data.data.url
										});
										$('#animate').html(addHtml);
										$('.js-wiley-iframe-close').on('click',function(){
											CAICUI.render.courseStudyIn.removeAnimate();
										})
									})
								} else {
									console.log('wileyCourseStudy:'+JSON.stringify(data))
									CAICUI.render.courseStudyIn.wileyCourseStudyLoading();
								}
							},
							fail : function(data){
								console.log('wileyCourseStudy:'+JSON.stringify(data))
								CAICUI.render.courseStudyIn.wileyCourseStudyLoading();
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
						CAICUI.render.courseStudyIn.popLoadingInit();
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
			},
			lockingTipsPop : function(){
				layer.open({
				  title: '分期付款未完成',
				  content: '缴费后即可解锁，缴费后若课程依然锁定联系分部老师解锁即可。'
				});   
			}
		});
		return Studycenter;
	});