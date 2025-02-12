// GSAP 기본 설정
gsap.defaults({
  duration: 1,
  ease: 'none'
});

// Lenis 초기화 함수
let lenis = null;
let lenisTicker = null;
function initializeLenis() {
  if (!lenis) { // 중복 초기화 방지

    // Lenis 인스턴스 초기화
    lenis = new Lenis({
      duration: 1.2,  // 스크롤 부드러움의 강도
    })

    // Lenis 스크롤을 GSAP ScrollTrigger와 동기화
    lenis.on('scroll', ScrollTrigger.update) // 스크롤 이벤트 발생 할 때마다 ScrollTrigger 업데이트
    // GSAP의 'time' 값을 사용하여 Lenis의 애니메이션 프레임을 요청
    lenisTicker = (time) => {
      if (lenis) {  // Lenis 인스턴스가 존재하는 동안만 raf(time)를 호출 
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
  if (!container) { // 요소가 존재하지 않으면 초기화X
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
// 첫 번째 Lottie 애니메이션 초기화
const lottie1 = initializeLottie({ selector: '.lottie-1', path: 'assets/data/lottie-1.json', loop: false, autoplay: false });

//eventListener 관리용 함수 (반응형 처리) 
function addEvent(eventListeners, element, type, listener) {
  element.addEventListener(type, listener); // 이벤트 리스너 추가
  eventListeners.push({ element, type, listener }); // 이벤트 리스너를 배열에 저장
}

//swiper
const labels = ['NU-FRAME', 'Legodt', 'NORD', 'SISSONNE', 'LAGOA'];
const mainSlide = new Swiper('.sc-visual .swiper', {
  loop: true,
  parallax: true,
  speed: 1500,
  autoplay: {
    delay: 5000,
  },
  allowTouchMove: false,
  pagination: {
    el: '.sc-visual .swiper .swiper-pagination',
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' +
        '<span class="swiper-pagination-label">' + labels[index] + '</span>' +
        '</span>';
    }
  },
});

// 헤더 색상 전환 애니메이션 (비주얼 섹션)
let headerHeight
let animateHeader = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-visual',
    start: () => {
      headerHeight = document.querySelector('.header-inner').offsetHeight; // 헤더 높이 계산
      return `bottom-=${headerHeight} top`;
    },
    end: 'bottom top',
    scrub: true,
    // markers: true,
  }
});
animateHeader
  .to('.header-inner.dark', {
    'clip-path': 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // 상단0% 하단100% 상태 (사각형)   
  })
  .fromTo('.header-inner.white', {
    'clip-path': 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // 상단0% 하단100% 상태 (사각형)  
  }, {
    'clip-path': 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', // 상단0% 하단0% 상태 (형태없음)
  }, '<');

// 헤더 색상 전환 애니메이션 (푸터)
let animateHeader2 = gsap.timeline({
  scrollTrigger: {
    trigger: '#footer',
    start: () => {
      headerHeight = document.querySelector('.header-inner').offsetHeight; // 헤더 높이 계산
      return `top-=${headerHeight} top`
    },
    end: 'top top',
    scrub: true,
    // markers: true,
  }
});
animateHeader2
  .to('.header-inner.dark', {
    'clip-path': 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', // 상단0% 하단0% 상태 (형태없음)
  })
  .fromTo('.header-inner.white', {
    'clip-path': 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', // 상단100% 하단100% 상태 (형태없음)
  }, {
    'clip-path': 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // 상단0% 하단100% 상태 (사각형) 
  }, '<')
  .to('.header-inner.white .link-odense', {
    opacity: 0,
    duration: 0.1,
  }, '<')

// 위에서 fromTo()로 초기값이 설정되었기 때문에 원하는 초기값으로 다시 설정
gsap.set('.header-inner.dark', {
  'clip-path': 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', // 상단100% 하단100% 상태 (형태없음)
});
gsap.set('.header-inner.white', {
  'clip-path': 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // 상단0% 하단100% 상태 (사각형)
});

// visual섹션 컨테이너 축소, 모서리 라운딩 애니메이션
const animaVisual = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-visual',
    start: 'bottom 90%',
    end: '55% top',
    scrub: 1,     // 스크롤 속도에 따른 애니메이션 부드러움 정도
    invalidateOnRefresh: true, // 페이지 새로고침 시 애니메이션 재계산
    // markers: true,
  }
});
animaVisual
  .to('.sc-visual .mask-content', { // 컨테이너 크기축소 및 모서리 라운딩
    scaleX: 0.975,
    borderBottomLeftRadius: '32px',
    borderBottomRightRadius: '32px',
  })
  .to('.sc-visual .swiper', { // 스와이퍼 확대 (컨테이너와 동일한 비율로 확대하여 이미지 크기는 유지되면서 컨테이너만 줄어드는 효과)
    scaleX: 1.025,
  }, '<')
  .to('.sc-visual .bottom .line', { // 하단 라인 너비 감소
    width: '0'
  }, '<')
  .to('.sc-visual .bottom .text:last-child', { // 하단 텍스트 왼쪽으로 이동
    x: -64,
    duration: 0.1,
  });


