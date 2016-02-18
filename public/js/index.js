$(document).ready(

		function() {
			
			var test = $('.new-todo');
			var count = 0;
			var listID = [];
			$('.todo-count strong').text(count);
			$.ajax({
				url : 'Wellcome',
				type : "GET",
				dataType : "json",
				success : function(data) {
					count = data.length;
					$.each(data, function(key, value) {
						if (value.key != null) {
							var element = "<li>" + "<div class='view'>"
							+ "<input id ='" + value.key+"'class='toggle' type='checkbox'/>"
							+ "<label>" + value.value + "</label>"
							+ "<button id ='" + value.key+"' class='destroy'></button></div>"
							+ "<input class='edit' value='"+value.value+"'/></li>";

					      $('.todo-list').append(element);
					      $('.todo-count strong').text(count);
						}
					});
					if (count == 0) {
						$('.toggle-all').attr('disabled', "");
					}

				},
				error : function(e) {
					console.log('ERROR');
				}
			});
			
			$('.new-todo').keypress(
					function enter(e) {
						var element = "<li>" + "<div class='view'>"
						+ "<input class='toggle' type='checkbox'/>"
						+ "<label>" + test.val() + "</label>"
						+ "<button class='destroy'/></div>"
						+ "<input class='edit' value='hfdh'/></li>";
						
						if (e.which == 13) {
							$.ajax({
								url : 'Wellcome',
								type : "POST",
								data : {
									'todo' : test.val()
								},
								success : function(result) {
									console.log(result);
								},
								error : function() {
									console.log('ERROR');
								}
							});
							$('.todo-list').append(element);
							
							test.val("");
							count = $(".todo-list li").length;
							$('.toggle-all').removeAttr('disabled', "");
							$('.todo-count strong').text(count);
							location.reload();

						}
					});

			$('body').on('click', '.destroy', function() {
				console.log($(this));
				var id = $(this).attr("id");
				console.log(id);
				$.ajax({
					url : 'Wellcome',
					type : "POST",
					data : {
						'id' : id
					},
					success : function(result) {
						console.log("TRA VE ROI");
					},
					error : function() {
						console.log('ERROR');
					}
				});
				$(this).parent().parent().remove();
			});
			$('body').on('click', '.toggle', function() {
				console.log($( this ).attr("id"));
				listID.push($( this ).attr("id"));
				if ($(this).attr('checked')) {
					$(this).removeAttr('checked');
				} else {
					$(this).attr('checked', 'checked');
				}
				var checked = $("input[checked='checked']").length;
				if (checked == 0) {
					$('.clear-completed').attr("hidden", "");
				} else {
					$('.clear-completed').removeAttr("hidden");
				}
				
			});
			
			$('body').on('click', '.clear-completed', function() {
				console.log(listID);
				$.ajax({
					url : 'Wellcome',
					type : "POST",
					data : {
						'listID' : listID
					},
					success : function(result) {
						$(".toggle[checked='checked']").parent().parent().remove();
						$(".toggle-all").removeAttr("checked");
						$('.todo-count strong').text("");
						$('.todo-count strong').text(result);
					},
					error : function() {
						console.log('ERROR');
					}
				});
				
			});

			$('body').on('click', '.toggle-all', function() {
				if ($(this).attr('checked')) {
					$(this).removeAttr('checked');
					$("input[checked='checked']").click();
				} else {
					$(this).attr('checked', 'checked');
					$(".toggle:not([checked]").click();
				}

			});
			
			$(document).on('dblclick', '.view', function () {
				var editValue = [];
			     $(this).find("label").hide();
			     $(this).next().show();
			     
			     $("input").change(function(){
			    	 $(this).hide();
			    	 var textEdit = $(this).val();
			    	 var idEdit = $(this).parent().find("button").attr("id");
			    	 editValue.push(idEdit);
			    	 editValue.push(textEdit);
			    	 $(this).parent().find("label").text(textEdit).show();
			    	 $.ajax({
							url : 'Wellcome',
							type : "POST",
							data : {
								'EDIT[]' : editValue
							},
							success : function(result) {
								console.log("EDIT SUCCESS");
							},
							error : function() {
								console.log('ERROR');
							}
						});
			    	});
			});
		});