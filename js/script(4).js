let $html = jQuery('html');
let $document = jQuery(document);
let $window = jQuery(window);
let $body = jQuery('body');
let $header = jQuery('.unit-header');
let windowWidth = $window.width();
let windowHeight = $window.height();
let isTouch = $html.hasClass('bx-touch');
let isAuthorized = $html.hasClass('html--authorized');
let pressEvent = isTouch ? 'touchend' : 'click';
let HTMLloading = '<div class="b-lds horiz-vert-center" data-loading> <div class="b-lds__round"></div><div class="b-lds__round"></div><div class="b-lds__round"></div><div class="b-lds__round"></div><div class="b-lds__round"></div><div class="b-lds__round"></div><div class="b-lds__round"></div><div class="b-lds__round"></div></div>';
let settingPopup = {
    margin: [0, 0],
    image: {
        protect: true
    },
    lang: "ru",
    loop : true,
    touch: false,
    i18n: {
        ru: {
            CLOSE: "Закрыть",
            NEXT: "Вперед",
            PREV: "Назад",
            ERROR: "Запрошенный контент не может быть загружен. <br/> Повторите попытку позже.",
            PLAY_START: "Начать слайд-шоу",
            PLAY_STOP: "Пауза слайд-шоу",
            FULL_SCREEN: "На весь экран",
            THUMBS: "Эскизы",
            DOWNLOAD: "Скачать",
            SHARE: "Поделиться",
            ZOOM: "Увеличить"
        }
    },
    closeExisting: true,
    afterLoad: function() {
        let src = this.src;
        let $btn = $(this.opts.$orig) || false;
        let id = $btn.data('id');

        if(id) src = id;

        if(src.search('majority') > 0){
            $html.addClass('html--popup-majority');
        }

        if(src.search('#') >= 0) {
            let $cnt = $(src);
            let type = $('[data-type]',$btn).data('type');
            let name = $('[data-name]',$btn).data('name');
            let shop = $('[data-shop]',$btn).data('shop');
			let vacancy = $('[data-vacancy]',$btn).data('vacancy');

            if(type) $('input[name="type"]',$cnt).val(type);
            if(shop) $('input[name="shop"]',$cnt).val(shop);
			if(vacancy) $('input[name="vacancy"]',$cnt).val(vacancy);
            if(name) $('[data-name]',$cnt).text(name);

            if($('form',$cnt).length) init_validate();
            if($('.js-mask-tel',$cnt).length) init_mask();
            if($('.js-inp-styled',$cnt).length) init_inp_styler();

            $('.error,.has-error,.has_error',$('form',$cnt).trigger('reset')).removeClass('error has-error has_error');
        }

    }
};
let notifications = {
    goods_absent: "<svg class=\"unit-fill-red\" viewBox=\"0 0 22 25\"><use xlink:href=\"#i-notification\"></use></svg> Уведомить о поступлении"
}
let tempMarkersArray = [];
let objMaps = {};
let goods_slider = false;
let Fancybox;
let setting_popup = {
        on: {
            reveal: (fancybox, slide) => {

                let $btn = $(slide.triggerEl) || false,
                    id = $btn.data('id');

                if(id) {
                    let $cnt = $('#'+ id);
                    let type = $('[data-type]',$btn).data('type');
                    let name = $('[data-name]',$btn).data('name');
                    let shop = $('[data-shop]',$btn).data('shop');
                    let vacancy = $('[data-vacancy]',$btn).data('vacancy');

                    if(type) $('input[name="type"]',$cnt).val(type);
                    if(shop) $('input[name="shop"]',$cnt).val(shop);
                    if(vacancy) $('input[name="vacancy"]',$cnt).val(vacancy);
                    if(name) $('[data-name]',$cnt).text(name);

                    if($('form',$cnt).length) init_validate();
                    if($('.js-mask-tel',$cnt).length) init_mask();
                    if($('.js-inp-styled',$cnt).length) init_inp_styler();

                    $('.error,.has-error,.has_error',$('form',$cnt).trigger('reset')).removeClass('error has-error has_error');
                }
            }
        }
    };

