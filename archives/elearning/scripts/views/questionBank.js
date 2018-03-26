;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body',
			template : _.template($('#template-question-bank').html()),
			events : {
				'click .question-bank-li' : 'selectQuestionBank',
				'click .question-bank-right-li' : 'selectQuestionBankItem',
				'click .question-bank-btn' : 'selectQuestionBankType'
			},
			render : function(){
				
				CAICUI.render.this = this;
				
				
				CAICUI.render.examenType = '';
				CAICUI.render.examenTypeArray = ["real","imitate"];

				// CAICUI.render.certificateArray = ["ACCA", "CMA"];
				CAICUI.render.certificateArray = [{
					certificateName : "ACCA",
					certificateId : "ff808081473905e701475cd3c2080001"
				},{
					certificateName : "CMA",
					certificateId : "ff808081486933e601489c4662f60851"
				}]
				CAICUI.render.certificate = 'ACCA';
				CAICUI.render.certificateId = "ff808081473905e701475cd3c2080001";
				
				CAICUI.render.subject = 'F1';


				this.getcoursecategoryAjax(function(){
					CAICUI.render.coursecategoryIndex = 0;
					CAICUI.render.subjectsActive = CAICUI.render.getcoursecategory.data[CAICUI.render.coursecategoryIndex].subjects[0];

					$('body #right').html(CAICUI.render.this.template(CAICUI.render.getcoursecategory));


					var courseCategoryIdArray = CAICUI.render.this.getIdArray('courseCategoryId');
					var knowledgePointIdArray = CAICUI.render.this.getIdArray('knowledgePointId');
					
					var courseCategoryNumArr = [];
					var knowledgePointNumArr = [];
					courseCategoryIdArray.forEach(function(item){
						CAICUI.render.this.courseCategoryExamenCountAjax({
							'id' : item
						},function(data){
							courseCategoryNumArr.push(data.data[0]);
						});
						// CAICUI.render.this.courseCategoryExamenCountAjax(item,'real');
						// CAICUI.render.this.courseCategoryExamenCountAjax(item,'imitate');
					});
					knowledgePointIdArray.forEach(function(item){
						CAICUI.render.this.exercisePointCountCacheAjax(item,function(data){
							knowledgePointNumArr.push(data.data[0]);
						});
					});
					
					var intervalCourseCategory = setInterval(function(){
						if(courseCategoryNumArr.length == courseCategoryIdArray.length){
							clearInterval(intervalCourseCategory);
							courseCategoryNumArr.forEach(function(item){
								if(CAICUI.render.this.addCount){
									CAICUI.render.this.addCount({
										"key" : "courseCategoryId",
										"id" : item.courseCategoryId,
										"realCount" : item.realCount,
										"imitateCount" : item.imitateCount
									});
								}
							});
							CAICUI.render.getcoursecategory.data.forEach(function(item, index){
								$('body .question-bank-'+CAICUI.render.getcoursecategory.data[index].certificateName+'-realCount').text(CAICUI.render.getcoursecategory.data[index].realCount);
								$('body .question-bank-'+CAICUI.render.getcoursecategory.data[index].certificateName+'-imitateCount').text(CAICUI.render.getcoursecategory.data[index].imitateCount);
							})
							
						}
					},300);
					var intervalKnowledgePoint = setInterval(function(){
						if(knowledgePointNumArr.length == knowledgePointIdArray.length){
							clearInterval(intervalKnowledgePoint);
							knowledgePointNumArr.forEach(function(item){
								if(item){
									if(CAICUI.render.this.addCount){
										CAICUI.render.this.addCount({
											"key" : "knowledgePointId",
											"id" : item.knowledge_point_id,
											"count" : +item.exercise_count
										});
									}
								}
								
							});
							CAICUI.render.getcoursecategory.data.forEach(function(item, index){
								$('body .question-bank-'+CAICUI.render.getcoursecategory.data[index].certificateName+'-exerciseCount').text(CAICUI.render.getcoursecategory.data[index].exerciseCount);
							})
						}
					},300);
				});
			},
			getcoursecategoryAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'getcoursecategory',
					done : function(data){
						CAICUI.render.getcoursecategory = data;
						if(callback){callback()};
					}
				})
			},
			courseCategoryExamenCountAjax : function(args, callback){
				CAICUI.Request.ajax({
					'server' : 'courseCategoryExamenCount',
					'data' : {
						'courseCategoryId' : args.id,
						'examenType' : args.type
					},
					done : function(data){
						CAICUI.render.courseCategoryExamenCount = data;
						if(callback){callback(data)};
					}
				})
			},
			exercisePointCountCacheAjax : function(id,callback){
				CAICUI.Request.ajax({
					'server' : 'exercisePointCountCache',
					'data' : {
						'knowledge_points' : id,
						'type' : 4
					},
					done : function(data){
						CAICUI.render.courseCategoryExamenCount = data;
						if(callback){callback(data)};
					}
				})
			},
			getIdArray : function(key){
				var array = [];
				_.each(CAICUI.render.getcoursecategory.data,function(element, index){
					var thisArray = element[key].split(',');
					for(var i=0;i<thisArray.length;i++){
						array.push(thisArray[i]);
					}
				})
				return array;
			},
			addCount : function(args){
				_.each(CAICUI.render.getcoursecategory.data,function(element, index){
					var thisArray = element[args.key].split(',');
					for(var i=0;i<thisArray.length;i++){
						if(thisArray[i] == args.id){
							if(args.key == 'courseCategoryId'){
								CAICUI.render.getcoursecategory.data[index].realCount += args.realCount;
								CAICUI.render.getcoursecategory.data[index].imitateCount += args.imitateCount;
							}else if(args.key == 'knowledgePointId'){
								CAICUI.render.getcoursecategory.data[index].exerciseCount += args.count;
							}
							
						}
					}
				})
			},
			selectItem : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var index = that.index();
				if(!that.hasClass('active')){
					that.siblings().removeClass('active');
					that.addClass('active');
				}
				return {
					"index" : index
				}
			},
			selectQuestionBank : function(e){
				CAICUI.render.subject = '';
				CAICUI.render.subjectsActive = '';
				CAICUI.render.examenType = '';
				var selectItem = this.selectItem(e);

				CAICUI.render.coursecategoryIndex = selectItem.index;
				CAICUI.render.certificate = CAICUI.render.certificateArray[selectItem.index].certificateName;
				CAICUI.render.certificateId = CAICUI.render.certificateArray[selectItem.index].certificateId;
				var templateHtml = $('#template-question-bank-right').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					name : CAICUI.render.getcoursecategory.data[selectItem.index].certificateName,
					list : CAICUI.render.getcoursecategory.data[selectItem.index].subjects
				});
				$('body .question-bank-right').html(addHtml);
			},
			selectQuestionBankItem : function(e){
				var selectItem = this.selectItem(e);
				CAICUI.render.subjectsActive = CAICUI.render.getcoursecategory.data[CAICUI.render.coursecategoryIndex].subjects[selectItem.index];
				
				if(CAICUI.render.subjectsActive.subjectId == 'ff808081486933e601489c799f0f0868' || CAICUI.render.subjectsActive.subjectId == 'ff808081486933e601489c7a1aa20869'){
					$('body .question-bank-btn-imitate').addClass('hidden');
				}else{
					$('body .question-bank-btn-imitate').removeClass('hidden');
				}
				CAICUI.render.subject = CAICUI.render.getcoursecategory.data[CAICUI.render.coursecategoryIndex].subjects[selectItem.index].subjectName;

				this.openQuestionBankList();
			},
			selectQuestionBankType : function(e){
				var selectItem = this.selectItem(e);
				CAICUI.render.examenType = CAICUI.render.examenTypeArray[selectItem.index];
				this.openQuestionBankList();
			},
			openQuestionBankList : function(){
				if(!CAICUI.render.subject){
					$('body .question-bank-selectType-tips').removeClass('hidden').text('请选择你的练习科目');
					return false;
				}
				if(!CAICUI.render.examenType){
					$('body .question-bank-selectType-tips').removeClass('hidden').text('请选择你的练习类型');
					return false;
				}
				var type = 0;
				var subjectId = '';
				if(CAICUI.render.examenType == 'real'){
					type = 0;
					subjectId = CAICUI.render.subjectsActive.courseCategoryId;
				}else if(CAICUI.render.examenType == 'imitate'){
					type = 1;
					subjectId = CAICUI.render.subjectsActive.knowledgePointId;
				}

				var questionBankCookie = {
					categoryName : CAICUI.render.certificate,
					categoryId : CAICUI.render.certificateId,
					subjectName : CAICUI.render.subjectsActive.subjectName,
					subjectId : subjectId
				}
				$.cookie('questionBankCookie', JSON.stringify(questionBankCookie), {
      		path: '/',
      		expires: 36500
      	});
				var link = '#questionBankList/'+type+'/'+CAICUI.render.certificate+'/'+subjectId;
				window.location.hash = link;
			}
		});
		return Studycenter;
	});