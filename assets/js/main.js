
// GSAP 기본 설정
gsap.defaults({
  duration: 1,
  ease: "none"
});

//lenis 초기화
let lenis = null;
function initializeLenis() {
  if (!lenis) {
    // Lenis 초기화 (처음 한 번만 실행)
    lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)

    // Lenis 인스턴스가 존재하는 동안만 raf() 실행
    lenisTicker = (time) => {
      if (lenis) {
        lenis.raf(time * 1000);
      }
    };
    gsap.ticker.add(lenisTicker);
  }
}

//eventListener 관리용 배열 (반응형) 
function addEvent(eventListeners, element, type, listener) {
  element.addEventListener(type, listener);
  eventListeners.push({ element, type, listener });
}

//size출력 함수
function updateSize(container) {
  const widthText = container.querySelector(":scope >.number .width");
  const heightText = container.querySelector(":scope >.number .height");
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  widthText.textContent = width;
  heightText.textContent = height;
}

function sizeInit() {
  document.querySelectorAll(".guideline").forEach(updateSize);
  document.querySelectorAll(".box-solid").forEach(updateSize);
  document.querySelectorAll(".box-dashed").forEach(updateSize);
}

//splitText 함수
function createSplitText(el) {
  const element = $(el);
  let text = element.html();
  let splitText = '';

  element.html(''); //텍스트 초기화

  if (text && typeof text === 'string') {
    text = text.replace(/\s+/g, ' ').trim(); //여러개의 공백을 1개로 축소
  } else {
    console.error('유효한 문자열이 아닙니다.');
  }

  const chars = text.split('');
  chars.forEach(char => {
    if (char === ' ') {
      splitText += `<span class="split-char">&nbsp;</span>`; // 공백 유지
    } else {
      splitText += `<span class="split-char">${char}</span>`;
    }
  });
  element.append(splitText);
}

const introHeadline = document.querySelectorAll(".sc-intro .headline .text");
introHeadline.forEach(createSplitText);


//이미지 애니메이션
const scaleImages = document.querySelectorAll(".animate-scale");

// 옵저버 설정
const options = {
  root: null, // 기본 뷰포트 기준
  rootMargin: '0px', // 여백 없음
  threshold: 0.4 // 40% 이상 보일 때
};

//콜백함수 정의
const callback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      // 안 보일 때
      entry.target.classList.remove("show");
    }
  });
};
const observer = new IntersectionObserver(callback, options);
scaleImages.forEach(image => {
  observer.observe(image);
});

//gsap motionPath

//resize이벤트 debounce
let debounceTimeout;
function debounce(func, delay) {
  clearTimeout(debounceTimeout);  // 기존 타이머 취소
  debounceTimeout = setTimeout(func, delay);  // delay 후 함수를 실행
}

function updatePath() {
  gsap.to(".orbit .shape", {
    duration: 10,
    repeat: -1,
    motionPath: {
      path: ".orbit svg path",
      align: ".orbit svg path",
      alignOrigin: [0.5, 0.5], // 경로의 중심에 맞추기
      autoRotate: true // 경로를 따라 회전
    },
    ease: "none",
  });
}

//intro motionPath
window.addEventListener("resize", () => {
  // 창 크기 변경 시 opacity를 0으로 변경
  gsap.to(".orbit .shape", {
    opacity: 0,
    duration: 0.1
  });

  debounce(function () {
    gsap.to(".orbit .shape", {
      opacity: 1,
      duration: 0.1
    });
    updatePath();  // 경로 업데이트
  }, 400);
});

updatePath();

gsap.to(".orbit .shape", {
  duration: 10,
  repeat: -1,
  motionPath: {
    path: ".orbit svg path",
    align: ".orbit svg path",
    alignOrigin: [0.5, 0.5], // 경로의 중심에 맞추기
    autoRotate: true // 경로를 따라 회전
  },
  ease: "none",
});


//반응형
const mm = gsap.matchMedia();

