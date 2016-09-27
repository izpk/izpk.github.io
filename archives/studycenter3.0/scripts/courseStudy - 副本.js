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
				this.$header = this.$('.courseIndex-header');
				this.$courseNavUl = this.$('.courseIndex-ul');
				this.$courseNavLi = this.$('.courseIndex-li');
				this.$courseIndexActiveBox = this.$('.courseIndex-active-box');
				this.courseNavPreDefault = 0;
				this.courseNavPre = 0;
				this.courseNavAnimateTime = 300;

				CAICUI.render.lastLearnChapter = '';
				

				CAICUI.render.courseId = courseId;
				CAICUI.render.courseName = '';
				
				CAICUI.render.serverTotal = 7;
				CAICUI.render.serverNum = 0;
				
				this.$learningcourse = '';
				this.learningcourse();

				this.$courseDetail = '';
				this.courseDetail(courseId);
				
				this.$getTasksProgress = '';
				this.getTasksProgress();

				this.$handout = '';
				this.handout();
				
				this.$course_info = '';
				this.course_info();

				this.$courseActiveState = '';
				CAICUI.render.versionId = '';
				CAICUI.render.$courseInfo = '';
				CAICUI.render.courseVersion = '';
				CAICUI.render.courseActiveTime = '';

				CAICUI.render.timer = setInterval(function(){
					if(CAICUI.render.serverTotal==CAICUI.render.serverNum){
						clearInterval(CAICUI.render.timer);
						_.each(CAICUI.CACHE.Learningcourse,function(element, index, list){
							if(element.courseId == CAICUI.render.courseId){
								CAICUI.render.$courseInfo = list[index];
								return false;
							}
						});
						CAICUI.render.$this.setTasksProgress();
						var filterLearningcourse = CAICUI.render.$this.filterLearningcourse(CAICUI.CACHE.Learningcourse);
						
						if(CAICUI.render.$this.$getTasksProgress && CAICUI.render.$this.$getTasksProgress.length){
							CAICUI.render.lastLearnChapter =  _.max(CAICUI.render.$this.$getTasksProgress, function(stooge){ return stooge.createDate })
						}
						CAICUI.render.$this.$el.html(CAICUI.render.$this.template({
							'data' : {
								'courseId' : CAICUI.render.courseId,
								'learningcourse' : filterLearningcourse,
								'courseDetail' : CAICUI.render.$this.$courseDetail,
								'getTasksProgress' : CAICUI.render.$this.$getTasksProgress,
								'lastLearnChapter' : CAICUI.render.lastLearnChapter,
								'lastLearnChapterName' : CAICUI.render.lastLearnChapterName,
								'lastLearnChapterLink' : CAICUI.render.lastLearnChapterLink,
								'courseInfo' : CAICUI.render.$courseInfo,
								'handout' : CAICUI.render.$this.$handout,
								'course_info' : CAICUI.render.$this.$course_info,
								'courseVersion' : CAICUI.render.courseVersion,
								'courseActiveTime' : CAICUI.render.courseActiveTime
							}
						}));
						CAICUI.render.courseIndexTips = setTimeout(function(){
							$('body .courseIndex-content-tips').animate({
								height: 0},
								500, function() {
									$('body .courseIndex-content-tips').remove();
									window.CAICUI.myScroll.refresh();
							});
						},20000)

						var courseProgress = $('.course-progress-show').attr('data-course-progress');
						$('.course-progress-show').animate({
							'width': courseProgress+'%'},
							1000);
						window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
						
					}
				},500);
			},
			learningcourse : function(){
				CAICUI.Request.ajax({
					'server' : 'learningcourse',
					'data' : {
						'token' : CAICUI.User.token,
						'pageNo' : 0,
						'pageSize' : CAICUI.defaultPageSize
					},
					done : function(data){
						console.log(data);
						CAICUI.render.serverNum ++;
						CAICUI.CACHE.Learningcourse = data.data.courselist;
					},
					fail : function(){
						CAICUI.render.serverNum ++;
						CAICUI.CACHE.Learningcourse = {};
						CAICUI.CACHE.RecentCourse = {};
					}
				})
			},
			courseDetail : function(courseId){
				var isAjax = true;
				
				var courseProgress = storage.get('courseProgress-'+CAICUI.render.courseId);
				if(courseProgress){
					CAICUI.render.serverNum ++;

					CAICUI.render.courseName = courseProgress.courseName;
					CAICUI.render.$this.$courseDetail = courseProgress;
					CAICUI.render.versionId = courseProgress.versionId;
					CAICUI.render.$this.courseActiveState(courseProgress.versionId);
					CAICUI.render.$this.courseVersionData(courseProgress.versionId);
				}else{
						CAICUI.Request.ajax({
							'server' : 'courseDetail',
							'data' : {
								'courseId' : courseId
							},
							done : function(data){
								CAICUI.render.serverNum ++;
								CAICUI.render.courseName = data.data[0].courseName;
								CAICUI.render.$this.$courseDetail = data.data[0];
								storage.setsingle('course-' + courseId, data.data[0]);
								CAICUI.render.versionId = data.data[0].versionId;
								CAICUI.render.$this.courseActiveState();
								CAICUI.render.$this.courseVersionData(CAICUI.render.versionId);
							}
						})
				}
			},
			getTasksProgress : function(){
				CAICUI.Request.ajax({
					'server' : 'getTasksProgress',
					'data' : {
						'token' : CAICUI.User.token,
						'courseId' : CAICUI.render.courseId
					},
					done : function(data){
						CAICUI.render.serverNum ++;
						var chapterProgress = data.data;
						CAICUI.CACHE.getTasksProgress = data.data;
						CAICUI.render.$this.$getTasksProgress = data.data;
					},
					fail : function(){
						CAICUI.render.serverNum ++;
						CAICUI.CACHE.getTasksProgress = {};
						CAICUI.render.$this.$getTasksProgress = {};
					}
				})
			},
			course_info : function(){
				
					CAICUI.Request.ajax({
						'server' : 'course_info',
						'data' : {
							'token' : CAICUI.User.token,
							'id' : CAICUI.render.courseId
						},
						done : function(data){
							CAICUI.render.serverNum ++;
							CAICUI.CACHE.course_info = data.data;
							CAICUI.render.$this.$course_info = data.data;
						},
						fail : function(data){
							CAICUI.render.serverNum ++;
							CAICUI.CACHE.course_info = {};
							CAICUI.render.$this.$course_info = {};
						}
					})
			},
			handout : function(){
					CAICUI.Request.ajax({
						'server' : 'handout',
						'data' : {
							'token' : CAICUI.User.token,
							'courseId' : CAICUI.render.courseId
						},
						done : function(data){
							CAICUI.render.serverNum ++;
							CAICUI.CACHE.handout = data.data;
							CAICUI.render.$this.$handout = data.data;
						},
						fail : function(data){
							CAICUI.render.serverNum ++;
							CAICUI.CACHE.handout = {};
							CAICUI.render.$this.$handout = {};
						}
					})
			},
			courseActiveState : function(id){
					CAICUI.Request.ajax({
						'server' : 'coursestatus',
						'data' : {
							'token' : CAICUI.User.token,
							'versionId' : id ? id :CAICUI.render.versionId
						},
						done : function(data){
							CAICUI.render.serverNum ++;
							CAICUI.CACHE.coursestatus = data.data;
							if(data.state=="success"){
								CAICUI.render.$this.courseByInFo(data.data);
								if(data.data && data.data.length){
								}else{
								}
							}else{
								layer.msg('Sorry~ 获取课程授权信息失败，请刷新页面重试。', function() {});
								course.courseActiveState=999;
							}
						},
						fail : function(data){
							layer.msg('Sorry~ 获取课程授权信息失败，请刷新页面重试。', function() {});
						}
					})
			},
			courseVersionData : function(versionId){
				CAICUI.Request.ajax({
					'server' : 'version',
					'data' : {
						'versionId' : versionId,
					},
					done : function(data){
						CAICUI.render.serverNum ++;
						CAICUI.render.courseVersion = data.data;
					},
					fail : function(data){
						CAICUI.render.serverNum ++;
						layer.msg('Sorry~ 网络错误，请刷新页面重试。', function() {});
					}
				})
			},



			setTasksProgress : function(){
				var newCourseDetail = '';
				var courseProgress = storage.get('courseProgress-'+CAICUI.render.courseId);
				if(courseProgress){
					CAICUI.render.$this.$courseDetail = courseProgress
				}else{
					newCourseDetail = CAICUI.render.$this.$courseDetail;
					var getTasksProgress = CAICUI.render.$this.$getTasksProgress;
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
						//alert(datanow +'v'+ courseinfo[i].expirationTime+"|"+courseinfo[i].activeState+"|"+course.courseActiveState);
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
				//course.getinitdata=true;
				CAICUI.render.$this.$courseDetail.courseActiveState = courseActiveState;

				console.log(CAICUI.render.$this.$courseDetail)
				//更新缓存的课程数据
				storage.setsingle('course-'+CAICUI.render.courseId,CAICUI.render.$this.$courseDetail);
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
			openVideo : function(e){
				var courseActiveState = CAICUI.render.$this.$courseDetail.courseActiveState;
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
					if(courseActiveState == 2){
						layer.msg('Sorry~ 您当前的课程未激活', function() {});
					}else if(courseActiveState == 1){
						layer.msg('Sorry~ 您当前的课程已过期', function() {});
					}else if(courseActiveState == 0){
						layer.msg('Sorry~ 您未购买当前的课程', function() {});
					}
				}
		    // course.comfromurl=1;
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
				this.$courseNavLi.eq(this.courseNavPre).addClass('hover');
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