jQuery(document).ready(function($) {

    // if($.fn.fancybox) {
    //
    //     init_fancybox();
    //
    //     $('.js-popup-gallery').fancybox(settingPopup);
    //
    //     $document.on('click','.js-close-popup',function(){
    //         $.fancybox.close();
    //     });
    //
    //     if(!isTouch) {
    //         $('.js-popup-desktop').fancybox(settingPopup);
    //     }
    //
    //     // $.fancybox.open({
    //     //     src  : '#popup__product-add',
    //     //     type : 'inline',
    //     //     opts : settingPopup
    //     // });
    //
    //     // $.fancybox.open({
    //     //     src  : '/ajax/personal/login.php',
    //     //     type : 'ajax',
    //     //     opts : $.extend(settingPopup, {
    //     //         modal: true,
    //     //         touch: false,
    //     //         clickSlide: false
    //     //     })
    //     // });
    // }

    if(Fancybox){

        Fancybox.bind('.js-popup', setting_popup);

        $document.on('click','.js-close-popup',function(){
            Fancybox.close();
        });

        if(windowWidth >= 1024) {
            Fancybox.bind('.js-popup-desktop', setting_popup);
        }

    }

    if($.fn.mCustomScrollbar) {

        $('.js-custom-scroll-x').mCustomScrollbar({
            axis: 'x'
        });

    }

    /* filters price */
/*
    let $filter_price_range = $('#filter_price_range');

    if($.fn.slider && $filter_price_range.length){

        let $FPR_contain = $filter_price_range.closest('[data-contain-range]');
        let $FPR_from = $('input[data-type="from"]',$FPR_contain);
        let $FPR_to = $('input[data-type="to"]',$FPR_contain);

        let max = $FPR_contain.data('number-max');
        let intervalStart = $FPR_contain.data('interval-start');
        let intervalFinish = $FPR_contain.data('interval-finish');

        $filter_price_range.slider({
            range: true,
            min: 0,
            max: max,
            values: [ intervalStart, intervalFinish ],
            slide: function( event, ui ) {
                $FPR_from.val(ui.values[0]);
                $FPR_to.val(ui.values[1]);
            }
        });

        // $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
        //     " - $" + $( "#slider-range" ).slider( "values", 1 ) );

        $document.on('keyup','.js-slider-range-val',function(){
            let $this = $(this);
            let $contain = $this.closest('[data-contain-range]');
            let $input_from = $('input[data-type="from"]',$contain);
            let $input_to = $('input[data-type="to"]',$contain);

            let type = $this.data('type');
            let val = $this.val();
            let min = parseInt($input_from.val());
            let max = parseInt($input_to.val());
            let standartMax = parseInt($contain.data('number-max'));
            let val_from = min;
            let val_to = max;


            if(type == 'from') {
                val = val == '' ? 0 : val.replace(/\D/, 0);
                val > max ? val = max : '';
                val_from = val;
            }
            if(type == 'to') {

                val = val == '' ? 0 : val.replace (/\D/, max);
                val < min ? val = min : '';
                val > standartMax ? val = standartMax : '';
                val_to = val;
            }

            $this.val(parseInt(val));
            $filter_price_range.slider("values", [parseInt(val_from),parseInt(val_to)]);
        });

    }
*/
    /* filters price */

    init_img_lazy();

    init_mask();

    init_validate();

    init_inp_styler();

    if(Swiper) {

        let $main_offers = $('.js-main-offers');
        let $goods_slider = $('.js-goods-slider');
        let $product_slider = $('.js-product-mobile-slider');

        if($main_offers.length) {

            new Swiper('.js-main-offers', {
                allowTouchMove: true,
                grabCursor: true,
                effect: "fade",
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                navigation: {
                    nextEl: '.js-main-offers .b-swiper-navigation__control--next',
                    prevEl: '.js-main-offers .b-swiper-navigation__control--prev'
                },
                pagination: {
                    el: '.b-swiper-pagination'
                }
            });
        }

        if($product_slider.length) {

            new Swiper('.js-product-mobile-slider', {
                allowTouchMove: true,
                grabCursor: true,
                effect: "fade",
                pagination: {
                    el: ".swiper-pagination",
                    type: "fraction",
                },
            });
        }

        if($goods_slider.length) {

            new Swiper('.js-goods-slider', {
                slidesPerView: 'auto',
                allowTouchMove: true,
                navigation: {
                    nextEl: '.js-goods-slider [data-control="next"]',
                    prevEl: '.js-goods-slider [data-control="prev"]',
                }
            });

        }

    }

    $document.on('click','.js-anchor',function(){
        let $this = $(this);
        let id = $this.attr('href') || $this.data('href');

        if($html.hasClass('html--sidebar-visible')) {
            $html.removeClass('html--sidebar-visible');
            removeOverlay();
        }

        $('html, body').stop().animate({ scrollTop: $(id).offset().top }, {
            duration: 'slow',
            easing: 'linear'
        });

        return false;
    });

    $document.on('click','.js-element-toggle',function(){
        let $this = $(this);
        let classActive = $this.data('class-active');
        // let isFilter = classActive.indexOf('filters') >= 0;

        if($html.hasClass(classActive)) {

            $html.removeClass(classActive);
            // isFilter ? styleWidthScrollbarClear() : "";
            styleWidthScrollbarClear();
            removeOverlay();
        } else {

            $html.addClass(classActive);
            styleWidthScrollbar();
            addOverlay($this,classActive);
        }

    });

    $document.on('click','.js-overlay',function(){
        let $this = $(this);

        $html.removeClass($this.attr('data-remove-class'));
        styleWidthScrollbarClear();

        $this.remove();
    });

    $document.on('click','.js-book',function(){
        let $contain = $(this).closest('[data-book-contain]');
        let toggleClass = $contain.data('book-toggle-class');

        $contain.toggleClass(toggleClass);
        toggleClass.search('filters') ? catalog_height() : '';
    });

    let tabComplete = true;

    $document.on('click','.js-tab',function (){
        let $this = $(this);
        let $contain = $this.closest('[data-tab-contain]');
        let id = $this.data('tab');
        let menuActive = $contain.data('tab-active');
        let contentActive = $contain.data('content-active');

        let $content = $('[data-tab-id="' + id + '"]',$contain);

        if(tabComplete && !$content.hasClass(contentActive)) {

            tabComplete = false;

            $('[data-tab]',$contain).removeClass(menuActive);
            $this.addClass(menuActive);

            $('.' + contentActive,$contain).slideUp(300,function(){
                $(this).removeClass(contentActive).removeAttr('style');


                $content.slideDown(300,function (){
                    $(this).addClass(contentActive).removeAttr('style');
                    tabComplete = true;
                });
            });
        }


        return false;
    });

    $document.on('click','.js-filters-more',function(){
        let $this = $(this);
        let $contain = $this.closest('[data-more-contain]');

        $contain.addClass($this.data('showall-class'));
        $('input[type="search"]',$contain).val('').trigger('keypress');
        $this.closest('[data-showall-remove]').parent().html('')/*remove()*/;
        catalog_height();
    });

    $document.on('click','.js-add-in-basket',function(){
        let $this = $(this);
        let id = $this.data('id');
        let type = $this.data('type');
        let src = $this.data('src');
        let product_name = $this.data('product-name');
        let product_text = $this.data('product-text');
        let product_pict = $this.data('product-pict');
        let product_price = $this.data('product-price');
        let product_price_old = $this.data('product-price-old');
        let product_price_discount = $this.data('product-price-discount');
		if (src && type)
		{
			$.fancybox.open({
				src  : src,
				type : type,
				opts : $.extend(settingPopup, {
					afterLoad: function() {
						let $cnt = $(id);

						$('[data-product-pict]',$cnt).attr('data-src',product_pict).attr('alt',product_name).lazy();
						$('[data-product-name]',$cnt).text(product_name);
						$('[data-product-text]',$cnt).text(product_text);
						$('[data-product-price]',$cnt).text(product_price);

						if(product_price_discount) {
							$('[data-discount]',$cnt).attr('data-discount','-' + product_price_discount + '%');
							$('[data-product-price-old]',$cnt).text(product_price_old);
						} else {
							$('[data-product-price-old-contain]',$cnt).remove();
						}

					}
				})
			});
		}

    });

    $document.on('click','.js-add-product',function(){
        let $this = $(this);
        let $contain = $this.closest('[data-contain-main]');

        $contain.addClass($contain.data('count-visible'));


        return false;
    });

    $document.on('keyup keydown keypress','.js-autocomplete',function(){
        let $this = $(this);
        let value = $this.val().toLowerCase();
        let $objects = $('[data-autocomplete="' + $this.data('autocomplete-id') + '"]');

        if(value != '') {

            $.each($objects,function(){
                let _this = $(this);
                let text = $.trim(_this.text()).toLowerCase();

                text.search(value)==-1 ? _this.hide() : _this.show();
            });

        } else {
            $objects.removeAttr('style');
        }

    });

    let favoriteTimeout = -1;

    $document.on('click','.js-product-toggle-favorite',function(){
        let $this = $(this);
        let toggleClass = $this.data('class-toggle');
        let expClass = $this.data('class-exp');

        if(expClass) {

            clearTimeout(favoriteTimeout);
            $this.toggleClass(toggleClass).addClass(expClass);
            favoriteTimeout = setTimeout(function(){

                $this.removeClass(expClass);
            },2000);
        } else {
            $this.toggleClass(toggleClass);
        }

    });

    $document.on('click','.js-toggle-favorite',function(){
        let $this = $(this);

        $this.toggleClass($this.data('class-toggle'));

        return false;
    });

    $document.on({
        mouseenter: function () {

            let $this = $(this);
            let type = $this.data('content-type');
            $this.wrap('<span class="unit-popover-contain"></span>');
            $this.before('<span class="unit-popover unit-popover--' + $this.data('popover-direction') + '"><span class="unit-popover__contain">' + notifications[type] + '</span></span>');

        },
        mouseleave: function () {
            let $this = $(this);
            $('.unit-popover',$this.parent()).remove('.unit-popover');
            $this.unwrap();
        }
    },'.js-popover');

    $document.on({
        mouseenter: function () {

            let $this = $(this);
            let src = $this.data('src');
            let toggleClass = $this.data('toggle-class');
            let $contain = $this.closest('[data-card-gallery]');

            $('.' + toggleClass,$contain).removeClass(toggleClass);
            $this.addClass(toggleClass);
            $('[data-card-gallery-main]',$contain).attr('src',src).lazy();
        },
        mouseleave: function () {}
    },'.js-card-gallery-image');

    $document.on('click','.js-majority-complete',function(){

        Cookies.set('majority','true');
        // $.fancybox.close();
        Fancybox.close();
        $html.removeClass('html--popup-majority');

    });

    /* корзина */

    $document.on('click','.js-basket-count',function(){
       let $this = $(this);
       let type = $this.data('count-type');
       let $contain_count = $this.closest('[data-count-contain]');
       let $contain_product = $this.closest('[data-product-contain]');
       let $input = $('input',$contain_count);
       let value = parseInt($input.val());
       let $price = $('[data-price]',$contain_product);
       let product_price = parseInt($price.data('price'));
       let goods_max = $input.data('max');
	   let product = $this.data('id');

        type == 'less' ? value-- : value++;
        //if(value > goods_max) return false;
		if(goods_max<=0) return false;
        //value == 0 ? value = 1 : value;

        $input.val(value);

        // $price.text(product_price * value);
        basket_product_calculations();

		let id = $input.data('id');
		let kol = $input.val();
		if (kol>0)
		{
			$('body').addClass('unit-loader');
			$.ajax({
			  type: "POST",
				url: "/ajax/add_basket.php",
				data: {id:id,action:'edit',kol:kol}
			}).done(function(msg){
				$('.js_small_header').html(msg.html);
				$('.b-widget-basket').html(msg.html2);
				basket_items_calculation(msg.items, msg.sum);
				setTimeout(function(){ $('body').removeClass('unit-loader')}, 500);
			});
		}
		else
		{
			if ($('.delete_basket[data-id='+id+']').length)
			{
				$('.delete_basket[data-id='+id+']').trigger('click');
			}
			else {
				$.ajax({
					type: "POST",
					dataType:"json",
					url: "/ajax/add_basket.php",
					data: {id:id,action:'delete'}
				}).done(function(msg){
						$('.js_small_header').html(msg.html);
						$('.b-widget-basket').html(msg.html2);
						ShowBasketButton(kol, id, product, $this);
						basket_items_calculation(msg.items, msg.sum);
					});
			}
		}
    });


    $document.on('click','.js-basket-check',function (){
        let $this = $(this);
        let href = $this.data('href');
        let $ordering_contain = $this.closest('[data-customer-basket]');
        let goods_count = $('[data-goods-count]',$ordering_contain).data('goods-count');
        let goods_sum_price = $('[data-goods-price-total]',$ordering_contain).data('goods-price-total');
        let goods_term = $('[data-goods-term]',$ordering_contain).data('goods-term');
		let availability=$('[data-availability]',$ordering_contain).data('availability').toString()=='true';

        if(goods_count && goods_sum_price >= goods_term && availability) {
            window.location.href = href;
        } else {
            $this.addClass('btn--disabled');
        }


        return false;
    });

    $document.on('click','.js-product-remove',function(){

       $(this).closest('[data-product-contain]').remove();
        basket_product_calculations();
    });

    if(windowWidth >= 1136 && $('[data-basket-progress-fixed]').length) {
        let $basket_progress = $('[data-basket-progress-fixed]');
        let $basket_page = $('[data-basket-contain]');
        let basket_top = $basket_page.offset().top;
        let headerFixHeight = 87;

        let back_progress_fixed_top = $basket_progress.data('progress-class-top');
        let back_progress_fixed_bottom = $basket_progress.data('progress-class-bottom');
        let bask_progress_top = $basket_progress.closest('[data-customer-basket]').offset().top - headerFixHeight;


        $document.on('scroll',function(){
            let top = $(this).scrollTop();
            let basket_height = $basket_page.outerHeight();
            let progress_height = $basket_progress.outerHeight();

            if(basket_height >= progress_height) {

                if(top >= bask_progress_top) {
                    $basket_progress.addClass(back_progress_fixed_top);

                    if(top + progress_height >= basket_top + basket_height - headerFixHeight) {
                        $basket_progress.addClass(back_progress_fixed_bottom).removeClass(back_progress_fixed_top);
                    } else {
                        $basket_progress.removeClass(back_progress_fixed_bottom).addClass(back_progress_fixed_top);
                    }

                } else {
                    $basket_progress.removeClass(back_progress_fixed_top);
                }
            }

        }).trigger('scroll');

    }

    /* корзина */

    /* Оформление заказа */

    $document.on('change','#ordering_newsletter',function(){
		if ($(this).is(':checked')){
			if($('.js_email_reg').val()==''){
				$('.js_email_reg').attr('data-validation','length');
				$('.js_email_reg').attr('data-validation-length','min9');
			}
			$(this).val('Y');
		}else{
			$('.js_email_reg').removeAttr('data-validation');
			$('.js_email_reg').removeAttr('data-validation-length');
			$('.js_email_reg').removeClass('error');
			$('.js_email_reg').closest('.has-error').removeClass('has-error');
			$(this).val('N');
		}


	});

    $document.on('change','.js-delivery-method',function(){
        let $this = $(this);
        let classActive = $this.data('dm-active');
        let url = $this.data('delivery-src');
        let id = $this.data('delivery-method-id');
        let $block = $('[data-delivery-method="' + id + '"]');
        let $actived_block = $('.' + classActive);
        let $contain = $this.closest('[data-delivery-contain]');
        let $step_contain = $this.closest('[data-step-contain]');



        if($actived_block.length) {
            $actived_block.slideUp(function (){
                $(this).removeClass(classActive).removeAttr('style').children().remove();
                $('input[data-delivery-method-id]',$step_contain).val('');
            });
        }

		let ids=$this.attr('data-id');
		$('.order_delivery_id').val(ids);

        $.ajax({
            data: '',
            type: 'POST',
            url: url,
            beforeSend: function(){},
            success: function(data){
                $block.html(data);

                $block.slideDown(function(){
                    let $this = $(this);

                    $this.addClass(classActive).removeAttr('style');
                    switch (id) {
                        case "pickup":
                            google.maps.event.addDomListener(window, 'load', initMainMap('shops_order_pickup'));
                            if(markersShopsPickupArray) setMarkers('shops_order_pickup',markersShopsPickupArray);
                            break;
                        case "courier":
                            $('.js-delivery-autocomplete').suggestions({
                                token: "0396b4c9f65f2ef9610ee03d34f488e1ac78c8a0",
                                type: "ADDRESS",
                                onSuggestionsFetch: function(suggestions){
                                    let $this = $(this);
                                    try {
                                        $this.attr('data-basket-address',suggestions[0].unrestricted_value);
										ordering_button_state($this);
                                    } catch (err) {}
                                }
                            });
                            break;
                        case "transport_company":
                            $('.js-delivery-autocomplete').suggestions({
                                token: "0396b4c9f65f2ef9610ee03d34f488e1ac78c8a0",
                                type: "ADDRESS",
                                onSuggestionsFetch: function(suggestions){
                                    let $this = $(this);
                                    try {
                                        $this.attr('data-basket-address',suggestions[0].unrestricted_value);
										ordering_button_state($this);
                                    } catch (err) {}
                                }
                            });
                            break;
/*
                        case "pick_points":
                            google.maps.event.addDomListener(window, 'load', initMainMap('shops_order_pick_point'));
                            if(markersShopsPickPointsArray) setMarkers('shops_order_pick_point',markersShopsPickPointsArray);
                            break;
*/
                    }

                });

                ordering_button_state($this);

                $('html, body').stop().animate({ scrollTop: $contain.offset().top + $contain.outerHeight() - 100}, {
                    duration: 'slow',
                    easing: 'linear'
                });
            }
        });

        return false;
    });

    $document.on('change','.js-delivery-assembly-pickpoint',function (){
        let $this = $(this);
        let $contain = $this.closest('[data-step-contain]');
        let str_finish = $this.data('basket-name') + ($this.data('basket-street') ? ', ' + $this.data('basket-street') : "") + ', ' + $this.data('basket-price');

        $('[data-delivery-method-id="' + $this.data('delivery-method') + '"]',$contain).val(str_finish);
        $('[data-step-result]',$contain).text(str_finish);
        ordering_button_state($this);

    });

    $document.on('blur','.js-delivery-assembly-courier',ordering_delivery_address);
    $document.on('blur','.js-delivery-assembly-transport-company',ordering_delivery_address);

    $document.on('change','.js-ordering-payment',function (){
        let $this = $(this);
        let $contain = $this.closest('[data-step-contain]');
        let str_finish = $this.val();

        $('[data-step-result]',$contain).text(str_finish);
        ordering_button_state($this);
    });

    $document.on({
        mouseenter: function () {
            let $this = $(this);
            let content = $this.data('popover-content');
            let direction = $this.data('popover-direction');

            HTMLpopover = '' +
                '<span class="b-popover b-popover--' + direction + '" data-popover>' +
                    '<span class="b-popover__content">' + content + '</span>' +
                '</span>' +
                '';
            $this.append(HTMLpopover);
        },
        mouseleave: function () {
            let $this = $(this);
            $('[data-popover]',$this).remove();
        }
    },'.js-popover-text');


/*
function validateEmail(email) {
let regEx = /^[A-Z0-9][A-Z0-9._%+-]{0,63}@(?:[A-Z0-9-]{1,63}.){1,125}[A-Z]{2,63}$/;
return regEx.test(String(email).toLowerCase());
}
*/
    $document.on('click','.js-step-ordering',function (){
        let $this = $(this);
        let step_next = $this.data('step-id');
        let step_current = $this.data('step-current');
        let $contain = $this.closest('[data-step-contain]');
        let step_active_class = $contain.data('step-active');
        let step_complete_class = $contain.data('step-complete');



let error_email=false;



        if(ordering_button_state($this)) {

            if(step_next) {

				if ($('#ordering_newsletter').is(':checked')){
					let pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,6}\.)?[a-z]{2,6}$/i;
					if (pattern.test($('.js_email_reg').val())) {
							$('.js_email_reg').removeClass('error');
							$('.js_email_reg').closest('.has-error').removeClass('has-error');
					}else{
							$('.js_email_reg').addClass('error');
							$('.js_email_reg').closest('.has-error').addClass('has-error');
							error_email=true;
					}
				}

				if(!error_email){

					let $next_step = $('[data-step="' + step_next + '"]',$contain.closest('form'));
	
					$contain.removeClass(step_active_class).addClass(step_complete_class);
					$next_step.addClass(step_active_class);
	
					customer_basket_control_step(step_current);
					$('html, body').stop().animate({ scrollTop: $next_step.offset().top - 100}, {
						duration: 'slow',
						easing: 'linear'
					});
				}

            } else {
                let UTM = '';
                let form = $contain.closest('form');
                let action = form.data('href-ajax');

                // if($('input:checked',$contain).data('type') == 'online') {}


                if($_GET('utm_source')) {
                    UTM = '&utm_source=' + $_GET('utm_source') + '&' +
                        'utm_medium=' + $_GET('utm_medium') + '&' +
                        'utm_campaign=' + $_GET('utm_campaign') + '&' +
                        'utm_content=' + $_GET('utm_content') + '&' +
                        'utm_term=' + $_GET('utm_term');
                }

                $.ajax({
                    data: form.serialize() + UTM,
                    type: form.attr('method') || 'POST',
                    url: action,
                    beforeSend: function(){
                        $contain.append(HTMLloading).addClass($contain.data('step-loading'));
                    },
                    success: function(data){
                        showMessage(form,data);
                        if(action.search('ordering') > 0) yaGoals__conver___ordering();
                        $('html, body').stop().animate({ scrollTop: form.offset().top - 100}, {
                            duration: 'slow',
                            easing: 'linear'
                        });
                    }
                });

            }
        }




    });

    $document.on('click','.js-step-change',function (){
        let $this = $(this);
        let $contain = $this.closest('[data-step-contain]');
        let $form = $contain.closest('form');
        let step_active_class = $contain.data('step-active');
        let step_complete_class = $contain.data('step-complete');

        $('.' + step_active_class,$form).removeClass(step_active_class);
        $contain.removeClass(step_complete_class).addClass(step_active_class);
    });

    /* Оформление заказа */

    let $scroll_top_block = $('.js-scroll-top');

    $document.on('click','.js-scroll-top',function(){

        $('html, body').stop().animate({ scrollTop: 0 }, {
            duration: 'slow',
            easing: 'linear',
            complate: function(){
                $html.removeClass('html--scrolltop-visible');
            }
        });
    });

    if($('#catalog').length) catalog_height();

    // if(Cookies.get('majority') == undefined && !isAuthorized){
    //
    //     $.fancybox.open({
    //         src  : '/ajax/majority.php',
    //         type : 'ajax',
    //         opts : $.extend(settingPopup, {
    //             modal: true,
    //             touch: false,
    //             clickSlide: false
    //         })
    //     });
    // }

    if(Cookies.get('majority') == undefined && !isAuthorized){

        Fancybox.show([{
            src: '/ajax/majority.php',
            type: 'ajax',
        }], {
            on: {
                reveal: (fancybox, slide) => {
                    $html.addClass('html--popup-majority');
                }
            },
            closeButton: false,
            Toolbar: false,
            dragToClose: false,
            backdropClick: 'none',
            keyboard: {
                Escape: null,
            },
        });
    }

    if(windowWidth <= 854) {

        $document.on('click','.js-toggle-catalog-menu',function(){
            let $this = $(this);
            let id = $this.data('menu-toggle');
            let classActive = $this.data('menu-toggle-active');

            $('[data-menu-toggle-id="' + id + '"]').toggleClass(classActive);

            return false;
        });

        $document.on('click','.js-toggle-catalog',function(){
            let $this = $(this);
            let classActive = $this.data('class-active');

            $html.toggleClass(classActive);

        });

    }

    let header_pos = $header.offset().top + $header.outerHeight();

    $document.on('scroll',function(){
        let top = $(this).scrollTop();

        top >= header_pos ? $html.addClass('html--header-fixed') : $html.removeClass('html--header-fixed');

        top >= 1500 && $scroll_top_block.length ? $html.addClass('html--scrolltop-visible') : $html.removeClass('html--scrolltop-visible');


    }).trigger('scroll');

    if($('#shops_map').length) {
        google.maps.event.addDomListener(window, 'load', initMainMap('shops_map'));
        if(markersShopsArray) setMarkers('shops_map',markersShopsArray);
    }

    // let personalConfirm = -1;
    // $document.on('click','.js-personal-confirm',function (){
    //     let $this = $(this);
    //     let $contain = $this.closest('[data-confirm]');
    //     let $answer = $('[data-confirm-answer]',$contain);
    //     let classLoad = $contain.data('confirm-load');
    //     let classAnswer = $contain.data('confirm-answer');
    //     let type = $contain.data('confirm');
    //
    //     console.log($answer.length);
    //
    //     if(type == 'email'){
    //
    //
    //         clearTimeout(personalConfirm);
    //         $contain.addClass(classLoad);
    //         $answer.text('На ваш email отправлено письмо с подтверждением');
    //         favoriteTimeout = setTimeout(function(){
    //
    //             $contain.removeClass(classLoad).addClass(classAnswer);
    //             $this.remove();
    //         },2000);
    //
    //     }
    //
    // });

    $document.on('click','.js-personal-detail-order',function (){
        let $this = $(this);
        let $contain = $this.closest('[data-detail-contain]');
        let id = $this.data('detail-id');

        $('[data-detail="' + id + '"]',$contain).slideDown();
        $this.remove();

    });

    /* счетчик количества товара */

        $document.on('click','.js-counter-control',function(){
            let $this = $(this);
            let type = $this.data('count-type');
            let $contain_count = $this.closest('[data-count-contain]');
            let $input = $('input[data-count]',$contain_count);
            let count_max = $input.data('count-max');
            let value = parseInt($input.val());

            type == 'less' ? value-- : value++;

            value == 0 ? value = 1 : '';
            value > count_max ? value = count_max : '';

            $input.val(value);

        });

        $document.on('keyup','.js-counter-inp',function(){
            let $this = $(this);
            let value = $this.val().replace(/\D/, '');
            let count_max = $this.data('count-max');
			let id=$this.data('id');
			let product= $this.attr('id').replace('quantity_', '');

            //value == '' ? value = 0 : value;
			if (id)
			{
				if (parseInt(value)>0)
				{
					$('body').addClass('unit-loader');
					$.ajax({
					  type: "POST",
						url: "/ajax/add_basket.php",
						data: {id:id,action:'edit',kol:value}
					}).done(function(msg){
						$('.js_small_header').html(msg.html);
						$('.b-widget-basket').html(msg.html2);
						 basket_product_calculations();
						 basket_items_calculation(msg.items, msg.sum);
						setTimeout(function(){ $('body').removeClass('unit-loader')}, 500);
					});
				}
				else if (parseInt(value)==0)
				{
					if ($('.delete_basket[data-id='+id+']').length)
					{
						$('.delete_basket[data-id='+id+']').trigger('click');
					}
					else {
						$.ajax({
							type: "POST",
							dataType:"json",
							url: "/ajax/add_basket.php",
							data: {id:id,action:'delete'}
						}).done(function(msg){
								$('.js_small_header').html(msg.html);
								$('.b-widget-basket').html(msg.html2);
								ShowBasketButton(value, id, product, $this);
								basket_product_calculations();
								basket_items_calculation(msg.items, msg.sum);
							});
					}
				}
			}
            //value > count_max ? value = count_max : '';
            
            $this.val(value);

        });
    
    /* счетчик количества товара */

    $document.on('click','.js-section-more',function (){
        let $this = $(this);
        let $wrap = $this.closest('[data-wrap-more]');
        let $contain = $this.closest('[data-contain-more]');

        $wrap.removeClass($wrap.removeClass($wrap.data('more-class')));
        $contain.remove();

    });

    $document.on('change','.js-file-input',function (){
        let $this = $(this);
        let $contain = $this.closest('[data-file-contain]');
        let $inputPseudo = $('[data-file-visible]',$contain);

        let classActive = $contain.data('file-class-active');
        let val = $this.val();
        let defaultText = $inputPseudo.data('file-visible-default');

        val = val.replace(/^.*[\\\/]/, '');

        if(!val) {
            $contain.removeClass(classActive);
            val = defaultText;
        } else {
            $contain.addClass(classActive);
        }

        $inputPseudo.text(val);

        return false;
    });
    
});

