function screen_update(){
    const width = $(window).width();
    if(width<1300){
        $('.active-thread-profile').hide();
        $('.active-thread-option:eq(1)').addClass('enabled');
        $('.active-thread-profile').addClass('mobile');
        $('.atp-mobile').show();
        $('.thread-profile-summary').addClass('zoom');
    
        }
        else{
        $('.active-thread-profile').show();
        $('.active-thread-option:eq(1)').removeClass('enabled');
        $('.active-thread-profile').removeClass('mobile');
        $('.atp-mobile').hide();   
        $('.thread-profile-summary').removeClass('zoom');   
        }

}

    
    
    $(".active-thread-option:eq(1)").on('click',function(){
    if($('.active-thread-option:eq(1)').hasClass('enabled')){
    $('.active-thread-profile').addClass('mobile');
    $('.atp-mobile').show();
    $('.active-thread-profile').show();
    $('.thread-profile-summary').addClass('zoom');
    }
    });

    $('.close-btn').on('click',function(){
        $('.active-thread-profile').hide();
        $('.active-thread-profile').removeClass('mobile');
        $('.thread-profile-summary').removeClass('zoom');
        $('.atp-mobile').hide();
    });




    $('.profile-section-option').on('click',function(){
    $(this).parent('.profile-section-tile').find('.profile-section-res').slideToggle();
    $(this).parent('.profile-section-tile').find('.profile-section-btn i').toggleClass('roto-180');
        
    });