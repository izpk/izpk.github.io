;define([
	'jquery',
	'underscore',
	'backbone',
	'storage'
	],function($, _, Backbone, storage){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'div',
			className : 'classCourseTree',
			template : _.template($('#template-classCourseTree').html()),
			events : {
				'click .courseDetail-weekList-chapterA' : 'showTaskList',
				'click .js-toTask' : 'openVideo',
				'click .js-classCourse-task' : 'classCourseTask'
			},
			type : '',
			render : function(planData){
				CAICUI.render.thisCourseDetail =　this;
				CAICUI.render.thisCourseDetail.$el.html(CAICUI.render.thisCourseDetail.template({
					"courseId" : CAICUI.render.courseId,
					"classCourseTree" : planData
				}));
				setTimeout(function(){
					// window.CAICUI.myScroller = CAICUI.iGlobal.iScroll('body #wrapper-courseStudy-list');
					if(window.CAICUI.myScrollCourseStudyList){
						window.CAICUI.myScrollCourseStudyList.refresh();
					}else{
						window.CAICUI.myScrollCourseStudyList = CAICUI.iGlobal.iScroll('body #wrapper-courseStudy-list');
					}
					
					// $('body .section-content').on('click',function(){
					// 	var node = $(this).data('node').split('-');
					// 	var nodeData = planData[node[0]].list[node[1]];
					// 	var link = '#video/'+CAICUI.render.courseId+'/'+nodeData.chapterId+'/'+nodeData.tasks[0].taskId+'?return_link=classCourseStudy/' + CAICUI.render.courseId+'&return_hash=on';
					// 	 window.location.hash = link;
					// })
					// $('body .js-task-exam').on('click',function(){
					// 	var link = '#video/8a22cc685c3379ab015c3d51d8f50035/8a22cc685c3379ab015c3d5fcb1d003d/1c77eedfca7d5a6e4b06b13243b4b47f?return_link=classCourseStudy/'+ CAICUI.render.courseId+'&return_hash=on';
						
					// 	window.location.hash = link;
					// })
					$('body .js-task-live').on('click',function(){

					})
				},50)

				return this;
			},
			toTask : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var link = that.attr('link');
				if(link){
					var thatChapterId = that.attr('data-chapterid');
					CAICUI.render.openChapterId = thatChapterId;
					window.location.hash = link;
				}
			},
			openVideo : function(e){
				var courseActiveState = CAICUI.render.courseDetail.courseActiveState;
				var that = CAICUI.iGlobal.getThat(e);
				var thatLink = that.attr('link');
				if(thatLink){
					var thatChapterId = that.attr('data-chapterid');
					var thatTasksLength = that.attr('data-taskslength');
					CAICUI.render.openChapterId = thatChapterId;
					CAICUI.render.openTasksNum = thatTasksLength;
					CAICUI.render.formCourseStudy = true;
					CAICUI.NavVideo = false;
					$('body .course-desc').attr('href',thatLink);
					CAICUI.render.lastLearnChapterName = that.find('.course-list-desc').text();
					CAICUI.render.lastLearnChapterLink = thatLink;
					storage.setsingle('playlist-index'+CAICUI.render.courseId,"c|"+that.attr("data-index"));
			    window.location.hash = thatLink;
				}else{
					if(courseActiveState == 4){
						layer.msg('Sorry~ 您当前的课程已锁定', function() {});
					}else if(courseActiveState == 2){
						layer.msg('Sorry~ 您当前的课程未激活', function() {});
					}else if(courseActiveState == 1){
						layer.msg('Sorry~ 您当前的课程已过期', function() {
						});
					}else if(courseActiveState == 0){
						layer.msg('Sorry~ 您未购买当前的课程', function() {});
					}
				}
		    // course.comfromurl=1;
			},
			classCourseTask : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var chapterId = that.data('chapterid');
				var taskId = that.data('taskid');
				var index = that.data('index');
				var link = '#video/'+CAICUI.render.courseId+'/'+chapterId+'/'+taskId+'?return_link=classCourseStudy/' + CAICUI.render.courseId+'&return_hash=on';
				window.location.hash = link;
			}
		});
		return Studycenter;
	});