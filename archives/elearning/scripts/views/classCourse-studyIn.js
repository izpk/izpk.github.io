;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'div',
			className : 'classCourse',
			template : _.template($('#template-classCourse-studyIn').html()),
			events : {
				'click .teachingPlan-a' : 'changeClass',
				'click .teachingPlan-course-a' : 'changeClassCourse'
				// "mouseenter .classCourse-a" : "showClassCourseWeekInfo",
				// "mouseleave .classCourse-a" : "hiddenClassCourseWeekInfo",
				// 'click .classCourse-a' : 'viewClassCourseWeekInfo'
			},
			render : function(courseStatus){

				CAICUI.render.$this = this;
				CAICUI.render.classIndex = 0;
				CAICUI.render.classCourseIndex = 0;
				CAICUI.render.courseStatus = courseStatus;
				// 班级课程nav
				CAICUI.render.$this.classCourseListAjax(function(data){
					if(data.classCourseList.studyIn && data.classCourseList.studyIn.length){
						CAICUI.render.classCourseList = data.classCourseList.studyIn;
						
						// 班级课程nav
						CAICUI.render.$this.classRender();
						// var templateHtml = $('#template-classCourse-studyIn').html();
						// var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						// 	"classCourseList" : CAICUI.render.classCourseList
						// });
						// CAICUI.render.$this.$el.append(addHtml);

						CAICUI.render.$this.classCourseDetailDom();
					}
				});
				return this;
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
						}
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
					var templateHtml = $('#template-classCourse-studyIn-body').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						"data" : data,
						"classCourse" : CAICUI.render.classCourseList[CAICUI.render.classIndex],
						"courseStatus" : CAICUI.render.courseStatus,
						"isClassCourseStart" : true,
						"isStudycenterIndex" : false
					});
					$('body .classCourse-body').html(addHtml);


					$('body .current-progress').each(function(){
						var that = $(this);
						var progress = parseInt(that.attr('data-progress'));
						if(progress){
							that.addClass('active');
							that.animate({
								width: progress + '%'
							},1000);
						}
					});
					window.CAICUI.myScrollLeft = CAICUI.iGlobal.iScroll('body #wrapper-classCourse-left');
					$('body .classCourse-current-progress').each(function(){
						var that = $(this);
						var progress = parseInt(that.attr('data-progress'));
						if(progress){
							that.addClass('active');
							that.animate({
								width: progress + "%"
							},1000);
						}
					});
					window.CAICUI.myScrollRight = CAICUI.iGlobal.iScroll('body #wrapper-classCourse-right');
				});
			},
			classRender : function(){
				var templateHtml = $('#template-classCourse-studyIn').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					"classIndex" : CAICUI.render.classIndex,
					"classCourseIndex" : CAICUI.render.classCourseIndex,
					"classCourseList" : CAICUI.render.classCourseList
				});
				// $('body .index-teachingPlan').html(addHtml);
				CAICUI.render.$this.$el.html(addHtml);
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
			showClassCourseWeekInfo : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var parentLi = that.parents('.classCourse-li');
				parentLi.find('.classCourse-weekInfo').removeClass('hidden')
			},
			hiddenClassCourseWeekInfo : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var parentLi = that.parents('.classCourse-li');
				parentLi.find('.classCourse-weekInfo').addClass('hidden')
			}
		});
		return Studycenter;
	});