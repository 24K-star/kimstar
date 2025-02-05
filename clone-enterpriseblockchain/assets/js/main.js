// GSAP 기본 설정
gsap.defaults({
  duration: 1,
  ease: 'none'
});

// nav 언어 선택 버튼 클릭 이벤트
$('.btn-lang').click(function () {
  // 현재 클릭된 버튼의 형제 요소인 목록 찾기
  const langList = $(this).siblings('.lang-list');

  if (langList.hasClass('show')) {
    // 목록이 표시되어 있으면 숨김
    langList.removeClass('show');
  } else {
    // 목록이 숨겨져 있으면 표시
    langList.addClass('show');
  }
});

// 스크롤시 언어선택 목록 사라짐
$(window).on('scroll', function () {
  $('.lang-list').removeClass('show');
});


// 상단으로 이동 버튼 제어
let lastScroll = 0;
$(window).scroll(function () {
  const curr = $(this).scrollTop(); // 현재 스크롤 위치
  const viewHeight = window.innerHeight; // 뷰포트 높이

  const btnFix = $('.fix-btn'); // 상단으로 이동 버튼
  const isStop = btnFix.hasClass('stop'); // 버튼이 고정된 상태인지 확인

  if (isStop) { // 버튼이 고정된 상태인 경우
    btnFix.addClass('show'); // 버튼 표시
  } else if (curr < viewHeight * 8 || curr > lastScroll) { // 스크롤 위치가 뷰포트 높이의 8배보다 작거나, 이전 스크롤 위치보다 큰 경우 (스크롤 방향이 아래일 때)
    btnFix.removeClass('show'); // 버튼 숨김
  } else { // 그 외의 경우 (스크롤 방향이 위일 때)
    btnFix.addClass('show'); // 버튼 표시
  }
  lastScroll = curr; // 이전 스크롤 위치 저장
});

// 상단으로 이동 버튼 고정 (absolute로 변환)
ScrollTrigger.create({
  trigger: '.sc-ground',
  start: 'bottom bottom',
  end: 'bottom bottom',
  // markers: true,
  onEnter: () => { // 트리거 영역에 진입했을 때 실행
    $('.fix-btn').addClass('stop'); // 버튼 고정 (absolute 포지션으로 변경)
  },
  onLeaveBack: () => { // 트리거 영역을 위로 벗어났을 때 실행
    $('.fix-btn').removeClass('stop'); // 버튼 고정 해제 (fixed 포지션으로 복귀)
  },
});

// 상단으로 이동 버튼 클릭 이벤트
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
    onLeave: () => { // 트리거 영역을 아래로 벗어났을 때 실행
      // 스크롤 표시 아이콘 숨김
      gsap.to('.sc-intro .content-inner1 .ic-scroll', {
        opacity: 0,
        duration: 0.05,
      });
    },
    onEnterBack: () => { // 트리거 영역을 위로 진입했을 때 실행
      // 스크롤 표시 아이콘 표시
      gsap.to('.sc-intro .content-inner1 .ic-scroll', {
        opacity: 1,
        duration: 0.05,
      });
    },
  }
});

// intro-1 텍스트
const introDesc = '.sc-intro .content-inner1 .text-area .desc';

animaIntro1
  .to(`${introDesc}:nth-child(1)`, {
    opacity: 1,
  })
  .to('.sc-intro .content-inner1 .sticky-content', { // 배경 딤드처리
    '--before-opacity': 1, // 요소에 CSS 변수를 정의하여 가상 요소의 스타일 변경
  }, '<')
  .to(`${introDesc}:nth-child(1)`, {
    opacity: 0,
    // 헤더 표시 애니메이션
    onStart: () => { $('#header').addClass('show') },  // 애니메이션 시작 시 실행
    onReverseComplete: () => { $('#header').removeClass('show') }, // 애니메이션이 역방향으로 완료되면 실행
  })
  .to(`${introDesc}:nth-child(2)`, {
    opacity: 1,
    yoyo: true, // 애니메이션 왕복 여부
    repeat: 1, // 애니메이션 반복 횟수
  })
  .to(`${introDesc}:nth-child(3)`, {
    opacity: 1,
    yoyo: true,
    repeat: 1,
  }, '+=0.5') // 이전 애니메이션 완료 후 0.5초 뒤에 실행
  .to(`${introDesc}:nth-child(4)`, {
    opacity: 1,
  })
  .to({}, { duration: 1 }); // 애니메이션 마지막에 지연시간 추가


