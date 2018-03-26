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
				'click .teachingPlan-a' : 'changeClassCourse',
				// "mouseenter .classCourse-a" : "showClassCourseWeekInfo",
				// "mouseleave .classCourse-a" : "hiddenClassCourseWeekInfo",
				// 'click .classCourse-a' : 'viewClassCourseWeekInfo'
			},
			render : function(courseStatus){

				CAICUI.render.$this = this;
				CAICUI.render.courseStatus = courseStatus;
				// 班级课程nav
				CAICUI.render.$this.classCourseListAjax(function(data){
					if(data.classCourseList.beoverdue && data.classCourseList.beoverdue.length){
						CAICUI.render.classCourseList = data.classCourseList.beoverdue;
						
						// 班级课程nav
						var templateHtml = $('#template-classCourse-studyIn').html();
						var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
							"classCourseList" : CAICUI.render.classCourseList
						});
						CAICUI.render.$this.$el.append(addHtml);

						CAICUI.render.$this.classCourseDetailDom(0);
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
			classCourseDetailAjax : function(index,callback){
				CAICUI.Request.ajax({
					'server' : 'node-classCourseDetail',
					'data' : {
						'token' : CAICUI.nodeToken,
						'memberId' : CAICUI.nodeMemberId,
						'courseId' : CAICUI.render.classCourseList[index].courseId
					},
					done : function(data){
						if(callback){
							callback(data);
						}
					}
				});
			},
			classCourseDetailDom : function(index){
				CAICUI.render.$this.classCourseDetailAjax(index,function(data){
					var templateHtml = $('#template-classCourse-studyIn-body').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						"data" : data,
						"classCourse" : CAICUI.render.classCourseList[index],
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
			changeClassCourse : function(e){
				CAICUI.iGlobal.loading('body .classCourse-body');
				var that = CAICUI.iGlobal.getThat(e);
				var index = that.index();
				that.siblings().removeClass('active');
				that.addClass('active');
				var courseId = CAICUI.render.classCourseList[index].courseId;
				CAICUI.render.$this.classCourseDetailDom(index);
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