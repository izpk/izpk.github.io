;define([
	'jquery',
	'underscore',
	'backbone',
	'storage',
	'layer'
	],function($, _, Backbone, storage, layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-course-courseStudy').html()),
			events : {
				// 'mouseleave .courseIndex-ul' : 'courseNavUlLeave',
				// 'mouseenter .courseIndex-li' : 'courseNavLiEnter',
				// 'mouseleave .courseIndex-li' : 'courseNavLiLeave',
				'click .js-course-list-link' : 'openVideo',
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

				CAICUI.render.courseId = courseId;
				CAICUI.render.isCoursePay = false;
				
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

				CAICUI.render.$this.$el.html(CAICUI.render.$this.template({
					'data' : {
						'courseId' : CAICUI.render.courseId
					}
				}));

				CAICUI.render.$this.handoutAjax(function(){
					$('body .icon-handout-down').attr('href', CAICUI.Common.host.img + CAICUI.render.handout.path)
				});
				CAICUI.render.$this.courseInfoAjax(function(){
					// var templateHtml = $('#template-courseStudy-courseInfo').html();
					// var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					// 	"data" : {
					// 		"course_info" : CAICUI.render.course_info,
					// 		"lastLearnChapter" : CAICUI.render.lastLearnChapter,
					// 		"lastLearnChapterLink" : CAICUI.render.lastLearnChapterLink,
					// 		"lastLearnChapterName" : CAICUI.render.lastLearnChapterName,
					// 		"courseId" : CAICUI.render.courseId,
					// 		"courseDetail" : CAICUI.render.courseDetail,
					// 		"courseInfo" : CAICUI.render.courseInfo
					// 	}
					// });
					// $('body .courseIndex-content-right').html(addHtml);
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
							var templateHtml = $('#template-courseStudy-taskList').html();
							var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
								"data" : {
									"courseId" : CAICUI.render.courseId,
									"courseDetail" : CAICUI.render.courseDetail
								}
							});
							$('body .scroller').html(addHtml);
							window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
							CAICUI.render.courseIndexTips = setTimeout(function(){
								$('body .courseIndex-content-tips').animate({
									height: 0},
									500, function() {
										$('body .courseIndex-content-tips').remove();
										window.CAICUI.myScroll.refresh();
								});
							},20000)
						});

						CAICUI.render.$this.courseVersionDataAjax(function(){
							var templateHtml = $('#template-courseStudy-courseVersionList').html();
							var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
								"courseVersion" : CAICUI.render.courseVersion,
								"courseActiveTime" : CAICUI.render.courseActiveTime
							});
							$('body .courseVersion-list').html(addHtml);
						});

						CAICUI.render.$this.getTasksProgressAjax(function(){
							
							$('.lastLearn').attr('href', CAICUI.render.lastLearnChapterLink);
							$('.lastLearn').html(CAICUI.render.lastLearnChapterName);

							$('.continue-learning').attr('href', CAICUI.render.lastLearnChapterLink);
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
					CAICUI.render.$this.courseDetailDone(courseProgress,callback);
				}else{
					CAICUI.Request.ajax({
						'server' : 'courseDetail',
						'data' : {
							'courseId' : CAICUI.render.courseId
						},
						done : function(data){
							storage.setsingle('course-' + CAICUI.render.courseId, data.data[0]);
							CAICUI.render.$this.courseDetailDone(data.data[0],callback);
						}
					})
				}
			},
			courseDetailDone : function(data,callback){
				CAICUI.render.courseDetail = data;
				CAICUI.render.courseName = data.courseName;
				CAICUI.render.courseDetail = data;
				CAICUI.render.versionId = data.versionId;
				if(callback){
					callback();
				}
			},
			courseActiveStateAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'coursestatus',
					'data' : {
						'token' : CAICUI.User.token,
						'versionId' : CAICUI.render.versionId
					},
					done : function(data){
						if(data.data[0].lockStatus !== 0){
							CAICUI.render.lockStatus = true;
						}
						CAICUI.CACHE.coursestatus = data.data;
						CAICUI.render.$this.courseByInFo(data.data);
						console.log(data.data[0].lockStatus)
						
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
					console.log(CAICUI.render.lockStatus)
					if(CAICUI.render.lockStatus){
						courseActiveState=4;
					}
				}	
				//course.getinitdata=true;
				CAICUI.render.courseDetail.courseActiveState = courseActiveState;

				console.log(CAICUI.render.courseDetail)
				//更新缓存的课程数据
				storage.setsingle('course-'+CAICUI.render.courseId,CAICUI.render.courseDetail);
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





