function loadGifImage(x){
    "use strict";
    try{
        if(!x.parentNode.className.match(/\bever-gif-container\b/)){
            var wrapper = document.createElement('div'); 
            wrapper.className = 'ever-gif-container';
            wrapper.style.backgroundImage = "url('"+x.src+"')";
            x.setAttribute('rel:animated_src',x.dataset.animated_src);
            wrapper.appendChild(x.cloneNode(true));
            x.parentNode.replaceChild(wrapper, x);
        }
    }catch(e){}
}
function tw_gif(){
    "use strict";
    /* GIF Player */
    var $=jQuery;
    var $gifs=$('img.ever-gif[src$=".gif"]');
    var $gifsL=$gifs.length;
    if($gifsL){
        $gifs.each(function(i){
            var $id='ever-gif-'+$gifsL+'-'+i;
            var $gif=$(this).attr({"id":$id,"rel:auto_play":ever_script_data.gif_auto});
            var $accept=true;
            if($gif.closest('.waves-post-menu').length){
                if($gif.closest('.waves-post-menu-content').length){
                    if($gif.closest('.waves-post-menu').data('tw-postmenu-inited')!=='true'){
                        $accept=false;
                    }
                }else{
                    $accept=false;
                }
            }
            if($gif.data('gif-inited')!=='true'&&$accept){
                $gif.data('gif-inited','true');
                var $gifSrc=$gif.attr('src');
                var $gifCont;
                if($gif.closest('.ever-gif-container').length){
                    $gifCont=$gif.closest('.ever-gif-container');
                }else{
                    $gifCont=$('<div class="ever-gif-container" style="background-image:url('+$gifSrc+');"></div>');
                    $gif.before($gifCont);
                    $gifCont.append($gif);
                    $gif.attr('rel:animated_src',$gif.data('animated_src'));
                }
                
                $gifCont.attr({'data-width':($gif.data('width')?$gif.data('width'):0),'data-height':($gif.data('height')?$gif.data('height'):0)});
                
                var $gifSup =new SuperGif({gif:document.getElementById($id),progressbar_height:0});
                $gifSup.load(function(){tw_gif_resize($gifCont,true);});
                if(ever_script_data.gif_auto==='0'){
                    var $gifBtn =$('<span class="ever-gif-button"></span>');
                    $gifCont.append($gifBtn);
                    $gifBtn.on('click',function(e){e.preventDefault();
                        if($gifCont.is('.playing')){
                           $gifCont.removeClass('playing');
                           $gifSup.pause();
                        }else{
                           $gifCont.addClass('playing');
                           $gifSup.play(); 
                        }
                        return '';
                    });
                }
            }
        });
    }
}
function tw_gif_resize($gifCont,$show){
    "use strict";
    /* GIF Player */
    var $jsgif=$gifCont.find('.jsgif');
    var $gifContW=$gifCont.width();
    var $gifContDataW = parseInt($gifCont.data('width'),10);
    var $gifContDataH = parseInt($gifCont.data('height'),10);
    if($jsgif.length&&$gifContDataW&&$gifContDataH){
        $jsgif.css({width:'',height:''});
        var $gifContD = $gifContDataW / $gifContDataH;
        var $gifContH = parseInt($gifContW / $gifContD,10);
        $gifCont.height($gifContH);
        var $jsgifH=$jsgif.height();
        var $jsgifW=$jsgif.width();
        var $top=0;
        var $left=0;
        if($gifContH<$jsgifH){
            $top=($gifContH-$jsgifH)/2;
        }else{
            $jsgif.height($gifContH);
            $jsgifW=$gifContH*($jsgifW/$jsgifH);
            $jsgif.width($jsgifW);
            $left=($gifContW-$jsgifW)/2;
        }
        $jsgif.css({top:$top+'px',left:$left+'px'});
    }
    if($show){
        $jsgif.css('opacity','1');
    }
}

function tw_init(){
    $=jQuery;
    tw_gif();
     /* Video Responsive */
    if (typeof Fluidvids !== undefined && typeof Fluidvids !== 'undefined') {
        $('.hotsugar-container iframe').each(function(){
            var $flFr=$(this);
            if($flFr.data('tw-fluidvids-inited')!=='true'){
                $flFr.data('tw-fluidvids-inited','true').addClass('tw-make-fliud');
            }
        }).promise().done(function(){
            Fluidvids.init({
                selector: '.hotsugar-container iframe.tw-make-fliud',
                players: ['www.youtube.com', 'player.vimeo.com']
            });
            $('.hotsugar-container iframe.tw-make-fliud').removeClass('tw-make-fliud');
        });
    }
    /* Format Modal */
    $('.tw-format-modal').each(function(){
        var $cModal=$(this);
        if($cModal.data('tw-format-modal-inited')!=='true'){
            $cModal.data('tw-format-modal-inited','true');
            var $cFormat=$cModal.data('format');
            var $ifr=$('iframe',$cModal);
            var $owl = $('.owl-carousel',$cModal);
            var $owlReady=$cFormat==='gallery'&& $owl.length && $().owlCarousel !== undefined && $().owlCarousel !== 'undefined';
            var $loop = true;
            var $nav=$('.nav',$cModal).length?$('.nav',$cModal):false;
            var $pagination = $('.owl-carousel-meta>.pagination',$cModal).length?$('.owl-carousel-meta>.pagination',$cModal):false; 
            var $title      = $('.owl-carousel-meta>.title',$cModal).length     ?$('.owl-carousel-meta>.title',$cModal)     :false;
            var $desc       = $('.owl-carousel-meta>.desc',$cModal).length      ?$('.owl-carousel-meta>.desc',$cModal)      :false;
            var $template   = $pagination&&$pagination.data('template')?$pagination.data('template'):false;
            if($owlReady){
                $owl.owlCarousel({
                    autoHeight:true,
                    singleItem: true,
                    loop: $loop,
                    navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
                    nav: true,
                    dots: false,
                    items: 1
                }); 
                $('.owl-nav',$cModal).appendTo($nav);
                $owl.on('changed.owl.carousel',function(e) {
                    if($pagination){
                        var $cInd=e.item.index+($loop?-2:1);
                        var $cCnt=e.item.count;
                        if($cInd>$cCnt){
                           $cInd=$cInd-$cCnt;
                        }else if($cInd<1){
                           $cInd=$cCnt;
                        }
                        if($template){
                            $pagination.html($template.replace('%index%',$cInd).replace('%count%',$cCnt));
                        }
                    }
                    var $cItem=$('.owl-item',$owl).eq(e.item.index);
                    if($title){
                        $title.html($cItem.find('.owl-item-data>.title',$owl).html());
                    }
                    if($desc){
                        $desc .html($cItem.find('.owl-item-data>.desc',$owl).html());
                    }
                });
            }

            $('.tw-format-modal-inner',$cModal).on('click',function(e){e.preventDefault();return false;});
            $($cModal).on('click',function(e){e.preventDefault();
                $('.tw-format-modal-header>.close-modal',$cModal).trigger('click');
            });

            $('.tw-format-modal-header>.close-modal',$cModal).on('click',function(e){e.preventDefault();
                $cModal.removeClass('tw-format-modal-active');
                if($cFormat==='video'&&$('iframe',$cModal).length){
                    $ifr.each(function(){
                        var $cIfr = $(this);
                        $cIfr.attr('data-src',$ifr.attr('src'));
                        $cIfr.attr('src','');
                    });
                }
                if(!$('.tw-format-modal.tw-format-modal-active').length){
                    $('body').removeClass('tw-format-modal-open');
                }
                return false;
            });
        }
    });
}