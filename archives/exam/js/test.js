;(function($){
	window.test = {
		listTotal : 0,
		listIndex : 0,
		listActive : "",
		listActiveSelected : false,
		listCardActive : "",
		cardNum : "",
		test_questions_list : "",
		index : 0,
		time : null,
		resultData : {
			examId : "",
			data : [],
			result : []
		},
		flag : false,
		answerArr : ["A","B","C","D","E","F","G","H"],
		list : $(".list"),
		test : $(".test"),
		result : $(".result"),
		testStart : $(".testStart"),
		pause : $("#pause"),
		initPadding : 110,
		pageSize : 20,
		pageCurrent : 1,
		questionData : {},
		isEnd : false,
		request : function(args,callback){
			var host = "http://admin.caicui.com/";
			$.ajax({
				url : host + args.url,
				type : args.type,
				data : args.data,
				success : function(data){
					if(typeof data=="string"){
						data = JSON.parse(data);
					}
					if(callback){callback(data)};
				},
				error : function(data){
					console.log(data)
				}
			})
		},
		examAjax : function(callback){
			this.request({
				"url" : "mobile/exam/getexams",
				"type" : "get",
				"data" : {
					"pageSize" : test.pageSize,
					"pageCurrent" : test.pageCurrent
				}
			},function(data){
				if(callback){callback(data)};
			})
		},
		questionAjax : function(callback){
			var _this = test;
			this.request({
				"url" : "mobile/exam/getquestions/id",
				"type" : "get",
				"data" : {
					"id" : test.resultData.examId
				}
			},function(data){
				test.questionData = data;
				if(callback){callback(data)};
			})
		},
		answerAjax : function(callback){
			var _this = test;
			this.request({
				"url" : "mobile/exam/answer",
				"type" : "post",
				"data" : test.resultData
			},function(data){
				if(callback){callback(data)};
			})
		},
		start : function(){
			
			test.examAjax(function(data){
				var startTemp   =  $("#start-temp").html();
				var temp = Handlebars.compile(startTemp);
				var html = temp(data);
				$('.list').html(html);
				test.startEvent();
				var _this = test;
				$(".list").on('click','.testStart',function(){
					var id = $(this).attr("id");
					_this.resultData.examId = id;
					test.questionAjax(function(data){
						_this.times = data.times;
						var newData = test.filterQuestionData(data,["checkbox","radio","blank","question"]);
						_this.initQuestionDom(data);
						_this.list.hide();
						_this.test.show();
						_this.test.find('.test_header').removeClass('active');
						_this.interval();
					});			
				})
			});
		},
		startEvent : function(){

			var _this = this;
			Handlebars.registerHelper("compare",function(v1,v2,options){
	        return v1[v2]
	    });
			Handlebars.registerHelper("index",function(v1,options){
	        return v1+1;
	    });
			Handlebars.registerHelper("cardState",function(options){
				var state = test.getAnswerState(options).answerState;
				if(state==1){
					return "btn-success"
				}else if(state==-1){
					return "btn-danger"
				}
	    });
	    Handlebars.registerHelper("resultAnalyze",function(options){
				
				if(options.type=="radio" || options.type=="checkbox"){
					var answerData = test.getAnswerState(options);
					var answerState = answerData.answerState;
					var answerRight = answerData.answerRight;
					var answerMe = answerData.answerMe;
					var answerText = "";
					if(answerState==1){
						answerText = answerMe+"，"+"回答正确"
					}else if(answerState==-1){
						answerText = answerMe+"，"+"回答错误"
					}else if(answerState==0){
						answerText = "未选择"
					}
					return "正确答案："+answerRight+"，你的答案："+answerText;
				}
	    });
	    
			Handlebars.registerHelper("optionDom",function(index,options){
				switch (options.type){
					case "radio":
						return '<label for="'+options.id+'"><input type="'+options.type+'" name="iCheck" id="'+options.id+'" data-id="'+options.id+'" data-qid="'+options.qid+'"><em>'+test.answerArr[index]+'</em><span class="test-question-option">'+options.name+'</span></label>'
						break;
					case "checkbox":
						return '<label for="'+options.id+'"><input type="'+options.type+'" name="iCheck" id="'+options.id+'" data-id="'+options.id+'" data-qid="'+options.qid+'"><em>'+test.answerArr[index]+'</em><span class="test-question-option">'+options.name+'</span></label>'
						break;
					case "text":
						return '<label><input class="inputText" type="'+options.type+'" id="'+options.id+'" data-id="'+options.id+'" data-qid="'+options.qid+'"></label>'
						break;
					case "textarea":
						return '<label><textarea class="inputTextarea" id="'+options.id+'" data-id="'+options.id+'" data-qid="'+options.qid+'"></textarea></label>'
						break;
				}
		  });
			var _this = this;
			var prevBtn = $('#prev');
			var nextBtn = $('#next');
			var okBtn = $('#submit');				
			this.card = $("#card");
			var container = $('#container');
			container.on("click",".quit",function(){
				_this.flag = true;
			})
			$('#myModal').on('show.bs.modal', function (e) {
			  _this.flag = true;
			})
			$('#myModal').on('hidden.bs.modal', function (e) {
			  _this.flag = false;
			})
			
			$('#myModal2').on('show.bs.modal', function (e) {
			  _this.flag = true;
			  $('.unanswered-num').text(_this.total-_this.listTotal);
			})
			$('#myModal2').on('hidden.bs.modal', function (e) {
			  _this.flag = false;
			})
			$('#myModal3').on('show.bs.modal', function (e) {
			  _this.flag = true;
			})
			$('#myModal3').on('hidden.bs.modal', function (e) {
				_this.flag = false;
			})
			container.on("click",".card-slider",function(){
				var that = $(this);
				var thatNext = that.next();
				var thatNextHeight = thatNext.innerHeight()+2;
				if(that.hasClass('active')){
					that.removeClass('active');
					$('.test_body').stop(true,false).animate({"padding-top":55},400,function(){
					})
				}else{
					that.addClass('active');
					$('.test_body').stop(true,false).animate({"padding-top":55+thatNextHeight},400,function(){
						
					})
				}
			})
			
			container.on("click",".test-answer-top",function(){
				var that = $(this);
				var thatNext = that.next();
				
				var scrollTop = $('.test_main').scrollTop();
				if(that.hasClass('active')){
					that.removeClass('active');
					thatNext.slideDown();
					var thatNextHeight = $('.test-answer-content').eq(_this.index).height();
					$('.test_main').scrollTop(scrollTop+thatNextHeight);
				}else{
					that.addClass('active');
					thatNext.slideUp();
				}
			})
			

			container.on("click",".test_card_list li",function(){
				var targer = $(this);
				var index = targer.index();
				_this.index = index;
				if(index==0){
					if(!prevBtn.hasClass('disabled')){
						prevBtn.addClass('disabled');
					}
					nextBtn.show();
					okBtn.hide();
				}else{
					if(prevBtn.hasClass('disabled')){
						prevBtn.removeClass('disabled');
					}
					if(index == _this.total-1){
						nextBtn.hide();
						okBtn.show();
						if(_this.isEnd){
							okBtn.addClass('disabled');
							okBtn.attr('disabled','disabled')
						}else{
							okBtn.removeClass('disabled');
						}
					}else{
						nextBtn.show();
						okBtn.hide();
					}
				}
				targer.siblings().removeClass('active');
				targer.addClass('active');
				$(".test_questions_list").hide();
				$(".test_questions_list").eq(index).show();
			})

			nextBtn.on("click",function(){
				_this.index++;
				$('.test_card_list').find('li').eq(_this.index).trigger('click');
			})
			prevBtn.on("click",function(){
				_this.index--;
				if(_this.index<=0) _this.index = 0;
				if(!prevBtn.hasClass('disabled')){
					$('.test_card_list').find('li').eq(_this.index).trigger('click');
				}
			})

			$('body').on("click","#put",function(){
				_this.resultData.data = _this.getPutData();
				_this.answerAjax(function(data){
					_this.resultDom(data);
					_this.isEnd = true;
				});
			})
			
			$('body').on("click","#exit",function(){
				//_this.test.css("padding-top",_this.initPadding);
			  _this.test.hide();
			  _this.result.hide();
			  _this.list.show();
			  clearInterval(_this.time);
			})
		},
		initQuestionDom : function(data){
			var _this = this;
			this.total = data.total;
			this.flag = false;
			this.isEnd = false;
			var tpl   =  $("#tpl").html();
			var temp = Handlebars.compile(tpl);
			var html = temp({"context":data,"arr":this.answerArr});
			$(".test_body").html(html);

	    this.test_questions_list = $(".test_questions_list");
			this.test_card_list = $(".test_card_list");
			this.cardNum = $(".card-num");
		  this.test_questions_list.css("display","none").eq(0).css("display","block");
		  this.listTotal = 0;
		  this.index = 0;
		  this.initQuestionData(this.listIndex);
      $('input[name="iCheck"]').iCheck({
  	    checkboxClass: 'icheckbox_minimal-blue js-input',
  	    radioClass: 'iradio_minimal-blue js-input',
  	    increaseArea: '20%' 
  	  });
  	  
      $('input[name="iCheck"]').on('ifChecked', function(event){
      	var that = $(this);
      	var parentQuestion = that.parents('.test_questions_list');
      	that.iCheck('check');
      	if(parentQuestion.attr('data-listactiveselected') == "false"){
      		parentQuestion.attr('data-listactiveselected','true')
      		_this.listTotal++;
      		_this.setListTotal();
      	}
      	_this.listCardActive.attr('class','btn btn-primary active');
      });
      $('input[name="iCheck"]').on('ifUnchecked', function(event){
      	var that = $(this);
      	var parentQuestion = that.parents('.test_questions_list');
      	that.iCheck('uncheck'); 
      	setTimeout(function(){
      		var checkedNum = _this.listActiveNum();
      		if(!checkedNum){
      			parentQuestion.attr('data-listactiveselected','false')
      			_this.listTotal--;
      			_this.setListTotal();
      			_this.listCardActive.attr('class','btn btn-default active');
      		}
      	},50)
      });
      $('.inputText').keyup(function(){
      	var that = $(this);
      	var thatVal = that.val();
      	var parentQuestion = that.parents('.test_questions_list');
      	if(thatVal){
      		if(parentQuestion.attr('data-listactiveselected') == "false"){
	      		parentQuestion.attr('data-listactiveselected','true')
	      		_this.listTotal++;
	      		_this.setListTotal();
	      		_this.listCardActive.attr('class','btn btn-primary active');
	      	}
      	}else{
      		if(parentQuestion.attr('data-listactiveselected') == "true"){
      			parentQuestion.attr('data-listactiveselected','false')
      			_this.listTotal--;
      			_this.setListTotal();
      			_this.listCardActive.attr('class','btn btn-default active');
      		}
      	}
      })
      $('.inputTextarea').keyup(function(){
      	var that = $(this);
      	var thatVal = that.val();
      	var parentQuestion = that.parents('.test_questions_list');
      	if(thatVal){
      		if(parentQuestion.attr('data-listactiveselected') == "false"){
	      		parentQuestion.attr('data-listactiveselected','true')
	      		_this.listTotal++;
	      		_this.setListTotal();
	      		_this.listCardActive.attr('class','btn btn-primary active');
	      	}
      	}else{
      		if(parentQuestion.attr('data-listactiveselected') == "true"){
      			parentQuestion.attr('data-listactiveselected','false')
      			_this.listTotal--;
      			_this.setListTotal();
      			_this.listCardActive.attr('class','btn btn-default active');
      		}
      	}
      })
      
		},
		initQuestionData : function(index){
			this.listIndex = 0;
			this.index = 0;
			this.listActive = this.test_questions_list.eq(index);
			var cardList = this.test_card_list.find('li');
			cardList.removeClass('active');
			this.listCardActive = cardList.eq(index);
			this.listCardActive.addClass('active').trigger('click');
		},
		setListTotal : function(){
			this.cardNum.text(this.listTotal)
		},
		listActiveNum : function(){
			var num = 0;
			var jsInput = this.listActive.find('.js-input');
			var jsInputLength = jsInput.length;
			for(var i=0;i<jsInputLength;i++){
				if(jsInput.eq(i).hasClass('checked')){
					num++;
				}
			}
			return num;
		},
		getPutData : function(){
			var result = [];
			for(var i=0;len=this.test_questions_list.length,i<len;i++){
				var thisList = this.test_questions_list.eq(i);
				var inputId = thisList.attr('data-id');
				var inputType = thisList.attr('data-inputtype');
				var addData = false;
				var selectData = {
            "type": inputType,
            "questionid": inputId,
            "answer": {}
        };
				// if(inputType=="blank"){
				// 	inputType = "text";
				// }else if(inputType=="question"){
				// 	inputType = "textarea";
				// }
				if(inputType == "radio" || inputType == "checkbox"){
					var thisListInput = thisList.find(".js-input");
					for(var j=0;len=thisListInput.length,j<len;j++){
						var thisInput = thisListInput.eq(j);
						if(thisInput.hasClass('checked')){
							var input = thisInput.children('input');
							var id = input.attr('data-id');
							var qid = input.attr('data-qid');
							selectData.answer[j] = id;
						}
					}
					
				}else if(inputType == "blank"){
					var input = thisList.find('.inputText');
					var id = input.attr('data-id');
					var qid = input.attr('data-qid');
					var name = input.val();
					selectData.answer = name;
				}else if(inputType == "question"){
					var input = thisList.find('.inputTextarea');
					var id = input.attr('data-id');
					var qid = input.attr('data-qid');
					var name = input.val();
					selectData.answer = name;
				}
				result.push(selectData)
			}
			return result;
		},
		filterQuestionData : function(data,arr){
			var newData = data.data;
			var types = arr;
			if(newData && types){
				data.newData = [];
				for(var i=0;i<newData.length;i++){
					for(var j=0;j<types.length;j++){
						if(newData[i].type == types[j]){
							data.newData.push(newData[i]);
						}
					}
				}
			}
			return data;
		},
		showTime : function(times){ 
			var leftsecond = parseInt(times); 
			var day1=Math.floor(leftsecond/(60*60*24)); 
			var hour=Math.floor((leftsecond-day1*24*60*60)/3600); 
			var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60); 
			var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60); 
			if(hour<10) hour = "0"+hour;
			if(minute<10) minute = "0"+minute;
			if(second<10) second = "0"+second;
			return hour+":"+minute+":"+second
		},
		interval : function(){
			var _this = this;
			clearInterval(_this.time);
			$(".test_time span").text(_this.showTime(_this.times--));
			_this.time = setInterval(function(){
				if(_this.times<=0){
					clearInterval(_this.time);
					_this.resultData.data = _this.getPutData();
					_this.answerAjax(function(data){
						_this.resultDom(data);
					});
				}
				if(!_this.flag){
					$(".test_time span").text(_this.showTime(_this.times--));
				}
			},1000)
		},
		resultDom : function(data){
			//this.test.css("padding-top",this.initPadding);
			this.test.find('.test_header').addClass('active');
			this.test.find('input').iCheck('disable');
			// this.test.find('.test_time').text('测试结果');
			// this.test.find('.js-btn-step2').remove();

			var tpl   =  $('#card-result').html();
			var temp = Handlebars.compile(tpl);
			var html = temp(data);
			$('.test_card').html(html);
			for(var i=0;len=data.data.length,i<len;i++){
				var tpl   =  $('#test-answer').html();
				var temp = Handlebars.compile(tpl);
				var html = temp(data.data[i]);
				this.test_questions_list.eq(i).append(html);
			}
			this.index = 0;
			$('.test_card_list').find('li').eq(0).addClass('active').trigger('click')
			
		},
		getRightOptions : function(arr1,arr2){
			var option = '';
			var newArr1 = [];

			if(!arr1){
				return option;
			}
			switch(typeof arr1){
				case "object":
					for(var i in arr1){
						newArr1.push(arr1[i]);
					}
					arr1 = newArr1;
					break;
				case "string":
					newArr1.push(arr1);
			}
			
			for(var i=0;len=arr1.length,i<len;i++){
				
				for(var j=0;len=arr2.length,j<len;j++){
					if(arr1[i]==arr2[j]){
						if(option.length){
							option += ',' + test.answerArr[j];
						}else{
							option += test.answerArr[j];
						}
					}	
				}
			}
			return option;
		},
		getAnswerState : function(options){
			var answerRight = '';
			var answerMe = '';
			var answerState = 0;
			switch (options.type){
				case "radio":
					answerRight = test.getRightOptions(options.right,options.option);
					answerMe = test.getRightOptions(options.answer,options.option);
					break;
				case "checkbox":
					answerRight = test.getRightOptions(options.right,options.option);
					answerMe = test.getRightOptions(options.answer,options.option);
					break;
				case "blank":
					answerRight = options.right;
					answerMe = options.answer;
					break;
				case "question":
					answerRight = options.right;
					answerMe = options.answer;
					break;
			}
			if(answerMe){
				answerMe==answerRight ? answerState=1:answerState=-1;
			}
			return {
				"answerRight" : answerRight,
				"answerMe" : answerMe,
				"answerState" : answerState
			};
		} 
	}
	test.start();
})(jQuery)