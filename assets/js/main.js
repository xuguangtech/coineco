/*
    Template Name: FOLIO. - Onepage Responsive Personal Portfolio Template
    Author       : Mo Dauod
    Author URL   : modauod@gmail.com
    Description  : A Onepage Responsive Personal Portfolio Template
    Version      : 1.1
*/


/* Table of Content
----------------------------------------------------------
1.  PRE LOADING
2.  SMOTH SCROLL
3.  FIXED NAVBAR
4.  PORTFOLIO FILTER
5.  MAGNIFIC POPUP
6.  WOW JS
7.  REPEAT SLIDER ANIMATION
----------------------------------------------------------
*/


/*global $, jQuery, alert*/
jQuery(function ($) {
    'use strict';
      
    /*   1.  PRE LOADING
    ---------------------------------------------- */
    $(window).on('load', function () {
        $('.sk-folding-cube').fadeOut();
        $('.loading-overlay').delay(400).fadeOut('slow', function () {
            $('body').css("overflow", "auto");
        });
    });
    
    
    /*   2.  SMOTH SCROLL
    ---------------------------------------------- */
    $('.scroll').on('click', function (e) {
        var anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top - 70
        }, 1000);
        e.preventDefault();
    });
    
    
    /*   3.  FIXED NAVBAR
    ---------------------------------------------- */
    $(window).on('scroll', function () {
        var nav = $('.navbar');
        if ($(window).scrollTop() > 50) {
            nav.addClass('navbar-fixed-top');
        } else {
            nav.removeClass('navbar-fixed-top');
        }
    });
    
    
    /*   4.  PORTFOLIO FILTER
    ---------------------------------------------- */
    $('.filter-button').on('click', function () {
        var value = $(this).attr('data-filter'),
            filter = $('.filter');
        if (value === 'all') {
            filter.show('1000');
        } else {
            filter.not('.' + value).hide('3000');
            filter.filter('.' + value).show('3000');
        }
    });
    
    $("ul.folio li").on('click', function () {
        $("ul.folio li").removeClass('active');
        $(this).addClass('active');
    });
    
    
    /*   5. MAGNIFIC POPUP
    ---------------------------------------------- */
    $('.image-popup-vertical-fit').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        mainClass: 'mfp-img-mobile',
        image: {
            verticalFit: true
        }
    });
    
    
    /*   6. WOW JS
    ---------------------------------------------- */
    new WOW().init();
    

    /*   7. REPEAT SLIDER ANIMATION
    ---------------------------------------------- */
    //Function to animate slider captions 
    function doAnimations( elems ) {
        //Cache the animationend event in a variable
        var animEndEv = 'webkitAnimationEnd animationend';
        
        elems.each(function () {
            var $this = $(this),
                $animationType = $this.data('animation');
            $this.addClass($animationType).one(animEndEv, function () {
                $this.removeClass($animationType);
            });
        });
    }
    
    //Variables on page load 
    var $myCarousel = $('#folio-slider'),
        $firstAnimatingElems = $myCarousel.find('.item:first').find("[data-animation ^= 'animated']");
        
    //Initialize carousel 
    $myCarousel.carousel();
    
    //Animate captions in first slide on page load 
    doAnimations($firstAnimatingElems);
    
    //Pause carousel  
    $myCarousel.carousel('pause');
    
    
    //Other slides to be animated on carousel slide event 
    $myCarousel.on('slide.bs.carousel', function (e) {
        var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
        doAnimations($animatingElems);
    });  
    
    
});