;define([
	'jquery',
	'underscore',
	'backbone',
	'views/activationCourse',
	'views/learningPlan',
	'layer'
	],function($, _, Backbone, activationCourse, learningPlan, layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'div',
			className : 'course-content',
			// el : 'body #right',
			template : _.template($('#template-course-notActivated').html()),
			events : {
				// "mouseenter .studyin-content-subjects" : "subjectEnter",
				// "mouseleave .studyin-content-subjects" : "subjectLeave",
				"click .studyin-content-subjects" : "subjectClick",
				// "click .studyin-content-header" : "iconClick",
				"click .studyin-type" : "typeClick",
				'click .js-course-notActivated' : 'acivated',
				'click .ca-btn-no' : 'closeAcivated',
				'click .courseActivation-close' : 'closeAcivated',
				// 'click .js-course-activation' : 'courseActivation',
				'click .courseIntro-nextShow-btn' : 'courseIntroNextShow',
				'click .courseIntro-close' : 'courseIntroClose',
				'click .courseIntro-email-a' : 'courseIntroEmail',
				'click .js-locking-tipsPop' : 'lockingTipsPop',
				'click .course-activation-acca-btn' : 'selectLearningPlan',
			},
			render : function(){
				this.$el.html(this.template());

				CAICUI.render.$this = this;
				CAICUI.render.closeActbut = '';
				CAICUI.render.courseId = '';
				CAICUI.render.orderItemId = '';
				CAICUI.render.isU = 0;
				CAICUI.render.title = '';
				CAICUI.render.effectiveDay = '';
				CAICUI.render.expirationDate = '';
				CAICUI.render.memberReset = false;

				this.noActivecourse(function(data){

					var templateHtml = $('#template-course-notActivated-list').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						'data' : data
					});
					$('body .course-content').html(addHtml);

					
					// CAICUI.render.$this.$el.html(CAICUI.render.$this.template({
					// 	'data' : data
					// }));
					// $('.current-progress').each(function(){
					// 	var that = $(this);
					// 	var progress = parseInt(that.attr('data-progress'));
					// 	if(progress){
					// 		that.addClass('active');
					// 		that.animate({
					// 			width: progress
					// 		},1000);
					// 	}
					// });
					window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');

				});
				return this;
			},
			noActivecourse : function(callback){
				CAICUI.Request.ajax({
					'server' : 'noActivecourse',
					'data' : {
						'token' : CAICUI.User.token,
						'pageNo' : 0,
						'pageSize' : CAICUI.defaultPageSize
					},
					done : function(data){
						if(CAICUI.render.$this && CAICUI.render.$this.filterNoActivecourse){
							var courseList = CAICUI.render.$this.filterNoActivecourse(data.data.courselist);
							CAICUI.render.courseNotActivatedList = courseList;
							callback({
								"courseListNav" : courseList.courseListNav,
								"courseLists" : courseList.courseLists
							});
						}
						
						//CAICUI.render.$this.$learningcourse = data.data.courselist;




					},
					fail : function(data){
						callback({
							"courseListNav" : {},
							"courseLists" : {}
						});
					}
				})
			},
			filterNoActivecourse : function(courselist){
				var stooges = courselist;
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
											if(element.shopCategoryExtendName){
												ele.shopCategoryExtendName = element.shopCategoryExtendName;
											}
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
					courseListNav : courseListNav,
					courseLists : courseLists
				}
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
			subjectClick : function(e) {
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
			courseActive: function(data) {
				CAICUI.Request.ajax({
					'server' : 'active',
					'data' : {
						'token' : data.token,
						'courseId' : data.courseId,
						'isU' : data.isU,
						'orderItemId' : data.orderItemId,
						'examTime' : data.examTime
					},
					done : function(data){
						if (data.state == 'success') {
							$('.layui-layer-shade').remove();
							window.location.hash = "#courseStudy/" + CAICUI.render.courseId
						} else {
							layer.msg('Sorry~ 课程激活失败！', function() {
								$('body .courseActivation-btn-action').removeClass('hidden');
								$('body .js-course-activationing').addClass('hidden');
								
							});
						}
					},
					fail : function(data){
						layer.msg('Sorry~ 课程激活失败！', function() {
							$('body .courseActivation-btn-action').removeClass('hidden');
							$('body .js-course-activationing').addClass('hidden');
						});
					}
				});
			},
			wileyCourseActive: function(data) {
				CAICUI.Request.ajax({
					'server' : 'wileyCourseActive',
					'data' : data,
					done : function(data){
						if (data.state == 'success') {
							$('.layui-layer-shade').remove();
							window.location.hash = "#courseStudyIn"
						} else {
							console.log('wileyCourseActive:'+data)
							layer.msg('Sorry~ 课程激活失败！', function() {
								$('body .courseActivation-btn-action').removeClass('hidden');
								$('body .js-course-activationing').addClass('hidden');
							});
						}
					},
					fail : function(data){
						layer.msg('Sorry~ 课程激活失败！', function() {
							$('body .courseActivation-btn-action').removeClass('hidden');
							$('body .js-course-activationing').addClass('hidden');
						});
					}
				});
			},
			acivated : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.courseGroupId = that.attr('data-coursegroupid');
				CAICUI.render.orderItemId = that.attr('data-orderitemid');
				CAICUI.render.categoryName = that.attr('data-categoryname');
				CAICUI.render.subjectID = that.attr('data-subjectid');
				CAICUI.render.subjectName = that.attr('data-subjectName');
				CAICUI.render.courseId = that.attr('data-courseid');
				CAICUI.render.courseName = that.attr('data-coursename');
				CAICUI.render.effectiveDay = that.attr('data-effectiveday');
				CAICUI.render.actimode = that.attr('data-actimode');
				CAICUI.render.isU = "true";//that.attr('data-isu');


				CAICUI.render.title = that.attr('data-title');
				CAICUI.render.expirationDate = that.attr('data-expirationDate');
				CAICUI.render.courseSource = that.attr('data-courseSource');

				CAICUI.render.isCoursePlan = false;
				CAICUI.render.isCourseModel = false;
				if(CAICUI.render.categoryName == "ACCA" || CAICUI.render.categoryName == "财经词典"){
					
					var activationCourseIdList = [];
					_.each(CAICUI.render.courseNotActivatedList.courseLists,function(element, index){
						if(element.categoryName == CAICUI.render.categoryName){
							_.each(element.newList,function(newListElement, newListIndex){
								if(newListElement.subjectName == CAICUI.render.subjectName){
									_.each(newListElement.list,function(listElement, listIndex){
										activationCourseIdList.push(listElement.courseId)
									})
								}
							})
						}
					})

					CAICUI.render.$this.getplanAjax(CAICUI.render.courseId,function(planData){
					// CAICUI.render.$this.getplanAjax(activationCourseIdList.toString(),function(planData){	
						if(planData.state == "success"){
							if(planData.data && planData.data.length){
								CAICUI.render.isCoursePlan = true;
							}else{
								
							}
						}else{

						}
						CAICUI.render.$this.isCourseDetail();
					});
					return false;
				}
				CAICUI.render.$this.acivatedLayer();
			},
			isCourseDetail : function(){
				CAICUI.Request.ajax({
					'server' : 'coursesBaseInfo',//'courseDetail','coursesBaseInfo',
					'data' : {
						'courseId' : CAICUI.render.courseId,//'8a22ecb55e755132015e8361703400c6'//CAICUI.render.courseId
					},
					done : function(data){
						
						if(data.state == "success"){

							if(data.data && data.data[0].courseModel){
								var courseModel = JSON.parse(data.data[0].courseModel);
								if(courseModel && courseModel.length){
									CAICUI.render.isCourseModel = true;
									CAICUI.render.activationCourse = new activationCourse();
									$('body #right').append(CAICUI.render.activationCourse.render({
										"coursesBaseInfo" : data.data[0],
										"isActivationCourse" : true
									}).el);
									$('body .course-activation-acca-content').find('img').each(function(item){
										var src = $(this).attr('src');
										var srcSubstr = src.substr(-3);
										if(srcSubstr == "jpg" || srcSubstr == "png" || srcSubstr == "gif" || srcSubstr == "svg"){
											src = window.static+src;
										}
										$(this).attr('src',src);
									})
									setTimeout(function(){
										window.CAICUI.myScrollCourseModel = CAICUI.iGlobal.iScroll('body #wrapper-courseModel');
									},50)
									
									window.CAICUI.myScrollActivationAcca = CAICUI.iGlobal.iScroll('body #wrapper-activation-acca');
								}else{
									CAICUI.render.$this.acivatedLayer();
								}
							}else{
								CAICUI.render.$this.acivatedLayer();
							}
						}else{
							CAICUI.render.$this.acivatedLayer();
						}	
					},
					fail : function(data){
						CAICUI.render.$this.acivatedLayer();
					}
				});
			},
			acivatedLayer : function(){
				var templateHtml = $('#template-course-courseActivation').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					'categoryName' : CAICUI.render.categoryName
				});
				$('body').append(addHtml);

				$('body .course-activation-acca-btn').one('click',function(){
					CAICUI.render.$this.selectLearningPlan();
				})
				$('body .courseActivation-close').one('click',function(){
					CAICUI.render.$this.closeAcivated();
				})
				$('body .js-course-activation').one('click',function(){
					CAICUI.render.$this.courseActivation();
				})
				
				CAICUI.render.closeActbut = layer.open({
					type: 1,
					title : false,
					shade: true,
					scrollbar: false,
					closeBtn: 0,
					skin: 'layui-skin layui-courseActivation',
					area: ['588px', '400px'],
					content: $("#courseActivation"),
					success: function() {
						if(CAICUI.render.actimode == '1'){
							$('#courseActivation .courseActivation-notes').removeClass('hidden');
						}else{
							$('#courseActivation .courseActivation-notes').addClass('hidden');
						}
						
						if(!CAICUI.render.isCoursePlan && !CAICUI.render.isCourseModel){
							CAICUI.Request.ajax({
								'server' : 'subjectTimeList',
								'data' : {
									"subjectId": CAICUI.render.subjectID
								},
								done : function(data){
									if (data.data && data.data.length > 0) {
										var selectOptionHtml = '<select  class="courseActivation-select">';
										_.each(data.data, function(item, iteratee) {
											selectOptionHtml += '<option class="courseActivation-option">'+CAICUI.iGlobal.getDate(item.time)+'</option>';
										});
										selectOptionHtml += '</select>';
										$('body #courseActivation .courseActivation-select-time').html(selectOptionHtml)
									}
								}
							});
						}
						
						$('.layui-layer-shade').css('filter', 'alpha(opacity=50)');

						$('#courseActivation .courseActivation-courseName').html('&nbsp;' + CAICUI.render.title);
						$('#courseActivation .courseActivation-subjectName').html('&nbsp;' + CAICUI.render.subjectName);
						$('#courseActivation .courseActivation-effectiveDay').text(CAICUI.render.expirationDate);

						if(CAICUI.render.courseSource == "wiley"){
							if(CAICUI.render.member && !CAICUI.render.memberReset){
								CAICUI.render.$this.popInit();
							}else{
								CAICUI.render.$this.getMember(function(){
									CAICUI.render.memberReset = false;
									CAICUI.render.$this.popInit();
								})
							}
						}else{
						}
					}
				});
			},
			closeAcivated : function(){
				layer.close(CAICUI.render.closeActbut);
				$('body #courseActivation').remove();
			},
			getplanAjax : function(courseId, callback){
				CAICUI.Request.ajax({
					'server' : 'getplan',
					'data' : {
						'token' : CAICUI.User.token,
						'courseCategoryId' : CAICUI.render.subjectID,
						'courseId' : courseId
					},
					done : function(data){
						if(callback){callback(data)};
					},
					fail : function(data){
						
					}
				});
			},
			selectLearningPlan : function(){
				layer.close(CAICUI.render.closeActbut);
				// window.location.hash = '#learningPlan'
				CAICUI.render.learningPlan = new learningPlan();
				$('body #right').append(CAICUI.render.learningPlan.render().el);
				
				window.CAICUI.render.myScrollLearningPlanStep1 = CAICUI.iGlobal.iScroll('body #wrapper-learning-plan-step1');
				window.CAICUI.render.myScrollLearningPlanStep2 = CAICUI.iGlobal.iScroll('body #wrapper-learning-plan-step2');
				window.CAICUI.render.myScrollLearningPlanStep3 = CAICUI.iGlobal.iScroll('body #wrapper-learning-plan-step3');
			},
			courseActivation : function(){
				layer.close(CAICUI.render.closeActbut);
				// if ($('.ca-checkbox label input').is(':checked')) {
						var examTime = $('body .courseActivation-select').val();
						if(examTime == 0){
						   layer.msg('请选择考试时间', function(){});
						   return false;
						}
						if(examTime=='-1'){
							examTime = '';
						}
						$('body .courseActivation-btn-action').addClass('hidden');
						$('body .js-course-activationing').removeClass('hidden');
						if(CAICUI.render.courseSource == "wiley"){
							var data = {
								token: CAICUI.User.token,
								courseId: CAICUI.render.courseId,
								examTime: examTime,
								isU: CAICUI.render.isU,
								orderItemId: CAICUI.render.orderItemId,
								address : '',
								mobile : '',
								courseSource : 'wiley',
							};
							this.wileyCourseActive(data);
						}else{
							var data = {
								token: CAICUI.User.token,
								courseId: CAICUI.render.courseId,
								isU: CAICUI.render.isU,
								orderItemId: CAICUI.render.orderItemId,
								examTime: examTime
							};
							this.courseActive(data);
						}
						
					// } else {
					// 	layer.msg('请确认激活', function() {});
					// }
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
						layer.msg('Sorry~ 课程激活失败！', function() {
						});
					}
				});
			},
			popInit : function(){
				
				// CAICUI.render.member.email = '';
				var emailState = "" 
				if(!CAICUI.render.member.email){
					emailState = "邮箱为空";
				}else if(CAICUI.iGlobal.isChineseChar(CAICUI.render.member.email)){
					emailState = "邮箱里面有中文";
				}
				if(emailState){
					
					$('.courseIntro-email').css('opacity',1);
					$('.js-course-activation').removeClass('js-course-activation');
					$('.courseIntro-email-info').text(emailState);
					$('.courseIntro-btn').removeClass('courseIntro-default').addClass('courseIntro-disabled');

				}else{

				}
			},
			courseIntroNextShow : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				if(that.hasClass('active')){
					that.removeClass('active');
				}else{
					that.addClass('active');
				}
			},
			courseIntroClose : function(){
				layer.close(CAICUI.render.closeIntro);
			},
			courseIntroEmail : function(){
				CAICUI.render.memberReset = true;
				layer.close(CAICUI.render.closeIntro);
			},
			lockingTipsPop : function(){
				layer.open({
				  title: '分期付款未完成'
				  ,content: '缴费后即可解锁，缴费后若课程依然锁定联系分部老师解锁即可。'
				});   
			}
		});
		return Studycenter;
	});