;define([
	'jquery',
	'underscore',
	'backbone',
	'storage',
	'views/questions',
	'layer',
	],function($, _, Backbone, storage, questions, layer){
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
				'click .course-change' : 'courseChange',
				'click .option-a' : 'optionCourse',
				'click .courseVersion-list-a' : 'courseVersionListA',
				'click .courseVersion-show-btn' : 'courseVersionListShow'
			},
			render : function(courseId){
				CAICUI.render.$this = this;
				this.courseNavPreDefault = 0;
				this.courseNavPre = 0;
				this.courseNavAnimateTime = 300;
				CAICUI.render.subjectId = '';
				CAICUI.render.categoryId = '';
				CAICUI.render.courseId = courseId;
				CAICUI.render.chapterId = '';

				CAICUI.render.isCoursePay = false;
				CAICUI.render.questions = questions;
				
				CAICUI.render.courseName = '';
				CAICUI.render.courseNameArray = [];
				CAICUI.render.courseDetail = '';
				CAICUI.render.getTasksProgress = '';
				CAICUI.render.handout = '';
				CAICUI.render.course_info = '';
				CAICUI.render.courseInfoExamTime = '';
				CAICUI.render.courseInfoDueTime = '';
				CAICUI.render.versionId = '';
				CAICUI.render.courseInfo = '';
				CAICUI.render.courseVersion = '';
				CAICUI.render.courseActiveTime = '';

				CAICUI.render.lastLearnChapter = '';
				CAICUI.render.lastLearnChapterName = '';
				CAICUI.render.lastLearnChapterLink = '';

				CAICUI.render.percentage = 0;

				CAICUI.render.lockStatus = false;


				CAICUI.render.chaptersIdArray = [];

				CAICUI.render.chapterName = '';
				CAICUI.render.exerciseCount = 0;
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
				CAICUI.render.exerciseCount = '';
				CAICUI.render.$this.$el.html(CAICUI.render.$this.template({
					'data' : {
						'courseId' : CAICUI.render.courseId
					}
				}));

				CAICUI.render.$this.handoutAjax(function(){
					$('body .icon-handout-down').attr('href', CAICUI.Common.host.img + CAICUI.render.handout.path)
				});
				CAICUI.render.$this.courseInfoAjax(function(){
					$('body .course-info-examTime').html(CAICUI.render.courseInfoExamTime);
				});
				CAICUI.render.$this.learningcourseAjax(function(){
					$('body .course-info-dueTime').html(CAICUI.render.courseInfoDueTime);
					$('body .course-progress-show').attr('data-course-progress', CAICUI.render.percentage);
					$('body .course-percentage').html(CAICUI.render.percentage);
					$('body .course-progress-show').animate({
						'width': CAICUI.render.percentage+'%'},
						1000);
					var templateHtml = $('#template-courseStudy-courseList').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						"courseNameArray" : CAICUI.render.courseNameArray
					});
					$('body .course-change-ul').html(addHtml);
					
					CAICUI.render.$this.courseDetailAjax(function(){
						$('body .course-name').html(CAICUI.render.courseName);
						CAICUI.render.$this.courseActiveStateAjax(function(){
						
							CAICUI.render.$this.getTasksProgressAjax(function(){
								CAICUI.render.$this.setTasksProgress();
								var templateHtml = $('#template-courseStudy-taskList').html();
								var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
									"data" : {
										"courseId" : CAICUI.render.courseId,
										"courseDetail" : CAICUI.render.courseDetail
									}
								});
								$('body .scroller').html(addHtml);
								
								CAICUI.render.$this.exercisePointCountCacheAjax(function(data){
									_.each(data,function(element,index){
										$('body .knowledge-point-total-'+element.knowledge_point_id) .parents('.course-list-link').addClass('course-list-questions')
										
										//$('body .knowledge-point-number-'+element.knowledge_point_id).html(0);
										
										$('body .knowledge-point-total-'+element.knowledge_point_id).html(element.exercise_count);
										$('body #course-list-questions-box-'+element.knowledge_point_id).addClass('active');
										$('body #knowledge-point-btn-'+element.knowledge_point_id).attr('data-exercise-count',element.exercise_count);
										//$('body #knowledge-point-btn-'+element.knowledge_point_id).attr('data-exercise-filename',element.exercise_filename);
										$('body #knowledge-point-btn-'+element.knowledge_point_id).attr('data-exercise-filename','questions-id.html');
									
										$('body #knowledge-point-btn-'+element.knowledge_point_id).attr('data-cache-knowledge-level1-id',element.knowledge_path_level_one_id);
										$('body #knowledge-point-btn-'+element.knowledge_point_id).attr('data-cache-knowledge-level2-id',element.knowledge_path_level_two_id);
										$('body #knowledge-point-btn-'+element.knowledge_point_id).attr('data-cache-knowledge-path',element.knowledge_path_level_one_id+','+element.knowledge_path_level_two_id);
									})
								})
								CAICUI.render.$this.exerciseKnowledgeMemberStatusAjax(function(data){
									_.each(data,function(element,index){
										$('body #knowledge-point-btn-'+element.knowledge_point_id).attr('data-last-exercise-nid',element.last_exercise_nid);
										var progress = 0;
										if(element.progress){
											progress = element.progress
										}
										$('body .knowledge-point-number-'+element.knowledge_point_id).html(progress);
										$('body #knowledge-point-btn-'+element.knowledge_point_id).attr('data-exercise-progress',progress);
										$('body #knowledge-point-btn-'+element.knowledge_point_id).attr('data-exercise-total-time',element.total_time);
										var error_num = 0;
										if(element.error_num){
											error_num = element.error_num;
										}
										$('body #knowledge-point-btn-'+element.knowledge_point_id).attr('data-errornum',error_num);
									})
								})

								window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');

								CAICUI.render.courseIndexTips = setTimeout(function(){
									$('body .courseIndex-content-tips').animate({
										height: 0},
										500, function() {
											$('body .courseIndex-content-tips').remove();
											window.CAICUI.myScroll.refresh();
									});
								},20000)
								
								$('.lastLearn').attr('href', CAICUI.render.lastLearnChapterLink);
								$('.lastLearn').html(CAICUI.render.lastLearnChapterName);

								$('.continue-learning').attr('href', CAICUI.render.lastLearnChapterLink);
							});
							
						});

						CAICUI.render.$this.courseVersionDataAjax(function(){
							var templateHtml = $('#template-courseStudy-courseVersionList').html();
							var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
								"courseVersion" : CAICUI.render.courseVersion,
								"courseActiveTime" : CAICUI.render.courseActiveTime
							});
							$('body .courseVersion-list').html(addHtml);
						});
					});
				});
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
						CAICUI.CACHE.Learningcourse = data.data.courselist;
						var filterLearningcourse = CAICUI.render.$this.filterLearningcourse(CAICUI.CACHE.Learningcourse);
						_.each(filterLearningcourse,function(element, index, list){
							_.each(element.newList,function(element, index){
								_.each(element.list,function(element, index){
									if(element.courseId == data.courseId){
										CAICUI.render.isCoursePay = true;
									}
									CAICUI.render.courseNameArray.push({
										"courseId" : element.courseId,
										"courseName" : element.courseName
									});
								})
							})
						})
						_.each(CAICUI.CACHE.Learningcourse,function(element, index, list){
							if(element.courseId == CAICUI.render.courseId){
								CAICUI.render.courseInfo = list[index];
								CAICUI.render.courseInfoDueTime = CAICUI.iGlobal.getDate(list[index].expirationTime)
								
								var taskprogress = CAICUI.render.courseInfo.taskprogress ? CAICUI.render.courseInfo.taskprogress : 0;
								var taskTotal = CAICUI.render.courseInfo.taskTotal ? CAICUI.render.courseInfo.taskTotal : 0;
								var percentage = 0;
								var lastProgress = CAICUI.render.courseInfo.lastProgress;
								if(taskprogress && taskTotal){
									var a = taskprogress/taskTotal;
									if(a>0 && a<0.01){
										a = 0.01
									}
									percentage = parseInt(a*100);
								}
								CAICUI.render.percentage = percentage
								return false;
							}
						});
						if(callback){callback()};
					},
					fail : function(){
						CAICUI.CACHE.Learningcourse = {};
						CAICUI.CACHE.RecentCourse = {};
					}
				})
			},
			courseDetailAjax : function(callback){
				var isAjax = true;
				var courseProgress = storage.get('courseProgress-'+CAICUI.render.courseId);
				if(courseProgress){
					CAICUI.render.courseDetail = courseProgress;
					CAICUI.render.knowledgePointIdTotal = CAICUI.render.courseDetail.knowledgePointId
					CAICUI.render.$this.courseDetailDone(courseProgress,callback);
					
				}else{
					CAICUI.Request.ajax({
						'hostName' : 'http://192.168.10.112:8081',
						'server' : 'courseDetail',
						'data' : {
							'courseId' : CAICUI.render.courseId
						},
						done : function(data){
							//var data = {"data":[{"categoryIndex":5,"createTime":1433140840,"effectiveDay":180,"taskTotal":"70","chapters":[{"knowledgePointId":"40288af0583cbd3801583d8637620009","isFree":"false","chapterId":"ff8080814dad5062014dadd9c7190054","isLeaf":"false","chapterTitle":"INTRODUCTION","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"knowledgePointId":"40288af0583cbd3801583d8637620009","isFree":"true","chapterId":"ff8080814dad5062014dadd9c7200055","isLeaf":"true","chapterTitle":"课程介绍","tasks":[{"attachmentPath":"","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"9EA9391E002F430E9C33DC5901307461","videoTime":846,"videoSiteId":"D550E277598F7D23","title":"课程介绍","taskType":"video","taskId":"ff8080814dad5062014dadd9c7270056","taskLevel":null,"id":"ff808081482a031501482a3881680019"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-Introduction of Paper.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"ED4E6BCAC88795149C33DC5901307461","videoTime":1410,"videoSiteId":"D550E277598F7D23","title":"Introduction of Paper","taskType":"video","taskId":"ff8080814dad5062014dadd9c7320058","taskLevel":null,"id":"ff808081473905e701477c4bf98b00d9"}],"chapterFiles":null,"chapterExtends":null,"children":null}]},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c7350059","isLeaf":"false","chapterTitle":"PART A BASIC KNOWLEDGE","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"knowledgePointId":null,"isFree":"true","chapterId":"ff8080814dad5062014dadd9c739005a","isLeaf":"true","chapterTitle":"Chapter 1 The Nature, Source and Purpose of Management Accounting","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART A-Chapter 1 The Nature, Source and Purpose of Management Accounting-1.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"CB14D71E85E700EF9C33DC5901307461","videoTime":1769,"videoSiteId":"D550E277598F7D23","title":"Chapter 1 The Nature, Source and Purpose of Management Accounting-1","taskType":"video","taskId":"ff8080814dad5062014dadd9c741005b","taskLevel":null,"id":"ff808081473905e701477c4c395600da"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART A-Chapter 1 The Nature, Source and Purpose of Management Accounting-2.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"CCA9B15A8DA51EE79C33DC5901307461","videoTime":3012,"videoSiteId":"D550E277598F7D23","title":"Chapter 1 The Nature, Source and Purpose of Management Accounting-2","taskType":"video","taskId":"ff8080814dad5062014dade0954700d0","taskLevel":null,"id":"ff80808147c904170147cceb54180012"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART A-Chapter 1 The Nature, Source and Purpose of Management Accounting-3.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"14153D7B4F4DD1869C33DC5901307461","videoTime":1218,"videoSiteId":"D550E277598F7D23","title":"Chapter 1 The Nature, Source and Purpose of Management Accounting-3","taskType":"video","taskId":"ff8080814dad5062014dade9f8b100d1","taskLevel":null,"id":"ff80808147c904170147cced411f0013"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 4 Accounting for Materials-4.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"468144960927E5DA9C33DC5901307461","videoTime":2615,"videoSiteId":"E5DD260925A6084B","title":"Chapter 1 The Nature, Source and Purpose of Management Accounting-4","taskType":"video","taskId":"ff8080814dad5062014dadea31f500d2","taskLevel":null,"id":"ff80808147c904170147ccf54d280014"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART A-Chapter 1 课后习题.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"01FEDB099639A39F9C33DC5901307461","videoTime":782,"videoSiteId":"E5DD260925A6084B","title":"Chapter 1 课后习题","taskType":"video","taskId":"ff8080814dad5062014dae05768c00e3","taskLevel":null,"id":"ff80808147c904170147cd070c2f0017"},{"examUrl":"/exam/examination/examinationTask/8a22ecb55340689101534f0199100058","totalCount":10,"examenType":"chapter","difficulty":"简单","title":"ACCA F2 Management Accounting-CH1章节测评","taskType":"exam","taskId":"8a22ecb5559bad0501559fe5d3d8003b","taskLevel":null,"id":"8a22ecb55340689101534f0199100058"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c7710065","isLeaf":"true","chapterTitle":"Chapter 2 Cost Classification","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART A-Chapter 2 Cost Classification-1.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"D8E669298298BCD19C33DC5901307461","videoTime":3930,"videoSiteId":"E5DD260925A6084B","title":"Chapter 2 Cost Classification-1","taskType":"video","taskId":"ff8080814dad5062014dadd9c7790066","taskLevel":null,"id":"ff808081473905e701477c4c779c00db"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART A-Chapter 2 Cost Classification-2.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"AD46F84ECBA2D7A49C33DC5901307461","videoTime":3008,"videoSiteId":"D550E277598F7D23","title":"Chapter 2 Cost Classification-2","taskType":"video","taskId":"ff8080814dad5062014dadd9c7840068","taskLevel":null,"id":"ff80808147c904170147ccf7a7020015"},{"examUrl":"/exam/examination/examinationTask/8a22ecb555a050580155a078b11501c5","totalCount":9,"examenType":"chapter","difficulty":"简单","title":"ACCA F2 Management Accounting-CH2章节测评","taskType":"exam","taskId":"8a22ecb555a050580155a08ed83701d2","taskLevel":null,"id":"8a22ecb555a050580155a078b11501c5"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c789006a","isLeaf":"true","chapterTitle":"Chapter 3 Statistical Techniques","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART A-Chapter 3 课后习题.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"4A9F6B85D80FED1A9C33DC5901307461","videoTime":1520,"videoSiteId":"D550E277598F7D23","title":"Chapter 3 Statistical Techniques","taskType":"video","taskId":"ff8080814dad5062014dadd9c791006b","taskLevel":null,"id":"ff808081473905e701477c4cc42200dc"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART A-Chapter 3 课后习题.pdf","apiKey":"q6pLhLMSit3QuuYAD4TIyQ3pJNKiY0Ez","videoCcid":"641339B21F17E3A39C33DC5901307461","videoTime":599,"videoSiteId":"D550E277598F7D23","title":"Chapter 3 课后习题","taskType":"video","taskId":"ff8080814dad5062014dadd9c79c006d","taskLevel":null,"id":"ff80808147c904170147cd0410f90016"},{"examUrl":"/exam/examination/examinationTask/8a22ecb55340689101534f54acd70073","totalCount":5,"examenType":"chapter","difficulty":"简单","title":"ACCA F2 Management Accounting-CH3章节测评","taskType":"exam","taskId":"8a22ecb555a050580155a094ca8a01d3","taskLevel":null,"id":"8a22ecb55340689101534f54acd70073"}],"chapterFiles":null,"chapterExtends":null,"children":null}]},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c7a1006f","isLeaf":"false","chapterTitle":"PART B COST ACCOUNTING METHODS AND SYSTEMS","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c7a50070","isLeaf":"true","chapterTitle":"Chapter 4 Accounting for Materials","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 4 Accounting for Materials-1.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"3396C741266796AE9C33DC5901307461","videoTime":2904,"videoSiteId":"E5DD260925A6084B","title":"Chapter 4 Accounting for Materials-1","taskType":"video","taskId":"ff8080814dad5062014dadd9c7ad0071","taskLevel":null,"id":"ff808081473905e701477c4cfcf200dd"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 4 Accounting for Materials-2.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"1D1632086FF5C5849C33DC5901307461","videoTime":2760,"videoSiteId":"E5DD260925A6084B","title":"Chapter 4 Accounting for Materials-2","taskType":"video","taskId":"ff8080814dad5062014dadd9c7b80073","taskLevel":null,"id":"ff80808147c904170147cd0e0d03001a"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 4 Accounting for Materials-3.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"C333E3A3A717B9439C33DC5901307461","videoTime":1232,"videoSiteId":"E5DD260925A6084B","title":"Chapter 4 Accounting for Materials-3","taskType":"video","taskId":"ff8080814dad5062014dadd9c7c20075","taskLevel":null,"id":"ff80808147c904170147cd10a566001b"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 4 Accounting for Materials-4.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"DEA56BCB44BACA039C33DC5901307461","videoTime":1281,"videoSiteId":"E5DD260925A6084B","title":"Chapter 4 Accounting for Materials-4","taskType":"video","taskId":"ff8080814dad5062014dadd9c7cd0078","taskLevel":null,"id":"ff808081485e0f2601485eb1d5b0006b"},{"examUrl":"/exam/examination/examinationTask/8a22ecb555a050580155a069f87a01bc","totalCount":7,"examenType":"chapter","difficulty":"简单","title":"ACCA F2 Management Accounting-CH4章节测评","taskType":"exam","taskId":"8a22ecb555a050580155a09aaa3501d6","taskLevel":null,"id":"8a22ecb555a050580155a069f87a01bc"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c7d00079","isLeaf":"true","chapterTitle":"Chapter 5 Accounting for Labor","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 5 Accounting for Labor.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"B85ABA345080A62A9C33DC5901307461","videoTime":4561,"videoSiteId":"E5DD260925A6084B","title":"Chapter 5 Accounting for Labor","taskType":"video","taskId":"ff8080814dad5062014dadd9c7d8007a","taskLevel":null,"id":"ff808081473905e701477c4d4fba00de"},{"examUrl":"/exam/examination/examinationTask/8a22ecb5535a31f601535a80a31d0002","totalCount":6,"examenType":"chapter","difficulty":"简单","title":"ACCA F2 Management Accounting-CH5章节测评","taskType":"exam","taskId":"8a22ecb555a050580155a0a3a50501e0","taskLevel":null,"id":"8a22ecb5535a31f601535a80a31d0002"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c7dc007c","isLeaf":"true","chapterTitle":"Chapter 6 Accounting for Overheads","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 6 Accounting for Overheads-1.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"871755B6AF487BC19C33DC5901307461","videoTime":3538,"videoSiteId":"E5DD260925A6084B","title":"Chapter 6 Accounting for Overheads-1","taskType":"video","taskId":"ff8080814dad5062014dadd9c7e4007d","taskLevel":null,"id":"ff808081473905e701477c4d87dd00df"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 6 Accounting for Overheads-2.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"38ED641F60FAEAA69C33DC5901307461","videoTime":3271,"videoSiteId":"E5DD260925A6084B","title":"Chapter 6 Accounting for Overheads-2","taskType":"video","taskId":"ff8080814dad5062014dadd9c7f0007f","taskLevel":null,"id":"ff80808147c904170147cd11dc31001c"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 6 课后习题.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"CA6FCE1D6FECC23D9C33DC5901307461","videoTime":927,"videoSiteId":"E5DD260925A6084B","title":"Chapter 6 课后习题","taskType":"video","taskId":"ff8080814dad5062014dadd9c7fd0081","taskLevel":null,"id":"ff80808147c904170147cd0991f30018"},{"examUrl":"/exam/examination/examinationTask/8a22ecb5535a31f601535a8b2ae8000a","totalCount":6,"examenType":"chapter","difficulty":"简单","title":"ACCA F2 Management Accounting-CH6章节测评","taskType":"exam","taskId":"8a22ecb555a050580155a401e1df01ea","taskLevel":null,"id":"8a22ecb5535a31f601535a8b2ae8000a"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c8010083","isLeaf":"true","chapterTitle":"Chapter 7 Absorption and Marginal Costing","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 7 Absorption and Marginal Costing.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"A05A126267F41CE09C33DC5901307461","videoTime":3513,"videoSiteId":"E5DD260925A6084B","title":"Chapter 7 Absorption and Marginal Costing","taskType":"video","taskId":"ff8080814dad5062014dadd9c80a0084","taskLevel":null,"id":"ff808081473905e701477c4dc66b00e0"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 7 课后习题.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"804EA35BE4A73EEE9C33DC5901307461","videoTime":610,"videoSiteId":"E5DD260925A6084B","title":"Chapter 7 课后习题","taskType":"video","taskId":"ff8080814dad5062014dadd9c8170086","taskLevel":null,"id":"ff80808147c904170147cd0b041e0019"},{"examUrl":"/exam/examination/examinationTask/8a22ecb5535aa3eb01536448869c0149","totalCount":10,"examenType":"chapter","difficulty":"简单","title":"ACCA F2 Management Accounting-CH7章节测评","taskType":"exam","taskId":"8a22ecb555a050580155a41fa80401f6","taskLevel":null,"id":"8a22ecb5535aa3eb01536448869c0149"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c81b0088","isLeaf":"true","chapterTitle":"Chapter 8 Job, Batch and Process Costing","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 8 Job, Batch and Process Costing-1.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"CD94F856454639B89C33DC5901307461","videoTime":4397,"videoSiteId":"E5DD260925A6084B","title":"Chapter 8 Job, Batch and Process Costing-1","taskType":"video","taskId":"ff8080814dad5062014dadd9c8230089","taskLevel":null,"id":"ff808081473905e701477c4dfe6200e1"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 8 Job, Batch and Process Costing-2.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"A3051EECB18C81689C33DC5901307461","videoTime":2641,"videoSiteId":"E5DD260925A6084B","title":"Chapter 8 Job, Batch and Process Costing-2","taskType":"video","taskId":"ff8080814dad5062014dadd9c83a008b","taskLevel":null,"id":"ff808081481014ad014816b7e62e0058"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 8 Job, Batch and Process Costing-3.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"223C840E7EECC8829C33DC5901307461","videoTime":2734,"videoSiteId":"E5DD260925A6084B","title":"Chapter 8 Job, Batch and Process Costing-3","taskType":"video","taskId":"ff8080814dad5062014dadd9c846008d","taskLevel":null,"id":"ff808081481014ad014816b92a260059"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 8 Job, Batch and Process Costing-4.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"DBA069A427403A499C33DC5901307461","videoTime":1786,"videoSiteId":"E5DD260925A6084B","title":"Chapter 8 Job, Batch and Process Costing-4","taskType":"video","taskId":"ff8080814dad5062014dadd9c852008f","taskLevel":null,"id":"ff808081481014ad014816ba1ce0005a"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 8 Job, Batch and Process Costing-5.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"BE53542A0B1CDEF89C33DC5901307461","videoTime":2766,"videoSiteId":"E5DD260925A6084B","title":"Chapter 8 Job, Batch and Process Costing-5","taskType":"video","taskId":"ff8080814dad5062014dadd9c85c0091","taskLevel":null,"id":"ff808081481014ad014816bda789005b"},{"examUrl":"/exam/examination/examinationTask/8a22ecb553644c4201536477d4e4001e","totalCount":10,"examenType":"chapter","difficulty":"简单","title":"ACCA F2 Management Accounting-CH8章节测评","taskType":"exam","taskId":"8a22ecb555a050580155a43236730202","taskLevel":null,"id":"8a22ecb553644c4201536477d4e4001e"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c85f0092","isLeaf":"true","chapterTitle":"Chapter 9 Service and Alternative Costing","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 9 Service and Alternative Costing -1.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"4E990EF5216853409C33DC5901307461","videoTime":1696,"videoSiteId":"E5DD260925A6084B","title":"Chapter 9 Service and Alternative Costing - 1","taskType":"video","taskId":"ff8080814dad5062014dadd9c8660093","taskLevel":null,"id":"ff808081473905e701477c4e387700e2"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 9 Service and Alternative Costing -2.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"5BB2DC4E92A1CED09C33DC5901307461","videoTime":2407,"videoSiteId":"E5DD260925A6084B","title":"Chapter 9 Service and Alternative Costing - 2","taskType":"video","taskId":"ff8080814dad5062014dadd9c8720095","taskLevel":null,"id":"ff8080814816c9de01481c6967bc00b0"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART B-Chapter 9 Service and Alternative Costing -3.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"F24F35CBF8BC984D9C33DC5901307461","videoTime":3614,"videoSiteId":"E5DD260925A6084B","title":"Chapter 9 Service and Alternative Costing - 3","taskType":"video","taskId":"ff8080814dad5062014dadd9c87d0097","taskLevel":null,"id":"ff8080814816c9de01481c6afb4e00b1"},{"examUrl":"/exam/examination/examinationTask/8a22ecb555a050580155a43380bb0203","totalCount":8,"examenType":"chapter","difficulty":"简单","title":"ACCA F2 Management Accounting-CH9章节测评","taskType":"exam","taskId":"8a22ecb555a050580155a444396b020e","taskLevel":null,"id":"8a22ecb555a050580155a43380bb0203"}],"chapterFiles":null,"chapterExtends":null,"children":null}]},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c8800098","isLeaf":"false","chapterTitle":"PART C BUDGETING","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c8850099","isLeaf":"true","chapterTitle":"Chapter 10 Forecasting","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART C-Chapter 10 Forecasting -1.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"D1E4B0607174CDDF9C33DC5901307461","videoTime":2879,"videoSiteId":"E5DD260925A6084B","title":"Chapter 10 Forecasting - 1","taskType":"video","taskId":"ff8080814dad5062014dadd9c88d009a","taskLevel":null,"id":"ff808081473905e701477c4e7f9b00e3"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART C-Chapter 10 Forecasting -2.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"6EB3F6E0D25BE20F9C33DC5901307461","videoTime":2712,"videoSiteId":"E5DD260925A6084B","title":"Chapter 10 Forecasting - 2","taskType":"video","taskId":"ff8080814dad5062014dadd9c899009c","taskLevel":null,"id":"ff8080814816c9de01481c6cd5d600b2"},{"examUrl":"/exam/examination/examinationTask/8a22ecb553644c4201536490959f0033","totalCount":5,"examenType":"chapter","difficulty":"简单","title":"ACCA F2 Management Accounting-CH10章节测评","taskType":"exam","taskId":"8a22ecb555a050580155a44ec9150215","taskLevel":null,"id":"8a22ecb553644c4201536490959f0033"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c89c009d","isLeaf":"true","chapterTitle":"Chapter 11 Budgeting","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART C-Chapter 11 Budgeting -1.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"9DB5E632A68BF7579C33DC5901307461","videoTime":1544,"videoSiteId":"E5DD260925A6084B","title":"Chapter 11 Budgeting - 1","taskType":"video","taskId":"ff8080814dad5062014dadd9c8a4009e","taskLevel":null,"id":"ff808081473905e701477c4ebba500e4"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART C-Chapter 11 Budgeting -2.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"3B6059EE9216DEE19C33DC5901307461","videoTime":1320,"videoSiteId":"E5DD260925A6084B","title":"Chapter 11 Budgeting -  2","taskType":"video","taskId":"ff8080814dad5062014dadd9c8b000a0","taskLevel":null,"id":"ff8080814816c9de01481c6e9c4000b3"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART C-Chapter 11 Budgeting -3.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"B3A74FC685C472409C33DC5901307461","videoTime":1633,"videoSiteId":"E5DD260925A6084B","title":"Chapter 11 Budgeting - 3","taskType":"video","taskId":"ff8080814dad5062014dadd9c8bb00a2","taskLevel":null,"id":"ff8080814816c9de01481c721b0700b4"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART C-Chapter 11 Budgeting -4.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"B40FB661BB6BDB289C33DC5901307461","videoTime":3139,"videoSiteId":"E5DD260925A6084B","title":"Chapter 11 Budgeting - 4","taskType":"video","taskId":"ff8080814dad5062014dadd9c8c600a4","taskLevel":null,"id":"ff8080814816c9de01481c72c37900b5"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART C-Chapter 11 Budgeting -5.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"91E8DE809EF071389C33DC5901307461","videoTime":1930,"videoSiteId":"E5DD260925A6084B","title":"Chapter 11 Budgeting -5","taskType":"video","taskId":"ff8080814dad5062014dadd9c8d100a6","taskLevel":null,"id":"ff8080814816c9de01481c734b2e00b6"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART C-Chapter 11 课后习题.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"2C8B959113BDA6E89C33DC5901307461","videoTime":1476,"videoSiteId":"E5DD260925A6084B","title":"Chapter 11 Budgeting - 课后习题","taskType":"video","taskId":"ff8080814dad5062014dadd9c8de00a8","taskLevel":null,"id":"ff8080814816c9de01481c74be1000b7"},{"examUrl":"/exam/examination/examinationTask/8a22ecb5536522c50153746615bc000d","totalCount":10,"examenType":"chapter","difficulty":"简单","title":"ACCA F2 Management Accounting-CH11章节测评","taskType":"exam","taskId":"8a22ecb555a050580155a45a516b0221","taskLevel":null,"id":"8a22ecb5536522c50153746615bc000d"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c8e100a9","isLeaf":"true","chapterTitle":"Chapter 12 Methods of Project Appraisal","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART C-Chapter 12 Methods of Project Appraisal -1.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"C82BAA69567696679C33DC5901307461","videoTime":2218,"videoSiteId":"E5DD260925A6084B","title":"Chapter 12 Methods of Project Appraisal -1","taskType":"video","taskId":"ff8080814dad5062014dadd9c8e900aa","taskLevel":null,"id":"ff808081473905e701477c4efc3e00e5"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART C-Chapter 12 Methods of Project Appraisal -2.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"44728053028A66B79C33DC5901307461","videoTime":3023,"videoSiteId":"E5DD260925A6084B","title":"Chapter 12 Methods of Project Appraisal - 2","taskType":"video","taskId":"ff8080814dad5062014dadd9c8f500ac","taskLevel":null,"id":"ff8080814816c9de01481c770f0e00b8"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART C-Chapter 12 Methods of Project Appraisal -3.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"F4380399FDF532619C33DC5901307461","videoTime":1324,"videoSiteId":"E5DD260925A6084B","title":"Chapter 12 Methods of Project Appraisal - 3","taskType":"video","taskId":"ff8080814dad5062014dadd9c90100ae","taskLevel":null,"id":"ff8080814816c9de01481c782aad00b9"},{"examUrl":"/exam/examination/examinationTask/8a22ecb5537864ee01537939f3920013","totalCount":5,"examenType":"chapter","difficulty":"中等","title":"ACCA F2 Management Accounting-CH12章节测评 ","taskType":"exam","taskId":"8a22ecb5537864ee0153796b73660038","taskLevel":null,"id":"8a22ecb5537864ee01537939f3920013"}],"chapterFiles":null,"chapterExtends":null,"children":null}]},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c90400af","isLeaf":"false","chapterTitle":"PART D STANDARD COSTING","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c90900b0","isLeaf":"true","chapterTitle":"Chapter 13 Variance","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART D-Chapter 13 Variance -1.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"93F08943720C34F89C33DC5901307461","videoTime":1341,"videoSiteId":"E5DD260925A6084B","title":"Chapter 13 Variance -1","taskType":"video","taskId":"ff8080814dad5062014dadd9c91300b1","taskLevel":null,"id":"ff808081473905e701477c4f3eda00e6"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART D-Chapter 13 Variance -2.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"9BBCC8CB90BA4CA59C33DC5901307461","videoTime":1645,"videoSiteId":"E5DD260925A6084B","title":"Chapter 13 Variance -2","taskType":"video","taskId":"ff8080814dad5062014dadd9c91f00b3","taskLevel":null,"id":"ff8080814816c9de01481c7c1a4700ba"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART D-Chapter 13 Variance -3.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"CEB5FC762E573F649C33DC5901307461","videoTime":1592,"videoSiteId":"E5DD260925A6084B","title":"Chapter 13 Variance - 3","taskType":"video","taskId":"ff8080814dad5062014dadd9c92b00b5","taskLevel":null,"id":"ff8080814833c06701483e5e5db301b9"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART D-Chapter 13 Variance -4.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"E5CB35A593C767429C33DC5901307461","videoTime":2523,"videoSiteId":"E5DD260925A6084B","title":"Chapter 13 Variance -4","taskType":"video","taskId":"ff8080814dad5062014dadd9c93700b7","taskLevel":null,"id":"ff8080814816c9de01481c7d87d400bb"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART D-Chapter 13 Variance -5.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"0613539C0696D4019C33DC5901307461","videoTime":890,"videoSiteId":"E5DD260925A6084B","title":"Chapter 13 Variance - 5","taskType":"video","taskId":"ff8080814dad5062014dadd9c94300b9","taskLevel":null,"id":"ff8080814816c9de01481c7e1b7d00bc"},{"examUrl":"/exam/examination/examinationTask/8a22ecb5537864ee0153796d8443003c","totalCount":10,"examenType":"chapter","difficulty":"中等","title":"ACCA F2 Management Accounting-CH13章节测评 ","taskType":"exam","taskId":"8a22ecb5538784f0015388eeb1640007","taskLevel":null,"id":"8a22ecb5537864ee0153796d8443003c"}],"chapterFiles":null,"chapterExtends":null,"children":null}]},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c94600ba","isLeaf":"false","chapterTitle":"PART E PERFORMANCE","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c94b00bb","isLeaf":"true","chapterTitle":"Chapter 14 Performance Measurement","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART E-Chapter 14 Performance Measurement - 1.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"03A4A18EF8FBE5F99C33DC5901307461","videoTime":3939,"videoSiteId":"E5DD260925A6084B","title":"Chapter 14 Performance Measurement - 1","taskType":"video","taskId":"ff8080814dad5062014dadd9c95300bc","taskLevel":null,"id":"ff808081473905e701477c4f798700e7"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART E-Chapter 14 Performance Measurement - 2.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"AE3E3227632765C69C33DC5901307461","videoTime":1130,"videoSiteId":"E5DD260925A6084B","title":"Chapter 14 Performance Measurement - 2","taskType":"video","taskId":"ff8080814dad5062014dadd9c95f00be","taskLevel":null,"id":"ff808081481f98980148204138f00018"},{"examUrl":"/exam/examination/examinationTask/8a22ecb5537864ee01537d5978f30076","totalCount":10,"examenType":"chapter","difficulty":"中等","title":"ACCA F2 Management Accounting-CH14章节测评","taskType":"exam","taskId":"8a22ecb5538d2f5a015397fe0122000d","taskLevel":null,"id":"8a22ecb5537864ee01537d5978f30076"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c96200bf","isLeaf":"true","chapterTitle":"Chapter 15 Applications of Performance Measuremen","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART E-Chapter 15 Applications of Performance Measuremen -1.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"347E4DAE45B7410D9C33DC5901307461","videoTime":1863,"videoSiteId":"E5DD260925A6084B","title":"Chapter 15 Applications of Performance Measuremen -1","taskType":"video","taskId":"ff8080814dad5062014dadd9c96a00c0","taskLevel":null,"id":"ff808081473905e701477c4fb62800e8"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART E-Chapter 15 Applications of Performance Measuremen -2.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"7CA153C0382A16429C33DC5901307461","videoTime":1847,"videoSiteId":"E5DD260925A6084B","title":"Chapter 15 Applications of Performance Measuremen -2","taskType":"video","taskId":"ff8080814dad5062014dadd9c97600c2","taskLevel":null,"id":"ff808081481f9898014820435ec30019"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART E-Chapter 15 Applications of Performance Measuremen -3.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"D26E351D7715A1EF9C33DC5901307461","videoTime":2165,"videoSiteId":"E5DD260925A6084B","title":"Chapter 15 Applications of Performance Measuremen -3","taskType":"video","taskId":"ff8080814dad5062014dadd9c98200c4","taskLevel":null,"id":"ff808081481f989801482043f8e7001a"},{"examUrl":"/exam/examination/examinationTask/8a22ecb5538784f0015389055d02000b","totalCount":8,"examenType":"chapter","difficulty":"中等","title":"ACCA F2 Management Accounting-CH15章节测评","taskType":"exam","taskId":"8a22ecb5538d2f5a015397fe653a000e","taskLevel":null,"id":"8a22ecb5538784f0015389055d02000b"}],"chapterFiles":null,"chapterExtends":null,"children":null},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c98600c5","isLeaf":"true","chapterTitle":"Chapter 16 Cost Management","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART E-Chapter 16 Cost Management - 1.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"E15726995D981F359C33DC5901307461","videoTime":2402,"videoSiteId":"E5DD260925A6084B","title":"Chapter 16 Cost Management - 1","taskType":"video","taskId":"ff8080814dad5062014dadd9c98f00c6","taskLevel":null,"id":"ff808081473905e701477c4ffc0300e9"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-PART E-Chapter 16 Cost Management - 2.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"830AEA7C657A536A9C33DC5901307461","videoTime":604,"videoSiteId":"E5DD260925A6084B","title":"Chapter 16 Cost Management - 2","taskType":"video","taskId":"ff8080814dad5062014dadd9c99b00c8","taskLevel":null,"id":"ff808081481f98980148204556de001b"}],"chapterFiles":null,"chapterExtends":null,"children":null}]},{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c99f00c9","isLeaf":"false","chapterTitle":"SECTION-B-题","tasks":null,"chapterFiles":null,"chapterExtends":null,"children":[{"knowledgePointId":null,"isFree":"false","chapterId":"ff8080814dad5062014dadd9c9a400ca","isLeaf":"true","chapterTitle":"sectionB-题","tasks":[{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-sectionB-题-01.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"250C7826300434619C33DC5901307461","videoTime":1023,"videoSiteId":"E5DD260925A6084B","title":"sectionB-题-01","taskType":"video","taskId":"ff8080814dad5062014dadd9c9ac00cb","taskLevel":null,"id":"ff808081481f989801481fe53a590011"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-sectionB-题-02.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"04C5219792E0BB8B9C33DC5901307461","videoTime":978,"videoSiteId":"E5DD260925A6084B","title":"sectionB-题-02","taskType":"video","taskId":"ff8080814dad5062014dadd9c9b900cd","taskLevel":null,"id":"ff808081481f989801481fe5bd4a0012"},{"attachmentPath":"/upload/videohandout/ACCA/F2/ACCA F2 Management Accounting/02-ACCA-F2-讲义-基础-sectionB-题-03.pdf","apiKey":"3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi","videoCcid":"EC8F46CC585A92789C33DC5901307461","videoTime":1180,"videoSiteId":"E5DD260925A6084B","title":"sectionB-题-03","taskType":"video","taskId":"ff8080814dad5062014dadd9c9c500cf","taskLevel":null,"id":"ff808081481f989801481fe627d30013"}],"chapterFiles":null,"chapterExtends":null,"children":null}]}],"coverPath":"/upload/201502/a31000c03237447eb2bf91a3a3c5a18f.jpg","courseId":"ff8080814dad5062014dadd9c70d0053","outline":"","teacherName":"Amy Liu","taskNum":"70","categoryName":"ACCA","subjectName":"F2","courseIndex":3,"teacherHonor":"十年教龄，ACCA金牌讲师","availability":"","categoryId":"ff808081473905e701475cd3c2080001","bigCoverPath":"/upload/201607/3d7f89733a984454adee087d32b19122.png","chapterNum":"36","courseModuleType":"KNOWLEDGE_MODULE","aim":"<p>\r\n\t和ACCAF1－F3阶段课程相比较，F2的课程呈现以下两个特点：<span style=\"line-height:1.5;\">第一，\t理论结合应用，知识点可以各自独立出题，亦可以相互联结。</span><span style=\"line-height:1.5;\">第二，\t核算题目比重相对多于文字题目。</span><span style=\"line-height:1.5;\">那么，根据F2课程的特点，我请同学们在学习的时候一定要注意：</span><span style=\"line-height:1.5;\"></span><span style=\"line-height:1.5;\">第一，\t计算题目必须多做练习，光会做不行，必须要熟悉才可以。理论层面知识要理解消化。</span><span style=\"line-height:1.5;\">第二，\t建议大家在学习期间要按照章节顺序进行学习，不要“跳跃”学习。并且，在开始学习新的章节前，一定要先复习之间的章节。</span> \r\n</p>","teacherImage":"/upload/201606/a9b2f46ff15546bda8b26279cab91707.png","subjectId":"ff808081473905e7014762524e800072","versionId":"ff808081473905e70147626ef839007f","courseBackgroundImage":"/upload/201502/a31000c03237447eb2bf91a3a3c5a18f.jpg","subjectIndex":3,"courseName":"ACCA F2 Management Accounting","lastModifyTime":1433140}],"state":"success","msg":""}

							CAICUI.render.courseDetail = data.data[0];
							console.log(CAICUI.render.courseDetail)
							//knowledgePointId   40288af0583cbd3801583d7201c00004 40288af0583cbd3801583d8637620009 
							//  || 'ff8080814a04df96014a13042c2a2442' 
							CAICUI.render.knowledgePointIdTotal = CAICUI.render.courseDetail.knowledgePointId
							console.log(CAICUI.render.courseDetail)
							//CAICUI.render.$this.getChaptersIdArray(CAICUI.render.courseDetail);

							CAICUI.render.$this.courseDetailDone(CAICUI.render.courseDetail,callback);
						}
					})
				}
			},
			courseDetailDone : function(data,callback){
				CAICUI.render.subjectId = data.subjectId;
				CAICUI.render.categoryId = data.categoryId;

				CAICUI.render.courseName = data.courseName;
				CAICUI.render.versionId = data.versionId;
				if(callback){
					callback();
				}
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
				console.log(CAICUI.render.knowledgePointIdTotal)
				CAICUI.Request.ajax({
					'hostName' : 'http://192.168.10.134:8080',
					'server' : 'exercisePointCountCache',
					'data' : {
						'knowledge_points' : CAICUI.render.knowledgePointIdTotal,
						'type' : 6
					},
					done : function(data){
						// var data = {
					 //    "data": [{
				  //       "knowledge_point_id": "888",//知识点id
				  //       "exercise_count": 330,// 试题数量
				  //       "exercise_filename": '',// 试题id集合文件
				  //       "path_level_one_id": '',// 1级id
				  //       "path_level_two_id": '',// 2级ID
				  //       "path": '',// 知识点路径
				  //     }],
					 //    "state": "success",
					 //    "msg": ""
						// }
						if(callback){callback(data.data)}
					}
				})
			},
			exerciseKnowledgeMemberStatusAjax: function(callback){
				CAICUI.Request.ajax({
					'hostName' : 'http://192.168.10.134:8080',
					'server' : 'exerciseKnowledgeMemberStatus',
					'data' : {
						'knowledge_points' : CAICUI.render.knowledgePointIdTotal,
						'type' : 3,
						'member_id' : CAICUI.User.memberId
					},
					done : function(data){
					// 	CAICUI.render.exerciseKnowledgeMemberStatus = {
					//     "data": [{
					//         "nid": 1,//序号
					//         "create_date": 333330,// 创建时间
					//         "modify_date": '',// 修改时间
					//         "subject_id": 333330,// 科目id
					//         "category_id": '',// 证书id
					//         "course_id": 333330,// 课程id
					//         "chapter_id": '',// 章节id
					//         "member_id": 333330,// 用户id
					//         "cache_knowledge_level1_id": 'cache_knowledge_level1_id',// 知识点在知识树上的1级节点id
					//         "cache_knowledge_level2_id": 'cache_knowledge_level2_id',// 知识点在知识树上的2级节点id
					//         "cache_knowledge_path": 'cache_knowledge_path',// 知识点在知识树上的path
					//         "progress": 22,// 最大的做题进度
					//         "last_exercise_nid": '2',// 最后1次做题的nid
					//         "error_num": 333330,//错误数量 
					//         "total_time": '123123',// 耗时
					//         "knowledge_point_id": '888',// 知识点id
					//         }],
					//     "state": "success",
					//     "msg": ""
					// }
						if(callback){callback(data.data)}
					}
				})
			},
			
			courseActiveStateAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'coursestatus',
					'data' : {
						'token' : CAICUI.User.token,
						'versionId' : CAICUI.render.versionId
					},
					done : function(data){
						if(data.data[0] && data.data[0].lockStatus !== 0){
							CAICUI.render.lockStatus = true;
						}
						CAICUI.CACHE.coursestatus = data.data;
						CAICUI.render.$this.courseByInFo(data.data);
						
						if(callback){callback()};
					},
					fail : function(data){
						layer.msg('Sorry~ 获取课程授权信息失败，请刷新页面重试。', function() {});
					}
				})
			},
			courseVersionDataAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'version',
					'data' : {
						'versionId' : CAICUI.render.versionId,
					},
					done : function(data){
						CAICUI.render.courseVersion = data.data;
						if(callback){callback()};
					},
					fail : function(data){
						layer.msg('Sorry~ 网络错误，请刷新页面重试。', function() {});
					}
				})
			},
			getTasksProgressAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'getTasksProgress',
					'data' : {
						'token' : CAICUI.User.token,
						'courseId' : CAICUI.render.courseId
					},
					done : function(data){
						var chapterProgress = data.data;
						CAICUI.CACHE.getTasksProgress = data.data;
						CAICUI.render.getTasksProgress = data.data;
						if(CAICUI.render.getTasksProgress && CAICUI.render.getTasksProgress.length){
							CAICUI.render.lastLearnChapter =  _.max(CAICUI.render.getTasksProgress, function(stooge){ return stooge.createDate })
							
							var lastLearnLink = '';
							var lastLearnChapterName = '';

							if(CAICUI.render.lastLearnChapter && !CAICUI.render.lastLearnChapterName){
								lastLearnLink = '#video/'+CAICUI.render.courseId+'/'+CAICUI.render.lastLearnChapter.chapterId+'/'+ CAICUI.render.lastLearnChapter.taskId +'/'+ CAICUI.render.lastLearnChapter.progress +'?return_link=courseStudy/'+CAICUI.render.courseId+'&return_hash=on';
								lastLearnChapterName = '上次学到：<span class="lastLearn-chapterName">'+CAICUI.render.lastLearnChapter.chapterName+' </span><i class="icon icon-course-arrow-right"></i>'
							}else{
								if(CAICUI.render.lastLearnChapterLink){
									lastLearnLink = data.lastLearnChapterLink
								}else{
									if(CAICUI.render.courseDetail.chapters[0].children){
										lastLearnLink = '#video/'+CAICUI.render.courseId+'/'+CAICUI.render.courseDetail.chapters[0].children[0].chapterId+'?return_link=courseStudy/'+CAICUI.render.courseId+'&return_hash=on'
									}else{
										lastLearnLink = '#video/'+CAICUI.render.courseId+'/'+CAICUI.render.courseDetail.chapters[0].chapterId+'?return_link=courseStudy/'+CAICUI.render.courseId+'&return_hash=on'
									}
								}
								if(CAICUI.render.lastLearnChapterName){ 
									lastLearnChapterName = '上次学到：<span class="lastLearn-chapterName">'+CAICUI.render.lastLearnChapterName+' </span><i class="icon icon-course-arrow-right"></i>'
								}else{
									lastLearnChapterName = '<i class="icon icon-course-arrow-right"></i><span class="lastLearn-chapterName">开始学习本课程</span>';
								}
							}

							CAICUI.render.lastLearnChapterLink = lastLearnLink;
							CAICUI.render.lastLearnChapterName = lastLearnChapterName;
						}
						if(callback){callback()};
					},
					fail : function(){
						CAICUI.CACHE.getTasksProgress = {};
						CAICUI.render.getTasksProgress = {};
					}
				})
			},
			courseInfoAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'course_info',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.courseId
					},
					done : function(data){
						var data = data.data;
						CAICUI.CACHE.course_info = data.data;
						CAICUI.render.course_info = data.data;

						if(data.days<0){
			        CAICUI.render.courseInfoExamTime = "本科目考试时间未确定";
			      }else if(data.days==0){
			        CAICUI.render.courseInfoExamTime = "请留意,本科目<strong>今天</strong>开始考试";
			      }else{
			        CAICUI.render.courseInfoExamTime = "距本科目考试还有<strong>"+data.days+"</strong>天";
			      }

						if(callback){callback()};
					},
					fail : function(data){
						CAICUI.CACHE.course_info = {};
						CAICUI.render.course_info = {};
					}
				})
			},
			handoutAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'handout',
					'data' : {
						'token' : CAICUI.User.token,
						'courseId' : CAICUI.render.courseId
					},
					done : function(data){
						CAICUI.CACHE.handout = data.data;
						CAICUI.render.handout = data.data;
						if(callback){callback()};
					},
					fail : function(data){
						CAICUI.CACHE.handout = {};
						CAICUI.render.handout = {};
					}
				})
			},

			setTasksProgress : function(){
				var newCourseDetail = '';
				var courseProgress = storage.get('courseProgress-'+CAICUI.render.courseId);
				if(courseProgress){
					CAICUI.render.courseDetail = courseProgress
				}else{
					newCourseDetail = CAICUI.render.courseDetail;
					var getTasksProgress = CAICUI.render.getTasksProgress;
					_.each(newCourseDetail.chapters,function(element1,index1){
						if(element1.children){
							_.each(element1.children,function(element2,index2){
								if(element2.children){
									_.each(element2.children,function(element3,index3){
										if(element3.tasks){
											_.each(element3.tasks,function(element4,index4){
												_.each(CAICUI.CACHE.getTasksProgress,function(element5,index5){
													if(element4.taskId == element5.taskId){
														newCourseDetail['chapters'][index1]['children'][index2]['children'][index3]['tasks'][index4].progress = element5.progress;
														newCourseDetail['chapters'][index1]['children'][index2]['children'][index3]['tasks'][index4].total = element5.total;
													}
												})
											});
										}
									});
								}else if(element2.tasks){
									_.each(element2.tasks,function(element3,index3){
										_.each(CAICUI.CACHE.getTasksProgress,function(element4,index4){
											if(element3.taskId == element4.taskId){
												newCourseDetail['chapters'][index1]['children'][index2]['tasks'][index3].progress = element4.progress;
												newCourseDetail['chapters'][index1]['children'][index2]['tasks'][index3].total = element4.total;
											}
										})
									});
								}
							})
						}else{
							if(element1.tasks){
								_.each(element1.tasks,function(element3,index3){
									_.each(CAICUI.CACHE.getTasksProgress,function(element4,index4){
										if(element3.taskId == element4.taskId){
											newCourseDetail['chapters'][index1]['tasks'][index3].progress = element4.progress;
											newCourseDetail['chapters'][index1]['tasks'][index3].total = element4.total;
										}
									})
								})
							}
						}
					})
					CAICUI.render.courseDetail = newCourseDetail;
					storage.setsingle('courseProgress-' + CAICUI.render.courseId, newCourseDetail);
				}
				
			},
			courseByInFo : function(courseinfo){
				var courseActiveState=0;//默认未购买
				if($.isArray(courseinfo)){
					for(var i=0;i<courseinfo.length;i++){
						if(courseinfo[i].courseId == CAICUI.render.courseId && courseinfo[i].activeState!="init"){
							CAICUI.render.courseActiveTime = courseinfo[i].activeTime;
						}
					}
					var datanow=Date.parse(new Date())/1000;//当前时间戳
					for(var i=0;i<courseinfo.length;i++){

						if(courseinfo[i].activeState=="acitve" && courseinfo[i].expirationTime>datanow && courseActiveState<3){
							courseActiveState=3;//已激活未过期
							break;
						}else if(courseinfo[i].activeState=="init" && courseActiveState<2){
							courseActiveState=2;//未激活
						}else if(courseinfo[i].activeState=="acitve" && courseinfo[i].expirationTime<datanow && courseActiveState<1){
							courseActiveState=1;//已激活已过期
						}
						
					}
					if(CAICUI.render.lockStatus){
						courseActiveState=4;
					}
				}	
				//course.getinitdata=true;
				CAICUI.render.courseDetail.courseActiveState = courseActiveState;

				//更新缓存的课程数据
				//storage.setsingle('course-'+CAICUI.render.courseId,CAICUI.render.courseDetail);
			},
			openVideo : function(e){
				var courseActiveState = CAICUI.render.courseDetail.courseActiveState;
				var that = CAICUI.iGlobal.getThat(e);
				var thatLink = that.attr('link');
				if(thatLink != 'javascript:;'){

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
						layer.msg('Sorry~ 您当前的课程已过期', function() {});
					}else if(courseActiveState == 0){
						layer.msg('Sorry~ 您未购买当前的课程', function() {});
					}
				}
		    // course.comfromurl=1;
			},
			openQuestions : function(e){
				e.stopPropagation();
				var that = CAICUI.iGlobal.getThat(e);
				//window.location.hash = '#questions/'+knowledgepointid;
				CAICUI.render.chapterId = that.attr('data-chapterId');
				CAICUI.render.chapterName = that.attr('data-chapterName');
				CAICUI.render.knowledgepointid = that.attr('data-knowledgepointid');


				CAICUI.render.cacheKnowledgeLevel1Id = that.attr('data-cache-knowledge-level1-id');
				CAICUI.render.cacheKnowledgeLevel2Id = that.attr('data-cache-knowledge-level2-id');
				CAICUI.render.cacheKnowledgePath = that.attr('data-cache-knowledge-path');

				CAICUI.render.errorNum = that.attr('data-errornum') || 0;
				CAICUI.render.lastExerciseNid = that.attr('data-last-exercise-nid') || 0;
				CAICUI.render.ExerciseProgress = that.attr('data-exercise-progress') || 0;
				CAICUI.render.ExerciseTotalTime = that.attr('data-exercise-total-time') || 0;

				CAICUI.render.exerciseFilename = that.attr('data-exercise-filename');
				CAICUI.render.exerciseCount = that.attr('data-exercise-count');
				this.addAnimate(function(){
					var Questions = new questions;
					Questions.render()
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
				if(CAICUI.CACHE.Learningcourse && CAICUI.CACHE.RecentCourse){
					for(var i=0;i<CAICUI.CACHE.Learningcourse.length;i++){
						if(CAICUI.CACHE.Learningcourse[i].courseId == courseId){
							var addLearningCourse = true;
							for(var j=0;j<CAICUI.CACHE.RecentCourse.length;j++){
								if(CAICUI.CACHE.RecentCourse[j].courseId == courseId){
									addLearningCourse = false;
								}
							}
							if(addLearningCourse){
								CAICUI.CACHE.RecentCourse.push(CAICUI.CACHE.Learningcourse[i]);
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
				if(courseVersionList.hasClass('active')){
					courseVersionList.removeClass('active');
				}else{
					courseVersionList.addClass('active');
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
			courseChange : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				that.toggleClass('active');
				$('.option-ul').toggleClass('active');
				//$('.courseVersion-list').removeClass('active');
			},
			
			courseNavToggle : function(e){
				var currentTarget = e.currentTarget;
				var that = $(currentTarget);
				var parent = that.parent();
				CAICUI.render.courseId = that.attr('data-courseid');
				parent.toggleClass('active');
				window.CAICUI.myScroll.refresh();
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
		});
		return Studycenter;
	});





