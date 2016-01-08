$(document).ready(function() {


    var accordion = {
        config: {
            fireSelector: '[data-toggle]',
            contentSelector: '.accordion-content',
            openClass: 'open',
            animate: true,
            duration: 300,
            easing: 'ease'
        },
        init: function(config) {
            $.extend(accordion.config, config);
            $(accordion.config.fireSelector).on('click', function(e) {
                var $activeTarget = $(this).parent();
                if ($activeTarget.hasClass(accordion.config.openClass)) {
                    accordion.close($activeTarget);
                    return;
                }
                accordion.open($activeTarget);
            });
        },
        open: function($openSelector) {
            if (accordion.config.animate) {
                var $content = $openSelector.children(accordion.config.contentSelector);
                $content.slideDown(accordion.config.duration);
                $openSelector.addClass(accordion.config.openClass);
                return;
            }
            $openSelector.toggleClass('open');
        },
        close: function($closeSelector) {
            if (accordion.config.animate) {
                var $content = $closeSelector.children(accordion.config.contentSelector);
                $content.slideUp(accordion.config.duration);
                $closeSelector.removeClass(accordion.config.openClass);
                return;
            }
            $closeSelector.toggleClass('open');
        }
    };

    accordion.init();

    // tabbed content
    $(".tabContainer-content").hide();
    $(".tabContainer-content:first").show();

    // if in tab mode
    $("ul.tabs li").click(function() {

        $(".tabContainer-content").hide();
        var activeTab = $(this).attr("rel");
        $("#" + activeTab).fadeIn();

        $("ul.tabs li").removeClass("active");
        $(this).addClass("active");

        $(".tabContainer-drawerHeading").removeClass("d_active");
        $(".tabContainer-drawerHeading[rel^='" + activeTab + "']").addClass("d_active");

    });
    // if in accordion mode
    $(".tabContainer-drawerHeading").click(function() {

        $(".tabContainer-content").hide();
        var d_activeTab = $(this).attr("rel");
        $("#" + d_activeTab).fadeIn();

        $(".tabContainer-drawerHeading").removeClass("d_active");
        $(this).addClass("d_active");

        $("ul.tabs li").removeClass("active");
        $("ul.tabs li[rel^='" + d_activeTab + "']").addClass("active");
    });

    /* Extra class "tab_last"
       to add border to right side
       of last tab */
    $('ul.tabs li').last().addClass("tab_last");


// Off Canvas
// Show the off-canvas navigation

var hamburger = $('#hamburger-icon')

hamburger.click(function(){
    hamburger.toggleClass('active');
    return false;
    });

hamburger.click(function() {
    $('#offCanvas').toggleClass('offCanvas-show');
});

// Hide the off-canvas nav when clicking a link
$('#offCanvas').find('a').on('click', function(e) {
    $('#offCanvas').removeClass('offCanvas-show');
});

// Multi Level
$('body').addClass('js');
          var $menu = $('#menu'),
              $menulink = $('.menu-link'),
              $menuTrigger = $('.has-subnav > a');

        $menulink.click(function(e) {
            e.preventDefault();
            $menulink.toggleClass('active');
            $menu.toggleClass('active');
        });

        $menuTrigger.click(function(e) {
            e.preventDefault();
            var $this = $(this);
            $this.toggleClass('active').next('ul').toggleClass('active');
        });


    //thumbNav menu
    $('.thumbNav i').on('click', function(){
        var $nav = $(this).closest('.thumbNav'),
            width = $(window).width(0),
            height = $nav.find('ul').height();

        $nav.toggleClass('active')
            .css({
                'width': width,
                'height': height
            });

        if(!$nav.hasClass('active'))
            $($nav).removeAttr('style');

        $('.iconSprite').append($('.iconSprite i:first-child'));
    });


// Modal
    var modalTrigger = $(".modal-trigger");
    var modalOverlay = $('.modal-overlay');

    modalTrigger.click(function() {
        var Type = $(this).data("modal-type");
        $("#" + Type).css('z-index', '999');
        $('html').addClass('modal-active');
    });

    modalOverlay.click(function() {
        $('html').removeClass('modal-active');
        setTimeout(function() {
            $('.modal').css('z-index', '-999')
        }, 500);
    });


});