function initMainMap(map) {

    let styles = [
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }, { lightness: 17 }] },
        { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }, { lightness: 20 }] },
        { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }, { lightness: 17 }] },
        { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }] },
        { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }, { lightness: 18 }] },
        { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#ffffff" }, { lightness: 16 }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#f5f5f5" }, { lightness: 21 }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#dedede" }, { lightness: 21 }] },
        { elementType: "labels.text.stroke", stylers: [{ visibility: "on" }, { color: "#ffffff" }, { lightness: 16 }] },
        { elementType: "labels.text.fill", stylers: [{ saturation: 36 }, { color: "#333333" }, { lightness: 40 }] },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#f2f2f2" }, { lightness: 19 }] },
        { featureType: "administrative", elementType: "geometry.fill", stylers: [{ color: "#fefefe" }, { lightness: 20 }] },
        { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }] },
    ];


    let styledMap = new google.maps.StyledMapType(styles);

    objMaps[map] = new google.maps.Map(document.getElementById(map), {
        center: { lat: 54.5129344072161, lng: 36.26296925565047 },
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false
    });

    objMaps[map].mapTypes.set('map_style', styledMap);
    objMaps[map].setMapTypeId('map_style');

}

function helpBlockHide() {
    let $parent = $(this).parent();
    $parent.removeClass('has-error');
    $('.error',$parent).removeClass('error').removeAttr('style');
}

