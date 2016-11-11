;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body',
			template : _.template($('#template-questions').html()),
			events : {
				'click .questions-card-button' : 'toggleCards',
				'click .js-card-btn' : 'cardBtn',
				'click .js-questions-btn-prev' : 'questionsPrev',
				'click .js-questions-btn-next' : 'questionsNext',
				'click .questions-btn-analysis' : 'analysis',
				'click .js-questions-option-click' : 'questionsOptionClick',
				'keyup .js-questions-option-keyup' : 'questionsOptionKeyup',
				'click .questions-exit' : 'exit'
			},
			render : function(){

				CAICUI.render.answerArr = ["A","B","C","D","E","F","G","H"];
				CAICUI.render.this = this;
				
				CAICUI.render.typeHtml = '';
				CAICUI.render.questionsType = '';
				CAICUI.render.pushContext = '';
				CAICUI.render.isDone = 'false';
				CAICUI.render.exerciseId = '';
				CAICUI.render.questionsDataCache = '';
				CAICUI.render.questionsDataCacheArray = '';
				//CAICUI.render.lastExerciseNid = '' 
				//CAICUI.render.exerciseId = '1'
				// http://192.168.10.112:8081/
				CAICUI.render.exerciseFilenameArray = [];

				CAICUI.render.isMyChecked = '';

				CAICUI.render.cardOpen = false;
				//CAICUI.render.errorNum
				//CAICUI.render.exerciseCount
				CAICUI.render.exerciseDoneCount = '';
				CAICUI.render.exerciseNoDoneCount = '';
				CAICUI.render.exerciseRightCount = '';

				CAICUI.render.this.$el.append(CAICUI.render.this.template());
				CAICUI.render.this.clockTime();

				
				window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body .questions #wrapper');

				this.exerciseFilenameAjax(function(data){

					var templateHtml = $('#template-questions-cards').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						'data' : CAICUI.render.exerciseFilenameArray
					});
					$('body .questions-header').append(addHtml);

					CAICUI.render.this.userKnowledgePointExerciseListAjax(function(data){
						CAICUI.render.questionsDataCacheArray = data;
						CAICUI.render.exerciseDoneCount = data.length;
						CAICUI.render.exerciseNoDoneCount = CAICUI.render.exerciseCount-CAICUI.render.exerciseDoneCount;
						CAICUI.render.exerciseRightCount = CAICUI.render.exerciseDoneCount-CAICUI.render.errorNum;
						var correctRate = ((CAICUI.render.exerciseRightCount/CAICUI.render.exerciseCount)*100).toFixed(0)
						var progress = ((CAICUI.render.exerciseDoneCount/CAICUI.render.exerciseCount)*100).toFixed(0)
						
						$('body .questions-progress-show').attr('data-course-progress', progress);
						$('body .questions-percentage').html(progress);
						$('body .questions-progress-show').animate({
							'width': progress+'%'},
							1000);

						$('.exercise-done-count').text(CAICUI.render.exerciseDoneCount);
						$('.exercise-nodone-count').text(CAICUI.render.exerciseNoDoneCount);

						$('.progress-round-count').text(correctRate);
						$('#progress-round-question').attr('data-progress',correctRate)
						CAICUI.iGlobal.canvasRound('progress-round-question',{
							'borderColor':"#00A184",
							"borderWidth" : 3,
							"bg":true,
							"bgBorderColor" : "#bgBorderWidth"
						});

						_.each(data,function(element,index){
							// if(CAICUI.render.lastExerciseNid==element.nid){
							// 	CAICUI.render.exerciseId = element.exercise_id
							// }
							console.log(element.status)
							var btnClass = 'questions-cards-info';
							if(element.status=='0'){
								btnClass = 'questions-cards-info';
							}else if(element.status=='1'){
								btnClass = 'questions-cards-success';
							}else if(element.status=='2'){
								btnClass = 'questions-cards-danger';
							}
							$('#questions-card-'+element.exercise_id).addClass(btnClass);
							$('#questions-card-'+element.exercise_id).attr('data-isdone','true');

						})

						// if(!CAICUI.render.exerciseId){
						// 	CAICUI.render.exerciseId = CAICUI.render.exerciseFilenameArray[0]
						// }
						//var cardIndex = 0; 
						if(CAICUI.render.lastExerciseNid){
							CAICUI.render.questionsIndex = CAICUI.render.lastExerciseNid;
						}
						CAICUI.render.exerciseId = $('.js-card-btn').eq(CAICUI.render.questionsIndex).attr('data-exerciseid');
						
						

						CAICUI.render.isDone = $('#questions-card-'+CAICUI.render.exerciseId).attr('data-isdone')

						CAICUI.render.this.getNidExerciseDetailAjax(function(){

						});
						//$('#questions-card-'+CAICUI.render.exerciseId).trigger('click');
					});
				})
			},
			exerciseFilenameAjax : function(callback){
				 CAICUI.render.exercise_filename = 'questions-id.html'
				this.getExerciseId(CAICUI.render.exercise_filename,function(data){
					CAICUI.render.exerciseFilenameArray = data;
					if(callback){callback()}
				});
			},
			
			
			userKnowledgePointExerciseListAjax: function(callback){
				CAICUI.Request.ajax({
					'hostName' : 'http://192.168.10.134:8080',
					'server' : 'userKnowledgePointExerciseList',
					'data' : {
						'knowledge_point_id' : CAICUI.render.knowledgepointid,
						'member_id' : CAICUI.User.memberId
					},
					done : function(data){
						if(callback){callback(data.data)}
					}
				})
			},
			getNidExerciseDetailAjax : function(callback){
				CAICUI.Request.ajax({
					'hostName' : 'http://192.168.10.112:8083',
					'server' : 'getNidExerciseDetail',
					'data' : {
						'exerciseId' : CAICUI.render.exerciseId
					},
					done : function(data){
						CAICUI.render.this.addDOMNidExerciseDetail(data.data[0]);
						if(callback){callback(data.data)};
					}
				});
			},
			addDOMNidExerciseDetail:function(data){
				var exerciseData = data;
				//CAICUI.render.lastExerciseNid =exerciseData.nid;

				var templateHtml = $('#template-questions-content').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					'item' : exerciseData
				});
				$('body .questions .scroller').html(addHtml);
				window.CAICUI.myScroll.refresh();
				window.CAICUI.myScroll.scrollTo(0,0);
				CAICUI.render.this.$el.find('img').each(function(item){
					var src = $(this).attr('src');
					$(this).attr('src','http://192.168.10.112:8081'+src)
				})
			},
			setMemberExerciseLogAjax : function(callback){
				this.questionsStatus();
				if(CAICUI.render.isMyChecked){
					CAICUI.render.isMyChecked = '';
					CAICUI.Request.ajax({
						'hostName' : 'http://192.168.10.112:8083',
						'server' : 'setMemberExerciseLog',
						'data' : {
							'knowledgePointId' : CAICUI.render.knowledgepointid,
							'exerciseId' : CAICUI.render.exerciseId,
							'memberId' : CAICUI.User.memberId,
							'context' : JSON.stringify(CAICUI.render.pushContext),
							'status' : CAICUI.render.status,
							'subjectId' : CAICUI.render.subjectId,
							'categoryId' : CAICUI.render.categoryId,
							'courseId' : CAICUI.render.courseId,
							'chapterId' : CAICUI.render.chapterId,
							'cacheKnowledgeLevel1Id' : CAICUI.render.cacheKnowledgeLevel1Id,
							'cacheKnowledgeLevel2Id' : CAICUI.render.cacheKnowledgeLevel2Id,
							'cacheKnowledgePath' : CAICUI.render.cacheKnowledgePath,
							'progress' : CAICUI.render.ExerciseProgress,
							'lastExerciseNid' : CAICUI.render.lastExerciseNid,
							'errorNum' : CAICUI.render.errorNum,
							'totalTime' : CAICUI.render.ExerciseTotalTime
						},
						done : function(data){
							CAICUI.render.this.doneChange();
							
							if(callback){callback(data)};
						}
					});
				}else{
					CAICUI.render.status = 0
					if(callback){callback()};
				}
				
			},
			doneChange : function(){
				var isDone = $('body .js-card-btn').eq(CAICUI.render.questionsIndex).attr('data-isdone');
				if(isDone!="true"){
					CAICUI.render.exerciseDoneCount = +CAICUI.render.exerciseDoneCount + 1;
					CAICUI.render.exerciseNoDoneCount = +CAICUI.render.exerciseNoDoneCount - 1;
					
				}
				if(CAICUI.render.status==1){

				}else if(CAICUI.render.status==2){
					CAICUI.render.errorNum = +CAICUI.render.errorNum + 1;
				}

				$('.exercise-done-count').text(CAICUI.render.exerciseDoneCount);
				$('.exercise-nodone-count').text(CAICUI.render.exerciseNoDoneCount);

				CAICUI.render.exerciseRightCount = CAICUI.render.exerciseDoneCount-CAICUI.render.errorNum;

				var correctRate = ((CAICUI.render.exerciseRightCount/CAICUI.render.exerciseCount)*100).toFixed(0)
				var progress = ((CAICUI.render.exerciseDoneCount/CAICUI.render.exerciseCount)*100).toFixed(0)
				
				$('body .questions-progress-show').attr('data-course-progress', progress);
				$('body .questions-percentage').html(progress);
				$('body .questions-progress-show').animate({
					'width': progress+'%'},
					1000);
				$('.progress-round-count').text(correctRate);
				$('#progress-round-question').attr('data-progress',correctRate)
				CAICUI.iGlobal.canvasRound('progress-round-question',{
					'borderColor':"#00A184",
					"borderWidth" : 3,
					"bg":true,
					"bgBorderColor" : "#bgBorderWidth"
				});
				$('body .js-card-btn').eq(CAICUI.render.questionsIndex).attr('data-isdone','true');
			},
			cardBtn : function(e){
				
				var that = CAICUI.iGlobal.getThat(e);
				var thatButton = that.find('button');
				var index = that.attr('data-index');

				this.setMemberExerciseLogAjax(function(data){
					if(CAICUI.render.status == 1){
						$('#questions-card-'+CAICUI.render.exerciseId).removeClass('questions-cards-danger').addClass('questions-cards-success')
					}else if(CAICUI.render.status == 2){
						$('#questions-card-'+CAICUI.render.exerciseId).removeClass('questions-cards-success').addClass('questions-cards-danger')
					}
					console.log(CAICUI.render.questionsIndex)
					//$('#questions-card-'+CAICUI.render.exerciseId).attr('data-isdone','true')


					CAICUI.render.exerciseId = that.attr('data-exerciseid');
					CAICUI.render.lastExerciseNid = index;
					if(CAICUI.render.ExerciseProgress && CAICUI.render.ExerciseProgress<index){
						CAICUI.render.ExerciseProgress = index;
					}
					CAICUI.render.questionsIndex = index;
					CAICUI.render.isDone = that.attr('data-isdone');
					CAICUI.render.this.getNidExerciseDetailAjax(function(){
						if(CAICUI.render.cardOpen){
							$('body .questions-card-button').trigger('click');
							CAICUI.render.cardOpen = false;
						}
					});
					if(CAICUI.render.isDone=="true"){
						// CAICUI.render.this.getQuestionsDataCacheIndex();
						// CAICUI.render.this.addDOMNidExerciseDetail(CAICUI.render.questionsDataCache);
					}else{
					}
				});
			},
			questionsPrev : function(e){
				if(CAICUI.render.questionsIndex>0){
					var questionsIndex = +CAICUI.render.questionsIndex-1;
					$('body .js-card-btn').eq(questionsIndex).trigger('click');
				}
			},
			questionsNext : function(e){
				if(CAICUI.render.questionsIndex<(CAICUI.render.exerciseCount-1)){
					var questionsIndex = +CAICUI.render.questionsIndex+1;
					$('body .js-card-btn').eq(questionsIndex).trigger('click');
				}
			},
			getQuestionsDataCacheIndex : function(exerciseId){
				console.log(CAICUI.render.exerciseId);
				_.each(CAICUI.render.questionsDataCacheArray,function(element, index){
					if(element.exercise_id === CAICUI.render.exerciseId){
						CAICUI.render.questionsDataCache = element;
						return ;
					}
				})
			},
			questions : function(type,context,answerResolution){
				CAICUI.render.typeHtml = '';
				CAICUI.render.questionsType = type;
				if(CAICUI.render.isDone=="true"){

					this.getQuestionsDataCacheIndex();
					CAICUI.render.pushContext = JSON.parse(CAICUI.render.questionsDataCache.context);
				}else{
					CAICUI.render.pushContext = JSON.parse(context);
				}
				if(type === "multiTask"){
					_.each(CAICUI.render.pushContext,function(element, index){
						CAICUI.render.typeHtml += '<div class="questions-options-box"><div class="questions-options-title">'+element.title+'</div>';
						CAICUI.render.this.questionsTypes(element.type,element.data,index);
						CAICUI.render.typeHtml += '</div>';
					});
				}else{
					CAICUI.render.typeHtml += '<div class="questions-options-box">'
					CAICUI.render.this.questionsTypes(type,CAICUI.render.pushContext,0)
					CAICUI.render.typeHtml += '</div>';
				}
				return CAICUI.render.typeHtml;
			},
			questionsTypes : function(type,context,index){
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
						CAICUI.render.this.matrix('radio',context,index)
						break;
					case "matrixCheckbox":
						CAICUI.render.this.matrix('checkbox',context,index)
						break;
					case "matrixBlank":
						CAICUI.render.this.matrix('blank',context,index)
						break;
				}
			},
			checkbox : function(context,num){
				_.each(context,function(element,index){
					var activeClass = '';
					if(element.myChecked){
						activeClass = 'active';
					}
					CAICUI.render.typeHtml += '<div data-number="'+num+'-'+index+'" class="questions-hover questions-checkbox js-questions-option-click '+activeClass+'"  data-mychecked='+element.myChecked+' data-ischecked='+element.isChecked+'><label><span class="questions-checkbox-input"></span><div>'+element.title+'</div></label></div>'
				})
			},
			radio : function(context,num){
				_.each(context,function(element,index){
					var activeClass = '';
					if(element.myChecked){
						activeClass = 'active';
					}
					CAICUI.render.typeHtml += '<div data-number="'+num+'-'+index+'" class="questions-hover questions-radio js-questions-option-click '+activeClass+'" data-mychecked='+element.myChecked+' data-ischecked='+element.isChecked+'><label><span class="questions-radio-input"></span><div>'+element.title+'</div></label></div>'
				})
			},
			question : function(context,num){
				CAICUI.render.typeHtml += '<div data-number="'+num+'-0" class="questions-question js-questions-option-keyup"><textarea>'+context[0].myBlank+'</textarea></div>'
			},
			
			blank : function(context,num){
				CAICUI.render.typeHtml += '<div data-number="'+num+'-0" class="questions-blank js-questions-option-keyup"><input type="input" val='+context[0].myBlank+'></div>'
			},
			matrix: function(type,context,num){
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

						if(itemData.title && item){
							CAICUI.render.typeHtml += '<td class="questions-td">'+itemData.title+'</td>'
						}else if(item){
							switch(type){
								case "radio":
									CAICUI.render.typeHtml += '<td data-rowsArray='+rowsArray+' data-number="'+num+'-'+item+'" class="questions-td js-questions-option-click questions-radio" data-ischecked='+itemData.isChecked+'>'
									CAICUI.render.typeHtml += '<input class="questions-radio-input" type="radio">'
									break;
								case "checkbox":
									CAICUI.render.typeHtml += '<td data-number="'+num+'-'+item+'" class="questions-td js-questions-option-click questions-checkbox" data-ischecked='+itemData.isChecked+'>'
									CAICUI.render.typeHtml += '<input class="questions-checkbox-input" type="checkbox">'
									break;
								case "blank":
									CAICUI.render.typeHtml += '<td data-number="'+num+'-'+item+'" class="questions-td js-questions-option-keyup">'
									CAICUI.render.typeHtml += '<input type="text">'
									break;
							}
							CAICUI.render.typeHtml += '</td>'
						}else{
							CAICUI.render.typeHtml += '<td class="questions-td"></td>'
						}
					}
					CAICUI.render.typeHtml += '</tr>'
				}
				CAICUI.render.typeHtml += '</tbody></table>';
			},
		  
			questionsOptionClick: function(e){
				e.preventDefault();
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
						that.siblings().attr('data-mychecked','false')
						that.siblings().removeClass('active');
					}
					that.addClass('active');
					mychecked = true;
					that.attr('data-mychecked',mychecked)
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
						})
						CAICUI.render.pushContext[numberArray[1]].myChecked = checked
						break;
					case 'checkbox':
						CAICUI.render.pushContext[numberArray[1]].myChecked = checked
						break;
					case 'matrixRadio':
						var rowsarray = that.attr('data-rowsarray').split(',');
						_.each(rowsarray,function(element, index){
							CAICUI.render.pushContext[0].items[element].myChecked = false;
						})
						CAICUI.render.pushContext[0].items[numberArray[1]].myChecked = checked
						break;
					case 'matrixCheckbox':

						CAICUI.render.pushContext[0].items[numberArray[1]].myChecked = checked
						break;
				}
				console.log(CAICUI.render.pushContext)
			},
			changeMultiTaskQuestionsDataClick : function(type,numberArray,checked,that){
				switch(type){
					case 'radio':
						_.each(CAICUI.render.pushContext[numberArray[0]].data,function(element, index){
							element.myChecked = false;
						})
						CAICUI.render.pushContext[numberArray[0]].data[numberArray[1]].myChecked = checked
						break;
					case 'checkbox':
						CAICUI.render.pushContext[numberArray[0]].data[numberArray[1]].myChecked = checked
						break;
					case 'matrixRadio':
						var rowsarray = that.attr('data-rowsarray').split(',');
						_.each(rowsarray,function(element, index){
							CAICUI.render.pushContext[numberArray[0]].data[0].items[element].myChecked = false;
						})
						CAICUI.render.pushContext[numberArray[0]].data[0].items[numberArray[1]].myChecked = checked
						break;
					case 'matrixCheckbox':

						CAICUI.render.pushContext[numberArray[0]].data[0].items[numberArray[1]].myChecked = checked
						break;
				}
				console.log(CAICUI.render.pushContext)
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
						
						CAICUI.render.pushContext[0].items[numberArray[1]].myBlank = thatVal
						break;
					case 'matrixBlank':

						CAICUI.render.pushContext[0].items[numberArray[1]].myBlank = thatVal
						break;
				}
				console.log(CAICUI.render.pushContext)
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
						
						CAICUI.render.pushContext[0].items[numberArray[1]].myBlank = thatVal
						break;
					case 'matrixBlank':

						CAICUI.render.pushContext[numberArray[0]].data[0].items[numberArray[1]].myBlank = thatVal
						break;
				}
				console.log(CAICUI.render.pushContext)
			},

			questionsStatus: function(){
				if(CAICUI.render.questionsType=="multiTask"){
					var statusEnd = '';
					_.each(CAICUI.render.pushContext,function(element,index){
						statusEnd = CAICUI.render.this.questionsStatusMultiTask(element.type,index);
						if(!statusEnd){
							if(statusEnd){
								CAICUI.render.status = 1;
							}else{
								CAICUI.render.status = 2;
							}
						}
					})
				}else{
					var questionsStatusOther = CAICUI.render.this.questionsStatusOther(CAICUI.render.questionsType);
					if(questionsStatusOther){
						CAICUI.render.status = 1;
					}else{
						CAICUI.render.status = 2;
					}
					
				}
			},
			questionsStatusMultiTask : function(type,index){
				var status = '';
				var contextData = CAICUI.render.pushContext;
				if(type=='matrixRadio'||type=='matrixCheckbox'){
					status = true;
					_.each(contextData[index].data[0].items,function(element, index){
						if(element.isChecked){
							if(element.myChecked){
								CAICUI.render.isMyChecked = true;
								status = true;
							}else{
								status = false;
							}
						}
						if(element.myChecked){
							CAICUI.render.isMyChecked = true;
						}
					});
				}else if(type == 'radio'||type=='checkbox'){
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
				}else if(type == 'blank'||type=='question'){
					//$(CAICUI.render.pushContext[0].blank).text()
					var blankText = contextData[0].blank;
					if(blankText==contextData[0].myBlank){
						status = true;
					}else{
						status = false;
					}
					if(contextData[0].myBlank){
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
				if(type=='checkbox' || type=='radio'){
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
				}else if(type=='question'||type=='blank'){
					//$(CAICUI.render.pushContext[0].blank).text()
					var blankText = contextData[0].blank;
					if(blankText==contextData[0].myBlank){
						status = true;
					}else{
						status = false;
					}
					if(contextData[0].myBlank){
						CAICUI.render.isMyChecked = true;
					}
				}else if(type=='matrixRadio'||type=='matrixCheckbox'){
					status = true;
					_.each(contextData[0].items,function(element,index){
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


		  removeAnimate : function(callback){
				$('#animate').animate({
					'height' : '0',
					'top' : '50%'
				},300,function(){
					$('#animate').remove();
					if(callback){callback();};
				})
			},
			toggleCards : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				if(CAICUI.render.cardOpen){
					CAICUI.render.cardOpen =false;
					that.removeClass('active');
					$('body .questions-cards').removeClass('active');
					//$('body .questions-cards').slideUp(200);
					that.text("展开答题卡")
				}else{
					CAICUI.render.cardOpen = true;
					that.addClass('active');
					$('body .questions-cards').addClass('active');
					//$('body .questions-cards').slideDown(200);
					that.text("收起答题卡")
				}
			},
			exit : function(){
				this.undelegateEvents();
				this.$el.find('.questions').remove();
				this.removeAnimate(function(){
					// window.location.hash = '#courseStudy/'+CAICUI.render.courseId;
				});
				
			},
			analysis : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var analysis = this.$el.find(".questions-answerResolution");
				if(analysis.css("display") == "none"){
					analysis.show();
				}else{
					analysis.hide();
				}
				window.CAICUI.myScroll.refresh();
			},
			clockTime : function(){
				var timer = null,num=CAICUI.render.ExerciseTotalTime,clock = this.$el.find(".questions-times");
				clock.text("00:00:00");
				timer = setInterval(function(){
					num++;
					CAICUI.render.ExerciseTotalTime = jisuan(num);
				},1000);
				function jisuan(times){
					var t = parseInt(times); 
					var day1=Math.floor(t/(60*60*24)); 
					var hour=Math.floor((t-day1*24*60*60)/3600); 
					var minute=Math.floor((t-day1*24*60*60-hour*3600)/60); 
					var second=Math.floor(t-day1*24*60*60-hour*3600-minute*60); 
					if(hour<10) hour = "0"+hour;
					if(minute<10) minute = "0"+minute;
					if(second<10) second = "0"+second;
					clock.text(hour+":"+minute+":"+second);
					return t;
				}
				
			},
			getExerciseId : function(src,callback){
				this.createIframe(src);
				this.getIframeData(function(data){
					if(callback){callback(data)};
				});
			},
			createIframe : function(src){
				var iframe = $("<iframe>");
				$(iframe).attr("src",CAICUI.render.exerciseFilename);
				$(iframe).attr("name","iframe_name");
				$(iframe).attr("id","iframe_name");
				$("body .questions").append(iframe);
			},
			getIframeData : function(callback){
				var iframeData =[];
				$('#iframe_name').load(function(){
					var iframeObj = $('body').find("#iframe_name").contents().find("body").html();
					console.log(iframeObj.split("</script>"))
					if(iframeObj.split("</script>").length>1){
						iframeData = $.trim(iframeObj.split("</script>").slice(2)[0].split(",")).split(",");
					}else{
						iframeData = iframeObj.split(",");
					}
					
					if(callback){callback(iframeData)}
				})
			},
		});
		return Studycenter;
	});