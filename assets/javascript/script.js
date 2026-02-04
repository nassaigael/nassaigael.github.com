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

// Navigation system 
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.getElementById('icetab-container')?.children || [];
    const tabs2 = document.getElementById('icetab-container2')?.children || [];
    const tabcontents = document.getElementById('icetab-content')?.children || [];
    
    console.log('Navigation initialized:', {
        tabs: tabs.length,
        tabs2: tabs2.length,
        tabcontents: tabcontents.length
    });

    const syncActiveTabs = (activeIndex) => {
        console.log('Syncing active tab:', activeIndex);
        
        for (let i = 0; i < Math.max(tabs.length, tabs2.length); i++) {
            if (tabs[i]) tabs[i].className = 'icetab';
            if (tabs2[i]) tabs2[i].className = 'icetab';
        }

        if (tabs[activeIndex]) {
            tabs[activeIndex].classList.add('current-tab');
            console.log('Added current-tab to sidebar tab:', activeIndex);
        }
        if (tabs2[activeIndex]) {
            tabs2[activeIndex].classList.add('current-tab');
            console.log('Added current-tab to sidenav tab:', activeIndex);
        }
    }

    const mybtn = function (e) {
        if (e) e.preventDefault();
        const tabchange = this.mynum;
        
        console.log('Sidebar click - tab:', tabchange);

        for (let int = 0; int < tabcontents.length; int++) {
            tabcontents[int].className = 'tabcontent';
        }
        
        if (tabcontents[tabchange]) {
            tabcontents[tabchange].classList.add('tab-active');
            console.log('Activated content:', tabcontents[tabchange].id);
        }

        syncActiveTabs(tabchange);
    }

    const mybtn2 = function (e) {
        if (e) e.preventDefault();
        const tabchange = this.mynum;
        
        console.log('Sidenav click - tab:', tabchange);

        for (let int = 0; int < tabcontents.length; int++) {
            tabcontents[int].className = 'tabcontent';
        }
        
        if (tabcontents[tabchange]) {
            tabcontents[tabchange].classList.add('tab-active');
            console.log('Activated content:', tabcontents[tabchange].id);
        }

        syncActiveTabs(tabchange);
        
        setTimeout(() => {
            closeNav();
        }, 300);
    }

    if (tabs.length > 0) {
        for (let index = 0; index < tabs.length; index++) {
            tabs[index].mynum = index;
            
            const oldTab = tabs[index];
            const newTab = oldTab.cloneNode(true);
            oldTab.parentNode.replaceChild(newTab, oldTab);
            
            newTab.mynum = index;
            newTab.addEventListener('click', function(e) {
                mybtn.call(this, e);
            }, false);
            
            tabs[index] = newTab;
        }
        console.log('Sidebar listeners added:', tabs.length);
    }

    if (tabs2.length > 0) {
        for (let index = 0; index < tabs2.length; index++) {
            tabs2[index].mynum = index;
            
            const oldTab = tabs2[index];
            const newTab = oldTab.cloneNode(true);
            oldTab.parentNode.replaceChild(newTab, oldTab);
            
            newTab.mynum = index;
            newTab.addEventListener('click', function(e) {
                mybtn2.call(this, e);
            }, false);
            
            tabs2[index] = newTab;
        }
        console.log('Sidenav listeners added:', tabs2.length);
    }

    const elements = document.getElementById("portfolio");
    const homeNavabr = document.getElementById("home");
    const circular_imgClick = document.getElementsByClassName("circular_text_main");

    if (circular_imgClick.length > 0 && elements && homeNavabr) {
        circular_imgClick[0].addEventListener("click", () => {
            console.log('Portfolio circle clicked');
            
            for (let int = 0; int < tabcontents.length; int++) {
                tabcontents[int].className = 'tabcontent';
            }
            homeNavabr.classList.remove("tab-active");
            elements.classList.add("tab-active");

            syncActiveTabs(5);
        });
    }

    if (tabcontents.length > 0) {
        let activeIndex = -1;
        
        for (let i = 0; i < tabcontents.length; i++) {
            if (tabcontents[i].classList.contains('tab-active')) {
                activeIndex = i;
                break;
            }
        }
        
        if (activeIndex === -1) {
            activeIndex = 0;
            tabcontents[0].classList.add('tab-active');
        }
        
        syncActiveTabs(activeIndex);
        console.log('Initial active tab:', activeIndex, tabcontents[activeIndex]?.id);
    }
});

// Portfolio Pop-up
$(document).ready(function() {
    $(".pop-up").on("click", function () {
        $(".overlay").addClass("is-on");
    });

    $("#close").on("click", function () {
        $(".overlay").removeClass("is-on");
    });
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
$(document).ready(function() {
    $('input').focus(function () {
        $(this).parent().addClass('active');
    });
    
    $('input').focusout(function () {
        if ($(this).val() == '') {
            $(this).parent().removeClass('active');
        } else {
            $(this).parent().addClass('active');
        }
    });
});

// Side navigation functions
const openNav = () => {
    let side = document.getElementById("mySidenav");
    let toggle = document.querySelector(".toggle");
    if (side && toggle) {
        side.style.width = "300px";
        toggle.style.display = "none";
        const closeBtn = document.querySelector(".closebtn");
        if (closeBtn) closeBtn.style.display = "block";
    }
}

const closeNav = () => {
    var side = document.getElementById("mySidenav");
    var toggle = document.querySelector(".toggle");
    if (side && toggle) {
        side.style.width = "0";
        toggle.style.display = "flex";
        const closeBtn = document.querySelector(".closebtn");
        if (closeBtn) closeBtn.style.display = "none";
    }
}

// Cursor
document.addEventListener('DOMContentLoaded', function() {
    let cursor = document.querySelector('.cursor');
    let cursorScale = document.querySelectorAll('a,button,.pop-up,.trigger,.share,#close,.toggle,#vimeo,#youtube,.link,.gallery');
    let mouseX = 0;
    let mouseY = 0;

    if (cursor && typeof gsap !== 'undefined') {
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
});

// Whole Page Scrolling Animation
document.addEventListener('DOMContentLoaded', function() {
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
});

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
