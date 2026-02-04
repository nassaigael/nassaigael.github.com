// Preloader
$(document).ready(function () {
    const style = document.createElement('style');
    style.textContent = `
        .dot:nth-child(1) { --deg: 0deg; }
        .dot:nth-child(2) { --deg: 45deg; }
        .dot:nth-child(3) { --deg: 90deg; }
        .dot:nth-child(4) { --deg: 135deg; }
        .dot:nth-child(5) { --deg: 180deg; }
        .dot:nth-child(6) { --deg: 225deg; }
        .dot:nth-child(7) { --deg: 270deg; }
        .dot:nth-child(8) { --deg: 315deg; }
    `;
    document.head.appendChild(style);

    setTimeout(function () {
        $('.wrapper').addClass('loaded');

        setTimeout(function () {
            $('#loader-wrapper').css('display', 'none');
        }, 1000);
    }, 2500);
});

var tabs = document.getElementById('icetab-container').children;
var tabs2 = document.getElementById('icetab-container2').children;
var tabcontents = document.getElementById('icetab-content').children;

const syncActiveTabs  = (activeIndex) => {
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].className = 'icetab';
        tabs2[i].className = 'icetab';
    }

    if (tabs[activeIndex]) tabs[activeIndex].classList.add('current-tab');
    if (tabs2[activeIndex]) tabs2[activeIndex].classList.add('current-tab');
}

const mybtn = function () {
    var tabchange = this.mynum;

    for (var int = 0; int < tabcontents.length; int++) {
        tabcontents[int].className = 'tabcontent';
        tabcontents[tabchange].classList.add('tab-active');
    }

    syncActiveTabs(tabchange);
}

var mybtn2 = function () {
    var tabchange = this.mynum;
    
    for (var int = 0; int < tabcontents.length; int++) {
        tabcontents[int].className = 'tabcontent';
        tabcontents[tabchange].classList.add('tab-active');
    }
    
    syncActiveTabs(tabchange);
    
    closeNav(300);
}

for (var index = 0; index < tabs2.length; index++) {
    tabs2[index].mynum = index;
    tabs2[index].addEventListener('click', function(e) {
        e.preventDefault();
        mybtn2.call(this);
    }, false);
}

// Portfolio click from home
const elements = document.getElementById("portfolio");
const homeNavabr = document.getElementById("home");
const circular_imgClick = document.getElementsByClassName("circular_text_main");

if (circular_imgClick.length > 0) {
    circular_imgClick[0].addEventListener("click", () => {
        for (var int = 0; int < tabcontents.length; int++) {
            tabcontents[int].className = 'tabcontent';
        }
        homeNavabr.classList.remove("tab-active");
        elements.classList.add("tab-active");

        syncActiveTabs(5);
    });
}

// Portfolio Pop-up
$(".pop-up").on("click", function () {
    $(".overlay").addClass("is-on");
});

$("#close").on("click", function () {
    $(".overlay").removeClass("is-on");
});

// Share Btn
$(document).ready(function () {
    $(".share-btn").click(function (e) {
        $('.networks-5').not($(this).next(".networks-5")).each(function () {
            $(this).removeClass("active");
        });
        $(this).next(".networks-5").toggleClass("active");
    });
});

// Testimonial Card Slider
$(function () {
    $('.testimonials_card').on('init', function (event, slick) {
        $(this).append('<div class="slick-counter"><span class="current"></span> / <span class="total"></span></div>');
        $('.current').text(slick.currentSlide + 1);
        $('.total').text(slick.slideCount);
    })
        .slick({
            autoplay: true,
            autoplaySpeed: 3000,
            infinite: true,
            arrows: true,
            prevArrow: '<span class="prev-arrow"><i class="ri-arrow-left-s-line"></i></span>',
            nextArrow: '<span class="next-arrow"><i class="ri-arrow-right-s-line"></i></span>',
        })
        .on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            $('.current').text(nextSlide + 1);
        });
});

// View More View Less btn
$(document).ready(function () {
    $("#toggle").click(function () {
        var elem = $("#toggle").text();
        if (elem == "View More") {
            $("#toggle").text("View Less");
            $("#text").slideDown();
        } else {
            $("#toggle").text("View More");
            $("#text").slideUp();
        }
    });
});

// blog Page Pop Up
$(document).ready(function () {
    $('.trigger').click(function () {
        $('.modal-wrapper').toggleClass('open');
        $('.page-wrapper').toggleClass('blur');
        return false;
    });
});

// blog_pop_up_slider
$(function () {
    $('.blog_pop_up_slider').slick({
        infinity: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: false,
        arrows: false,
        prevArrow: '<span class="prev-btn"><i class="fa-solid fa-arrow-left"></i> Prev </span>',
        nextArrow: '<span class="next-btn"> Next <i class="fa-solid fa-arrow-right"></i> </span>',
        responsive: [
            {
                breakpoint: 645,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: true,
                    arrows: false,
                }
            }
        ]
    });
});

// form
$('input').focus(function () {
    $(this).parent().addClass('active');
    $('input').focusout(function () {
        if ($(this).val() == '') {
            $(this).parent().removeClass('active');
        } else {
            $(this).parent().addClass('active');
        }
    })
});

// Side navigation functions
const openNav = () => {
    let side = document.getElementById("mySidenav");
    let toggle = document.querySelector(".toggle");
    side.style.width = "300px";
    toggle.style.display = "none";
    document.querySelector(".closebtn").style.display = "block";
}

// MODIFIEZ cette fonction pour NE PAS fermer automatiquement
const closeNav = (delay = 0) => {
    setTimeout(() => {
        var side = document.getElementById("mySidenav");
        var toggle = document.querySelector(".toggle");
        side.style.width = "0";
        toggle.style.display = "flex";
        document.querySelector(".closebtn").style.display = "none";
    }, delay);
}


// Cursor
let cursor = document.querySelector('.cursor');
let cursorScale = document.querySelectorAll('a,button,.pop-up,.trigger,.share,#close,.toggle,#vimeo,#youtube,.link,.gallery');
let mouseX = 0;
let mouseY = 0;

if (cursor) {
    gsap.to({}, 0.016, {
        repeat: -1,
        onRepeat: function () {
            gsap.set(cursor, {
                css: {
                    left: mouseX,
                    top: mouseY,
                }
            })
        }
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    cursorScale.forEach(link => {
        link.addEventListener('mousemove', () => {
            cursor.classList.add('grow');
            if (link.classList.contains('small')) {
                cursor.classList.remove('grow');
                cursor.classList.add('grow-small');
            }
        });

        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('grow');
            cursor.classList.remove('grow-small');
        });
    });
}

// Whole Page Scrolling Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});
const hiddenElements = document.querySelectorAll('.fade_up');
hiddenElements.forEach((el) => observer.observe(el));

// Gallery code
window.addEventListener("load", () => {
    for (let i of document.querySelectorAll(".gallery img")) {
        i.onclick = () => i.classList.toggle("full");
    }
});

// Skill bar function
$(function () {
    $('.circlechart').circlechart();
});

document.addEventListener('DOMContentLoaded', function () {
    const activeTab = document.querySelector('.tabcontent.tab-active');
    if (activeTab) {
        const tabContents = document.querySelectorAll('.tabcontent');
        let activeIndex = -1;

        for (let i = 0; i < tabContents.length; i++) {
            if (tabContents[i] === activeTab) {
                activeIndex = i;
                break;
            }
        }

        if (activeIndex !== -1) {
            syncActiveTabs(activeIndex);
        }
    }
});