// intro-2 애니메이션
const animaIntro2 = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-intro .content-inner2',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    // markers: true,
    invalidateOnRefresh: true, // 브라우저 크기가 변경될 때마다 ScrollTrigger 재계산
  }
});

// intro-2 이미지
animaIntro2
  .to('.sc-intro .content-inner2 .text-area .desc:nth-child(1)', {
    opacity: 1,
  })
  .to('.sc-intro .content-inner2 .sticky-content', { // 배경 딤드처리
    '--before-opacity': 1,
  }, '<')
  .to('.sc-intro .content-inner2 .text-area .desc:nth-child(1)', {
    opacity: 0,
  })
  .to('.sc-intro .content-inner2 .sticky-content', { // 배경 딤드처리 해제
    '--before-opacity': 0,
  }, '<')
  .to('.sc-intro .content-inner2 .text-area .desc:nth-child(1) .text:nth-child(1)', {
    xPercent: 100, // 요소크기만큼 오른쪽으로 이동
    duration: 0.5,
  }, '<')
  .to('.sc-intro .content-inner2 .text-area .desc:nth-child(1) .text:nth-child(3)', {
    xPercent: -100, // 요소크기만큼 왼쪽으로 이동
    duration: 0.5,
  }, '<')
  .to('.sc-intro .content-inner2 .img-container:nth-child(3)', {
    height: '0',  // 이미지는 그대로 위치, 컨테이너는 높이가 전체높이 -> 0 으로 변경
  })
  .to('.sc-intro .content-inner2 .img-container:nth-child(2)', {
    height: '0',
  })
  .to('.sc-intro .content-inner2 .sticky-content', { // 배경 딤드처리
    '--before-opacity': 1,
  })
  .to('.sc-intro .content-inner2 .text-area .desc:nth-child(2)', {
    opacity: 1,
  }, '<');


// accent 애니메이션
const accentSections = ['.sc-use', '.sc-vision'];
accentSections.forEach(section => {
  gsap.timeline({
    scrollTrigger: {
      trigger: `${section} .accent-type1`,
      start: '31% bottom',
      end: 'bottom bottom',
      scrub: true,
    }
  })
    .from(`${section} .accent-type1 .text-area .desc .text:nth-child(1)`, {
      x: 0, // x축 0에서 원래 위치로 이동
    })
    .from(`${section} .accent-type1 .text-area .desc .text:nth-child(3)`, {
      x: 0, // x축 0에서 원래 위치로 이동
    }, '<')
    .to(`${section} .accent-type1`, {
      '--acc-width': '21.875%', // 가상요소의 너비를 21.875%로 설정
    }, '<');
});


// 헤더 컬러 전환 (sc-use영역 동안)
ScrollTrigger.create({
  trigger: '.sc-use',
  start: 'top 7%',
  end: 'bottom center',
  // markers: true, 
  toggleClass: { // 트리거 영역 클래스 토글
    targets: '#header',
    className: 'dark' // 헤더 요소에 'dark' 클래스 토글
  },
});

// 바디 컬러 전환 (sc-feature영역 동안) + 헤더 컬러 전환(sc-feature영역 이후 끝까지 유지)
ScrollTrigger.create({
  trigger: '.sc-feature',
  start: 'top 55%',
  end: 'bottom 40%',
  // markers: true,
  toggleClass: {
    targets: 'body',
    className: 'dark'
  },
  onLeave: () => { // 트리거 영역을 벗어났을 때 실행 (스크롤 다운)
    $('#header').addClass('dark');
  },
  onEnterBack: () => { // 트리거 영역을 위로 진입했을 때 실행 (스크롤 업)
    $('#header').removeClass('dark');
  },
});


