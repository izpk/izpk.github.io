;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-course-resources').html()),
			events : {
				'click .js-course-resources-change' : 'courseChange',
				'click .courseResources-li' : 'courseResourcesList'
			},
			render : function(courseId){
				CAICUI.render.this = this;
				CAICUI.render.courseId = courseId;
				CAICUI.render.subjectId = '';
				CAICUI.render.versionId = '';
				CAICUI.render.resources = [];
				CAICUI.render.courseBaseInfoAjaxCount = 0;
				this.$el.html(this.template({
					'data' : ''
				}));
				CAICUI.iGlobal.getTemplateCourseNav('body .courseIndex-header-right',{
					"courseType" : 'classCourse',
					"type" : 'resources',
					"courseId" : CAICUI.render.courseId
				});
				CAICUI.render.this.coursesBaseInfoAjax(function(data){
					$('body .course-change').attr('title',CAICUI.render.courseName);
					$('body .course-name').text(CAICUI.render.courseName);
					if(CAICUI.render.versionId){
						CAICUI.render.this.getListByIdAjax(function(data){
							var templateHtml = $('#template-course-resources-list').html();
							var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
								"data" : data
							});
							$('body #scroller').html(addHtml);
							window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
						})
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
						CAICUI.render.this.learningcourseAjax(function(){
							if(CAICUI.render.courseNameArray && CAICUI.render.courseNameArray.length){

							}else{

							}
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
			coursesBaseInfoAjax : function(callback){
				CAICUI.Request.ajax({
						'server' : 'coursesBaseInfo',
						'data' : {
							'idType' : '0',
							'courseId' : CAICUI.render.courseId
						},
						done : function(data){
							if(data.state == "success"){
								// CAICUI.render.childKnowledgeNodePointList = data.data;
								// if(callback){callback(data)};

								if(data.data && data.data.length){
									var coursesBaseInfo = data.data[0];
									CAICUI.render.subjectId = coursesBaseInfo.subjectId;
									CAICUI.render.courseName = coursesBaseInfo.courseName;
									CAICUI.render.versionId = coursesBaseInfo.versionId;
								}
								if(callback){callback(data)};
								
							}else{
								if(CAICUI.render.courseBaseInfoAjaxCount<2){
									CAICUI.render.courseBaseInfoAjaxCount++;
									CAICUI.render.this.coursesBaseInfoAjax(callback);
								}else{
									layer.msg('Sorry~ 网络异常，请刷新页面重试。', function() {});
								}
							}
						},
						fail : function(data){
							if(CAICUI.render.courseBaseInfoAjaxCount<2){
								CAICUI.render.courseBaseInfoAjaxCount++;
								CAICUI.render.this.coursesBaseInfoAjax(callback);
							}else{
								layer.msg('Sorry~ 网络异常，请刷新页面重试。', function() {});
							}
						}

					})
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
			getListByIdAjax : function(callback){
				var ajaxNum = 2;
				var ajaxDoneNum = 0;
				var ajaxInterval = '';
				var ajaxData = []
				CAICUI.Request.ajax({
					'server' : 'getListById',
					'data' : {
						'id' : CAICUI.render.subjectId,
						'type' : 'subject'
					},
					done : function(data){
						ajaxDoneNum++;
						CAICUI.render.subjectData = data.data;
					}
				})
				CAICUI.Request.ajax({
					'server' : 'getListById',
					'data' : {
						'id' : CAICUI.render.versionId,
						'type' : 'course'
					},
					done : function(data){
						ajaxDoneNum++;
						CAICUI.render.versionData = data.data;
					}
				})
				ajaxInterval = setInterval(function(){
					if(ajaxNum == ajaxDoneNum){
						clearInterval(ajaxInterval);
						CAICUI.render.subjectData.forEach(function(item){
							ajaxData.push(item);
						})
						CAICUI.render.versionData.forEach(function(item){
							ajaxData.push(item);
						})
						CAICUI.render.resources = ajaxData;
						if(callback){callback(ajaxData)};
					}
				},300)
			},
			getDetailByIdAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'getDetailById',
					'data' : {
						'resourceId' : CAICUI.render.detailById
					},
					done : function(data){
					
						CAICUI.render.getDetailById = data.data;
						
						if(callback){callback(data)};
					},
					fail : function(data){
							
							CAICUI.render.getDetailById = data.data;
							
							if(callback){callback(data)};
					}
				})
			},
			courseResourcesList : function(e){
				CAICUI.iGlobal.loading('body .courseResources-right',{'height':$('#wrapper').height()+'px'});
				var that = CAICUI.iGlobal.getThat(e);
				var index = that.index();
				that.siblings().removeClass('active');
				that.addClass('active');
				CAICUI.render.detailById = CAICUI.render.resources[index].id;
				CAICUI.render.this.getDetailByIdAjax(function(data){
					var templateHtml = $('#template-course-resources-content').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,data);
					$('body .courseResources-right').html(addHtml);
					window.CAICUI.myScrollRight = CAICUI.iGlobal.iScroll('body #course-resources-wrapper');
				});
			}
		});
		return Studycenter;
	});