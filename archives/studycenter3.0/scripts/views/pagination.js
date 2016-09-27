;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			className : 'pagination-box',
			template : _.template($('#template-pagination').html()),
			events : {
				'click .js-pagination-li' : 'paginationChange',
				'click .js-pagination-prev' : 'paginationPrev',
				'click .js-pagination-next' : 'paginationNext',
			},
			type : '',
			initialize : function(){
				this.pageNo = 8;
				this.pageSize = 20;
				this.totalCount = 678;
				this.pageTotal = Math.ceil(this.totalCount/this.pageSize);
			},
			render : function(pageNo){
				
				this.$el.html(this.template({
					'data' : {
						'pageNo': this.pageNo,
						'pageSize': this.pageSize,
						'totalCount': this.totalCount
					}
				}));
				return this;
			},
			paginationChange : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				this.pageNo = +that.attr('data-pageno');
				this.render();
			},
			paginationPrev : function(e){
				if(this.pageNo>1){
					this.pageNo--;
					this.render();
				}
				
			},
			paginationNext : function(e){
				if(this.pageNo <= this.pageTotal-1){
					this.pageNo++;
					this.render();
				}
			}
		});
		return Studycenter;
	});