// 가로스크롤
gsap.to('.sc-feature .group-core .content-inner1 .horizontal', {
  xPercent: -100, // 요소크기만큼 왼쪽으로 이동
  x: () => {
    return window.innerWidth; // 현재 브라우저 너비만큼 오른쪽으로 이동
  },
  scrollTrigger: {
    trigger: '.sc-feature .group-core .content-inner1',
    scrub: true,
    start: 'top top',
    end: 'bottom bottom',
    // markers: true,
    invalidateOnRefresh: true, // 브라우저 크기가 변경될 때마다 ScrollTrigger 재계산
  }
});


// 블럭 이동 애니메이션
const animaBlock = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-feature .group-core .content-inner3',
    start: 'top+=50 bottom',
    end: 'bottom+=130 bottom',
    scrub: true,
    // markers: true,
  }
});

// 블럭 아이템
const blockItem = '.sc-feature .group-core .content-inner3 .bg-block .item';

animaBlock.from(`${blockItem}:nth-child(1)`, {
  xPercent: -50
})
  .from(`${blockItem}:nth-child(2)`, {
    xPercent: -50
  }, '<')
  .from(`${blockItem}:nth-child(3)`, {
    xPercent: 50
  }, '<');


// 블럭 텍스트 페이드인 애니메이션
gsap.to('.sc-feature .group-core .content-inner3 .desc', {
  opacity: 1,
  scrollTrigger: {
    trigger: '.sc-feature .group-core .content-inner3',
    start: 'center center',
    end: 'bottom+=700 bottom',
    scrub: true,
  },
  onStart: () => {  // 애니메이션 시작 시 배경 블록의 가상요소 opacity 1로 변경
    gsap.to('.sc-feature .group-core .content-inner3 .bg-block', { '--after-opacity': 1, duration: 0 });
  },
  onReverseComplete: () => {  // 애니메이션 역방향 완료 시 배경 블록의 가상요소 opacity 0로 변경
    gsap.to('.sc-feature .group-core .content-inner3 .bg-block', { '--after-opacity': 0, duration: 0 });
  },
});

// 가로스크롤 카드1
const animaCard1 = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-feature .group-core .content-inner4 .sticky-wrapper',
    scrub: true,
    start: 'top top',
    end: 'bottom bottom',
    // markers: true,
  }
});

const cardItem = '.sc-feature .group-core .content-inner4 .flex-card .card-item';

animaCard1.to('.sc-feature .group-core .content-inner4 .horizontal', {
  x: () => {
    // headline 요소의 너비만큼 왼쪽으로 이동
    const headline = document.querySelector('.sc-feature .group-core .content-inner4 .headline');
    return headline.offsetWidth * -1;
  }
})
  .to(`${cardItem}:nth-child(2)`, {
    xPercent: 100 * -1, // 카드 요소 너비만큼 왼쪽으로 이동
    x: 40 * -1  // gap 크기만큼 왼쪽으로 이동
  }, 'move')
  .to(`${cardItem}:nth-child(3)`, {
    xPercent: 100 * -2,
    x: 40 * -2
  }, 'move')
  .to(`${cardItem}:nth-child(4)`, {
    xPercent: 100 * -3,
    x: 40 * -3
  }, 'move')
  .to('.sc-feature .group-core .content-inner4 .icon', {
    opacity: 0,
    duration: 0.5,
    onComplete: () => { // 애니메이션 완료 시 아이콘 활성화
      $('.sc-feature .group-core .content-inner4 .icon').addClass('active');
    },
  }, 'move')
  .to('.sc-feature .group-core .content-inner4 .icon', {
    opacity: 1,
    duration: 0.5,
    onReverseComplete: () => { // 애니메이션 역방향 완료 시 아이콘 비활성화
      $('.sc-feature .group-core .content-inner4 .icon').removeClass('active');
    }
  }, 'move+=0.5') // 'move' 애니메이션 완료 후 0.5초 뒤에 실행

  .set(`${cardItem}:nth-child(1)`, {  // 카드아이템 숨김
    autoAlpha: 0
  })
  .set(`${cardItem}:nth-child(2)`, {
    autoAlpha: 0
  })
  .set(`${cardItem}:nth-child(3)`, {
    autoAlpha: 0
  })
  .to('.sc-feature .group-core .content-inner4 .icon', {
    opacity: 0,
  });


