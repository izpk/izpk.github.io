;define([
	'jquery',
	'underscore',
	'backbone',
	'views/learningPlan',
	'jqueryBase64',
	],function($, _, Backbone, learningPlan ){
		'use strict';
		var Studycenter = Backbone.View.extend({
			// el : 'body #right',
			tagName : 'div',
			className : 'activationCourse-main',
			template : _.template($('#template-activation-course').html()),
			events : {
				// 'click .course-activation-acca-btn' : 'selectLearningPlan',
				'click .js-course-activation-acca-close' : 'courseActivationAccaClose',
				'click .course-activation-acca-li' : 'changeCourseModel',
				'click .learning-plan-activation' : 'learningPlanActivation',
				'click .learningPlan-apply-editor-confirm' : 'learningPlanApplyEditorConfirm'
			},
			render : function(data){
				this.$el.html(this.template(data));
				$('body .course-activation-acca-btn').one('click',function(){
					CAICUI.render.$this.selectLearningPlan();
				});
				if(data.isActivationCourse){
					this.subjectTimeListAjax(function(timeListData){
						var learningPlanActivationBtn = $('body .learning-plan-activation');
						// if(CAICUI.render.learningPlanList.length && timeListData.length){
						if(timeListData.length){

							var templateHtml = $('#template-learning-plan-examTime').html();
							var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
								"timeList" : timeListData
							});
							
							$('body .learning-plan-examTime-input').html(addHtml);
							$('body .learning-plan-examTime-input').find('option').eq(0).attr("selected",true);
							
							CAICUI.render.courseExamTime = timeListData[0].time;
							learningPlanActivationBtn.addClass('active');
						}else{
							learningPlanActivationBtn.removeClass('active');
						}
					});
				}
				return this;
			},
			subjectTimeListAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'subjectTimeList',
					'data' : {
						'subjectId' : CAICUI.render.subjectID
					},
					done : function(data){
						if(callback){
							callback(data.data);
						}
					},
					fail : function(data){
						
					}
				});
			},
			selectLearningPlan : function(){
				// window.location.hash = '#learningPlan'
				CAICUI.render.learningPlan = new learningPlan();
				$('body #right').append(CAICUI.render.learningPlan.render().el);
				
				window.CAICUI.render.myScrollLearningPlanStep1 = CAICUI.iGlobal.iScroll('body #wrapper-learning-plan-step1');
				window.CAICUI.render.myScrollLearningPlanStep2 = CAICUI.iGlobal.iScroll('body #wrapper-learning-plan-step2');
				window.CAICUI.render.myScrollLearningPlanStep3 = CAICUI.iGlobal.iScroll('body #wrapper-learning-plan-step3');
			},
			courseActivationAccaClose : function(){
				if(CAICUI.render.activationCourse){
					CAICUI.render.activationCourse.remove();
				}else{
					$('body .activationCourse-main').remove();
				}
			},
			changeCourseModel : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				if(!that.hasClass('active')){
					var thatIndex = that.index();
					that.siblings().removeClass('active');
					that.addClass('active');
					$('body .course-activation-acca-content-li').removeClass('active');
					$('body .course-activation-acca-content-li').eq(thatIndex).addClass('active');
					window.CAICUI.myScrollCourseModel.refresh();
				}
				

			},
			learningPlanActivation : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				if(that.hasClass('active')){
					$('body .learning-plan-activation').addClass('hidden');
					$('body .learning-plan-activationing').removeClass('hidden');
					this.courseActive();
				}
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
							window.location.hash = "#courseStudy/" + CAICUI.render.courseId;
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
			learningPlanApplyEditorConfirm : function(){
				$('body .course-baseInfo').remove();
				$('body .courseIndex-baseInfo-btn').removeClass('hidden');
				CAICUI.Request.ajax({
					'server' : 'saveExtension',
					'data' : {
						'token' : CAICUI.User.token,
						'courseCategoryId' : CAICUI.render.courseDetail.subjectId,
						'courseId' : CAICUI.render.courseId
					},
					done : function(data){
						layer.msg('申请成功~', {icon: 1}); 
					},
					fail : function(data){
						layer.msg('Sorry~申请失败');
					}
				});
			}
		});
		return Studycenter;
	});