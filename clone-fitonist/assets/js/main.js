// GSAP 기본 설정
gsap.defaults({
  duration: 1,
  ease: 'none',
});

//eventListener 관리용 함수 (반응형 처리) 
function addEvent(eventListeners, element, type, listener) {
  element.addEventListener(type, listener); // 이벤트 리스너 추가
  eventListeners.push({ element, type, listener }); // 이벤트 리스너를 배열에 저장
}

// Lenis 초기화 함수
let lenis = null;
let lenisTicker = null;

function initializeLenis() {
  if (!lenis) { // 중복 초기화 방지
    // Lenis 초기화 (처음 한 번만 실행)
    lenis = new Lenis({
      duration: 1.5,      // 스크롤 지속 시간 (값이 클수록 더 오래 지속되는 부드러운 효과)
      easing: (t) => 1 - Math.pow(1 - t, 4), // 강한 ease-out 효과 (4차함수 - 차수가 높을수록 변화의 강도가 커짐)
    })

    // Lenis 스크롤을 GSAP ScrollTrigger와 동기화
    lenis.on('scroll', ScrollTrigger.update)  // 스크롤 이벤트 발생 할 때마다 ScrollTrigger 업데이트

    // GSAP의 'time' 값을 사용하여 Lenis의 애니메이션 프레임을 요청
    lenisTicker = (time) => {
      if (lenis) { // Lenis 인스턴스가 존재하는 동안만 raf(time)를 호출 
        lenis.raf(time * 1000); // raf(time) : 애니메이션 프레임을 요청
        // GSAP의 time 값이 초 단위로 전달되므로 1000을 곱해 밀리초 단위로 변환 (Lenis의 raf 메서드는 밀리초 단위로 작동)
      }
    };
    gsap.ticker.add(lenisTicker); // GSAP Ticker에 lenisTicker 함수를 추가
    // gsap.ticker: 애니메이션을 위한 루프를 제공하고 주기적으로 time 값을 호출하여 모든 애니메이션을 업데이트
    // GSAP 애니메이션 프레임마다 lenisTicker함수 호출
    //  > time 값을 Lenis.raf에 전달하여 Lenis의 스크롤 애니메이션을 업데이트
    //  > GSAP의 애니메이션 루프와 Lenis의 부드러운 스크롤을 동기화하여 처리
  }
}

