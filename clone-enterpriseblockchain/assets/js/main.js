// GSAP 기본 설정
gsap.defaults({
  duration: 1,
  ease: "none"
});

// 헤더nav 언어선택 클릭이벤트
$('.btn-lang').click(function (e) {
  e.preventDefault();
  const langList = $(this).siblings('.lang-list');

  if (langList.hasClass('show')) {
    langList.removeClass('show');
  } else {
    langList.addClass('show');
  }
});
// 스크롤시 언어선택 서브메뉴 사라짐
$(window).on('scroll', function () {
  $('.lang-list').removeClass('show');
});


// TOP버튼 show 제어
let lastScroll = 0;
$(window).scroll(function () {
  const curr = $(this).scrollTop();
  const viewHeight = window.innerHeight;

  if ($('.fix-btn').hasClass('stop')) {
    $('.fix-btn').addClass('show');
  } else if (curr < viewHeight * 8 || curr > lastScroll) {
    $('.fix-btn').removeClass('show');
  } else {
    $('.fix-btn').addClass('show');
  }
  lastScroll = curr;
});

// TOP 버튼 특정 영역에서 absolute로 변환 
ScrollTrigger.create({
  trigger: '.sc-ground',
  start: 'bottom bottom',
  end: 'bottom bottom',
  // markers: true,
  onEnter: () => {
    $('.fix-btn').addClass('stop');
  },
  onLeaveBack: () => {
    $('.fix-btn').removeClass('stop');
  },
});

// TOP버튼 이벤트
$('.fix-btn').click(function () {
  gsap.to(window, { duration: 1, scrollTo: 0 });
});


// intro-1 애니메이션
const animaIntro1 = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-intro .content-inner1',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    // markers: true,

    onLeave: () => {
      gsap.to('.sc-intro .content-inner1 .ic-scroll', {
        opacity: 0,
        duration: 0.05,
      });
    },
    onEnterBack: () => {
      gsap.to('.sc-intro .content-inner1 .ic-scroll', {
        opacity: 1,
        duration: 0.05,
      });
    },
  }
});


animaIntro1
  .to(".sc-intro .content-inner1 .text-area .desc:nth-child(1)", {
    opacity: 1,
  })
  .to(".sc-intro .content-inner1 .sticky-content", {
    '--before-opacity': 1,
  }, '<')
  .to(".sc-intro .content-inner1 .text-area .desc:nth-child(1)", {
    opacity: 0,
    onStart: () => { $('#header').addClass('show') },
    onReverseComplete: () => { $('#header').removeClass('show') },
  })
  .to(".sc-intro .content-inner1 .text-area .desc:nth-child(2)", {
    opacity: 1,
    yoyo: true,
    repeat: 1,
  })
  .to(".sc-intro .content-inner1 .text-area .desc:nth-child(3)", {
    opacity: 1,
    yoyo: true,
    repeat: 1,
  }, '+=0.5')
  .to(".sc-intro .content-inner1 .text-area .desc:nth-child(4)", {
    opacity: 1,
  })
  .to({}, { duration: 1 });




// intro-2 애니메이션
const imgContaner = gsap.utils.toArray('.sc-intro .content-inner2 .img-container');

const animaIntro2 = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-intro .content-inner2',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    // markers: true,
    invalidateOnRefresh: true,
  }
});


animaIntro2
  .to(".sc-intro .content-inner2 .text-area .desc:nth-child(1)", {
    opacity: 1,
  })
  .to(".sc-intro .content-inner2 .sticky-content", {
    '--before-opacity': 1,
  }, '<')
  .to(".sc-intro .content-inner2 .sticky-content", {
    '--before-opacity': 0,
  })
  .to(".sc-intro .content-inner2 .text-area .desc:nth-child(1)", {
    opacity: 0,
  }, '<')
  .to(".sc-intro .content-inner2 .text-area .desc:nth-child(1) .text:nth-child(1)", {
    xPercent: 100,
    duration: 0.5,
  }, '<')
  .to(".sc-intro .content-inner2 .text-area .desc:nth-child(1) .text:nth-child(3)", {
    xPercent: -100,
    duration: 0.5,
  }, '<')

  .to(imgContaner[2], {
    height: '0',
  })
  .to(imgContaner[1], {
    height: '0',
  })
  .to(".sc-intro .content-inner2 .sticky-content", {
    '--before-opacity': 1,
  })
  .to(".sc-intro .content-inner2 .text-area .desc:nth-child(2)", {
    opacity: 1,
  }, '<');


