document.addEventListener("DOMContentLoaded", function ( event ) {

	init_img_lazy();
	let params = window
	.location
	.search
	.replace('?','')
	.split('&')
	.reduce(
		function(p,e){
			let a = e.split('=');
			p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
			return p;
		},
		{}
	);
	
	let forCount=params['PAGEN_1']-1;


});



window.addEventListener( "pageshow", function ( event ) {
let historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
if ( historyTraversal ) {
	init_img_lazy();




let params = window
.location
.search
.replace('?','')
.split('&')
.reduce(
	function(p,e){
		let a = e.split('=');
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
	 let $contain = $this.closest('[data-contain-main]');
	 if (cnt>0)
		$contain.addClass($contain.data('count-visible'));
	else
		$contain.removeClass($contain.data('count-visible'));
	$('#quantity_'+product_id).data('id', id).val(cnt);
}
$(document).ready(function(){





	$("body").on( "click", ".js-add-in-basket", function() {
		let $this = $(this);
		let id=$this.attr('id');
		let cnt=$('#quantity_'+id).val();
		if (cnt<=0) cnt=1;

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
		
	});


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
	
});




function init_img_lazy(){

	if($.fn.lazy) {
		$('.js-lazy').lazy({
			afterLoad: afterLoadLazy,
		});
	}

}
function afterLoadLazy(element){
	let classLoadRemove = element.data('class-load-remove');

	if(classLoadRemove) {
		element.parent().removeClass(classLoadRemove);
		element.removeAttr('data-class-load-remove');
	}
}

let inProgress = false;
$(window).scroll(function() {
	let top= 0 ;
	if($('.load_more').offset()){
		top=$('.load_more').offset().top;
	}	
	if($(window).scrollTop()  >= parseInt(top - 500) && !inProgress) {
		let targetContainer = $('.catalog_list'),          
		url =  $('.load_more').attr('data-url');    
		if (url !== undefined) {
			let type = $('.load_more').attr('data-type'); 
			$('.load_more').addClass('unit-pagination-custom--load');

			inProgress = true;

			$.ajax({
				type: 'POST',
				url: url,
				data: { ajax23 : 'y' },
				dataType: 'html',
				success: function(data){
					
					$('.load_more').remove();
					if(type == 'search'){

						let targetContainer = $('.catalog_list');
						let elements = $(data).find('.catalog_item'),  
							pagination = $(data).find('.load_more');
					}else{ 
						let targetContainer = $('.catalog_list');
						let elements = $(data).find('.catalog_item'), 
							pagination = $(data).find('.load_more');
					}
						targetContainer.append(elements);   
						$('.after_nav').append(pagination); 

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






});