// 이전 카드 숨기고 새로운 카드 표시하는 애니메이션을 위해 모든 카드 숨김 설정
gsap.set('.sc-feature .group-second .content-inner1 .card-type1', { autoAlpha: 0 });
gsap.set('.sc-feature .group-second .content-inner2 .card-type1', { autoAlpha: 0 });
gsap.set('.sc-feature .group-second .content-inner3 .card-type1', { autoAlpha: 0 });

const animaCard2 = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-feature .group-second .content-inner1',
    start: 'top top',
    end: 'top+=500 top',
    scrub: true,
    // markers: true,
    onEnter: () => { // 트리거 영역에 진입했을 때 실행
      gsap.set('.sc-feature .group-core .content-inner4 .flex-card', { autoAlpha: 0 });  // 이전 카드 숨김
      gsap.set('.sc-feature .group-second .content-inner1 .card-type1', { autoAlpha: 1 });  // 새로운 카드 표시
    },
    onLeaveBack: () => { // 트리거 영역을 벗어났을 때 실행
      gsap.set('.sc-feature .group-core .content-inner4 .flex-card', { autoAlpha: 1 });  // 이전 카드 표시
      gsap.set('.sc-feature .group-second .content-inner1 .card-type1', { autoAlpha: 0 });  // 새로운 카드 숨김
    },
  }
});
animaCard2.to('.sc-feature .group-second .content-inner1 .card-type1 .text', { opacity: 1 });


const animaCard3 = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-feature .group-second .content-inner2',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    // markers: true,
    onEnter: () => { // 트리거 영역에 진입했을 때 실행
      $('.sc-feature .group-second .content-inner2 .bg').addClass('blur');  // 카드 배경 블러 처리
      gsap.set('.sc-feature .group-second .content-inner1 .card-type1', { autoAlpha: 0 });  // 이전 카드 숨김
      gsap.set('.sc-feature .group-second .content-inner2 .card-type1', { autoAlpha: 1 });  // 새로운 카드 표시
    },
    onLeaveBack: () => { // 트리거 영역을 벗어났을 때 실행
      gsap.set('.sc-feature .group-second .content-inner1 .card-type1', { autoAlpha: 1 });  // 이전 카드 표시
      gsap.set('.sc-feature .group-second .content-inner2 .card-type1', { autoAlpha: 0 });  // 새로운 카드 숨김
    }
  }
});

const cardItem2 = '.sc-feature .group-second .content-inner2 .flex-card .card-item';

animaCard3.to(`${cardItem2}:nth-child(2)`, {
  xPercent: 100 * -1, // 카드 요소 너비만큼 왼쪽으로 이동
  x: 40 * -1 // gap 크기만큼 왼쪽으로 이동
}, '<')
  .to(`${cardItem2}:nth-child(3)`, {
    xPercent: 100 * -2,
    x: 40 * -2
  }, '<')
  .to(`${cardItem2}:nth-child(4)`, {
    xPercent: 100 * -3,
    x: 40 * -3
  }, '<')
  .set(`${cardItem2}:nth-child(2)`, {
    autoAlpha: 0 // 카드 아이템 숨김
  })
  .set(`${cardItem2}:nth-child(3)`, {
    autoAlpha: 0
  })
  .set(`${cardItem2}:nth-child(4)`, {
    autoAlpha: 0
  });