function showMessage(form,message) {
    let $message = $(message);
    if($message.data('status-error')) {
        form.prepend($message);
    } else {
        form.html($message);
    }
}

function removeOverlay() {
    $('.unit-overlay[data-remove-class]').remove();
}

function addOverlay($this,className) {
    let insertHtml = '<div class="unit-overlay js-overlay" data-remove-class="' + className + '"></div>';
    let $wrap = $this.parents('[data-overlay]');
    let $overlay = $('.unit-overlay[data-remove-class]');

    if($overlay.length < 1) {

        $wrap.length > 0 ? $wrap.after(insertHtml) : $this.after(insertHtml);
    } else {
        if($('.unit-overlay[data-remove-class="' + className + '"]').length < 1) {
            $html.removeClass($overlay.attr('data-remove-class'));
            $overlay.remove();
            addOverlay($this,className);
        } else {
            $overlay.remove();
        }
    }
}

function $_GET(param) {
    let lets = {};
    window.location.href.replace( location.hash, '' ).replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) { // callback
            lets[key] = value !== undefined ? value : '';
        }
    );

    if ( param ) {
        return lets[param] ? lets[param] : null;
    }
    return lets;
}

function setMarkers(map, locations) {

    let marker_icon = {
        url: "/assets/i/marker.svg",
        anchor: new google.maps.Point(32,51),
        scaledSize: new google.maps.Size(64,64)
    };

    let marker_inactive_icon = {
        url: "/assets/i/marker-inactive.svg",
        anchor: new google.maps.Point(32,51),
        scaledSize: new google.maps.Size(64,64)
    };

    let iw, currentIW;
    let $wrapAddr = $('[data-map-addr]');

    let closeIW = function(iw) {
        iw.close();
        google.maps.event.trigger(iw, 'closeclick');
    };

    let setCallbacks = function(marker, iw) {

        google.maps.event.addListener(marker, 'click', function() {
            if (currentIW) {
                closeIW(currentIW);
            }
            currentIW = iw;

            iw.open(objMaps[map], this);

            $('[data-marker-id]',$wrapAddr).prop("checked", false);
            $('[data-marker-id="' + marker.zIndex + '"]',$wrapAddr).prop("checked", true);
            marker.setIcon(marker_inactive_icon);
        });

        google.maps.event.addListener(iw, 'closeclick', function() {
            marker.setIcon(marker_icon);
            currentIW = null;
        });

    };

    let bounds = new google.maps.LatLngBounds();

    for (let i = 0; i < locations.length; i++) {
        tempMarkersArray[i] = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][0], locations[i][1]),
            map: objMaps[map],
            icon: marker_icon,
            zIndex: locations[i][2]
        });

        bounds.extend(tempMarkersArray[i].getPosition());

        let content_infoWindow =
            '<span class="gm-popover">' +
                '<span class="gm-popover__name">' + locations[i][3] + '</span>' +
                '<span class="gm-popover__working">' + locations[i][4] + '</span>' +
                (locations[i][5] ? '<span class="gm-popover__phone">' + locations[i][5] + '</span>' : '') +
            '</span>';

        iw = new google.maps.InfoWindow({
            content: content_infoWindow,
            pixelOffset: new google.maps.Size(0, 20),
            maxWidth: 245
        });


        setCallbacks(tempMarkersArray[i], iw);
    }

    $('.js-map-marker').on('change',function(){
        google.maps.event.trigger(tempMarkersArray[$(this).data('marker-id') - 1],'click');
    });

    if (locations.length > 1) objMaps[map].fitBounds(bounds);

}

