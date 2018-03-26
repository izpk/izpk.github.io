;define([
	'jquery',
	'underscore',
	'backbone',
	'views/courseDetail'
	],function($, _, Backbone, courseDetail){
		'use strict';
		var Studycenter = Backbone.View.extend({
			// el : 'body #right',
			tagName : 'div',
			className : 'learning-plan-preview-main',
			template : _.template($('#template-learning-plan-preview').html()),
			events : {
				'click .learning-plan-preview-nav-a' : 'learningPlanPreviewChange',
				'click .js-learning-plan-preview-close' : 'learningPlanPreviewClose'
			},
			type : '',
			render : function(planPreviewList){
				CAICUI.render.thisLearningPreview = this;
				CAICUI.render.planPreviewList = planPreviewList;
				this.$el.html(this.template({
					"plansData" : planPreviewList
				}));
				
				CAICUI.render.previewAjaxTotal = planPreviewList.length;
				CAICUI.render.previewAjaxNum = 0;
				CAICUI.render.previewInterval = '';
				
				CAICUI.render.previewCourseDetailRenderData = [];
				CAICUI.render.previewCourseTasksTotalNum = 0;
				CAICUI.render.previewCourseTimeTotalNum = 0;

				for(var i=0;i<planPreviewList.length;i++){
					CAICUI.render.previewCourseDetailRenderData.push({
						'courseId' : planPreviewList[i].courseId,
						'weekList' : '',
						'chapters' : '',
						'isPreview' : true
					})
					this.previewRender(this, i);
				}

				CAICUI.render.previewInterval = setInterval(function(){
					if(CAICUI.render.previewAjaxTotal == CAICUI.render.previewAjaxNum){
						clearInterval(CAICUI.render.previewInterval);
						for(var i=0;i<CAICUI.render.previewCourseDetailRenderData.length;i++){
							CAICUI.render.courseDetail = new courseDetail();
							$('body .learning-plan-preview-item-'+(i+1)).html(CAICUI.render.courseDetail.render(CAICUI.render.previewCourseDetailRenderData[i]).el);
						}
						$('body .learning-plan-preview-courseTimeTotalNum').html(CAICUI.iGlobal.formatSeconds(CAICUI.render.previewCourseTimeTotalNum,'h'));
						$('body .learning-plan-preview-courseTasksTotalNum').html(CAICUI.render.previewCourseTasksTotalNum);
						
						window.CAICUI.myScrollLearningPlanPreview = CAICUI.iGlobal.iScroll('body #wrapper-learning-plan-Preview');
					}
				},300)
				return this;
			},
			getPreviewAjax : function(plansData,callback){
				CAICUI.Request.ajax({
					'server' : 'getPreview',
					'data' : {
						'token' : CAICUI.User.token,
						'planIds' : plansData.planId,
						'examinationDate' : CAICUI.iGlobal.getDate(plansData.examinationDate,'-'),
						'activeTime' : CAICUI.iGlobal.getDate(plansData.activeTime,'-'),
					},
					done : function(data){
						if(callback){callback(data.data)};
					},
					fail : function(data){
						
					}
				});
			},
			courseDetailAjax : function(courseId,callback){
				CAICUI.Request.ajax({
					'server' : 'courseDetail',
					'data' : {
						'courseId' : courseId
					},
					done : function(data){
						if(callback){callback(data.data[0].chapters)};						
					},
					fail : function(data){
						
					}
				})
			},
			previewRender : function(that, index){
				// if(index){
					var plansData = CAICUI.render.planPreviewList[index];
					if(CAICUI.render.planPreviewList[index].isRender){
						setTimeout(function(){
							CAICUI.render.courseDetail = new courseDetail();
							$('body .learning-plan-preview-item-'+(index+1)).html(CAICUI.render.courseDetail.render({
								'courseId' : plansData.courseId,
								'weekList' : CAICUI.render.weekListData,
								'chapters' : CAICUI.render.previewCourseDetailData
							}).el);
							window.CAICUI.myScrollLearningPlanPreview = CAICUI.iGlobal.iScroll('body #wrapper-learning-plan-Preview');
						},300)
					}else{
						// CAICUI.render.previewCourseDetailRenderData[index].courseId = plansData.courseId;

						that.getPreviewAjax(plansData,function(weekListData){
							CAICUI.render.previewCourseDetailRenderData[index].weekList = weekListData;
							that.courseDetailAjax(plansData.courseId,function(courseDetailData){
								CAICUI.render.previewCourseDetailRenderData[index].chapters = courseDetailData;
								CAICUI.render.previewAjaxNum++;
							});
						});
						
					}
				// }else{

				// }
			},
			learningPlanPreviewChange : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var index = that.index();
				that.siblings().removeClass('active');
				that.addClass('active');
				var previewItem = $('body .learning-plan-preview-item');
				previewItem.siblings().removeClass('active');
				previewItem.eq(index).addClass('active');
				// this.previewRender(CAICUI.render.learningPlanPreview, index);
				window.CAICUI.myScrollLearningPlanPreview.refresh();
			},
			learningPlanPreviewClose : function(){
				CAICUI.render.planPreviewList = []
				if(CAICUI.render.learningPlanPreview){
					CAICUI.render.learningPlanPreview.remove();
				}else{
					$('body .learning-plan-preview-main').remove();
				}
				
			}
		});
		return Studycenter;
	});