const animaCard4 = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-feature .group-second .content-inner3',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    // markers: true,
    onEnter: () => { // 트리거 영역에 진입했을 때 실행
      gsap.set('.sc-feature .group-second .content-inner2 .card-type1', { autoAlpha: 0 });  // 이전 카드 숨김
      gsap.set('.sc-feature .group-second .content-inner3 .card-type1', { autoAlpha: 1 });  // 새로운 카드 표시
    },
    onLeaveBack: () => { // 트리거 영역을 벗어났을 때 실행
      gsap.set('.sc-feature .group-second .content-inner2 .card-type1', { autoAlpha: 1 });  // 이전 카드 표시
      gsap.set('.sc-feature .group-second .content-inner3 .card-type1', { autoAlpha: 0 });  // 새로운 카드 숨김
    }
  }
});
animaCard4.to('.sc-feature .group-second .content-inner3 .desc', {
  opacity: 1
})
  .to('.sc-feature .group-second .content-inner3 .card-type1', {
    '--before-opacity': 1, // 가상요소 스타일 변경을 위해 CSS변수 정의
    duration: 0.5,
  }, '<')
  .to({}, { duration: 1 }); // 애니메이션 마지막에 지연시간 추가



// 비전영역 스크롤 표시 영역 활성화 (토글) 및 동적 업데이트
const animaVision = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-vision .content-inner3',
    scrub: 0,
    start: 'top top',
    end: 'bottom bottom',
    // markers: true,
    invalidateOnRefresh: true,  // 브라우저 크기가 변경될 때마다 ScrollTrigger 재계산
    toggleClass: {
      // 스크롤 표시 영역 활성화 (토글)
      targets: '.sc-vision .content-inner3 .scroll-area',
      className: 'active'
    },
    onUpdate: (self) => {
      // 스크롤 표시 영역 업데이트
      if (self.progress > 0.5) {
        // 스크롤 진행 상황이 0.5를 초과할 경우
        $('.sc-vision .content-inner3 .card-item:nth-child(3) .bg').addClass('blur');  // 카드 배경 블러 처리
        gsap.to('.sc-vision .content-inner3 .card-item:nth-child(3) .content', {
          autoAlpha: 1,
          duration: 0.2
        });
        gsap.to('.sc-vision .content-inner3 .scroll-area .tradition', {
          autoAlpha: 0,
          duration: 0.2
        });
        gsap.to('.sc-vision .content-inner3 .scroll-area .future', {
          autoAlpha: 1,
          duration: 0.2
        });
      } else {
        // 스크롤 진행 상황이 0.5 미만일 경우
        gsap.to('.sc-vision .content-inner3 .scroll-area .tradition', {
          autoAlpha: 1,
          duration: 0.2
        });
        gsap.to('.sc-vision .content-inner3 .scroll-area .future', {
          autoAlpha: 0,
          duration: 0.2
        });
      }
    }
  }
});

// 비전영역 가로스크롤
animaVision.to('.sc-vision .content-inner3 .horizontal', {
  xPercent: -100, // 요소크기만큼 왼쪽으로 이동
  x: () => {
    return window.innerWidth; // 현재 브라우저 너비만큼 오른쪽으로 이동
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
  }
});

animaCase
  .to('.sc-case .content-inner1 .text-area', {
    opacity: 1,
  })
  .to('.sc-case .content-inner1 .ic-scroll', {
    opacity: 1,
    delay: 1
  }, '<')
  .to('.sc-case .content-inner1 .text-area', {
    opacity: 0,
  })
  .to('.sc-case .content-inner1 .ic-scroll', {
    opacity: 0,
  }, '<');


// 가로스크롤 case
gsap.to('.sc-case .content-inner2 .horizontal', {
  xPercent: -100, // 요소크기만큼 왼쪽으로 이동
  x: () => {
    return window.innerWidth; // 현재 브라우저 너비만큼 오른쪽으로 이동
  },
  scrollTrigger: {
    trigger: '.sc-case .content-inner2',
    scrub: 0,
    start: 'top top',
    end: 'bottom bottom',
    // markers: true,
    invalidateOnRefresh: true,  // 브라우저 크기가 변경될 때마다 ScrollTrigger 재계산
  }
});

//marquee
ScrollTrigger.create({
  trigger: '#footer',
  start: '99% bottom',
  end: 'bottom bottom',
  scrub: true,
  // markers: true,
  onEnter: () => { // 트리거 영역에 진입했을 때 실행
    $('.banner-marquee').addClass('show');
  },
  onLeaveBack: () => { // 트리거 영역을 벗어났을 때 실행
    $('.banner-marquee').removeClass('show');
  }
})