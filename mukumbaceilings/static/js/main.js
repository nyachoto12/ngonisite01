"use strict";
//Wrapping all JavaScript code into a IIFE function for prevent global variables creation
(function(){

var $body = jQuery('body');
var $window = jQuery(window);

//hidding menu elements that do not fit in menu width
//processing center logo






//helper functions to init elements only when they appears in viewport (jQUery.appear plugin)
function initAnimateElement(self, index) {
	var animationClass = !self.data('animation') ? 'fadeInUp' : self.data('animation');
	var animationDelay = !self.data('delay') ? 150 : self.data('delay');
	setTimeout(function(){
		self.addClass("animated " + animationClass);
	}, index * animationDelay);
}
function initCounter(self) {
	if (self.hasClass('counted')) {
		return;
	} else {
		self.countTo().addClass('counted');
	}
}

//equalize header side columns width
function headerColumnsEqualize() {
	var $header = jQuery('.page_header').first();
	var $leftLogo = $header.find('.header_left_logo');
	var $rightButtons = $header.find('.header_right_buttons');
	if ( parseInt( $leftLogo.css( 'width' ) ) > parseInt( $rightButtons.css( 'width' ) ) ) {
		$rightButtons.css( 'min-width', $leftLogo.css( 'width' ) );
	} else {
		$leftLogo.css( 'min-width', $rightButtons.css( 'width' ) );
	}
}

//function that initiating template plugins on window.load event
function windowLoadInit() {

	////////////
	//mainmenu//
	////////////
	if (jQuery().scrollbar) {
		jQuery('[class*="scrollbar-"]').scrollbar();
	}
	if (jQuery().superfish) {
		jQuery('ul.sf-menu').superfish({
			popUpSelector: 'ul:not(.mega-menu ul), .mega-menu ',
			delay:       700,
			animation:   {opacity:'show', marginTop: 0},
			animationOut: {opacity: 'hide',  marginTop: 5},
			speed:       200,
			speedOut:    200,
			disableHI:   false,
			cssArrows:   true,
			autoArrows:  true

		});
		jQuery('ul.sf-menu-side').superfish({
			popUpSelector: 'ul:not(.mega-menu ul), .mega-menu ',
			delay:       500,
			animation:   {opacity:'show', height: 100 +'%'},
			animationOut: {opacity: 'hide',  height: 0},
			speed:       400,
			speedOut:    300,
			disableHI:   false,
			cssArrows:   true,
			autoArrows:  true
		});
	}

	
	//toggle mobile menu
	jQuery('.toggle_menu').on('click', function(){
		jQuery(this)
			.toggleClass('mobile-active')
				.closest('.page_header')
				.toggleClass('mobile-active')
				.end()
				.closest('.page_toplogo')
				.next()
				.find('.page_header')
				.toggleClass('mobile-active');
	});

	jQuery('.mainmenu a').on('click', function(){
		var $this = jQuery(this);
		//If this is a local link or item with sumbenu - not toggling menu
		if (($this.hasClass('sf-with-ul')) || !($this.attr('href').charAt(0) === '#')) {
			return;
		}
		$this
		.closest('.page_header')
		.toggleClass('mobile-active')
		.find('.toggle_menu')
		.toggleClass('mobile-active');
	});

	//side header processing
	var $sideHeader = jQuery('.page_header_side');
	// toggle sub-menus visibility on menu-click
	jQuery('ul.menu-side-click').find('li').each(function(){
		var $thisLi = jQuery(this);
		//toggle submenu only for menu items with submenu
		if ($thisLi.find('ul').length)  {
			$thisLi
				.append('<span class="activate_submenu"></span>')
				//adding anchor
				.find('.activate_submenu, > a')
				.on('click', function(e) {
					var $thisSpanOrA = jQuery(this);
					//if this is a link and it is already opened - going to link
					if (($thisSpanOrA.attr('href') === '#') || !($thisSpanOrA.parent().hasClass('active-submenu'))) {
						e.preventDefault();
					}
					if ($thisSpanOrA.parent().hasClass('active-submenu')) {
						$thisSpanOrA.parent().removeClass('active-submenu');
						return;
					}
					$thisLi.addClass('active-submenu').siblings().removeClass('active-submenu');
				});
		} //eof sumbenu check
	});
	if ($sideHeader.length) {
		jQuery('.toggle_menu_side').on('click', function(){
			var $thisToggler = jQuery(this);
			if ($thisToggler.hasClass('header-slide')) {
				$sideHeader.toggleClass('active-slide-side-header');
			} else {
				if($thisToggler.parent().hasClass('header_side_right')) {
					$body.toggleClass('active-side-header slide-right');
				} else {
					$body.toggleClass('active-side-header');
				}
			}
		});
		//hidding side header on click outside header
		$body.on('click', function( e ) {
			if ( !(jQuery(e.target).closest('.page_header_side').length) && !($sideHeader.hasClass('page_header_side_sticked')) ) {
				$sideHeader.removeClass('active-slide-side-header');
				$body.removeClass('active-side-header slide-right');
			}
		});
	} //sideHeader check
	
	//1 and 2/3/4th level mainmenu offscreen fix
	var MainWindowWidth = jQuery(window).width();
	var boxWrapperWidth = jQuery('#box_wrapper').width();
	jQuery(window).on('resize', function(){
		MainWindowWidth = jQuery(window).width();
		boxWrapperWidth = jQuery('#box_wrapper').width();
	});
	//2/3/4 levels
	
	//background image teaser and secitons with half image bg
	//put this before prettyPhoto init because image may be wrapped in prettyPhoto link
	jQuery(".bg_teaser, .image_cover").each(function(){
		var $teaser = jQuery(this);
		var $image = $teaser.find("img").first();
		if (!$image.length) {
			$image = $teaser.parent().find("img").first();
		}
		if (!$image.length) {
			return;
		}
		var imagePath = $image.attr("src");
		$teaser.css("background-image", "url(" + imagePath + ")");
		var $imageParent = $image.parent();
		//if image inside link - adding this link, removing gallery to preserve duplicating gallery items
		if ($imageParent.is('a')) {
			$teaser.prepend($image.parent().clone().html(''));
			$imageParent.attr('data-gal', '');
		}
	});

	//toTop
	if (jQuery().UItoTop) {
		jQuery().UItoTop({ easingType: 'easeInOutQuart' });
	}

	//parallax
	if (jQuery().parallax) {
		jQuery('.parallax').parallax("50%", 0.01);
	}
	
	
	//bootstrap carousel
	if (jQuery().carousel) {
		jQuery('.carousel').carousel();
	}
	//bootstrap tab - show first tab 
	jQuery('.nav-tabs').each(function() {
		jQuery(this).find('a').first().tab('show');
	});
	jQuery('.tab-content').each(function() {
		jQuery(this).find('.tab-pane').first().addClass('fade in');
	});
	//bootstrap collapse - show first tab 
	jQuery('.panel-group').each(function() {
		jQuery(this).find('a').first().filter('.collapsed').trigger('click');
	});
	//tooltip
	if (jQuery().tooltip) {
		jQuery('[data-toggle="tooltip"]').tooltip();
	}

	

	//contact form processing
	jQuery('form.contact-form').on('submit', function( e ){
		e.preventDefault();
		var $form = jQuery(this);
		jQuery($form).find('span.contact-form-respond').remove();

		//checking on empty values
		jQuery($form).find('[aria-required="true"], [required]').each(function(index) {
			var $thisRequired = jQuery(this);
			if (!$thisRequired.val().length) {
				$thisRequired
					.addClass('invalid')
					.on('focus', function(){
						$thisRequired
							.removeClass('invalid');
					});
			}
		});
		//if one of form fields is empty - exit
		if ($form.find('[aria-required="true"], [required]').hasClass('invalid')) {
			return;
		}

		//sending form data to PHP server if fields are not empty
		var request = $form.serialize();
		var ajax = jQuery.post( "contact-form.php", request )
		.done(function( data ) {
			jQuery($form).find('[type="submit"]').attr('disabled', false).parent().append('<span class="contact-form-respond highlight">'+data+'</span>');
			//cleaning form
			var $formErrors = $form.find('.form-errors');
			if ( !$formErrors.length ) {
				$form[0].reset();
			}
		})
		.fail(function( data ) {
			jQuery($form).find('[type="submit"]').attr('disabled', false).parent().append('<span class="contact-form-respond highlight">Mail cannot be sent. You need PHP server to send mail.</span>');
		})
	});


	
	//MailChimp subscribe form processing
	jQuery('.signup').on('submit', function( e ) {
		e.preventDefault();
		var $form = jQuery(this);
		// update user interface
		$form.find('.response').html('Adding email address...');
		// Prepare query string and send AJAX request
		jQuery.ajax({
			url: 'mailchimp/store-address.php',
			data: 'ajax=true&email=' + escape($form.find('.mailchimp_email').val()) + '&fullname=' + escape($form.find('.mailchimp_fullname').val()),
			success: function(msg) {
				$form.find('.response').html(msg);
			}
		});
	});

	//////////////
	//flexslider//
	//////////////
	if (jQuery().flexslider) {
		var $introSlider = jQuery(".intro_section .flexslider");
		$introSlider.each(function(index){
			var $currentSlider = jQuery(this);
			var data = $currentSlider.data();
			var nav = (data.nav !== 'undefined') ? data.nav : true;
			var dots = (data.dots !== 'undefined') ? data.dots : true;

			$currentSlider.flexslider({
				animation: "fade",
				pauseOnHover: true, 
				useCSS: true,
				controlNav: dots,   
				directionNav: nav,
				prevText: "",
				nextText: "",
				smoothHeight: false,
				slideshowSpeed:10000,
				animationSpeed:600,
				start: function( slider ) {
					slider.find('.slide_description').children().css({'visibility': 'hidden'});
					slider.find('.flex-active-slide .slide_description').children().each(function(index){
						var self = jQuery(this);
						var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
						setTimeout(function(){
							self.addClass("animated "+animationClass);
						}, index*200);
					});
					slider.find('.flex-control-nav').find('a').each(function() {
						jQuery( this ).html('0' + jQuery( this ).html());
					})
				},
				after: function( slider ){
					slider.find('.flex-active-slide .slide_description').children().each(function(index){
						var self = jQuery(this);
						var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
						setTimeout(function(){
							self.addClass("animated "+animationClass);
						}, index*200);
					});
				},
				end :function( slider ){
					slider.find('.slide_description').children().each(function() {
						var self = jQuery(this);
						var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
						self.removeClass('animated ' + animationClass).css({'visibility': 'hidden'});
							// jQuery(this).attr('class', '');
					});
				},

			})
			//wrapping nav with container - uncomment if need
			.find('.flex-control-nav')
			.wrap('<div class="container-fluid nav-container"/>')
		}); //intro_section flex slider

		jQuery(".flexslider").each(function(index){
			var $currentSlider = jQuery(this);
			//exit if intro slider already activated 
			if ($currentSlider.find('.flex-active-slide').length) {
				return;
			}

			var data = $currentSlider.data();
			var nav = (data.nav !== 'undefined') ? data.nav : true;
			var dots = (data.dots !== 'undefined') ? data.dots : true;
			var autoplay = (data.autoplay !== 'undefined') ? data.autoplay : true;
			$currentSlider.flexslider({
				animation: "slide",
				useCSS: true,
				controlNav: dots,   
				directionNav: nav,
				prevText: "",
				nextText: "",
				smoothHeight: false,
				slideshow: autoplay,
				slideshowSpeed:5000,
				animationSpeed:400,
				start: function( slider ) {
					slider.find('.flex-control-nav').find('a').each(function() {
						jQuery( this ).html('0' + jQuery( this ).html());
					})
				},
			})
			.find('.flex-control-nav')
			.wrap('<div class="container-fluid nav-container"/>')
		});
	}

	
	////////////////////
	//triggered search//
	////////////////////
	jQuery('.search_form_trigger').on('click', function($e) {
		$e.preventDefault();
		jQuery( '.search_form_trigger, .search_form_wrapper' ).toggleClass('active');
	});

	////////////////
	//owl carousel//
	////////////////
	if (jQuery().owlCarousel) {
		jQuery('.owl-carousel').each(function() {
			var $carousel = jQuery(this);
			var data = $carousel.data();

			var loop = data.loop ? data.loop : false;
			var margin = (data.margin || data.margin === 0) ? data.margin : 30;
			var nav = data.nav ? data.nav : false;
			var dots = data.dots ? data.dots : false;
			var themeClass = data.themeclass ? data.themeclass : 'owl-theme';
			var center = data.center ? data.center : false;
			var items = data.items ? data.items : 4;
			var autoplay = data.autoplay ? data.autoplay : false;
			var responsiveXs = data.responsiveXs ? data.responsiveXs : 1;
			var responsiveXxs = data.responsiveXxs ? data.responsiveXxs : 1;
			var responsiveSm = data.responsiveSm ? data.responsiveSm : 2;
			var responsiveMd = data.responsiveMd ? data.responsiveMd : 3;
			var responsiveLg = data.responsiveLg ? data.responsiveLg : 4;
			var responsiveXlg = data.responsiveXlg ? data.responsiveXlg : responsiveLg;
			var filters = data.filters ? data.filters : false;
			var mouseDrag = $carousel.data('mouse-drag') === false ? false : true;
			var touchDrag = $carousel.data('touch-drag') === false ? false : true;

			if (filters) {
				// $carousel.clone().appendTo($carousel.parent()).addClass( filters.substring(1) + '-carousel-original' );
				$carousel.after($carousel.clone().addClass('owl-carousel-filter-cloned'));
				jQuery(filters).on('click', 'a', function( e ) {
					//processing filter link
					e.preventDefault();
					var $thisA = jQuery(this);
					if ($thisA.hasClass('selected')) {
						return;
					}
					var filterValue = $thisA.attr('data-filter');
					$thisA.siblings().removeClass('selected active');
					$thisA.addClass('selected active');
					
					//removing old items
					$carousel.find('.owl-item').length;
					for (var i = $carousel.find('.owl-item').length - 1; i >= 0; i--) {
						$carousel.trigger('remove.owl.carousel', [1]);
					};

					//adding new items
					var $filteredItems = jQuery($carousel.next().find(' > ' +filterValue).clone());
					$filteredItems.each(function() {
						$carousel.trigger('add.owl.carousel', jQuery(this));
						jQuery(this).addClass('scaleAppear');						
					});
					
					$carousel.trigger('refresh.owl.carousel');

					//reinit prettyPhoto in filtered OWL carousel
					if (jQuery().prettyPhoto) {
						$carousel.find("a[data-gal^='prettyPhoto']").prettyPhoto({
							hook: 'data-gal',
							theme: 'facebook' /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
						});
					}
				});
				
			} //filters

			$carousel.owlCarousel({
				loop: loop,
				margin: margin,
				nav: nav,
				navText: ['<span>prev</span>', '<span>next</span>'],
				autoplay: autoplay,
				dots: dots,
				themeClass: themeClass,
				center: center,
				items: items,
				smartSpeed: 400,
				mouseDrag: mouseDrag,
				touchDrag: touchDrag,
				responsive: {
					0:{
						items: responsiveXxs
					},
					500:{
						items: responsiveXs
					},
					768:{
						items: responsiveSm
					},
					992:{
						items: responsiveMd
					},
					1200:{
						items: responsiveLg
					},
					1600:{
						items: responsiveXlg
					}
				},
			})
			.addClass(themeClass);
			if(center) {
				$carousel.addClass('owl-center');
			}

			$window.on('resize', function() {
				$carousel.trigger('refresh.owl.carousel');
			});

			$carousel.on('changed.owl.carousel', function() {
				if (jQuery().prettyPhoto) {
					jQuery("a[data-gal^='prettyPhoto']").prettyPhoto({
						hook: 'data-gal',
						theme: 'facebook', /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
						social_tools: false
					});
				}
			})
		});

	} //eof owl-carousel

	//aside affix
	affixSidebarInit();

	$body.scrollspy('refresh');

	//appear plugin is used to elements animation, counter, pieChart, bootstrap progressbar
	if (jQuery().appear) {
		//animation to elements on scroll
		jQuery('.to_animate').appear();

		jQuery('.to_animate').filter(':appeared').each(function(index){
			initAnimateElement(jQuery(this), index);
		});

		$body.on('appear', '.to_animate', function(e, $affected ) {
			jQuery($affected).each(function(index){
				initAnimateElement(jQuery(this), index);
			});
		});

		
		///circle progress bar
		if (jQuery().easyPieChart) {

			jQuery('.chart').appear();
			
			jQuery('.chart').filter(':appeared').each(function(){
				initChart(jQuery(this));
			});
			$body.on('appear', '.chart', function(e, $affected ) {
				jQuery($affected).each(function(){
					initChart(jQuery(this));
				});
			});

		}

	} //appear check

	
	//page preloader
	jQuery(".preloaderimg").fadeOut(150);
	jQuery(".preloader").fadeOut(350).delay(200, function(){
		jQuery(this).remove();
	});
	
}//eof windowLoadInit

$window.ready(function() {
	if (window.cue) {
		cue.initialize();
	}
})



$window.on('load', function(){
	windowLoadInit();


	// color for placeholder of select elements
	jQuery(".choice").on('change', function () {
		if(jQuery(this).val() === "") jQuery(this).addClass("empty");
		else jQuery(this).removeClass("empty")
	});

}); //end of "window load" event

$window.on('resize', function(){

	$body.scrollspy('refresh');

	//header processing
	
});
//end of IIFE function

})();

