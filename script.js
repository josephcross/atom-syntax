jQuery(document).ready(function($) {

	var isMobile = (navigator.userAgent.match(/Android/i)
					|| navigator.userAgent.match(/webOS/i)
					|| navigator.userAgent.match(/iPhone/i)
					|| navigator.userAgent.match(/iPad/i)
					|| navigator.userAgent.match(/iPod/i)
					|| navigator.userAgent.match(/BlackBerry/i)
 					) ? true : false;


// -----------------------------------------------------------------------------
//  FIXED HEADER
// -----------------------------------------------------------------------------

	// if(!isMobile)
	// {
	// 	var $header = $("#header");
	//
	// 	$header.css({ width: $header.width(), position: "fixed", top: 0, left: $header.offset().left });
	// 	$("#content").css({ position: "relative", paddingTop: $header.outerHeight() + parseFloat($("#content").css('padding-top')) });
	//
	// 	$(window).resize(function() {
	//
	// 		$header.css({ left: (($(window).width() - $header.outerWidth()) / 2) });
	//
	// 	}).trigger('resize');
	// }


// -----------------------------------------------------------------------------
//  NAV HOVER
// -----------------------------------------------------------------------------

	$("#nav > li:last-child").addClass("last");

	$("#nav").on('mouseenter', 'li:not(li li)', function() {

		$(this).find(".sub-menu").hide().stop(true, true).animate({ opacity: "show" }, 150);

	}).on('mouseleave', 'li:not(li li)', function() {

		$(this).find(".sub-menu").show().stop(true, true).animate({ opacity: "hide" }, 150);

	});


// -----------------------------------------------------------------------------
//  INPUT PLACEHOLDER FIX
// -----------------------------------------------------------------------------

	// Extend $.support to include placeholder
	jQuery.support.placeholder = (function(){
		var i = document.createElement('input');
		return 'placeholder' in i;
	})();

	// Add focus, blur handlers for browser that don't support placeholder
	if(!$.support.placeholder)
	{
		$("[placeholder]").each(function() {
			if($(this).val() == "") $(this).val($(this).attr("placeholder"));
		}).focus(function() {
			if($(this).val() == $(this).attr("placeholder")) $(this).val("");
		}).blur(function() {
			if($(this).val() == "") $(this).val($(this).attr("placeholder"));
		});
	}


// -----------------------------------------------------------------------------
//  PARSE URL
// -----------------------------------------------------------------------------

	function parseURL(url) {
		var a =  document.createElement('a');
		a.href = url;
		return {
			source: url,
			protocol: a.protocol.replace(':',''),
			host: a.hostname,
			port: a.port,
			query: a.search,
			params: (function(){
				var ret = {},
				seg = a.search.replace(/^\?/,'').split('&'),
				len = seg.length, i = 0, s;
				for (;i<len;i++) {
					if (!seg[i]) { continue; }
					s = seg[i].split('=');
					ret[s[0]] = s[1];
				}
				return ret;
			})(),
			file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
			hash: a.hash.replace('#',''),
			path: a.pathname.replace(/^([^\/])/,'/$1'),
			relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
			segments: a.pathname.replace(/^\//,'').split('/')
		};
	}



// -----------------------------------------------------------------------------
//  PROMOTIONALS
// -----------------------------------------------------------------------------

	if($("#promotional").length)
	{
		$.getScript(BLOGINFO.template_directory + '/js/slidezilla.js', function() {
			$("#promotional").slidezilla({
				itemSelector: ".promotional",
				transition: "fade",
				showPrevNext: false
			});
		});
	}


// -----------------------------------------------------------------------------
//! DISABLE/ENABLE SUBMIT
// -----------------------------------------------------------------------------

	$.fn.disableSubmit = function() {
		this.data('originalText', $(this).html()).css({ opacity: 0.5 }).html("Submitting...").prop('disabled', true);
	};


	$.fn.enableSubmit = function() {
		this.html(this.data('originalText')).css({ opacity: 1 }).prop('disabled', false);
	};

// -----------------------------------------------------------------------------
//  EMAIL SUBSCRIBE
// -----------------------------------------------------------------------------

	if($("form[name='email-subscribe']").length)
	{
		$.getScript(BLOGINFO.template_directory + '/js/jquery.validate.js', function() {
			var $ = jQuery;

			$("form[name='email-subscribe']").validate({
				rules: {
					subscribe_email: { required: true, email: true }
				},
				errorPlacement: function(error, element) {
					return error.insertBefore(element).hide().fadeIn(200);
				},
				submitHandler: function(form)
				{
					$(form).find("[type='submit']").disableSubmit();
					var $inner = $(form).parents(".inner");

					$.ajax({
						url: BLOGINFO.template_directory + "/form-email-subscribe.php",
						type: "POST",
						data: $(form).serialize(),
						dataType: "json",
						success: function(data) {
							if(data.success)
							{
								$("input[name='subscribe_email']").val("");
								$(form).find("[type='submit']").enableSubmit();

								$inner.append('<div class="overlay"><div class="overlay-message"><h2>Thanks!</h2><p>You\'ll hear from us when we add new content to our site.</p></div></div>');
								$inner.find(".overlay").hide().fadeIn(300, function() {
									$(this).delay(5000).fadeOut(300, function() {
										$(this).detach();
									});
								});
							}
							else
							{
								alert("Something went wrong: " + data.message);
								$(form).find("[type='submit']").enableSubmit();
							}
						}
					});
				}
			});
		});
	}


	if($("form[name='email-subscribe-single']").length)
	{
		$.getScript(BLOGINFO.template_directory + '/js/jquery.validate.js', function() {
			var $ = jQuery;

			$("form[name='email-subscribe-single']").validate({
				rules: {
					subscribe_email: { required: true, email: true }
				},
				errorPlacement: function(error, element) {
					return error.insertBefore(element).hide().fadeIn(200);
				},
				submitHandler: function(form)
				{
					$(form).find("[type='submit']").disableSubmit();
					var $inner = $(form).parents(".inner");

					$.ajax({
						url: BLOGINFO.template_directory + "/form-email-subscribe.php",
						type: "POST",
						data: $(form).serialize(),
						dataType: "json",
						success: function(data) {
							if(data.success)
							{
								$("input[name='subscribe_email']").val("");
								$(form).find("[type='submit']").enableSubmit();
								//$inner.append('<div class="overlay"><div class="overlay-message"><h2>Thanks!</h2><p>You\'ll hear from us when we add new content to our site.</p></div></div>');
								//$inner.find(".overlay").hide().fadeIn(300, function() {
								//	$(this).delay(5000).fadeOut(300, function() {
								//		$(this).detach();
								//	});
								//});
								alert("Thank you for subscribing. You'll hear from us when we add new content to our site.");
							}
							else
							{
								alert("Something went wrong: " + data.message);
								$(form).find("[type='submit']").enableSubmit();
							}
						}
					});
				}
			});
		});
	}


// -----------------------------------------------------------------------------
//  REQUEST FORMS
// -----------------------------------------------------------------------------

	if($("#custom-requests, #request-info").length)
	{
		if($("#date").length)
		{
			$("#date").datepicker({
				nextText: "&raquo;",
				prevText: "&laquo;",
				minDate: "0"
			});
		}
		$.getScript(BLOGINFO.template_directory + '/js/jquery.validate.js', function() {
			var $ = jQuery;

			// Set Default Messages
			$.extend($.validator.messages, {
				required: "Required field",
				email: "Invalid email"
			});

			if($("#custom-requests").length)
			{
				$("#custom-requests").validate({
					rules: {
						requester_name: "required",
						requester_email: { required: true, email: true },
						requester_phone: "required",
						market: "required",
						company: "required",
						needed_date: "required",
						needed_time: "required",
						stations: "required",
						geography: "required",
						target_demographic: "required"
					},
					errorElement: "ins",
					submitHandler: function(form) {
						$(form).find("[type='submit']").disableSubmit();

						form.submit();
					}
				});
			}

			if($("#request-info").length)
			{

			}

		});
	}


// -----------------------------------------------------------------------------
//  FILTERS
// -----------------------------------------------------------------------------

	if($(":input[name='filter_by_year']").length)
	{
		$(":input[name='filter_by_year']").change(function() {

			var URL = parseURL(window.location.href);

			URL.base = URL.source.replace(URL.query, '');
			if($(this).val())
			{
				URL.params.by_year = $(this).val();
			}
			else
			{
				delete URL.params.by_year;
			}

			var REDIRECT = URL.base + ($.param(URL.params) ? '?' + $.param(URL.params) : '');

			window.location = REDIRECT;
		});
	}


// -----------------------------------------------------------------------------
//  PRESENTATIONS
// -----------------------------------------------------------------------------

	if($(".file-list").length)
	{
		$.getScript(BLOGINFO.template_directory + '/js/jquery.validate.js', function() {
			var $ = jQuery;

			$(".file-list .file").on('click', 'a[rel]', function(e) {
				e.preventDefault();

				var file = $(this).attr("rel"),
					title = $(this).attr("data-presentation-id");

				$.fancybox({
					href: "#verify-email",
					onComplete: function(array, index, opts) {

						// Set Hidden Variables
						$("#verify-email").find("input[name='presentation']").val(title);
						$("#verify-email").find("input[name='file']").val(file);


						$("#verify-email").find(":input:first").focus();
						$("form[name='verify-email']").validate({
							errorElement: "ins",
							submitHandler: function(form) {

								$(form).find("[type='submit']").disableSubmit();

								setTimeout(function() {
									var PRESENTATION_URL = false;

									$.ajax({
										url: BLOGINFO.url + '/download/verify.php',
										type: "POST",
										dataType: "json",
										async: false,
										data: $("form[name='verify-email']").serialize(),
										success: function(data)
										{
											if(data.success)
											{
												// Hide the form and show the confirmation with presentation URL
												$(form).hide();
												$( ".fancybox-form" ).children( "h1, p" ).hide();
												$( ".fancybox-form-confirmation" ).fadeIn( 200 );
												PRESENTATION_URL = data.url;

												$( ".js-continue-to-presentation" ).on( "click", function( e ) {
													window.open( PRESENTATION_URL, "_blank" );
													window.location = "";
												});

												// Reload Page Once Fancybox closes
												var existingOnClosed = opts.onClosed;
												opts.onClosed = function() {
													existingOnClosed();
													window.location = "";
												}
											}
											else
											{
												$('<div class="message">' + data.message + '</div>').prependTo("#verify-email").fadeIn(300);

												$(form).find("[type='submit']").enableSubmit();
											}
										},
										error: function(xhr, error, text)
										{
											console.log(xhr, error, text);

											$(form).find("[type='submit']").enableSubmit();
										}
									});
								}, 50);

								return false;
							}
						});
					},
					onClosed: function() {
						$("#verify-email input[name='verify_email']").val("");
						$("#verify-email .message").detach();
					}
				});
			});
		});
	}



// -----------------------------------------------------------------------------
//  SUBMIT ASK THE EXPERTS QUESTION
// -----------------------------------------------------------------------------

	if($("#submit-question").length)
	{
		$.getScript(BLOGINFO.template_directory + '/js/jquery.validate.js', function() {
			var $ = jQuery;

			$("#submit-question").click(function(e) {
				e.preventDefault();

				$.fancybox({
					href: "#submit-a-question",
					onComplete: function(array, index, opts) {

						$("#submit-a-question").find(":input:first").focus();
						$("form[name='submit-a-question']").validate({
							errorElement: "ins",
							submitHandler: function(form) {
								$(form).find("[type='submit']").disableSubmit();

								$.ajax({
									url: BLOGINFO.template_directory + '/form-ask-the-experts-question.php',
									type: "POST",
									dataType: "json",
									data: $("form[name='submit-a-question']").serialize(),
									success: function(data)
									{
										if(data.success)
										{
											$("#submit-a-question form").fadeOut(400, function() {
												$('<div class="message">' + data.message + '</div>').appendTo("#submit-a-question").fadeIn(300);
											});
										}
										else
										{
											$('<div class="message">' + data.message + '</div>').prependTo("#submit-a-question").fadeIn(300);

											$(form).find("[type='submit']").enableSubmit();
										}
									},
									error: function(xhr, error, text)
									{
										console.log(xhr, error, text);
									}
								});

								return false;
							}
						});
					},
					onClosed: function() {
						$("#verify-email input[name='verify_email']").val("");
						$("#verify-email .message").detach();
					}
				});
			});
		});
	}



// -----------------------------------------------------------------------------
//  BUYERS GUIDE MARKETS
// -----------------------------------------------------------------------------

	if($("#buyers-guide-markets").length)
	{
		var $buyersGuide = $("#buyers-guide-markets"),
			$steps = $buyersGuide.find(".step"),
			transitionDuration = 400;

		$(".step").css({ left: $buyersGuide.outerWidth() }).filter(":first").addClass("active").css({ left: 0 }).show();
		$("#buyers-guide-markets").height($(".step:first").outerHeight());


		$("input[name='markets[]']").change(function() {
			if($("input[name='markets[]']:checked").length)
			{
				$(".step:first .next").removeAttr("disabled");
			}
			else
			{
				$(".step:first .next").attr("disabled", "disabled");
			}
		}).trigger('change');

		$buyersGuide.on('click', '.next:not(:disabled)', function() {
			var $step = $(this).parents(".step");
			var $nextStep = $step.next(".step");

			if(!$step.is(":last"))
			{
				$step.removeClass("active").animate({ opacity: "hide", left: -$step.outerWidth() }, transitionDuration);
				$nextStep.addClass("active").animate({ opacity: "show", left: 0 }, transitionDuration);

				$("#buyers-guide-markets .grid-form").find(":input:first").focus();
				$("#markets-list ul").empty();
				$("input[name='markets[]']:checked").each(function() {
					$("#markets-list ul").append('<li>' + $(this).next("label").text() + '</li>');
				});

				$buyersGuide.animate({ height: $nextStep.outerHeight() }, transitionDuration);
			}
		}).on('click', '.prev', function() {
			var $step = $(this).parents(".step");
			var $nextStep = $step.prev(".step");

			if(!$step.is(":first"))
			{
				$step.removeClass("active").animate({ opacity: "hide", left: $step.outerWidth() }, transitionDuration);
				$nextStep.addClass("active").animate({ opacity: "show", left: 0 }, transitionDuration);

				$buyersGuide.animate({ height: $nextStep.outerHeight() }, transitionDuration);
			}
		});


		$.getScript(BLOGINFO.template_directory + '/js/jquery.validate.js', function() {
			var $ = jQuery;
			$("form[name='buyers-guide-markets']").validate({
				errorElement: "ins",
				submitHandler: function(form) {
					$(form).find("[type='submit']").disableSubmit();

					$.ajax({
						url: BLOGINFO.template_directory + '/form-buyers-guide-markets.php',
						type: "POST",
						dataType: "json",
						data: $("form[name='buyers-guide-markets']").serialize(),
						success: function(data)
						{
							if(data.success)
							{
								$("#buyers-guide-markets .step").fadeOut(400);
								$('<div class="message"><h3>Request Submitted</h3><p>You will be contacted shortly!</p></div>').appendTo("#buyers-guide-markets").delay(400).fadeIn(300);
							}
							else
							{
								alert("Something went wrong: " + data.message);

								$(form).find("[type='submit']").enableSubmit();
							}
						},
						error: function(xhr, error, text)
						{
							console.log(xhr.responseText);

							$(form).find("[type='submit']").enableSubmit();
						}
					});

					return false;
				}
			});
		});

		$("#filter-by-state").val("").change(function() {
			var selectedState = $(this).val(),
				$checkboxes = $(".checkbox-group li");

			if(!selectedState)
			{
				$checkboxes.animate({ opacity: 1 }, 200);
			}
			else
			{
				$checkboxes.filter(":not(.state-" + selectedState + ")").animate({ opacity: 0.3 }, 200);
				$checkboxes.filter(".state-" + selectedState).animate({ opacity: 1 }, 200);
			}
		}).trigger("change");
	}


// -----------------------------------------------------------------------------
//! GRAVITY FORMS
// -----------------------------------------------------------------------------

	// Disable submit button after submit
	$('.gform_wrapper form').on('submit', function() {
		$(this).find('[type="submit"]').attr('disabled', 'disabled').addClass('disabled').css({ opacity: 0.5 });
		$(this).find("input[type='submit']").val("Submitting...");
		$(this).find("button[type='submit']").html("Submitting...");
	});


// -----------------------------------------------------------------------------
//! HOMEPAGE FLOW ANIMATION
// -----------------------------------------------------------------------------

	var changeState = function() {
		var $flow = $( ".how-it-works" );

		if( $flow.hasClass( "s1") ) {
			$flow.removeClass( "s1" ).addClass( "s2" );
			timer();
			return;
		}

		if( $flow.hasClass( "s2" ) ) {
			$flow.removeClass( "s2" ).addClass( "s3" );
			timer();
			return;
		}

		if( $( ".flow" ).hasClass( "s3" ) ) {
			$flow.removeClass( "s3" ).addClass( "s1" );
			timer();
			return;
		}
	}


	$( ".card-box" ).on( "click", function() {
		alert('hi');
	});

	var timer = function() {
		var time = setTimeout( changeState, 5000 );
	}


	var flow = function() {

		$( ".left .path-fill").animate({
			width: "+=160"
		}, 5000);


		setTimeout( function() {
			$( ".right .path-fill" ).animate({
				width: "+=160"
			}, 5000);
		}, 5000);


		// Reset
		setTimeout( function() {
			$( ".path-fill" ).css( "width", "0" );
			flow();
		}, 15000);
	}

	timer();
	flow();

});