mm.add("(min-width: 1025px)", () => {
  // 1025px 이상일 때만 애니메이션을 실행
  const eventListeners = [];

  //Lenis 초기화
  initializeLenis();

  // ** 커스텀 cursor **

  //커서 mousemove 이벤트
  const cursor = document.querySelector(".cursor");
  addEvent(eventListeners, document, "mousemove", (e) => {
    gsap.to(cursor, {
      duration: 0.3,
      x: e.clientX,
      y: e.clientY,
    });
  });

  //호버 이벤트
  function handleHover(content, onEnter, onLeave) {
    addEvent(eventListeners, content, "mouseenter", onEnter);
    addEvent(eventListeners, content, "mouseleave", onLeave);
  }

  //-link 호버시 커서 숨김
  const cursorHideLinks = document.querySelectorAll(".link, .link-home, .resume");
  cursorHideLinks.forEach(link => handleHover(link, () => {
    cursor.classList.add("hidden");
  }, () => {
    cursor.classList.remove("hidden");
  }));

  //-인트로 호버시 커서변경
  const contentIntro = document.querySelector(".sc-intro .rotator .text-area");
  handleHover(contentIntro, () => {
    cursor.classList.add("intro");
  }, () => {
    cursor.classList.remove("intro");
  })

  //-메인 프로젝트 호버시 커서변경
  const contentMains = document.querySelectorAll(".sc-project .group-main .link-project");
  const cursorVideo = document.querySelectorAll(".cursor .video-container video");
  contentMains.forEach((content, index) => handleHover(content, () => {
    cursor.classList.add("thumb");

    const video = cursorVideo[index];
    video.classList.add("show");
    video.play();
  }, () => {
    cursor.classList.remove("thumb");

    let timeoutId;
    const video = cursorVideo[index];
    video.classList.remove("show");
    video.pause();

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      video.currentTime = 0;
    }, 500);  //0.5초 뒤 실행

  }));


  //-사이드 프로젝트 호버
  const contentSides = document.querySelectorAll(".sc-project .group-side .link-project");
  const cursorText = document.querySelector(".cursor .text");
  contentSides.forEach(content => handleHover(content, () => {
    cursor.classList.add("hover");
    cursorText.textContent = "VIEW PROJECT";
  }, () => {
    cursor.classList.remove("hover");
    cursorText.textContent = "";
  }));


  //resume버튼 호버이벤트
  const btnResume = document.querySelector(".resume");

  addEvent(eventListeners, btnResume, "mousemove", (e) => {
    //버튼의 중심 좌표 
    const buttonRect = btnResume.getBoundingClientRect(); //크기,위치정보 객체
    const buttonCenterX = buttonRect.left + buttonRect.width / 2; //버튼left값+너비절반=버튼중간left값
    const buttonCenterY = buttonRect.top + buttonRect.height / 2; //버튼top값+높이절반=버튼중간top값

    //마우스포인터 좌표 (스크롤 제외한 뷰포트기준)
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    //버튼의 중심과 마우스 사이의 거리 계산
    const dx = mouseX - buttonCenterX;
    const dy = mouseY - buttonCenterY;

    //버튼과 마우스 사이의 직선거리
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 24); //최대 30px로 설정해 버튼과 마우스 사이의 거리를 제한

    gsap.to(btnResume, {
      x: dx / distance * 10, //마우스와 버튼 사이의 상대적인 비율 * 10(이동범위조절)
      y: dy / distance * 10,
      ease: 'power1.out'
    });
  });

  addEvent(eventListeners, btnResume, "mouseleave", () => {
    gsap.to(btnResume, {
      x: 0,
      y: 0,
      ease: 'power1.out',
    });
  })

  return () => {
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
    eventListeners.forEach(data => {
      data.element.removeEventListener(data.type, data.listener);
    })
  };
});


