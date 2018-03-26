;define([
	'jquery',
	'underscore',
	'backbone',
	'views/learningPlanPreview',
	'datetimepicker',
	'datetimepickerZHCN'
	],function($, _, Backbone, learningPlanPreview, datetimepicker, datetimepickerZHCN){
		'use strict';
		var Studycenter = Backbone.View.extend({
			// el : 'body #right',
			tagName : 'div',
			className : 'learning-plan-main',
			template : _.template($('#template-learning-plan').html()),
			events : {
				'click .learning-plan-select-checkbox' : 'selectCourseItem',
				'click .learning-plan-course-li' : 'changeCycle',
				'click .learning-plan-preview-open' : 'learningPlanPreviewOpen',
				'click .learning-plan-activation' : 'learningPlanActivation',
				'click .js-learning-plan-close' : 'learningPlanClose',
				'change .learning-plan-examTime-input' : 'changeCourseExamTime'
			},
			type : '',
			render : function(data){

				CAICUI.render.thisLearningPlan = this;
				CAICUI.render.weekToSecond = 7*24*60*60*1000;
				CAICUI.render.learningPlanTimeTotal = 0;
				CAICUI.render.learningPlanList = [];
				CAICUI.render.learningPlanExamTime = [];
				CAICUI.render.courseExamTime = '';


				this.$el.html(this.template());
				
				CAICUI.render.thisLearningPlan.subjectTimeListAjax(CAICUI.render.subjectID,function(timeListData){
					// console.log(timeListData)
					CAICUI.render.learningPlanExamTime = timeListData;
					CAICUI.render.thisLearningPlan.computedWeek();
				})

				//CAICUI.render.subjectID
				//CAICUI.render.courseId
				CAICUI.render.thisLearningPlan.courselistAjax(function(courselistData){
					console.log(courselistData)
					CAICUI.render.learningPlanCourseItem = courselistData.length;

					var templateHtml = $('#template-learning-plan-step1-main').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						"courselist" : courselistData
					});
					$('body .learning-plan-step1-main').html(addHtml);
					CAICUI.render.myScrollLearningPlanStep1.refresh();
					CAICUI.render.planList = [];
					CAICUI.render.hasPlanList = false;
					CAICUI.render.planListAjaxTotal = courselistData.length;
					CAICUI.render.planListAjaxNum = 0;
					CAICUI.render.planListInterval = '';

					_.each(courselistData,function(element,index){
						CAICUI.render.planList.push({
							'title' : element.title,
							'courseId' : element.id,
							'planList' : []
						})
						CAICUI.render.thisLearningPlan.getplanAjax(element.id,function(getplanData){
							if(getplanData && getplanData.length){
								CAICUI.render.hasPlanList = true;
							}
							CAICUI.render.planList[index].planList = getplanData;
							
							CAICUI.render.planListAjaxNum++;
							// CAICUI.render.planList.push({
							// 	'title' : courselistData[index].title,
							// 	'planList' : getplanData
							// })
						});

						// CAICUI.render.thisLearningPlan.timeListAjax(courselistData[index].id,function(data){
						// 	console.log(data)
						// })
					})

					CAICUI.render.planListInterval = setInterval(function(){
						if(CAICUI.render.planListAjaxNum == CAICUI.render.planListAjaxTotal){
							clearInterval(CAICUI.render.planListInterval);


							var templateHtml = $('#template-learning-plan-step2-main').html();
							var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
								"hasPlanList" : CAICUI.render.hasPlanList,
								"planList" : CAICUI.render.planList
							});
							$('body .learning-plan-step2-main').html(addHtml);
							CAICUI.render.myScrollLearningPlanStep2.refresh();
							CAICUI.render.thisLearningPlan.computedWeek();
										$('body .learning-plan-startTime-input').datetimepicker({
							        language:  'zh-CN',
							        // startDate : new Date(),
							        weekStart: 1,
							        todayBtn:  1,
											autoclose: 1,
											todayHighlight: 1,
											startView: 2,
											minView: 2,
											forceParse: 0
									  }).on('changeDate', function(ev){
									  	var time = ev.date.valueOf();
									  	CAICUI.render.learningPlanActiveTimePicker = time;
									  	CAICUI.render.thisLearningPlan.computedWeek(time);
									  	// console.log(date-start-display.valueOf())
									    // if (ev.date.valueOf() < date-start-display.valueOf()){
									      
									    // }
										});

							
						}else{

						}
					},300)
					
				});

				return this;
			},
			courselistAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'courselist',
					'data' : {
						'courseGroupId' : CAICUI.render.courseGroupId,
						'courseCategoryId' : CAICUI.render.subjectID
					},
					done : function(data){
						if(data.data && data.data.length){
							if(callback){callback(data.data)};
						}
					}
				});
			},
			getplanAjax : function(courseId,callback){
				CAICUI.Request.ajax({
					'server' : 'getplan',
					'data' : {
						'token' : CAICUI.User.token,
						'courseCategoryId' : CAICUI.render.subjectID,
						'courseId' : courseId
					},
					done : function(data){
						if(callback){callback(data.data)};
					},
					fail : function(data){
						
					}
				});
			},
			timeListAjax : function(courseId, callback){
				CAICUI.Request.ajax({
					'server' : 'timeList',
					'data' : {
						'courseId' : courseId
					},
					done : function(data){
						
						if(callback){callback(data.data)};
					},
					fail : function(data){
						
					}
				});
			},
			subjectTimeListAjax : function(subjectId,callback){
				if(CAICUI.render.planListInterval){
					clearInterval(CAICUI.render.planListInterval);
				}
				
				CAICUI.Request.ajax({
					'server' : 'subjectTimeList',
					'data' : {
						'subjectId' : subjectId
					},
					done : function(data){
						if(callback){callback(data.data)};
					},
					fail : function(data){
						
					}
				});
			},
			saveplanAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'saveplan',
					'data' : {
						'token' : CAICUI.User.token,
						'courseCategoryId' : CAICUI.render.subjectID,
						'orderItemId' : CAICUI.render.orderItemId,
						'planIds' : CAICUI.render.planIds.toString(),
						'examinationDate' : CAICUI.iGlobal.getDate(CAICUI.render.learningPlanList[0].examinationDate,'-'),
						'activeTime' : CAICUI.iGlobal.getDate(CAICUI.render.learningPlanActiveTime,'-')
					},
					done : function(data){
						
						if(callback){callback(data.data)};
					},
					fail : function(data){
						
					}
				});
			},
			courseActive: function(data) {
				CAICUI.Request.ajax({
					'server' : 'active',
					'data' : {
						'token' : CAICUI.User.token,
						'courseId' : CAICUI.render.courseId,
						'isU' : CAICUI.render.isU,
						'orderItemId' : CAICUI.render.orderItemId,
						'examTime' : CAICUI.iGlobal.getDate(CAICUI.render.courseExamTime,'-')
					},
					done : function(data){
						if (data.state == 'success') {
							window.location.hash = "#courseStudy/" + CAICUI.render.courseId
						} else {
							layer.msg('Sorry~ 课程激活失败！', function() {
								$('body .learning-plan-activation').removeClass('hidden');
								$('body .learning-plan-activationing').addClass('hidden');
							});
						}
					},
					fail : function(data){
						layer.msg('Sorry~ 课程激活失败！', function() {
								$('body .learning-plan-activation').removeClass('hidden');
								$('body .learning-plan-activationing').addClass('hidden');
							});
					}
				});
			},
			memberGetplanAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'memberGetplan',
					'data' : {
						'token' : CAICUI.User.token,
						'courseCategoryId' : CAICUI.render.subjectID,
						'courseId' : CAICUI.render.learningPlanList[0].courseId
					},
					done : function(data){
						
						if(callback){callback(data.data)};
					},
					fail : function(data){
						
					}
				});
			},
			selectCourseItem : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var index = that.index();
				if(that.hasClass('active')){
					CAICUI.render.learningPlanCourseItem--;
					that.removeClass('active');
					$('body .learning-plan-course-item').eq(index).removeClass('active');
				}else{
					CAICUI.render.learningPlanCourseItem++;
					that.addClass('active');
					$('body .learning-plan-course-item').eq(index).addClass('active');
				}
				
				this.computedWeek();
			},
			computedWeek : function(time){
				CAICUI.render.learningPlanList = [];
				var learningPlanTime = [];
				var startTime = 0;
				if(CAICUI.render.learningPlanActiveTimePicker){
					startTime = CAICUI.render.learningPlanActiveTimePicker
				}else{
					startTime = new Date().getTime();
				}
				
				CAICUI.render.learningPlanActiveTime = startTime;
				var courseItem = $('body .learning-plan-course-item');
				courseItem.each(function(){
					var that = $(this);
					if(that.hasClass('active')){
						var courseItemLi = that.find('.learning-plan-course-li');
						var weeksDateTime = '';
						courseItemLi.each(function(){
							var that = $(this);
							var node = that.data('node').split('-');
							var parentPlanList = CAICUI.render.planList[node[0]];
							var planList = parentPlanList.planList[node[1]];
							
							var weeksDate = planList.weeksNum*CAICUI.render.weekToSecond;
							var cycleStart = CAICUI.iGlobal.getDate(startTime);
							var cycleEnd = CAICUI.iGlobal.getDate(startTime+weeksDate);
							learningPlanTime.push({
								"planId" : planList.id,
								"courseId" : parentPlanList.courseId,
								"courseName" : parentPlanList.title,
								"weeksNum" : planList.weeksNum,
								"cycle" : cycleStart+'-'+cycleEnd,
								"cycleStart" : startTime,
								"cycleEnd" : startTime+weeksDate,
								"activeTime" : CAICUI.render.learningPlanActiveTime
							})

							if(that.hasClass('active')){
								weeksDateTime = weeksDate;
								CAICUI.render.learningPlanList.push({
									"planId" : planList.id,
									"courseId" : parentPlanList.courseId,
									"courseName" : parentPlanList.title,
									"weeksNum" : planList.weeksNum,
									"cycle" : cycleStart+'-'+cycleEnd,
									"cycleStart" : startTime,
									"cycleEnd" : startTime+weeksDate,
									"activeTime" : CAICUI.render.learningPlanActiveTime
								})
							}
						});
						startTime += weeksDateTime;
					}
				});
				this.computedWeekRender(learningPlanTime);
			},
			computedWeekRender : function(learningPlanTime){
				if(CAICUI.render.learningPlanList.length && CAICUI.render.hasPlanList){
					// $('body .learning-plan-activation').addClass('active');
					$('body .learning-plan-preview-open').addClass('active');
				}else{
					// $('body .learning-plan-activation').removeClass('active');
					$('body .learning-plan-preview-open').removeClass('active');
				}
				CAICUI.render.myScrollLearningPlanStep2.refresh();


				var learningPlanTimeLast = '';
				_.each(learningPlanTime,function(element, index){
					learningPlanTimeLast = element.cycleEnd;
					$('body .learning-plan-course-time').eq(index).html(element.cycle);
				});
				var timeListData = [];
				_.each(CAICUI.render.learningPlanExamTime,function(element, index){
					if(element.time >= learningPlanTimeLast){
						timeListData.push(element)
					}
				});
				var templateHtml = $('#template-learning-plan-examTime').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					"timeList" : timeListData
				});
				if(timeListData && timeListData.length){
					CAICUI.render.courseExamTime = timeListData[0].time
				}
				
				$('body .learning-plan-examTime-input').html(addHtml);
				$('body .learning-plan-examTime-input').find('option').eq(0).attr("selected",true);
				var weeksTotal = 0;
				CAICUI.render.planIds = [];
				_.each(CAICUI.render.learningPlanList,function(element, index){
					CAICUI.render.planIds.push(element.planId);
					weeksTotal += parseInt(element.weeksNum);
					CAICUI.render.learningPlanList[index].examinationDate = CAICUI.render.courseExamTime;
				})
				CAICUI.render.learningPlanTimeTotal = weeksTotal*7*24;
				$('body .learning-plan-time').html(weeksTotal*7*24);

				var learningPlanActivationBtn = $('body .learning-plan-activation');
				// if(CAICUI.render.learningPlanList.length && timeListData.length){
				if(timeListData.length){
					learningPlanActivationBtn.addClass('active');
				}else{
					learningPlanActivationBtn.removeClass('active');
				}
				

			},
			changeCourseExamTime : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.courseExamTime = that.val();
			},
			changeCycle : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				that.siblings().removeClass('active');
				that.addClass('active');
				this.computedWeek();
			},
			learningPlanPreviewOpen : function(){
				if(CAICUI.render.hasPlanList){
					$('#learning-plan-startTime-input').datetimepicker('hide');
					CAICUI.render.learningPlanPreview = new learningPlanPreview();
					$('body .right').append(CAICUI.render.learningPlanPreview.render(CAICUI.render.learningPlanList).el);
				}
			},
			learningPlanActivation : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				if(that.hasClass('active')){
					$('body .learning-plan-activation').addClass('hidden');
					$('body .learning-plan-activationing').removeClass('hidden');
					if(CAICUI.render.hasPlanList){
						this.saveplanAjax(function(data){
							CAICUI.render.thisLearningPlan.courseActive();
						});
					}else{
						this.courseActive();
					}
					
				}
			},
			learningPlanClose : function(){
				if(CAICUI.render.learningPlan){
					CAICUI.render.learningPlan.remove();
				}else{
					$('body .learning-plan-main').remove();
				}
			}
		});
		return Studycenter;
	});