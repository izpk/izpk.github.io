;define([
	'jquery',
	'underscore',
	'backbone',
	'layer'
	],function($, _, Backbone, layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-course-notActivated').html()),
			events : {
				"mouseenter .studyin-content-subjects" : "subjectEnter",
				"mouseleave .studyin-content-subjects" : "subjectLeave",
				"click .studyin-content-subjects" : "subjectClick",
				"click .studyin-content-header" : "iconClick",
				"click .studyin-type" : "typeClick",
				'click .js-course-notActivated' : 'acivated',
				'click .ca-btn-no' : 'closeAcivated',
				'click .ca-btn-ok' : 'caBtnOk'
			},
			render : function(){
				CAICUI.render.$this = this;
				CAICUI.render.closeActbut = '';
				CAICUI.render.courseId = '';
				CAICUI.render.orderItemId = '';
				CAICUI.render.isU = '';
				CAICUI.render.title = '';
				CAICUI.render.effectiveDay = '';

				this.noActivecourse(function(data){
					CAICUI.render.$this.$el.html(CAICUI.render.$this.template({
						'data' : data
					}));
					$('.current-progress').each(function(){
						var that = $(this);
						var progress = parseInt(that.attr('data-progress'));
						if(progress){
							that.addClass('active');
							that.animate({
								width: progress
							},1000);
						}
					});
					window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
				});
			},
			noActivecourse : function(callback){
				CAICUI.Request.ajax({
					'server' : 'noActivecourse',
					'data' : {
						'token' : CAICUI.User.token,
						'pageNo' : 0,
						'pageSize' : CAICUI.defaultPageSize
					},
					done : function(data){
						var stooges = data.data.courselist;
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
						console.log(courseLists)
						callback({
							"courseListNav" : courseListNav,
							"courseLists" : courseLists
						});
						//CAICUI.render.$this.$learningcourse = data.data.courselist;
					},
					fail : function(data){
						callback({
							"courseListNav" : {},
							"courseLists" : {}
						});
					}
				})
			},
			subjectEnter : function(e) {
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
			subjectLeave : function(e) {
				var oMaskLeave = this.subjectEnter(e)["mask"];
				oMaskLeave.stop(true,false).animate({
					"left" : "-160px"
				});
			},
			subjectClick : function(e) {
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
			courseActive: function(data) {
				CAICUI.Request.ajax({
					'server' : 'active',
					'data' : {
						'token' : data.token,
						'courseId' : data.courseId,
						'isU' : data.isU,
						'orderItemId' : data.orderItemId,
						'examTime' : data.examTime
					},
					done : function(data){
						if (data.state == 'success') {
							//移除课程缓存
							// storage.remove("learningcourse");
							$('.layui-layer-shade').remove();
							window.location.hash = "#courseStudy/" + CAICUI.render.courseId
							//location.setHash("#/courseIndex/" + CAICUI.render.courseId);
						} else {
							//cc.module.errorMsg(datas.msg);
							console.log(data)
						}
					},
					fail : function(data){
						layer.msg('Sorry~ 课程激活失败！', function() {});
					}
				});
			},
			acivated : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.courseId = that.attr('data-courseid');
				CAICUI.render.orderItemId = that.attr('data-orderitemid');
				CAICUI.render.isU = that.attr('data-isu');
				CAICUI.render.title = that.attr('data-title');
				CAICUI.render.effectiveDay = that.attr('data-effectiveday');
				$('.ca-select select option').each(function() {
					$(this).remove();
				});

				CAICUI.Request.ajax({
					'server' : 'timeList',
					'data' : {
						'token' : CAICUI.User.token,
						"courseId": CAICUI.render.courseId
					},
					done : function(data){
						console.log(data)
						if (data.data && data.data.length > 0) {
							$('.ca-select').css('display', '');
							$('.ca-select select').append("<option value='0'>选择考试时间</option>");
							_.each(data.data, function(item, iteratee) {
								$('.ca-select select').append("<option value='" + CAICUI.iGlobal.getLocalTime(item.time) + "'>" + CAICUI.iGlobal.getLocalTime(item.time) + "</option>");
							});
							$('.ca-select').css('opacity', '1');
							$('.form-control').css({'display':'block'});
						} else {
							$('.ca-select select').append("<option value='0'>选择考试时间</option>");
							$('.ca-select select').append("<option value='-1' selected>" + CAICUI.iGlobal.getLocalTime(0) + "</option>");
							$('.ca-select').css({'opacity':'0'});
							$('.form-control').css({'display':'none'});
						}
					}

				});


				CAICUI.render.closeActbut = layer.open({
					type: 1,
					title: ['课程激活', 'background: #ffffff; height: 48px; font-size: 16px; color: #4d4d4d; line-height: 48px;'],
					shade: true,
					scrollbar: false,
					skin: 'layui-skin', //加上边框
					area: ['500px', 'auto'], //宽高
					content: $("#courseActivation"),
					success: function() {
						$('.layui-layer-shade').css('filter', 'alpha(opacity=50)');
						$('.ca-h3 font').html('&nbsp;' + CAICUI.render.title);
						$(".ca-checkbox label input").prop("checked", '');
						$('.effectiveDay').text(CAICUI.render.effectiveDay);
					}
				});
			},
			closeAcivated : function(){
				layer.close(CAICUI.render.closeActbut);
			},
			caBtnOk : function(){
				if ($('.ca-checkbox label input').is(':checked')) {
						var examTime = $('select.form-control').val();
						if(examTime == 0){
						   layer.msg('请选择考试时间', function(){});
						   return false;
						}
						if(examTime=='-1'){
							examTime = '';
						}
						var data = {
							token: CAICUI.User.token,
							courseId: CAICUI.render.courseId,
							isU: CAICUI.render.isU,
							orderItemId: CAICUI.render.orderItemId,
							examTime: examTime
						};
						this.courseActive(data);
					} else {
						layer.msg('请确认激活', function() {});
					}
			}
		});
		return Studycenter;
	});