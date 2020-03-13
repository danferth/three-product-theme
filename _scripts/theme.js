//go nuts!


//doc ready
$(document).ready(function(){


//more button on product template to see more of the description
var prodID = $('.product_description').attr('data-description');
var moreID = $('.product_description_more').attr('data-more');

$('.product_description_more').on('click', function(e){
    if(prodID === moreID){
        if($('.product_description_more i').hasClass('fa-arrow-alt-circle-down')){
            $('.product_description').css({
                'overflow' : 'visible',
                'height' : 'auto'});

            $('.product_description_more i')
            .removeClass('fa-arrow-alt-circle-down')
            .addClass('fa-arrow-alt-circle-up')
            .siblings('.moreLess').html('less');
        }else{
            $('.product_description').css({
                'overflow' : 'hidden',
                'height' : 20 + 'rem'});

            $('.product_description_more i')
            .removeClass('fa-arrow-alt-circle-up')
            .addClass('fa-arrow-alt-circle-down')
            .siblings('.moreLess').html('more');
        }
    }
});

// product page images swap
var productMainsrc = $('.product_main_featured_img').attr('src');

var backToMainImg = function(mainSrc){
        $('.product_main_featured_img').attr('src', mainSrc);
};

$('.product_main_featured_img').on('click', function(){
    backToMainImg(productMainsrc);
});

$('.product_main_sub_img').on('click', function(e){
    var source = $(this).attr('data-largesrc');
    $('.product_main_featured_img').attr('src', source);
});


}); //END Doc.ready
