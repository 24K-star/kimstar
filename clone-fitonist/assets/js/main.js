
/*** 초기화 함수 ***/

//lenis_ScrollTrigger
let lenis = null;

function initializeLenis() {
  if (!lenis) {
    // Lenis 초기화 (처음 한 번만 실행)
    lenis = new Lenis({
      smooth: true,       // 부드러운 스크롤 활성화
      lerp: 0.07,         // 감속 계수 조절 (0에 가까울수록 관성이 더 많이 발생)
      duration: 1.5,      // 스크롤 지속 시간 (길게 설정해 부드러운 움직임 강조)
      easing: (t) => 1 - Math.pow(1 - t, 4), // 더 느린 감속을 위한 easing 곡선
    })
    lenis.on('scroll', ScrollTrigger.update)

    // Lenis 인스턴스가 존재하는 동안만 raf() 실행
    lenisTicker = (time) => {
      if (lenis) {
        lenis.raf(time * 1000);
      }
    };
    gsap.ticker.add(lenisTicker);
    gsap.ticker.lagSmoothing(0);
  }
}

// Lottie 애니메이션을 초기화하는 함수
function initializeLottie({ selector, path, loop, autoplay }) {
  const container = document.querySelector(selector);
  if (!container) {
    // console.warn(`선택자에 대한 컨테이너를 찾을 수 없습니다: ${selector}`);
    return;
  }

  return lottie.loadAnimation({
    container: container, // 애니메이션이 표시될 DOM 요소
    renderer: 'svg', // 렌더러 방식(svg, canvas, html 중 선택)
    loop: loop, // 반복 재생 여부
    autoplay: autoplay, // 자동 재생 여부
    path: path, // JSON 파일 경로
  });
}
const lottie1 = initializeLottie({ selector: '.lottie-1', path: 'assets/data/lottie-1.json', loop: false, autoplay: false });
const lottie2 = initializeLottie({ selector: '.lottie-2', path: 'assets/data/lottie-2.json', loop: false, autoplay: false });
const lottie3 = initializeLottie({ selector: '.lottie-3', path: 'assets/data/lottie-3.json', loop: false, autoplay: false });
const lottie4 = initializeLottie({ selector: '.lottie-4', path: 'assets/data/lottie-4.json', loop: false, autoplay: false });
const lottie5 = initializeLottie({ selector: '.lottie-5', path: 'assets/data/lottie-5.json', loop: true, autoplay: true });
const lottie6 = initializeLottie({ selector: '.lottie-6', path: 'assets/data/lottie-6.json', loop: true, autoplay: true });
const lottie7 = initializeLottie({ selector: '.lottie-7', path: 'assets/data/lottie-7.json', loop: true, autoplay: true });


/*** 공통 스크립트 ***/

// GSAP 기본 설정
gsap.defaults({
  duration: 1,
  ease: "none",
});

//리뷰 슬라이드
const reviewSlide = new Swiper('.sc-review .swiper', {
  loop: true,
  effect: "cards",
  grabCursor: true,
  initialSlide: 2,
  navigation: {
    nextEl: '.sc-review .btn-next',
    prevEl: '.sc-review .btn-prev',
  },
});

//플랜 슬라이드
const planSlide = new Swiper('.sc-plan .swiper', {
  slidesPerView: 'auto',
  freeMode: true,
  freeModeMomentum: true,
  slidesOffsetAfter: 20,
});

//header menu (모바일, 태블릿)
let menuTl = gsap.timeline({ paused: true });
menuTl.to("#header .menu", { autoAlpha: 1, duration: 0.2 })
  .from("#header .menu .nav-item", {
    autoAlpha: 0,
    yPercent: 30,
    duration: 0.2,
    stagger: {
      each: 0.2,
    }
  });

$('#header .btn-menu').on('click', function () {
  $(this).toggleClass('close');
  $('#header .menu').toggleClass('active');

  let isOpen = $('#header .menu').hasClass('active');

  if (isOpen) {
    //메뉴 열기
    menuTl.play(0);
  } else {
    //메뉴숨기기
    menuTl.kill();
    gsap.to("#header .menu", { autoAlpha: 0, duration: 0.2 });
  }
});

