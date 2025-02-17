// GSAP 기본 설정
gsap.defaults({
  duration: 1,
  ease: 'none'
});
// 커스텀 이징 함수 생성 (Ease-in-out에서 중간을 더 느리게 변형함)
CustomEase.create('customEase', 'M0,0 C0.173,0 0.241,0 0.322,0.094 0.401,0.187 0.447,0.461 0.5,0.6 0.543,0.716 0.572,0.786 0.679,0.878 0.752,0.941 0.869,1 1,1 ');

// Lenis 초기화 함수
let lenis = null;
let lenisTicker = null;

function initializeLenis() {
  if (!lenis) { // 중복 초기화 방지

    // Lenis 인스턴스 초기화
    lenis = new Lenis()

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

// 텍스트를 단어, 문자, 줄 단위로 분리하여 애니메이션에 사용할 수 있는 구조로 변환하는 함수
function splitText(element, type) {

  const $element = $(element); // DOM 요소 선택 (jQuery)
  let text = $element.html(); // 요소의 HTML 내용 가져오기 (태그 포함)

  // <br> 태그를 기준으로 텍스트를 줄 단위로 분리 
  // <br>이 없는 경우 전체 텍스트를 하나의 줄로 처리
  const lines = text.includes('<br>') ? text.split('<br>') : [text];

  // 기존 내용을 비우고 새로운 구조로 대체 예정
  $element.html('');

  // 각 줄을 처리
  lines.forEach(line => {
    let lineContent = '';  // 각 줄을 감싸는 wrapper 생성

    if (type === 'word') {  // 단어 단위로 분리
      line = line.replace(/\s+/g, ' ').trim();  // 연속된 공백을 단일 공백으로 변환, 문자열 양 끝에 있는 공백을 제거
      const words = line.split(' ');  // 공백을 기준으로 단어 분리
      words.forEach((word, index) => {
        // 각 단어를 split-word 클래스를 가진 span으로 감싸기
        // 마지막 단어가 아닌 경우에만 공백 추가 (단어 사이의 공백을 다시 추가)
        lineContent += `<span class="split-word">${word}</span>${index < words.length - 1 ? ' ' : ''}`;
      });

    } else if (type === 'char') {  // 문자 단위로 분리
      line = line.replace(/\s+/g, ' ').trim();  // 연속된 공백을 단일 공백으로 변환, 문자열 양 끝에 있는 공백을 제거
      const chars = line.split('');  // 문자열을 한 글자씩 분리
      chars.forEach(char => {
        if (char === ' ') {
          // 공백 문자는 &nbsp;로 변환하여 공백 유지
          lineContent += `<span class="split-char">&nbsp;</span>`;
        } else {
          // 일반 문자는 split-char 클래스를 가진 span으로 감싸기
          lineContent += `<span class="split-char">${char}</span>`;
        }
      });

    } else if (type === 'line') {  // 줄 단위로만 분리 (내부 콘텐츠는 그대로 유지)
      lineContent = line;
    }

    // 생성된 콘텐츠를 split-line 클래스를 가진 span으로 한 번 더 감싸기
    const $lineWrapper = $(`<span class="split-line">${lineContent}</span>`);

    // 처리된 줄을 원래 요소에 추가
    $element.append($lineWrapper);
  });
}

// scrambleText 함수 (텍스트를 무작위 문자로 스크램블하다가 원래 텍스트로 변환하는 애니메이션)
function animateScrambleText(element, duration) {
  const finalText = element.textContent.trim(); // 최종적으로 표시될 텍스트를 가져오고 앞뒤 공백 제거
  const chars = 'ZXY0@#*';   // 스크램블 효과에 사용될 무작위 문자들

  let iteration = 0;  // 텍스트 변환 진행 상태 추적 (0에서 시작하여 증가하면서 텍스트가 변환되는 위치를 결정)
  const totalIterations = 50;  //  전체 애니메이션을 50단계로 설정 (단계가 많을 수록 부드럽게 진행)

  // 프레임마다 iteration이 증가할 양을 계산하여 텍스트 길이에 관계없이 duration 시간 동안 균일하게 변환
  const increment = finalText.length / totalIterations;

  // GSAP 애니메이션 설정
  gsap.to({}, {
    duration: duration,  // 전체 애니메이션이 완료될 때까지의 시간(초)
    ease: 'none',
    onUpdate: function () {
      // 매 프레임마다 텍스트 업데이트
      element.textContent = finalText.split('').map((char, i) => {  // 문자열을 문자배열로 변환 후 map() 메서드를 사용하여 새로운 문자 배열로 반환
        // i < iteration: 현재 처리 중인 문자의 위치가 변환 지점보다 앞에 있는지 확인
        // true면 최종 텍스트의 해당 위치 문자를 표시
        // false면 무작위 문자를 표시 (아직 변환되지 않은 부분)
        // join('') 문자 배열을 다시 문자열로 결합
        return i < iteration ? finalText[i] : chars[Math.floor(Math.random() * chars.length)]; // 배열 chars에서 무작위로 선택된 인덱스에 해당하는 값을 반환
      }).join('');

      // iteration 값을 increment만큼 증가시키고 Math.min으로 최대값을 텍스트 길이로 제한
      iteration = Math.min(iteration + increment, finalText.length);
    },
    onComplete: () => element.textContent = finalText   // 애니메이션 완료 시 최종 텍스트로 설정
  });
}

// 문자열 처리
$('.a-reveal').each(function () {
  splitText(this, 'word');
});

$('.a-scramble').each(function () {
  splitText(this, 'line');
});

$('.a-opacity').each(function () {
  splitText(this, 'char');
});


// header 스크롤 애니메이션
let lastScroll = 0; // 마지막 스크롤 위치를 저장

$(window).scroll(function () {
  curr = $(this).scrollTop(); // 현재 스크롤 위치를 가져옴

  if (curr > 0) { // 스크롤 발생
    $('#header').addClass('scroll'); // 스타일 변경 클래스 (패딩축소)
  } else {
    $('#header').removeClass('scroll');
  }
  if (curr > lastScroll) { // 아래로 스크롤 시 (헤더 숨김)
    $('#header').addClass('hide');
  } else { // 위로 스크롤 시 (헤더표시)
    $('#header').removeClass('hide');
  }
  lastScroll = curr;
})


// 인트로 영역 애니메이션
const video = document.querySelector('.sc-intro .intro-video');

gsap.set('.sc-intro .group-visual .frame img', { // 인트로 영역 이미지 초기 설정
  scale: 2.2
});

let animateIntro = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-intro',
    start: '-1% top',
    end: 'bottom bottom',
    scrub: false,  // 스크롤과 애니메이션 동기화 안함
    // markers: true,
  },
  onComplete: () => { // 애니메이션 완료 시 

    mm.add('(min-width: 601px)', () => { // 브라우저 너비가 601px 이상일 때 실행 (모바일 화면에서는 X)

      // 인트로 영역 두번째 애니메이션 (1.첫 애니메이션이 끝나고 2.트리거 영역을 진입해야 실행되게 설정)
      let animateIntro2 = gsap.timeline({
        scrollTrigger: {
          trigger: '.sc-intro .group-visual',
          start: 'top center',
          end: 'top center',
          scrub: false,
          // markers: true,
        }
      });
      // 타임라인1
      animateIntro2.to('.sc-intro .group-visual .frame .rotator', { // 4개의 프레임 순차적으로 회전
        rotateY: 180,
        stagger: 0.2, // 각 요소간 0.2초 간격
        ease: 'power2.in', // in: 천천히 시작, 끝날 때 빠르게 
      })
        .to('.sc-intro .group-visual .img-area .frame', { // 프레임들에 패딩 추가 (프레임 사이에 생기는 라인에 맞춰서 간격 추가)
          'padding-right': '4px',
          stagger: 0.2,
          ease: 'power2.in',
        }, '<')
        .to('.sc-intro .group-visual .img-area .frame img:nth-child(1)', { // 회전과 동시에 첫번째 이미지 숨김 (두번째이미지 표시)
          display: 'none',
          stagger: 0.2,
          duration: 0.8,
          ease: 'power2.in',
        }, '<')
        .to('.sc-intro .group-visual .img-area', { // 이미지 영역 축소 (1.1 > 1)
          scale: '1',
          duration: 2,
          ease: 'customEase',
        }, '<')
        .to('.sc-intro .group-visual .img-area .frame img:nth-child(2)', { // 두번째 이미지 축소 (2.2 > 1)
          scale: '1',
          duration: 2,
          ease: 'customEase',
        }, '<')

        // 타임라인2
        .to('.sc-intro .group-visual .img-area', { // 이미지 영역 숨김
          autoAlpha: 0,
          duration: 0.2,
        })
        .to('.sc-intro .group-visual .video-area', { // 비디오 영역 표시
          autoAlpha: 1,
          duration: 0.2,
          onComplete: () => { // 표시 완료시 비디오 재생
            video.play();
          }
        }, '<')

        // 타임라인3
        .to('.sc-intro .group-visual .text-area .a-scramble', { // 텍스트 영역 표시
          autoAlpha: 1,
          duration: 1,
          stagger: {
            each: 0.25, // 각 요소간 0.25초의 지연시간 적용
            onStart: function () {
              // stagger된 각 요소의 애니메이션이 시작될 때마다 실행되는 콜백
              let target = this.targets()[0]; // 현재 애니메이션이 적용되는 대상 요소
              let targetChild = target.querySelectorAll('.split-line'); // 대상 요소 내의 모든 .split-line 요소 선택
              targetChild.forEach(child => { // 각 .split-line 요소에 대해 scrambleText 애니메이션 적용
                animateScrambleText(child, 2); // 2초 동안 스크램블 효과 실행
              });
            }
          }
        })
    });
  }
});
// 인트로 영역 첫 애니메이션 
animateIntro.fromTo('.sc-intro .headline .split-word', { yPercent: 100, }, { // text reveal 애니메이션
  yPercent: 0,
  ease: 'power4.out', // out: 빠르게 시작, 끝날 때 천천히
  stagger: 0.1 // 요소들 사이에 0.1초의 지연시간 적용
})
  .fromTo('.sc-intro .desc .split-word', { yPercent: 100, }, { // text reveal 애니메이션
    yPercent: 0,
    ease: 'power4.out',
    stagger: 0.1
  }, '<')
  .from('.sc-intro .group-visual .img-area', { // 이미지가 축소되는 애니메이션
    scale: '3',
    duration: 2,
    ease: 'customEase', // Ease-in-out에서 중간을 더 느리게 변형
  }, '<')
  .from('.sc-intro .group-visual .img-area .flex', { // 이미지가 위로 올라오는 애니메이션
    yPercent: 50,
    duration: 2,
    ease: 'customEase',
  }, '<');


