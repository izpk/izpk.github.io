;define([
	'jquery',
	'underscore',
	'backbone',
	'datetimepicker',
	'datetimepickerZHCN'
	],function($, _, Backbone, datetimepicker, datetimepickerZHCN){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'div',
			className : 'course-content',
			// el : 'body #right',
			template : _.template($('#template-course-activated').html()),
			events : {
				// "mouseenter .studyin-content-subjects" : "subjectEnter",
				// "mouseleave .studyin-content-subjects" : "subjectLeave",
				"click .studyin-content-subjects" : "subjectClick",
				// "click .studyin-content-header" : "iconClick",
				"click .studyin-type" : "typeClick",
				"click .js-apply-hearing" : "applyHearing",
				"click .courseActivated-pop-close" : "applyHearingClose",
				"change .courseActivated-pop-select1" : "changeCourseActivatedType",
				"change .courseActivated-pop-select2" : "changeExamTime",
				"change .courseActivated-pop-select4" : "changeNextExamTime",
				"click .courseActivated-pop-button" : "applyHearingBtn",
				"change #uploadForm-file" : "uploadFormFile",
				"click .add-photo-remove" : "removeUploadFormFile"
			},
			render : function(){
				this.$el.html(this.template());
				CAICUI.render.courseActivated = this;
				CAICUI.render.examState = 1;
				CAICUI.render.clickCategoryId = '';
				CAICUI.render.clickSubjectId = '';
				CAICUI.render.courseActivatedLoading = false;

				CAICUI.render.serverTotal = 2;
				CAICUI.render.serverNum = 0;
				this.expirationcourseAjax();
				this.applyrestudylistAjax();
				CAICUI.render.timer = setInterval(function(){
					if(CAICUI.render.serverTotal==CAICUI.render.serverNum){
						clearInterval(CAICUI.render.timer);
						var courseArr = [];
						for(var i=0;i<CAICUI.CACHE.expirationcourse.length;i++){
							courseArr.push(CAICUI.CACHE.expirationcourse[i].courseId);
						}
						CAICUI.render.courseActivated.actionGetCourseProgressAjax(courseArr,function(){
							var filterExpirationcourse = CAICUI.render.courseActivated.filterExpirationcourse();
							var filterApplyrestudylist = CAICUI.render.courseActivated.filterApplyrestudylist();
							console.log(filterExpirationcourse)
							console.log(filterApplyrestudylist)
							var templateHtml = $('#template-course-activated-list').html();
							var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
								'expirationcourse' : filterExpirationcourse,
								'applyrestudylist' : filterApplyrestudylist
							});
							$('body .course-content').html(addHtml);
							
							// CAICUI.render.courseActivated.$el.html(CAICUI.render.courseActivated.template({
							// 	'data' : data
							// }));
							$('.current-progress').each(function(){
								var that = $(this);
								var progress = parseInt(that.attr('data-progress'));
								if(progress){
									that.addClass('active');
									that.animate({
										width: (progress/100)*90
									},1000);
								}
							});
							window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
							CAICUI.render.courseActivated.memberAjax();

							$('body .courseActivated-pop-select2').datetimepicker({
				        language:  'zh-CN',
				        // startDate : new Date(),
				        weekStart: 1,
				        todayBtn:  1,
								autoclose: 1,
								todayHighlight: 1,
								startView: 2,
								minView: 2,
								forceParse: 0
						  }).on('changeDate', function(ev){
						  	CAICUI.render.testDate = parseInt(ev.date.valueOf()/1000);
							});
						});
					}
				},CAICUI.render.time)
				return this;
			},
			
			expirationcourseAjax : function(){
				CAICUI.Request.ajax({
					'server' : 'expirationcourse',

					'data' : {
						'token' : CAICUI.User.token,
						'pageNo' : 0,
						'pageSize' : CAICUI.defaultPageSize
					},
					done : function(data){
						CAICUI.render.serverNum++;
						CAICUI.CACHE.expirationcourse = data.data.courselist;
					}
				})
			},
			applyrestudylistAjax : function(){
				CAICUI.Request.ajax({
					'server' : 'applyrestudylist',
					'data' : {
						'memberId' : CAICUI.User.memberId
					},
					done : function(data){
						CAICUI.render.serverNum++;
						CAICUI.CACHE.applyrestudylist = data.data;
					},
					fail : function(ret){
						CAICUI.render.serverNum++;
						CAICUI.CACHE.actionGetCourseProgress = [];
					}
				})
			},
			actionGetCourseProgressAjax : function(courseArr, callback){
				CAICUI.Request.ajax({
					'server' : 'actionGetCourseProgress',
					'data' : {
						'token' : CAICUI.User.token,
						'memberId' : CAICUI.User.memberId,
						'courseId' : courseArr.toString()
					},
					done : function(ret){
						
						CAICUI.CACHE.actionGetCourseProgress = ret.data;
						if(callback){callback()};
					}
				});
			},
			memberAjax : function(){
				CAICUI.Request.ajax({
					'server' : 'member',
					'data' : {
						'token' : CAICUI.User.token
					},
					done : function(data){
						if(data.data.mobile){
							CAICUI.User.mobile = data.data.mobile;
						}else if(data.data.email){
							CAICUI.User.mobile = data.data.email;
						}

						
					},
					fail : function(data){
						
					}
				});
			},
			filterExpirationcourse : function(){
				for(var i=0;i<CAICUI.CACHE.expirationcourse.length;i++){
					for(var j=0;j<CAICUI.CACHE.actionGetCourseProgress.length;j++){
						if(CAICUI.CACHE.expirationcourse[i].courseId == CAICUI.CACHE.actionGetCourseProgress[j].courseId){

							CAICUI.CACHE.expirationcourse[i].courseProgress = CAICUI.CACHE.actionGetCourseProgress[j].courseProgress;
	            CAICUI.CACHE.expirationcourse[i].createDate = CAICUI.CACHE.actionGetCourseProgress[j].createDate;

	            CAICUI.CACHE.expirationcourse[i].chapterId = CAICUI.CACHE.actionGetCourseProgress[j].chapterId;
	            CAICUI.CACHE.expirationcourse[i].chapterName = CAICUI.CACHE.actionGetCourseProgress[j].chapterName;
	            CAICUI.CACHE.expirationcourse[i].progress = CAICUI.CACHE.actionGetCourseProgress[j].progress;
	            CAICUI.CACHE.expirationcourse[i].taskId = CAICUI.CACHE.actionGetCourseProgress[j].taskId;
	            CAICUI.CACHE.expirationcourse[i].taskName = CAICUI.CACHE.actionGetCourseProgress[j].taskName;
						}
					}
				}
				var stooges = CAICUI.CACHE.expirationcourse;
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
					courseLists[i].newList = [];
					var stooge = courseLists[i].list;
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
								if(courseLists[i].newList[j].list && courseLists[i].newList[j].list.length){
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
									courseLists[i].newList[j].courseCategoryId= element.subjectID;
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
				return {
					"courseListNav" : courseListNav,
					"courseLists" : courseLists
				}
			},
			filterApplyrestudylist : function(){
				var newApplyrestudylist = [];
				if(CAICUI.CACHE.applyrestudylist && CAICUI.CACHE.applyrestudylist.length){
					for(var i=0;i<CAICUI.CACHE.applyrestudylist.length;i++){
						var thisData = CAICUI.CACHE.applyrestudylist[i];
						if(thisData.auditState != 1){
							if(newApplyrestudylist.length){
								var isAdd = false;
								var isAddList = false;
								for(var j=0;j<newApplyrestudylist.length;j++){
									
									if(thisData.courseCategoryId == newApplyrestudylist[j].courseCategoryId){
										// newApplyrestudylist[j].list.push(thisData)
										isAddList = true;
										break;
									}else{
										isAdd = true;
										break;
									}
								}
								if(isAdd){
									newApplyrestudylist.push({
										"courseCategoryId" : thisData.courseCategoryId,
										"auditState" : thisData.auditState,
										"auditTime" : thisData.auditTime,
										"list" : [thisData]
									})
								}
								if(isAddList){
									newApplyrestudylist[j].list.push(thisData)
									var auditTime = 0;

									if(thisData.auditState){
										auditTime = thisData.auditTime;
									}else{
										auditTime = thisData.createDate;
									}
									if(auditTime>newApplyrestudylist[j].auditTime){
										newApplyrestudylist[j].auditTime = auditTime;
									}
								}
							}else{
								newApplyrestudylist.push({
									"courseCategoryId" : thisData.courseCategoryId,
									"auditState" : thisData.auditState,
									"auditTime" : thisData.auditTime,
									"list" : [thisData]
								})
							}
						}
					}
				}
				return newApplyrestudylist;
			},
			newFilterApplyrestudylist : function(){
				var newApplyrestudylist = [];
				if(CAICUI.CACHE.applyrestudylist && CAICUI.CACHE.applyrestudylist.length){
				for(var i=0;i<CAICUI.CACHE.applyrestudylist.length;i++){
					var thisData = CAICUI.CACHE.applyrestudylist[i];
					if(newApplyrestudylist.length){
						var isReplace = -1;
						var replaceIndex = 0;
						var isAdd = false;
						var addIndex = 0;
						for(var j=0;j<newApplyrestudylist.length;j++){
							
							if(thisData.courseCategoryId == newApplyrestudylist[j].courseCategoryId){

								var thisAuditTime = thisData.auditState ? thisData.auditTime : thisData.createDate;
								var newAuditTime = newApplyrestudylist[j].auditState ? newApplyrestudylist[j].auditTime : newApplyrestudylist[j].createDate;
								if(thisAuditTime >= newAuditTime){
									isReplace = true;
									replaceIndex = j;
									
								}else{
									isAdd = false;
								}
								break;
							}else{
								isAdd = true;
								break;
							}
						}
						if(thisData.courseCategoryId == 'ff808081473905e701475d4ec4d60006'){
							console.log(isAdd)
							console.log(replaceIndex)
							console.log(thisData);
						}
						
						if(isAdd){
							newApplyrestudylist.push(thisData)
				  	}else if(isReplace){
							newApplyrestudylist[replaceIndex] = thisData;
				  	}
					}else{
						newApplyrestudylist.push(thisData)
					}		
				}
				// var newApplyrestudylist = [];
				// for(var i=0;i<CAICUI.CACHE.applyrestudylist.length;i++){
				// 	var thisData = CAICUI.CACHE.applyrestudylist[i];
				// 	if(newApplyrestudylist.length){
				// 		var replace = -1;
				// 		for(var j=0;j<newApplyrestudylist.length;j++){
				// 			if(thisData.courseCategoryId == newApplyrestudylist[j].courseCategoryId && thisData.auditTime > newApplyrestudylist[j].auditTime){
				// 				replace = j;
				// 			}
				// 		}
				// 		if(replace > -1 ){
				// 			newApplyrestudylist[replace] = thisData;
				// 		}
				// 	}else{
				// 		newApplyrestudylist.push(thisData)
				// 	}		
				// }
				}
				for(var i=0;i<newApplyrestudylist.length;i++){
					if(newApplyrestudylist[i].courseCategoryId == 'ff808081473905e701475d4ec4d60006'){
						console.log(newApplyrestudylist[i])
					}
				}
				return newApplyrestudylist;
			},
			subjectEnter : function(e){
				var current = e.currentTarget;
				var oSubject = $(current);
				var oIndex = oSubject.index();
				var	oMask = oSubject.find(".subject-lf").find(".subject-mask");
				var oSubjectRt = oSubject.find(".subject-rt");
				oMask.stop(true,false).animate({
					"left" : "0"
				});
				var oCurrentSubject= {
					"mask" : oMask,
					"rt" : oSubjectRt
				};
				return oCurrentSubject;
			},
			subjectLeave : function(e){
				var oMaskLeave = this.subjectEnter(e)["mask"];
				oMaskLeave.stop(true,false).animate({
					"left" : "-160px"
				})
			},
			subjectClick : function(e){
				var oSubjectClick = this.subjectEnter(e)["rt"];
				oSubjectClick.parent().parent().addClass("active").siblings().removeClass("active");
			},
			iconClick : function(e){
				var current = e.currentTarget;
				var oIcon = $(current);
				oIcon.find('.subject-type-rt').toggleClass("stop");
				oIcon.next(".studyin-content-subject").toggleClass("stop");
				// oIcon.toggleClass("stop");
				// oIcon.parent().next(".studyin-content-subject").toggleClass("stop");
				CAICUI.myScroll.refresh();
			},
			typeClick : function(e){
				var current = e.currentTarget;
				var oType = $(current);
				var index = oType.index();
				oType.addClass("active").siblings().removeClass("active");
				$('.studyin-contents').removeClass("active").eq(index).addClass('active');
				CAICUI.myScroll.refresh();
			},
			applyHearing : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var subjectId = that.data('subjectid');
				CAICUI.render.clickCategoryId = that.data('categoryid');
				CAICUI.render.clickSubjectId = that.data('subjectid');
				CAICUI.render.orderItemId = that.data('orderitemid');

				// var templateHtml = $('#template-course-courseActivated-pop').html();
				// var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					
				// });
				// $('body').append(addHtml);
				layer.closeAll();
				CAICUI.render.closeCourseActivatedPop = layer.open({
					type: 1,
					title : false,
					shade: true,
					scrollbar: false,
					closeBtn: 0,
					skin: 'layui-skin layui-courseActivation', //加上边框
					area: ['620px', '580px'], //宽高
					content: $("#courseActivated-pop"),
					success: function() {
						CAICUI.Request.ajax({
							'server' : 'subjectTimeList',
							'data' : {
								"subjectId": CAICUI.render.clickSubjectId
							},
							done : function(data){
								if (data.data && data.data.length > 0) {
									var selectOptionHtml = '';
									_.each(data.data, function(item, iteratee) {
										selectOptionHtml += '<option class="courseActivated-pop-option" value="'+parseInt(item.time/1000)+'">'+CAICUI.iGlobal.getDate(item.time)+'</option>';
									});
									$('body #courseActivated-pop .courseActivated-pop-select2').html('<option class="courseActivated-pop-option" value="">请选择未通过考试的时间</option>'+selectOptionHtml)
									$('body #courseActivated-pop .courseActivated-pop-select4').html('<option class="courseActivated-pop-option"  value="">请选择下次考试的时间</option>'+selectOptionHtml)
								}
								
							}
						});
					}
				});
			},
			applyHearingClose : function(){
				CAICUI.render.examState = 1;
				$('body .courseActivated-pop-select1').find('option').removeAttr("selected");
				$('body .courseActivated-pop-select1').find('option').eq(0).attr("selected","selected");

				$('body .courseActivated-pop-select2').find('option').removeAttr('selected');
				$('body .courseActivated-pop-select2').removeClass('disabled').removeAttr('disabled');
				$('body .courseActivated-pop-select2').find('option').eq(0).attr("selected","selected");

				$('body .courseActivated-pop-select3').removeAttr('disabled');
				$('body .courseActivated-pop-select3').val('');

				$('body .courseActivated-pop-select4').find('option').removeAttr('selected');
				$('body .courseActivated-pop-select4').find('option').eq(0).attr("selected","selected");

				this.removeUploadFormFile();
				layer.closeAll();

			},
			subjectTimeListAjax : function(subjectId,callback){
				CAICUI.Request.ajax({
					'server' : 'subjectTimeList',
					'data' : {
						'subjectId' : subjectId
					},
					done : function(data){
						if(callback){callback(data.data)};
					},
					fail : function(data){
						
					}
				});
			},

			changeCourseActivatedType : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.examState = parseInt(that.val());
				this.removeUploadFormFile();
				if(CAICUI.render.examState == 2){
					$('body .courseActivated-pop-select2').attr('disabled','disabled')
					$('body .courseActivated-pop-select2').addClass('disabled')
					$('body .courseActivated-pop-select3').attr('disabled','disabled')
					
					// $('body .add-photo-show').addClass('hidden');

					// if(CAICUI.render.scanningPath){
					// 	$('body .add-photo-show').addClass('hidden');
					// }else{
					// 	$('body .add-photo-form').addClass('hidden');
					// }
					// $('body .add-photo-no').removeClass('hidden');
				}else if(CAICUI.render.examState == 1){
					$('body .courseActivated-pop-select2').removeAttr('disabled')
					$('body .courseActivated-pop-select2').removeClass('disabled')
					$('body .courseActivated-pop-select3').removeAttr('disabled')
					
					// $('body .add-photo-show').removeClass('hidden');
					// if(CAICUI.render.scanningPath){
					// 	$('body .add-photo-show').removeClass('hidden');
					// }else{
					// 	$('body .add-photo-form').removeClass('hidden');
					// }
					// $('body .add-photo-no').addClass('hidden');
				}
			},
			changeExamTime : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.testDate = that.val();
			},
			changeNextExamTime : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.nextExamDate = that.val();
			},
			applyHearingBtn : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				if(that.hasClass('active')){
					// that.removeClass('active');
					if(CAICUI.render.examState == 1){
						CAICUI.render.score = $('body .courseActivated-pop-select3').val(); // 得分
						if(!CAICUI.render.testDate){
							layer.msg('Sorry~ 请填写考试日期');
							return false;
						}
						if(!CAICUI.render.score){
							layer.msg('Sorry~ 请输入您的考试分数');
							return false;
						}
						
					}
					if(!CAICUI.render.scanningPath){
						layer.msg('Sorry~ 请填写考试成绩证明附件');
						return false;
					}
					if(!CAICUI.render.nextExamDate){
						layer.msg('Sorry~ 请输入下次考试的时间');
						return false;
					}

					this.applyrestudyAjax();
				}
			},
			applyrestudyAjax : function(applyrestudyData){
				$('body .courseActivated-pop-button').removeClass('active');
				CAICUI.Request.ajax({
					'server' : 'applyrestudy',
					'data' : {
						'token' : CAICUI.User.token,
						'mobile' : CAICUI.User.mobile,
						'fullname' : CAICUI.User.username,

						'certificateId' : CAICUI.render.clickCategoryId,
						'subjectId' : CAICUI.render.clickSubjectId,
						'orderItemId' : CAICUI.render.orderItemId,

						'examState' : CAICUI.render.examState,
						// 'regNo' : '',
						'score' : CAICUI.render.score,
						'testDate' : CAICUI.render.testDate,
						'scanningPath' : CAICUI.render.scanningPath,
						'nextExamDate' : CAICUI.render.nextExamDate

					},
					done : function(data){
						$('body .courseActivated-pop-button').addClass('active');
						if(data.state == "success"){
							var courseActivatedDom = $('body #courseActivated-'+CAICUI.render.clickSubjectId);
							courseActivatedDom.addClass("auditState0");
							courseActivatedDom.find('a').removeClass("js-apply-hearing");
							courseActivatedDom.find('.mask-lf').text("审核中");

							CAICUI.render.courseActivated.applyHearingClose();
							layer.msg('申请成功~ ', {icon: 1});
						}else{
							layer.msg('Sorry~ 上传失败！');
						}
					},
					fail : function(data){
						$('body .courseActivated-pop-button').addClass('active');
						layer.msg('Sorry~ 上传失败！');
					}
				});
			},
			uploadFormFile : function(){
				CAICUI.iGlobal.fileUpload({
	        'formClass' : 'uploadForm'
	      }, function(returndata){
					CAICUI.render.scanningPath = CAICUI.Common.host.img + returndata.data[0].storeFileUrl;
					$('body .add-photo-form').addClass('hidden');

					$('body .add-photo-show').removeClass('hidden');
					$('body .add-photo-img').attr('src',CAICUI.render.scanningPath);
				})
			},
			removeUploadFormFile : function(){
				CAICUI.render.scanningPath = '';
				$('body #uploadForm-file').val('');
				$('body .add-photo-form').removeClass('hidden');

				$('body .add-photo-show').addClass('hidden');
			}
		});
		return Studycenter;
	});