function menuHide() {
  if (window.innerWidth >= 1025) {
    $('#header .menu').removeClass('active');
    $('#header .btn-menu').removeClass('close');
    menuTl.kill();
    gsap.set("#header .menu", { autoAlpha: 0 });
  }
}

$(window).on('resize', function () {
  menuHide();
});

menuHide();

//intro
let animateIntro = gsap.timeline({
  defaults: { ease: "power1.in" },
  scrollTrigger: {
    trigger: ".sc-intro",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    // markers: true,
  },
});

//타임라인2
let animateFeature5 = gsap.timeline({
  defaults: {},
  scrollTrigger: { // ScrollTrigger 설정
    trigger: ".sc-feature .group-detail .style-area",
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    // markers: true, 
  }
});


/*** matchMedia ***/

const breakpoints = {
  pc: 1440,    // $pc:1440px
  tablet: 1024, // $tablet:1024px
  m: 600        // $m:600px
};

const mm = gsap.matchMedia();

/*** 601px이상 ***/
mm.add([`(min-width: ${breakpoints.m + 1}px)`], () => {

  //Lenis초기화
  initializeLenis();

  // Lottie1
  gsap.to(lottie1, {
    scrollTrigger: {
      trigger: '.sc-intro',
      start: '38% top',
      end: 'bottom bottom',
      scrub: 1,
      // markers: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const curr = progress * lottie1.totalFrames;
        lottie1.goToAndStop(curr, true);
      }
    },
  });


  //intro
  animateIntro
    .to(".sc-intro .bg", {
      y: "-110vh",
      scale: 0.8,
    }, "start")
    .to(".sc-intro .head-area", {
      y: "-35vh",
      opacity: 0,
      duration: 0.7,
    }, "start")
    .to(".sc-intro .img-area", {
      yPercent: -50,
    }, "start")
    .to(".sc-intro .bg-object.object-1", {
      y: "-200vh",
    }, "start")
    .to(".sc-intro .bg-object.object-2", {
      y: "-120vh",
    }, "start")
    .to(".sc-intro .app-object.object-1", {
      y: "-120vh",
    }, "start")
    .to(".sc-intro .app-object.object-2", {
      y: "-130vh",
    }, "start")
    .to(".sc-intro .mobile", {
      scale: 0.85,
    }, "start")
    .to(".sc-intro .mobile", {
      y: "-70vh",
      scale: 1.4,
    }, "middle")
    .to(".sc-intro .group-intro", {
      y: "-45vh",
    }, "middle")
    .from(".sc-intro .group-intro", {
      opacity: 0,
    }, "middle")
    .from(".sc-intro .group-intro .icon", {
      scale: 0.5,
      rotateZ: 720,
    }, "middle")
    .from(".sc-intro .group-intro .desc", {
      y: 10,
    }, "middle")
    .from(".sc-intro .group-intro .sub", {
      y: 50,
    }, "middle")
    .to(".sc-intro .lottie-wrap", {
      opacity: 0,
    }, "middle");



  // feature
  let animateFeature1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-feature .group-main .sticky-wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      // markers: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const adjustedProgress = Math.min(progress * 1.25, 1); // 애니메이션 끝나는시점 조정
        const curr = adjustedProgress * lottie2.totalFrames;
        lottie2.goToAndStop(curr, true);
      }
    }
  });
  animateFeature1.from(".sc-feature .group-main .feat-item:nth-child(1)", {
    opacity: 0,
    y: "40vh",
  })
    .from(".sc-feature .group-main .feat-item:nth-child(1) .desc", {
      "gap": "50px",
    }, "<")
    .from(".sc-feature .group-main .lottie-wrap", {
      y: "50vh",
    }, "<")
    .to(".sc-feature .group-main .feat-item:nth-child(1)", {
      opacity: 0,
      y: "-20vh",
    })
    .to(".sc-feature .group-main .bg-light", {
      opacity: 1,
    }, "<")
    .from(".sc-feature .group-main .feat-item:nth-child(2)", {
      opacity: 0,
      y: "30vh",
    })
    .from(".sc-feature .group-main .feat-item:nth-child(2) .desc", {
      "gap": "50px",
    }, "<")
    .to(".sc-feature .group-main .feat-item:nth-child(2)", {
      opacity: 0,
      x: "-15vw",
      y: "-15vh",
      yPercent: -50,
    })
    .to(".sc-feature .group-main .col-right", {
      opacity: 0,
      x: "15vw",
      y: "-15vh",
    }, "<")
    .to(".sc-feature .group-main .bg-light", {
      opacity: 0,
    }, "<");


  // feature2
  let animateFeature2 = gsap.timeline({
    defaults: { ease: "power1.in" },
    scrollTrigger: {
      trigger: ".sc-feature .group-detail .title-container .sticky-wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      // markers: true,
    }
  });
  animateFeature2.from(".sc-feature .group-detail .title-container .content-wrapper", {
    scale: 0.7,
  })
    .to(".sc-feature .group-detail .goal-area .title-container .title", {
      "background-position": "500% 0px",
    }, "<");


  // feature3
  let animateFeature3 = gsap.timeline({
    defaults: {},
    scrollTrigger: {
      trigger: ".sc-feature .group-detail .list-container .sticky-wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      // markers: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalFrames = lottie3.totalFrames
        const curr = Math.max(0, progress * (totalFrames - 1));
        lottie3.goToAndStop(curr, true);
      }
    }
  });

  gsap.set(".sc-feature .group-detail .list-container .goal-item:nth-child(1) .point", { opacity: 1, });
  animateFeature3.to(".sc-feature .group-detail .list-container .goal-list", {
    yPercent: -78,
    duration: 3
  })
    .to(".sc-feature .group-detail .list-container .goal-item:not(:last-child)", {
      opacity: 0,
      scale: 0.8,
      rotateX: 60,
      duration: 0.2,
      stagger: {
        each: 1, // 각 애니메이션의 시작 간격을 1초로 설정
        from: "start" // 첫요소부터 시작
      }
    }, "<")
    .to(".sc-feature .group-detail .list-container .goal-item:not(:first-child) .point", {
      opacity: 1,
      duration: 0.2,
      stagger: {
        each: 1,
        from: "start"
      }
    }, "<");

  // body color
  ScrollTrigger.create({
    trigger: '.sc-feature .group-detail .style-area',
    start: 'top bottom',
    end: 'bottom 40%',
    // markers: true,
    toggleClass: {
      targets: 'body',
      className: 'white'
    },
  });


  // feature4

  //타임라인1
  let animateFeature4 = gsap.timeline({
    defaults: {},
    scrollTrigger: {
      trigger: ".sc-feature .group-detail .style-area .sticky-wrapper",
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      // markers: true,
    }
  });

  const styleItems = document.querySelectorAll(".sc-feature .group-detail .style-area .style-item");
  const icons = document.querySelectorAll(".sc-feature .group-detail .style-area .list-head [class*='ic-']");

  animateFeature4
    .to(".sc-feature .group-detail .style-area .title-container", {
      y: "-100vh",
    })
    .from(".sc-feature .group-detail .style-area .content-wrapper", {
      opacity: 0,
      y: "30vh",
    }, "<")


    .to(styleItems[0], {
      opacity: 0,
      y: "-5vh",
      duration: 0.5
    })
    .to(icons[0], {
      "background-color": "#fff",
      duration: 0.5
    }, "<")


    .to(styleItems[1], {
      y: "-5vh",
    })
    .to(styleItems[1], {
      opacity: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.5,
    }, "<")
    .from(icons[1], {
      "background-color": "#fff",
      yoyo: true,
      repeat: 1,
      duration: 0.5,
    }, "<")


    .to(styleItems[2], {
      y: "-5vh",
    })
    .to(styleItems[2], {
      opacity: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.5,
    }, "<")
    .from(icons[2], {
      "background-color": "#fff",
      yoyo: true,
      repeat: 1,
      duration: 0.5,
    }, "<")


    .to(styleItems[3], {
      y: "-2vh",
      opacity: 1,
      duration: 0.5,
    })
    .from(icons[3], {
      "background-color": "#fff",
      duration: 0.5,
    }, "<");


  //타임라인2
  animateFeature5
    .from(".sc-feature .group-detail .style-area .title-container", {
      duration: 1,
    }, "start")
    .from(".sc-feature .group-detail .style-area .title-container", {
      opacity: 0,
      duration: 0.15,
    }, "start")
    .from(".sc-feature .group-detail .style-area .title-wrap .title", {
      "gap": "50px",
      duration: 0.15,
    }, "start")
    .from(".sc-feature .group-detail .style-area .title-wrap [class*='badge-']", {
      scale: 0.6,
      y: "6vw",
      duration: 0.15,
    }, "start");



  //progress
  const frames = document.querySelectorAll(".group-progress .frame-dark");

  frames.forEach((frame, index) => {
    let startPosition = "top bottom";

    // 2번째와 3번째 프레임만 start 위치 변경
    if (index !== 0) {
      startPosition = "10% bottom";
    }

    gsap.from(frame, {
      scrollTrigger: {
        trigger: frame,
        start: startPosition,
        end: "bottom bottom",
        scrub: false,
        // markers: true,
      },
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: "Power1.easeOut"
    });

  });

  ScrollTrigger.create({
    trigger: ".lottie-4",
    start: "top bottom",
    onEnter: () => {
      lottie4.play();
    },
    once: true
  });



  //watch
  let animateWatch = gsap.timeline({
    scrollTrigger: {
      trigger: '.group-watch',
      start: '15% bottom',
      end: 'bottom top',
      scrub: true,
      // markers: true
    }
  });

  animateWatch.fromTo(
    ".group-watch .text-wrap",
    { y: "-10vh" },
    { y: "15vh" }
  )
  $(".group-watch [class^='watch-']").each(function () {
    let dataY = $(this).data('y');
    // console.log($(this), dataY);
    if (typeof dataY !== 'undefined') {
      animateWatch.to($(this), { yPercent: dataY }, "<");
    }
  });

  //plan 자물쇠
  gsap.from(".sc-plan .ic-unlock", {
    rotateZ: 45,
    duration: 0.5,
    scrollTrigger: {
      trigger: '.sc-plan',
      start: '10% bottom',
      end: 'bottom bottom',
      scrub: false,
      // markers: true
    }
  });


  //main-plan
  let animatePlan = gsap.timeline({
    defaults: { ease: "Power1.easeOut" },
    scrollTrigger: {
      trigger: ".sc-plan .main-plan .frame-dark",
      start: "top bottom",
      end: "bottom bottom",
      scrub: false,
      // markers: true,
    }
  });

  animatePlan.from(".sc-plan .main-plan .headline .text", {
    y: (i) => `${(i + 1) * 5}vh`, // 각 요소마다 y축 이동 거리 다르게 설정
    opacity: 0
  })
    .from(".sc-plan .main-plan .body", {
      y: "5vh",
      opacity: 0
    }, "<")
    .from(".sc-plan .main-plan .bottom", {
      y: "5vh",
      opacity: 0
    }, "<");

  // 조건이 충족되지 않을 때 실행될 clean-up 함수
  return () => {
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
  };
});


