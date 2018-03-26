;define([
	'jquery',
	'underscore',
	'backbone',
	'layer'
	],function($, _, Backbone, layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body',
			template : _.template($('#template-question-bank-list').html()),
			events : {
				'click .questionBankList-type-btn' : 'questionBankListTypeBtn',
				// 'click .js-questionBankList-a' : 'questionBankListA'
			},
			render : function(type, certificate, subjectid){
				if(CAICUI.render.this.exit && typeof CAICUI.render.this.exit == 'function' && $('body .questions').length){
					$('body .questions').remove()
					CAICUI.render.this.exitMsg();
				}
				CAICUI.render.this = this;
				CAICUI.render.type = +type;
				CAICUI.render.certificate = certificate;
				CAICUI.render.certificateIndex = '';
				CAICUI.render.subjectId = subjectid;

				// CAICUI.render.certificateArray = ["ACCA", "CMA"];
				CAICUI.render.certificateArray = [{
					certificateName : "ACCA",
					certificateId : "ff808081473905e701475cd3c2080001"
				},{
					certificateName : "CMA",
					certificateId : "ff808081486933e601489c4662f60851"
				}]
				CAICUI.render.questionBankList = {}
				// CAICUI.render.questionBankList.type = type;
				// CAICUI.render.questionBankList.courseCategoryId = courseCategoryId;
				// CAICUI.render.questionBankList.knowledgePointId = knowledgePointId;
				CAICUI.render.questionBankList.typeArray = ["realImitate","testSite"];
				CAICUI.render.questionBankList.type = type;
				CAICUI.render.ids = [];
				CAICUI.render.courseCategoryExamenListAjax = 0;
				CAICUI.render.childKnowledgeNodePointListAjax = 0;
				this.getcoursecategoryAjax(function(){
					CAICUI.render.certificateArray.forEach(function(list, index){
						if(list.certificateName == CAICUI.render.certificate){
							CAICUI.render.certificateIndex = index
						}
					})
					var subjectName = '';
					CAICUI.render.getcoursecategory[CAICUI.render.certificateIndex].subjects.forEach(function(list, index){
						var activeIndex = false;
						if(CAICUI.render.type){
							if(list.knowledgePointId == CAICUI.render.subjectId){
								activeIndex = true;
								CAICUI.render.subjectId = list.knowledgePointId;
							}
						}else{
							if(list.courseCategoryId == CAICUI.render.subjectId){
								activeIndex = true;
								CAICUI.render.subjectId = list.courseCategoryId;
							}
						}
						if(activeIndex){
							subjectName = list.subjectName;
							CAICUI.render.ids.push(list.courseCategoryId)
							CAICUI.render.ids.push(list.knowledgePointId)
						}
						
					})
					// CAICUI.render.this.undelegateEvents();
					// $('body #help-feedback-pop').remove();
					// $('body .questions').remove();

					$('body #right').html(CAICUI.render.this.template({
						"subjectId" : CAICUI.render.subjectId,
						"name" : CAICUI.render.certificate,
						"title" : CAICUI.render.certificate+' '+ subjectName,
						"type" : CAICUI.render.type
					}));

					// var ids = CAICUI.render.this.getQuestionBankIds();
					CAICUI.render.this.examenListRender(CAICUI.render.type, CAICUI.render.ids);
					
					
				});
				
			},
			getcoursecategoryAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'getcoursecategory',
					done : function(data){
						CAICUI.render.getcoursecategory = data.data;
						if(callback){callback()};
					}
				})
			},
			examenListRender : function(type, ids){
				if(CAICUI.render.type){ // 真题特训
					this.childKnowledgeNodePointListAjax({
						'id' : ids[1]
					},function(data){
						var knowledgePointIds = [];
						var knowledgePointIdArray = [];
						_.each(data.data,function(element, index){
							knowledgePointIds.push(element.knowledgePointId);
							knowledgePointIdArray.push(element)
						});
						CAICUI.render.this.exercisePointCountCache(knowledgePointIds.toString(),function(data){
							var dataFilter = [];
							_.each(data.data,function(element, index){
								var title = '';
								var number = 0;
								var id = '';
								_.each(knowledgePointIdArray,function(list, count){
									if(list.knowledgePointId == element.knowledge_point_id && +element.exercise_count){
										title = list.enTitle;
										number = element.exercise_count;
										id = list.id;
									}
								});
								dataFilter.push({
									"title" : title,
									"number" : number,
									"id" : id
								})
							});
							var templateHtml = $('#template-question-bank-imitate').html();
							var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
								data : dataFilter
							});
							$('body #scroller').html(addHtml);
							window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');

							$('body .questionBankList-li').on('click',function(e){
								CAICUI.render.this.questionBankListA(e);
							})
						})
						
					});
				}else{
					this.courseCategoryExamenListAjax({
						'id' : ids[0]
					},function(data){
						var templateHtml = $('#template-question-bank-real').html();
						var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,data);
						$('body #scroller').html(addHtml);
						window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');

						$('body .questionBankList-real-li').on('click',function(e){
							CAICUI.render.this.questionBankListA(e);
						})
					});
				}
				
			},
			childKnowledgeNodePointListAjax : function(args,callback){
				CAICUI.Request.ajax({
					'server' : 'childKnowledgeNodePointList',
					'data' : {

						'knowledgePointId' : CAICUI.render.ids[CAICUI.render.type]
					},
					done : function(data){
						if(data.state == "success"){
							CAICUI.render.childKnowledgeNodePointList = data.data;
							if(callback){callback(data)};
						}else{
							if(CAICUI.render.childKnowledgeNodePointListAjax<2){
								CAICUI.render.childKnowledgeNodePointListAjax++;
								CAICUI.render.this.childKnowledgeNodePointListAjax(args,callback);
							}else{
								layer.msg('Sorry~ 网络异常，请刷新页面重试。', function() {});
							}
						}
					},
					fail : function(data){
						if(CAICUI.render.childKnowledgeNodePointListAjax<2){
							CAICUI.render.childKnowledgeNodePointListAjax++;
							CAICUI.render.this.childKnowledgeNodePointListAjax(args,callback);
						}else{
							layer.msg('Sorry~ 网络异常，请刷新页面重试。', function() {});
						}
					}
				})
			},
			courseCategoryExamenListAjax : function(args,callback){
				CAICUI.Request.ajax({
					'server' : 'courseCategoryExamenList',
					'data' : {
						'courseCategoryId' : CAICUI.render.ids[CAICUI.render.type]
					},
					done : function(data){
						if(data.state == "success"){
							CAICUI.render.courseCategoryExamenList = data.data;
							if(callback){callback(data)};
						}else{
							if(CAICUI.render.courseCategoryExamenListAjax<2){
								CAICUI.render.courseCategoryExamenListAjax++;
								CAICUI.render.this.courseCategoryExamenListAjax(args,callback);
							}else{
								layer.msg('Sorry~ 网络异常，请刷新页面重试。', function() {});
							}
						}
					},
					fail : function(data){
						if(CAICUI.render.courseCategoryExamenListAjax<2){
							CAICUI.render.courseCategoryExamenListAjax++;
							CAICUI.render.this.courseCategoryExamenListAjax(args,callback);
						}else{
							layer.msg('Sorry~ 网络异常，请刷新页面重试。', function() {});
						}
					}
				})
			},
			exercisePointCountCache : function(ids,callback){
				CAICUI.Request.ajax({
					'server' : 'exercisePointCountCache',
					'data' : {
						'type' : '4',
						'knowledge_points' : ids
					},
					done : function(data){
						if(callback){callback(data)};
					},
					fail : function(data){
						
					}
				})
			},
			getQuestionBankIds : function(){
				var ids = [];
				CAICUI.render.getcoursecategory.forEach(function(item, index){
					if(item.certificateName == CAICUI.render.certificate){
						item.subjects.forEach(function(item2, index2){
							if(item2.subjectName == CAICUI.render.subject){
								ids.push(item2.courseCategoryId);
								ids.push(item2.knowledgePointId);
							}
						})
					}
				})
				return ids;
			},
			selectItem : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var index = that.index();
				var thatIsActive = '';
				if(that.hasClass('active')){
					thatIsActive = true;
				}else{
					thatIsActive = false;
					that.siblings().removeClass('active');
					that.addClass('active');
				}
				return {
					"isActive" : thatIsActive,
					"index" : index
				}
			},
			selectQuestionBank : function(e){
				var selectItem = this.selectItem(e);
				var templateHtml = $('#template-question-bank-right').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,CAICUI.render.questionBank.data[selectItem.index]);
				$('body .question-bank-right').html(addHtml);
			},
			questionBankListTypeBtn : function(e){
				var selectItem = this.selectItem(e);
				console.log(selectItem.isActive)
				if(!selectItem.isActive){
					CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
					
					CAICUI.render.questionBankList.type = selectItem.index;
					// this.examenListRender();

					// var link = '#questionBankList/'+CAICUI.render.questionBankList.type+'/'+CAICUI.render.questionBankList.courseCategoryId+'/'+CAICUI.render.questionBankList.knowledgePointId;
					// window.location.hash = link;
					CAICUI.render.type = selectItem.index;
					var link = '#questionBankList/'+CAICUI.render.type+'/'+CAICUI.render.certificate+'/'+CAICUI.render.ids[CAICUI.render.type];
					window.location.hash = link;
				}
				
			},
			questionBankListA : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var index = that.index();
				var link = '';
				var type = CAICUI.render.questionBankList.typeArray[CAICUI.render.questionBankList.type];
				if(+CAICUI.render.questionBankList.type){
					link = '#questionsTestSite/'+type+'/'+CAICUI.render.childKnowledgeNodePointList[index].knowledgePointId+'?return_link='+window.location.hash.substr(1)+'&return_hash=on';
					window.location.hash = link;
				}else{
					link = '#questionsRealImitate/'+type+'/'+CAICUI.render.courseCategoryExamenList[index].id+'?return_link='+window.location.hash.substr(1)+'&return_hash=on';
					window.location.hash = link;
				}
				
				console.log(link);
				// window.location.hash = link;
			}
		});
		return Studycenter;
	});