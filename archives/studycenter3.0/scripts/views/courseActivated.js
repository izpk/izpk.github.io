;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-course-activated').html()),
			events : {
				"mouseenter .studyin-content-subjects" : "subjectEnter",
				"mouseleave .studyin-content-subjects" : "subjectLeave",
				"click .studyin-content-subjects" : "subjectClick",
				"click .studyin-content-header" : "iconClick",
				"click .studyin-type" : "typeClick"
			},
			render : function(){


				CAICUI.render.$this = this;
				this.expirationcourse(function(data){
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
			expirationcourse : function(callback){
				CAICUI.Request.ajax({
					'server' : 'expirationcourse',
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
			}
		});
		return Studycenter;
	});