function catalog_height() {

    if(windowWidth > 854) {

        let $catalog = $('#catalog');
        $catalog.css('min-height',$('[data-filters]',$catalog).outerHeight())
    }
}

function init_inp_styler(){

    if($.fn.styler) $('.js-inp-styled').styler();
}

function init_img_lazy(){

    if($.fn.lazy) {
        $('.js-lazy').lazy({
            afterLoad: afterLoadLazy,
        });

        if(windowWidth > 512){
            $('.js-lazy-desktop').lazy({
                afterLoad: afterLoadLazy,
            });

        } else {
            $('.js-lazy-mobile').lazy({
                afterLoad: afterLoadLazy,
            });

        }
    }

}

function afterLoadLazy(element){
    let classLoadRemove = element.data('class-load-remove');

    if(classLoadRemove) {
        element.parent().removeClass(classLoadRemove);
        element.removeAttr('data-class-load-remove');
    }
}

function init_mask(){

    if($.fn.mask) {
        let $inputs_tel = $('.js-mask-tel:not(.has-mask-init)');

        $inputs_tel.mask('+0 (000) 000-00-00',{
            translation: {
                'Z': {
                    pattern: /[0-9]/,
                    optional: true
                }
            },
            onKeyPress: function(val, e, field, options) {
                field.val(val.replace(/^\+8/, "+7"));
                if (val[1]=='9')
                    field.mask('+7 (000) 000-00-00', options);
                else if (field.data('mask').mask !='+0 (000) 000-00-00')
                    field.mask('+0 (000) 000-00-00', options);
            },
        });
        $inputs_tel.addClass('has-mask-init');

        $('.js-mask-date').mask('00.00.0000',{
            translation: {
                'Z': {
                    pattern: /[0-9]/,
                    optional: true
                }
            }
        });

    }

}

