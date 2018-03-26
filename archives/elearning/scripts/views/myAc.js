;define([
	'jquery',
	'underscore',
	'backbone',
	'views/ac-list',
	'views/ac-desc',
	'layer',
	// 'layerExt',
	],function($, _, Backbone, AcList, AcDesc){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-my-ac').html()),
			events : {
				'click .myAc-nav-li' : 'myAcNavLi',
				'mouseleave .ac-select-box' : 'selectBoxLeave',
				'click .ac-select-a' : 'acSelectA',
				'click .courseAc-option-li' : 'addActive',
				'click .js-ac-list-active' : 'acListActive',
				'click .courseAc-Ad-close' : 'courseAcAdClose',
				'click .option-li' : 'acOptionChoose',
				'click .js-pagination-li' : 'paginationChange',
				'click .js-pagination-prev' : 'paginationPrev',
				'click .js-pagination-next' : 'paginationNext',
				'click .ac-desc-like-a' : 'likeAc',
				'click .ac-search-a' : 'searchAc',
				// 'click .ac-list-info-video' : 'acVideoLink',
				'click .ac-list-remove' : 'acRemove',
				'click .ac-answer-replys' : 'acAnswerReplys',
				'click .js-ac-load-cancel' : 'acLoadCancel',
				'click .js-ac-load-confirm' : 'acLoadConfirm',
				'click .js-acReply-load-cancel' : 'acReplyLoadCancel',
				'click .js-acReply-load-confirm' : 'acReplyLoadConfirm',
			},
			render : function(type){
				CAICUI.render.navType = type ? +type : 0;
				this.$el.html(this.template({
					'data' : {
						'type' : CAICUI.render.navType
					}
				}));
				window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
				CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px','position': 'relative'});

				this.$scroller = this.$('#scroller');
				this.$courseAcContent = this.$('.ac-content');
				this.$courseAcRight = this.$('.ac-right');

				CAICUI.render.$this = this;
				

				CAICUI.render.self = 1;
				CAICUI.render.type = 3;
				CAICUI.render.ordertype = 1;
				CAICUI.render.pageNo = 1;
				CAICUI.render.pageSize = 20;
				CAICUI.render.search = '';
				CAICUI.render.totalCount = '';
				CAICUI.render.pageTotal = 0;

				CAICUI.render.bbsId = '';
				CAICUI.render.bbsType = 0;

				CAICUI.render.listActive = '';
				CAICUI.render.replayId = '';
				CAICUI.render.replayContent = '';

				CAICUI.render.parentsAcListActive = '';
				CAICUI.render.acRemoveLoad = '';
				CAICUI.render.parentLi = '';
				CAICUI.render.acReplayRemoveLoad = '';

				CAICUI.render.removeReplayNum = 0;

				
				switch (CAICUI.render.navType){
					case 0:
						this.myAcList();
						break;
					case 1:
						this.myJoin();
						break;
				}
				// this.myAcList(function(){
				// 	$('body .js-ac-list-active').eq(0).trigger('click');
				// });
				
			},
			bbslist : function(callback){
				CAICUI.Request.ajax({
					'server' : 'bbslist',
					'data' : {
						'token' : CAICUI.User.token,
						'type' : CAICUI.render.type,
						'subjectId' : '',
						'keyWords' : CAICUI.render.search,
						'self' : CAICUI.render.self,
						'ordertype' : CAICUI.render.ordertype,
						'pageNo' : CAICUI.render.pageNo,
						'pageSize' : CAICUI.render.pageSize
					},
					done : function(data){
						CAICUI.render.pageTotal = Math.ceil(data.totalCount/data.pageSize);
						callback(data);
					},
					fail : function(data){
						callback({});
					}
				})
			},
			bbslistMyJoin : function(callback){
				CAICUI.Request.ajax({
					'server' : 'bbslist_myJoin',
					'data' : {
						'token' : CAICUI.User.token,
						'type' : CAICUI.render.type,
						'subjectId' : '',
						'keyWords' : CAICUI.render.search,
						'ordertype' : CAICUI.render.ordertype,
						'pageNo' : CAICUI.render.pageNo,
						'pageSize' : CAICUI.render.pageSize
					},
					done : function(data){
						callback(data);
					},
					fail : function(data){
						callback({});
					}
				})
			},
			bbsdetail : function(callback){
				CAICUI.Request.ajax({
					'server' : 'bbsdetail',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.replayId,
						'pageNo' : 1,
						'pageSize' : 20
					},
					done : function(data){
						callback(data.data);
					},
					fail : function(data){
						callback({});
					}
				})
			},
			likeAc : function(){
				CAICUI.Request.ajax({
					'server' : 'bbs_praise',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.replayId,
						'action' : 2,
					},
					done : function(data){
						CAICUI.render.listActive.find('.ac-list-info-like-num').text(data.data.totalCount);
						$('.ac-desc-like-num').text(data.data.totalCount);
					},
					fail : function(data){
						layer.msg('Sorry~ ', function() {});
					}
				})
			},
			// bbsreply : function(content){
			// 	CAICUI.render.replayContent = content;
			// 	CAICUI.Request.ajax({
			// 		'server' : 'bbsreply',
			// 		'data' : {
			// 			'token' : CAICUI.User.token,
			// 			'id' : CAICUI.render.replayId,
			// 			'content' : CAICUI.render.replayContent,
			// 			'replaytype' : 0,
			// 			'pageNo' : 1,
			// 			'pageSize' : 20
			// 		},
			// 		done : function(data){
			// 			console.log(data);
			// 			//callback(data.data);
			// 			this.bbsdetail(function(data){
			// 				var acDesc = new AcDesc();
			// 				$('.ac-content').find('.ac-right').remove();
			// 				$('.ac-content').append(acDesc.render({
			// 					"data" : data,
			// 					"isme" : isme
			// 				}).el);
			// 				window.CAICUI.acScroll = CAICUI.iGlobal.iScroll('body #wrapper-ac');
			// 			});

			// 		}
			// 	})
			// },
			bbs_del : function(callback){
				CAICUI.Request.ajax({
					'server' : 'bbs_del',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.bbsId,
						'type' : CAICUI.render.bbsType
					},
					done : function(data){
						if(callback){callback()};
					},
					fail : function(data){
						layer.msg('Sorry~ 您没有当前帖子的删除权限', function() {});
					}
				})
			},
			acListActive : function(e){
				e.stopPropagation();
				
				var that = CAICUI.iGlobal.getThat(e);
				var parentsLi = that.parents('.ac-list-li');
				CAICUI.render.listActive = that;
				parentsLi.siblings().removeClass('active');
				parentsLi.addClass('active');
				CAICUI.render.replayId = parentsLi.attr('data-id');
				if(CAICUI.render.replayId){
					CAICUI.iGlobal.loading('.ac-right');
					this.bbsdetail(function(data){
						console.log(data)
						var acDesc = new AcDesc();
						$('.ac-content').find('.ac-right').remove();
						$('.ac-content').append(acDesc.render({
							"data" : data,
							"isme" : true
						}).el);
						setTimeout(function(){
							window.CAICUI.acScroll = CAICUI.iGlobal.iScroll('body #wrapper-ac');
							layer.photos({
					      photos: '.discussQA-imgPath',
					      shift : 0
					    });
						},300)
						
					});
				}else{
					layer.msg('Sorry~ 原帖已删除', function() {});
				}
				

			},
			getThat : function(e){
				return $(e.currentTarget);
			},
			myAcNavLi : function(e){
				//$('.ac-content').find('.ac-right').remove();
				
				var that = this.getThat(e);
				var index = that.index();
				var link = '#myAc/'+index;
				window.location.hash = link;

				return false;
				this.addActive(e);
				CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
				window.CAICUI.myScroll.refresh();
				CAICUI.render.pageNo = 1;
				CAICUI.render.navType = index;
				switch (CAICUI.render.navType){
					case 0:
						this.myAcList();
						break;
					case 1:
						this.myJoin();
						break;
				}
			},
			myAcList : function(callback){
				var acList = new AcList();
				this.bbslist(function(data){
					CAICUI.render.$this.$scroller.html(acList.render({
						'data' : {
							'acType' : 'myAc',
							'type' : 0,
							'bbslist' : data.data,
							'pageNo': data.pageNo,
							'pageSize': data.pageSize,
							'totalCount': data.totalCount
						}
					}).el);
					window.CAICUI.myScroll.refresh();
					$('body .js-ac-list-active').eq(0).trigger('click');
					//$('body .ac-list-li').eq(0).trigger('click');
				})
			},
			myJoin : function(){
				var acList = new AcList();
				this.bbslistMyJoin(function(data){
					CAICUI.render.$this.$scroller.html(acList.render({
						'data' : {
							'type' : 1,
							'bbslist' : data.data,
							'pageNo': data.pageNo,
							'pageSize': data.pageSize,
							'totalCount': data.totalCount
						}
					}).el);
					window.CAICUI.myScroll.refresh();
					$('body .js-ac-list-active').eq(0).trigger('click');
					//$('body .ac-list-li').eq(0).trigger('click');
				})
			},

			courseNavAnimate : function(box,type){
				box.stop(true,false).animate({
					'width' : '148px'
				},this.courseNavAnimateTime)
			},
			courseNavPreAnimate : function(index){
				var li = this.$('.courseIndex-li').eq(index)
				this.$('.courseIndex-active-box').eq(index).stop(true,false).animate({
					'width' : 34,
					'marginLeft' : 0
				},this.courseNavAnimateTime,function(){
					li.removeClass('hover')
				});
			},
			
			
			nextDomShow : function(e){
				var that = this.getThat(e);
				that.next().toggleClass('active');
			},
			addActive : function(e){
				var that = this.getThat(e);
				that.siblings().removeClass('active');
				that.addClass('active');
				return that;
			},
			
			acSelectA : function(e){
				var that = this.getThat(e);
				that.toggleClass('active');
				that.next().toggleClass('active');
			},
			selectBoxLeave : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				that.find('a').removeClass('active');
				that.find('ul').removeClass('active');
			},
			// acListActive : function(e){
			// 	var that = this.getThat(e);
			// 	that.siblings().removeClass('active');
			// 	that.addClass('active');
			// 	var acDesc = new AcDesc();
			// 	this.$courseAcContent.find('.ac-right').remove();
			// 	this.$courseAcContent.append(acDesc.render().el);

			// 	window.CAICUI.courseAcScroll = new IScroll('body #wrapper-ac', { 
			// 		probeType: 3,
			// 		mouseWheel: true,
			// 		scrollbars: 'custom',
			// 	});
			// 	function updatePosition () {
			// 		console.log(this.y)
			// 	}
			// 	window.CAICUI.courseAcScroll.on('scroll', updatePosition);
			// 	// courseAcScroll.on('scrollEnd', updatePosition);

			// 	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			// },
			courseAcAdClose : function(e){
				var that = this.getThat(e);
				var parentsLi = that.parents('li');
				parentsLi.remove();
				window.CAICUI.myScroll.refresh();
			},
			//acOptionChoose : function(e){
				// var that = CAICUI.iGlobal.getThat(e);
				// var thatText = that.find('.option-a').text();
				// CAICUI.render.type = that.attr('data-type') ? that.attr('data-type') : CAICUI.render.type;
				// CAICUI.render.ordertype = that.attr('data-ordertype') ? that.attr('data-ordertype') : CAICUI.render.ordertype;

				// that.siblings().removeClass('active');
				// that.addClass('active');
				// that.parent().removeClass('active');
				// that.parent().prev().removeClass('active');
				// that.parents('.ac-select-box').find('.ac-select-text').text(thatText);
				// CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
				// window.CAICUI.myScroll.refresh();
				// CAICUI.render.pageNo = 1;
				// this.bbslist(function(data){
				// 	var acList = new AcList();
				// 	$('body #scroller').html(acList.render({
				// 		'data' : {
				// 			'type' : 0,
				// 			'bbslist' : data.data,
				// 			'pageNo': data.pageNo,
				// 			'pageSize': data.pageSize,
				// 			'totalCount': data.totalCount
				// 		}
				// 	}).el);
				// 	window.CAICUI.myScroll.refresh();
				// });
			//},
			acOptionChoose : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatText = that.find('.option-a').text();
				
				that.siblings().removeClass('active');
				that.addClass('active');
				that.parent().removeClass('active');
				that.parent().prev().removeClass('active');
				that.parent().prev().find('.ac-select-text').text(thatText);
				if(that.hasClass('option-li-render')){
					CAICUI.render.type = that.attr('data-type') ? that.attr('data-type') : CAICUI.render.type;
					CAICUI.render.ordertype = that.attr('data-ordertype') ? that.attr('data-ordertype') : CAICUI.render.ordertype;
					this.acOptionChooseRender();
				}
			},
			acOptionChooseRender : function(){
				CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
				window.CAICUI.myScroll.refresh();
				CAICUI.render.pageNo = 1;

				switch (CAICUI.render.navType){
					case 0:
						this.myAcList();
						break;
					case 1:
						this.myJoin();
						break;
				}
				// this.bbslist(function(data){
				// 	var acList = new AcList();
				// 	$('body #scroller').html(acList.render({
				// 		'data' : {
				// 			'type' : 0,
				// 			'bbslist' : data.data,
				// 			'pageNo': data.pageNo,
				// 			'pageSize': data.pageSize,
				// 			'totalCount': data.totalCount
				// 		}
				// 	}).el);
				// 	window.CAICUI.myScroll.refresh();
				// });
			},
			paginationChange : function(e){
				CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
				window.CAICUI.myScroll.refresh();
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.pageNo =that.attr('data-pageno');
				switch (CAICUI.render.navType){
					case 0:
						this.myAcList();
						break;
					case 1:
						this.myJoin();
						break;
				}
			},
			paginationPrev : function(e){
				if(CAICUI.render.pageNo>1){
					CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
					window.CAICUI.myScroll.refresh();
					CAICUI.render.pageNo = +CAICUI.render.pageNo-1;
					switch (CAICUI.render.navType){
						case 0:
							this.myAcList();
							break;
						case 1:
							this.myJoin();
							break;
					}
				}
			},
			paginationNext : function(e){
				if(CAICUI.render.pageNo<=CAICUI.render.pageTotal-1){
					CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
					window.CAICUI.myScroll.refresh();
					CAICUI.render.pageNo = +CAICUI.render.pageNo+1;
					switch (CAICUI.render.navType){
						case 0:
							this.myAcList();
							break;
						case 1:
							this.myJoin();
							break;
					}
				}
			},
			searchAc : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatPrev = that.prev();
				var thatPrevText = thatPrev.val();

				CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
				window.CAICUI.myScroll.refresh();
				CAICUI.render.pageNo = 1;
				CAICUI.render.search = thatPrevText;
				switch (CAICUI.render.navType){
					case 0:
						this.myAcList();
						thatPrev.val('');
						CAICUI.render.search = '';
						break;
					case 1:
						this.myJoin();
						thatPrev.val('');
						CAICUI.render.search = '';
						break;
				}
				// this.bbslist(function(data){
				// 	var acList = new AcList();
				// 	$('body #scroller').html(acList.render({
				// 		'data' : {
				// 			'type' : 0,
				// 			'bbslist' : data.data,
				// 			'pageNo': data.pageNo,
				// 			'pageSize': data.pageSize,
				// 			'totalCount': data.totalCount
				// 		}
				// 	}).el);
				// 	thatPrev.val('');
				// 	CAICUI.render.search = '';
				// 	window.CAICUI.myScroll.refresh();
				// });
			},
			// acVideoLink : function(e){
			// 	e.stopPropagation();
			// 	CAICUI.NavVideo = false;
			// 	CAICUI.domRender = false;
			// 	var that = CAICUI.iGlobal.getThat(e);
			// 	window.location.hash = that.attr('link');
			// },
			
			acRemove : function(e){
				e.stopPropagation();
				var that = CAICUI.iGlobal.getThat(e);
				var pid = that.attr('data-pid');
				CAICUI.render.bbsType = that.attr('data-type');
				var parents = that.parents('.ac-list-li');
				CAICUI.render.bbsId  = parents.attr('data-id');
				CAICUI.render.parentsAcListActive = parents;
				if(CAICUI.render.navType){
					CAICUI.render.bbsId  = parents.attr('data-pid');
				}else{
					CAICUI.render.bbsId  = parents.attr('data-id');
				}

				CAICUI.render.acRemoveLoad = layer.load(1, {
					type : 1,
					title : false,
					content: $('#remove-ac-load'),
					closeBtn : 0,
				  shade: [0.5,'#000'] //0.1透明度的白色背景
				});
			},
			acLoadCancel : function(){
				layer.close(CAICUI.render.acRemoveLoad);
			},
			acLoadConfirm : function(){

				this.bbs_del(function(){
					CAICUI.render.parentsAcListActive.remove();
					$('body .ac-right').empty();
					if($('#replys-'+CAICUI.render.bbsId)){
						$('#replys-'+CAICUI.render.bbsId).parents('.ac-answer-li').remove();
						window.CAICUI.acScroll.refresh();
					}
					window.CAICUI.myScroll.refresh();
					layer.close(CAICUI.render.acRemoveLoad);
				});
			},
			acAnswerReplys : function(e){
				e.stopPropagation();
				var that = CAICUI.iGlobal.getThat(e);
				var parentLi = that.parents('.ac-answer-li');
				CAICUI.render.removeReplayNum = parentLi.index();
				CAICUI.render.bbsId = that.attr('data-pid');
				CAICUI.render.bbsType = that.attr('data-type');
				CAICUI.render.parentLi = parentLi;
				CAICUI.render.acReplayRemoveLoad = layer.load(1, {
					type : 1,
					title : false,
					content: $('#remove-acReply-load'),
					closeBtn : 0,
				  shade: [0.5,'#000'] //0.1透明度的白色背景
				});
			},
			acReplyLoadCancel : function(){
				layer.close(CAICUI.render.acReplayRemoveLoad);
			},
			acReplyLoadConfirm : function(){
				this.bbs_del(function(){
					if(CAICUI.render.parentLi.siblings().length){
						CAICUI.render.parentLi.remove();
						var acReplay = $('.ac-answer-li');
						acReplay.each(function(index){
							var that = $(this);
							that.find('.ac-answer-floor').text(index+1);
						})
					}else{
						CAICUI.render.parentLi.parent().remove();
						CAICUI.render.parentLi.remove();
					}
					if(CAICUI.render.navType){
						$('#pid-'+CAICUI.render.bbsId).parents('.ac-list-li').remove();
					}else{
						var discussNum = CAICUI.render.$this.$('.ac-list-ul .ac-list-li.active').find('.ac-list-info-discuss-num');
						var discussNumText = discussNum.text();
						discussNum.text(+discussNumText-1);
					}
					window.CAICUI.myScroll.refresh();
					window.CAICUI.acScroll.refresh();
					layer.close(CAICUI.render.acReplayRemoveLoad);
				});
			},
		});
		return Studycenter;
	});