// 제품상세섹션 header배경 컬러->투명 전환
ScrollTrigger.create({
  trigger: '.sc-project .group-detail',
  start: 'top top',
  end: 'top top',
  // markers: true,
  onEnter: () => {
    $('.header-inner').addClass('transparent');
  },
  onLeaveBack: () => {
    $('.header-inner').removeClass('transparent');
  }
})

// 업적섹션 header배경 투명->컬러 전환
ScrollTrigger.create({
  trigger: '.sc-achieve .sticky-content',
  start: 'bottom top',
  end: 'bottom top',
  // markers: true,
  onEnter: () => {
    $('.header-inner').removeClass('transparent');
  },
  onLeaveBack: () => {
    $('.header-inner').addClass('transparent');
  }
})

// 푸터 header배경 컬러->투명 전환
ScrollTrigger.create({
  trigger: '#footer',
  start: 'top 50%',
  end: 'top 50%',
  // markers: true,
  onEnter: () => {
    $('.header-inner').addClass('transparent');
  },
  onLeaveBack: () => {
    $('.header-inner').removeClass('transparent');
  }
})

// 업적섹션 가로스크롤
gsap.to('.sc-achieve .group-figure .sticky-content .horizontal', {
  xPercent: -100,
  scrollTrigger: {
    trigger: '.sc-achieve .group-figure',
    scrub: 1,
    start: '10% top',
    end: 'bottom bottom',
    // markers: true,
  }
});

// 푸터 컨테이너 축소, 모서리 라운딩 -> 원래대로
let animateFooter = gsap.timeline({
  scrollTrigger: {
    trigger: '#footer',
    start: 'top 80%',
    end: 'top 60%',
    scrub: 1,
    // markers: true,
  }
});
animateFooter.from('#footer', {
  scaleX: 0.975,
  borderTopLeftRadius: '32px',
  borderTopRightRadius: '32px',
})
  .from('.footer-inner', {
    scaleX: 1.025,
  }, '<')


