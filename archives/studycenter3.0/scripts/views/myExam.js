;define([
	'jquery',
	'underscore',
	'backbone',
	'views/exam-list',
	'layer'
	],function($, _, Backbone, ExamList, layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-my-exam').html()),
			events : {
				'click body' : 'layout',
				'click .js-pagination-li' : 'paginationChange',
				'click .js-pagination-prev' : 'paginationPrev',
				'click .js-pagination-next' : 'paginationNext',
			},
			render : function(){
			/*
				var data = {"pageNo":1,"pageSize":20,"state":"success","totalCount":118,"msg":"","data":[{"id":"8a22ecb553ca891a01540dc72038248a","type":"章节定向","source":null,"testTime":1460520030,"time":4,"count":0,"rightCount":0},{"id":"8a22ecb553ca89e401540dc6ff3f3b3f","type":"章节定向","source":null,"testTime":1460520024,"time":1,"count":0,"rightCount":0},{"id":"8a22ecb553ca891a01540dc5e0f62487","type":"章节定向","source":null,"testTime":1460519949,"time":3,"count":0,"rightCount":0},{"id":"8a22ecb553ca891a01540dc28a80247b","type":"章节定向","source":null,"testTime":1460519729,"time":4,"count":0,"rightCount":0},{"id":"8a22ecb553ca89e401540dc25b043b36","type":"章节定向","source":null,"testTime":1460519700,"time":21,"count":0,"rightCount":0},{"id":"8a22ecb553ca891a01540dc22a5d247a","type":"章节定向","source":null,"testTime":1460519700,"time":9,"count":0,"rightCount":0},{"id":"8a22ecb553ca89e401540dc1cd753b35","type":"章节定向","source":null,"testTime":1460519676,"time":9,"count":0,"rightCount":0},{"id":"8a22ecb553ca891a01540dc171202478","type":"章节定向","source":null,"testTime":1460519647,"time":14,"count":0,"rightCount":0},{"id":"8a22ecb553ca89e401540dc125873b2e","type":"章节定向","source":null,"testTime":1460519639,"time":3,"count":0,"rightCount":0},{"id":"8a22ecb553ca891a01540dc0c7de2477","type":"章节定向","source":null,"testTime":1460519403,"time":215,"count":0,"rightCount":0},{"id":"8a22ecb553ca89e401540dc0b5013b26","type":"章节定向","source":null,"testTime":1460519403,"time":210,"count":0,"rightCount":0},{"id":"8a22ecb553ca891a01540dc0a44c2476","type":"章节定向","source":null,"testTime":1460519403,"time":206,"count":0,"rightCount":0},{"id":"8a22ecb553ca89e401540dc0910b3b24","type":"章节定向","source":null,"testTime":1460519403,"time":201,"count":0,"rightCount":0},{"id":"8a22ecb553ca891a01540dc06dec2475","type":"章节定向","source":null,"testTime":1460519403,"time":192,"count":0,"rightCount":0},{"id":"8a22ecb553ca89e401540dc049e53b23","type":"章节定向","source":null,"testTime":1460519403,"time":183,"count":0,"rightCount":0},{"id":"8a22ecb553ca891a01540dc0306d2473","type":"章节定向","source":null,"testTime":1460519403,"time":176,"count":0,"rightCount":0},{"id":"8a22ecb553ca89e401540dc019383b1f","type":"章节定向","source":null,"testTime":1460519403,"time":170,"count":0,"rightCount":0},{"id":"8a22ecb553ca891a01540dbfae262472","type":"章节定向","source":null,"testTime":1460519403,"time":143,"count":0,"rightCount":0},{"id":"8a22ecb553ca89e401540db247c93af7","type":"章节定向","source":"transfer","testTime":1460518428,"time":240,"count":0,"rightCount":0},{"id":"8a22ecb553ca89e401540db2002c3af5","type":"章节定向","source":"transfer","testTime":1460518428,"time":221,"count":0,"rightCount":0}]};
				console.log(data);
				var stooges = data.data;
				var testTime = _.chain(stooges)
				 	.map(function(stooge){ return CAICUI.iGlobal.getDate(stooge.testTime) ; })
				  .uniq()
				  .value();
				console.log(testTime)
				var myExam = [];
				for(var i=0;i<testTime.length;i++){
					myExam.push({
						"testTime" : testTime[i],
						"list" : []
					})
					_.each(data.data,function(element, index, list){
						if(CAICUI.iGlobal.getDate(element.testTime) == testTime[i]){
							if(myExam && myExam[i] && myExam[i].list){
								myExam[i].list.push(element);
							}else{
								myExam[i].list= [element];
							}
							
						}
					});
				}
			*/
				CAICUI.render.$this = this;
				CAICUI.render.pageNo = 1;
				CAICUI.render.pageSize = 20;
				this.examList(function(data){
					CAICUI.render.$this.$el.html(CAICUI.render.$this.template(data));
					window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
					window.CAICUI.examTypeScroll = CAICUI.iGlobal.iScroll('body #wrapper-exam-type');
				});
			},
			examList : function(callback){
				CAICUI.Request.ajax({
					'server' : 'exam-list',
					'data' : {
						'token' : CAICUI.User.token,
						'pageNo' : CAICUI.render.pageNo,
						'pageSize' : CAICUI.render.pageSize
					},
					done : function(data){
						console.log(data);
						var nowDate = CAICUI.iGlobal.getDate(new Date().getTime());
						var stooges = data.data;
						var testTime = _.chain(stooges)
						 	.map(function(stooge){ return CAICUI.iGlobal.getDate(stooge.testTime) ; })
						  .uniq()
						  .value();
						var myExam = [];
						for(var i=0;i<testTime.length;i++){
							var testTimeI = (testTime[i] == nowDate ? 'TODAY' : testTime[i])
							myExam.push({
								"testTime" : testTimeI,
								"list" : []
							})
							_.each(data.data,function(element, index, list){
								if(CAICUI.iGlobal.getDate(element.testTime) == testTime[i]){
									if(myExam && myExam[i] && myExam[i].list){
										myExam[i].list.push(element);
									}else{
										myExam[i].list = [element];
									}
								}
							});
						};
						callback({'data' : {
								'examList' : myExam,
								'pageNo': data.pageNo,
								'pageSize': data.pageSize,
								'totalCount': data.totalCount
							}});
					},
					fail : function(data){
						//layer.msg('Sorry~ 网络异常，请刷新页面', function() {});
						callback({'data' : {
							'examList' : {},
							'pageNo': 1,
							'pageSize': 20,
							'totalCount': 0
						}});
					}
				})
			},
			paginationChange : function(e){
				CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
				window.CAICUI.myScroll.refresh();
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.pageNo =that.attr('data-pageno');

				this.examList(function(data){
					var acList = new ExamList();
					$('body #scroller').html(acList.render(data).el);
					window.CAICUI.myScroll.refresh();
				});
			},
			paginationPrev : function(e){

				if(CAICUI.render.pageNo>1){
					CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
					window.CAICUI.myScroll.refresh();
					CAICUI.render.pageNo = +CAICUI.render.pageNo-1;
					this.examList(function(data){
					var acList = new ExamList();
					$('body #scroller').html(acList.render(data).el);
					window.CAICUI.myScroll.refresh();
				});
				}
			},
			paginationNext : function(e){
				if(CAICUI.render.pageNo<=CAICUI.render.pageTotal-1){
					CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
					window.CAICUI.myScroll.refresh();
					CAICUI.render.pageNo = +CAICUI.render.pageNo+1;
					this.examList(function(data){
						var acList = new ExamList();
						$('body #scroller').html(acList.render(data).el);
						window.CAICUI.myScroll.refresh();
					});
				}
			}
		});
		return Studycenter;
	});