function init_validate() {

	$.formUtils.addValidator({
		name : 'size',
		validatorFunction : function(value, $el, config, language, $form) {
			//console.log($el,$el[0].files[0],$el.data('validation-max-size'));return;
			if (!value) return true;
			let file= $el[0].files[0];
			let maxsize = $el.data('validation-max-size');//5242880
			if (!file || !maxsize) return true;
			
			if(file.size<=maxsize){
				$el.parent().removeClass('error');
				return true;
			} else {
				$el.parent().addClass('error');
				return false;
			}
		},
		errorMessageKey: ''
	});

    if($.fn.validate) $.validate({
        validateOnBlur : false,
        scrollToTopOnError : false,
        borderColorOnError : false,
        errorMessagePosition: $('#help-block-hide'),
        onSuccess : function(form) {

            if(form.data('href-ajax')) {

                let UTM = '';
                let action = form.data('href-ajax');

                if($_GET('utm_source')) {
                    UTM = '&utm_source=' + $_GET('utm_source') + '&' +
                        'utm_medium=' + $_GET('utm_medium') + '&' +
                        'utm_campaign=' + $_GET('utm_campaign') + '&' +
                        'utm_content=' + $_GET('utm_content') + '&' +
                        'utm_term=' + $_GET('utm_term');
                }

                if(action == '/personal/') {
                    window.location.href = action;
                    return false;
                }

				if ($("input[type='file']", form).length)
				{
					let formData = form.serializefiles();
					$.ajax({
					    data: formData,
						async: false,
						cache: false,
						contentType: false,
						processData: false,
						type: form.attr('method') || 'POST',
						url: action,
						beforeSend: function(){
							form.addClass('unit-loader');
							if(action.search('callback') > 0) yaGoals__conver___callback();
						},
						success: function(data){
							form.removeClass('unit-loader');
							showMessage(form,data);
						}
					});
					return false;
				}

                $.ajax({
                    data: form.serialize() + UTM,
                    type: form.attr('method') || 'POST',
                    url: action,
                    beforeSend: function(){
                        form.addClass('unit-loader');
                        if(action.search('callback') > 0) yaGoals__conver___callback();
                    },
                    success: function(data){
                        form.removeClass('unit-loader');
                        showMessage(form,data);
                    }
                });

                return false;
            }
        }
    });

    $(document).on('focus','[data-validation]',helpBlockHide);
}

