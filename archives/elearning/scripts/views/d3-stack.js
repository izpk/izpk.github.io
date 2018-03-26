;define([
	'jquery',
	'underscore',
	'backbone',
	'd3'
	],function($, _, Backbone, d3){
		'use strict';
		var Studycenter = Backbone.View.extend({
			// el : 'body #right',
			tag : 'div',
			template : _.template($('#template-course-study-d3-stack').html()),
			events : {
				
			},
			type : '',
			render : function(data){
				this.$el.html(this.template({
					"data" : data
				}));
				return this;

			},
			setStackData : function(that,courseDetailData){
				var stackData = [{
					status : "completed",
					title : "已完成",
					total : courseDetailData.courseTaskTotalCompleted,
					values : []
				},{
					status : "beoverdue",
					title : "逾期",
					total : courseDetailData.courseTaskTotalBeoverdue,
					values : []
				},{
					status : "ongoing",
					title : "进行中",
					total : courseDetailData.courseTaskTotalOngoing,
					values : []
				},{
					status : "notstarted",
					title : "未完成",
					total : courseDetailData.courseTaskTotalNotstarted,
					values : []
				}];
				var weekList = courseDetailData.courseDetailWeekList;
				
				_.each(weekList,function(weekListElement, weekListIndex){
					var weekStatus = weekListElement.weekStatus;
					_.each(stackData,function(stackElement, stackIndex){
						stackData[stackIndex].values.push({
							"week" : "第-"+(weekListIndex+1)+"-周",
							"value" : 0
						})
					})
					switch(weekStatus){
						case "completed":
							stackData[0].values[weekListIndex].value = weekListElement.tasksNum;
							break;
						case "beoverdue":
							var totalNum = that.setListValue(weekListElement);
							stackData[2].values[weekListIndex].value = totalNum.ongoingTotalNum;

							stackData[0].values[weekListIndex].value = totalNum.completedTotalNum;
							stackData[1].values[weekListIndex].value = totalNum.notstartedTotalNum;
							break;
						case "ongoing":
							var totalNum = that.setListValue(weekListElement);
							stackData[2].values[weekListIndex].value = totalNum.ongoingTotalNum;

							stackData[0].values[weekListIndex].value = totalNum.completedTotalNum;
							stackData[3].values[weekListIndex].value = totalNum.notstartedTotalNum;
							break;
						case "notstarted":
							stackData[3].values[weekListIndex].value = weekListElement.tasksNum;
							break;
					}
				})
				return stackData;
			},
			setListValue : function(data){
				var completedTotalNum = 0;
				var ongoingTotalNum = 0;
				var notstartedTotalNum = 0;
				_.each(data.list,function(element, index){
					if(element.completedNum){
						completedTotalNum += element.completedNum;
					}
					if(element.ongoingNum){
						ongoingTotalNum += element.ongoingNum;
					}
					if(element.notstartedNum){
						notstartedTotalNum += element.notstartedNum;
					}
				})
				return {
					'completedTotalNum' : completedTotalNum,
					'ongoingTotalNum' : ongoingTotalNum,
					'notstartedTotalNum' : notstartedTotalNum
				}
			},
			createD3Stack : function(stackData){
					var width  = 335;
					var height = 207;
					var svg = d3.select("#d3-stack").append("svg").attr("width", width).attr("height", height);
					var stack = d3.layout.stack().values(function(d){ return d.values; }).x(function(d){ return d.week; }).y(function(d){ return d.value; });
				var data = stack(stackData);
				var padding = { left:30, right:0, top:20, bottom:66 };
				var xRangeWidth = width - padding.left - padding.right;
				var xScale = d3.scale.ordinal()
										.domain(data[0].values.map(function(d){ return d.week; }))
										.rangeBands([0, xRangeWidth],0.3);
									
				var maxProfit = d3.max(data[data.length-1].values, function(d){ 
						return d.y0 + d.y; 
				});
				var yRangeWidth = height - padding.top - padding.bottom;
				var yScale = d3.scale.linear().domain([0, maxProfit]).rangeRound([0, yRangeWidth]);
				var color = ['#73c7c3','#f78e49','#566c88','#d0d0d0'];
				var groups = svg.selectAll("g").data(data).enter().append("g").style("fill",function(d,i){ return color[i]; });
				var rects = groups.selectAll("rect")
										.data(function(d){ return d.values; })
										.enter()
										.append("rect")
										.attr("x",function(d){ return (xScale(d.week)+(xScale.rangeBand()-10)/2); })
										.attr("y",function(d){ return yRangeWidth - yScale( d.y0 + d.y ); })
										.attr("width",function(d){ return 10 })
										.attr("height",function(d){ return yScale(d.y); })
										.attr("transform","translate(" + padding.left + "," + padding.top + ")")
				var xAxis = d3.svg.axis()
										.scale(xScale)
										.orient("bottom");
				yScale.range([yRangeWidth, 0]);
				var yAxis = d3.svg.axis()
										.scale(yScale)
										.orient("left");

				var text = svg
					.append("g")
					.attr("class","axis")
					.attr("transform","translate(" + padding.left + "," + (height - padding.bottom) +  ")")
					.call(xAxis)
					.selectAll("text")
					text.text('')	
				var tspan =	text.selectAll("tspan")
					.data(function(d){ return d.split('-'); })
					.enter()
					.append("tspan")  
					.attr("x",text.attr("x"))
					.attr("dy","1em")  
					.text(function(d){return d});

				svg.append("g").attr("class","axis").attr("transform","translate(" + padding.left + "," + (height - padding.bottom - yRangeWidth) +  ")").call(yAxis); 
			}
		});
		return Studycenter;
	});