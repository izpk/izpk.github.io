;define([
	'jquery',
	'underscore',
	'backbone',
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-course-studyIn').html()),
			events : {
				"mouseenter .studyin-content-subjects" : "subjectEnter",
				"mouseleave .studyin-content-subjects" : "subjectLeave",
				"click .studyin-content-subjects" : "subjectClick",
				"click .studyin-content-header" : "iconClick",
				"click .studyin-type" : "typeClick"
			},
			render : function(){

				//var data = {"data":{"total":16,"courselist":[{"categoryIndex":5,"effectiveDay":180,"taskTotal":"14","isU":"false","courseId":"8a22ecb5540d6ed10154285f98c40061","outline":"","teacherName":"Edward","orderID_item_id":"8a22ecb554496f5c01545134059115bb","lastmodifyTime":1462329347,"categoryName":"ACCA","subjectName":"F8","courseIndex":15,"subjectID":"ff808081473905e701475d4ec4d60006","teacherHonor":"熊亚一","availability":"","courseBkImage":"/upload/201604/997cc907d961488dacbe0cf55488ea96.png","categoryId":"ff808081473905e701475cd3c2080001","chapterName":"复习串讲","chapterId":"8a22ecb5540d6ed10154286bbef20062","expirationTime":1477475986,"buyTime":1461651244,"teacherImage":"/upload/201604/125f253e3e39437889a8c45b4eb91dd1.png","versionId":"8a22ecb5540d6ed10154285f98c40061","subjectIndex":9,"courseName":"2016 复习串讲 ACCA F8 Audit and Assurance"},{"categoryIndex":5,"effectiveDay":180,"taskTotal":"56","isU":"false","courseId":"ff8080814db86d41014dc1a2200f04d0","outline":null,"teacherName":"Cindy Deng","orderID_item_id":"8a22ecb553ca891a0153cb8c5a64037c","lastmodifyTime":1462371924,"categoryName":"ACCA","subjectName":"F3","courseIndex":5,"subjectID":"ff808081473905e701476252b4390073","progressSum":5745,"teacherHonor":"ACCA资深会员,金牌讲师","availability":"","courseBkImage":"/upload/201502/fb9f1cfc2911499da1666e8aa5383d47.jpg","categoryId":"ff808081473905e701475cd3c2080001","chapterName":"F3-课程介绍","taskprogress":6,"chapterId":"ff8080814db86d41014dc1a2201a04d2","expirationTime":1475045015,"buyTime":1459408886,"teacherImage":"/upload/201506/82623b8255ff42c7b8a648f85bd1c936.jpg","versionId":"ff808081473905e7014762700dfa0081","subjectIndex":4,"courseName":"ACCA F3 Financial Accounting"},{"categoryIndex":5,"effectiveDay":180,"taskTotal":"58","isU":"false","courseId":"ff8080814db86d41014dc1a26c460537","outline":null,"teacherName":"Anthony Tao","orderID_item_id":"8a22ecb553c10d020153c8db5e351619","lastmodifyTime":1462381162,"categoryName":"ACCA","subjectName":"F4","courseIndex":7,"subjectID":"ff808081473905e70147625307e90074","progressSum":102,"teacherHonor":"六年教龄，ACCA金牌讲师","availability":"","courseBkImage":"/upload/201502/9a604ab6531346ba87aad1e8df596ce2.jpg","categoryId":"ff808081473905e701475cd3c2080001","taskprogress":2,"expirationTime":1474960840,"buyTime":1459363733,"teacherImage":"/upload/201506/88c4d444d4c743fa935197e022aab836.jpg","versionId":"ff808081473905e701476271a6fc0083","subjectIndex":5,"courseName":"ACCA F4 Corporate and Business Law"},{"categoryIndex":5,"effectiveDay":180,"taskTotal":"58","isU":"false","courseId":"ff8080814db86d41014dc1a26c460537","outline":null,"teacherName":"Anthony Tao","orderID_item_id":"8a22ecb5535aa60801537813a81d4323","lastmodifyTime":1462381162,"categoryName":"ACCA","subjectName":"F4","courseIndex":7,"subjectID":"ff808081473905e70147625307e90074","progressSum":102,"teacherHonor":"六年教龄，ACCA金牌讲师","availability":"","courseBkImage":"/upload/201502/9a604ab6531346ba87aad1e8df596ce2.jpg","categoryId":"ff808081473905e701475cd3c2080001","taskprogress":2,"expirationTime":1474915642,"buyTime":1458008467,"teacherImage":"/upload/201506/88c4d444d4c743fa935197e022aab836.jpg","versionId":"ff808081473905e701476271a6fc0083","subjectIndex":5,"courseName":"ACCA F4 Corporate and Business Law"},{"categoryIndex":20,"effectiveDay":270,"taskTotal":"0","isU":"false","categoryId":"ff80808149cc09f70149f3e7b9534654","courseBkImage":"/upload/201601/3f96e3c1fbea4b3f991217646a597ddb.png","courseId":"8a22ecb5526cc38e015278544f3f000d","outline":"","teacherName":"CFA明星讲师团","lastmodifyTime":1462333890,"orderID_item_id":"8a22ecb5532c7c880153311db8131499","categoryName":"CFA","subjectName":"CFA Level I 2016","courseIndex":6,"expirationTime":1480930466,"subjectID":"8a22ecb5527d453f01527d4b0e500001","buyTime":1456817944,"teacherImage":"/upload/201412/e5b55ad1a15448d5bf5f5d1d3ae8f59a.png","versionId":"8a22ecb5526cc38e015278544f3f000d","teacherHonor":"","subjectIndex":50,"availability":"","courseName":"2016 CFA 串讲课"},{"categoryIndex":5,"effectiveDay":180,"taskTotal":"51","isU":"false","courseId":"ff8080814db86d41014dc13f0a59024e","outline":"","teacherName":"Sunny Sun","orderID_item_id":"8a22ecb553501468015350845daf020b","lastmodifyTime":1461640516,"categoryName":"ACCA","subjectName":"F8","courseIndex":15,"subjectID":"ff808081473905e701475d4ec4d60006","progressSum":3,"teacherHonor":"八年教龄，金牌讲师，ACCA资深会员","availability":"","courseBkImage":"/upload/201502/dfda90788d5043b4b8afec8c1b331bb9.jpg","categoryId":"ff808081473905e701475cd3c2080001","chapterName":"introduction","taskprogress":2,"chapterId":"ff8080814db86d41014dc13f0a860253","expirationTime":1472896895,"buyTime":1457344765,"teacherImage":"/upload/201506/fdacdf1085864c73880c416fefd175a7.jpg","versionId":"ff808081473905e701475d510f7c0007","subjectIndex":9,"courseName":"2015 ACCA F8 Audit and Assurance"},{"categoryIndex":5,"effectiveDay":180,"taskTotal":"51","isU":"false","courseId":"ff8080814db86d41014dc13f0a59024e","outline":"","teacherName":"Sunny Sun","orderID_item_id":"8a22ecb55350131d015350721dfe013c","lastmodifyTime":1461640516,"categoryName":"ACCA","subjectName":"F8","courseIndex":15,"subjectID":"ff808081473905e701475d4ec4d60006","progressSum":3,"teacherHonor":"八年教龄，金牌讲师，ACCA资深会员","availability":"","courseBkImage":"/upload/201502/dfda90788d5043b4b8afec8c1b331bb9.jpg","categoryId":"ff808081473905e701475cd3c2080001","chapterName":"introduction","taskprogress":2,"chapterId":"ff8080814db86d41014dc13f0a860253","expirationTime":1472896888,"buyTime":1457343569,"teacherImage":"/upload/201506/fdacdf1085864c73880c416fefd175a7.jpg","versionId":"ff808081473905e701475d510f7c0007","subjectIndex":9,"courseName":"2015 ACCA F8 Audit and Assurance"},{"categoryIndex":5,"effectiveDay":180,"taskTotal":"56","isU":"false","courseId":"ff8080814db86d41014dc1a2200f04d0","outline":null,"teacherName":"Cindy Deng","orderID_item_id":"8a22ecb5527d428e0152e40b7401013d","lastmodifyTime":1462371924,"categoryName":"ACCA","subjectName":"F3","courseIndex":5,"subjectID":"ff808081473905e701476252b4390073","progressSum":5745,"teacherHonor":"ACCA资深会员,金牌讲师","availability":"","courseBkImage":"/upload/201502/fb9f1cfc2911499da1666e8aa5383d47.jpg","categoryId":"ff808081473905e701475cd3c2080001","chapterName":"F3-课程介绍","taskprogress":6,"chapterId":"ff8080814db86d41014dc1a2201a04d2","expirationTime":1472636819,"buyTime":1455524902,"teacherImage":"/upload/201506/82623b8255ff42c7b8a648f85bd1c936.jpg","versionId":"ff808081473905e7014762700dfa0081","subjectIndex":4,"courseName":"ACCA F3 Financial Accounting"},{"categoryIndex":20,"effectiveDay":270,"taskTotal":"292","isU":"false","categoryId":"ff80808149cc09f70149f3e7b9534654","courseBkImage":"/upload/201601/f0d3daf53ab845a7821d9b2cdebdcc92.png","courseId":"8a22ecb5526cc38e015278501f28000c","outline":"","teacherName":"CFA明星讲师团","lastmodifyTime":1462342012,"orderID_item_id":"8a22ecb5532c7c880153311db75f1497","categoryName":"CFA","subjectName":"CFA Level I 2016","courseIndex":5,"expirationTime":1480412809,"subjectID":"8a22ecb5527d453f01527d4b0e500001","buyTime":1456817944,"teacherImage":"/upload/201412/e5b55ad1a15448d5bf5f5d1d3ae8f59a.png","versionId":"8a22ecb5526cc38e015278501f28000c","teacherHonor":"","subjectIndex":50,"availability":"","courseName":"2016 CFA 强化课"},{"categoryIndex":5,"effectiveDay":180,"taskTotal":"115","isU":"false","courseId":"ff8080814dad5062014db32051b801a2","outline":"","teacherName":"David Xi","orderID_item_id":"8a22ecb5532c7c8801533a61971c3c5a","lastmodifyTime":1462382519,"categoryName":"ACCA","subjectName":"F1","courseIndex":1,"subjectID":"ff808081473905e701476204cb6c006f","progressSum":3180,"teacherHonor":"ACCA金牌讲师","availability":"                    ","courseBkImage":"/upload/201502/6096a5abb99846e3b9597f5bbb1a7b61.jpg","categoryId":"ff808081473905e701475cd3c2080001","taskprogress":4,"expirationTime":1472525469,"buyTime":1456973387,"teacherImage":"/upload/201506/888ce40873854b46bf3087cd51d341d5.jpg","versionId":"ff808081473905e701476205d8740070","subjectIndex":2,"courseName":"ACCA F1 Accountant in Business"},{"categoryIndex":10,"effectiveDay":280,"taskTotal":"125","isU":"false","categoryId":"ff808081486933e601489c4662f60851","courseBkImage":"/upload/201502/43de7614c9c141f38f5d0827840d343a.jpg","courseId":"ff8080814dc1dc4e014dd5d293880a93","outline":"","teacherName":"QiQi Wu","lastmodifyTime":1462360146,"orderID_item_id":"8a22ecb5532c7964015336ce7e7e2ac6","categoryName":"CMA中文","subjectName":"CMA 中文 Part-1","courseIndex":2,"expirationTime":1481105555,"subjectID":"ff808081486933e601489c799f0f0868","buyTime":1456913415,"teacherImage":"/upload/201507/cdbfc6eb9cbe4b118dce7e13ddd724b5.png","versionId":"ff808081486933e601489c867448086a","teacherHonor":"吴奇奇","subjectIndex":50,"availability":"","courseName":"2015 CMA Part1 财务规划 绩效与控制 基础"},{"categoryIndex":5,"effectiveDay":180,"taskTotal":"63","isU":"false","courseId":"ff8080814db86d41014dc1a141b70400","outline":null,"teacherName":"Susie Zhang","orderID_item_id":"8a22ecb5532c7964015336ce7d982ac4","lastmodifyTime":1462355032,"categoryName":"ACCA","subjectName":"F9","courseIndex":17,"subjectID":"ff808081473905e7014762542d940078","progressSum":1065,"teacherHonor":"八年教龄，ACCA金牌讲师","availability":"","courseBkImage":"/upload/201502/f002241f59484b92bd9e9a97b5043093.jpg","categoryId":"ff808081473905e701475cd3c2080001","taskprogress":1,"expirationTime":1472465491,"buyTime":1456913415,"teacherImage":"/upload/201506/b1b004c5cec54a999af0c524b94b905a.jpg","versionId":"ff808081473905e701476bd7aca20090","subjectIndex":10,"courseName":"ACCA F9 Financial Management"},{"categoryIndex":20,"effectiveDay":270,"taskTotal":"587","isU":"false","courseId":"8a22ecb55210cb6b0152116a2bdc016c","outline":"","teacherName":"CFA明星讲师团","orderID_item_id":"8a22ecb5532c7c88015331173eb2146f","lastmodifyTime":1462380951,"categoryName":"CFA","subjectName":"CFA Level I 2016","courseIndex":4,"subjectID":"8a22ecb5527d453f01527d4b0e500001","progressSum":2,"teacherHonor":"","availability":"","courseBkImage":"/upload/201601/bf35ed9f6cae41019804161f21b729de.png","categoryId":"ff80808149cc09f70149f3e7b9534654","taskprogress":0,"expirationTime":1480145595,"buyTime":1456817521,"teacherImage":"/upload/201412/e5b55ad1a15448d5bf5f5d1d3ae8f59a.png","versionId":"8a22ecb55210cb6b0152116a2bdc016c","subjectIndex":50,"courseName":"2016 CFA 基础课"},{"categoryIndex":5,"effectiveDay":180,"taskTotal":"58","isU":"false","courseId":"ff8080814db86d41014dc1a26c460537","outline":null,"teacherName":"Anthony Tao","orderID_item_id":"8a22ecb5527d428e0152e40b7536013f","lastmodifyTime":1462381162,"categoryName":"ACCA","subjectName":"F4","courseIndex":7,"subjectID":"ff808081473905e70147625307e90074","progressSum":102,"teacherHonor":"六年教龄，ACCA金牌讲师","availability":"","courseBkImage":"/upload/201502/9a604ab6531346ba87aad1e8df596ce2.jpg","categoryId":"ff808081473905e701475cd3c2080001","taskprogress":2,"expirationTime":1472292480,"buyTime":1455524902,"teacherImage":"/upload/201506/88c4d444d4c743fa935197e022aab836.jpg","versionId":"ff808081473905e701476271a6fc0083","subjectIndex":5,"courseName":"ACCA F4 Corporate and Business Law"},{"categoryIndex":5,"effectiveDay":180,"taskTotal":"13","isU":"false","courseId":"ff8080814dc1dc4e014e00cc355c2deb","outline":null,"teacherName":"David Xi","orderID_item_id":"8a22ecb5527d428e0152e40b78630143","lastmodifyTime":1462370029,"categoryName":"ACCA","subjectName":"F1","courseIndex":2,"subjectID":"ff808081473905e701476204cb6c006f","progressSum":115,"teacherHonor":"ACCA金牌讲师","availability":"","courseBkImage":"/upload/201502/fdd86b6fc447438495b5c136f5bab33f.jpg","categoryId":"ff808081473905e701475cd3c2080001","taskprogress":0,"expirationTime":1471994275,"buyTime":1455524903,"teacherImage":"/upload/201506/888ce40873854b46bf3087cd51d341d5.jpg","versionId":"ff808081486933e6014888fb011e057b","subjectIndex":2,"courseName":"复习串讲-ACCA F1 Accountant in Business"},{"categoryIndex":5,"effectiveDay":180,"taskTotal":"87","isU":"false","courseId":"ff8080814db86d41014dc1a2b31805a1","outline":"","teacherName":"Crystal Zhang","orderID_item_id":"8a22ecb5527d428e0152e40b78390141","lastmodifyTime":1462373491,"categoryName":"ACCA","subjectName":"F5","courseIndex":9,"subjectID":"ff808081473905e7014762534dda0075","progressSum":4880,"teacherHonor":"资深会员","availability":"","courseBkImage":"/upload/201502/06604e12add04761867e6f289ea85988.jpg","categoryId":"ff808081473905e701475cd3c2080001","taskprogress":4,"expirationTime":1471245658,"buyTime":1455524902,"teacherImage":"/upload/201507/4665533630de4d85ba2622ca0eff93cd.png","versionId":"ff808081473905e701476bd3ddb0008c","subjectIndex":6,"courseName":"ACCA F5 Performance Management"}],"pageNo":0,"pageSize":20},"state":"success","msg":""}
				//var stooges = data.data.courselist;
				// var courseListNav = _.chain(stooges)
				//  	.map(function(stooge){ return stooge.categoryName ; })
				//   .uniq()
				//   .value();
				// var courseListIndex = _.chain(stooges)
				//  	.map(function(stooge){ return stooge.categoryIndex ; })
				//   .uniq()
				//   .value();
				// var courseLists = [];
				// for(var i=0;i<courseListNav.length;i++){
				// 	courseLists.push({
				// 		"categoryName" : courseListNav[i],
				// 		"categoryIndex" : courseListIndex[i],
				// 		"list" : []
				// 	});
				// 	_.each(stooges,function(element, index, list){
				// 		if(element.categoryName == courseListNav[i]){
				// 			if(courseLists && courseLists[i] && courseLists[i].list){
				// 				courseLists[i].list.push(element)
				// 				// var add = true;
				// 				// _.each(courseLists[i].list,function(ele, index, list){
				// 				// 	if(element.courseId == ele.courseId){
				// 				// 		add = false;
				// 				// 	}
				// 				// });
				// 				// if(add){
				// 				// 	courseLists[i].list.push(element);
				// 				// }
				// 			}else{
				// 				courseLists[i].list= [element];
				// 			}
							
				// 		}
				// 	});
				// }
				// for(var i=0;i<courseLists.length;i++){
				// 	courseLists[i].newList = []
				// 	var stooge = courseLists[i].list
				// 	var subjectNameArray = _.chain(stooge)
				// 	 	.map(function(stooge){ return stooge.subjectName ; })
				// 	  .uniq()
				// 	  .value();
				// 	var subjectIndexArray = _.chain(stooge)
				// 	 	.map(function(stooge){ return stooge.subjectIndex ; })
				// 	  .uniq()
				// 	  .value();
				//   for(var j=0;j<subjectNameArray.length;j++){
				//   	courseLists[i].newList.push({
				//   		"subjectName" : subjectNameArray[j],
				//   		"subjectIndex" : subjectIndexArray[j],
				// 			"list" : []
				//   	})
				//   	_.each(courseLists[i].list,function(element, index, list){
				// 			if(element.subjectName == subjectNameArray[j]){

				// 				if(courseLists[i].newList[j].list){
				// 					//courseLists[i].newList[j].list.push(element);
				// 					var add = true;
				// 					_.each(courseLists[i].newList[j].list,function(ele, index, list){
				// 						if(element.courseId == ele.courseId){
				// 							add = false;
				// 						}
				// 					});
				// 					if(add){
				// 						console.log(element.courseIndex)
				// 						courseLists[i].newList[j].list.push(element);
				// 					}
				// 				}else{
				// 					console.log(element.courseIndex)
				// 					courseLists[i].newList[j].list= [element];
				// 				}
								
				// 			}
				// 		});
				//   }
				// }
				// var courseLists = _.sortBy(courseLists, 'categoryIndex');
				// _.each(courseLists,function(element, index, list){
				// 	courseLists[index].newList =  _.sortBy(element.newList, 'subjectIndex');
				// 	_.each(courseLists[index].newList,function(element, index, list){
				// 		courseLists[index].newList =  _.sortBy(element.list, 'courseIndex');
				// 	})
				// })
				// console.log(courseLists)

				CAICUI.render.$this = this;
				this.learningcourse(function(data){
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
			learningcourse : function(callback){
				if(!CAICUI.CACHE.Learningcourse || !CAICUI.CACHE.Learningcourse.length){
					CAICUI.Request.ajax({
						'server' : 'learningcourse',
						'data' : {
							'token' : CAICUI.User.token,
							'pageNo' : 0,
							'pageSize' : CAICUI.defaultPageSize
						},
						done : function(data){
							CAICUI.CACHE.Learningcourse = data.data.courselist;
							CAICUI.CACHE.RecentCourse = data.data.courselist.slice(0,2);
							var filterLearningcourseData = CAICUI.render.$this.filterLearningcourseData(CAICUI.CACHE.Learningcourse);
							callback({
								"courseListNav" : filterLearningcourseData.courseListNav,
								"courseLists" : filterLearningcourseData.courseLists
							});
						},
						fail : function(data){
							callback({
								"courseListNav" : {},
								"courseLists" : {}
							});
						}
					})
				}else{
					var filterLearningcourseData = this.filterLearningcourseData(CAICUI.CACHE.Learningcourse);
					callback({
						"courseListNav" : filterLearningcourseData.courseListNav,
						"courseLists" : filterLearningcourseData.courseLists
					});
				}
			},
			filterLearningcourseData : function(data){
				var stooges = data;
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
				return {
					"courseListNav" : courseListNav,
					"courseLists" : courseLists
				}
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