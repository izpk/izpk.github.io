;define([
	'jquery',
	'underscore',
	'backbone',
	'storage'
	],function($, _, Backbone, storage){
		'use strict';
		var Studycenter = Backbone.View.extend({
			// el : 'body #right',
			tagName : 'div',
			className : 'course-detail-main',
			template : _.template($('#template-class-course-detail-week-list').html()),
			events : {
				'click .courseDetail-weekList-chapterA' : 'showTaskList',
				'click .js-toTask' : 'openVideo'
			},
			type : '',
			render : function(planData){
				CAICUI.render.thisCourseDetail =　this;
				CAICUI.render.thisCourseDetail.$el.html(CAICUI.render.thisCourseDetail.template({
					"teachingPlan" : planData
				}));
				setTimeout(function(){
					window.CAICUI.myScroller = CAICUI.iGlobal.iScroll('body #wrapper-courseStudy-list');
					$('body .section-content').on('click',function(){
						var node = $(this).data('node').split('-');
						var nodeData = planData[node[0]].list[node[1]];
						var link = '#video/'+CAICUI.render.courseId+'/'+nodeData.chapterId+'/'+nodeData.tasks[0].taskId+'?return_link=classCourseStudy/'+ CAICUI.render.courseId+'&return_hash=on';
						 window.location.hash = link;
					})
					//http://elearning.zbgedu.com/#video/8a22cc685c3379ab015c3d51d8f50035/8a22cc685c3379ab015c3d5fcb1d003d/1c77eedfca7d5a6e4b06b13243b4b47f?return_link=courseStudy/8a22cc685c3379ab015c3d51d8f50035&return_hash=on
					$('body .js-task-exam').on('click',function(){
						var link = '#video/8a22cc685c3379ab015c3d51d8f50035/8a22cc685c3379ab015c3d5fcb1d003d/1c77eedfca7d5a6e4b06b13243b4b47f?return_link=classCourseStudy/'+ CAICUI.render.courseId+'&return_hash=on';
						
						window.location.hash = link;
					})
					$('body .js-task-live').on('click',function(){

					})
				},50)

				// CAICUI.render.thisCourseDetail.teachingPlanAjax(function(data){
				// 	CAICUI.render.thisCourseDetail.$el.html(CAICUI.render.thisCourseDetail.template({
				// 		"data" : {
				// 			"teachingPlan" : planData
				// 		}
				// 	}));
				// 	window.CAICUI.myScroller = CAICUI.iGlobal.iScroll('body #wrapper');
				// });
				return this;
			},
			teachingPlanAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'node-teachingPlan',
					'data' : {
						'courseId' : 'courseId'
					},
					done : function(data){
						if(callback){
							callback(data);
						}
					}
				});
			},
			isCourseDetailWeekPlan : function(planData){
				if(CAICUI.render.previewInterval){
					clearInterval(CAICUI.render.previewInterval);
				}
				
				CAICUI.render.courseDetailList = [];
				CAICUI.render.courseDetailWeekList = [];
				CAICUI.render.weekTotalBeoverdue = 0;
				CAICUI.render.taskTotal = 0;
				CAICUI.render.taskTotalBeoverdue = 0;
				CAICUI.render.taskTotalOngoing = 0;
				CAICUI.render.taskTotalCompleted = 0;
				CAICUI.render.taskTotalNotstarted = 0;
				CAICUI.render.thisCourseDetail.filterData(planData.chapters);
				if(planData.taskProgress){
					CAICUI.render.thisCourseDetail.addTaskProgress(planData.taskProgress);
				}
				
				
				CAICUI.render.courseDetailData = '';
				if(planData.weekList && planData.weekList.length){
					CAICUI.render.courseDetailData = this.getCourseDetailWeekPlanData(planData);
				}else{
					CAICUI.render.courseDetailData = this.getCourseDetailData(planData);
				}
			},
			getCourseDetailData : function(planData){

				var addCourseDetailList = [];
				var item = CAICUI.render.courseDetailList;
				var itemLength = item.length;
				var itemEnd = 0;
				var tasksNum = 0;

				var weekStatus = "";
				var weekTaskTime = 0;
				var weekStudyTime = 0;
				var weekTaskOngoing = 0;
				var weekDone = 0;
				var weekDoneNum = 0;
				var weekTotal = 0;

				var weekTaskBeoverdue = 0;
				var weekTaskOngoing = 0;
				var weekTaskCompleted = 0;
				var weekTaskNotstarted = 0;
				// if(element.startDate<newDate && element.endDate<newDate){
				// 	weekStatus = "beoverdue";
				// 	CAICUI.render.weekTotalBeoverdue++;
				// }else if(element.startDate<newDate && newDate<element.endDate){
				// 	weekStatus = "ongoing";
				// }if(newDate<element.startDate && newDate<element.endDate){
				// 	weekStatus = "notstarted";
				// }
				
				for(var i=0;i<itemLength;i++){
					weekTotal++;
					var thisItem = item[i];

					if(thisItem.isTasks){
						weekTaskTime += thisItem.chapterTotalTime;
						weekStudyTime += thisItem.chapterStudyTime;
						var taskLength = thisItem.tasks.length;
						tasksNum+=taskLength;
						switch(weekStatus){
							case "completed":
								CAICUI.render.taskTotalCompleted+=taskLength;
								break;
							case "beoverdue":
								// CAICUI.render.taskTotalBeoverdue+=taskLength;
								for(var j=0;j<taskLength;j++){
									if(thisItem.tasks[j].state){
										weekDoneNum++;
										CAICUI.render.taskTotalCompleted++;
										weekTaskCompleted++;
									}else{

										if(thisItem.tasks[j].progress){
											CAICUI.render.taskTotalOngoing++;
											weekTaskOngoing++;
										}else{
											CAICUI.render.taskTotalBeoverdue++;
											weekTaskBeoverdue++;
											// CAICUI.render.taskTotalNotstarted++;
										}
									}
								}
								break;
							case "ongoing":
								for(var j=0;j<taskLength;j++){
									if(thisItem.tasks[j].state){
										weekDoneNum++;
										CAICUI.render.taskTotalCompleted++;
										weekTaskCompleted++;
									}else{
										if(thisItem.tasks[j].progress){
											CAICUI.render.taskTotalOngoing++;
											weekTaskOngoing++;
										}else{
											CAICUI.render.taskTotalNotstarted++;
											weekTaskNotstarted++;
										}
									}
								}
								break;
							case "notstarted":
								CAICUI.render.taskTotalNotstarted+=taskLength
								break;
						}
					}
					addCourseDetailList.push(thisItem)
					
				}
				if(tasksNum == weekDoneNum && weekStatus !== "notstarted"){
					weekDone = 1;
					weekStatus = "completed";
				}

				CAICUI.render.taskTotal += tasksNum;
				CAICUI.render.courseDetailWeekList.push({
					// 'planId' : element.id,
					// 'title' : element.planTitle,
					// 'startDate' : element.startDate,
					// 'endDate' : element.endDate,
					'list' : addCourseDetailList,
					'tasksNum' : tasksNum,
					'weekStatus' : weekStatus,
					'weekTaskTime' : weekTaskTime,
					'weekStudyTime' : weekStudyTime,
					
					'weekIsFinish' : weekDone,
					'weekTaskCompleted' : weekTaskCompleted,
					'weekTaskOngoing' : weekTaskOngoing,
					'weekTaskBeoverdue' : weekTaskBeoverdue,
					'weekTaskNotstarted' : weekTaskNotstarted
				})
				return {
					'isPreview' : planData.isPreview,
					'isPlan' : false,
					'courseDetailWeekList' : CAICUI.render.courseDetailWeekList,
					'courseActiveState' : planData.courseActiveState,
					'courseTaskTotal' : CAICUI.render.taskTotal,
					'courseTaskTotalBeoverdue' : CAICUI.render.taskTotalBeoverdue,
					'courseTaskTotalCompleted' : CAICUI.render.taskTotalCompleted,
					'courseTaskTotalOngoing' : CAICUI.render.taskTotalOngoing,
					'courseTaskTotalNotstarted' : CAICUI.render.taskTotalNotstarted,
					'coursePercentage' : CAICUI.iGlobal.getPercentage(CAICUI.render.taskTotalCompleted,CAICUI.render.taskTotal),
					'courseId' : planData.courseId,
					'weekTotalBeoverdue' : CAICUI.render.weekTotalBeoverdue
				}
			},
			getCourseDetailWeekPlanData : function(planData){
				var itemStart = 0;
				var newDate = new Date().getTime();
				_.each(planData.weekList,function(element, index){
					var startCategoryId = element.startCategoryId;
					var endCategoryId = element.endCategoryId;
					var addCourseDetailList = [];
					var addcourseDetailWeekList = false;
					var item = CAICUI.render.courseDetailList;
					var itemLength = item.length;
					var itemEnd = 0;
					var tasksNum = 0;

					var weekStatus = "";
					var weekTaskTime = 0;
					var weekStudyTime = 0;
					var weekTaskOngoing = 0;
					var weekDone = 0;
					var weekDoneNum = 0;
					var weekTotal = 0;

					var weekTaskBeoverdue = 0;
					var weekTaskOngoing = 0;
					var weekTaskCompleted = 0;
					var weekTaskNotstarted = 0;
					if(element.startDate<newDate && element.endDate<newDate){
						weekStatus = "beoverdue";
						CAICUI.render.weekTotalBeoverdue++;
					}else if(element.startDate<newDate && newDate<element.endDate){
						weekStatus = "ongoing";
					}if(newDate<element.startDate && newDate<element.endDate){
						weekStatus = "notstarted";
					}
					
					for(var i=itemStart;i<itemLength;i++){
						weekTotal++;
						var thisItem = item[i];
						if(startCategoryId == thisItem.chapterId){
							addcourseDetailWeekList = true;
						}
						if(addcourseDetailWeekList){

							if(thisItem.isTasks){
								weekTaskTime += thisItem.chapterTotalTime;
								weekStudyTime += thisItem.chapterStudyTime;
								var taskLength = thisItem.tasks.length;
								tasksNum+=taskLength;
								switch(weekStatus){
									case "completed":
										CAICUI.render.taskTotalCompleted+=taskLength;
										break;
									case "beoverdue":
										// CAICUI.render.taskTotalBeoverdue+=taskLength;
										for(var j=0;j<taskLength;j++){
											if(thisItem.tasks[j].state){
												weekDoneNum++;
												CAICUI.render.taskTotalCompleted++;
												weekTaskCompleted++;
											}else{

												if(thisItem.tasks[j].progress){
													CAICUI.render.taskTotalOngoing++;
													weekTaskOngoing++;
												}else{
													CAICUI.render.taskTotalBeoverdue++;
													weekTaskBeoverdue++;
													// CAICUI.render.taskTotalNotstarted++;
												}
											}
										}
										break;
									case "ongoing":
										for(var j=0;j<taskLength;j++){
											if(thisItem.tasks[j].state){
												weekDoneNum++;
												CAICUI.render.taskTotalCompleted++;
												weekTaskCompleted++;
											}else{
												if(thisItem.tasks[j].progress){
													CAICUI.render.taskTotalOngoing++;
													weekTaskOngoing++;
												}else{
													CAICUI.render.taskTotalNotstarted++;
													weekTaskNotstarted++;
												}
											}
										}
										break;
									case "notstarted":
										CAICUI.render.taskTotalNotstarted+=taskLength
										break;
								}
							}
							addCourseDetailList.push(thisItem)
						}
						if(endCategoryId == thisItem.chapterId){
							addcourseDetailWeekList = false;
							itemStart = i;
							itemEnd = i;
							weekTotal = i;
							break;
						}
					}
					if(tasksNum == weekDoneNum && weekStatus !== "notstarted"){
						weekDone = 1;
						weekStatus = "completed";
					}

					CAICUI.render.taskTotal += tasksNum;
					CAICUI.render.courseDetailWeekList.push({
						'planId' : element.id,
						'title' : element.planTitle,
						'startDate' : element.startDate,
						'endDate' : element.endDate,
						'isFinish' : element.isFinish,
						'list' : addCourseDetailList,
						'tasksNum' : tasksNum,
						'weekStatus' : weekStatus,
						'weekTaskTime' : weekTaskTime,
						'weekStudyTime' : weekStudyTime,
						'weekIsFinish' : weekDone,
						'weekTaskCompleted' : weekTaskCompleted,
						'weekTaskOngoing' : weekTaskOngoing,
						'weekTaskBeoverdue' : weekTaskBeoverdue,
						'weekTaskNotstarted' : weekTaskNotstarted
					})
				})
				return {
					'isPreview' : planData.isPreview,
					'isPlan' : true,
					'courseDetailWeekList' : CAICUI.render.courseDetailWeekList,
					'courseActiveState' : planData.courseActiveState,
					'courseTaskTotal' : CAICUI.render.taskTotal,
					'courseTaskTotalBeoverdue' : CAICUI.render.taskTotalBeoverdue,
					'courseTaskTotalCompleted' : CAICUI.render.taskTotalCompleted,
					'courseTaskTotalOngoing' : CAICUI.render.taskTotalOngoing,
					'courseTaskTotalNotstarted' : CAICUI.render.taskTotalNotstarted,
					'coursePercentage' : CAICUI.iGlobal.getPercentage(CAICUI.render.taskTotalCompleted,CAICUI.render.taskTotal),
					'courseId' : planData.courseId,
					'weekTotalBeoverdue' : CAICUI.render.weekTotalBeoverdue
				}
			},
			filterData : function(chapters, level, node, oldNode, rootNode){
				if(level){
					level++;
				}else{
					var level = 1;
				}
				_.each(chapters,function(element,index){
					
					var rootNode = '';
					var newNode = '';
					if(level>1){
						rootNode = oldNode;
						newNode = node + '-' + index;
					}else{
						newNode = index.toString();
						node = index.toString();
						rootNode = index.toString()
					}
					var chapterTotalTime = 0;


					if(element.tasks && element.tasks.length){
						var newTasks = [];
						var completedNum = 0;
						var ongoingNum = 0;
						var notstartedNum = 0;
						CAICUI.render.previewCourseTasksTotalNum += element.tasks.length;
						_.each(element.tasks,function(element,index){
							if(element.taskType == "video"){
								newTasks.push(element)
								CAICUI.render.previewCourseTimeTotalNum += (+element.videoTime);
								chapterTotalTime += (+element.videoTime);
							}else if(element.taskType == "exam"){
								newTasks.push(element)
								// CAICUI.render.previewCourseTimeTotalNum += (+element.totalCount);
								CAICUI.render.previewCourseTimeTotalNum += (+element.taskTime)*60;
								chapterTotalTime += (+element.taskTime)*60;
							}else if(element.taskType == "knowledgePointExercise"){
								newTasks.push(element)
								CAICUI.render.previewCourseTimeTotalNum += (120)*60;
								chapterTotalTime += (120)*60;
							}else if(element.taskType == "openCourse"){
								newTasks.push(element)
								CAICUI.render.previewCourseTimeTotalNum += (+element.taskTime);
							}
							if(element.state){
								completedNum++;
							}else{
								if(element.progress){
									ongoingNum++;
								}else{
									notstartedNum++;
								}
							}
							
						})
						CAICUI.render.courseDetailList.push({
							'level' : level,
							'rootNode' : rootNode,
							'parentNode' : node,
							'node' : newNode,
							'isChildren' : false,
							'isFree' : element.isFree,
							'chapterTitle' : element.chapterTitle,
							'chapterId' : element.chapterId,
							'isTasks' : true,
							'tasks' : newTasks,
							'completedNum' : completedNum,
							'ongoingNum' : ongoingNum,
							'notstartedNum' : notstartedNum,
							'chapterTotalTime' : chapterTotalTime
						})

					}
					if(element.children && element.children.length){
						CAICUI.render.courseDetailLevel++
						CAICUI.render.courseDetailList.push({
							'level' : level,
							'rootNode' : rootNode,
							'parentNode' : node,
							'node' : newNode,
							'isChildren' : true,
							'isFree' : element.isFree,
							'chapterTitle' : element.chapterTitle,
							'chapterId' : element.chapterId,
							'isTasks' : false
						})
						CAICUI.render.thisCourseDetail.filterData(element.children, level, newNode, node, rootNode);
					}
				})
			},
			addTaskProgress : function(taskProgress){
				_.each(CAICUI.render.courseDetailList,function(courseElement, courseIndex){
					if(courseElement.isTasks){
						var chapterStudyTime = 0;
						var completedNum = 0;
						var ongoingNum = 0;
						var notstartedNum = 0;
						// _.each(taskProgress,function(taskProgressElement, taskProgressIndex){
							// if(taskProgressElement.chapterId == courseElement.chapterId){
						var taskLength = courseElement.tasks.length;
						var taskItem = 0;
						_.each(courseElement.tasks,function(taskElement, taskIndex){
							var thatTaskData = '';
							_.each(taskProgress,function(taskProgressElement, taskProgressIndex){
								if(taskElement.taskId == taskProgressElement.taskId){
									thatTaskData = taskProgressElement;
								}
							});
							if(thatTaskData){
								// chapterStudyTime+=thatTaskData.progress;studyTime

								// chapterStudyTime+=CAICUI.render.thisCourseDetail.getStudyTime(thatTaskData);
								if(thatTaskData.studyTime){
									chapterStudyTime+=thatTaskData.studyTime;
								}else{
									chapterStudyTime+=0;
								}
								
								if(thatTaskData.state){
									completedNum++;
								}else{
									if(thatTaskData.progress){
										ongoingNum++;
									}
								}
								taskElement.progress = thatTaskData.progress;
								taskElement.total = thatTaskData.total;
								taskElement.state = thatTaskData.state;
								taskElement.percentage = CAICUI.iGlobal.getPercentage(thatTaskData.progress,thatTaskData.total);
							}else{
								notstartedNum++;
							}
						})
						courseElement.completedNum = completedNum;
						courseElement.ongoingNum = ongoingNum;
						courseElement.notstartedNum = notstartedNum;
						courseElement.chapterStudyTime = chapterStudyTime;
					}
				})
			},
			getStudyTime : function(thatTaskData){
				var studyTime = 0;
				if(thatTaskData.taskStudyTimeList && thatTaskData.taskStudyTimeList.length){
					_.each(thatTaskData.taskStudyTimeList,function(element, index){
						studyTime += parseInt(element.studyTime);
					})
				}
				return studyTime;
			},
			showTaskList : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var parentWeek = that.parents('.courseDetail-weekList-chapterUl');

				var isTasks = that.data('istasks');
				if(isTasks){
					var parent = that.parent();
					if(parent.hasClass('active')){
						parent.removeClass('active');
					}else{
						parent.addClass('active');
					}
				}else{
					var node = that.data('node');
					var checked = that.data('checked');
					var level = that.data('level');
					if(checked){
						that.data('checked',false);
						
						if(level == 1){
							parentWeek.find('.courseDetail-weekList-parentNode-'+node).parent().removeClass('active');
							parentWeek.find('.courseDetail-weekList-parentNode-'+node).data('checked',false);

							parentWeek.find('.courseDetail-weekList-rootNode-'+node).parent().removeClass('show active');
							parentWeek.find('.courseDetail-weekList-rootNode-'+node).data('checked',false);
							
						}else{
							that.parent().removeClass('active');
							that.parent().data('checked',false);

							parentWeek.find('.courseDetail-weekList-parentNode-'+node).parent().removeClass('show active');
							parentWeek.find('.courseDetail-weekList-parentNode-'+node).data('checked',false);
						}
					}else{
						if(level == 1){
							parentWeek.find('.courseDetail-weekList-rootNode-'+node).parent().addClass('show active');
							parentWeek.find('.courseDetail-weekList-rootNode-'+node).data('checked',true);
						}else{
							that.parent().addClass('active');
							that.parent().data('checked',true);
						}
						that.data('checked',true);
						parentWeek.find('.courseDetail-weekList-parentNode-'+node).parent().addClass('show active');
					}
				}
				if(window.CAICUI.myScrollLearningPlanPreview){
					window.CAICUI.myScrollLearningPlanPreview.refresh()
				}else if(window.CAICUI.myScrollCourseStudyList){
					window.CAICUI.myScrollCourseStudyList.refresh();
				}
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
		});
		return Studycenter;
	});