// 소개 영역 애니메이션
let animateOverview = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-overview .content-inner',
    start: 'top bottom',
    end: 'bottom 20%',
    scrub: 1,
    // markers: true,
  }
});
animateOverview.from('.sc-overview .a-opacity .split-char', { // 문자 색상 전환 애니메이션
  'color': 'rgb(248, 248, 248)',
  duration: 5,
  stagger: 0.1, // 각 요소간 0.1초의 지연시간 적용
  onStart: () => {
    gsap.fromTo('.sc-overview .a-reveal .split-word', { // text reveal 애니메이션
      yPercent: 100,
    }, {
      yPercent: 0,
      ease: 'power4.out',
      stagger: {
        each: 0.1,
      },
    });
  }
})

// 성능 영역 타이틀 애니메이션 (text reveal)
ScrollTrigger.create({
  trigger: '.sc-perfor .content-inner',
  start: 'top bottom',
  end: 'top+=30% bottom',
  scrub: false,
  // markers: true,
  onEnter: () => {
    gsap.fromTo('.sc-perfor .a-reveal .split-word', { // text reveal 애니메이션
      yPercent: 100,
    }, {
      yPercent: 0,
      ease: 'power4.out',
      stagger: {
        each: 0.1,
      },
    });
  }
});

// 성능 영역 수치 애니메이션
const performanceCounter = document.querySelectorAll('.sc-perfor .a-counter');
performanceCounter.forEach(counter => {

  let perforVal = counter.innerText // HTML에 작성된 값을 가져옴

  ScrollTrigger.create({
    trigger: '.sc-perfor .content-inner',
    start: 'top bottom',
    end: 'bottom bottom',
    onEnter: () => { // 트리거 영역에 진입할 때 실행
      gsap.fromTo(counter, {
        textContent: 0  //  텍스트 내용(시작값): 0
      }, {
        textContent: perforVal, // 텍스트 내용(종료값): HTML에 작성된 값
        duration: 2,
        snap: { textContent: 1 }, // 텍스트를 정수로 반올림 (소수점 제거)
      });
    },
    once: true // 애니메이션을 한 번만 실행 (스크롤 시 반복 방지)
  });
});