(function($) {
  $.fn.serializefiles = function() {
    let obj = $(this);
    /* ADD FILE TO PARAM AJAX */
    let formData = new FormData();
    $.each($("input[type='file']", obj), function(i, tag) {
      $.each($(tag)[0].files, function(i, file) {
        formData.append(tag.name, file);
      });
    });
    let params = $(obj).serializeArray();
    $.each(params, function (i, val) {
      formData.append(val.name, val.value);
    });
    return formData;
  };
})(jQuery);

/*
function init_bxSlider() {

    if($.fn.bxSlider) {

        let $offers_slider = $('.js-offer-slider');
        let $goods_slider = $('.js-goods-slide1r');
        let $product_slider = $('.js-product-mobi1le-slider');
        let touchEnabled = isTouch ? true : false;

        if($('[data-slide]',$offers_slider).length > 1) {

            $offers_slider.bxSlider({
                mode: 'fade',
                controls: false,
                auto: true,
                pause: 4000,
                touchEnabled: touchEnabled
            });
        }

        if($goods_slider.length) {

            goods_slider ? goods_slider.destroySlider() : '';

            let goods_view_count = 4;
            let goods_wrap_width = $goods_slider.outerWidth();
            let goods_wrap_procent = goods_wrap_width / 100;
            let goods_width = 23.5;
            let goods_margin = goods_wrap_procent * 2;
            windowWidth = $window.width();

            if(windowWidth < 1136) {
                goods_view_count = 3;
                goods_width = 32;
            }

            if(windowWidth < 800) {
                goods_view_count = 2;
                goods_width = 49;
            }

            goods_slider_setting = {
                pager: false,
                responsive: true,
                minSlides: goods_view_count,
                maxSlides: goods_view_count,
                moveSlides: 1,
                slideWidth: goods_wrap_procent * goods_width,
                slideMargin: goods_margin,
                infiniteLoop: false,
                touchEnabled: touchEnabled,
                nextText: "<span class=\"bx-controls-contain\"><svg class=\"bx-controls__icon horiz-vert-center\" viewBox=\"0 0 17 10\"> <path d=\"M16.4243 5.42427C16.6586 5.18995 16.6586 4.81005 16.4243 4.57574L12.6059 0.75736C12.3716 0.523046 11.9917 0.523046 11.7574 0.75736C11.523 0.991675 11.523 1.37157 11.7574 1.60589L15.1515 5L11.7574 8.39411C11.523 8.62843 11.523 9.00833 11.7574 9.24264C11.9917 9.47696 12.3716 9.47696 12.6059 9.24264L16.4243 5.42427ZM-5.24537e-08 5.6L16 5.6L16 4.4L5.24537e-08 4.4L-5.24537e-08 5.6Z\"></path> </svg></span>",
                prevText: "<span class=\"bx-controls-contain\"><svg class=\"bx-controls__icon horiz-vert-center\" viewBox=\"0 0 17 10\"> <path d=\"M16.4243 5.42427C16.6586 5.18995 16.6586 4.81005 16.4243 4.57574L12.6059 0.75736C12.3716 0.523046 11.9917 0.523046 11.7574 0.75736C11.523 0.991675 11.523 1.37157 11.7574 1.60589L15.1515 5L11.7574 8.39411C11.523 8.62843 11.523 9.00833 11.7574 9.24264C11.9917 9.47696 12.3716 9.47696 12.6059 9.24264L16.4243 5.42427ZM-5.24537e-08 5.6L16 5.6L16 4.4L5.24537e-08 4.4L-5.24537e-08 5.6Z\"></path> </svg></span>",
                onSlideAfter: function($slideElement,oldIndex,newIndex){
                    let $wrap = $slideElement.closest('.bx-wrapper');
                    let $control_next = $('.bx-next .bx-controls-contain',$wrap);
                    let $control_prev = $('.bx-prev .bx-controls-contain',$wrap);
                    let $parent = $slideElement.parent();
                    let sum_slides = $parent.children().length;
                    let $img = $('> *:eq(' + ($slideElement.index() +  goods_view_count - 1) + ') img[data-src]',$parent);

                    if($img.length) {
                        $img.lazy({afterLoad: afterLoadLazy});
                    }

                    sum_slides == newIndex + goods_view_count ? $control_next.addClass('bx-disabled') : $control_next.removeClass('bx-disabled');
                    newIndex == 0 ? $control_prev.addClass('bx-disabled') : $control_prev.removeClass('bx-disabled');

                },
                onSliderLoad: function(currentIndex){
                    let $this = $(this);
                    let $wrap = $this.closest('.bx-wrapper');
                    let $control_next = $('.bx-next .bx-controls-contain',$wrap);
                    let $control_prev = $('.bx-prev .bx-controls-contain',$wrap);
                    let sum_slides = $this.children().length;

                    currentIndex == sum_slides ? $control_next.addClass('bx-disabled') : $control_next.removeClass('bx-disabled');
                    currentIndex == 0 ? $control_prev.addClass('bx-disabled') : '';
                }
            }

            if($('[data-slide]',$goods_slider).length > goods_view_count) {

                goods_slider = $goods_slider.bxSlider(goods_slider_setting);

            }

        }

        if(windowWidth < 480){

            if($('[data-slide]',$product_slider).length > 1){

                $product_slider.bxSlider({
                    mode: 'fade',
                    controls: false,
                    pager: false,
                    infiniteLoop: false,
                    onSliderLoad: function (currentIndex){
                        let $this = $(this);

                        $this.after('<div class="bx-count"><div class="bx-count__slide bx-count__slide--current" data-slide-current>' + (currentIndex + 1) + '</div><div class="bx-count__slide--common">' + $('[data-slide]',$this).length + '</div></div>');
                    },
                    onSlideBefore: function ($slideElement,oldIndex,newIndex){

                        $('[data-slide-current]',$slideElement.closest('.bx-wrapper')).text(newIndex + 1)
                    }
                });

            }
        }
    }

}*/

function ordering_button_state($this) {
    let $contain = $this.closest('[data-step-contain]');
    let type = $contain.data('step');
    let $button = $('[data-step-current="' + type + '"]');
    let disabled = $button.data('button-class-disabled');

    switch (type) {
        case "contact_details":
            let input_count = $('input[data-validation]',$contain).length;
            let input_valid = 0;
            let str_finish = "";

            $('input[data-validation]',$contain).validate(function(valid) {
                if(valid) input_valid++;
            });

            if(input_valid == input_count) {
                $.each($('input[data-assembly-inp]',$contain),function(){

                    str_finish += $(this).val().length ?'<span class="b-item">' + $(this).val() + '</span>' : '';
                });
                $('[data-step-result]',$contain).html(str_finish);
                return true;
            }

            break;
        case "delivery":
			//if ($('input[name="address"]',$contain).length && $('input[name="address"]',$contain).val().length>10 || !$('input[name="address"]',$contain).length) {
            /*if($('[data-delivery-method-id]:checked',$contain).val().length > 10) {
                $button.removeClass(disabled);
                return true;
            } else {
                $button.addClass(disabled);
                return false;
            }*/
			if($('input[name="address"]',$contain).length==0)
			{
				$button.removeClass(disabled);
				return true;
			}
			else {
				if ($('input[name="address"]',$contain).val().length>=10 || ($this.attr('data-basket-address')!== undefined &&  $this.attr('data-basket-address').length>=10)) {
					$button.removeClass(disabled);
					return true;
				}
			}
			$button.addClass(disabled);
            return false;
				
            break;
        case "payment":
            if($('input:checked',$contain).length) {
                $button.removeClass(disabled);
                return true;
            } else {
                $button.addClass(disabled);
                return false;
            }
            break;
    }
}

