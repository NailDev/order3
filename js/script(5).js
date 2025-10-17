document.addEventListener("DOMContentLoaded", function ( event ) {

	init_img_lazy();
	var params = window
	.location
	.search
	.replace('?','')
	.split('&')
	.reduce(
		function(p,e){
			var a = e.split('=');
			p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
			return p;
		},
		{}
	);
	
	let forCount=params['PAGEN_1']-1;


});



window.addEventListener( "pageshow", function ( event ) {
var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
if ( historyTraversal ) {
	init_img_lazy();




var params = window
.location
.search
.replace('?','')
.split('&')
.reduce(
	function(p,e){
		var a = e.split('=');
		p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
		return p;
	},
	{}
);

let forCount=params['PAGEN_1']-1;

}
});



BX.addCustomEvent('onComponentAjaxHistorySetState', function()
{
init_img_lazy();

});

function ShowBasketButton(cnt, id, product_id, $this)
{
	 var $contain = $this.closest('[data-contain-main]');
	 if (cnt>0)
		$contain.addClass($contain.data('count-visible'));
	else
		$contain.removeClass($contain.data('count-visible'));
	$('#quantity_'+product_id).data('id', id).val(cnt);
}
$(document).ready(function(){




//Добавление
	$("body").on( "click", ".js-add-in-basket", function() {
		var $this = $(this);
		var id=$this.attr('id');
		var cnt=$('#quantity_'+id).val();
		if (cnt<=0) cnt=1;
		//if (cnt>0)
		//{
			$.ajax({
				type: "POST",
				dataType:"json",
				url: "/ajax/add_basket.php",
				data: {"id":id,action:'add', "kol":cnt}
				}).done(function(msg) {
					$('.js_small_header').html(msg.html);
					$('.b-widget-basket').html(msg.html2);
					
					cnt=msg.quantity;
					ShowBasketButton(cnt, msg.id, id, $this);
					basket_items_calculation(msg.items, msg.sum);
					
				});
		//}
		//return false;
	});

//Удаление
$('body').on('click', '.delete_basket', function() {
	let id=$(this).attr('data-id');
	$.ajax({
		type: "POST",
		dataType:"json",
		url: "/ajax/add_basket.php",
		data: {id:id,action:'delete'}
	}).done(function(msg){

			$('.js_small_header').html(msg.html);
			$('.b-widget-basket').html(msg.html2);
			
			basket_items_calculation(msg.items, msg.sum);
			if($('.unit-helpers__list-item').attr('data-count') == 0){
				document.location.reload();
			}

		});
	//return false;
});




function init_img_lazy(){

	if($.fn.lazy) {
		$('.js-lazy').lazy({
			afterLoad: afterLoadLazy,
		});
	}

}
function afterLoadLazy(element){
	var classLoadRemove = element.data('class-load-remove');

	if(classLoadRemove) {
		element.parent().removeClass(classLoadRemove);
		element.removeAttr('data-class-load-remove');
	}
}

var inProgress = false;
$(window).scroll(function() {
	let top= 0 ;
	if($('.load_more').offset()){
		top=$('.load_more').offset().top;
	}	
	if($(window).scrollTop()  >= parseInt(top - 500) && !inProgress) {
		var targetContainer = $('.catalog_list'),          //  Контейнер, в котором хранятся элементы
		url =  $('.load_more').attr('data-url');    //  URL, из которого будем брать элементы
		if (url !== undefined) {
			var type = $('.load_more').attr('data-type'); 
			$('.load_more').addClass('unit-pagination-custom--load');
//$('.preloader_bl').show();
			inProgress = true;
//$('.unit-pagination-custom').addClass('.unit-pagination-custom--load');
			$.ajax({
				type: 'POST',
				url: url,
				data: { ajax23 : 'y' },
				dataType: 'html',
				success: function(data){
					//  Удаляем старую навигацию
					$('.load_more').remove();
					if(type == 'search'){

						var targetContainer = $('.catalog_list');
						var elements = $(data).find('.catalog_item'),  //  Ищем элементы
							pagination = $(data).find('.load_more');//  Ищем навигацию
					}else{ 
						var targetContainer = $('.catalog_list');
						var elements = $(data).find('.catalog_item'),  //  Ищем элементы
							pagination = $(data).find('.load_more');//  Ищем навигацию
					}
						targetContainer.append(elements);   //  Добавляем посты в конец контейнера
						$('.after_nav').append(pagination); //  добавляем навигацию следом

					init_img_lazy();
					if($( window ).width()>'837'){
						$('.unit-filters').theiaStickySidebar();
					}
					
					
					window.history.pushState("", "", url);


					inProgress = false;
					$('.load_more').removeClass('unit-pagination-custom—load');
				}
			});
		}

	}
});






//doc
});