/*** 1025px이상 ***/
mm.add([`(min-width: ${breakpoints.tablet + 1}px)`], () => {

  //custom-cursor
  const cursor = $('.custom-cursor');
  $(document).mousemove(function (e) {
    // 마우스의 좌표를 감지하여 원을 이동시킴
    gsap.to(cursor, {
      duration: 0.7, // 부드럽게 따라가는 속도 설정
      x: e.clientX,
      y: e.clientY,
      ease: "power1.out" // 부드러운 애니메이션을 위한 easing 함수
    });
  });
  // 버튼에 호버할 때 커서 숨기기
  $('[class *= "btn-type"]').on('mouseenter', function () {
    gsap.to(cursor, { opacity: 0, duration: 0 });
  });

  // 버튼에서 나가면 커서 다시 보이게 하기
  $('[class *= "btn-type"]').on('mouseleave', function () {
    gsap.to(cursor, { opacity: 1, duration: 0 });
  });

  const hoverListeners = [];

  // intro 타임라인 추가
  animateIntro.to("#header", {
    autoAlpha: 0,
    scale: 0.8,
    duration: 0.2,
  }, "start")

  // 카드 로테이션 타임라인 추가
  animateFeature5.fromTo(".sc-feature .group-detail .style-area .card-list",
    { rotateZ: "-60", },
    { rotateZ: "30", },
    "start")

  //plan 호버효과
  //애니메이션 초기세팅
  gsap.set(".sc-plan .plan-list .frame-dark .wrapper", {
    "background-color": "rgba(0, 0, 0, 0)",
  });
  gsap.set(".sc-plan .frame-dark .plan-desc .text", {
    yPercent: 100,
    autoAlpha: 0
  });
  gsap.set(".sc-plan .plan-list .frame-dark .btn-type2", {
    scale: 0.6,
    autoAlpha: 0
  });

  // 각 버튼의 타임라인 담을 배열 생성
  const timelines = [];

  // 호버상태 요소 추적
  let currHovered = null;

  $('.sc-plan .plan-list .frame-dark').each(function (index) {
    let $this = $(this);

    // 각 버튼에 대해 타임라인을 설정
    let tl = gsap.timeline({ paused: true });

    //애니메이션 내용
    tl.to($this.find('.wrapper'), {
      "background-color": "#161616",
      duration: 0.01,
    }, "start")
    const texts = $this.find('.plan-desc .text');
    texts.each(function (index, text) {
      tl.to(text, {
        autoAlpha: 1,
        yPercent: 0,
        delay: index * 0.3,
        duration: 0.4,
      }, "start");
    });
    const btns = $this.find('.btn-type2');
    btns.each(function (index, btn) {
      tl.to(btn, {
        autoAlpha: 1,
        scale: 1,
        delay: index * 0.4,
        duration: 0.4,
      }, "start");
    });

    // 타임라인 배열에 담기
    timelines.push(tl);

    // 호버 이벤트 리스너 등록
    const hoverListener = function () {
      // 현재 호버상태 요소라면 이벤트 발생안함
      if (currHovered === $this) return;

      // 다른 버튼의 타임라인 모두 중지 및 초기화
      $('.sc-plan .plan-list .frame-dark').css('--after-visibility', 'hidden');
      timelines.forEach((timeline) => {
        timeline.pause(0); // 타임라인 초기화
      });
      $('.sc-plan .plan-list .frame-dark').removeClass('static');

      // 현재 호버된 버튼 업데이트
      currHovered = $this;

      // 현재 버튼의 타임라인 재생
      tl.play();
      $this.addClass('static');
      $this.css('--after-visibility', 'visible');
    };

    // 이벤트 리스너 배열에 담기
    hoverListeners.push(hoverListener);

    // 각 버튼에 이벤트 리스너 등록
    $this.on('mouseenter', hoverListener);
  });

  return () => {
    $(document).off('mousemove');
    $('.btn-type').off('mouseenter mouseleave');

    $('.sc-plan .plan-list .frame-dark').each(function (index) {
      $(this).off('mouseenter', hoverListeners[index]);
      $(this).removeClass('static');
    });
  };
});

mm.add([`(max-width: ${breakpoints.m}px)`], () => {

  lottie2.loop = true;
  lottie2.play();

  lottie4.loop = true;
  lottie4.play();

  const styleSlide = new Swiper('.style-area .swiper', {
    slidesPerView: 1.02,
    spaceBetween: 10,
    // freeMode: true,
    // freeModeMomentum: true,
  });

  return () => {
    lottie2.loop = false;
    lottie2.stop();

    lottie4.loop = false;
    lottie4.stop();

    if (styleSlide) {
      styleSlide.destroy(true, true);
    }
  };
});

