;define([
	'jquery',
	'underscore',
	'backbone',
	'storage',
	'views/questions',
	'views/courseDetail',
	'views/activationCourse',
	'views/d3-stack',
	'layer'
	],function($, _, Backbone, storage, questions, courseDetail, activationCourse, d3Stack, layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-course-courseStudy').html()),
			events : {
				// 'mouseleave .courseIndex-ul' : 'courseNavUlLeave',
				// 'mouseenter .courseIndex-li' : 'courseNavLiEnter',
				// 'mouseleave .courseIndex-li' : 'courseNavLiLeave',
				'click .js-course-list-link' : 'openVideo',
				'click .js-course-questions' : 'openQuestions',
				'click .course-list-title-a' : 'courseNavToggle',
				'click .js-course-study-change' : 'courseChange',
				'click .option-a' : 'optionCourse',
				'click .courseVersion-list-a' : 'courseVersionListA',
				'click .courseVersion-show-btn' : 'courseVersionListShow',
				'click .js-handout-down' : 'handoutDown',
				'click .courseUpdate-close' : 'courseUpdateClose',
				'click .courseUpdate-submit' : 'courseUpdateAjax',
				// 'click .courseIndex-baseInfo-btn' : 'openCourseBaseInfo',
				'click .js-apply-editor-learningPlan' : 'applyEditorLearningPlan'
			},
			render : function(courseId){
				
				
				CAICUI.render.$this = this;
				CAICUI.render.thisCourseIndex = this;
				this.courseNavPreDefault = 0;
				this.courseNavPre = 0;
				this.courseNavAnimateTime = 300;
				CAICUI.render.subjectId = '';
				CAICUI.render.subjectName = '';
				CAICUI.render.categoryId = '';
				CAICUI.render.categoryName = '';
				CAICUI.render.courseId = courseId;
				CAICUI.render.courseName = '';
				// CAICUI.render.courseNameArray = [];
				CAICUI.render.chapterId = '';
				CAICUI.render.chapterName = '';
				CAICUI.render.isCoursePay = false;
				CAICUI.render.questions = questions;
				
				// CAICUI.render.courseDetail = '';
				CAICUI.render.getTasksProgress = '';
				CAICUI.render.handout = '';
				CAICUI.render.course_info = '';
				CAICUI.render.courseInfoExamTime = '';
				CAICUI.render.courseInfoDueTime = '';
				CAICUI.render.versionId = '';
				CAICUI.render.courseInfo = '';
				// CAICUI.render.learningcourseData = '';
				CAICUI.render.courseVersion = '';
				CAICUI.render.courseActiveTime = '';
				CAICUI.render.courseExpirationTime = '';


				CAICUI.render.lastLearnChapter = '';
				CAICUI.render.lastLearnChapterName = '';
				CAICUI.render.lastLearnChapterLink = '';

				CAICUI.render.percentage = 0;

				CAICUI.render.lockStatus = false;


				CAICUI.render.chaptersIdArray = [];
				
				CAICUI.render.handoutDown = '';

				CAICUI.render.exerciseKnowledgeMemberStatus = {};
				CAICUI.render.knowledgepointid = '';
				CAICUI.render.lastExerciseNid = 0;
				CAICUI.render.ExerciseProgress = 0;
				CAICUI.render.ExerciseTotalTime = 0;
				CAICUI.render.cacheKnowledgeLevel1Id = '';
				CAICUI.render.cacheKnowledgeLevel2Id = '';
				CAICUI.render.cacheKnowledgePath = '';
				CAICUI.render.errorNum = 0;
				CAICUI.render.exerciseFilename = '';
				CAICUI.render.questionsIndex = 0;
				CAICUI.render.exerciseCount = 0;
				
				CAICUI.render.weekMaxBeoverdue = 2;
				if(CAICUI.render.taskReturn){
		  		CAICUI.render.openCourse = '';
					CAICUI.render.openCourseVideo = false;
					CAICUI.render.myExamContinue = {};
					CAICUI.render.viewResolution = false;
		    	layer.close(videoController.payInfoDialog);
					if(videoController.playerType == 0){
					}else if(videoController.playerType == 2){
						WINAPI.SetPlayerHide(1);
						WINAPI.SetPlayerPause();
					}else if(videoController.playerType == 3){
						cc_winplayer.SetIframePlayerHide(1);
						var data ={"type":101}; 
						cc_winplayer.sendMessageToIframe(JSON.stringify(data));
					}
		  		$('#studycenter-video').remove();
		  		videoController.removeAnimate();
	  			CAICUI.render.action = "closetask";
	  			videoController.saveProgress();
		  		clearInterval(videoController.slideIntervalstop);
		  		clearInterval(videoController.saveVideoProgressSetinterval);
				}
							
				if(CAICUI.isNoneRender){

				}else{
					CAICUI.render.courseDetailRenderData = [];
					CAICUI.render.courseDetailRenderData.courseId = courseId;
					CAICUI.render.$this.$el.html(CAICUI.render.$this.template({
						'data' : {
							'courseId' : CAICUI.render.courseId
						}
					}));
					CAICUI.iGlobal.getTemplateCourseNav('body .courseIndex-header-right',{
						"courseType" : 'course',
						"type" : 'study',
						"courseId" : CAICUI.render.courseId
					});
				}
				
				CAICUI.render.$this.refreshHtml();
				
			},
			refreshHtml : function(){
				
				// CAICUI.render.$this.handoutAjax(function(){
				// 	$('body .icon-handout-down').attr('href', CAICUI.Common.host.img + CAICUI.render.handout.path)
				// });
				/*
				CAICUI.render.$this.actionGetCourseProgress(function(){
					// $('body .course-info-dueTime').html(CAICUI.render.courseInfoDueTime);
					
					$('body .course-progress-show').attr('data-course-progress', CAICUI.render.percentage);
					$('body .course-percentage').html(CAICUI.render.percentage);
					$('body .course-progress-show').animate({
						'width': CAICUI.render.percentage+'%'},
						1000);
				})
				*/
				if(CAICUI.isNoneRender){
					CAICUI.render.$this.getTasksProgressAjax(function(data){
						// if(!CAICUI.render.courseDetail){
						// 	CAICUI.render.courseDetail = storage.get('courseProgress-'+CAICUI.render.courseId)
						// }
						// CAICUI.render.$this.setTasksProgress(CAICUI.render.courseDetail);
						// CAICUI.render.$this.updateTasksProgress();

						CAICUI.render.$this.courseDetailRender();
						/*
						CAICUI.render.$this.changeTasksProgress(data);
						if(CAICUI.render.courseDetailRender){
							CAICUI.render.courseDetailRender.isCourseDetailWeekPlan(CAICUI.render.courseDetailRenderData)
						}
						if(CAICUI.render.courseDetailData.isPlan){
							$('body #d3-stack').empty();
							CAICUI.render.d3StackRender = new d3Stack();
							var stackData = CAICUI.render.d3StackRender.setStackData(CAICUI.render.d3StackRender,CAICUI.render.courseDetailData);
							CAICUI.render.d3StackRender.createD3Stack(stackData);
							$('body #d3-stack').append(CAICUI.render.d3StackRender.render(stackData).el);
							window.CAICUI.myScrollCourseStudyRight = CAICUI.iGlobal.iScroll('body #wrapper-courseStudy-right');
						}
						*/
						if(CAICUI.render.lastLearnChapterName){
							$('.lastLearn').attr('href', CAICUI.render.lastLearnChapterLink);
							$('.continue-learning').attr('href', CAICUI.render.lastLearnChapterLink);
							$('.lastLearn').html(CAICUI.render.lastLearnChapterName);
						}else{
							$('.lastLearn').attr('href', 'javascript:;');
							$('.continue-learning').attr('href', 'javascript:;');
							$('.lastLearn').html('开始学习本课程');
						}
						
					});
					CAICUI.isNoneRender = false;
				}else{
					CAICUI.render.$this.courseInfoAjax(function(){
						$('body .course-info-examTime').html(CAICUI.render.courseInfoExamTime);
					});
					
					CAICUI.render.$this.courseDetailAjax(function(){
						
						

						$('body .course-change').attr('title',CAICUI.render.courseName);
						$('body .course-name').html(CAICUI.render.courseName);

						var templateHtml = $('#template-courseStudy-availability').html();
						var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
							"data" : {
								"availability" : CAICUI.render.courseDetail.availability
							}
						});
						$('body .courseIndex-content-left-box').append(addHtml);

						CAICUI.render.$this.courseActiveStateAjax(function(){
							if(CAICUI.render.courseExpirationTime){
								$('body .course-info-dueTime').html(CAICUI.iGlobal.getDate(CAICUI.render.courseExpirationTime));
							}else{
								$('body .course-info-dueTime').html("-- : --");
							}

							CAICUI.render.$this.getTasksProgressAjax(function(){
								// CAICUI.render.$this.setTasksProgress(CAICUI.render.courseDetail);
								CAICUI.render.$this.memberGetplanAjax(function(weekListData){
									CAICUI.render.courseDetailRenderData.weekList = weekListData;


									var courseModel = JSON.parse(CAICUI.render.courseDetail.courseModel);
									if(courseModel && courseModel.length){
										$('body .courseIndex').append('<a class="courseIndex-baseInfo-btn" href="javascript:;">课程介绍<span class="courseIndex-baseInfo-btn-shadow"></span></a>');
										$('body .courseIndex-baseInfo-btn').on('click',function(){
											// CAICUI.render.$this.openCourseBaseInfo();
											var templateHtml = $('#template-course-baseInfo').html();
											var addHtml = CAICUI.iGlobal.getTemplate(templateHtml);
											$('body #layout').append(addHtml);
											$('body .courseIndex-baseInfo-btn').addClass('hidden');
											$('body .course-baseInfo-closeBtn').on('click',function(){
												$('body .course-baseInfo').remove();
												$('body .courseIndex-baseInfo-btn').removeClass('hidden');
											})
											CAICUI.render.activationCourse = new activationCourse();
											$('body .course-baseInfo-content').append(CAICUI.render.activationCourse.render({
												"coursesBaseInfo" : CAICUI.render.courseDetail,
												"isActivationCourse" : false,
												"isPlan" : CAICUI.render.courseDetailRenderData.weekList
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
										})
									}


									CAICUI.render.$this.courseDetailRender();
									/*
										CAICUI.render.courseDetailRender = new courseDetail();
										$('body #scroller-courseStudy-list').html(CAICUI.render.courseDetailRender.render(CAICUI.render.courseDetailRenderData).el);

										window.CAICUI.myScrollCourseStudyList = CAICUI.iGlobal.iScroll('body #wrapper-courseStudy-list');

										// tasks-info-progress
										if(CAICUI.render.courseDetailData){
											if(CAICUI.render.courseDetailData.isPlan){
												_.each(CAICUI.render.courseDetailData.courseDetailWeekList,function(element, index){
													CAICUI.render.$this.updateplanAjax(element);
												})
											}
											

											$('body .tasks-info-totalNum').html(CAICUI.render.courseDetailData.courseTaskTotal);
											$('body .tasks-info-progress').html(CAICUI.render.courseDetailData.coursePercentage);
											$('body .tasks-info-doneNum').html(CAICUI.render.courseDetailData.courseTaskTotalCompleted);
										}
										
										if(CAICUI.render.courseDetailData.isPlan){
											$('body #d3-stack').empty();
											CAICUI.render.d3StackRender = new d3Stack();
											var stackData = CAICUI.render.d3StackRender.setStackData(CAICUI.render.d3StackRender,CAICUI.render.courseDetailData);
											CAICUI.render.d3StackRender.createD3Stack(stackData);
											$('body #d3-stack').append(CAICUI.render.d3StackRender.render(stackData).el);
										}
									*/
									// $('body #d3-stack').html(CAICUI.render.d3StackRender.render().el);
									if(CAICUI.render.courseDetailData.weekTotalBeoverdue >= CAICUI.render.weekMaxBeoverdue){
										$('body .js-apply-editor-learningPlan').removeClass('hidden');

										$('body .learningPlan-info').removeClass('hidden');
										$('body .learningPlan-info-weekTotalBeoverdue').html(CAICUI.render.courseDetailData.weekTotalBeoverdue)
									}

									window.CAICUI.myScrollCourseStudyRight = CAICUI.iGlobal.iScroll('body #wrapper-courseStudy-right');
									// CAICUI.render.$this.getMaxOverplanAjax(function(maxOverplanData){

									// });
								})
								
								//课程更新提醒
								CAICUI.render.$this.courseUpdate();

								// CAICUI.render.courseIndexTips = setTimeout(function(){
								// 	$('body .courseIndex-content-tips').animate({
								// 		height: 0},
								// 		500, function() {
								// 			$('body .courseIndex-content-tips').remove();
								// 			window.CAICUI.myScroll.refresh();
								// 	});
								// },20000)
								
								if(CAICUI.render.lastLearnChapterName){
									$('.lastLearn').attr('href', CAICUI.render.lastLearnChapterLink);
									$('.continue-learning').attr('href', CAICUI.render.lastLearnChapterLink);
									$('.lastLearn').html(''+CAICUI.render.lastLearnChapterName);
									$('.continue-learning').html('继续学习');
								}else{
									$('.lastLearn').attr('href', 'javascript:;');
									$('.continue-learning').attr('href', 'javascript:;');
									$('.lastLearn').html('开始学习本课程');
								}
								
							});
							
						});
					});
				}
			},
			courseDetailRender : function(){
				CAICUI.render.courseDetailRender = new courseDetail();
				$('body #scroller-courseStudy-list').html(CAICUI.render.courseDetailRender.render(CAICUI.render.courseDetailRenderData).el);

				window.CAICUI.myScrollCourseStudyList = CAICUI.iGlobal.iScroll('body #wrapper-courseStudy-list');

				// tasks-info-progress
				if(CAICUI.render.courseDetailData){
					if(CAICUI.render.courseDetailData.isPlan){
						_.each(CAICUI.render.courseDetailData.courseDetailWeekList,function(element, index){
							if(element.weekIsFinish && element.isFinish){
								
							}else{
								CAICUI.render.$this.updateplanAjax(element);
							}
						})
					}

					$('body .tasks-info-totalNum').html(CAICUI.render.courseDetailData.courseTaskTotal);
					$('body .tasks-info-progress').html(CAICUI.render.courseDetailData.coursePercentage);
					$('body .tasks-info-doneNum').html(CAICUI.render.courseDetailData.courseTaskTotalCompleted);
				}
				
				if(CAICUI.render.courseDetailData.isPlan){
					$('body #d3-stack').empty();
					CAICUI.render.d3StackRender = new d3Stack();
					var stackData = CAICUI.render.d3StackRender.setStackData(CAICUI.render.d3StackRender,CAICUI.render.courseDetailData);
					CAICUI.render.d3StackRender.createD3Stack(stackData);
					$('body #d3-stack').append(CAICUI.render.d3StackRender.render(stackData).el);
				}
			},
			changeTasksProgress : function(data){
				var openChapterArray = [];
				_.each(data, function(element, index){
					if(element.chapterId == CAICUI.render.openChapterId){
						openChapterArray.push(element)
					}
				});
				_.each(openChapterArray,function(element, index){
					var link = '#video/'+ element.courseId +'/'+ element.chapterId +'/'+ element.taskId;
					if(element.progress){
						link += '/'+element.progress
					}
					var percentage = 0;
					if(element.state && element.state == 1){
						percentage = 100;
					}else{
						percentage = CAICUI.iGlobal.getPercentage(element.progress,element.total);
					}
					if(percentage){
						if(percentage==100){
							$('body #courseDetail-weekList-taskA-'+element.taskId).attr('class','js-toTask courseDetail-weekList-taskA task-completed');
							$('body .tasks-info-progress').html(CAICUI.render.courseDetailData.coursePercentage);
							$('body .tasks-info-doneNum').html(CAICUI.render.courseDetailData.courseTaskTotalCompleted);
						}else{
							$('body #courseDetail-weekList-taskA-'+element.taskId).attr('class','js-toTask courseDetail-weekList-taskA task-ongoing');
						}
					}else{
						$('body #courseDetail-weekList-taskA-'+element.taskId).attr('class','js-toTask courseDetail-weekList-taskA task-notstarted');
						
					}
					link += '?return_link=courseStudy/'+ element.courseId +'&return_hash=on';
					$('body #courseDetail-weekList-taskA-'+element.taskId).attr('link',link);
					$('body #task-progressBar-width-'+element.taskId).css('width',percentage+'%');
					$('body #task-progress-number-'+element.taskId).html(percentage+'%');
				})
			},
			updateplanAjax : function(updateplan, callback){
				var learnSum = {
					'weekTaskBeoverdue' : updateplan.weekTaskBeoverdue,
					'weekTaskCompleted' : updateplan.weekTaskCompleted,
					'weekTaskNotstarted' : updateplan.weekTaskNotstarted,
					'weekTaskOngoing' : updateplan.weekTaskOngoing
				}
				CAICUI.Request.ajax({
					'server' : 'updateplan',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : updateplan.planId,
						'taskTime' : updateplan.weekTaskTime,
						'taskSum' : updateplan.tasksNum,
						'learnTime' : updateplan.weekStudyTime,
						'learnSum' : updateplan.weekTaskCompleted,
						'ingSum' : updateplan.weekTaskOngoing,
						'isFinish' : updateplan.weekIsFinish
					},
					done : function(data){
						if(callback){callback()};
					},
					fail : function(data){
					}
				});
			},
			getMaxOverplanAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'getMaxOverplan',
					'data' : {
						'token' : CAICUI.User.token,
						'courseCategoryId' : CAICUI.render.subjectId
					},
					done : function(data){
						if(callback){callback()};
					},
					fail : function(data){
					}
				});
			},

			courseUpdate : function(){
				// var isUpdataShow = $.cookie(CAICUI.User.memberId+CAICUI.render.courseId+'-isUpdataShow');
				// if(isUpdataShow !== 'false'){
					CAICUI.render.$this.searchCourseAlterationsByVersionId();
				// }
			},
			searchCourseAlterationsByVersionId : function(courseGroupId,orderItemId){
				CAICUI.Request.ajax({
					'server' : 'searchCourseAlterationsByVersionId',
					'data' : {
						'versionId' : CAICUI.render.versionId
					},
					done : function(data){
						if(data.data && data.data.length){
							var formatHtml = CAICUI.render.$this.formatCourseUpdate(data.data);
							if(formatHtml){
								CAICUI.render.$this.createcourseUpdate(formatHtml);
							}
						}else{
							// CAICUI.render.$this.courseUpdate();
							// CAICUI.render.$this.createcourseUpdate('');
						}
					},
					fail : function(data){
					}
				});
			},
			createcourseUpdate : function(data){
				var wWidth = $(window).width();
				var width = wWidth*0.618;
				var minWidth = 980*0.618;
				var maxWidth = 1600*0.618;
				if(width < minWidth){
					width = minWidth;
				}else if(width > maxWidth){
					width = maxWidth;
				}

				CAICUI.render.courseUpdate = layer.open({
					type: 1,
					title: false,
					shade: true,
					scrollbar: false,
					area: [width + 'px', 'auto'], //宽高
					closeBtn : 0,
					content: $("#courseUpdate"), // courseIntro  courseUpdate
					success: function() {
						$('body #courseUpdate .courseUpdate-content').html(data);
					}
				});

			},
			formatCourseUpdate : function(data){
				var formatHtml = '';
				var formatTime = 0;
				if(CAICUI.render.courseProgress && CAICUI.render.courseProgress.createDate){
					formatTime = parseInt(CAICUI.render.courseProgress.createDate)
				}else if(CAICUI.render.courseActiveTime){
					formatTime = CAICUI.render.courseActiveTime
				}
				for(var i=0;i<data.length;i++){
					if(formatTime < data[i].createDate){
						formatHtml += data[i].message;
						formatHtml += '<p class="courseUpdate-time">变更时间 '+CAICUI.iGlobal.getDate(data[i].createDate)+'</p>';
					}
				}
				return formatHtml;
			},
			courseUpdateClose : function(){
				layer.close(CAICUI.render.courseUpdate);
				// CAICUI.render.$this.courseUpdate();
			},
			courseUpdateAjax : function(e){
				
				// var that = CAICUI.iGlobal.getThat(e);
				// var checked = document.getElementById('courseUpdate-tips').checked;
				// if(checked){
				// 	$.cookie(CAICUI.User.memberId+CAICUI.render.courseId + '-isUpdataShow', 'false', {
				// 		path: '/',
				// 		expires: 36500
				// 	});
				// }
				layer.close(CAICUI.render.courseUpdate);
				// var state = 0;
				// if(that.hasClass('courseUpdate-default')){
				// 	state = 1;
				// }
				// $('body .courseUpdate').find('.loader-box').removeClass('hidden');
				// CAICUI.Request.ajax({
				// 	'server' : 'membercheck',
				// 	'data' : {
				// 		'courseGroupId' : CAICUI.render.courseGroupId,
				// 		'itemId' : CAICUI.render.orderItemId,
				// 		'state' : state
				// 	},
				// 	done : function(data){
				// 		$('body .courseUpdate').find('.loader-box').addClass('hidden');
				// 		layer.close(CAICUI.render.courseUpdate);
				// 		CAICUI.render.$this.courseUpdate();
				// 	},
				// 	fail : function(data){
				// 		// CAICUI.render.$this.courseUpdate();
				// 	}
				// });
			},
			handoutDown : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var handoutDown = document.getElementById('handoutDown')
				if(CAICUI.render.handoutDown){
					handoutDown.click()
				}else{

						CAICUI.render.$this.handoutAjax(function(){
							if(CAICUI.render.handout && CAICUI.render.handout[0] && CAICUI.render.handout[0].handoutFilePath){
								handoutDown.setAttribute('download','true')
								handoutDown.setAttribute('href',CAICUI.Common.host.img + CAICUI.render.handout[0].handoutFilePath)
								CAICUI.render.handoutDown = CAICUI.Common.host.img + CAICUI.render.handout[0].handoutFilePath;
								handoutDown.click()
								}else{
				    			layer.msg('Sorry~暂无讲义', {time:2000}, function() {});
				    		}
						});
					
				}
			},
			actionGetCourseProgress : function(callback){
				CAICUI.Request.ajax({
					'server' : 'actionGetCourseProgress',
					'data' : {
						'token' : CAICUI.User.token,
						'memberId' : CAICUI.User.memberId,
						'courseId' : CAICUI.render.courseId
					},
					done : function(ret){
						CAICUI.render.courseProgress = ret.data[0];
						if(ret.data[0]){
							CAICUI.render.percentage = ret.data[0].courseProgress;
						}
						

						
							if(callback){callback()};
						}
					
				})
			},
			courseChange : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatClick = that.attr('data-click');
				if(that.hasClass('active')){
					that.removeClass('active');
					$('body .option-ul').removeClass('active');
				}else{
					

					if(CAICUI.render.learningcourseData && CAICUI.render.learningcourseData.length){
						var templateHtml = $('#template-courseStudy-courseList').html();
						var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
							"courseNameArray" : CAICUI.render.courseNameArray
						});
						$('body .course-change-ul').html(addHtml);
						that.addClass('active');
						$('body .option-ul').addClass('active');
					}else{
						if(thatClick != 'true'){
						that.attr('data-click','true');
						CAICUI.render.$this.learningcourseAjax(function(){
							var templateHtml = $('#template-courseStudy-courseList').html();
							var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
								"courseNameArray" : CAICUI.render.courseNameArray
							});
							$('body .course-change-ul').html(addHtml);
							that.addClass('active');
							$('body .option-ul').addClass('active');
							// that.attr('data-click','false');
						});
						}
					}
				}
			},
			learningcourseAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'learningcourse',
					'data' : {
						'token' : CAICUI.User.token,
						'pageNo' : 0,
						'pageSize' : CAICUI.defaultPageSize
					},
					done : function(data){
						if(data.data.courselist && data.data.courselist.length){
							CAICUI.render.learningcourseData = data.data.courselist;
							var learningcourse = data.data.courselist;

							// var courseArr = [];
							CAICUI.render.courseNameArray = []
							for(var i=0;i<learningcourse.length;i++){
								var addCourseNameArray = true;
								if(CAICUI.render.courseNameArray && CAICUI.render.courseNameArray.length){
									for(var j=0;j<CAICUI.render.courseNameArray.length;j++){
										if(CAICUI.render.courseNameArray[j].courseId == learningcourse[i].courseId){
											addCourseNameArray = false;
										}
									}
								}
								if(addCourseNameArray){
									CAICUI.render.courseNameArray.push({
										"courseId" : learningcourse[i].courseId,
										"courseName" : learningcourse[i].courseName
									});
								}
							}
							
							if(callback){callback()};
						}else{
							return false;
						}
						
					},
					fail : function(){
						CAICUI.render.learningcourseData = {};
						CAICUI.CACHE.RecentCourse = {};
					}
				})
			},
			courseDetailAjax : function(callback){
				var isAjax = true;
				// var courseProgress = storage.get('courseProgress-'+CAICUI.render.courseId);
				// if(courseProgress){
				// 	CAICUI.render.courseDetail = courseProgress;
				// 	CAICUI.render.knowledgePointIdTotal = CAICUI.render.courseDetail.knowledgePointId
				// 	CAICUI.render.$this.courseDetailDone(courseProgress,callback);
					
				// }else{
					CAICUI.Request.ajax({
						'server' : 'courseDetail',
						'data' : {
							'courseId' : CAICUI.render.courseId
						},
						done : function(data){

							var courseData = data.data[0];
							CAICUI.render.courseDetailRenderData.chapters = courseData.chapters;
							CAICUI.CACHE.courseDetail = courseData;
							CAICUI.render.courseDetail = courseData;
							CAICUI.render.knowledgePointIdTotal = CAICUI.render.courseDetail.knowledgePointId;
							if(CAICUI.render.$this.courseDetailDone){
								CAICUI.render.$this.courseDetailDone(CAICUI.render.courseDetail,callback);
							}
							
						}
					})
				// }
			},
			courseDetailDone : function(data,callback){
				CAICUI.render.versionId = data.versionId;
				
				CAICUI.render.subjectId = data.subjectId;
				CAICUI.render.subjectName = data.subjectName;
				CAICUI.render.categoryId = data.categoryId;
				CAICUI.render.categoryName = data.categoryName;
				CAICUI.render.courseId = data.courseId;
				CAICUI.render.courseName = data.courseName;
				CAICUI.render.chapterId = data.chapterId;
				CAICUI.render.chapterName = data.chapterName;

				if(callback){
					callback();
				}
			},
			memberGetplanAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'memberGetplan',
					'data' : {
						'token' : CAICUI.User.token,
						'courseCategoryId' : CAICUI.render.courseDetail.subjectId,
						'courseId' : CAICUI.render.courseId
					},
					done : function(data){
						if(callback){callback(data.data)};
					},
					fail : function(data){
						if(callback){callback(data.data)};
					}
				});
			},
			getChaptersIdArray: function(data){
				var chapterNum = data.chapterNum;
				_.each(data.chapters,function(element1,index1){
					CAICUI.render.chaptersIdArray.push(element1.chapterId)
					if(element1.children && element1.children.length){
						_.each(element1.children,function(element2,index2){
							CAICUI.render.chaptersIdArray.push(element2.chapterId)
							if(element2.children && element2.children.length){
								_.each(element2.children,function(element3,index3){
									CAICUI.render.chaptersIdArray.push(element3.chapterId)
								})
							}
						})
					}
				})
				CAICUI.render.chaptersIdArray = CAICUI.render.chaptersIdArray.toString()
			},
			exercisePointCountCacheAjax: function(callback){
				CAICUI.Request.ajax({
					'server' : 'exercisePointCountCache',
					'data' : {
						'knowledge_points' : CAICUI.render.knowledgePointIdTotal,
						'type' : 6
					},
					done : function(data){
						if(callback){callback(data.data)}
					}
				})
			},
			exerciseKnowledgeMemberStatusAjax: function(callback){
				CAICUI.Request.ajax({
					'server' : 'exerciseKnowledgeMemberStatus',
					'data' : {
						'knowledge_points' : CAICUI.render.knowledgePointIdTotal,
						'type' : 4,
						'member_id' : CAICUI.User.memberId
					},
					done : function(data){
						if(callback){
							callback(data.data);
						}
					}
				});
			},
			
			courseActiveStateAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'coursestatus',
					'data' : {
						'token' : CAICUI.User.token,
						'versionId' : CAICUI.render.versionId
					},
					done : function(data){
						if(data.data){
							var lockStatusNum = 0;
							for(var i=0;i<data.data.length;i++){
								if(data.data[i].lockStatus === 0){
									lockStatusNum++;
								}
							}
							if(!lockStatusNum){
								CAICUI.render.lockStatus = true;
							}
						}

						CAICUI.render.coursestatus = data.data;
						CAICUI.render.$this.courseByInFo(data.data);
						
						if(callback){
							callback();
						}
					},
					fail : function(data){
						layer.msg('Sorry~ 获取课程授权信息失败，请刷新页面重试。', function() {});
					}
				});
			},
			courseVersionDataAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'version',
					'data' : {
						'versionId' : CAICUI.render.versionId,
					},
					done : function(data){
						if(data.data && data.data.length){
							CAICUI.render.courseVersion = data.data;
							if(callback){
								callback();
							}
						}else{
							return false;
						}
						
					},
					fail : function(data){
						layer.msg('Sorry~ 网络错误，请刷新页面重试。', function() {});
					}
				});
			},
			getTasksProgressAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'actionGetTasksProgress',
					'data' : {
						'token' : CAICUI.User.token,
						'memberId' : CAICUI.User.memberId,
						'courseId' : CAICUI.render.courseId
					},
					done : function(data){
						
						var chapterProgress = data.data;
						CAICUI.render.courseDetailRenderData.taskProgress = data.data;
						CAICUI.CACHE.getTasksProgress = data.data;
						CAICUI.render.getTasksProgress = data.data;
						if(CAICUI.render.getTasksProgress && CAICUI.render.getTasksProgress.length){
							CAICUI.render.lastLearnChapter =  _.max(CAICUI.render.getTasksProgress,function(stooge){ 
								return stooge.createDate;
							});
							
							var lastLearnLink = '';
							var lastLearnChapterName = '';

							if(CAICUI.render.lastLearnChapter && !CAICUI.render.lastLearnChapterName){
								lastLearnLink = '#video/'+CAICUI.render.courseId+'/'+CAICUI.render.lastLearnChapter.chapterId+'/'+ CAICUI.render.lastLearnChapter.taskId +'/'+ CAICUI.render.lastLearnChapter.progress +'?return_link=courseStudy/'+CAICUI.render.courseId+'&return_hash=on';
								lastLearnChapterName = '上次学到：<span class="lastLearn-chapterName">'+CAICUI.render.lastLearnChapter.chapterName+' </span><i class="icon icon-course-arrow-right"></i>';
							}else{
								if(CAICUI.render.lastLearnChapterLink){
									lastLearnLink = data.lastLearnChapterLink;
								}else{
									if(CAICUI.render.courseDetail.chapters[0].children){
										lastLearnLink = '#video/'+CAICUI.render.courseId+'/'+CAICUI.render.courseDetail.chapters[0].children[0].chapterId+'?return_link=courseStudy/'+CAICUI.render.courseId+'&return_hash=on';
									}else{
										lastLearnLink = '#video/'+CAICUI.render.courseId+'/'+CAICUI.render.courseDetail.chapters[0].chapterId+'?return_link=courseStudy/'+CAICUI.render.courseId+'&return_hash=on';
									}
								}
								if(CAICUI.render.lastLearnChapterName){ 
									lastLearnChapterName = '上次学到：<span class="lastLearn-chapterName">'+CAICUI.render.lastLearnChapterName+' </span><i class="icon icon-course-arrow-right"></i>';
								}else{
									lastLearnChapterName = '<i class="icon icon-course-arrow-right"></i><span class="lastLearn-chapterName">开始学习本课程</span>';
								}
							}

							CAICUI.render.lastLearnChapterLink = lastLearnLink;
							CAICUI.render.lastLearnChapterName = lastLearnChapterName;
						}
						if(callback){
							callback(data.data);
						}
					},
					fail : function(){
						CAICUI.CACHE.getTasksProgress = {};
						CAICUI.render.getTasksProgress = {};
					}
				});
			},
			courseInfoAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'getExamDate',
					'data' : {
						// 'token' : CAICUI.User.token,
						// 'id' : CAICUI.render.courseId,
						'memberId' : CAICUI.User.memberId
					},
					done : function(data){
						var	days = -1;
						if(data.data && data.data.length){
							for(var i=0;i<data.data.length;i++){
								if(CAICUI.render.subjectId == data.data[i].courseCategoryId){
									
								}
								if(CAICUI.render.courseId == data.data[i].id){
									data = data.data[i];
									days = parseInt((new Date().getTime() - data.examinationDate)/(24*60*60*1000));
								}
							}
						}
						

						CAICUI.CACHE.course_info = data.data;
						CAICUI.render.course_info = data.data;

						if(days<0){
			        CAICUI.render.courseInfoExamTime = "本科目考试时间未确定";
			      }else if(days === 0){
			        CAICUI.render.courseInfoExamTime = "请留意,本科目<strong>今天</strong>开始考试";
			      }else{
			        CAICUI.render.courseInfoExamTime = "距本科目考试还有<strong>"+days+"</strong>天";
			      }

						if(callback){
							callback();
						}
					},
					fail : function(data){
						CAICUI.CACHE.course_info = {};
						CAICUI.render.course_info = {};
					}
				});
			},
			handoutAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'handout',
					'data' : {
						'idType' : 0,
						'courseId' : CAICUI.render.courseId
					},
					done : function(data){
						CAICUI.CACHE.handout = data.data;
						CAICUI.render.handout = data.data;
						if(callback){
							callback();
						}
					},
					fail : function(data){
						CAICUI.CACHE.handout = {};
						CAICUI.render.handout = {};
					}
				});
			},

			setTasksProgress : function(newCourseDetail){

				// var courseProgress = storage.get('courseProgress-'+CAICUI.render.courseId);
				// if(courseProgress){
				// 	CAICUI.render.courseDetail = courseProgress
				// }else{
					// newCourseDetail = CAICUI.render.courseDetail;
					var getTasksProgress = CAICUI.render.getTasksProgress;
					_.each(newCourseDetail.chapters,function(element1,index1){
						if(element1.children && element1.children.length){
							_.each(element1.children,function(element2,index2){
								if(element2.children && element2.children.length){
									_.each(element2.children,function(element3,index3){
										if(element3.tasks && element3.tasks.length){
											_.each(element3.tasks,function(element4,index4){
												_.each(CAICUI.CACHE.getTasksProgress,function(element5,index5){
													if(element4.taskId == element5.taskId){
														newCourseDetail.chapters[index1].children[index2].children[index3].tasks[index4].progress = element5.progress;
														newCourseDetail.chapters[index1].children[index2].children[index3].tasks[index4].total = element5.total;
														newCourseDetail.chapters[index1].children[index2].children[index3].tasks[index4].state = element5.state;
													}
												});
											});
										}
									});
								}else if(element2.tasks && element2.tasks.length){
									_.each(element2.tasks,function(element3,index3){
										_.each(CAICUI.CACHE.getTasksProgress,function(element4,index4){
											if(element3.taskId == element4.taskId){
												newCourseDetail.chapters[index1].children[index2].tasks[index3].progress = element4.progress;
												newCourseDetail.chapters[index1].children[index2].tasks[index3].total = element4.total;
												newCourseDetail.chapters[index1].children[index2].tasks[index3].state = element4.state;
											}
										});
									});
								}
							});
						}else{
							if(element1.tasks && element1.tasks.length){
								_.each(element1.tasks,function(element3,index3){
									_.each(CAICUI.CACHE.getTasksProgress,function(element4,index4){
										if(element3.taskId == element4.taskId){
											newCourseDetail.chapters[index1].tasks[index3].progress = element4.progress;
											newCourseDetail.chapters[index1].tasks[index3].total = element4.total;
											newCourseDetail.chapters[index1].tasks[index3].state = element4.state;
										}
									});
								});
							}
						}
					});
					CAICUI.render.courseDetail = newCourseDetail;
					storage.setsingle('courseProgress-' + CAICUI.render.courseId, newCourseDetail);
				// }
			},
			updateTasksProgress : function(){
				var newCourseDetail = CAICUI.render.courseDetail;

				var openChapterArray = [];
				_.each(CAICUI.render.getTasksProgress, function(element, index){
					if(element.chapterId == CAICUI.render.openChapterId){
						openChapterArray.push(element);
					}
				});
				var tasksState = 'no';
				var tasksStateEndNum = 0;
				var tasksStateIngNum = 0;
				var courseListType = 'icon-course-list-default'; 
				if(openChapterArray){
					courseListType = 'icon-course-list-learning';
					if(openChapterArray.length == CAICUI.render.openTasksNum){
						_.each(openChapterArray, function(element, index){
							if(element.state == "1"){
								tasksStateEndNum ++;
							}else if(element.state == "0"){
								tasksStateIngNum ++;
							}
						});
						if(tasksStateEndNum == CAICUI.render.openTasksNum){
							tasksState = 'end';
						}else if(tasksStateIngNum || tasksStateEndNum){
							tasksState = 'ing';
						}
						switch (tasksState){
							case 'no':
								courseListType = 'icon-course-list-default';
								break;
							case 'ing':
								courseListType = 'icon-course-list-learning';
								break;
							case 'end':
								courseListType = 'icon-course-list-completed';
								break;
						}
						$('body #icon-progress-'+CAICUI.render.openChapterId).attr('class','icon icon-left '+courseListType);
					}else{
						$('body #icon-progress-'+CAICUI.render.openChapterId).attr('class','icon icon-left '+courseListType);
					}
				}else{
					$('body #icon-progress-'+CAICUI.render.openChapterId).attr('class','icon icon-left '+courseListType);
				}
				
			},
			courseByInFo : function(courseinfo){
				var courseActiveState=0;//默认未购买
				
				if($.isArray(courseinfo)){
					var courseInfoLength = courseinfo.length;
					for(var j=0;j<courseInfoLength;j++){
						// if(courseinfo[i].courseId == CAICUI.render.courseId && courseinfo[i].activeState!="init"){
						// 	CAICUI.render.courseActiveTime = courseinfo[i].activeTime*1000;
						// 	CAICUI.render.courseExpirationTime = courseinfo[i].expirationTime;
						// }
						if(courseinfo[j].isExpiration == "false" && courseinfo[j].activeState == "acitve"){
							CAICUI.render.courseActiveTime = courseinfo[j].activeTime*1000;
							CAICUI.render.courseExpirationTime = courseinfo[j].expirationTime;
						}
					}
					var datanow=Date.parse(new Date())/1000;//当前时间戳

					for(var i=0;i<courseInfoLength;i++){

						if(courseinfo[i].activeState=="acitve" && courseinfo[i].expirationTime>datanow && courseActiveState<3){
							courseActiveState=3;//已激活未过期
							break;
						}else if(courseinfo[i].activeState=="init" && courseActiveState<2){
							courseActiveState=2;//未激活
						}else if(courseinfo[i].activeState=="acitve" && courseinfo[i].expirationTime<datanow && courseActiveState<1){
							courseActiveState=1;//已激活已过期
						}
						
					}
					
				}
				if(courseActiveState && CAICUI.render.lockStatus){
					courseActiveState=4;//课程已锁定
				}
				//course.getinitdata=true;
				CAICUI.render.courseDetailRenderData.courseActiveState = courseActiveState;
				CAICUI.render.courseDetail.courseActiveState = courseActiveState;

				//更新缓存的课程数据
				//storage.setsingle('course-'+CAICUI.render.courseId,CAICUI.render.courseDetail);
			},
			openVideo : function(e){
				var courseActiveState = CAICUI.render.courseDetail.courseActiveState;
				var that = CAICUI.iGlobal.getThat(e);
				var thatLink = that.attr('link');
				var thatChapterId = that.attr('data-chapterid');
				var thatTasksLength = that.attr('data-taskslength');

				if(thatLink !== 'javascript:;'){ 
					CAICUI.render.openChapterId = thatChapterId;
					CAICUI.render.openTasksNum = thatTasksLength;
					CAICUI.render.formCourseStudy = true;
					CAICUI.NavVideo = false;
					//CAICUI.domRender = false;
					//this.addRecentCourse(CAICUI.render.courseId);
					$('body .course-desc').attr('href',thatLink);

					CAICUI.render.lastLearnChapterName = that.find('.course-list-desc').text();
					// if(!CAICUI.render.lastLearnChapterName ){
					CAICUI.render.lastLearnChapterLink = thatLink;
					// }
					//$('body .lastLearn-chapterName').text(CAICUI.render.lastLearnChapterName);

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
					}else if(courseActiveState === 0){
						layer.msg('Sorry~ 您未购买当前的课程', function() {});
					}
				}
		    // course.comfromurl=1;
			},
			openQuestions : function(e){
				e.stopPropagation();
				var that = CAICUI.iGlobal.getThat(e);

				CAICUI.render.chapterId = that.attr('data-chapterId');
				CAICUI.render.chapterName = that.attr('data-chapterName');
				CAICUI.render.knowledgepointid = that.attr('data-knowledgepointid');

				CAICUI.render.cacheKnowledgeLevel1Id = that.attr('data-cache-knowledge-level1-id');
				CAICUI.render.cacheKnowledgeLevel2Id = that.attr('data-cache-knowledge-level2-id');
				CAICUI.render.cacheKnowledgePath = that.attr('data-cache-knowledge-path');

				CAICUI.render.exerciseFilename = that.attr('data-exercise-filename');
				CAICUI.render.errorNum = +that.attr('data-errornum') || 0;
				CAICUI.render.lastExerciseNid = +that.attr('data-last-exercise-nid') || 0;
				CAICUI.render.ExerciseProgress = +that.attr('data-exercise-progress') || 0;
				CAICUI.render.ExerciseTotalTime = +that.attr('data-exercise-total-time') || 0;
				CAICUI.render.exerciseCount = +that.attr('data-exercise-count');

				// window.location.hash = '#questions/'+CAICUI.render.knowledgepointid;
				this.addAnimate(function(){
					var Questions = new questions;
					Questions.render();
				})
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
			addRecentCourse : function(courseId){
				if(CAICUI.render.learningcourseData && CAICUI.CACHE.RecentCourse){
					for(var i=0;i<CAICUI.render.learningcourseData.length;i++){
						if(CAICUI.render.learningcourseData[i].courseId == courseId){
							var addLearningCourse = true;
							for(var j=0;j<CAICUI.CACHE.RecentCourse.length;j++){
								if(CAICUI.CACHE.RecentCourse[j].courseId == courseId){
									addLearningCourse = false;
								}
							}
							if(addLearningCourse){
								CAICUI.CACHE.RecentCourse.push(CAICUI.render.learningcourseData[i]);
							}
							
							if(CAICUI.CACHE.RecentCourse.length > 2){
								CAICUI.CACHE.RecentCourse.splice(0,1)
							}
							return;
						}
					}
				}
			},
			filterLearningcourse : function(stooges){
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
				return courseLists;
			},
			courseVersionListShow : function(e){
				var that = CAICUI.iGlobal.getThat(e);

				var courseVersionList = $('.courseVersion-list');
				var thatClick = that.attr('data-click');

				if(courseVersionList.hasClass('active')){
					courseVersionList.removeClass('active');
				}else{
					
						if(CAICUI.render.versionId){
							if(CAICUI.render.courseVersion && CAICUI.render.courseVersion.length){
								var templateHtml = $('#template-courseStudy-courseVersionList').html();
								var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
									"courseVersion" : CAICUI.render.courseVersion,
									"courseActiveTime" : CAICUI.render.courseActiveTime,
									"categoryName" : CAICUI.render.courseDetail.categoryName
								});
								$('body .courseVersion-list').html(addHtml);
								courseVersionList.addClass('active');
							}else{
								if(thatClick != 'true'){
									that.attr('data-click','true');

									CAICUI.render.$this.courseVersionDataAjax(function(){
										var templateHtml = $('#template-courseStudy-courseVersionList').html();
										var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
											"courseVersion" : CAICUI.render.courseVersion,
											"courseActiveTime" : CAICUI.render.courseActiveTime,
											"categoryName" : CAICUI.render.courseDetail.categoryName
										});
										$('body .courseVersion-list').html(addHtml);
										courseVersionList.addClass('active');
										// that.attr('data-click','false');
									});
								}
								
							}
							
						}
					
				}
			},
			courseVersionListA : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				if(!that.hasClass('active')){
					var thatSiblings = that.siblings();
					thatSiblings.removeClass('active');
					that.addClass('active');
				}
				$('.courseVersion-list').removeClass('active');
			},
			optionCourse : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.lastLearnChapterName = '';
				CAICUI.render.lastLearnChapterLink = '';
			},

			
			courseNavToggle : function(e){
				var currentTarget = e.currentTarget;
				var that = $(currentTarget);
				var parent = that.parent();
				CAICUI.render.courseId = that.attr('data-courseid');
				parent.toggleClass('active');
				window.CAICUI.myScrollCourseStudyList.refresh();
			},
			courseNavUlLeave : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				this.courseNavPreAnimate(this.courseNavPre);
				this.courseNavPre = this.courseNavPreDefault;
				CAICUI.render.$this.$('.courseIndex-li').eq(this.courseNavPre).addClass('hover');
				this.courseNavAnimate(this.$('.courseIndex-active-box').eq(this.courseNavPre),this.courseNavPre);
				CAICUI.render.$this.$('.courseIndex-ul').removeClass('hover')
			},
			courseNavLiLeave : function(e){
				//e.stopPropagation();
			},
			courseNavLiEnter : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var index = that.index();
				var box = that.find('.courseIndex-active-box');
				if(index==this.courseNavPre){
					return false;
				}
				that.addClass('hover');
				this.courseNavPreAnimate(this.courseNavPre);
				this.courseNavAnimate(box,index);
				this.courseNavPre = index;
			},
			courseNavPreAnimate : function(index){
				var li = this.$('.courseIndex-li').eq(index);
				var addHover = false;
				if(CAICUI.render.$this.$('.courseIndex-ul').hasClass('hover')){
					//CAICUI.render.$this.$('.courseIndex-ul').removeClass('hover')
				}else{
					addHover = true;
				}
				this.$('.courseIndex-active-box').eq(index).stop(true,false).animate({
					'width' : 34,
					'marginLeft' : 0
				},this.courseNavAnimateTime,function(){
					li.removeClass('hover');
					if(addHover){
						CAICUI.render.$this.$('.courseIndex-ul').addClass('hover');
						addHover = false;
					}
				});
			},
			courseNavAnimate : function(box,type){
				box.stop(true,false).animate({
					'width' : '148px'
				},this.courseNavAnimateTime)
			},
			openCourseBaseInfo : function(){

				var templateHtml = $('#template-course-baseInfo').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml);
				$('body #layout').append(addHtml);
				$('body .courseIndex-baseInfo-btn').addClass('hidden');
				$('body .course-baseInfo-closeBtn').on('click',function(){
					$('body .course-baseInfo').remove();
					$('body .courseIndex-baseInfo-btn').removeClass('hidden');
				})
				CAICUI.render.activationCourse = new activationCourse();
				$('body .course-baseInfo-content').append(CAICUI.render.activationCourse.render({
					"coursesBaseInfo" : CAICUI.render.courseDetail,
					"isActivationCourse" : false,
					"isPlan" : CAICUI.render.courseDetailRenderData.weekList
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
			},
			applyEditorLearningPlan : function(){
				var templateHtml = $('#template-apply-editor-learningPlan').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml);
				$('body #right').append(addHtml);
				CAICUI.render.applyEditorLearningPlanCheckbox = true;
				$('body .apply-editor-learningPlan-checkbox').on('click',function(){
					var that = $(this);
					if(that.hasClass('active')){
						that.removeClass('active');
						CAICUI.render.applyEditorLearningPlanCheckbox = false;
					}else{
						that.addClass('active');
						CAICUI.render.applyEditorLearningPlanCheckbox = true;
					}
				})
				$('body .apply-editor-learningPlan-cancel').on('click',function(){
					layer.close(CAICUI.render.applyEditorLearningPlan);
					$('body .apply-editor-learningPlan').remove();
				})
				$('body .apply-editor-learningPlan-confirm').on('click',function(){
					layer.close(CAICUI.render.applyEditorLearningPlan);
					$('body .apply-editor-learningPlan').remove();
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
				})
				CAICUI.render.applyEditorLearningPlan = layer.open({
					type: 1,
					title : false,
					shade: true,
					scrollbar: false,
					closeBtn: 0,
					skin: 'layui-skin layui-apply-editor-learningPlan',
					area: ['425px', '250px'],
					content: $("#apply-editor-learningPlan"),
					success: function() {
						
					}
				});
			},
		});
		return Studycenter;
	});