// accent 애니메이션
const accentSections = ['.sc-use', '.sc-vision'];
accentSections.forEach(section => {
  const accText = gsap.utils.toArray(`${section} .accent-type1 .text-area .desc .text`);

  gsap.timeline({
    scrollTrigger: {
      trigger: `${section} .accent-type1`,
      start: '31% bottom',
      end: 'bottom bottom',
      scrub: true,
    }
  })
    .from(accText[0], {
      x: 0,
    })
    .from(accText[2], {
      x: 0,
    }, '<')
    .to(`${section} .accent-type1`, {
      '--acc-width': '21.875%',
    }, '<');
});


// 헤더 컬러 전환(sc-use영역 동안)
ScrollTrigger.create({
  trigger: '.sc-use',
  start: 'top 7%',
  end: 'bottom center',
  // markers: true, 
  toggleClass: {
    targets: '#header',
    className: 'dark'
  },
});

// 바디 컬러 전환(sc-feature영역 동안) + 헤더 컬러 전환(sc-feature영역 이후 끝까지 유지)
ScrollTrigger.create({
  trigger: '.sc-feature',
  start: 'top 55%',
  end: 'bottom 40%',
  // markers: true,
  toggleClass: {
    targets: 'body',
    className: 'dark'
  },
  onLeave: () => {
    $('#header').addClass('dark');
  },
  onEnterBack: () => {
    $('#header').removeClass('dark');
  },
});


// 가로스크롤
gsap.to('.sc-feature .group-core .content-inner1 .horizontal', {
  xPercent: -100,
  x: () => {
    return window.innerWidth;
  },
  scrollTrigger: {
    trigger: '.sc-feature .group-core .content-inner1',
    scrub: 0,
    start: 'top top',
    end: 'bottom bottom',
    // markers: true,
    invalidateOnRefresh: true,
  }
});


// 블럭이동 애니메이션
const animaBlock = gsap.timeline({
  scrollTrigger: {
    trigger: ".sc-feature .group-core .content-inner3",
    start: "top+=50 bottom",
    end: "bottom+=130 bottom",
    scrub: true,
    // markers: true,
  }
});

animaBlock.from(".sc-feature .group-core .content-inner3 .bg-block .item:nth-child(1)", {
  xPercent: -50
})
  .from(".sc-feature .group-core .content-inner3 .bg-block .item:nth-child(2)", {
    xPercent: -50
  }, "<")
  .from(".sc-feature .group-core .content-inner3 .bg-block .item:nth-child(3)", {
    xPercent: 50
  }, "<");


gsap.to(".sc-feature .group-core .content-inner3 .desc", {
  scrollTrigger: {
    trigger: ".sc-feature .group-core .content-inner3",
    start: "center center",
    end: "bottom+=700 bottom",
    scrub: true,
  },
  opacity: 1,
  onStart: () => {
    gsap.to(".sc-feature .group-core .content-inner3 .bg-block", { "--after-opacity": 1, duration: 0 });
  },
  onReverseComplete: () => {
    gsap.to(".sc-feature .group-core .content-inner3 .bg-block", { "--after-opacity": 0, duration: 0 });
  },

});