// Lottie 애니메이션을 초기화하는 함수
function initializeLottie({ selector, path, loop, autoplay }) {
  const container = document.querySelector(selector); // 애니메이션이 표시될 DOM 요소
  if (!container) {  // 요소가 존재하지 않으면 초기화X
    return;
  }

  return lottie.loadAnimation({ // Lottie 초기화 (애니메이션을 로드 및 실행)
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

/* swiper */

// 리뷰 슬라이드
const reviewSlide = new Swiper('.sc-review .swiper', {
  loop: true,
  effect: 'cards',
  grabCursor: true,  // 슬라이드에 마우스 오버시 grab 커서 표시
  initialSlide: 2, // 초기 슬라이드 인덱스 (3번째 슬라이드부터 시작)
  navigation: {
    nextEl: '.sc-review .btn-next',
    prevEl: '.sc-review .btn-prev',
  },
});

// 플랜 슬라이드
const planSlide = new Swiper('.sc-plan .swiper', {
  slidesPerView: 'auto', // 슬라이드 개수를 슬라이드 실제 크기에 따라 자동으로 조정
  grabCursor: true,  // 슬라이드에 마우스 오버시 grab 커서 표시
  freeMode: true, // 자유 모드 활성화 (슬라이드가 고정되지 않고 자유롭게 움직임)
  freeModeMomentum: true,  // 슬라이드 스와이프 후 관성 효과 활성화
  slidesOffsetAfter: 20,  // 마지막 슬라이드 이후 여백 (20px)
});

/* GSAP 애니메이션 */

// 전체메뉴 펼치기 애니메이션 (모바일, 태블릿용)
let menuTl = gsap.timeline({ paused: true }); // 초기에 일시정지 상태로 타임라인 생성
menuTl.to('#header .menu', { // 전체메뉴를 천천히 표시
  autoAlpha: 1,
  duration: 0.2
})
  .from('#header .menu .nav-item', { // 각 메뉴 아이템을 아래에서 위로 순차적으로 나타나게 함
    autoAlpha: 0,
    yPercent: 30,
    duration: 0.2,
    stagger: {
      each: 0.2, // 0.2초 간격
    }
  });

// 메뉴 버튼 클릭 이벤트 (토글)
$('#header .btn-menu').on('click', function () {
  $(this).toggleClass('close'); // 버튼에 close 클래스 토글 (닫기버튼으로 전환)
  $('#header .menu').toggleClass('active'); // 전체메뉴 active 클래스 토글

  let isOpen = $('#header .menu').hasClass('active'); // 전체메뉴가 활성화 상태인지 확인

  // aria 속성 업데이트
  $(this).attr('aria-expanded', isOpen); // 버튼의 aria-expanded 상태 변경
  $('#header .menu').attr('aria-hidden', !isOpen); // 메뉴의 aria-hidden 상태 변경

  if (isOpen) {
    menuTl.play(0); // 메뉴 열기: 타임라인 처음(0)부터 재생
  } else {
    menuTl.kill(); // 진행 중인 애니메이션 즉시 중단
    gsap.to('#header .menu', {  // 메뉴를 0.2초 동안 페이드아웃
      autoAlpha: 0,
      duration: 0.2
    });
  }
});

// 잔체메뉴를 숨기는 함수
function menuHide() {
  const isDesktop = window.innerWidth > 1024;  // PC 버전 분기점 (1024px 초과)
  const $menu = $('#header .menu');
  const $menuBtn = $('#header .btn-menu');

  if (isDesktop) {
    $menu.removeClass('active');  // 전체메뉴 활성화 상태 제거
    $menuBtn.removeClass('close');  // 메뉴 버튼 닫기 상태 제거

    menuTl?.kill();// 진행 중인 메뉴 애니메이션 중단 (menuTl이 undefined일 경우 에러 방지)
    gsap.set($menu, { autoAlpha: 0 }); // 메뉴를 즉시 숨김 처리
  }
}
// 창 크기 변경 시 메뉴 숨김 함수 실행
$(window).on('resize', function () {
  menuHide();
});

// 초기 메뉴 숨김 처리
menuHide();

// 화면크기별로 다른 애니메이션을 추가하거나 수정하기 위해 전역 범위에서 선언
// 인트로 애니메이션 타임라인설정
let animateIntro = gsap.timeline({
  defaults: { ease: 'power1.in' },  // 모든 애니메이션에 적용될 기본 이징
  scrollTrigger: {
    trigger: '.sc-intro',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    // markers: true,
  },
});

// feature-5 애니메이션 타임라인설정
let animateFeature5 = gsap.timeline({
  scrollTrigger: { // ScrollTrigger 설정
    trigger: '.sc-feature .group-detail .style-area',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    // markers: true, 
  }
});

/*** matchMedia ***/
const mm = gsap.matchMedia();

/*** 601px이상 (태블릿/PC) ***/
mm.add('(min-width: 601px)', () => {

  // Lenis초기화
  initializeLenis();

  // Lottie1 애니메이션 (스크롤과 lottie애니메이션 프레임을 동기화)
  ScrollTrigger.create({
    trigger: '.sc-intro',
    start: '38% top',
    end: 'bottom bottom',
    scrub: 1,
    // markers: true,
    onUpdate: (self) => {  // 스크롤 진행도에 따라 Lottie1 애니메이션 프레임 업데이트
      const progress = self.progress; // 현재 스크롤 진행도 (0~1)
      const curr = progress * lottie1.totalFrames;   // 진행도에 비례하는 현재 프레임 계산
      lottie1.goToAndStop(curr, true);  // 계산된 프레임으로 애니메이션 이동
    }
  });


  // 인트로 애니메이션
  // start
  animateIntro
    .to('.sc-intro .bg', {
      y: '-110vh', // 배경을 위로 110vh만큼 이동
      scale: 0.8,  // 배경을 80% 크기로 축소
    }, 'start')
    .to('.sc-intro .head-area', {
      y: '-35vh', // 헤더를 위로 35vh만큼 이동
      opacity: 0, // 헤더를 숨김
      duration: 0.7,
    }, 'start')
    .to('.sc-intro .img-area', {
      yPercent: -50,  // 이미지를 위로 50%만큼 이동
    }, 'start')
    .to('.sc-intro .bg-object.object-1', {
      y: '-200vh',  // 배경 오브젝트1을 위로 200vh만큼 이동
    }, 'start')
    .to('.sc-intro .bg-object.object-2', {
      y: '-120vh',  // 배경 오브젝트2를 위로 120vh만큼 이동
    }, 'start')
    .to('.sc-intro .app-object.object-1', {
      y: '-120vh',  // 앱 오브젝트1을 위로 120vh만큼 이동
    }, 'start')
    .to('.sc-intro .app-object.object-2', {
      y: '-130vh',  // 앱 오브젝트2를 위로 130vh만큼 이동
    }, 'start')
    .to('.sc-intro .mobile', {
      scale: 0.85,  // 모바일 이미지를 85% 크기로 축소
    }, 'start')

    // middle
    .to('.sc-intro .mobile', {
      y: '-70vh',  // 모바일 이미지를 위로 70vh만큼 이동
      scale: 1.4,  // 모바일 이미지를 140% 크기로 확대
    }, 'middle')
    .to('.sc-intro .group-intro', {
      y: '-45vh',  // 텍스트그룹을 위로 45vh만큼 이동
    }, 'middle')
    .from('.sc-intro .group-intro', { // 텍스트그룹을 표시
      opacity: 0,
    }, 'middle')
    .from('.sc-intro .group-intro .icon', {
      scale: 0.5, // 아이콘 scale 0.5 -> 1
      rotateZ: 720, // 아이콘을 720도 회전
    }, 'middle')
    .from('.sc-intro .group-intro .desc', {
      y: 10,
    }, 'middle')
    .from('.sc-intro .group-intro .sub', {
      y: 50,
    }, 'middle')
    .to('.sc-intro .lottie-wrap', { // 로티 애니메이션 숨김
      opacity: 0,
    }, 'middle');



  // feature-1 애니메이션
  let animateFeature1 = gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-feature .group-main .sticky-wrapper',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      // markers: true,
      onUpdate: (self) => {  // 스크롤 진행도에 따라 Lottie2 애니메이션 프레임 업데이트
        const progress = self.progress; // 현재 스크롤 진행도 (0~1)
        // 애니메이션 종료 시점을 25% 더 빠르게 조정 (1.25를 곱함), Math.min으로 최대값을 1로 제한
        const adjustedProgress = Math.min(progress * 1.25, 1);
        const curr = adjustedProgress * lottie2.totalFrames;  // 조정된 진행도에 따라 Lottie 애니메이션의 현재 프레임 계산
        lottie2.goToAndStop(curr, true);  // 계산된 프레임으로 애니메이션 이동
      }
    }
  });
  // 타임라인1 
  animateFeature1.from('.sc-feature .group-main .feat-item:nth-child(1)', { // 첫번쨰 텍스트 페이드인 + 위로 올라옴
    opacity: 0,
    y: '40vh',
  })
    .from('.sc-feature .group-main .feat-item:nth-child(1) .desc', { // 텍스트 행간 축소
      'gap': '50px',
    }, '<')
    .from('.sc-feature .group-main .lottie-wrap', { // 로티 애니메이션 위로 올라옴
      y: '50vh',
    }, '<')

    // 타임라인2
    .to('.sc-feature .group-main .feat-item:nth-child(1)', { // 첫번쨰 텍스트 페이드아웃 + 위로 살짝 올라감
      opacity: 0,
      y: '-20vh',
    })
    .to('.sc-feature .group-main .bg-light', { // 배경 빛 표시
      opacity: 1,
    }, '<')

    // 타임라인3
    .from('.sc-feature .group-main .feat-item:nth-child(2)', { // 두번쨰 텍스트 페이드인 + 위로 올라옴
      opacity: 0,
      y: '30vh',
    })
    .from('.sc-feature .group-main .feat-item:nth-child(2) .desc', { // 텍스트 행간 축소
      'gap': '50px',
    }, '<')

    // 타임라인4
    .to('.sc-feature .group-main .feat-item:nth-child(2)', { // 두번쨰 텍스트 페이드아웃 + 왼쪽으로 대각선 상단으로 올라감
      opacity: 0,
      x: '-15vw',
      y: '-15vh',
      yPercent: -50,
    })
    .to('.sc-feature .group-main .col-right', {  // lottie 애니메이션 페이드아웃 + 오른쪽 대각선 상단으로 올라감
      opacity: 0,
      x: '15vw',
      y: '-15vh',
    }, '<')
    .to('.sc-feature .group-main .bg-light', {  // 배경 빛 숨김
      opacity: 0,
    }, '<');


  // feature-2 애니메이션
  let animateFeature2 = gsap.timeline({
    defaults: { ease: 'power1.in' }, // 모든 애니메이션에 적용될 기본 이징
    scrollTrigger: {
      trigger: '.sc-feature .group-detail .title-container .sticky-wrapper',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      // markers: true,
    }
  });
  animateFeature2.from('.sc-feature .group-detail .title-container .content-wrapper', {
    scale: 0.7, // 70% 크기에서 시작하여 100%로 확대
  })
    .to('.sc-feature .group-detail .goal-area .title-container .title', {
      'background-position': '500% 0px', // 타이틀의 그라디언트 배경을 오른쪽으로 이동
    }, '<');


  // feature-3 애니메이션
  gsap.set('.sc-feature .group-detail .list-container .goal-item:nth-child(1) .point', {  // 첫번째 텍스트 포인트는 초기에 표시
    opacity: 1,
  });

  let animateFeature3 = gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-feature .group-detail .list-container .sticky-wrapper',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      // markers: true,
      onUpdate: (self) => {  // 스크롤 진행도에 따라 Lottie3 애니메이션 프레임 업데이트
        const progress = self.progress; // 현재 스크롤 진행도 (0~1)
        const totalFrames = lottie3.totalFrames; // 총 프레임 수
        const curr = Math.max(0, progress * (totalFrames - 1)); // 진행도에 따른 현재 프레임 계산
        lottie3.goToAndStop(curr, true); // 계산된 프레임으로 애니메이션 이동
      }
    }
  });
  // 순차적으로 텍스트 위쪽으로 기울어지면서 사라지는 효과 (마지막 아이템제외) + 텍스트 포인트 표시 (첫번째 아이템제외)
  animateFeature3.to('.sc-feature .group-detail .list-container .goal-list', {
    yPercent: -78,  // 목록을 위로 78% 이동
    duration: 3
  })
    .to('.sc-feature .group-detail .list-container .goal-item:not(:last-child)', {  // 마지막 아이템을 제외한 모든 아이템에 대해 애니메이션 적용
      opacity: 0,
      scale: 0.8,
      rotateX: 60,
      duration: 0.2,
      stagger: {
        each: 1, // 각 애니메이션의 시작 간격을 1초로 설정
      }
    }, '<')
    .to('.sc-feature .group-detail .list-container .goal-item:not(:first-child) .point', {  // 첫번째 아이템을 제외한 모든 아이템에 대해 애니메이션 적용
      opacity: 1,
      duration: 0.2,
      stagger: {
        each: 1, // 각 애니메이션의 시작 간격을 1초로 설정
      }
    }, '<');

  // 특정 섹션에서 바디컬러 전환
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


  // feature-4 애니메이션
  const styleItems = document.querySelectorAll('.sc-feature .group-detail .style-area .style-item');
  const icons = document.querySelectorAll('.sc-feature .group-detail .style-area .list-head [class*="ic-"]');

  let animateFeature4 = gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-feature .group-detail .style-area .sticky-wrapper',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      // markers: true,
    }
  });
  // 타임라인1
  animateFeature4
    .to('.sc-feature .group-detail .style-area .title-container', {
      y: '-100vh',  // 타이틀 위로 빠르게 이동
    })
    .from('.sc-feature .group-detail .style-area .content-wrapper', {
      opacity: 0,  // 컨텐츠 표시
      y: '30vh',  // 컨텐츠 위로 이동
    }, '<')

    // 타임라인2
    .to(styleItems[0], { // 첫번째 아이템 페이드아웃 + 위로 살짝 올라감
      opacity: 0,
      y: '-5vh',
      duration: 0.5
    })
    .to(icons[0], { // 첫번째 아이콘 배경색 흰색
      'background-color': '#fff',
      duration: 0.5
    }, '<')

    // 타임라인3
    .to(styleItems[1], { // 두번째 아이템 위로 살짝 올라감
      y: '-5vh',
    })
    .to(styleItems[1], { // 두번째 아이템 표시 > 숨김 (yoyo 왕복)
      opacity: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.5,
    }, '<')
    .from(icons[1], { // 두번째 아이콘 배경색 컬러 > 흰색 (yoyo 왕복)
      'background-color': '#fff',
      yoyo: true,
      repeat: 1,
      duration: 0.5,
    }, '<')

    // 타임라인4
    .to(styleItems[2], { // 세번째 아이템 위로 살짝 올라감
      y: '-5vh',
    })
    .to(styleItems[2], { // 세번째 아이템 표시 > 숨김 (yoyo 왕복)
      opacity: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.5,
    }, '<')
    .from(icons[2], { // 세번째 아이콘 배경색 컬러 > 흰색 (yoyo 왕복)
      'background-color': '#fff',
      yoyo: true,
      repeat: 1,
      duration: 0.5,
    }, '<')

    // 타임라인5
    .to(styleItems[3], { // 네번째 아이템 위로 살짝 올라감
      y: '-2vh',
      opacity: 1,
      duration: 0.5,
    })
    .from(icons[3], { // 네번째 아이콘 배경색 컬러 > 흰색 (yoyo 왕복)
      'background-color': '#fff',
      duration: 0.5,
    }, '<');


  // feature-5 애니메이션 (태블릿/PC) (타임라인은 전역범위에 설정)
  animateFeature5
    .from('.sc-feature .group-detail .style-area .title-container', { // 애니메이션 초기에 딜레이 추가
      duration: 1,
    }, 'start')
    .from('.sc-feature .group-detail .style-area .title-container', { // 타이틀 컨테이너 페이드인
      opacity: 0,
      duration: 0.15,
    }, 'start')
    .from('.sc-feature .group-detail .style-area .title-wrap .title', { // 타이틀 텍스트 행간 축소
      'gap': '50px',
      duration: 0.15,
    }, 'start')
    .from('.sc-feature .group-detail .style-area .title-wrap [class*="badge-"]', { // 배지 크기 확대 + 위로 이동
      scale: 0.6,
      y: '6vw',
      duration: 0.15,
    }, 'start');


  // progress 영역 애니메이션
  const frames = document.querySelectorAll('.group-progress .frame-dark');

  frames.forEach((frame, index) => {
    let startPosition = 'top bottom'; // 기본 시작 위치 설정 (첫 번째 프레임용)

    if (index !== 0) {
      startPosition = '10% bottom'; // 2번째와 3번째 프레임의 시작 위치 변경
    }

    // 각 프레임에 대한 fade-in & scale-up 애니메이션 설정 
    gsap.from(frame, {
      scrollTrigger: {
        trigger: frame,
        start: startPosition,
        end: 'bottom bottom',
        scrub: false, // 스크롤 위치와 애니메이션을 동기화하지 않음
        // markers: true,
      },
      scale: 0.8, // 크기 80%에서 시작
      opacity: 0,  // 투명도 0에서 시작
      duration: 0.8,
      ease: 'Power1.easeOut'
    });
  });

  // lottie4 애니메이션 (트리거 영역으로 스크롤 진입시 lottie4 애니메이션이 재생됨)
  ScrollTrigger.create({
    trigger: '.lottie-4',
    start: 'top bottom',
    onEnter: () => { // 트리거 진입 시 실행될 콜백 함수
      lottie4.play();  // lottie4 애니메이션 재생
    },
    once: true    // 트리거가 한 번만 실행
  });



  // watch 영역 애니메이션 (패럴렉스 효과)
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
    '.group-watch .text-wrap',
    { y: '-10vh' },
    { y: '15vh' }
  )
  //watch- 로 시작하는 모든 클래스를 가진 요소들에 대해 반복
  // watch- 클래스를 가진 모든 요소에 대해 y축 애니메이션 적용
  document.querySelectorAll('[class^="watch-"]').forEach(element => {
    const dataY = element.dataset.y;   // data-y 속성에서 이동할 y축 값을 가져옴
    if (dataY) {  // data-y 값이 있는 경우에만 애니메이션 적용
      animateWatch.to(element, { yPercent: dataY }, '<'); // 해당 요소를 data-y에 지정된 퍼센트만큼 y축으로 이동
    }
  });

  // plan영역 자물쇠 아이콘 애니메이션
  gsap.from('.sc-plan .ic-unlock', {
    rotateZ: 45,  // 45도 회전상태에서 시작
    duration: 0.5,
    scrollTrigger: {
      trigger: '.sc-plan',
      start: '10% bottom',
      end: 'bottom bottom',
      scrub: false,
      // markers: true
    }
  });

  // main plan 영역 애니메이션
  let animatePlan = gsap.timeline({
    defaults: { ease: 'Power1.easeOut' }, // 모든 애니메이션에 적용될 기본 이징
    scrollTrigger: {
      trigger: '.sc-plan .main-plan .frame-dark',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: false,
      // markers: true,
    }
  });

  animatePlan.from('.sc-plan .main-plan .headline .text', {
    y: (i) => `${(i + 1) * 5}vh`, // 각 텍스트 요소의 시작 y축 위치를 동적으로 계산 (GSAP에서 선택된 요소의 인덱스 제공)
    opacity: 0
  })
    .from('.sc-plan .main-plan .body', {
      y: '5vh', // 5vh 아래에서 시작
      opacity: 0 // 투명도 0에서 시작
    }, '<')
    .from('.sc-plan .main-plan .bottom', {
      y: '5vh', // 5vh 아래에서 시작
      opacity: 0 // 투명도 0에서 시작
    }, '<');

  // clean-up 함수
  return () => {
    if (lenis) {  // lenis가 존재하는 경우
      lenis.destroy();  // lenis 객체 제거  
      lenis = null;  // lenis 변수 초기화
    }
  };
});