// 디테일 영역 슬라이드 텍스트 전환 함수
const infoItems = document.querySelectorAll('.sc-detail .group-detail .info-area .info-item'); // 슬라이드 텍스트

function updateInfo(index) { // 현재 활성 슬라이드 인덱스를 매개변수로 받음
  gsap.set(infoItems, { opacity: 0 }); // 모든 info-item의 투명도를 0으로 설정 (모든 텍스트 숨김)

  gsap.to(infoItems[index], {  // 현재 활성화된 슬라이드에 해당하는 info-item만 표시
    opacity: 1,
    duration: 0.5,
    onStart: function () { // 애니메이션 시작 시 실행
      // 스크램블 텍스트 애니메이션 실행
      const scrambleItems = infoItems[index].querySelectorAll('.a-scramble .split-line'); // 현재 활성화된 슬라이드에 해당하는 info-item의 모든 .split-line 요소 선택
      scrambleItems.forEach(child => { // 각 .split-line 요소에 대해 scrambleText 애니메이션 적용
        animateScrambleText(child, 2); // 2초 동안 스크램블 효과 실행
      });

      // text reveal 애니메이션 
      const revealItems = infoItems[index].querySelectorAll('.a-reveal');
      revealItems.forEach(item => {
        gsap.fromTo(item.querySelectorAll('.split-word'), {
          yPercent: 100,
        }, {
          yPercent: 0,
          ease: 'power4.out',
          overwrite: true,  // 이전 애니메이션을 덮어씀 (이전 애니메이션과 동시 실행 방지)
          stagger: {
            each: 0.1, // 각 단어 사이에 0.1초 간격
          },
        });
      });
    }
  });
}