mm.add("(min-width: 601px)", () => {
  // 601px 이상일 때만 애니메이션을 실행
  const eventListeners = [];

  //사이즈 업데이트
  addEvent(eventListeners, window, "resize", sizeInit);
  sizeInit();


  // ** GSAP 애니메이션 **

  //페이지 로드 애니메이션
  addEvent(eventListeners, window, "load", () => {
    if ($(window).scrollTop() < 1) {
      const gtlLoad = gsap.timeline({});
      gtlLoad.from(".sc-intro .rotator", {
        yPercent: 100,
        scale: 0.8,
        rotate: 15,
        duration: 0.8,
        ease: "circ.out",
      })

        .from(".sc-intro .headline .split-char", {
          yPercent: 100,
          rotate: -3,
          stagger: 0.06,
          ease: "power2.out",
        })
        .from(".sc-intro .headline .item", {
          "--scalex-first": 0,
          duration: 0.4,
          ease: "power1.out",
          delay: 0.9,
        }, "<")
        .from(".sc-intro .headline .item", {
          "--scalex-second": 0,
          duration: 0.4,
          ease: "power1.out",
          delay: 0.2,
        }, "<")
        .from(".sc-intro .headline .item", {
          "--scale-value": 0,
          duration: 0.4,
          ease: "power1.out",
          delay: 0.2,
        }, "<")
        .from(".sc-intro .gradient .video-container", {
          scale: 0,
          duration: 0.6,
          ease: "power1.out",
          delay: -0.2,
        }, "<")
        .from(".sc-intro .gradient .orbit", {
          scale: 0,
          rotate: -15,
          duration: 0.6,
          ease: "power1.out",
          delay: 0.2,
        }, "<")
    }
  });

  //intro
  const gsttIntro = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-intro",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      // markers: true,
    },
  });
  gsttIntro.to(".sc-intro .rotator .bg", {
    xPercent: -10,
    rotate: -15,
  })
    .to(".sc-intro .rotator .text-area", {
      xPercent: -10,
      rotate: -15,
    }, "<");


  //main project - head
  gsap.from(".sc-project .group-main .head-area", {
    scrollTrigger: {
      trigger: ".sc-project .head-area",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
      // markers: true,
    },
    xPercent: -10,
    rotate: 8,
  });

  gsap.to(".sc-project .group-main > .rotator", {
    scrollTrigger: {
      trigger: ".sc-project .content-area",
      start: "top 60%",
      end: "40% bottom",
      scrub: true,
      // markers: true,
    },
    xPercent: -10,
    yPercent: 5,
    rotate: -4,
  });


  //main project - content
  const sectIntro = document.querySelector(".sc-intro");
  const projectInfos = document.querySelectorAll(".sc-project .group-main .info");
  const projectContents = document.querySelectorAll(".sc-project .group-main .content");
  const gsttProject = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-project .group-main .content-area",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
      // markers: true,
    }
  });

  projectInfos.forEach((content, index) => {
    gsttProject.from(content, {
      xPercent: 15,
      yPercent: 110,
      rotate: 15,
    })

    if (index > 0) {
      gsttProject.to(projectInfos[index - 1], {
        xPercent: -25,
        yPercent: -80,
        rotate: -7,

        onStart: () => {
          if (index === 1) {
            sectIntro.classList.add("hidden");
          }
        },
        onReverseComplete: () => {
          if (index === 1) {
            sectIntro.classList.remove("hidden");
          }
        }

      }, "<")
      gsttProject.to(projectContents[index - 1], {
        xPercent: -5,
        yPercent: -50,
        rotate: -5,
      }, "<");
    }

    gsttProject.from(projectContents[index], {
      xPercent: 20,
      yPercent: 130,
      rotate: 15,
      delay: 0.12,
    }, "<");
  });

  //side project - head
  const gsttSideHead = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-project .group-side .sticky-wrapper",
      start: "top bottom",
      end: "top top",
      scrub: true,
      // markers: true,
    }
  });

  gsttSideHead.to(".sc-project .group-main .main-item:last-child .info", {
    xPercent: -10,
    yPercent: 50,
    rotate: -3,
  })
    .to(".sc-project .group-main .main-item:last-child .content", {
      xPercent: -2.5,
      yPercent: 40,
      rotate: -2,
    }, "<")
    .from(".sc-project .group-side .rotator", {
      xPercent: -20,
      yPercent: 20,
      rotate: 16,
      duration: 0.7,
    }, "<")


  //side project - side 
  const gsttSideContent = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-project .group-side .sticky-wrapper",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      // markers: true,
    }
  });
  gsttSideContent.fromTo(".sc-project .group-side .side-item", {
    yPercent: 100,
  }, {
    yPercent: 0,
    stagger: 0.3,
    ease: "power1.out"
  })
    .to(".sc-project .group-side .horizontal", {
      xPercent: -100,
      x: () => {
        return window.innerWidth;
      },
      delay: -1,
    });


  //about - 스크롤 애니메이션
  gsap.from(".sc-about .content-area .col-left", {
    opacity: 0,
    scrollTrigger: {
      trigger: ".sc-about .content-area .col-left .desc",
      start: "20% bottom",
      end: "bottom+=100 bottom",
      scrub: true,
      // markers: true
    }
  });

  const keywordLines = document.querySelectorAll(".sc-about .line-h");
  const keywordItems = document.querySelectorAll(".sc-about .con-item");
  const keywordArr = [...keywordItems]; //keywordItems를 배열로 변환하여 새로운 배열에 저장
  const itemGroup = []; //그룹화된 항목들을 저장할 배열
  const groupSize = 2; // 그룹의 항목 개수

  //아이템 2개로 그룹 나누기
  for (let index = 0; index < keywordArr.length; index += groupSize) {
    itemGroup.push(keywordArr.slice(index, index + groupSize));
  }

  const gsttKeyword = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-about .content-area .col-right",
      start: "top 70%",
      end: "top top",
      scrub: true,
      // markers: true,
    }
  });

  itemGroup.forEach((element, index) => {
    gsttKeyword.from(element, {
      opacity: 0,
      xPercent: 35,
      ease: "power1.out",
      delay: index * -0.3,

    });
    gsttKeyword.from(keywordLines[index], {
      opacity: 0,
      xPercent: 50,
      ease: "power1.out",
    }, "<");
  });


  //footer
  const gsttFooter = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-about .marquee-wrapper",
      start: "bottom bottom",
      end: "top 1%",
      scrub: true,
      // markers: true,
    }
  });

  gsttFooter.from(".footer .contact", {
    yPercent: 30,
  })
    .to(".sc-about", {
      xPercent: -7,
      yPercent: -4,
      rotate: -4,
    }, "<")


  return () => {
    eventListeners.forEach(data => {
      data.element.removeEventListener(data.type, data.listener);
    });
  };

});

mm.add("(max-width: 600px)", () => {
  // 600px 이하일 때만 애니메이션을 실행

  const sideSlide = new Swiper(".group-side .swiper", {
    slidesPerView: 1.1,
    freeMode: true,
    freeModeMomentum: true,
  });

  return () => {
    if (sideSlide) {
      sideSlide.destroy(true, true);
    }
  };
});