/*** 1025px이상 (PC) ***/
mm.add('(min-width: 1025px)', () => {

  const eventListeners = []; // eventListener 추적용 배열 

  /**
   * 
   * 타임라인 애니메이션 추가
   * 
   */


  // 인트로 타임라인에 애니메이션 추가 (PC)
  animateIntro.to('#header', { // 헤더 요소에 애니메이션 적용
    autoAlpha: 0, // 투명도 0으로 설정
    scale: 0.8, // 크기 80%로 설정
    duration: 0.2,
  }, 'start')

  // feature-5 타임라인에 애니메이션 추가 (PC)
  animateFeature5.fromTo('.sc-feature .group-detail .style-area .card-list',
    { rotateZ: '-60', }, // 회전 애니메이션 시작 각도
    { rotateZ: '30', }, // 회전 애니메이션 종료 각도
    'start')



  /**
   * 
   * 이벤트 리스너 
   * 
   */

  // 커스텀 커서 관련 이벤트 리스너 추가
  const cursor = document.querySelector('.custom-cursor'); // 커스텀 커서로 사용할 DOM 요소 선택

  // 마우스 이동 이벤트
  addEvent(eventListeners, document, 'mousemove', (e) => {
    gsap.to(cursor, {
      duration: 0.7,  // 커서가 마우스를 따라가는 지연 시간 (초)
      x: e.clientX,   // 마우스의 현재 X 좌표로 이동
      y: e.clientY,   // 마우스의 현재 Y 좌표로 이동
      ease: 'power1.out' // 부드러운 애니메이션을 위한 easing 함수
    });
  });

  const btnTypes = document.querySelectorAll('[class *= "btn-type"]'); // 모든 버튼 요소 선택

  btnTypes.forEach(btn => {
    // 버튼에 호버할 때 커서 숨기기
    addEvent(eventListeners, btn, 'mouseenter', () => {
      gsap.to(cursor, {
        opacity: 0,
        duration: 0  // 즉시 적용 (애니메이션 없음)
      });
    });

    // 버튼에서 나가면 커서 다시 보이게 하기
    addEvent(eventListeners, btn, 'mouseleave', () => {
      gsap.to(cursor, {
        opacity: 1,
        duration: 0  // 즉시 적용 (애니메이션 없음)
      });
    });
  });


  // plan영역 아이템 호버 애니메이션
  const planItems = document.querySelectorAll('.sc-plan .plan-list .frame-dark');
  let currHovered = null;   // 현재 호버 중인 요소 추적을 위한 변수

  // 호버 애니메이션을 위한 초기상태 설정
  gsap.set('.sc-plan .plan-list .frame-dark .wrapper', {
    'background-color': 'rgba(0, 0, 0, 0)', // 배경색 투명으로 설정
  });
  gsap.set('.sc-plan .frame-dark .plan-desc .text', {
    yPercent: 100,  // 텍스트를 아래로 100% 이동(숨김)
    autoAlpha: 0  // 투명도 0으로 설정
  });
  gsap.set('.sc-plan .plan-list .frame-dark .btn-type2', {
    scale: 0.6,  // 버튼 크기 60%로 설정
    autoAlpha: 0  // 투명도 0으로 설정
  });

  planItems.forEach(item => {
    addEvent(eventListeners, item, 'mouseenter', () => {
      // 이미 호버 중인 아이템이라면 무시
      if (currHovered === item) return;

      // 다른 아이템의 애니메이션 모두 중지 및 스타일 초기화
      planItems.forEach(frame => {
        // 애니메이션 중지
        gsap.killTweensOf(frame.querySelector('.wrapper')); // wrapper 애니메이션 중지
        gsap.killTweensOf(frame.querySelectorAll('.plan-desc .text')); // 텍스트 애니메이션 중지
        gsap.killTweensOf(frame.querySelectorAll('.btn-type2')); // 버튼 애니메이션 중지

        // 초기 상태로 리셋
        gsap.set(frame.querySelector('.wrapper'), {
          'background-color': 'rgba(0, 0, 0, 0)'
        });
        gsap.set(frame.querySelectorAll('.plan-desc .text'), {
          yPercent: 100,
          autoAlpha: 0
        });
        gsap.set(frame.querySelectorAll('.btn-type2'), {
          scale: 0.6,
          autoAlpha: 0
        });

        // 테두리 숨김
        frame.style.setProperty('--after-visibility', 'hidden');
        frame.classList.remove('static');
      });

      // 현재 호버된 아이템 상태 업데이트 
      currHovered = item;

      // 테두리 표시 애니메이션
      item.style.setProperty('--after-visibility', 'visible');
      item.classList.add('static');

      // 애니메이션 재생
      gsap.to(item.querySelector('.wrapper'), { // 래퍼 애니메이션
        'background-color': '#161616',  // 배경색 변경
        duration: 0.02,
      });
      gsap.to(item.querySelectorAll('.plan-desc .text'), { // 텍스트 표시 애니메이션
        autoAlpha: 1, // 텍스트 표시
        yPercent: 0,  // 원래 위치로 이동
        stagger: 0.2, // 텍스트마다 0.2초씩 지연
        ease: 'power1.inOut',
        duration: 0.4,
      });
      gsap.to(item.querySelectorAll('.btn-type2'), { // 버튼 표시 애니메이션
        autoAlpha: 1, // 버튼 표시
        scale: 1, // 원래 크기로 확대
        stagger: 0.3, // 버튼마다 0.3초씩 지연
        ease: 'power1.inOut',
        duration: 0.4,
      });

    });
  });

  return () => { // clean-up
    // 등록된 모든 이벤트 리스너 제거
    eventListeners.forEach(data => {
      data.element.removeEventListener(data.type, data.listener);
    })
    // plan 아이템 테두리 상태 초기화
    planItems.forEach(item => {
      item.classList.remove('static');
    });
  };
});


/*** 600px 이하 (모바일) ***/
mm.add('(max-width: 600px)', () => {

  // 모바일 화면일 때 lottie 애니메이션 설정 변경 (스크롤 동기화 -> 일반 반복재생)
  lottie2.loop = true; // 반복재생 설정
  lottie2.play(); // 재생

  lottie4.loop = true;
  lottie4.play();

  // swiper 요소의 aria-hidden 속성 제거
  const swiperEl = document.querySelector('.style-area .swiper');
  swiperEl.removeAttribute('aria-hidden');

  // 모바일 화면일 때 swiper 활성화
  const styleSlide = new Swiper(swiperEl, {
    slidesPerView: 1.02,
    spaceBetween: 10,
  });

  return () => { // clean-up
    lottie2.loop = false; // 반복재생 비활성화
    lottie2.stop(); // 재생 중지

    lottie4.loop = false;
    lottie4.stop();

    if (styleSlide) { // styleSlide가 존재하는 경우
      styleSlide.destroy(true, true); //  Swiper 인스턴스를 제거
      // 스와이퍼 요소에 aria-hidden 속성 다시 추가
      swiperEl.setAttribute('aria-hidden', 'true');
    }
  };
});
