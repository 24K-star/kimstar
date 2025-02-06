
// GSAP 기본 설정
gsap.defaults({
  duration: 1,
  ease: "none"
});

let lenis = null;
function initializeLenis() {
  if (!lenis) {
    // Lenis 초기화 (처음 한 번만 실행)
    lenis = new Lenis({
      duration: 1.2,
    })
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


//swiper
const labels = ["NU-FRAME", "Legodt", "NORD", "SISSONNE", "LAGOA"];
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

// header color
let headerHeight
let animateHeader = gsap.timeline({
  scrollTrigger: {
    trigger: ".sc-visual",
    start: () => {
      headerHeight = $('#header').height();
      return `bottom-=${headerHeight} top`
    },
    end: "bottom top",
    scrub: true,
    // markers: true,
  }
});

animateHeader.to(".header-inner.dark", {
  "clip-path": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  // onComplete: function () {
  //   $(".header-inner.dark").removeAttr("aria-hidden inert");
  //   $(".header-inner.white").attr({ "aria-hidden": "true", "inert": "" });
  // }
})
  .fromTo(".header-inner.white", {
    "clip-path": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  }, {
    "clip-path": "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  }, "<");

let animateHeader2 = gsap.timeline({
  scrollTrigger: {
    trigger: "#footer",
    start: () => {
      headerHeight = $('#header').height();
      return `top-=${headerHeight} top`
    },
    end: "top top",
    scrub: true,
    // markers: true,
  }
});

animateHeader2.to(".header-inner.dark", {
  "clip-path": "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  // onComplete: function () {
  //   $(".header-inner.white").removeAttr("aria-hidden inert");
  //   $(".header-inner.dark").attr({ "aria-hidden": "true", "inert": "" });
  // }
})
  .fromTo(".header-inner.white", {
    "clip-path": "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
  }, {
    "clip-path": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  }, "<")
  .to(".header-inner.white .link-odense", {
    opacity: 0,
    duration: 0.1,
  }, "<")

gsap.set(".header-inner.dark", {
  "clip-path": "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
});
gsap.set(".header-inner.white", {
  "clip-path": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
});
$(".header-inner.dark").attr({ "aria-hidden": "true", "inert": "" });


// visual
const animaVisual = gsap.timeline({
  scrollTrigger: {
    trigger: '.sc-visual',
    start: 'bottom 90%',
    end: '55% top',
    scrub: 1,
    invalidateOnRefresh: true,
    // markers: true,
  }
});

animaVisual
  .to(".sc-visual .mask-content", {
    scaleX: 0.975,
    borderBottomLeftRadius: "32px",
    borderBottomRightRadius: "32px",
  })
  .to(".sc-visual .swiper", {
    scaleX: 1.025,
  }, "<")
  .to(".sc-visual .bottom .line", {
    width: "0"
  }, "<")
  .to(".sc-visual .bottom .text:last-child", {
    x: -64,
    duration: 0.1,
  });



//header-inner 컬러 스크롤트리거
ScrollTrigger.create({
  trigger: '.sc-project .group-detail',
  start: 'top top',
  end: 'top top',
  // markers: true,
  onEnter: () => {
    $(".header-inner").addClass("transparent");
  },
  onLeaveBack: () => {
    $(".header-inner").removeClass("transparent");
  }
})

ScrollTrigger.create({
  trigger: '.sc-achieve .sticky-content',
  start: 'bottom top',
  end: 'bottom top',
  // markers: true,
  onEnter: () => {
    $(".header-inner").removeClass("transparent");
  },
  onLeaveBack: () => {
    $(".header-inner").addClass("transparent");
  }
})
ScrollTrigger.create({
  trigger: '#footer',
  start: 'top 50%',
  end: 'top 50%',
  // markers: true,
  onEnter: () => {
    $(".header-inner").addClass("transparent");
  },
  onLeaveBack: () => {
    $(".header-inner").removeClass("transparent");
  }
})




const achieveStart = 0.6 * window.innerHeight;
//achieve 가로스크롤
gsap.to(".sc-achieve .group-figure .sticky-content .horizontal", {
  xPercent: -100,
  scrollTrigger: {
    trigger: ".sc-achieve .group-figure",
    scrub: 1,
    start: `top+=${achieveStart} top`,
    end: 'bottom bottom',
    // markers: true,
  }
});

let animateFooter = gsap.timeline({
  scrollTrigger: {
    trigger: "#footer",
    start: "top 80%",
    end: "top 60%",
    scrub: 1,
    // markers: true,
  }
});

animateFooter.from("#footer", {
  scaleX: 0.975,
  borderTopLeftRadius: "32px",
  borderTopRightRadius: "32px",
})
  .from(".footer-inner", {
    scaleX: 1.025,
  }, "<")



/* matchMedia */
const mm = gsap.matchMedia();

mm.add("(max-width: 600px)", () => {
  // 601px 이상일 때만 애니메이션을 실행

});

mm.add("(min-width: 1025px)", (context) => {
  // 1025px 이상일 때만 애니메이션을 실행

  initializeLenis();

  //button arrow
  const btnArrows = document.querySelectorAll(".arrow");
  const btnEnterList = [];
  const btnLeaveList = [];

  btnArrows.forEach(button => {
    const shape = button.querySelector(".shape");

    const onMouseEnter = () => {
      gsap.set(shape, {
        "--opacity": 1,
      });
      gsap.to(shape, {
        scale: 1,
        duration: 0.1,
      });
      gsap.to(shape, {
        "--translate-x": "0px",
        "--translate-y": "0px",
        duration: 0.2,
      });
    };

    const onMouseLeave = () => {
      gsap.to(shape, {
        scale: 0.25,
        duration: 0.2,
      });
      gsap.to(shape, {
        "--translate-x": "25px",
        "--translate-y": "-25px",
        duration: 0.1,
        onComplete: () => {
          setTimeout(() => {
            gsap.set(shape, {
              "--opacity": 0,
              "--translate-x": "-25px",
              "--translate-y": "25px",
            });
          }, 100);
        }
      });
    };

    btnEnterList.push(onMouseEnter);
    btnLeaveList.push(onMouseLeave);

    context.add(() => {
      button.addEventListener('mouseenter', onMouseEnter);
      button.addEventListener('mouseleave', onMouseLeave);
    });

  });


  // 프로젝트 카테고리 호버
  const linkCates = document.querySelectorAll('.link-cate');
  const linkEnterList = [];
  const linkLeaveList = [];
  const linkMoveList = [];

  linkCates.forEach(linkCate => {
    const imgPreview = linkCate.querySelector(".img-preview");
    let hoverAnimate = gsap.timeline({ paused: true });

    hoverAnimate.to(imgPreview, {
      autoAlpha: 1,
      duration: 0.3,
    }, "<")
    hoverAnimate.from(imgPreview.querySelectorAll("img:not(:first-child)"), {
      scale: 0,
      stagger: 1,
      repeat: -1,
    }, "<")


    const enterListener = () => {
      hoverAnimate.play();
    };
    const leaveListener = () => {
      gsap.to(imgPreview, {
        autoAlpha: 0,
        duration: 0.2,
        onComplete: () => {
          hoverAnimate.pause();
          hoverAnimate.progress(0); // 애니메이션을 처음 상태로 되돌림 
        }
      });
    };
    const moveListener = (e) => {
      const rect = linkCate.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const halfWidth = rect.width * 0.5;
      const halfHeight = rect.height * 0.5;

      const adjustedX = x - halfWidth;
      const adjustedY = y - halfHeight;

      gsap.to(imgPreview, {
        duration: 0.3,
        x: adjustedX,
        y: adjustedY,
      });
    };

    linkEnterList.push(enterListener);
    linkLeaveList.push(leaveListener);
    linkMoveList.push(moveListener);

    context.add(() => {
      linkCate.addEventListener("mouseenter", enterListener);
      linkCate.addEventListener("mouseleave", leaveListener);
      linkCate.addEventListener("mousemove", moveListener);
    });
  });


  // project
  const projectAnimate = gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-project .group-detail',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,
      // markers: true,
    }
  });
  projectAnimate.to(".sc-project .bottom-fix", {
    autoAlpha: 1,
    duration: 0.1,
  })
    .to(".sc-project .group-detail .content", {
      scale: 1,
    })
    .to(".sc-project .group-detail .project-wrap:nth-child(1) .pro-item:nth-child(1) .mask", {
      width: "160%",
      height: "160%",
      yoyo: true,
      repeat: 1,
    }, "<")
    .fromTo(".sc-project .group-detail .project-wrap:nth-child(1) .pro-item:nth-child(1) .text-area", {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, "<")
  projectAnimate.to(".sc-project .group-detail .content-wrapper", {
    x: "-180vh",
    duration: 2,
    delay: -1,
  })
    .to(".sc-project .group-detail .project-wrap:nth-child(1) .pro-item:nth-child(2) .mask", {
      width: "160%",
      height: "160%",
      yoyo: true,
      repeat: 1,
    }, "<")
    .fromTo(".sc-project .group-detail .project-wrap:nth-child(1) .pro-item:nth-child(2) .text-area", {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, "<")
    .to(".sc-project .group-detail .project-wrap:nth-child(1) .pro-item:nth-child(3) .mask", {
      width: "160%",
      height: "160%",
      yoyo: true,
      repeat: 1,
      delay: 0.4,
    }, "<")
    .fromTo(".sc-project .group-detail .project-wrap:nth-child(1) .pro-item:nth-child(3) .text-area", {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, "<")
  projectAnimate.to(".sc-project .group-detail .content-wrapper", {
    y: "-90vh",
    duration: 1,
    delay: -1,
  })
    .to(".sc-project .group-detail .project-wrap:nth-child(2) .pro-item:nth-child(3) .mask", {
      width: "160%",
      height: "160%",
      yoyo: true,
      repeat: 1,
    }, "<")
    .fromTo(".sc-project .group-detail .project-wrap:nth-child(2) .pro-item:nth-child(3) .text-area", {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, "<")
    .to(".sc-project .bottom-fix .mask-text .text", {
      yPercent: -100,
      duration: 0.1,
      delay: -0.2,
    }, "<")
  projectAnimate.to(".sc-project .group-detail .content-wrapper", {
    x: "0vh",
    duration: 2,
    delay: -1,
  })
    .to(".sc-project .group-detail .project-wrap:nth-child(2) .pro-item:nth-child(2) .mask", {
      width: "160%",
      height: "160%",
      yoyo: true,
      repeat: 1,
    }, "<")
    .fromTo(".sc-project .group-detail .project-wrap:nth-child(2) .pro-item:nth-child(2) .text-area", {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, "<")
    .to(".sc-project .group-detail .project-wrap:nth-child(2) .pro-item:nth-child(1) .mask", {
      width: "160%",
      height: "160%",
      yoyo: true,
      repeat: 1,
      delay: 0.4,
    }, "<")
    .fromTo(".sc-project .group-detail .project-wrap:nth-child(2) .pro-item:nth-child(1) .text-area", {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, "<")

  projectAnimate.to(".sc-project .group-detail .content-wrapper", {
    y: "-180vh",
    duration: 1,
    delay: -1,
  })
    .to(".sc-project .group-detail .project-wrap:nth-child(3) .pro-item:nth-child(1) .mask", {
      width: "160%",
      height: "160%",
      yoyo: true,
      repeat: 1,
    }, "<")
    .fromTo(".sc-project .group-detail .project-wrap:nth-child(3) .pro-item:nth-child(1) .text-area", {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, "<")
    .to(".sc-project .bottom-fix .mask-text .text", {
      yPercent: -100 * 2,
      duration: 0.1,
      delay: -0.2,
    }, "<")

  projectAnimate.to(".sc-project .group-detail .content-wrapper", {
    x: "-180vh",
    duration: 2,
    delay: -1,
  })
    .to(".sc-project .group-detail .project-wrap:nth-child(3) .pro-item:nth-child(2) .mask", {
      width: "160%",
      height: "160%",
      yoyo: true,
      repeat: 1,
    }, "<")
    .fromTo(".sc-project .group-detail .project-wrap:nth-child(3) .pro-item:nth-child(2) .text-area", {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, "<")
    .to(".sc-project .group-detail .project-wrap:nth-child(3) .pro-item:nth-child(3) .mask", {
      width: "160%",
      height: "160%",
      yoyo: true,
      repeat: 1,
      delay: 0.4,
    }, "<")
    .fromTo(".sc-project .group-detail .project-wrap:nth-child(3) .pro-item:nth-child(3) .text-area", {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      delay: 0.6,
    }, "<")
  projectAnimate.to(".sc-project .group-detail .content-wrapper", {
    x: "-90vh",
    y: "-90vh",
    scale: 1 / 3,
  })
    .fromTo(".sc-principle .col-right .content", {
      width: "280vh",
      height: "280vh",
    }, {
      width: "100vh",
      height: "100vh",
    }, "<")
    .to(".sc-project .group-detail .content-wrapper", {
      autoAlpha: 0,
      duration: 0.2,
      delay: 0.6,
    }, "<")
    .to(".sc-project .bottom-fix", {
      autoAlpha: 0,
      duration: 0.2,
    }, "<")
    .to(".sc-principle .col-right .content .prin-list", {
      autoAlpha: 1,
      duration: 0.2,
    }, "<")
    .to(".sc-principle .col-right .content", {
      width: "100%",
      height: "100%",
      duration: 0.2,
    })

  //전체 애니메이션 속도조정
  projectAnimate.timeScale(1.2);



  //principle 애니메이션
  //좌표에 150vh적용
  const princStart = 1.5 * window.innerHeight;
  const princtAnimate = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-principle",
      // start: "top top",
      start: `top+=${princStart} top`,
      end: "bottom bottom",
      scrub: 1,
      // markers: true,
      invalidateOnRefresh: true,
    },
  });


  princtAnimate
    .to(".sc-principle .prin-list .prin-item:nth-child(1)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 1,
    })
    .to(".sc-principle .prin-list .prin-item:nth-child(1) .text", {
      opacity: 1,
      duration: 1,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(6)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 1,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(6) .text", {
      opacity: 1,
      duration: 1,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(7)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 1,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(7) .text", {
      opacity: 1,
      duration: 1,
    }, "<")


    .to(".sc-principle .img-container:nth-child(3)", {
      height: 0,
    }, "a")
    .to(".sc-principle .mask-desc .desc", {
      yPercent: -100,
      duration: 0.2,
    }, "a")
    .to(".sc-principle .mask-page .curr .number", {
      yPercent: -100,
      duration: 0.2,
    }, "a")
    .to(".sc-principle .prin-list .prin-item:nth-child(1) .text", {
      opacity: 0,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(6) .text", {
      opacity: 0,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(7) .text", {
      opacity: 0,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(3)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 0.5,
    }, ">")
    .to(".sc-principle .prin-list .prin-item:nth-child(3) .text", {
      opacity: 1,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(4)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(4) .text", {
      opacity: 1,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(9)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(9) .text", {
      opacity: 1,
      duration: 0.5,
    }, "<")


    .to(".sc-principle .img-container:nth-child(2)", {
      height: 0,
    }, "b")
    .to(".sc-principle .mask-desc .desc", {
      yPercent: -100 * 2,
      duration: 0.2,
    }, "b")
    .to(".sc-principle .mask-page .curr .number", {
      yPercent: -100 * 2,
      duration: 0.2,
    }, "b")
    .to(".sc-principle .prin-list .prin-item:nth-child(3) .text", {
      opacity: 0,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(4) .text", {
      opacity: 0,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(9) .text", {
      opacity: 0,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(2)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 0.5,
    }, ">")
    .to(".sc-principle .prin-list .prin-item:nth-child(2) .text", {
      opacity: 1,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(5)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(5) .text", {
      opacity: 1,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(8)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(8) .text", {
      opacity: 1,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
    }, "<")


    .to(".sc-principle .lottie-wrap", {
      opacity: 1,
      duration: 0.3,
    })
    .to(".sc-principle .col-right .content", {
      opacity: 0,
      duration: 0.3,
    }, "<")

    .to(".sc-principle", {
      duration: 2,
      onUpdate: function () {
        const progress = this.progress();
        const curr = progress * lottie1.totalFrames;
        lottie1.goToAndStop(curr, true);
      }
    })
    .to(".sc-principle .lottie-wrap", {
      width: "100%",
      duration: 0.5,
    }, "<")

    .to(".sc-principle .lottie-wrap .lottie-1", {
      padding: 0,
      duration: 0.5,
      delay: 0.5,
    }, "<")
    .to(".sc-principle .content-wrapper", {
      display: "none",
      duration: 0.1,
    }, "<")
    .to(".sc-principle .lottie-wrap", {
      backgroundColor: "rgba(206, 219, 229, 0)",
      delay: 0.5,
      duration: 0.1,
    }, "<")



  return () => {
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
    btnArrows.forEach((button, index) => {
      button.removeEventListener('mouseenter', btnEnterList[index]);
      button.removeEventListener('mouseleave', btnLeaveList[index]);
    });

    linkCates.forEach((linkCate, index) => {
      linkCate.removeEventListener("mouseenter", linkEnterList[index]);
      linkCate.removeEventListener("mouseleave", linkLeaveList[index]);
      linkCate.removeEventListener("mousemove", linkMoveList[index]);
    });
  };
});

mm.add("(max-width: 1024px)", () => {
  // 1024px 이하일 때만 애니메이션을 실행

  // project 애니메이션
  const proItems = document.querySelectorAll('.sc-project .group-detail .project-wrap .pro-item');
  const visibleItems = Array.from(proItems).slice(1);
  const hiddenItems = Array.from(proItems).slice(0, -1);
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
    .to(".sc-project .group-detail .content", {
      scale: 1,
    })
    .to(".sc-project .bottom-fix", {
      autoAlpha: 1,
      duration: 0.1,
      delay: 0.1,
    })
    .from(visibleItems, {
      autoAlpha: 0,
      stagger: {
        each: 1,
      },
    })
    .to(hiddenItems, {
      autoAlpha: 0,
      delay: 1,
      stagger: {
        each: 1,
      },
    }, "<")
    .to(".sc-project .bottom-fix .mask-text .text", {
      yPercent: -100,
      duration: 0.1,
      delay: 1.5,
    }, "<")
    .to(".sc-project .bottom-fix .mask-text .text", {
      yPercent: -200,
      duration: 0.1,
      delay: 3,
    }, "<")
    .to(".sc-project .bottom-fix", {
      autoAlpha: 0,
      duration: 0.1,
    })
    .to(".sc-project .bottom-fix", {
      duration: 0.1,
    })


  // principle 애니메이션
  const princtAnimate = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-principle",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      // markers: true,
      invalidateOnRefresh: true,
    },
  });


  princtAnimate
    .to(".sc-principle .prin-list .prin-item:nth-child(1)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 1,
    })
    .to(".sc-principle .prin-list .prin-item:nth-child(1) .text", {
      opacity: 1,
      duration: 1,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(6)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 1,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(6) .text", {
      opacity: 1,
      duration: 1,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(7)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 1,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(7) .text", {
      opacity: 1,
      duration: 1,
    }, "<")


    .to(".sc-principle .img-container:nth-child(3)", {
      height: 0,
    }, "a")
    .to(".sc-principle .mask-desc .desc", {
      yPercent: -100,
      duration: 0.2,
    }, "a")
    .to(".sc-principle .mask-page .curr .number", {
      yPercent: -100,
      duration: 0.2,
    }, "a")
    .to(".sc-principle .prin-list .prin-item:nth-child(1) .text", {
      opacity: 0,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(6) .text", {
      opacity: 0,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(7) .text", {
      opacity: 0,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(3)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 0.5,
    }, ">")
    .to(".sc-principle .prin-list .prin-item:nth-child(3) .text", {
      opacity: 1,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(4)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(4) .text", {
      opacity: 1,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(9)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(9) .text", {
      opacity: 1,
      duration: 0.5,
    }, "<")


    .to(".sc-principle .img-container:nth-child(2)", {
      height: 0,
    }, "b")
    .to(".sc-principle .mask-desc .desc", {
      yPercent: -100 * 2,
      duration: 0.2,
    }, "b")
    .to(".sc-principle .mask-page .curr .number", {
      yPercent: -100 * 2,
      duration: 0.2,
    }, "b")
    .to(".sc-principle .prin-list .prin-item:nth-child(3) .text", {
      opacity: 0,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(4) .text", {
      opacity: 0,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(9) .text", {
      opacity: 0,
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(2)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 0.5,
    }, ">")
    .to(".sc-principle .prin-list .prin-item:nth-child(2) .text", {
      opacity: 1,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(5)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(5) .text", {
      opacity: 1,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(8)", {
      borderColor: "rgb(142, 123, 109)",
      duration: 0.5,
    }, "<")
    .to(".sc-principle .prin-list .prin-item:nth-child(8) .text", {
      opacity: 1,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
    }, "<")


    .to(".sc-principle .lottie-wrap", {
      opacity: 1,
      duration: 0.3,
    })
    .to(".sc-principle .col-right .content", {
      opacity: 0,
      duration: 0.3,
    }, "<")

    .to(".sc-principle", {
      duration: 2.5,
      onUpdate: function () {
        const progress = this.progress();
        const curr = progress * lottie1.totalFrames;
        lottie1.goToAndStop(curr, true);
      }
    })
    .to(".sc-principle .lottie-wrap", {
      height: "100%",
      duration: 0.5,
    }, "<")
    .to(".sc-principle .lottie-wrap .lottie-1", {
      y: "30vh",
      height: "130%",
    }, "<")
    .to(".sc-principle .lottie-wrap .lottie-1", {
      padding: 0,
      duration: 0.5,
      delay: 0.5
    }, "<")
    .to(".sc-principle .content-wrapper", {
      display: "none",
      duration: 0.1,
    }, "<")
    .to(".sc-principle .lottie-wrap .lottie-1", {
      y: "-30vh",
      duration: 0.5,
      delay: 0.5,
    }, "<")
    .to(".sc-principle .lottie-wrap", {
      backgroundColor: "rgba(206, 219, 229, 0)",
      duration: 0.1,
    }, "<")
    .to(".sc-achieve .group-figure .img-container", {
      opacity: 1,
      delay: 0.4,
      duration: 0.1,
    }, "<")
});
