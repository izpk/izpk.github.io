;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-studyReport').html()),
			events : {
				'click .studyReportWeek' : 'changeWeek',
				'click .studyReportType' : 'changeType',
				'click .studyReport-content-all' : 'openBox',
				'click .js-studyReport-menu-li' : 'changeClass',
				'click .teachingPlan-course-a' : 'changeClassCourse'
			},
			render : function(){
				CAICUI.render.thisStudyReport = this;
				CAICUI.render.classIndex = 0;
				CAICUI.render.classCourseIndex = 0;
				this.$el.html(this.template());
				CAICUI.render.thisStudyReport.classCourseListAjax(function(data){
					if(data.classCourseList.studyIn && data.classCourseList.studyIn.length){
						CAICUI.render.classCourseList = data.classCourseList.studyIn;
						CAICUI.render.thisStudyReport.classRender()
					}
				})
				// window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
				
				
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
			classRender : function(){
				var templateHtml = $('#template-studyReport-class-nav').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					"classIndex" : CAICUI.render.classIndex,
					"classCourseIndex" : CAICUI.render.classCourseIndex,
					"classCourseList" : CAICUI.render.classCourseList
				});
				$('body .studyReport-menu').html(addHtml);

				var templateHtml = $('#template-studyReport-course-nav').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					"classIndex" : CAICUI.render.classIndex,
					"classCourseIndex" : CAICUI.render.classCourseIndex,
					"classCourseList" : CAICUI.render.classCourseList
				});
				$('body .teachingPlan-course-nav').html(addHtml);
				CAICUI.render.thisStudyReport.classCourseDetailDom();
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
			classCourseDetailDom : function(){
				CAICUI.render.thisStudyReport.classCourseDetailAjax(function(data){
					CAICUI.render.classCourseDetail = data;
					// 班级课程info
					var weekIngInfo = data.planInfo[parseInt(data.weekIngNum)];
					console.log(weekIngInfo)
					var templateHtml = $('#template-studyReport-main').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml);
					$('body .studyReport-content-main').html(addHtml);

					var templateHtml = $('#template-studyReport-content-left').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						"data" : data,
						"classCourseId" : data.courseInfo.courseId,
						"weekIngInfo" : weekIngInfo,
						"isClassCourseStart" : true,
						"isStudycenterIndex" : true
					});
					$('body .studyReport-content-left').html(addHtml);
					window.CAICUI.myScrollWeekNav = CAICUI.iGlobal.iScroll('body #wrapper-week-nav');

					var templateHtml = $('#template-studyReport-content-right').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						"data" : data,
						"classCourseId" : data.courseInfo.courseId,
						"weekIngInfo" : weekIngInfo,
						"isClassCourseStart" : true,
						"isStudycenterIndex" : true
					});
					$('body .studyReport-content-right').html(addHtml);
					window.CAICUI.myScrollWeekContent = CAICUI.iGlobal.iScroll('body #wrapper-week-content');
				});
			},
			changeWeek : function(e){

				var that = CAICUI.iGlobal.getThat(e);
				var index = that.index();
				that.addClass("active").siblings().removeClass("active");

				var weekIngInfo = CAICUI.render.classCourseDetail.planInfo[index];
				console.log(weekIngInfo)
				var templateHtml = $('#template-studyReport-content-right').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					"data" : CAICUI.render.classCourseDetail,
					"classCourseId" : CAICUI.render.classCourseDetail.courseInfo.courseId,
					"weekIngInfo" : weekIngInfo,
					"isClassCourseStart" : true,
					"isStudycenterIndex" : true
				});
				$('body .studyReport-content-right').html(addHtml);
				window.CAICUI.myScrollWeekContent = CAICUI.iGlobal.iScroll('body #wrapper-week-content');
			},
			changeType : function(e){
				var current = e.currentTarget;
				var oType = $(current);
				var index = oType.index();
				oType.addClass("active").siblings().removeClass("active");
				$('body .studyReport-type').eq(index).addClass("active").siblings().removeClass("active");
				window.CAICUI.myScrollWeekContent.refresh();
			},
			openBox : function(e){
				var html = $('#template-studyReport-all').html();
				var addHtml = CAICUI.iGlobal.getTemplate(html);
				$('body').append(addHtml);
				window.CAICUI.myScroll2 = CAICUI.iGlobal.iScroll('body #wrapper2');
				$("body .box-close").on("click",function(){
					$('body .studyReport-all').remove();
				})
			},
			
		});
		return Studycenter;
	});