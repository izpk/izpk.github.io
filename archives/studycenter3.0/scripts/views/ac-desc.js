;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'div',
			className : 'ac-right',
			template : _.template($('#template-ac-desc').html()),
			events : {
				'click .ac-desc-remove' : 'acRemove'
			},
			type : '',
			render : function(data){
				this.$el.html(this.template({
					'data' : {
						'bbsdetail' : data.data,
						'isme' : data.isme
					}
				}));
				return this;
			},
			acRemove : function(){
				$('body .ac-list-li.active .ac-list-remove').trigger('click');
			}
		});
		return Studycenter;
	});