// 디테일 영역 슬라이드 설정
const projectSlide = new Swiper('.sc-detail .swiper', {
  loop: true,
  parallax: true,
  speed: 1500,
  allowTouchMove: false,
  navigation: {
    prevEl: '.sc-detail .slide-control .btn-prev',
    nextEl: '.sc-detail .slide-control .btn-next',
  },
  on: { // 슬라이드 이벤트 핸들러
    init: function () { // Swiper가 초기화될 때 실행되는 콜백
      updateInfo(this.realIndex); // this.realIndex: 현재 활성 슬라이드의 인덱스
    },
    slideChangeTransitionStart: function () { // 슬라이드 전환이 시작될 때 실행되는 콜백
      updateInfo(this.realIndex);
    },
  },
});

// 보상판매 영역 text reveal 애니메이션
ScrollTrigger.create({
  trigger: '.sc-detail .group-trade',
  start: 'top+=20% bottom',
  end: 'top+=30% bottom',
  scrub: false,
  // markers: true,
  onEnter: () => {
    gsap.fromTo('.sc-detail .group-trade .a-reveal .split-word', {
      yPercent: 100,
    }, {
      yPercent: 0,
      ease: 'power4.out',
      stagger: {
        each: 0.1,
      },
    });
  }
});

// 스펙 영역 타이틀 text reveal 애니메이션
ScrollTrigger.create({
  trigger: '.sc-specs',
  start: 'top bottom',
  end: 'top+=10% bottom',
  scrub: false,
  // markers: true,
  onEnter: () => {
    gsap.fromTo('.sc-specs .a-reveal .split-word', {
      yPercent: 100,
    }, {
      yPercent: 0,
      ease: 'power4.out',
      stagger: {
        each: 0.1,
      },
    });
  }
});

// 스펙 영역 수치 애니메이션
const specCounter = document.querySelector('.sc-specs .a-counter');
let specVal = specCounter.innerText
gsap.fromTo(specCounter, {
  textContent: 0  //  텍스트 내용(시작값): 0
}, {
  textContent: specVal, // 텍스트 내용(종료값): HTML에 작성된 값
  duration: 1,
  snap: { textContent: 1 }, // 텍스트를 정수로 반올림 (소수점 제거)

  scrollTrigger: {
    trigger: '.sc-specs',
    start: 'top 80%',
    end: 'bottom, bottom',
    scrub: false,
    once: true
  }
});

// 스펙 영역 아이템 애니메이션
gsap.from('.sc-specs .spec-item:not(:first-child)', {
  xPercent: 25, // 초기 위치를 오른쪽으로 25% 이동한 상태에서 시작
  opacity: 0, // 초기 상태를 투명하게 설정
  stagger: 0.2, // 각 아이템 사이에 0.2초의 지연시간 적용
  scrollTrigger: {
    trigger: '.sc-specs',
    start: 'top 80%',
    end: 'bottom 70%',
    scrub: 2,
    // markers: true,
  }
});