// 가로스크롤 카드1
const animaCard1 = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-feature .group-core .content-inner4 .sticky-wrapper',
    scrub: 0,
    start: 'top top',
    end: 'bottom bottom',
    // markers: true,
  }
});
animaCard1.to(".sc-feature .group-core .content-inner4 .horizontal", {
  x: () => {
    return $(".sc-feature .group-core .content-inner4 .headline").outerWidth() * -1;
  }
})

  .to(".sc-feature .group-core .content-inner4 .flex-card .card-item:nth-child(2)", {
    xPercent: 100 * -1,
    x: 40 * -1
  }, "move")
  .to(".sc-feature .group-core .content-inner4 .flex-card .card-item:nth-child(3)", {
    xPercent: 100 * -2,
    x: 40 * -2
  }, "move")
  .to(".sc-feature .group-core .content-inner4 .flex-card .card-item:nth-child(4)", {
    xPercent: 100 * -3,
    x: 40 * -3
  }, "move")
  .to(".sc-feature .group-core .content-inner4 .icon", {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      $(".sc-feature .group-core .content-inner4 .icon").addClass('active');
    },
  }, "move")
  .to(".sc-feature .group-core .content-inner4 .icon", {
    opacity: 1,
    duration: 0.5,
    onReverseComplete: () => {
      $(".sc-feature .group-core .content-inner4 .icon").removeClass('active');
    }
  }, "move+=0.5")
  .set(".sc-feature .group-core .content-inner4 .flex-card .card-item:nth-child(1)", {
    autoAlpha: 0
  })
  .set(".sc-feature .group-core .content-inner4 .flex-card .card-item:nth-child(2)", {
    autoAlpha: 0
  })
  .set(".sc-feature .group-core .content-inner4 .flex-card .card-item:nth-child(3)", {
    autoAlpha: 0
  })
  .to(".sc-feature .group-core .content-inner4 .icon", {
    opacity: 0,
  });


gsap.set(".sc-feature .group-second .content-inner1 .card-type1", { autoAlpha: 0 });
gsap.set(".sc-feature .group-second .content-inner2 .card-type1", { autoAlpha: 0 });
gsap.set(".sc-feature .group-second .content-inner3 .card-type1", { autoAlpha: 0 });


const animaCard2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".sc-feature .group-second .content-inner1",
    start: "top top",
    end: "top+=500 top",
    scrub: 0,
    // markers: true,
    onEnter: () => {
      gsap.set(".sc-feature .group-core .content-inner4 .flex-card", { autoAlpha: 0 });
      gsap.set(".sc-feature .group-second .content-inner1 .card-type1", { autoAlpha: 1 });
    },
    onLeaveBack: () => {
      gsap.set(".sc-feature .group-core .content-inner4 .flex-card", { autoAlpha: 1 });
      gsap.set(".sc-feature .group-second .content-inner1 .card-type1", { autoAlpha: 0 });
    },
  }
});
animaCard2.to(".sc-feature .group-second .content-inner1 .card-type1 .text", { opacity: 1 });


const animaCard3 = gsap.timeline({
  scrollTrigger: {
    trigger: ".sc-feature .group-second .content-inner2",
    start: "top top",
    end: "bottom bottom",
    scrub: 0,
    // markers: true,
    onEnter: () => {
      $(".sc-feature .group-second .content-inner2 .bg").addClass('blur');
      gsap.set(".sc-feature .group-second .content-inner1 .card-type1", { autoAlpha: 0 });
      gsap.set(".sc-feature .group-second .content-inner2 .card-type1", { autoAlpha: 1 });
    },
    onLeaveBack: () => {
      gsap.set(".sc-feature .group-second .content-inner1 .card-type1", { autoAlpha: 1 });
      gsap.set(".sc-feature .group-second .content-inner2 .card-type1", { autoAlpha: 0 });
    }
  }
});

animaCard3.to(".sc-feature .group-second .content-inner2 .flex-card .card-item:nth-child(2)", {
  xPercent: 100 * -1,
  x: 40 * -1
}, "<")
  .to(".sc-feature .group-second .content-inner2 .flex-card .card-item:nth-child(3)", {
    xPercent: 100 * -2,
    x: 40 * -2
  }, "<")
  .to(".sc-feature .group-second .content-inner2 .flex-card .card-item:nth-child(4)", {
    xPercent: 100 * -3,
    x: 40 * -3
  }, "<")
  .set(".sc-feature .group-second .content-inner2 .flex-card .card-item:nth-child(2)", {
    autoAlpha: 0
  })
  .set(".sc-feature .group-second .content-inner2 .flex-card .card-item:nth-child(3)", {
    autoAlpha: 0
  })
  .set(".sc-feature .group-second .content-inner2 .flex-card .card-item:nth-child(4)", {
    autoAlpha: 0
  });


