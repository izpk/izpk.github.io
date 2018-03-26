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
				// 'click .myExam-nav-li' : 'myExamNavLi',
				'click .doRecord-chapter-li' : 'selectedDoRecord',
				'click .myWrong-title-li' : 'selectedmyWrong',
				'click .myExam-desc-btn' : 'myExamDescBtn',
				'click .myExam-desc-continue' : 'myExamDescContinue',
				'click .myExam-desc-view' : 'myExamDescView',
				'click .myExam-desc-reset' : 'myExamDescReset',
				'click .doRecord-chapter-del' : 'delMemberExercise',
				'click .js-questions-option-click' : 'questionsOptionClick',
				'keyup .js-questions-option-keyup' : 'questionsOptionKeyup',
				'click .myWrong-answerResolution-btn' : 'analysis',
				'click .js-pagination-li' : 'paginationChange',
				'click .js-pagination-prev' : 'paginationPrev',
				'click .js-pagination-next' : 'paginationNext',
			},
			render : function(type){
				if(CAICUI.render.this.exit && typeof CAICUI.render.this.exit == 'function' && $('body #studycenter-video').length){
					// $('body #studycenter-video').remove();
					CAICUI.render.this.clearInitData();
				}
				if(CAICUI.render.this.exit && typeof CAICUI.render.this.exit == 'function' && $('body .questions').length){
					// $('body .questions').remove();
					CAICUI.render.this.clearInitData();
				}
				CAICUI.render.this = this;
				CAICUI.render.$this = this;
				CAICUI.render.navType = type ? +type : 0;
				CAICUI.render.pageNo = 1;
				CAICUI.render.pageSize = 20;
				CAICUI.render.pageTotal = 0;

				CAICUI.render.myExamDescData = {};
				CAICUI.render.questionsDataCacheArray = [];
				CAICUI.render.answerArr = ["A","B","C","D","E","F","G","H"];
				CAICUI.render.answerResolution = {
					context : '',
					status : true,
					rightAnswer : '',
					myAnswer : ''
				}
				CAICUI.render.viewResolution = false;
				CAICUI.render.readonly = false;
				
				CAICUI.render.$this.$el.html(CAICUI.render.$this.template({'data' : ''}));

				
				window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
				window.CAICUI.examTypeScroll = CAICUI.iGlobal.iScroll('body #wrapper-myExam-desc');
				this.myExam(function(){
					// $('body .doRecord-chapter-li').eq(0).trigger('click');
					CAICUI.render.this.initPage(CAICUI.render.navType);
				});
				setTimeout(function(){
					$('body .myExam-nav-li').on('click',function(e){
						CAICUI.render.$this.myExamNavLi(e);
					})
				},300)
			},
			paginationChange : function(e){
				CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
				window.CAICUI.myScroll.refresh();
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.pageNo =that.attr('data-pageno');
				this.initPage();
			},
			paginationPrev : function(e){
				if(CAICUI.render.pageNo>1){
					CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
					window.CAICUI.myScroll.refresh();
					CAICUI.render.pageNo = +CAICUI.render.pageNo-1;
					this.initPage();
				}
			},
			paginationNext : function(e){
				if(CAICUI.render.pageNo<=CAICUI.render.pageTotal-1){
					CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
					window.CAICUI.myScroll.refresh();
					CAICUI.render.pageNo = +CAICUI.render.pageNo+1;
					this.initPage();
				}
			},
			initPage : function(){
				switch (CAICUI.render.navType){
					case 0:
						this.myExam();
						break;
					case 1:
						this.myWrongTitle();
						break;
				}
			},
			myExam : function(callback){
				this.examList(function(data){
					var templateHtml = $('#template-myExam-doRecord').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,data);
					$('body #scroller').html(addHtml);
					window.CAICUI.myScroll.refresh();
					if(callback){callback()};
				})
			},
			myExamDesc : function(callback){
				this.examDescAjax(function(data){
					var filterData = [];
					for(var i=0;i<data.length;i++){
						var thisIndex = 0;
						var addData = true;
						console.log(data[i].sort)
						console.log(filterData);
						for(var j=0;j<filterData.length;j++){
							if(data[i].sort == filterData[j].sort){
								addData = false;
							}
						}
						if(addData){
							filterData.push(data[i]);
						}
					}
					var data = filterData;
					var templateHtml = $('#template-myExam-doRecord-desc').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						'data' : data,
						'myExamDescData' : CAICUI.render.myExamDescData
					});
					$('body #scroller-myExam-desc').html(addHtml);
					window.CAICUI.examTypeScroll.refresh();
					if(callback){callback()};
				});
			},
			myWrongTitle : function(callback){
				this.myWrongTitleAjax(function(data){
					var totalCount = 0;
					var myWrongTitle = data.data;
					if(myWrongTitle && myWrongTitle.length){
						for(var i=0;i<myWrongTitle.length;i++){
							if(myWrongTitle[i].exercise_list && myWrongTitle[i].exercise_list.length){
								for(var j=0;j<myWrongTitle[i].exercise_list.length;j++){
									totalCount++;
								}
							}
						}
					}
					CAICUI.render.pageTotal = Math.ceil(data.count/CAICUI.render.pageSize);
					var templateHtml = $('#template-my-wrong-title').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						'data' : {
							'myWrongTitle' : data.data,
							'pageNo': CAICUI.render.pageNo,
							'pageSize': CAICUI.render.pageSize,
							'totalCount': data.count
						}
					});
					$('body #scroller').html(addHtml);
					window.CAICUI.myScroll.refresh();
					if(callback){callback()};
				});
				
			},
			myWrongExercise : function(callback){
				this.myWrongExerciseAjax(function(data){
					// var templateHtml = $('#template-my-wrong-title').html();
					// var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,data);
					// $('body #scroller').html(addHtml);
					CAICUI.render.this.addDOMNidExerciseDetail(data[0]);
					
					if(callback){callback()};
				});
				
			},
			myExamNavLi : function(e){
				//$('.ac-content').find('.ac-right').remove();
				
				var that = CAICUI.iGlobal.getThat(e);
				var index = that.index();

				var link = '#myExam/'+index;
				window.location.hash = link;

				this.addActive(e);
				CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
				window.CAICUI.myScroll.refresh();
				CAICUI.render.pageNo = 1;
				CAICUI.render.navType = index;
				
				this.initPage();
			},
			addActive : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				that.siblings().removeClass('active');
				that.addClass('active');
				return that;
			},
			examList : function(callback){
				CAICUI.Request.ajax({
					'server' : 'get_exercise_knowledge_member_status',
					'data' : {
						'member_id' : CAICUI.User.memberId,
						'pageNo' : CAICUI.render.pageNo,
						'pageSize' : CAICUI.render.pageSize
					},
					done : function(data){
						if(data.state == "success" && data.data && data.data.length){
							if(callback){
								var oldData = data.data;
								var newData = [];
								for(var i=0;i<oldData.length;i++){
									if(oldData[i].create_date){
										var createDateYear = oldData[i].create_date.split(' ')[0];
										if(newData && newData.length){
											var addList = false;
											var addListIndex = 0;
											for(var j=0;j<newData.length;j++){
												if(newData[j].create_year_date == createDateYear){
													addList = true;
													addListIndex = j;
												}
											}
											if(addList){
												newData[addListIndex].list.push(oldData[i])
											}else{
												newData.push({
													'create_year_date' : createDateYear,
													'list' : [oldData[i]]
												})
											}
										}else{
											newData.push({
												'create_year_date' : createDateYear,
												'list' : [oldData[i]]
											})
										}
									}
								}
								CAICUI.render.pageTotal = Math.ceil(data.count/CAICUI.render.pageSize);
								callback({'data' : {
									'examList' : newData,
									'pageNo': CAICUI.render.pageNo,
									'pageSize': CAICUI.render.pageSize,
									'totalCount': data.count
								}});
							}
						}else{
							callback({'data' : {
								'examList' : {},
								'pageNo': 1,
								'pageSize': 20,
								'totalCount': 20
							}});
						}
						// var nowDate = CAICUI.iGlobal.getDate(new Date().getTime());
						// var stooges = data.data;
						// var testTime = _.chain(stooges)
						//  	.map(function(stooge){ return CAICUI.iGlobal.getDate(stooge.testTime) ; })
						//   .uniq()
						//   .value();
						// var myExam = [];
						// for(var i=0;i<testTime.length;i++){
						// 	var testTimeI = (testTime[i] == nowDate ? 'TODAY' : testTime[i])
						// 	myExam.push({
						// 		"testTime" : testTimeI,
						// 		"list" : []
						// 	})
						// 	_.each(data.data,function(element, index, list){
						// 		if(CAICUI.iGlobal.getDate(element.testTime) == testTime[i]){
						// 			if(myExam && myExam[i] && myExam[i].list){
						// 				myExam[i].list.push(element);
						// 			}else{
						// 				myExam[i].list = [element];
						// 			}
						// 		}
						// 	});
						// };
					},
					fail : function(data){
						callback({'data' : {
							'examList' : {},
							'pageNo': 1,
							'pageSize': 20,
							'totalCount': 20
						}});
					}
				})
			},
			examDescAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'get_user_knowledge_point_exercise_list',
					'data' : {
						'member_id' : CAICUI.User.memberId,
						'knowledge_point_id' : CAICUI.render.myExamDescData.knowledge_point_id,
						'examenNum' : CAICUI.render.myExamDescData.examenNum
					},
					done : function(data){
						if(callback){callback(data.data)};
					}
				});
			},
			myWrongTitleAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'getMemberErrorExercise',
					'data' : {
						'memberId' : CAICUI.User.memberId,
						'pageNo' : CAICUI.render.pageNo,
						'pageSize' : CAICUI.render.pageSize
					},
					done : function(data){
						if(callback){callback(data)};
					}
				});
			},
			myWrongExerciseAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'getNidExerciseDetail',
					'data' : {
						'exerciseId' : CAICUI.render.myWrongExerciseData.exerciseid
						// 'exerciseId' : 'ff8080814f1c162a014f200dc2aa1fda'
					},
					done : function(data){
						CAICUI.render.myWrongExerciseData.exerciseid = data.data[0].id;
						
						CAICUI.render.questionsDataCacheArray = data.data;
						if(callback){callback(data.data)};
					}
				});
			},
			delMemberExerciseAjax : function(knowledgePointId, examenNum, callback){
				CAICUI.Request.ajax({
					'server' : 'delMemberExercise',
					'data' : {
						'memberId' : CAICUI.User.memberId,
						'knowledgePointId' : knowledgePointId,
						'examenNum' : examenNum
					},
					done : function(data){
						console.log(data);
						if(callback){callback(data.data)};
					}
				});
			},
			setMemberErrorExerciseAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'setMemberErrorExercise',
					'data' : {
						'memberId' : CAICUI.User.memberId,
						'errorexerciseids' : '',
						'correctexerciseids' : CAICUI.render.myWrongExerciseData.exerciseid,
						'examenId' : CAICUI.render.myWrongExerciseData.examen_id,
						'examenName' : CAICUI.render.myWrongExerciseData.exercise_name
					},
					done : function(data){
						console.log(data);
						if(callback){callback(data.data)};
					}
				});
			},
			delMemberExercise : function(e){
				e.preventDefault();
				e.stopPropagation();
				var that = CAICUI.iGlobal.getThat(e);
				var parents = that.parent().parent();
				var knowledgePointId = parents.attr('data-knowledge_point_id');
				var examenNum = parents.attr('data-examennum');

				this.delMemberExerciseAjax(knowledgePointId, examenNum, function(){
					if(parents.siblings() && parents.siblings().length){
						parents.remove();
					}else{
						parents.parent().parent().remove();
					}
					window.CAICUI.myScroll.refresh();
				});
			},
			selectedDoRecord : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var parents = that.parent().parent();
				if(that.hasClass('active')){
					// that.removeClass('active');
					// parents.removeClass('active');
				}else{
					CAICUI.iGlobal.loading('body #scroller-myExam-desc',{'height':$('#wrapper-myExam-desc').height()+'px'});
					window.CAICUI.examTypeScroll.refresh();
					window.CAICUI.examTypeScroll.scrollTo(0,0);
					parents.siblings().removeClass('active');
					parents.siblings().find('li').removeClass('active');
					if(parents.hasClass('active')){

					}else{
						parents.addClass('active');
					}
					that.siblings().removeClass('active');
					that.addClass('active');
					CAICUI.render.myExamDescData = {
						examen_type : that.attr('data-examen_type'),
						knowledge_point_id : that.attr('data-knowledge_point_id'),
						examenNum : that.attr('data-examenNum'),
						examen_name : that.attr('data-examen_name'),
						examen_total_num : that.attr('data-examen_total_num'),
						is_finish : that.attr('data-is_finish'),
						error_num : that.attr('data-error_num'),
						last_exercise_nid : that.attr('data-last_exercise_nid'),
						course_id : that.attr('data-course_id'),
						chapter_id : that.attr('data-chapter_id'),
						task_id : that.attr('data-task_id'),
						correct_num : that.attr('data-correct_num')
					}
					CAICUI.render.$this.myExamDesc();
				}
			},
			
			selectedmyWrong : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var parents = that.parent().parent();
				if(that.hasClass('active')){
					// that.removeClass('active');
					// parents.removeClass('active');
				}else{
					CAICUI.iGlobal.loading('body #scroller-myExam-desc',{'height':$('#wrapper-myExam-desc').height()+'px'});
					CAICUI.render.readonly = false;
					parents.siblings().removeClass('active');
					parents.siblings().find('li').removeClass('active');
					if(parents.hasClass('active')){

					}else{
						parents.addClass('active');
					}
					that.siblings().removeClass('active');
					that.addClass('active');
					CAICUI.render.myWrongExerciseData = {
						examen_id : that.attr('data-examen_id'),
						exercise_name : that.attr('data-exercise_name'),
						exerciseid : that.attr('data-exerciseid'),
						sort : that.attr('data-sort')
					}
					CAICUI.render.exerciseId = that.data('data-exerciseid');
					CAICUI.render.isDone = "false";
					CAICUI.render.$this.myWrongExercise();
				}
			},
			myExamDescBtn : function(e){
				
			},
			myExamDescContinue : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatLink = that.attr('data-link');
				CAICUI.render.myExamContinue = CAICUI.render.myExamDescData;
				window.location.hash = thatLink;
			},
			myExamDescView : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatLink = that.attr('data-link');
				CAICUI.render.viewResolution = true;
				CAICUI.render.myExamContinue = CAICUI.render.myExamDescData;
				window.location.hash = thatLink;
			},
			myExamDescReset : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatLink = that.attr('data-link');
				
				if(CAICUI.render.myExamDescData.examen_type == "knowledge" || CAICUI.render.myExamDescData.examen_type == "testSite"){
					this.delMemberExerciseAjax(CAICUI.render.myExamDescData.knowledge_point_id, CAICUI.render.myExamDescData.examenNum, function(){
						CAICUI.render.myExamContinue = {};
						window.location.hash = thatLink;
					});
				}else{
					CAICUI.render.myExamContinue = {};
					window.location.hash = thatLink;
				}

				
			},
			addDOMNidExerciseDetail:function(data){
				var exerciseData = data;
				var templateHtml = $('#template-questions-myWrong-content').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					'myWrongExerciseData' : CAICUI.render.myWrongExerciseData,
					'item' : exerciseData
				});
				$('body #scroller-myExam-desc').html(addHtml);
				$('body #scroller-myExam-desc').find('img').each(function(item){
					// var src = $(this).attr('src');
					// $(this).attr('src',CAICUI.Common.host.static+src);
					var src = $(this).attr('src');
					var srcSubstr = src.substr(-3);
					if(srcSubstr == "jpg" || srcSubstr == "png" || srcSubstr == "gif" || srcSubstr == "svg"){
						src = CAICUI.Common.host.static+src;
					}
					$(this).attr('src',src);
				})
				setTimeout(function(){
					window.CAICUI.examTypeScroll.refresh();
					window.CAICUI.examTypeScroll.scrollTo(0,0);
				},300)
			},
			analysis : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var analysis = this.$el.find(".questions-answerResolution");
				if(analysis.hasClass('active')){
					// analysis.removeClass('active')
					// $('body .questions-body').removeClass('questions-answerResolution-active')
				}else{
					CAICUI.render.readonly = true;
					$('body .questions-options-box').find('input').attr('readonly','readonly');
					$('body .questions-options-box').find('textarea').attr('readonly','readonly');

					$('body .questions-body').addClass('questions-answerResolution-active')
					this.questionsStatus(function(){
						console.log(CAICUI.render.status)
						var html = CAICUI.render.this.questionsResolution(CAICUI.render.questionsDataCacheArray[0].questionTypes, CAICUI.render.questionsDataCacheArray[0].context, CAICUI.render.questionsDataCacheArray[0].answerResolution)
						$('body .questions-answerResolution').html(html)
						analysis.addClass('active');
						if(CAICUI.render.status==1){
							CAICUI.render.this.setMemberErrorExerciseAjax(function(){
								$('body #myWrong-'+CAICUI.render.myWrongExerciseData.exerciseid).remove();
							});
						}
					})
					

					// if(CAICUI.render.isMyChecked){
					// 	$('body .js-card-btn').eq(+CAICUI.render.questionsIndex).trigger('click');
					// }else{
					// 	analysis.addClass('active')
					// }
					
				}
				window.CAICUI.examTypeScroll.refresh();
			},
			getQuestionsDataCacheIndex : function(exerciseId,callback){
				for(var i=0;i<CAICUI.render.questionsDataCacheArray.length;i++){
					var exerciseId = CAICUI.render.questionsDataCacheArray[i].exercise_id || CAICUI.render.questionsDataCacheArray[i].exerciseId;
					if(exerciseId == CAICUI.render.exerciseId){
						CAICUI.render.questionsDataCache = CAICUI.render.questionsDataCacheArray[i];
						return CAICUI.render.questionsDataCacheArray[i];
					}
				}
			},
			questions : function(type,context,answerResolution){
				CAICUI.render.questionsAnswer = '';
				CAICUI.render.typeHtml = '';
				CAICUI.render.questionsType = type;
				var activeClass = '';
				if(CAICUI.render.isDone){
					activeClass = 'active';
					var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','#39':"'"};
					var newContent = this.getQuestionsDataCacheIndex().context.replace(/&(lt|gt|nbsp|amp|quot|#39);/ig,function(all,t){return arrEntities[t];});
					
					var newContentFalseArr = newContent.split('"false"');
					newContent = '';
					var length = newContentFalseArr.length
					for(var i=0;i<length;i++){
						if(i == (length-1)){
							newContent += newContentFalseArr[i]
						}else{
							newContent += newContentFalseArr[i] + 'false'
						}
					}
					var newContentTrueArr = newContent.split('"true"');
					newContent = '';
					var length = newContentTrueArr.length
					for(var i=0;i<length;i++){
						if(i == (length-1)){
							newContent += newContentTrueArr[i]
						}else{
							newContent += newContentTrueArr[i] + 'true'
						}
					}
					
					// newContent.replace(/"false"/g, false);
					// newContent.replace(/"true"/g, true);
					console.log(newContent)
					try{
						CAICUI.render.pushContext = JSON.parse(newContent);
					}catch(e){
						CAICUI.render.pushContext = JSON.parse(newContent.slice(1,newContent.length-1));
					}
					// if(typeof newContent == "string"){
					// 	CAICUI.render.pushContext = JSON.parse(newContent.slice(1,newContent.length-1));
					// }else{
					// 	CAICUI.render.pushContext = JSON.parse(newContent);
					// }
				}else{
					CAICUI.render.pushContext = JSON.parse(context);
				}
				CAICUI.render.answerResolution.context = answerResolution;
				if(type === "multiTask"){
					_.each(CAICUI.render.pushContext,function(element, index){
						CAICUI.render.typeHtml += '<div class="questions-options-box"><div class="questions-options-title">'+element.title+'</div>';
						CAICUI.render.this.questionsTypes(element.type,element.data,index);
						CAICUI.render.typeHtml += '</div>';
					});
				}else{
					CAICUI.render.typeHtml += '<div class="questions-options-box">';
					CAICUI.render.this.questionsTypes(type,CAICUI.render.pushContext,0);
					CAICUI.render.typeHtml += '</div>';
				}
				return CAICUI.render.typeHtml;
			},
			questionsTypes : function(type,context,index, showChecked){
				switch(type){
					case "checkbox":
						CAICUI.render.this.checkbox(context,index);
						break;
					case "radio":
						CAICUI.render.this.radio(context,index);
						break;
					case "question":
						CAICUI.render.this.question(context,index);
						break;
					case "blank":
						CAICUI.render.this.blank(context,index)
						break;
					case "matrixRadio":
						CAICUI.render.this.matrix('matrixRadio',context,index, showChecked);
						break;
					case "matrixCheckbox":
						CAICUI.render.this.matrix('matrixCheckbox',context,index, showChecked);
						break;
					case "matrixBlank":
						CAICUI.render.this.matrix('matrixBlank',context,index, showChecked);
						break;
				}
			},
			checkbox : function(context,num){
				var right = true;
				var rightAnswer = '';
				var myAnswer = '';
				_.each(context,function(element, index){
					var regExp = CAICUI.render.this.optionRegExpTest(element.title);
						if(!regExp){
						var activeClass = '';
						if(element.isChecked){
							rightAnswer += CAICUI.render.answerArr[index] + ' ';
						}
						if(element.myChecked){
							activeClass = 'active';
							myAnswer += CAICUI.render.answerArr[index] + ' ';
						}
						if(element.isChecked != element.myChecked){
							right = false;
						}
						CAICUI.render.typeHtml += '<div data-number="'+num+'-'+index+'" class="questions-hover questions-checkbox js-questions-option-click '+activeClass+'"  data-mychecked='+element.myChecked+' data-ischecked='+element.isChecked+'><label><span class="questions-checkbox-input"></span><span class="questions-options-item">'+CAICUI.render.answerArr[index]+'：'+'</span><div>'+element.title+'</div></label></div>';
					}
				});
				CAICUI.render.answerResolution = {
					status : right,
					rightAnswer : rightAnswer,
					myAnswer : myAnswer
				};
			},
			radio : function(context,num){
				var right = true;
				var rightAnswer = '';
				var myAnswer = '';
				_.each(context,function(element,index){
					var regExp = CAICUI.render.this.optionRegExpTest(element.title);
					if(!regExp){
						var activeClass = '';
						if(element.isChecked){
							rightAnswer += CAICUI.render.answerArr[index] + ' ';
						}
						if(element.myChecked){
							activeClass = 'active';
							myAnswer += CAICUI.render.answerArr[index] + ' ';
						}
						if(element.isChecked != element.myChecked){
							right = false;
						}
						CAICUI.render.typeHtml += '<div data-number="'+num+'-'+index+'" class="questions-hover questions-radio js-questions-option-click '+activeClass+'" data-mychecked='+element.myChecked+' data-ischecked='+element.isChecked+'><label><span class="questions-radio-input"></span><span class="questions-options-item">'+CAICUI.render.answerArr[index]+'：'+'</span><div>'+element.title+'</div></label></div>';
					}
				});
				CAICUI.render.answerResolution = {
					status : right,
					rightAnswer : rightAnswer,
					myAnswer : myAnswer
				};
			},
			question : function(context,num){
				var right = true;
				var blank = '';
				if(context[0].myBlank){
					blank = context[0].myBlank;
				}
				if(context[0].blank != context[0].myBlank){
					right = false;	
				}
				CAICUI.render.typeHtml += '<div data-number="'+num+'-0" class="questions-question js-questions-option-keyup"><textarea>'+blank+'</textarea></div>';
				CAICUI.render.answerResolution = {
					status : right,
					rightAnswer : context[0].blank,
					myAnswer : context[0].myBlank
				};
			},
			blank : function(context,num){
				var right = true;
				var blank = '';
				if(context[0].myBlank){
					blank = context[0].myBlank;
				}
				if(context[0].blank != context[0].myBlank){
					right = false;	
				}
				CAICUI.render.typeHtml += '<div data-number="'+num+'-0" class="questions-blank js-questions-option-keyup"><input type="input" value='+blank+'></div>';
				CAICUI.render.answerResolution = {
					status : right,
					rightAnswer : context[0].blank,
					myAnswer : context[0].myBlank
				};
			},
			matrix: function(type,context,num, showChecked){
				var data = context[0];
				var itemsLength = data.items.length;
				var cols = data.cols;
				var rows = data.rows;
				CAICUI.render.typeHtml += '<table class="questions-table questions-matrix questions-matrix-'+type+'"><tbody class="questions-tbody">';
				for(var i=0;i<rows;i++){
					CAICUI.render.typeHtml += '<tr class="questions-tr">';
					var rowsArray = [];
					for(var n=1;n<cols;n++){
						rowsArray.push(n+(i*cols));
					}
					for(var j=0;j<cols;j++){
						var item = j+(i*cols);
						var itemData = data.items[item];
						var isCheckedClass = '';
						var myBlank = '';
						if(itemData.title && item){
							CAICUI.render.typeHtml += '<td class="questions-td">'+itemData.title+'</td>';
						}else if(item){
							switch(type){
								case "matrixRadio" :
									if(itemData.myChecked){
										isCheckedClass = ' active';
									}
									CAICUI.render.typeHtml += '<td data-mychecked='+itemData.myChecked+' data-rowsArray='+rowsArray+' data-number="'+num+'-'+item+'" class="questions-td  questions-radio js-questions-option-click'+isCheckedClass +'" data-ischecked='+itemData.isChecked+'>';
									CAICUI.render.typeHtml += '<span class="questions-radio-input"></span>';
									break;
								case "matrixCheckbox":
									if(itemData.myChecked){
										isCheckedClass = ' active';
									}
									CAICUI.render.typeHtml += '<td data-mychecked='+itemData.myChecked+' data-number="'+num+'-'+item+'" class="questions-td  questions-checkbox js-questions-option-click'+isCheckedClass +'" data-ischecked='+itemData.isChecked+'>';
									CAICUI.render.typeHtml += '<span class="questions-checkbox-input"></span>';
									break;
								case "matrixBlank":
									if(itemData.myBlank){
										myBlank = itemData.myBlank;
									}
									CAICUI.render.typeHtml += '<td data-number="'+num+'-'+item+'" class="questions-td js-questions-option-keyup">';
									CAICUI.render.typeHtml += '<input type="text" value="'+myBlank+'" >';
									break;
							}
							CAICUI.render.typeHtml += '</td>';
						}else{
							CAICUI.render.typeHtml += '<td class="questions-td"></td>';
						}
					}
					CAICUI.render.typeHtml += '</tr>';
				}
				CAICUI.render.typeHtml += '</tbody></table>';
			},
		  questionsResolution: function(type, context, answerResolution){
		  	var contextData = '';
		  	contextData = CAICUI.render.pushContext;
		  	if(typeof context === 'string'){
		  		contextData = JSON.parse(context);
		  	}
		  	
		  	CAICUI.render.questionsAnswerHtml = '';
		  	CAICUI.render.questionsAnswerHtml += '<p class="questions-answerResolution-p">问题解析</p>';
		  	var questionsStatus = 0;
		  	var questionsStatusClass = 'questions-answer-error';
		  	if(CAICUI.render.status==1){
		  		questionsStatus = 1;
		  		CAICUI.render.questionsStatus = "回答正确";
		  		questionsStatusClass = 'questions-answer-success';
		  	}else if(CAICUI.render.status==2){
		  		questionsStatus = 2;
		  		CAICUI.render.questionsStatus = "回答错误 正确答案是：";
		  	}else{
		  		questionsStatus = 0;
		  		CAICUI.render.questionsStatus = "正确答案是：";
		  	}

		  	
		  	if(questionsStatus==1){
		  		CAICUI.render.questionsAnswerHtml += '<div class="questions-answer-status '+questionsStatusClass+'">';
		  		CAICUI.render.questionsAnswerHtml += '<span class="questions-answer ">'+CAICUI.render.questionsStatus+'</span>';
		  		CAICUI.render.questionsAnswerHtml +=  '</div>';
		  	}else if(questionsStatus==2){
		  		if(type == "multiTask"){
		  			CAICUI.render.questionsAnswerHtml += '<div class="questions-answer-status '+questionsStatusClass+'">';
		  				CAICUI.render.questionsAnswerHtml += '<span class="questions-answer ">'+CAICUI.render.questionsStatus+'</span>';
		  			_.each(contextData,function(element, index){
		  				
		  				CAICUI.render.questionsAnswer = '';
		  				CAICUI.render.questionsAnswerHtml += '<p class="questions-answerResolution-item">第'+(+index+1)+'题：</p>';
		  				CAICUI.render.this.questionsResolutionTypes(element.type,element.data, index, true);
		  			});
		  		}else{
		  			CAICUI.render.questionsAnswerHtml += '<div class="questions-answer-status '+questionsStatusClass+'">';
		  			CAICUI.render.questionsAnswerHtml += '<span class="questions-answer ">'+CAICUI.render.questionsStatus+'</span>';
		  			this.questionsResolutionTypes(type, contextData, 0, true);
		  		}
		  		CAICUI.render.questionsAnswerHtml +=  '</div>';
		  	}
		  	

		  	CAICUI.render.questionsAnswerHtml += '<div class="questions-answerResolution-content">';
		  	CAICUI.render.questionsAnswerHtml += '<span class="questions-answerResolution-text">解析：</span>';
		  	if(answerResolution){
		  		CAICUI.render.questionsAnswerHtml += answerResolution;
		  	}else{
		  		CAICUI.render.questionsAnswerHtml += '暂无解析';
		  	}
		  	CAICUI.render.questionsAnswerHtml += '</div>';
		  	return CAICUI.render.questionsAnswerHtml;
		  },
		  questionsResolutionTypes : function(type, context, index, showChecked){
		  	switch(type){
		  		case "checkbox":
		  			CAICUI.render.this.checkboxChecked(context,index);
		  			// CAICUI.render.questionsAnswer += '正确答案是：'+CAICUI.render.answerResolution.rightAnswer;
		  			// if(CAICUI.render.answerResolution.myAnswer){
		  			// 	CAICUI.render.questionsAnswer += '，您的答案是：' + CAICUI.render.answerResolution.myAnswer;
		  			// }
		  			CAICUI.render.questionsAnswerHtml +=  '<span class="questions-answer">'+CAICUI.render.answerResolution.rightAnswer+'</span>';
		  			
		  			break;
		  		case "radio":
		  			CAICUI.render.this.radioChecked(context,index);
		  			// CAICUI.render.questionsAnswer += '正确答案是：'+CAICUI.render.answerResolution.rightAnswer;
		  			// if(CAICUI.render.answerResolution.myAnswer){
		  			// 	CAICUI.render.questionsAnswer += '，您的答案是：' + CAICUI.render.answerResolution.myAnswer;
		  			// }
		  			CAICUI.render.questionsAnswerHtml +=  '<span class="questions-answer">'+CAICUI.render.answerResolution.rightAnswer+'</span>';
		  			break;
		  		case "question":
		  			CAICUI.render.this.questionChecked(context,index);
		  			// CAICUI.render.questionsAnswerHtml +=  '<span class="questions-answer">'
		  			// if(CAICUI.render.answerResolution.myAnswer){
		  			// 	CAICUI.render.questionsAnswerHtml += '您的答案是：' + CAICUI.render.answerResolution.myAnswer;
		  			// }
		  			// CAICUI.render.questionsAnswerHtml +=  '</span>';
		  			// CAICUI.render.questionsAnswerHtml +=  '</p>';
		  			// CAICUI.render.questionsAnswerHtml += '<p>正确答案是：'+CAICUI.render.answerResolution.rightAnswer+'</p>';

		  			CAICUI.render.questionsAnswerHtml +=  '<span class="questions-answer">'+CAICUI.render.answerResolution.rightAnswer+'</span>';
		  			break;
		  		case "blank":
		  			// CAICUI.render.this.blankChecked(context,index);
		  			// CAICUI.render.questionsAnswer += '正确答案是：'+CAICUI.render.answerResolution.rightAnswer;
		  			// if(CAICUI.render.answerResolution.myAnswer){
		  			// 	CAICUI.render.questionsAnswer += '，您的答案是：' + CAICUI.render.answerResolution.myAnswer;
		  			// }
		  			// CAICUI.render.questionsAnswerHtml +=  '<span class="questions-answer">'+CAICUI.render.questionsAnswer+'</span>'
		  			// CAICUI.render.questionsAnswerHtml +=  '</p>';

		  			CAICUI.render.questionsAnswerHtml +=  '<span class="questions-answer">'+CAICUI.render.answerResolution.rightAnswer+'</span>';
		  			
		  			break;
		  		case "matrixRadio":
		  			// CAICUI.render.questionsAnswerHtml +=  '</p>';
		  			// CAICUI.render.questionsAnswerHtml += '<p>正确答案是：</p>';
		  			CAICUI.render.this.matrixChecked('matrixRadio',context,index, showChecked);
		  			break;
		  		case "matrixCheckbox":
		  			// CAICUI.render.questionsAnswerHtml +=  '</p>';
		  			// CAICUI.render.questionsAnswerHtml += '<p>正确答案是：</p>';
		  			CAICUI.render.this.matrixChecked('matrixCheckbox',context,index, showChecked);
		  			break;
		  		case "matrixBlank":
		  			// CAICUI.render.questionsAnswerHtml +=  '</p>';
		  			// CAICUI.render.questionsAnswerHtml += '<p>正确答案是：</p>';
		  			CAICUI.render.this.matrixChecked('matrixBlank',context,index, showChecked);
		  			break;
		  	}
		  	return CAICUI.render.questionsAnswerHtml;
		  },
		  checkboxChecked : function(context,num){
		  	var right = true;
		  	var rightAnswer = '';
		  	var myAnswer = '';
		  	_.each(context,function(element, index){
		  		var regExp = CAICUI.render.this.optionRegExpTest(element.title);
		  			if(!regExp){
		  			var activeClass = '';
		  			if(element.isChecked){
		  				rightAnswer += CAICUI.render.answerArr[index] + ' ';
		  			}
		  			if(element.myChecked){
		  				activeClass = 'active';
		  				myAnswer += CAICUI.render.answerArr[index] + ' ';
		  			}
		  			if(element.isChecked != element.myChecked){
		  				right = false;
		  			}
		  			CAICUI.render.typeHtml += '<div data-number="'+num+'-'+index+'" class="questions-hover questions-checkbox js-questions-option-click '+activeClass+'"  data-mychecked='+element.myChecked+' data-ischecked='+element.isChecked+'><label><span class="questions-checkbox-input"></span><span class="questions-options-item">'+CAICUI.render.answerArr[index]+'：'+'</span><div>'+element.title+'</div></label></div>';
		  		}
		  	});

		  	CAICUI.render.answerResolution = {
		  		status : right,
		  		rightAnswer : rightAnswer,
		  		myAnswer : myAnswer
		  	};
		  },
		  radioChecked : function(context,num){
		  	// console.log(context)
		  	var right = true;
		  	var rightAnswer = '';
		  	var myAnswer = '';
		  	_.each(context,function(element,index){
		  		var regExp = CAICUI.render.this.optionRegExpTest(element.title);
		  		if(!regExp){
		  			var activeClass = '';
		  			if(element.isChecked){
		  				rightAnswer += CAICUI.render.answerArr[index] + ' ';
		  			}
		  			if(element.myChecked){
		  				activeClass = 'active';
		  				myAnswer += CAICUI.render.answerArr[index] + ' ';
		  			}
		  			if(element.isChecked != element.myChecked){
		  				right = false;
		  			}
		  			CAICUI.render.typeHtml += '<div data-number="'+num+'-'+index+'" class="questions-hover questions-radio js-questions-option-click '+activeClass+'" data-mychecked='+element.myChecked+' data-ischecked='+element.isChecked+'><label><span class="questions-radio-input"></span><span class="questions-options-item">'+CAICUI.render.answerArr[index]+'：'+'</span><div>'+element.title+'</div></label></div>';
		  		}
		  	});
		  	CAICUI.render.answerResolution = {
		  		status : right,
		  		rightAnswer : rightAnswer,
		  		myAnswer : myAnswer
		  	};
		  },
		  questionChecked : function(context,num){
		  	var right = true;
		  	var blank = '';
		  	if(context[0].myBlank){
		  		blank = context[0].myBlank;
		  	}
		  	if(context[0].blank != context[0].myBlank){
		  		right = false;	
		  	}
		  	CAICUI.render.typeHtml += '<div data-number="'+num+'-0" class="questions-question js-questions-option-keyup"><textarea>'+blank+'</textarea></div>';
		  	CAICUI.render.answerResolution = {
		  		status : right,
		  		rightAnswer : context[0].blank,
		  		myAnswer : context[0].myBlank
		  	};
		  },
		  blankChecked : function(context,num){
		  	var right = true;
		  	var blank = '';
		  	if(context[0].myBlank){
		  		blank = context[0].myBlank;
		  	}
		  	if(context[0].blank != context[0].myBlank){
		  		right = false;	
		  	}
		  	CAICUI.render.typeHtml += '<div data-number="'+num+'-0" class="questions-blank js-questions-option-keyup"><input type="input" value='+blank+'></div>';
		  	CAICUI.render.answerResolution = {
		  		status : right,
		  		rightAnswer : context[0].blank,
		  		myAnswer : context[0].myBlank
		  	};
		  },
		  matrixChecked: function(type,context,num, showChecked){
		  	var data = context[0];
		  	var itemsLength = data.items.length;
		  	var cols = data.cols;
		  	var rows = data.rows;
		  	var isShowChecked = false;
		  	var isShowCheckedClass = '';
		  	var optionClick = '';
		  	var optionKeyup = '';
		  	var optionBlank = '';
		  	var optionDisabled = '';
		  	CAICUI.render.questionsAnswerHtml += '<table class="questions-table questions-matrix questions-matrix-'+type+'"><tbody class="questions-tbody">';
		  	for(var i=0;i<rows;i++){
		  		CAICUI.render.questionsAnswerHtml += '<tr class="questions-tr">';
		  		var rowsArray = [];
		  		for(var n=1;n<cols;n++){
		  			rowsArray.push(n+(i*cols));
		  		}
		  		for(var j=0;j<cols;j++){
		  			var item = j+(i*cols);
		  			var itemData = data.items[item];
		  			isShowChecked = false;
		  			isShowCheckedClass = '';
		  			optionBlank = '';
		  			optionClick = ' js-questions-option-click';
		  			optionKeyup = ' js-questions-option-keyup';
		  			if(itemData.title && item){
		  				CAICUI.render.questionsAnswerHtml += '<td class="questions-td">'+itemData.title+'</td>';
		  			}else if(item){
		  				if(showChecked){
		  					optionClick = '';
		  					optionKeyup = '';
		  					if(itemData.isChecked){
		  						isShowChecked = true;
		  						isShowCheckedClass = ' active';

		  					}
		  					if(itemData.blank){
		  						optionDisabled = 'disabled';
		  						optionBlank = itemData.blank;
		  					}
		  				}
		  				switch(type){
		  					case "matrixRadio" :
		  						CAICUI.render.questionsAnswerHtml += '<td data-mychecked='+isShowChecked+' data-rowsArray='+rowsArray+' data-number="'+num+'-'+item+'" class="questions-td  questions-radio '+isShowCheckedClass + optionClick+'" data-ischecked='+itemData.isChecked+'>';
		  						CAICUI.render.questionsAnswerHtml += '<span class="questions-radio-input"></span>';
		  						break;
		  					case "matrixCheckbox":
		  						CAICUI.render.questionsAnswerHtml += '<td data-mychecked='+isShowChecked+' data-number="'+num+'-'+item+'" class="questions-td  questions-checkbox '+isShowCheckedClass + optionClick+'" data-ischecked='+itemData.isChecked+'>';
		  						CAICUI.render.questionsAnswerHtml += '<span class="questions-checkbox-input"></span>';
		  						break;
		  					case "matrixBlank":
		  						CAICUI.render.questionsAnswerHtml += '<td data-mychecked='+isShowChecked+' data-number="'+num+'-'+item+'" class="questions-td '+optionKeyup+'">';
		  						CAICUI.render.questionsAnswerHtml += '<input type="text" value="'+optionBlank+'" '+optionDisabled+'>';
		  						break;
		  				}
		  				CAICUI.render.questionsAnswerHtml += '</td>';
		  			}else{
		  				CAICUI.render.questionsAnswerHtml += '<td class="questions-td"></td>';
		  			}
		  		}
		  		CAICUI.render.questionsAnswerHtml += '</tr>';
		  	}
		  	CAICUI.render.questionsAnswerHtml += '</tbody></table>';
		  },
		  questionsOptionClick: function(e){
				e.preventDefault();
				if(CAICUI.render.readonly){
					return false;
				}
				var that = CAICUI.iGlobal.getThat(e);
				var mychecked = that.attr('data-mychecked');
				var number = that.attr('data-number');
				var numberArray = number.split('-');
				if(mychecked=="true"){
					that.removeClass('active');
					mychecked = false;
					that.attr('data-mychecked',mychecked);
				}else{
					if(that.hasClass('questions-radio')){
						that.siblings().attr('data-mychecked','false');
						that.siblings().removeClass('active');
					}
					that.addClass('active');
					mychecked = true;
					that.attr('data-mychecked',mychecked);
				}
				if(CAICUI.render.questionsType=="multiTask"){
					this.changeMultiTaskQuestionsDataClick(CAICUI.render.pushContext[numberArray[0]].type,numberArray,mychecked,that);
				}else{
					this.changeQuestionsDataClick(CAICUI.render.questionsType,numberArray,mychecked,that);
				}
			},
			changeQuestionsDataClick : function(type,numberArray,checked,that){
				switch(type){
					case 'radio':
						_.each(CAICUI.render.pushContext,function(element, index){
							element.myChecked = false;
						});
						CAICUI.render.pushContext[numberArray[1]].myChecked = checked;
						break;
					case 'checkbox':
						CAICUI.render.pushContext[numberArray[1]].myChecked = checked;
						break;
					case 'matrixRadio':
						var rowsarray = that.attr('data-rowsarray').split(',');
						_.each(rowsarray,function(element, index){
							CAICUI.render.pushContext[0].items[element].myChecked = false;
						});
						CAICUI.render.pushContext[0].items[numberArray[1]].myChecked = checked;
						break;
					case 'matrixCheckbox':

						CAICUI.render.pushContext[0].items[numberArray[1]].myChecked = checked;
						break;
				}
			},
			changeMultiTaskQuestionsDataClick : function(type,numberArray,checked,that){
				switch(type){
					case 'radio':
						_.each(CAICUI.render.pushContext[numberArray[0]].data,function(element, index){
							element.myChecked = false;
						});
						CAICUI.render.pushContext[numberArray[0]].data[numberArray[1]].myChecked = checked;
						break;
					case 'checkbox':
						CAICUI.render.pushContext[numberArray[0]].data[numberArray[1]].myChecked = checked;
						break;
					case 'matrixRadio':
						var rowsarray = that.attr('data-rowsarray').split(',');
						_.each(rowsarray,function(element, index){
							CAICUI.render.pushContext[numberArray[0]].data[0].items[element].myChecked = false;
						});
						CAICUI.render.pushContext[numberArray[0]].data[0].items[numberArray[1]].myChecked = checked;
						break;
					case 'matrixCheckbox':

						CAICUI.render.pushContext[numberArray[0]].data[0].items[numberArray[1]].myChecked = checked;
						break;
				}
			},

			questionsOptionKeyup: function(e){
				e.preventDefault();
				var that = CAICUI.iGlobal.getThat(e);
				var number = that.attr('data-number');
				var numberArray = number.split('-');
				var thatVal = that.children().val();

				if(CAICUI.render.questionsType=="multiTask"){
					this.changeMultiTaskQuestionsDataKeyup(CAICUI.render.pushContext[numberArray[0]].type,numberArray,thatVal,that);
				}else{
					this.changeQuestionsDataKeyup(CAICUI.render.questionsType,numberArray,thatVal,that);
				}
			},
			changeQuestionsDataKeyup: function(type,numberArray,thatVal,that){
				switch(type){
					case 'blank':
						CAICUI.render.pushContext[numberArray[1]].myBlank = thatVal;
						break;
					case 'question':
						CAICUI.render.pushContext[numberArray[1]].myBlank = thatVal;
						break;
					case 'matrixQuestion':
						
						CAICUI.render.pushContext[0].items[numberArray[1]].myBlank = thatVal;
						break;
					case 'matrixBlank':

						CAICUI.render.pushContext[0].items[numberArray[1]].myBlank = thatVal;
						break;
				}
			},
			changeMultiTaskQuestionsDataKeyup: function(type,numberArray,thatVal,that){
				switch(type){
					case 'blank':
						CAICUI.render.pushContext[numberArray[0]].data[0].myBlank = thatVal;
						break;
					case 'question':
						CAICUI.render.pushContext[numberArray[0]].data[0].myBlank = thatVal;
						break;
					case 'matrixQuestion':
						
						CAICUI.render.pushContext[0].items[numberArray[1]].myBlank = thatVal;
						break;
					case 'matrixBlank':

						CAICUI.render.pushContext[numberArray[0]].data[0].items[numberArray[1]].myBlank = thatVal;
						break;
				}
			},
			questionsStatus: function(callback){
				if(CAICUI.render.questionsType=="multiTask"){
					var statusEnd = '';
					var statusRightTotal = 0;
					_.each(CAICUI.render.pushContext,function(element,index){
						statusEnd = CAICUI.render.this.questionsStatusMultiTask(element.type,index);
						if(statusEnd){
							statusRightTotal++;
						}
					});
					if(statusRightTotal == CAICUI.render.pushContext.length){
						CAICUI.render.status = 1;
					}else{
						CAICUI.render.status = 2;
					}
				}else{
					var questionsStatusOther = CAICUI.render.this.questionsStatusOther(CAICUI.render.questionsType);
					if(questionsStatusOther){
						CAICUI.render.status = 1;
					}else{
						CAICUI.render.status = 2;
					}
					
				}
				if(callback){
					callback();
				}
			},
			questionsStatusMultiTask : function(type,index){
				var status = '';
				var contextData = CAICUI.render.pushContext;
				if(type=='matrixRadio'){
					status = true;
					var isCheckedNum = 0;
					var myCheckedNum = 0;
					var isCheckedTotal = 0;
					var myCheckedTotal = 0;
					_.each(contextData[index].data[0].items,function(element, index){
						if(element.isChecked){
							isCheckedTotal++;
							if(element.myChecked){
								myCheckedTotal++;
							}
						}
					});
					if(isCheckedTotal == myCheckedTotal){
						status = true;
					}else{
						status = false;
					}
					if(myCheckedTotal){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type=='matrixCheckbox'){
					status = true;
					var isCheckedNum = 0;
					var myCheckedNum = 0;
					var isCheckedTotal = 0;
					var myCheckedTotal = 0;
					_.each(contextData[index].data[0].items,function(element, index){
						if(element.isChecked && element.myChecked){
							myCheckedNum++;
						}
						if(element.isChecked){
							isCheckedTotal++;
						}
						if(element.myChecked){
							myCheckedTotal++;
						}
					})
					if(myCheckedTotal == isCheckedTotal){
						if(isCheckedTotal && myCheckedNum && isCheckedTotal == myCheckedNum){
							status = true;
						}else{
							status = false;
						}
					}else{
						status = false;
					}
					if(myCheckedTotal){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type == 'radio'){
					status = true;
					_.each(contextData[index].data,function(element,index){
						if(element.isChecked){
							if(element.myChecked){
								status = true;
							}else{
								status = false;
							}
						}
						if(element.myChecked){
							CAICUI.render.isMyChecked = true;
						}
					})
				}else if(type=='checkbox'){
					status = true;
					var isCheckedNum = 0;
					var myCheckedNum = 0;
					var isCheckedTotal = 0;
					var myCheckedTotal = 0;
					_.each(contextData,function(element,index){
						if(element.isChecked && element.myChecked){
							myCheckedNum++;
						}
						if(element.isChecked){
							isCheckedTotal++;
						}
						if(element.myChecked){
							myCheckedTotal++;
							CAICUI.render.isMyChecked = true;
						}
					})
					if(myCheckedTotal == isCheckedTotal){
						if(isCheckedTotal && myCheckedNum && isCheckedTotal == myCheckedNum){
							status = true;
							
						}else{
							status = false;
						}
					}else{
						status = false;
					}
				}else if(type == 'blank'){
					//$(CAICUI.render.pushContext[0].blank).text()
					var context = contextData[index].data[0];
					var blankText = context.blank;
					if(blankText==context.myBlank){
						status = true;
					}else{
						status = false;
					}
					if(context.myBlank){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type=='question'){
					var context = contextData[index].data[0];
					var blankText = context.blank;
					if(context.myBlank){
						status = true;
					}else{
						status = false;
					}
					if(context.myBlank){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type == 'matrixBlank'){
					status = true;
					_.each(contextData[index].data[0].items,function(element,index){
						//$(element.blank).text();
						var elementBlank = element.blank;
						if(elementBlank){
							if(elementBlank==element.myBlank){
								status = true;
							}else{
								status = false;
							}
						}
						if(element.myBlank){
							CAICUI.render.isMyChecked = true;
						}
					})
				}
				return status;
			},
			questionsStatusOther : function(type){
				var status = '';
				var contextData = CAICUI.render.pushContext;
				if(type=='radio'){
					status = true;
					_.each(contextData,function(element,index){
						if(element.isChecked){
							if(element.myChecked){
								status = true;
							}else{
								status = false;
							}
						}
						if(element.myChecked){
							CAICUI.render.isMyChecked = true;
						}
					})
				}else if(type=='checkbox'){
					status = true;
					var isCheckedNum = 0;
					var myCheckedNum = 0;
					var isCheckedTotal = 0;
					var myCheckedTotal = 0;
					_.each(contextData,function(element,index){
						if(element.isChecked && element.myChecked){
							myCheckedNum++;
						}
						if(element.isChecked){
							isCheckedTotal++;
						}
						if(element.myChecked){
							myCheckedTotal++;
							CAICUI.render.isMyChecked = true;
						}
					})
					if(myCheckedTotal == isCheckedTotal){
						if(isCheckedTotal && myCheckedNum && isCheckedTotal == myCheckedNum){
							status = true;
							
						}else{
							status = false;
						}
					}else{
						status = false;
					}
				}else if(type=='blank'){
					var blankText = contextData[0].blank;
					if(blankText==contextData[0].myBlank){
						status = true;
					}else{
						status = false;
					}
					if(contextData[0].myBlank){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type=='question'){
					var blankText = contextData[0].blank;
					if(contextData[0].myBlank){
						status = true;
					}else{
						status = false;
					}
					if(contextData[0].myBlank){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type=='matrixRadio'){
					status = true;
					var isCheckedNum = 0;
					var myCheckedNum = 0;
					var isCheckedTotal = 0;
					var myCheckedTotal = 0;
					_.each(contextData[index].data[0].items,function(element, index){
						if(element.isChecked){
							isCheckedTotal++;
							if(element.myChecked){
								myCheckedTotal++;
							}
						}
					});
					if(isCheckedTotal == myCheckedTotal){
						status = true;
					}else{
						status = false;
					}
					if(myCheckedTotal){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type=='matrixCheckbox'){
					status = true;
					var isCheckedNum = 0;
					var myCheckedNum = 0;
					var isCheckedTotal = 0;
					var myCheckedTotal = 0;
					_.each(contextData[index].data[0].items,function(element, index){
						if(element.isChecked && element.myChecked){
							myCheckedNum++;
						}
						if(element.isChecked){
							isCheckedTotal++;
						}
						if(element.myChecked){
							myCheckedTotal++;
						}
					})
					if(myCheckedTotal == isCheckedTotal){
						if(isCheckedTotal && myCheckedNum && isCheckedTotal == myCheckedNum){
							status = true;
						}else{
							status = false;
						}
					}else{
						status = false;
					}
					if(myCheckedTotal){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type=='matrixBlank'){
					status = true;
					_.each(contextData[0].items,function(element,index){
						//$(element.blank).text()
						var elementBlank = element.blank;
						if(elementBlank){
							if(elementBlank==element.myBlank){
								status = true;
							}else{
								status = false;
							}
						}
						if(element.myBlank){
							CAICUI.render.isMyChecked = true;
						}
					})
				}
				return status;
			},
			clearInitData : function(){
				clearInterval(CAICUI.render.timer);
				CAICUI.render.this.undelegateEvents();
				CAICUI.render.cardOpen = false;
				CAICUI.render.ExerciseTotalTime = 0;
				CAICUI.render.errorNum = 0;
				CAICUI.render.exerciseCount = 0;
				CAICUI.render.exerciseDoneCount = 0;
				CAICUI.render.exerciseNoDoneCount = 0;
				CAICUI.render.exerciseRightCount = 0;
			},
			optionRegExpTest : function(string){
				// console.log(string)
				var regExp = false;
				if(string){
					var startString = string.slice(0,2);
					var endString = string.slice(2);
					
					if(startString == "选项"){
						regExp = new RegExp('点击这里编辑').test(endString);
					}
				}
				
				return regExp;
			},
		});
		return Studycenter;
	});