// 악세사리 영역 타이틀 애니메이션 (text reveal)
ScrollTrigger.create({
  trigger: '.sc-acc .head',
  start: 'top bottom',
  end: 'bottom bottom',
  scrub: false,
  // markers: true,
  onEnter: () => {
    gsap.fromTo('.sc-acc .title.a-reveal .split-word', {
      yPercent: 100,
    }, {
      yPercent: 0,
      ease: 'power4.out',
      stagger: {
        each: 0.1,
      },
    });
    gsap.fromTo('.sc-acc .desc.a-reveal .split-word', {
      yPercent: 100,
    }, {
      yPercent: 0,
      ease: 'power4.out',
      stagger: {
        each: 0.1,
      },
      delay: 0.1
    });
  }
});

// 악세사리 영역 이미지 패럴렉스 효과
const accItems = document.querySelectorAll('.sc-acc .acc-item');
accItems.forEach((item) => {
  gsap.to(item.querySelector('img'), { // 각 아이템 내부 이미지
    yPercent: 50, // 이미지를 Y축으로 50% 이동 (스크롤에 맞춰 아래로 이동)
    scrollTrigger: {
      trigger: item, // 각 아이템을 개별 트리거로 설정
      scrub: 1, // 스크롤 속도와 애니메이션을 부드럽게 동기화
      start: 'top bottom',
      end: 'bottom top',
      // markers: true, 
    }
  });
});

// 가치관 영역 text reveal 애니메이션
ScrollTrigger.create({
  trigger: '.sc-value',
  start: 'top bottom',
  end: 'top+=10% bottom',
  scrub: false,
  // markers: true,
  onEnter: () => {
    gsap.fromTo('.sc-value .a-reveal .split-word', {
      yPercent: 100,
    }, {
      yPercent: 0,
      ease: 'power4.out',
      stagger: {
        each: 0.1,
      },
    });
  }
});


/* matchMedia */
const mm = gsap.matchMedia();

mm.add('(max-width: 600px)', () => {
  // 600px 이하일때만 애니메이션을 실행 (모바일)

  // 인트로영역 비디오 재생
  const video = document.querySelector('.sc-intro .group-visual .video-area video');
  video.play();

  return () => { // 클린업
    video.pause(); // 비디오 멈춤
    video.currentTime = 0; // 처음 상태로 되돌림
  };

});