const animaCard4 = gsap.timeline({
  scrollTrigger: {
    trigger: ".sc-feature .group-second .content-inner3",
    start: "top top",
    end: "bottom bottom",
    scrub: 0,
    // markers: true,
    onEnter: () => {
      gsap.set(".sc-feature .group-second .content-inner2 .card-type1", { autoAlpha: 0 });
      gsap.set(".sc-feature .group-second .content-inner3 .card-type1", { autoAlpha: 1 });
    },
    onLeaveBack: () => {
      gsap.set(".sc-feature .group-second .content-inner2 .card-type1", { autoAlpha: 1 });
      gsap.set(".sc-feature .group-second .content-inner3 .card-type1", { autoAlpha: 0 });
    }
  }
});
animaCard4.to(".sc-feature .group-second .content-inner3 .desc", {
  opacity: 1
})
  .to(".sc-feature .group-second .content-inner3 .card-type1", {
    "--before-opacity": 1,
    duration: 0.5,
  }, "<")
  .to({}, { duration: 1 });



// 가로스크롤 비전
const animaVision = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-vision .content-inner3',
    scrub: 0,
    start: 'top top',
    end: 'bottom bottom',
    // markers: true,
    invalidateOnRefresh: true,
    toggleClass: {
      targets: '.sc-vision .content-inner3 .scroll-area',
      className: 'active'
    },
    onUpdate: (self) => {
      if (self.progress > 0.5) {
        $('.sc-vision .content-inner3 .card-item:nth-child(3) .bg').addClass('blur');
        gsap.to(".sc-vision .content-inner3 .card-item:nth-child(3) .content", {
          autoAlpha: 1,
          duration: 0.2
        });
        gsap.to(".sc-vision .content-inner3 .scroll-area .tradition", {
          autoAlpha: 0,
          duration: 0.2
        });
        gsap.to(".sc-vision .content-inner3 .scroll-area .future", {
          autoAlpha: 1,
          duration: 0.2
        });
      } else {
        gsap.to(".sc-vision .content-inner3 .scroll-area .tradition", {
          autoAlpha: 1,
          duration: 0.2
        });
        gsap.to(".sc-vision .content-inner3 .scroll-area .future", {
          autoAlpha: 0,
          duration: 0.2
        });
      }
    }
  }
});
animaVision.to(".sc-vision .content-inner3 .horizontal", {
  xPercent: -100,
  x: () => {
    return window.innerWidth;
  },
});


//case 애니메이션
const animaCase = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-case .content-inner1',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    // markers: true,
    onUpdate: (self) => {
      console.log(self.progress);
    },
  }
});

animaCase
  .to(".sc-case .content-inner1 .text-area", {
    opacity: 1,
  })
  .to(".sc-case .content-inner1 .ic-scroll", {
    opacity: 1,
    delay: 1
  }, '<')
  .to(".sc-case .content-inner1 .text-area", {
    opacity: 0,
  })
  .to(".sc-case .content-inner1 .ic-scroll", {
    opacity: 0,
  }, '<');


// 가로스크롤 case
gsap.to('.sc-case .content-inner2 .horizontal', {
  xPercent: -100,
  x: () => {
    return window.innerWidth;
  },
  scrollTrigger: {
    trigger: '.sc-case .content-inner2',
    scrub: 0,
    start: 'top top',
    end: 'bottom bottom',
    // markers: true,
    invalidateOnRefresh: true,
  }
});

//marquee
ScrollTrigger.create({
  trigger: "#footer",
  start: "99% bottom",
  end: 'bottom bottom',
  scrub: true,
  // markers: true,
  onEnter: () => {
    $('.banner-marquee').addClass('show');
  },
  onLeaveBack: () => {
    $('.banner-marquee').removeClass('show');
  }
})