function ordering_delivery_address(){
    let $this = $(this);
    let $contain = $this.closest('[data-step-contain]');
	if ($this.data('delivery-name') && $this.attr('data-basket-address') && $this.attr('data-basket-price'))
	{
		let str_finish = $this.data('delivery-name') + ', ' + $this.attr('data-basket-address') + ', ' + $this.attr('data-basket-price');

		$('[data-delivery-method-id="' + $this.data('delivery-method') + '"]',$contain).val(str_finish);
		$('[data-step-result]',$contain).text(str_finish);

		ordering_button_state($this);
	}
}

function customer_basket_control_step(type){
    let $customer_basket = $('[data-customer-basket]');
    let activeClass = $('[data-customer-step-active]',$customer_basket).data('customer-step-active');
    let completeClass = $('[data-customer-step-complete]',$customer_basket).data('customer-step-complete');
    let $customer_current_step = $('[data-customer-step="' + type + '"]',$customer_basket);

    $customer_current_step.removeClass(activeClass).addClass(completeClass);

    if($customer_current_step.next().length) $customer_current_step.next().addClass(activeClass);
}

function basket_items_calculation(items, sum) {
	if ($('[data-customer-basket]').length==0) return;
	let $customer_basket = $('[data-customer-basket]');
	let $basket_page = $customer_basket.closest('[data-basket-contain]');
	let $common_price = $('[data-common-price]',$customer_basket);
	let $goods_price_total = $('[data-goods-price-total]',$customer_basket);
	let goods_term = $('[data-goods-term]',$customer_basket).data('goods-term');
	
	$.each(items, function(id, item) {
		let $current_item=$('[data-item-id="'+id+'"]', $basket_page);

		if ($current_item.length)
		{
			let percent=0;
			if (item.DISCOUNT_PRICE>0)
				percent = Math.round((item.DISCOUNT_PRICE/(item.PRICE+item.DISCOUNT_PRICE))*100);
			if (parseInt(percent)>0)
			{
				$('.unit-price .unit-price__sum:eq(0)', $current_item).attr('data-discount', '-'+percent+'%');
				if ($('.unit-price .unit-price__old', $current_item).length==0)
				{
					$('.unit-price .unit-price__sum:eq(0)', $current_item).after('<div class="unit-price__old"><div class="unit-price__sum">'+(item.PRICE+item.DISCOUNT_PRICE)+' <span class="unit-ruble">руб.</span></div></div>');
				}
				else
				{
					$('.unit-price .unit-price__old .unit-price__sum', $current_item).text((item.PRICE+item.DISCOUNT_PRICE));
				}
			}
			else
			{
				$('.unit-price .unit-price__sum:eq(0)', $current_item).removeAttr('data-discount');
				$('.unit-price .unit-price__old', $current_item).remove();
			}
			$('.unit-price [data-price]', $current_item).data('price',item.PRICE).text(item.PRICE);
		}
	});
	$goods_price_total.text(sum).data('goods-price-total',sum);
	$common_price.text(sum);
}
function basket_product_calculations() {

    let $customer_basket = $('[data-customer-basket]');
    let $basket_page = $customer_basket.closest('[data-basket-contain]');
    let $goods_count = $('[data-goods-count]',$customer_basket);
    let $goods_price_total = $('[data-goods-price-total]',$customer_basket);
    let $common_price = $('[data-common-price]',$customer_basket);
    let $btn_main = $('[data-btn-main]',$customer_basket);
    let goods_term = $('[data-goods-term]',$customer_basket).data('goods-term');
    let goods_count = 0;
    let goods_price_total = 0;
	let availability=true;
	let $availability_term=$('[data-availability]');
	let term=true;

    let $goods = $('[data-product-contain]');

    $.each($goods,function(){
        let $this = $(this);
        let product_count = parseInt($('[data-product-count]',$this).val());
        goods_count += parseInt($('[data-product-count]',$this).val());
        goods_price_total += parseFloat($('[data-price]',$this).data('price')) * product_count;
		if ($this.is('.unit-basket-page__list-item--availability'))
			availability=false;

    });


    $goods_count.text(goods_count).data('goods-count',goods_count);
    //$goods_price_total.text(goods_price_total.toFixed(2)).data('goods-price-total',goods_price_total.toFixed(2));
    //$common_price.text(goods_price_total.toFixed(2));

    if(goods_price_total >= goods_term) {
        $btn_main.removeClass($btn_main.data('btn-class-lock'));
        $customer_basket.removeClass($customer_basket.data('customer-class-lock'));
		term=true;
    } else {
        $btn_main.addClass($btn_main.data('btn-class-lock'));
        $customer_basket.addClass($customer_basket.data('customer-class-lock'));
		term=false;
    }
	$availability_term.data('availability', availability ? 'true' : 'false');
	//console.log(availability);
	if (availability)
	{
		$availability_term.hide();
		if (term)
			$btn_main.removeClass($btn_main.data('btn-class-lock'));
	}
	else
	{
		$availability_term.show();
		$btn_main.addClass($btn_main.data('btn-class-lock'));
	}

    if(goods_count == 0) {
        $basket_page.addClass('unit-basket-page--basket-empty');
        $('.js-basket-check',$customer_basket).trigger('click');
    }

}

function styleWidthScrollbar() {

    let div = document.createElement('div');

    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';

    document.body.append(div);
    let scrollWidth = div.offsetWidth - div.clientWidth;

    div.remove();

    $('head',$('html')).append('<style class="style-scrollbar">.compensate-for-scrollbar {margin-right: '+ scrollWidth + 'px;}</style>');
    $('body').addClass('compensate-for-scrollbar');

}

function styleWidthScrollbarClear() {

    $('style.style-scrollbar',$document).remove();
    $('body').removeClass('compensate-for-scrollbar');
}

function init_fancybox() {

    console.log('1');
    $('.js-popup',$document).fancybox(settingPopup);
}

function RedirectLK(s=10000)
{
	let profile='/personal/private/';
	let lk='/personal/';
	if (window.location.href!=profile)
		setTimeout( 'location="'+profile+'";', s );
}
/* goals */

    function yaGoals__conver___callback() {
        if(typeof yaCounter73578868 !== "undefined") {
		yaCounter73578868.reachGoal('callback');
		}
    }

    function yaGoals__conver___ordering() {
		if(typeof yaCounter73578868 !== "undefined") {
        yaCounter73578868.reachGoal('ordering');
		}
    }

/* goals */