mm.add('(min-width: 1025px)', () => {
  // 1025px 이상일 때만 애니메이션을 실행 (데스크탑)

  initializeLenis(); // Lenis 초기화

  // M4 chip 애니메이션
  let animateService = gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-chip',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      // markers: true,
    }
  });
  animateService
    .to('.sc-chip .frame', {
      'clip-path': 'polygon(0% 20%, 100% 20%, 100% 80%, 0% 80%)', // 가로80% -> 가로 100% 형태로 확대
      duration: 0.3,
      onStart: () => { // 애니메이션 시작 시 실행
        gsap.fromTo('.sc-chip .frame .img-container', { // 이미지 등장 애니메이션 
          yPercent: 0,
          scale: 3,
        }, {
          yPercent: -5,
          scale: 1,
          ease: 'customEase',
          duration: 2,
        });
      }
    })
    .to('.sc-chip .frame', {
      'clip-path': 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // 세로 80% -> 세로 100% 형태로 확대
      duration: 0.3,
    }, 'middle') // 같은 라벨끼리 동시 실행
    .to('.sc-chip .title-wrap .title', { // 타이틀 위치조정
      yPercent: -100,
      duration: 0.2,
    }, '>') // 위 애니메이션 종료 후 실행
    .to('.sc-chip .title-wrap .btn-wrap', { // 버튼 등장 애니메이션
      opacity: 1,
      yPercent: 0,
      duration: 0.2,
    }, '<') // 위 애니메이션과 동시 실행
    .from('.sc-chip .a-reveal', { // 타이틀 애니메이션
      opacity: 0,
      duration: 0.4,
      onStart: () => { // 애니메이션 시작 시 실행
        gsap.fromTo('.sc-chip .a-reveal .split-word', { // text reveal 애니메이션 (타이틀)
          yPercent: 100,
        }, {
          yPercent: 0,
          ease: 'power4.out',
          stagger: {
            each: 0.1,
          },
        });
      }
    }, 'middle')
    .fromTo('.sc-chip .frame .img-container img', { // 이미지 위치 조정
      yPercent: -5,
      scale: 1.5,
    }, {
      yPercent: -25,
      scale: 1,
    }, 'middle');


  // 특징 영역 애니메이션
  const videos = document.querySelectorAll('.sc-feature video');
  const videoCount = videos.length; // 비디오 개수
  const videoDuration = 1 / videoCount; // 전체 스크롤 구간(0~1)을 비디오 개수로 나누어 각 비디오가 재생될 구간 길이 계산

  let animateFeature = gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-feature',
      start: 'top+=16% bottom',
      end: 'bottom bottom',
      scrub: 1,
      // markers: true,
      onUpdate: (self) => {
        // 스크롤 위치에 따라 여러 비디오를 순차적으로 재생하는 애니메이션
        const progress = self.progress; // 현재 스크롤 진행도 (0~1 사이 값)

        videos.forEach((video, index) => {
          // 각 비디오의 재생 구간 계산
          const start = index * videoDuration;  // 시작점: 비디오 인덱스 * 구간 길이
          const end = start + videoDuration; // 종료점: 시작점 + 구간 길이
          const adjustedEnd = index === videos.length - 1 ? end - 0.01 : end;  // 마지막 비디오는 마지막 프레임 제거 (비디오에서 안쓰는 부분 제거) 

          // 현재 스크롤 진행도가 해당 비디오의 재생 구간에 속하는지 확인하고 해당하는 비디오의 재생 시간을 스크롤 진행도와 동기화
          if (progress >= start && progress <= adjustedEnd && video.duration) { // 현재 스크롤 위치가 해당 비디오의 재생 구간에 있고, 비디오가 로드된 경우
            // (현재 progress - 구간 시작점) / 구간 길이 = 현재 구간 내 진행도(0~1)
            // 이를 비디오 총 길이(video.duration)와 곱하여 실제 재생 시간 계산
            video.currentTime = video.duration * ((progress - start) / videoDuration);
          }
        });
      }
    }
  });

  // 특징 영역 각 아이템에 대한 애니메이션 설정
  const proItems = document.querySelectorAll('.sc-feature .feat-item');
  proItems.forEach((item, index) => {

    animateFeature.fromTo(item.querySelector('.col-left'), { // 텍스트 영역 애니메이션
      yPercent: 25, // 시작 위치: 25% 아래
    }, {
      yPercent: -25, // 종료 위치: 25% 위
    })

    if (index > 0) { // 첫 번째 아이템 제외
      animateFeature.from(item, { // 아이템 전체 영역 표시
        opacity: 0,
        duration: 0.1,
      }, '<')
    }

    animateFeature.from(item.querySelector('.col-left'), { // 텍스트 영역 애니메이션
      opacity: 0,
      yoyo: index !== proItems.length - 1, // 마지막 아이템 yoyo 효과 제외 
      repeat: index === proItems.length - 1 ? 0 : 1, // 마지막 아이템 반복 없음 
      delay: index === 0 ? 0.2 : 0.1, // 첫 번째 아이템은 0.2초 지연, 나머지는 0.1초 지연
      duration: 0.5,
    }, '<')
      .from(item.querySelector('.col-right'), { // 이미지 영역 애니메이션
        opacity: 0,
        yoyo: index !== proItems.length - 1, // 마지막 아이템 yoyo 효과 제외 
        repeat: index === proItems.length - 1 ? 0 : 1, // 마지막 아이템 반복 없음 
        duration: 0.5,
      }, '<')
      .from(item.querySelectorAll('.sub'), { // 서브 텍스트 애니메이션
        opacity: 0,
        duration: 0.3,
        onStart: () => { // 애니메이션 시작 시 실행
          gsap.fromTo(item.querySelectorAll('.sub.a-reveal .split-word'), { // text reveal 애니메이션
            yPercent: 100,
          }, {
            yPercent: 0,
            ease: 'power4.out',
            stagger: {
              each: 0.1, // 각 애니메이션 간격
            },
          });
        }
      }, '<')
      .from(item.querySelectorAll('.name'), { // 제품 텍스트 애니메이션
        opacity: 0,
        duration: 0.3,
        onStart: () => {
          gsap.fromTo(item.querySelectorAll('.name.a-reveal .split-word'), { // text reveal 애니메이션
            yPercent: 100,
          }, {
            yPercent: 0,
            ease: 'power4.out',
            stagger: {
              each: 0.1,
            },
          });
        }
      }, '<')
    if (index === proItems.length - 1) { // 마지막 아이템일 경우
      animateFeature.fromTo(item.querySelector('.link-detail'), { // 버튼 등장 애니메이션
        opacity: 0,
        scale: 0.9
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        delay: 0.1,
      }, '<')
    }
  });


  // 특징 영역 애니메이션 (전체영역이 아래에서 위로 올라오는 애니메이션)
  gsap.from('.sc-feature .feat-list', {
    yPercent: 15,
    scrollTrigger: {
      trigger: '.sc-feature',
      start: 'top top',
      end: 'top+=10% top',
      scrub: 1,
      // markers: true,
    }
  });

  // 디테일 영역 애니메이션
  // .images는 이후 transform관련 애니메이션이 있기 때문에 css가 아닌 gsap으로 설정하여 일정하게 동작하도록 함
  gsap.set('.sc-detail .group-detail .images', { // 컨테이너 가운데 정렬 (CSS 가운데정렬에서 transform만 gsap으로 설정한 것) 
    xPercent: -50,
    yPercent: -50,
  });

  let animateProject = gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-detail .group-detail',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      // markers: true,
    }
  });
  // 1. 이미지 표시 및 scale 축소 애니메이션
  animateProject.from('.sc-detail .group-detail .frame .img-container', { // 이미지 영역 표시
    opacity: 0,
    duration: 0.5,
    onStart: () => { // 애니메이션 시작 시 실행 (이미지 표시될 때)
      gsap.from('.sc-detail .group-detail .frame .img-container img', { // 이미지 1.5 -> 1로 축소
        scale: 1.5,
      });
    },
  })

  // 2. 컨테이너 scale 확대 + 이미지 텍스트 애니메이션 + 타이틀 애니메이션 + 메인프레임 이미지들 전환 + 주변 프레임 숨김
  animateProject.fromTo('.sc-detail .group-detail .images', // 컨테이너 확대
    {
      scale: 0.523,
    },
    {
      scale: 1.06,
      duration: 2,
      onStart: () => { // 애니메이션 시작 시 실행 (컨테이너 확대될 때 텍스트 스크램블 애니메이션 실행)
        const scrambleItems = document.querySelectorAll('.sc-detail .group-detail .frame .a-scramble .split-line');
        scrambleItems.forEach(child => {
          animateScrambleText(child, 2);
        });
      },
    })
    .from('.sc-detail .group-detail .title', { // 타이틀 애니메이션
      opacity: 0,
      duration: 0.1,
      delay: 0.3,
      onStart: () => { // text reveal 애니메이션
        gsap.fromTo('.sc-detail .group-detail .title.a-reveal .split-word', {
          yPercent: 100,
        }, {
          yPercent: 0,
          ease: 'power4.out',
          stagger: {
            each: 0.1,
          },
        });
      }
    }, '<')
    .from('.sc-detail .group-detail .translator', { // 패럴랙스 효과
      yPercent: 15,
      duration: 0.2,
      delay: 0.25,
    }, '<')
    .to('.sc-detail .group-detail .image-flip img', { // 이미지 전환 애니메이션
      opacity: 0,
      duration: 0.15,
      stagger: {
        each: 0.15, // 각 애니메이션 간격
        from: 'end', // 마지막 요소부터 차례대로 애니메이션이 실행
      },
      delay: 0.2,
    }, '<')
    .to('.sc-detail .group-detail .images .frame:not(.main)', { // main제외한 프레임 숨김
      opacity: 0,
      duration: 0.1,
      delay: 0.3,
    }, '<')

    // 3. 주변프레임 + 타이틀 숨김
    .to('.sc-detail .group-detail .images .frame:not(.main)', { // main제외한 프레임 숨김
      display: 'none',
      duration: 0.1
    }, '>')
    .to('.sc-detail .group-detail .title', { // 타이틀 숨김
      opacity: 0,
      duration: 0.1,
      delay: 0.3,
    }, '<')

    // 4. 슬라이드 초기화 + 슬라이드 텍스트, 버튼 표시 + 서브텍스트 표시
    .from('.sc-detail .group-detail .info-area', { // 슬라이드 텍스트 표시
      opacity: 0,
      duration: 0.1,
      onStart: () => {
        projectSlide.init(); // 슬라이드 초기화
      }
    }, '>')
    .from('.sc-detail .group-detail .sub-area', { // 서브텍스트 표시
      opacity: 0,
      duration: 0.1,
      onStart: () => { // 텍스트 스크램블 애니메이션
        const scrambleItems = document.querySelectorAll('.sc-detail .group-detail .sub-area .a-scramble .split-line');
        scrambleItems.forEach(child => {
          animateScrambleText(child, 2);
        });
      }
    }, '<')
    .from('.sc-detail .group-detail .slide-control', { // 슬라이드 버튼 표시
      opacity: 0,
      duration: 0.1,
    }, '<')

    // 5. 슬라이드 이미지 확대 + 패럴랙스 스크롤
    .to('.sc-detail .group-detail .swiper img', { // 슬라이드 이미지 확대
      scale: 1.5,
    })
    .to('.sc-detail .group-detail .translator', { // 패럴렉스 효과
      yPercent: 15,
    }, '<')


  // 슬라이드 컨트롤 버튼 
  const buttons = document.querySelectorAll('.sc-detail .slide-control .btn');

  buttons.forEach(button => {

    const arrow = button.querySelector('.arrow'); // 각 버튼 내부의 화살표 요소 선택
    if (!arrow) return; // 화살표 요소가 없으면 종료

    const mouseEnter = () => {  // 마우스가 버튼에 진입할 때 실행되는 함수
      gsap.fromTo(arrow,
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.3, }
      );
    }
    button.addEventListener('mouseenter', mouseEnter); // 이벤트 리스너 추가

    const mouseLeave = () => { // 마우스가 버튼에서 벗어날 때 실행되는 함수
      gsap.to(arrow, { scale: 0.5, autoAlpha: 0, duration: 0.3, });
    }
    button.addEventListener('mouseleave', mouseLeave); // 이벤트 리스너 추가

    const mouseMove = (e) => {  // 마우스가 버튼 위에서 움직일 때 실행되는 함수
      const rect = button.getBoundingClientRect();  // 버튼의 위치와 크기 정보를 가져옴

      // 마우스 커서의 상대적 위치 계산 (버튼 내부에서의 x, y 좌표)
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // 화살표를 마우스 커서 위치로 이동
      gsap.to(arrow, {
        duration: 0.3,
        x: x,
        y: y,
      });
    }
    button.addEventListener('mousemove', mouseMove); // 이벤트 리스너 추가

    // 이벤트 리스너 정리를 위한 cleanup 함수 정의
    button.cleanup = () => {
      button.removeEventListener('mouseenter', mouseEnter);
      button.removeEventListener('mouseleave', mouseLeave);
      button.removeEventListener('mousemove', mouseMove);
    };
  });

  // 푸터 패럴렉스 효과
  gsap.fromTo('#footer .wrap', { yPercent: -16 }, {
    yPercent: 0,
    scrollTrigger: {
      trigger: '#footer',
      scrub: 1,
      start: 'top bottom',
      end: 'top center',
      // markers: true,
    }
  });

  return () => { // 클린업 함수 (미디어 쿼리 조건이 더 이상 충족되지 않을 때 자동으로 실행)
    if (lenis) { // lenis 인스턴스가 존재하는 경우  
      lenis.destroy(); // lenis 인스턴스 제거
      lenis = null; // lenis 인스턴스 초기화
    }

    buttons.forEach(button => { // 버튼 이벤트 리스너 정리      
      if (button.cleanup) { // 버튼에 cleanup 메서드가 있는 경우
        button.cleanup(); // cleanup 메서드 호출
      }
    });
  };
});

mm.add('(max-width: 1024px)', () => {
  // 1024px 이하일 때만 애니메이션을 실행 (태블릿/모바일)

  // feature 아이템 비디오들 재생
  const videos = document.querySelectorAll('.sc-feature .video-area video');
  videos.forEach(video => {
    video.play(); // 비디오 재생
  });

  // 디테일 영역 이미지 스케일 설정 초기화
  gsap.set('.sc-detail .group-detail .images', {
    scale: 1
  });

  // 슬라이드 컨트롤 버튼 화살표 설정 초기화
  gsap.set('.sc-detail .slide-control .btn .arrow', {
    x: 0,
    y: 0,
    scale: 1,
    autoAlpha: 1,
  });

  return () => {
    videos.forEach(video => {
      video.pause(); // 비디오 멈춤
      video.currentTime = 0; // 처음 상태로 되돌림
    });
  };
});