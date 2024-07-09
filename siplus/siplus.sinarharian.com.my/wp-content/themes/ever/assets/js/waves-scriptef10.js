jQuery(document).ajaxComplete(function () {
    "use strict";
    tw_init();
    jQuery(window).resize();
});
jQuery(document).ready(function ($) {
    "use strict";
    tw_init();
    /* Standard Blog Infinite */
    jQuery('.blog-section').each(function (i) {
        var $currentBlogSec = jQuery(this);
        var $currentInfinite = $currentBlogSec.children('.tw-infinite-scroll');
        if ($currentInfinite.length) {
            var $currentNextLink = $currentInfinite.find('a.next');
            if ($currentNextLink.length) {
                $currentNextLink.off('click').on('click', function (e) {
                    e.preventDefault();
                    if ($currentInfinite.attr('data-has-next') === 'true') {
                        var $infiniteURL = $currentNextLink.attr('href');
                        $currentInfinite.addClass('waiting');
                        $currentInfinite.find('.next').hide();
                        $currentInfinite.find('.loading').css('display', 'inline-block');
                        jQuery.ajax({
                            type: "POST",
                            url: $infiniteURL,
                            success: function (response) {
                                var $currentArticles = $currentBlogSec.find('article');
                                var $newSection = jQuery(response).find('.blog-section').eq(i);
                                var $newURL = $newSection.find('.tw-infinite-scroll a.next').length ? $newSection.find('.tw-infinite-scroll a.next').attr('href') : false;
                                var $hasNext = $newSection.find('.tw-infinite-scroll').attr('data-has-next');
                                var $newArticles = $newSection.find('article');
                                if ($currentArticles.length && $newArticles.length) {
                                    $currentArticles.last().after($newArticles);
                                    if ($hasNext === 'false' || $newURL === false) {
                                        $currentInfinite.attr('data-has-next', 'false');
                                        $currentInfinite.find('.loading').hide();
                                    } else {
                                        $currentNextLink.attr('href', $newURL);
                                        $currentInfinite.find('.loading').hide();
                                        $currentInfinite.find('.next').css('display', 'inline-block');
                                    }
                                    /* Relayout */
                                    var $infIntCnt = 3;
                                    var $infIntTimeout = 1500;
                                    var $currentIsotopeContainer = $('.isotope-container', $currentBlogSec);
                                    if ($currentIsotopeContainer.length) {
                                        if ($currentIsotopeContainer.find('img').length) {
                                            $infIntCnt = 1;
                                            $infIntTimeout = 5000;
                                            $currentIsotopeContainer.find('img').off("load").on("load", function () {
                                                everRelayout($currentIsotopeContainer);
                                            });
                                        }
                                        var $infInt = setInterval(function () {
                                            if (($infIntCnt--) < 0) {
                                                clearInterval($infInt);
                                            }
                                            everRelayout($currentIsotopeContainer);
                                        }, $infIntTimeout);
                                    }
                                } else {
                                    $currentInfinite.attr('data-has-next', 'false');
                                    $currentInfinite.children('.loading').hide();
                                }
                                $currentInfinite.removeClass('waiting');
                            }
                        }).fail(function () {
                            $currentInfinite.removeClass('waiting');
                            $currentInfinite.attr('data-has-next', 'false');
                            $currentInfinite.find('.loading').hide();
                        });
                    }
                });
                if ($currentInfinite.hasClass('infinite-auto') && $currentNextLink.length) {
                    jQuery(window).scroll(function () {
                        var addH = 500;
                        var $lnkAllH = $currentNextLink.offset().top + $currentNextLink.height();
                        var $wndAllH = jQuery(window).scrollTop() + jQuery(window).height() + addH;
                        if (!$currentInfinite.hasClass('waiting') && $lnkAllH < $wndAllH) {
                            if ($currentInfinite.parent().css('display') !== 'none') {
                                $currentNextLink.trigger('click');
                            }
                        }
                    });
                }
            }
        }
    });

    /* Waves Modal Button V-2 */
    $('.tw-modal-btn').each(function () {
        var $cMdlBtn = $(this);
        var $cMdl = $($cMdlBtn.data('modal'));
        var $cMdlBtnCl = $('.nav-icon-container,.tw-mdl-overlay-close');
        $cMdlBtn.on('click', function (e) {
            e.preventDefault();
            if ($cMdl.is('.active')) {
                $cMdlBtn.removeClass('active');
                $cMdl.removeClass('active');
                $('body').removeClass('modal-opened');
            } else {
                if ($('body').is('.modal-opened')) {
                    $('.tw-modal-btn.active').trigger('click');
                }
                $('body').addClass('modal-opened');
                $cMdlBtn.addClass('active');
                $cMdl.addClass('active');
            }
            if ($cMdlBtn.is('.tw-search-icon') && $cMdlBtn.is('.active')) {
                $('.tw-search-menu .searchform input').focus().select();
            }
            return false;
        });
        $cMdlBtnCl.on('click', function (e) {
            e.preventDefault();
            $('.tw-modal-btn.active').trigger('click');
        });
    });

    $('.share-toggle').on('click', function () {
        if ($(this).parent().hasClass('expanded')) {
            $(this).siblings('.ext-share').css('width', '0');
            $(this).parent().removeClass('expanded');
        }
        else {
            var $width = 46;
            var $total = $(this).siblings('.ext-share').children().length;
            $(this).siblings('.ext-share').css('width', $width * $total);
            $(this).parent().addClass('expanded');
        }
    });


    // Flip box
    $('.button-search,.scrollUp a, .wpcf7-form input[type="submit"], .mc4wp-form-fields input[type="submit"], .comment-form input[type="submit"], .tw-social-icon i, .more-link a').each(function () {
        var flipbox = '<div class="flip-box"></div>';
        $(this).before(flipbox);
        flipbox = $(this).prev('.flip-box');
        flipbox.append($(this).clone().addClass('side-f').removeAttr('id')).append($(this).addClass('side-b'));
    });

    /* Search Form Animation */
    jQuery('.tw-header-meta .searchform i').each(function () {
        var $currSearchIcon = jQuery(this);
        var $currInput = $currSearchIcon.siblings('input');
        $currSearchIcon.on('click', function () {
            if (!jQuery('body').hasClass('search-opened-removing')) {
                jQuery('body').addClass('search-opened');
                $currInput.focus().select();
            }
        });
        $currInput.focusout(function () {
            jQuery('body').removeClass('search-opened').addClass('search-opened-removing');
            setTimeout(function () {
                jQuery('body').removeClass('search-opened-removing');
            }, 300);
        });

    });

    $('.video-format-icon').magnificPopup({
        type: 'iframe',
        patterns: {
            youtube: {
                index: 'youtube.com/',
                id: 'v=',
                src: '//www.youtube.com/embed/%id%?autoplay=1'
            },
            vimeo: {
                index: 'vimeo.com/',
                id: '/',
                src: '//player.vimeo.com/video/%id%?autoplay=1'
            },
            gmaps: {
                index: '//maps.google.',
                src: '%id%&output=embed'
            }
        },
    });

    $('.entry-media .owl-carousel, .single-media-thumb .image-overlay').each(function () {
        $(this).magnificPopup({
            delegate: 'a', // the selector for gallery item
            type: 'image',
            gallery:{
                enabled:true
              }
        });
    });

    // OwlCarousel
    if ($().owlCarousel !== undefined && $().owlCarousel !== 'undefined') {
        $('.tw-slider').each(function () {
            var $owl = $('.owl-carousel', $(this));
            var $refreshed = true;
            var $margin = 0;
            var $smartSpeed = 800;
            var $mouseDrag = false;
            var $marginRes = 0;
            var $autoWidth = false;
            var $singleItem = true;
            var $loop = true;
            var $items = 1;
            var $itemRes0 = 1;
            var $itemRes768 = 1;
            var $itemRes960 = 1;
            var $slAuto = ever_script_data.slider_auto;
            var $slDelay = ever_script_data.slider_delay;
            console.log($slAuto);
            if ($(this).hasClass('slider3')) {
                $loop = false;
                $singleItem = false;
                $items = 2;
                $margin = 30;
                $itemRes0 = 1;
                $itemRes768 = 2;
                $itemRes960 = 3;
                $smartSpeed = 1000;
                $mouseDrag = true;
                $marginRes = 20;
                $autoWidth = true;
                var $marginDef = $margin;
                var $width = $owl.width();
                var $widthS = 0;
                var $widthL = 0;
            } 
            $owl.owlCarousel({
                singleItem: $singleItem,
                navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
                nav: true,
                dots: false,
                autoplay: $slAuto,
                autoplayTimeout: $slDelay,
                margin: $margin,
                smartSpeed: $smartSpeed,
                mouseDrag: $mouseDrag,
                autoWidth: $autoWidth,
                fallbackEasing: 'linear',
                loop: $loop,
                items: $items,
                responsive: {
                    0: {
                        items: $itemRes0,
                        margin: $marginRes
                    },
                    768: {
                        items: $itemRes768,
                        margin: $marginRes
                    },
                    960: {
                        items: $itemRes960,
                        margin: $marginRes
                    },
                    1200: {
                        items: $items
                    }
                }
            });
            /* Important After $owl.owlCarousel(); */
            if ($(this).hasClass('slider3')) {
                $owl.on('refresh.owl.carousel', function () {
                    $owl.removeClass('slider3-trans');
                    $refreshed = true;
                    $width = $owl.width();
                    $margin = window.matchMedia('(max-width: 1199px)').matches ? $marginRes : $marginDef;
                    if (window.matchMedia('(max-width: 991px)').matches) {
                        $widthS = parseInt(($width - $margin) / 2, 10);
                        $widthL = $width;
                    } else {
                        $widthS = parseInt(($width - 2 * $margin) / 3, 10);
                        $widthL = $width - $widthS - $margin;
                    }
                    $('.slider-item', $owl).width($widthS);
                    $('.slider-item', $owl).last().width($width);
                    $('.owl-item', $owl).removeClass('owl-item-large').removeClass('owl-item-small');
                    var $large = $('.owl-item.active', $owl).first().addClass('owl-item-large');
                    if ($large.next('.owl-item').length) {
                        $large.next('.owl-item').addClass('owl-item-small');
                    }
                    setTimeout(function () {
                        $refreshed = false;
                        $large.siblings('.owl-item').children('.slider-item').width($widthS);
                        $large.children('.slider-item').width($widthL);
                        setTimeout(function () {$owl.addClass('slider3-trans');}, 100);
                    }, 100);
                });
                $owl.on('changed.owl.carousel', function (e) {
                    $width = $owl.width();
                    $margin = window.matchMedia('(max-width: 1199px)').matches ? $marginRes : $marginDef;
                    var $dif=2;
                    if (window.matchMedia('(max-width: 991px)').matches) {
                        $dif=1;
                        $widthS = parseInt(($width - $margin) / 2, 10);
                        $widthL = $width;
                    } else {
                        $widthS = parseInt(($width - 2 * $margin) / 3, 10);
                        $widthL = $width - $widthS - $margin;
                    }
                    $('.slider-item', $owl).width($widthS);
                    $('.slider-item', $owl).last().width($width);
                    if ($refreshed) {
                        $refreshed = false;
                    } else {
                        $('.owl-item', $owl).removeClass('owl-item-large').removeClass('owl-item-small');
                        var $large = $('.owl-item', $owl).eq(e.item.index).addClass('owl-item-large');
                        if ($large.next('.owl-item').length) {
                            $large.next('.owl-item').addClass('owl-item-small');
                        }
                        $large.children('.slider-item').width($widthL);
                        $large.siblings('.owl-item').children('.slider-item').width($widthS);
                    }
                    setTimeout(function(){
                        if($('.owl-item', $owl).length>$dif){
                            if($('.owl-nav', $owl).length){
                               $('.owl-nav', $owl).removeClass('disabled');
                            }
                            if($('.owl-item.active', $owl).length>$dif){
                                $('.owl-next', $owl).removeClass('disabled');
                            }
                        }
                    },100);
                });
                $owl.trigger('refresh.owl.carousel');
            }
            $owl.on('translate.owl.carousel', function () {
                $owl.addClass('sliding');
            });
            $owl.on('translated.owl.carousel', function () {
                $owl.removeClass('sliding');
            });
        });
        $('.instagram-pics.owl-carousel').each(function () {
            var $cOwl = $(this);
            var $singleItem = $cOwl.closest('.tw-instagram').hasClass('tw-instagram') ? false : true;
            var $items = $cOwl.closest('.tw-instagram').hasClass('tw-instagram') ? ($('body').hasClass('theme-boxed') ? 5 : 8) : 1;
            var $pagination = $cOwl.closest('.sidebar-area').hasClass('sidebar-area') ? true : false;
            var $autoPlay = $cOwl.data('auto-play');
            if ($autoPlay === '') {
                $autoPlay = false;
            }
            $cOwl.owlCarousel({
                autoPlay: $autoPlay,
                nav: false,
                dots: $pagination,
                stopOnHover: true,
                items: $items,
                singleItem: $singleItem,
                responsive: {
                    0: {
                        items: 3
                    },
                    599: {
                        items: 4
                    },
                    768: {
                        items: 5
                    },
                    960: {
                        items: 6
                    },
                    1200: {
                        items: $items
                    }
                }
            });
        });
        $('.tw-post-carousel > .owl-carousel').each(function () {
            var $cOwl = $(this);
            var $items = $cOwl.hasClass('layout-2') ? 3 : 4;
            var $autoPlay = $cOwl.data('auto-play');
            if ($autoPlay === '') {
                $autoPlay = false;
            }
            $cOwl.owlCarousel({
                autoPlay: $autoPlay,
                navigation: false,
                pagination: true,
                stopOnHover: true,
                margin: 20,
                dotsEach: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    640: {
                        items: 2
                    },
                    991: {
                        items: $items
                    }
                }
            });
        });
        $('.tw-post-widget .owl-carousel').each(function () {
            var $cOwl = $(this);
            $cOwl.owlCarousel({
                navigation: false,
                pagination: true,
                dotsEach: true,
                items: 1
            });
        });
        $('.entry-media .owl-carousel').each(function () {
            var $cOwl = $(this);
            $cOwl.owlCarousel({
                navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
                nav: true,
                navigation: true,
                pagination: true,
                dotsEach: true,
                items: 1
            });
        });
    }
    $('.feature-posts').each(function () {
        var $cFeatPost = $(this);
        var $cFeatPostItems = $cFeatPost.children('.post-item');
        var $auto = true;
        var $time = 0;
        var $timeInt = 1000;
        var $timeMax = 3000;
        $cFeatPostItems.each(function () {
            var $cFeatPostItem = $(this);
            $cFeatPostItem.on({
                mouseenter: function () {
                    $cFeatPostItem.addClass('active').siblings('.post-item').removeClass('active');
                    $auto = false;
                },
                mouseleave: function () {
                    $time = 0;
                    $auto = true;
                }
            });
        });
        if ($cFeatPostItems.length > 1) {
            setInterval(function () {
                if ($auto && $time > $timeMax) {
                    $time = 0;
                    var $activeItem = $cFeatPost.children('.post-item.active');
                    var $nextItem = $activeItem.next('.post-item').hasClass('post-item') ? $activeItem.next('.post-item') : $cFeatPostItems.eq(0);
                    $nextItem.addClass('active');
                    $activeItem.removeClass('active');
                } else {
                    $time += $timeInt;
                }
            }, $timeInt);
        }
    });

    /* Video Responsive */
    jQuery('.ever-container iframe').each(function () {
        if (!jQuery(this).hasClass('fluidvids-elem')) {
            jQuery(this).addClass('makeFluid');
        }
    });
    if (typeof Fluidvids !== undefined && typeof Fluidvids !== 'undefined') {
        Fluidvids.init({
            selector: '.ever-container iframe.makeFluid',
            players: ['www.youtube.com', 'player.vimeo.com']
        });
        jQuery('.ever-container iframe').removeClass('makeFluid');
    }

    /* navigation */
    $('.tw-menu ul.sf-menu').superfish({
        delay: 0,
        animation: {
            opacity: 'show',
            height: 'show'
        },
        speed: 'fast',
        autoArrows: false,
        dropShadows: false
    });

    /* Mobile Menu - Sub Menu Action */
    jQuery('.sf-mobile-menu .menu-item-has-children').prepend('<i class="before"></i>');
    $(document).on("click", '.sf-mobile-menu .menu-item-has-children>.before', function (e) {
        e.preventDefault();
        var $parMenu = jQuery(this).closest('li');
        $parMenu.siblings('li.menu-open').removeClass('menu-open').children('.sub-menu').slideUp('fast');
        $parMenu.toggleClass('menu-open');
        if ($parMenu.hasClass('menu-open')) {
            $parMenu.children('.sub-menu').slideDown('fast');
        } else {
            $parMenu.children('.sub-menu').slideUp('fast');
        }
        return false;
    });

    $(document).on("click", '.entry-share a', function (e) {
        e.preventDefault();
        jQuery.post($(this).parent('.entry-share').data('ajaxurl'), {social_pid: $(this).parent('.entry-share').data('id'), social_name: $(this).attr('class')});
        switch ($(this).attr('class')) {
            case'facebook':
                window.open('https://www.facebook.com/sharer/sharer.php?u=' + jQuery(this).attr('href'), "facebookWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
                break;
            case'twitter':
                window.open('http://twitter.com/intent/tweet?text=' + $(this).data('title') + ' ' + jQuery(this).attr('href'), "twitterWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
                break;
            case'pinterest':
                window.open('http://pinterest.com/pin/create/button/?url=' + jQuery(this).attr('href') + '&media=' + $(this).closest('.single-content').find('img').first().attr('src') + '&description=' + $(this).data('title'), "pinterestWindow", "height=640,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
                break;
            case'google':
                window.open('https://plus.google.com/share?url=' + jQuery(this).attr('href'), "googleWindow", "height=640,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
                break;
            case'linkedin':
                window.open('https://www.linkedin.com/shareArticle??mini=true&url=' + jQuery(this).attr('href') + '&title=' + $(this).data('title'), "linkedinWindow", "height=640,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
                break;
        }

        return false;
    });

    /* Scroll Up Menu */
    var $scrollTopOld = jQuery(window).scrollTop();
    var $scrollUpMax = 100;
    var $scrollUp = 0;
    var $scrollDownMax = 50;
    var $scrollDown = 0;
    jQuery(window).scroll(function (e) {
        var $header = jQuery('header>.tw-menu-container');
        var $headerClone = $header.siblings('.header-clone');
        var $headerCloneOT = $headerClone.offset().top;
        var $scrollTop = jQuery(window).scrollTop();
        /* START - Header resize */
        /* Important - Is HeaderScrollUp Check First */
        if (jQuery('#wpadminbar').attr('id') === 'wpadminbar') {
            $headerCloneOT -= jQuery('#wpadminbar').height();
        }
        var $diff = $scrollTopOld - $scrollTop;
        if ($diff > 0) {/* Scroll Up */
            $scrollUp += $diff;
            $scrollDown = 0;
        } else {/* Scroll Down */
            $scrollUp = 0;
            $scrollDown -= $diff;
        }
        $scrollTopOld = $scrollTop;
        if ($scrollUpMax <= $scrollUp && $scrollTop > 0 && $headerCloneOT < $scrollTop && !jQuery('body').hasClass('header-small') && jQuery('body').hasClass('scroll-menu')) {
            jQuery('body').addClass('header-small');
            $header.css('margin-top', ('-' + $header.height() + 'px'));
            $header.stop().animate({marginTop: 0}, 200, 'linear', function () {
                $header.css({'margin-top': ''});
            });
        } else if (($scrollDownMax <= $scrollDown || $scrollTop === 0 || $headerCloneOT > $scrollTop) && jQuery('body').hasClass('header-small') && !$header.hasClass('hidding')) {
            if ($scrollTop === 0 || $headerCloneOT > $scrollTop) {
                jQuery('body').removeClass('header-small').removeClass('hidding');
            } else {
                $header.stop().addClass('hidding').animate({marginTop: ('-' + $header.height() + 'px')}, 200, 'linear', function () {
                    jQuery('body').removeClass('header-small');
                    $header.css({'margin-top': ''}).removeClass('hidding');
                });
            }
        }
        /* END   - Header resize */
        if (jQuery(this).scrollTop() > $header.height()) {
            jQuery('.scrollUp a').fadeIn();
        } else {
            jQuery('.scrollUp a').fadeOut();
        }
    });
    jQuery(window).scroll();
    /* --------------- */
    jQuery('.scrollUp a').click(function () {
        jQuery("html, body").animate({scrollTop: 0}, 500);
        return false;
    });
});
jQuery(window).load(function () {
    tw_gif();
    /* --------------- */
    jQuery(window).resize();
});
/* Resize */
jQuery(window).resize(function () {
    "use strict";
    /* GIF Resize */
    /* ------------------------------------------------------------------- */
    jQuery('.ever-gif-container').each(function () {
        tw_gif_resize(jQuery(this), false);
    });
    /* Isotope Resize */
    /* ------------------------------------------------------------------- */
    setTimeout(function(){
        jQuery('.isotope-container').each(function () {
            everRelayout(jQuery(this));
        });
    },1000);
    
    jQuery('.content-area').each(function(){
        if( !jQuery(this).hasClass('fullwidth-content') && window.matchMedia('(min-width: 640px)').matches){
            jQuery('.nextprev-postlink > .with-img').on({
                mouseenter: function () {
                    jQuery(this).siblings('div').addClass('hover-push');
                },
                mouseleave: function () {
                    jQuery(this).siblings('div').removeClass('hover-push');
                }
            });
        }else{
            jQuery('.nextprev-postlink > .with-img').off('mouseenter').off('mouseleave');
        }
    });
});