/* matchMedia */
const mm = gsap.matchMedia(); // 미디어 쿼리 관리 객체
mm.add('(min-width: 1025px)', () => {
  // 1025px 이상일 때만 애니메이션을 실행 (데스크탑)

  const eventListeners = []; // eventListener 추적용 배열 

  initializeLenis(); // Lenis 초기화

  // 호버 이벤트 함수
  function handleHover(content, onEnter, onLeave) {
    addEvent(eventListeners, content, 'mouseenter', onEnter); // mouseenter 이벤트리스너 등록 및 배열추가
    addEvent(eventListeners, content, 'mouseleave', onLeave); // mouseleave 이벤트리스너 등록 및 배열추가
  }

  // 버튼 호버 애니메이션
  const btnArrows = document.querySelectorAll('.arrow'); // 버튼 요소들

  btnArrows.forEach(button => {
    const shape = button.querySelector('.shape'); // 버튼 내부의 shape 요소 선택

    handleHover(button, () => {
      // 마우스 진입(mouseenter)시 동작
      gsap.set(shape, {
        '--opacity': 1, // shape의 가상요소(화살표 아이콘) opacity 설정
      });
      gsap.to(shape, {
        scale: 1,
        duration: 0.1,
      });
      gsap.to(shape, {
        '--translate-x': '0px', // shape의 가상요소 translate 설정 (가운데 위치)
        '--translate-y': '0px',
        duration: 0.2,
      });
    }, () => {
      // 마우스 이탈(mouseleave)시 동작
      gsap.to(shape, {
        scale: 0.25,
        duration: 0.2,
      });
      gsap.to(shape, {
        '--translate-x': '25px',  // shape의 가상요소 translate 설정 (오른쪽 상단 위치)
        '--translate-y': '-25px',
        duration: 0.1,
        onComplete: () => { // 애니메이션 완료 후 동작 (애니메이션 완료 후 초기상태 재설정)
          setTimeout(() => { // 100ms 대기 후 동작 
            gsap.set(shape, {
              '--opacity': 0, // shape의 가상요소 opacity 설정
              '--translate-x': '-25px', // shape의 가상요소 translate 설정 (왼쪽 하단 위치)
              '--translate-y': '25px',
            });
          }, 100);
        }
      });
    });
  });

  // 프로젝트 카테고리 링크 호버 애니메이션
  const linkCates = document.querySelectorAll('.link-cate'); // 카테고리 링크 요소들

  linkCates.forEach(linkCate => {
    const imgPreview = linkCate.querySelector('.img-preview'); // 이미지 컨테이너

    let hoverAnimate = gsap.timeline({ paused: true }); // 호버 시 실행될 GSAP 타임라인 생성 (일시 정지 상태로 초기화)
    hoverAnimate.to(imgPreview, {
      autoAlpha: 1, // 이미지 컨테이너 표시
      duration: 0.3,
    })
    // 첫 번째 이미지를 제외한 나머지 이미지들에 대한 애니메이션
    hoverAnimate.from(imgPreview.querySelectorAll('img:not(:first-child)'), {
      scale: 0, // 크기 0에서 시작
      stagger: 1, // 각 이미지 애니메이션 간격 설정 (1초마다 애니메이션 실행)
      repeat: -1, // 애니메이션 반복 설정 (무한 반복)
    }, '<');

    // 호버 이벤트 처리
    handleHover(linkCate, () => {
      // 마우스 진입 시
      hoverAnimate.play(); // 애니메이션 재생
    }, () => {
      // 마우스 이탈 시
      gsap.to(imgPreview, {
        autoAlpha: 0, // 이미지 컨테이너 숨김
        duration: 0.2,
        onComplete: () => { // 애니메이션 완료 후 동작
          hoverAnimate.pause(); // 애니메이션 일시정지
          hoverAnimate.progress(0); // 애니메이션을 처음 상태로 리셋 
        }
      });
    });

    // 커서가 요소 위에서 이동할 때 이미지 컨테이너가 커서의 중앙에 위치하도록 위치 조정
    addEvent(eventListeners, linkCate, 'mousemove', (e) => {

      const rect = linkCate.getBoundingClientRect(); // 요소의 위치와 크기 정보를 포함하는 객체

      // 커서의 요소 내 상대 좌표 계산
      // clientX/Y(브라우저 내부 좌표)에서 요소의 왼쪽/위쪽 좌표를 빼서 요소 내부에서의 커서 위치를 구함
      const x = e.clientX - rect.left; // 요소 내 커서의 X 좌표
      const y = e.clientY - rect.top;  // 요소 내 커서의 Y 좌표

      // 요소의 중심점 계산 (요소 크기의 절반)
      const halfWidth = rect.width * 0.5;  // 요소 너비의 절반
      const halfHeight = rect.height * 0.5; // 요소 높이의 절반

      // 커서 좌표를 요소 중심점 기준으로 조정 (이미지 컨테이너의 기본 위치가 요소의 정중앙으로 설정되어 있기 때문에)
      // 중심점을 (0,0)으로 하는 상대 좌표로 변환 (이미지 컨테이너가 커서의 중앙에 위치하도록 조정하기 위한 좌표)
      const adjustedX = x - halfWidth;  // 중심점 기준 X 좌표 (-: 왼쪽, +: 오른쪽)
      const adjustedY = y - halfHeight; // 중심점 기준 Y 좌표 (-: 위쪽, +: 아래쪽)

      // 이미지 컨테이너의 위치 업데이트 (커서의 중앙에 위치하도록 조정)
      gsap.to(imgPreview, {
        duration: 0.3,
        x: adjustedX,
        y: adjustedY,
      });
    });
  });

  // 제품상세 섹션 애니메이션
  const projectAnimate = gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-project .group-detail',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true, // 페이지 새로고침 시 애니메이션 재계산
      // markers: true,
    }
  });
  // 타임라인 1 (카테고리명 표시 + 콘텐츠 표시 + 첫번째 콘텐츠 애니메이션)
  projectAnimate.to('.sc-project .bottom-fix', { // 하단 카테고리명 표시
    autoAlpha: 1,
    duration: 0.1,
  })
    .to('.sc-project .group-detail .content', { // 콘텐츠 확대 (9개)
      scale: 1,
    })
    // 첫번째 요소 확대 + 축소
    .to('.sc-project .group-detail .project-wrap:nth-child(1) .pro-item:nth-child(1) .mask', {
      width: '160%',
      height: '160%',
      yoyo: true, // 역방향으로 다시 실행
      repeat: 1, // 애니메이션 반복 횟수
    }, '<')
    // 첫번째 요소 텍스트 표시 + 숨김
    .fromTo('.sc-project .group-detail .project-wrap:nth-child(1) .pro-item:nth-child(1) .text-area', {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, '<')

    // 타임라인 2 (래퍼 왼쪽으로 이동 + 두번째, 세번째 요소 애니메이션)
    .to('.sc-project .group-detail .content-wrapper', { // 래퍼 왼쪽으로 이동
      x: '-180vh',
      duration: 2,
      delay: -1, // 일찍 실행하여 첫번째 요소가 축소될 때 실행
    })
    // 두번째 요소 확대 + 축소
    .to('.sc-project .group-detail .project-wrap:nth-child(1) .pro-item:nth-child(2) .mask', {
      width: '160%',
      height: '160%',
      yoyo: true,
      repeat: 1,
    }, '<')
    // 두번째 요소 텍스트 표시 + 숨김
    .fromTo('.sc-project .group-detail .project-wrap:nth-child(1) .pro-item:nth-child(2) .text-area', {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, '<')
    // 세번째 요소 확대 + 축소
    .to('.sc-project .group-detail .project-wrap:nth-child(1) .pro-item:nth-child(3) .mask', {
      width: '160%',
      height: '160%',
      yoyo: true,
      repeat: 1,
      delay: 0.4,
    }, '<')
    // 세번째 요소 텍스트 표시 + 숨김
    .fromTo('.sc-project .group-detail .project-wrap:nth-child(1) .pro-item:nth-child(3) .text-area', {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, '<')
    // 타임라인3 (래퍼 위로 이동 + 카테고리 명 전환 + 네번째 요소 애니메이션)
    .to('.sc-project .group-detail .content-wrapper', { // 래퍼 위로 이동
      y: '-90vh',
      duration: 1,
      delay: -1,  // 일찍 실행하여 세번째 요소가 축소될 때 실행
    })
    // 네번째 요소 확대 + 축소
    .to('.sc-project .group-detail .project-wrap:nth-child(2) .pro-item:nth-child(3) .mask', {
      width: '160%',
      height: '160%',
      yoyo: true,
      repeat: 1,
    }, '<')
    // 네번째 요소 텍스트 표시 + 숨김
    .fromTo('.sc-project .group-detail .project-wrap:nth-child(2) .pro-item:nth-child(3) .text-area', {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, '<')
    .to('.sc-project .bottom-fix .mask-text .text', { // 하단 카테고리명 전환
      yPercent: -100,
      duration: 0.1,
      delay: -0.2,
    }, '<')
    // 타임라인4 (래퍼 오른쪽으로 이동 + 다섯번째, 여섯번째 요소 애니메이션)
    .to('.sc-project .group-detail .content-wrapper', { // 래퍼 오른쪽으로 이동
      x: '0vh',
      duration: 2,
      delay: -1, // 일찍 실행하여 네번째 요소가 축소될 때 실행
    })
    // 다섯번째 요소 확대 + 축소
    .to('.sc-project .group-detail .project-wrap:nth-child(2) .pro-item:nth-child(2) .mask', {
      width: '160%',
      height: '160%',
      yoyo: true,
      repeat: 1,
    }, '<')
    // 다섯번째 요소 텍스트 표시 + 숨김
    .fromTo('.sc-project .group-detail .project-wrap:nth-child(2) .pro-item:nth-child(2) .text-area', {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, '<')
    // 여섯번째 요소 확대 + 축소
    .to('.sc-project .group-detail .project-wrap:nth-child(2) .pro-item:nth-child(1) .mask', {
      width: '160%',
      height: '160%',
      yoyo: true,
      repeat: 1,
      delay: 0.4,
    }, '<')
    // 여섯번째 요소 텍스트 표시 + 숨김
    .fromTo('.sc-project .group-detail .project-wrap:nth-child(2) .pro-item:nth-child(1) .text-area', {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, '<')
    // 타임라인5 (래퍼 아래로 이동 + 카테고리 명 전환 + 일곱번째 요소 애니메이션)
    .to('.sc-project .group-detail .content-wrapper', { // 래퍼 아래로 이동
      y: '-180vh',
      duration: 1,
      delay: -1, // 일찍 실행하여 여섯번째 요소가 축소될 때 실행
    })
    // 일곱번째 요소 확대 + 축소
    .to('.sc-project .group-detail .project-wrap:nth-child(3) .pro-item:nth-child(1) .mask', {
      width: '160%',
      height: '160%',
      yoyo: true,
      repeat: 1,
    }, '<')
    // 일곱번째 요소 텍스트 표시 + 숨김
    .fromTo('.sc-project .group-detail .project-wrap:nth-child(3) .pro-item:nth-child(1) .text-area', {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, '<')
    // 하단 카테고리명 전환
    .to('.sc-project .bottom-fix .mask-text .text', {
      yPercent: -100 * 2,
      duration: 0.1,
      delay: -0.2,
    }, '<')
    // 타임라인6 (래퍼 왼쪽으로 이동 + 여덟번째, 아홉번째 요소 애니메이션)
    .to('.sc-project .group-detail .content-wrapper', { // 래퍼 왼쪽으로 이동
      x: '-180vh',
      duration: 2,
      delay: -1, // 일찍 실행하여 일곱번째 요소가 축소될 때 실행
    })
    // 여덟번째 요소 확대 + 축소
    .to('.sc-project .group-detail .project-wrap:nth-child(3) .pro-item:nth-child(2) .mask', {
      width: '160%',
      height: '160%',
      yoyo: true,
      repeat: 1,
    }, '<')
    // 여덟번째 요소 텍스트 표시 + 숨김
    .fromTo('.sc-project .group-detail .project-wrap:nth-child(3) .pro-item:nth-child(2) .text-area', {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, '<')
    // 아홉번째 요소 확대 + 축소
    .to('.sc-project .group-detail .project-wrap:nth-child(3) .pro-item:nth-child(3) .mask', {
      width: '160%',
      height: '160%',
      yoyo: true,
      repeat: 1,
      delay: 0.4,
    }, '<')
    // 아홉번째 요소 텍스트 표시 + 숨김
    .fromTo('.sc-project .group-detail .project-wrap:nth-child(3) .pro-item:nth-child(3) .text-area', {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, '<')
    // 타임라인7 (이전 섹션 요소 -> 다음 섹션 요소 자연스럽게 겹치면서 전환)
    .to('.sc-project .group-detail .content-wrapper', {
      transformOrigin: "right bottom", // transform 기준점을 오른쪽 하단으로 설정
      scale: 1 / 3, // 다음 섹션 요소와 완벽히 겹치기 위해 똑같은 크기로 설정 (270vh -> 90vh) 
    })
    .fromTo('.sc-principle .col-right .content', { // 다음 섹션 요소
      width: '280vh', // 270vh + 10vh(padding) 이전 섹션 요소와 겹치기 위해 똑같은 크기 설정 
      height: '280vh',
    }, {
      width: '100vh', // 90vh + 10vh(padding) 이전 섹션 요소와 겹치기 위해 똑같은 크기 설정 
      height: '100vh',
    }, '<')
    .to('.sc-project .group-detail .content-wrapper', { // 이전 섹션 요소 숨김
      autoAlpha: 0,
      duration: 0.2,
      delay: 0.6,
    }, '<')
    .to('.sc-project .bottom-fix', { // 하단 카테고리명 숨김
      autoAlpha: 0,
      duration: 0.2,
    }, '<')
    .to('.sc-principle .col-right .content .prin-list', { // 다음 섹션 요소 표시
      autoAlpha: 1,
      duration: 0.2,
    }, '<')
    .to('.sc-principle .col-right .content', { // 요소 전환 이후 크기 조정
      width: '100%',
      height: '100%',
      duration: 0.2,
    })

  // 애니메이션 1.2배속 재생
  projectAnimate.timeScale(1.2);

  // 철학 섹션 애니메이션
  const princtAnimate = gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-principle',
      start: '24% top',
      end: 'bottom bottom',
      scrub: 1,
      // markers: true,
      invalidateOnRefresh: true, // 페이지 새로고침 시 애니메이션 재계산
    },
  });
  // 타임라인1 (1,6,7 테두리on, 텍스트on)
  princtAnimate
    .to('.sc-principle .prin-list .prin-item:nth-child(1)', { // 첫번째 요소 테두리 색상 변경
      borderColor: 'rgb(142, 123, 109)',
      duration: 1,
    })
    .to('.sc-principle .prin-list .prin-item:nth-child(1) .text', { // 첫번째 요소 텍스트 표시
      opacity: 1,
      duration: 1,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(6)', { // 여섯번째 요소 테두리 색상 변경
      borderColor: 'rgb(142, 123, 109)',
      duration: 1,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(6) .text', { // 여섯번째 요소 텍스트 표시
      opacity: 1,
      duration: 1,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(7)', { // 일곱번째 요소 테두리 색상 변경
      borderColor: 'rgb(142, 123, 109)',
      duration: 1,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(7) .text', { // 일곱번째 요소 텍스트 표시
      opacity: 1,
      duration: 1,
    }, '<')

    // 타임라인2 (이미지 전환 + 1,6,7 텍스트off)
    .to('.sc-principle .img-container:nth-child(3)', { // 이미지 전환
      height: 0,
    })
    .to('.sc-principle .mask-desc .desc', { // 텍스트 전환
      yPercent: -100,
      duration: 0.2,
    }, '<')
    .to('.sc-principle .mask-page .curr .number', { // 페이지 번호 전환
      yPercent: -100,
      duration: 0.2,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(1) .text', { // 첫번째 요소 텍스트 숨김
      opacity: 0,
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(6) .text', { // 여섯번째 요소 텍스트 숨김
      opacity: 0,
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(7) .text', { // 일곱번째 요소 텍스트 숨김
      opacity: 0,
      duration: 0.5,
    }, '<')

    // 타임라인3 (3,4,9 테두리on, 텍스트on)
    .to('.sc-principle .prin-list .prin-item:nth-child(3)', { // 세번째 요소 테두리 색상 변경
      borderColor: 'rgb(142, 123, 109)',
      duration: 0.5,
    })
    .to('.sc-principle .prin-list .prin-item:nth-child(3) .text', { // 세번째 요소 텍스트 표시
      opacity: 1,
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(4)', { // 네번째 요소 테두리 색상 변경
      borderColor: 'rgb(142, 123, 109)',
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(4) .text', { // 네번째 요소 텍스트 표시
      opacity: 1,
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(9)', { // 아홉번째 요소 테두리 색상 변경
      borderColor: 'rgb(142, 123, 109)',
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(9) .text', { // 아홉번째 요소 텍스트 표시
      opacity: 1,
      duration: 0.5,
    }, '<')

    // 타임라인4 (이미지 전환 + 3,4,9 텍스트off)
    .to('.sc-principle .img-container:nth-child(2)', { // 이미지 전환
      height: 0,
    })
    .to('.sc-principle .mask-desc .desc', { // 텍스트 전환
      yPercent: -100 * 2,
      duration: 0.2,
    }, '<')
    .to('.sc-principle .mask-page .curr .number', { // 페이지 번호 전환
      yPercent: -100 * 2,
      duration: 0.2,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(3) .text', { // 세번째 요소 텍스트 숨김
      opacity: 0,
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(4) .text', { // 네번째 요소 텍스트 숨김
      opacity: 0,
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(9) .text', { // 아홉번째 요소 텍스트 숨김
      opacity: 0,
      duration: 0.5,
    }, '<')

    // 타임라인5 (2,5,8 테두리on, 텍스트on + off)
    .to('.sc-principle .prin-list .prin-item:nth-child(2)', { // 두번째 요소 테두리 색상 변경
      borderColor: 'rgb(142, 123, 109)',
      duration: 0.5,
    })
    .to('.sc-principle .prin-list .prin-item:nth-child(2) .text', { // 두번째 요소 텍스트 표시 + 숨김
      opacity: 1,
      duration: 0.5,
      yoyo: true, // 역방향 애니메이션 실행
      repeat: 1,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(5)', { // 다섯번째 요소 테두리 색상 변경
      borderColor: 'rgb(142, 123, 109)',
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(5) .text', { // 다섯번째 요소 텍스트 표시 + 숨김
      opacity: 1,
      duration: 0.5,
      yoyo: true, // 역방향 애니메이션 실행
      repeat: 1,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(8)', { // 여덟번째 요소 테두리 색상 변경
      borderColor: 'rgb(142, 123, 109)',
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(8) .text', { // 여덟번째 요소 텍스트 표시 + 숨김
      opacity: 1,
      duration: 0.5,
      yoyo: true, // 역방향 애니메이션 실행
      repeat: 1,
    }, '<')

    // 타임라인6 (컨텐츠 숨김 + Lottie 표시 >> 자연스러운 전환)
    .to('.sc-principle .lottie-wrap', { // Lottie 애니메이션 표시
      opacity: 1,
      duration: 0.3,
    })
    .to('.sc-principle .col-right .content', { // 컨텐츠 숨김 
      opacity: 0,
      duration: 0.3,
    }, '<')

    // 타임라인7 (Lottie 애니메이션 표시 + 이전 섹션 숨김)
    .to('.sc-principle', {
      duration: 2,
      // 애니메이션 진행 상태에 따라 Lottie 프레임 업데이트
      onUpdate: function () { // 화살표 함수는 this가 상위 스코프를 참조하므로 this컨텍스트를 유지하기 위해 일반 함수를 사용
        const progress = this.progress(); // 현재 애니메이션의 진행도(0~1) 
        const curr = progress * lottie1.totalFrames; // 진행도에 따른 현재 프레임 계산
        lottie1.goToAndStop(curr, true); // 계산된 프레임으로 Lottie 애니메이션 이동
      }
    })
    .to('.sc-principle .lottie-wrap', { // Lottie 영역 전체화면으로 확대
      width: '100%',
      duration: 0.5,
    }, '<')
    .to('.sc-principle .lottie-wrap .lottie-1', { // Lottie 영역 패딩 제거 
      padding: 0,
      duration: 0.5,
      delay: 0.5,
    }, '<')
    .to('.sc-principle .content-wrapper', { // 이전 섹션 숨김
      display: 'none',
      duration: 0.1,
    }, '<')
    .to('.sc-principle .lottie-wrap', { // Lottie 영역 배경 투명화
      backgroundColor: 'rgba(206, 219, 229, 0)',
      delay: 0.5,
      duration: 0.1,
    }, '<')

  // 클린업 함수 (matchMedia 종료 시 실행)
  return () => {
    // lenis 객체가 존재하면 제거
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
    // 등록된 모든 이벤트 리스너 제거
    eventListeners.forEach(data => {
      data.element.removeEventListener(data.type, data.listener);
    })
  };
});

mm.add('(max-width: 1024px)', () => {
  // 1024px 이하일 때만 애니메이션을 실행 (태블릿/모바일)

  // 제품상세 섹션 애니메이션
  const proItems = document.querySelectorAll('.sc-project .group-detail .project-wrap .pro-item');
  const visibleItems = Array.from(proItems).slice(1); // 첫 번째 요소를 제외한 모든 요소 (표시될 요소들)
  const hiddenItems = Array.from(proItems).slice(0, -1); // 마지막 요소를 제외한 모든 요소 (숨겨질 요소들)

  const projectAnimate = gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-project .group-detail',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 1,
      // markers: true,
    }
  });
  projectAnimate
    .to('.sc-project .group-detail .content', { // 콘텐츠 크기를 원래 크기로 확대
      scale: 1,
    })
    .to('.sc-project .bottom-fix', { // 하단 카테고리명 표시
      autoAlpha: 1,
      duration: 0.1,
      delay: 0.1,
    })

    // fadeIn/fadeOut 애니메이션
    .from(visibleItems, { // 표시될 요소들 애니메이션 (2~9)
      autoAlpha: 0,
      stagger: { // 요소들을 순차적으로 애니메이션 적용
        each: 1, // 1초 간격으로 애니메이션 시작
      },
    })
    .to(hiddenItems, { // 숨겨질 요소들 애니메이션 (1~8)
      autoAlpha: 0,
      delay: 1,
      stagger: {
        each: 1,
      },
    }, '<')
    .to('.sc-project .bottom-fix .mask-text .text', { // 하단 카테고리명 전환 
      yPercent: -100,
      duration: 0.1,
      delay: 1.5, // stagger 중간으로 타이밍 조정
    }, '<')
    .to('.sc-project .bottom-fix .mask-text .text', { // 하단 카테고리명 전환 
      yPercent: -200,
      duration: 0.1,
      delay: 3,// stagger 중간으로 타이밍 조정
    }, '<')
    .to('.sc-project .bottom-fix', { // 하단 카테고리명 숨김
      autoAlpha: 0,
      duration: 0.1,
    })
    .to('.sc-project .bottom-fix', { // 애니메이션 마지막에 지연시간 추가
      duration: 0.1,
    })


  // 철학섹션 애니메이션
  const princtAnimate = gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-principle',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      // markers: true,
      invalidateOnRefresh: true, // 브라우저 크기가 변경될 때마다 ScrollTrigger 재계산
    },
  });

  // 타임라인1 (1,6,7 테두리on, 텍스트on)
  princtAnimate
    .to('.sc-principle .prin-list .prin-item:nth-child(1)', { // 첫번째 요소 테두리 색상 변경
      borderColor: 'rgb(142, 123, 109)',
      duration: 1,
    })
    .to('.sc-principle .prin-list .prin-item:nth-child(1) .text', { // 첫번째 요소 텍스트 표시
      opacity: 1,
      duration: 1,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(6)', { // 여섯번째 요소 테두리 색상 변경
      borderColor: 'rgb(142, 123, 109)',
      duration: 1,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(6) .text', { // 여섯번째 요소 텍스트 표시
      opacity: 1,
      duration: 1,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(7)', { // 일곱번째 요소 테두리 색상 변경
      borderColor: 'rgb(142, 123, 109)',
      duration: 1,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(7) .text', { // 일곱번째 요소 텍스트 표시
      opacity: 1,
      duration: 1,
    }, '<')

    // 타임라인2 (이미지 전환 + 1,6,7 텍스트off)
    .to('.sc-principle .img-container:nth-child(3)', { // 이미지 전환
      height: 0,
    })
    .to('.sc-principle .mask-desc .desc', { // 텍스트 전환
      yPercent: -100,
      duration: 0.2,
    }, '<')
    .to('.sc-principle .mask-page .curr .number', { // 페이지 번호 전환
      yPercent: -100,
      duration: 0.2,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(1) .text', { // 첫번째 요소 텍스트 숨김
      opacity: 0,
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(6) .text', { // 여섯번째 요소 텍스트 숨김
      opacity: 0,
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(7) .text', { // 일곱번째 요소 텍스트 숨김
      opacity: 0,
      duration: 0.5,
    }, '<')

    // 타임라인3 (3,4,9 테두리on, 텍스트on)
    .to('.sc-principle .prin-list .prin-item:nth-child(3)', { // 세번째 요소 테두리 색상 변경   
      borderColor: 'rgb(142, 123, 109)',
      duration: 0.5,
    })
    .to('.sc-principle .prin-list .prin-item:nth-child(3) .text', { // 세번째 요소 텍스트 표시      
      opacity: 1,
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(4)', { // 네번째 요소 테두리 색상 변경   
      borderColor: 'rgb(142, 123, 109)',
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(4) .text', { // 네번째 요소 텍스트 표시   
      opacity: 1,
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(9)', { // 아홉번째 요소 테두리 색상 변경   
      borderColor: 'rgb(142, 123, 109)',
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(9) .text', { // 아홉번째 요소 텍스트 표시   
      opacity: 1,
      duration: 0.5,
    }, '<')

    // 타임라인4 (이미지 전환 + 3,4,9 텍스트off)
    .to('.sc-principle .img-container:nth-child(2)', { // 이미지 전환
      height: 0,
    })
    .to('.sc-principle .mask-desc .desc', { // 텍스트 전환
      yPercent: -100 * 2,
      duration: 0.2,
    }, '<')
    .to('.sc-principle .mask-page .curr .number', { // 페이지 번호 전환
      yPercent: -100 * 2,
      duration: 0.2,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(3) .text', { // 세번째 요소 텍스트 숨김
      opacity: 0,
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(4) .text', { // 네번째 요소 텍스트 숨김
      opacity: 0,
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(9) .text', { // 아홉번째 요소 텍스트 숨김
      opacity: 0,
      duration: 0.5,
    }, '<')

    // 타임라인5 (2,5,8 테두리on, 텍스트on + off)
    .to('.sc-principle .prin-list .prin-item:nth-child(2)', { // 두번째 요소 테두리 색상 변경   
      borderColor: 'rgb(142, 123, 109)',
      duration: 0.5,
    })
    .to('.sc-principle .prin-list .prin-item:nth-child(2) .text', { // 두번째 요소 텍스트 표시   
      opacity: 1,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(5)', { // 다섯번째 요소 테두리 색상 변경   
      borderColor: 'rgb(142, 123, 109)',
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(5) .text', { // 다섯번째 요소 텍스트 표시   
      opacity: 1,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(8)', { // 여덟번째 요소 테두리 색상 변경   
      borderColor: 'rgb(142, 123, 109)',
      duration: 0.5,
    }, '<')
    .to('.sc-principle .prin-list .prin-item:nth-child(8) .text', { // 여덟번째 요소 텍스트 표시   
      opacity: 1,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
    }, '<')

    // 타임라인6 (Lottie 표시 + 컨텐츠 숨김 >> 자연스럽게 전환)
    .to('.sc-principle .lottie-wrap', { // Lottie 영역 표시
      opacity: 1,
      duration: 0.3,
    })
    .to('.sc-principle .col-right .content', { // 컨텐츠 숨김
      opacity: 0,
      duration: 0.3,
    }, '<')

    // 타임라인7 
    .to('.sc-principle', { // 애니메이션 진행 상태에 따라 Lottie 프레임 업데이트
      duration: 2.5,
      onUpdate: function () { // 화살표 함수는 this가 상위 스코프를 참조하므로 this컨텍스트를 유지하기 위해 일반 함수를 사용
        const progress = this.progress(); // 현재 애니메이션의 진행도(0~1) 
        const curr = progress * lottie1.totalFrames; // 진행도에 따른 현재 프레임 계산
        lottie1.goToAndStop(curr, true); // 계산된 프레임으로 Lottie 애니메이션 이동
      }
    })
    .to('.sc-principle .lottie-wrap', { // Lottie 영역 전체화면으로 확대
      height: '100%',
      duration: 0.5,
    }, '<')
    .to('.sc-principle .lottie-wrap .lottie-1', { // Lottie 위치 조정
      y: '30vh',
      height: '130%',
    }, '<')
    .to('.sc-principle .lottie-wrap .lottie-1', { // Lottie 영역 패딩 제거
      padding: 0,
      duration: 0.5,
      delay: 0.5
    }, '<')
    .to('.sc-principle .content-wrapper', { // 이전 섹션 숨김
      display: 'none',
      duration: 0.1,
    }, '<')
    .to('.sc-principle .lottie-wrap .lottie-1', { // Lottie 위치 조정 (위로 올라가는 속도 빠르게)
      y: '-30vh',
      duration: 0.5,
      delay: 0.5,
    }, '<')
    .to('.sc-principle .lottie-wrap', { // Lottie 영역 배경 투명화
      backgroundColor: 'rgba(206, 219, 229, 0)',
      duration: 0.1,
    }, '<')
    .to('.sc-achieve .group-figure .img-container', { // 업적 섹션 이미지 표시 
      opacity: 1, // 모바일/태블릿 화면에서는 Lottie 배경이 투명해질 때 이미지가 보이기 때문에 미리 opacity 0으로 설정하고 애니메이션 중간에 opacity 1로 변경
      delay: 0.4,
      duration: 0.1,
    }, '<')
});
