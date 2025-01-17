// **기본 설정**

// GSAP 기본 설정
gsap.defaults({
  duration: 1,
  ease: "none"
});

CustomEase.create("customEase", "M0,0 C0.173,0 0.241,0 0.322,0.094 0.401,0.187 0.447,0.461 0.5,0.6 0.543,0.716 0.572,0.786 0.679,0.878 0.752,0.941 0.869,1 1,1 ");

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

// ****

//splitText 함수
function splitText(element, type) {
  const $element = $(element);
  let text = $element.html();
  // br 기준으로 쪼개기
  const lines = text.includes('<br>') ? text.split('<br>') : [text];
  $element.html(''); // 기존 텍스트 초기화

  lines.forEach(line => {
    // 각 줄을 감싸는 wrapper 생성
    let lineContent = '';
    if (type === 'word') {
      // 단어 기준 쪼개기
      line = line.replace(/\s+/g, ' ').trim(); // 불필요한 공백 제거
      const words = line.split(' ');
      words.forEach(word => {
        lineContent += `<span class="split-word">${word} </span> `;
      });
    } else if (type === 'char') {
      // 문자 기준 쪼개기
      line = line.replace(/\s+/g, ' ').trim(); // 불필요한 공백 제거
      const chars = line.split('');
      chars.forEach(char => {
        if (char === ' ') {
          lineContent += `<span class="split-char">&nbsp;</span>`; // 공백 유지
        } else {
          lineContent += `<span class="split-char">${char}</span>`;
        }
      });
    } else if (type === 'line') {
      // br 기준으로만 쪼개기
      lineContent = line; // 내용 그대로 사용
    }

    // lineContent를 split-line으로 감싸기 
    const $lineWrapper = $(`<span class="split-line">${lineContent}</span>`);
    $element.append($lineWrapper); // 줄 단위로 감싸진 요소를 추가
    // $element.append('<br>'); // 줄 바꿈 유지
  });
}

// ScrambleText 함수
function animateScrambleText(element, duration) {
  const finalText = element.textContent.trim(); // 요소 텍스트 가져오기
  const chars = "ZXY0@#*"; // 무작위 문자들
  let iteration = 0; // 현재 반복 단계
  const totalIterations = 50; // 애니메이션이 진행될 총 반복 단계 수 (부드럽게)
  const increment = finalText.length / totalIterations; // 텍스트 길이에 따른 증가 속도 계산

  gsap.to({}, {
    duration: duration,
    ease: "none",
    onUpdate: function () {
      element.textContent = finalText.split("").map((char, i) => {
        return i < iteration ? finalText[i] : chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      iteration = Math.min(iteration + increment, finalText.length);
    },
    onComplete: () => element.textContent = finalText // 애니메이션 완료 시 최종 텍스트 설정
  });
}

// ** 문자열 후처리 **
$('.a-reveal').each(function () {
  splitText(this, 'word');
});

$('.a-scramble').each(function () {
  splitText(this, 'line');
});

$('.a-opacity').each(function () {
  splitText(this, 'char');
});


//header
let lastScroll = 0;
$(window).scroll(function () {
  curr = $(this).scrollTop();
  if (curr > 0) {
    $('#header').addClass('scroll');
  } else {
    $('#header').removeClass('scroll');
  }
  if (curr > lastScroll) {
    $('#header').addClass('hide');
  } else {
    $('#header').removeClass('hide');
  }
  lastScroll = curr;
})


gsap.set(".sc-intro .group-visual .frame img", {
  scale: 2.2
});

const video = document.querySelector('.sc-intro .intro-video');

//intro-head
let animateIntro = gsap.timeline({
  scrollTrigger: {
    trigger: ".sc-intro",
    start: "-1% top",
    end: "bottom bottom",
    scrub: false,
    // markers: true,
  },
  onComplete: () => {

    mm.add("(min-width: 601px)", () => {

      //intro-visual
      let animateIntro2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".sc-intro .group-visual",
          start: "top center",
          end: "top center",
          scrub: false,
          // markers: true,
        }
      });

      animateIntro2.to(".sc-intro .group-visual .frame .rotator", {
        rotateY: 180,
        stagger: 0.2,
        ease: "power2.in",
      })
        .to(".sc-intro .group-visual .img-area .frame", {
          "padding-right": "4px",
          stagger: 0.2,
          ease: "power2.in",
        }, "<")
        .to(".sc-intro .group-visual .img-area .frame img:nth-child(1)", {
          display: "none",
          stagger: 0.2,
          duration: 0.8,
          ease: "power2.in",
        }, "<")
        .to(".sc-intro .group-visual .img-area", {
          scale: "1",
          duration: 2,
          ease: "customEase",
        }, "<")
        .to(".sc-intro .group-visual .img-area .frame img:nth-child(2)", {
          scale: "1",
          duration: 2,
          ease: "customEase",
        }, "<")
        .to(".sc-intro .group-visual .img-area", {
          autoAlpha: 0,
          duration: 0.2,
        })
        .to(".sc-intro .group-visual .video-area", {
          autoAlpha: 1,
          duration: 0.2,
          onComplete: () => {
            video.play();
          }
        }, "<")
        .to(".sc-intro .group-visual .text-area .a-scramble", {
          autoAlpha: 1,
          duration: 1,
          stagger: {
            amount: 1,
            onStart: function () {
              let target = this.targets()[0]; // 현재 애니메이션 대상 요소 가져오기
              let targetChild = target.querySelectorAll('.split-line');
              targetChild.forEach(child => {
                animateScrambleText(child, 2);
              });
            }
          }
        })
    });

  }
});

animateIntro.fromTo(".sc-intro .headline .split-word", { yPercent: 100, }, {
  yPercent: 0,
  ease: "power4",
  stagger: 0.1
})
  .fromTo(".sc-intro .desc .split-word", { yPercent: 100, }, {
    yPercent: 0,
    ease: "power4",
    stagger: 0.1
  }, "<")
  .from(".sc-intro .group-visual .img-area", {
    scale: "3",
    duration: 2,
    ease: "customEase",
  }, "<")
  .from(".sc-intro .group-visual .img-area .flex", {
    yPercent: 50,
    duration: 2,
    ease: "customEase",
  }, "<");


//goal
let animateGoal = gsap.timeline({
  scrollTrigger: {
    trigger: ".sc-overview .content-inner",
    start: "top bottom",
    end: "bottom 20%",
    scrub: 1,
    // markers: true,
  }
});
animateGoal.from(".sc-overview .a-opacity .split-char", {
  "color": "rgb(248, 248, 248)",
  duration: 5,
  stagger: 0.1,
})
  .from(".sc-overview .a-reveal", {
    opacity: 0,
    delay: 2,
    onStart: () => {
      gsap.fromTo(".sc-overview .a-reveal .split-word", {
        yPercent: 100,
      }, {
        yPercent: 0,
        ease: "power4",
        stagger: {
          each: 0.1,
        },
      });
    }
  }, "<")


/**/
//sc-perfor title
gsap.from(".sc-perfor .a-reveal", {
  opacity: 0,
  scrollTrigger: {
    trigger: '.sc-perfor .content-inner',
    start: 'top bottom',
    end: 'top+=30% bottom',
    scrub: 1,
    // markers: true,
  },
  onStart: () => {
    gsap.fromTo(".sc-perfor .a-reveal .split-word", {
      yPercent: 100,
    }, {
      yPercent: 0,
      ease: "power4",
      stagger: {
        each: 0.1,
      },
    });
  }
});


//sc-perfor counter
const performanceCounter = document.querySelectorAll(".sc-perfor .a-counter");
performanceCounter.forEach(counter => {
  let perforVal = parseInt(counter.innerText, 10);
  gsap.to(counter, {
    scrollTrigger: {
      trigger: ".sc-perfor .content-inner",
      start: 'top bottom',
      end: 'bottom, bottom',
      onEnter: () => {
        gsap.to(counter, {
          duration: 2,
          ease: "power1.out",
          onUpdate: function () {
            // 숫자 애니메이션 계산
            let value = Math.round(this.progress() * perforVal);
            // 숫자를 그대로 표시
            counter.innerText = value;
          }
        });
      },
      once: true
    }
  });
});

/** */
//1 .group-detail
const infoItems = document.querySelectorAll('.sc-detail .group-detail .info-area .info-item');

const projectSlide = new Swiper('.sc-detail .swiper', {
  loop: true,
  parallax: true,
  speed: 1500,
  allowTouchMove: false,
  navigation: {
    prevEl: '.sc-detail .slide-control .btn-prev',
    nextEl: '.sc-detail .slide-control .btn-next',
  },
  on: {
    init: function () {
      updateInfo(this.realIndex);
    },
    slideChangeTransitionStart: function () {
      updateInfo(this.realIndex);
    },
  },
});

function updateInfo(index) {
  // 모든 info-item을 opacity 0으로
  gsap.set(infoItems, { opacity: 0 });

  // 대상 info-item을 opacity 1로 
  gsap.to(infoItems[index], {
    opacity: 1,
    duration: 0.5,
    onStart: function () {

      //scramble 애니메이션
      const scrambleItems = infoItems[index].querySelectorAll(".a-scramble .split-line");
      scrambleItems.forEach(child => {
        animateScrambleText(child, 2);
      });

      //reveal 애니메이션
      const revealItems = infoItems[index].querySelectorAll(".a-reveal");

      revealItems.forEach((item, idx) => {
        gsap.fromTo(item.querySelectorAll(".split-word"), {
          yPercent: 100,
        }, {
          yPercent: 0,
          ease: "power4",
          overwrite: true,
          stagger: {
            each: 0.1,
          },
        });
      });
    }
  });
}


/** */
//2. group-trade
gsap.from(".sc-detail .group-trade .a-reveal", {
  opacity: 0,
  scrollTrigger: {
    trigger: '.sc-detail .group-trade',
    start: 'top+=20% bottom',
    end: 'top+=30% bottom',
    scrub: 1,
    // markers: true,
  },
  onStart: () => {
    gsap.fromTo(".sc-detail .group-trade .a-reveal .split-word", {
      yPercent: 100,
    }, {
      yPercent: 0,
      ease: "power4",
      stagger: {
        each: 0.1,
      },
    });
  }
});


//customer
gsap.from(".sc-specs .a-reveal", {
  opacity: 0,
  scrollTrigger: {
    trigger: '.sc-specs',
    start: 'top bottom',
    end: 'top+=10% bottom',
    scrub: 1,
    // markers: true,
  },
  onStart: () => {
    gsap.fromTo(".sc-specs .a-reveal .split-word", {
      yPercent: 100,
    }, {
      yPercent: 0,
      ease: "power4",
      stagger: {
        each: 0.1,
      },
    });
  }
});

const customerCounter = document.querySelector(".sc-specs .a-counter");
let customerVal = parseInt(customerCounter.innerText, 10);
// console.log(customerVal);

gsap.to(".sc-specs .a-counter", {
  scrollTrigger: {
    trigger: ".sc-specs",
    start: 'top 80%',
    end: 'bottom, bottom',
    onEnter: () => {
      gsap.to(".sc-specs .a-counter", {
        duration: 1,
        ease: "power1.out",
        onUpdate: function () {
          // 숫자 애니메이션 계산
          let value = Math.round(this.progress() * customerVal);
          // 숫자를 그대로 표시
          customerCounter.innerText = value;
        }
      });
    },
    once: true
  }
});

gsap.from('.sc-specs .spec-item:not(:first-child)', {
  xPercent: 25,
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


//news
let animateNews = gsap.timeline({
  scrollTrigger: {
    trigger: ".sc-acc .head",
    start: "top+=40% bottom",
    end: "bottom bottom",
    scrub: 1,
    // markers: true,
  }
});

animateNews.from(".sc-acc .title.a-reveal", {
  opacity: 0,
  onStart: () => {
    gsap.fromTo(".sc-acc .title.a-reveal .split-word", {
      yPercent: 100,
    }, {
      yPercent: 0,
      ease: "power4",
      stagger: {
        each: 0.1,
      },
    });
  }
})
  .from(".sc-acc .desc.a-reveal", {
    opacity: 0,
    delay: 1,
    onStart: () => {
      gsap.fromTo(".sc-acc .desc.a-reveal .split-word", {
        yPercent: 100,
      }, {
        yPercent: 0,
        ease: "power4",
        stagger: {
          each: 0.1,
        },
      });
    }
  })



//news grid image >> transY
gsap.utils.toArray(".sc-acc .acc-item").forEach((item, index) => {
  gsap.to(item.querySelector('img'), {
    yPercent: 50,
    scrollTrigger: {
      trigger: item,
      scrub: 1,
      start: 'top bottom',
      end: 'bottom top',
      // markers: true, 
    }
  });
});


//contact
gsap.from(".sc-value .a-reveal", {
  opacity: 0,
  scrollTrigger: {
    trigger: '.sc-value',
    start: 'top bottom',
    end: 'top+=10% bottom',
    scrub: 1,
    // markers: true,
  },
  onStart: () => {
    gsap.fromTo(".sc-value .a-reveal .split-word", {
      yPercent: 100,
    }, {
      yPercent: 0,
      ease: "power4",
      stagger: {
        each: 0.1,
      },
    });
  }
});



/**/
const mm = gsap.matchMedia();

mm.add("(max-width: 600px)", () => {
  // 601px 이상일 때만 애니메이션을 실행

  //product 비디오 재생
  const video = document.querySelector('.sc-intro .group-visual .video-area video');
  video.play();

  return () => {
    video.pause(); // 비디오 멈춤
    video.currentTime = 0; // 처음 상태로 되돌림
  };

});

mm.add("(min-width: 1025px)", () => {
  // 1025px 이상일 때만 애니메이션을 실행
  initializeLenis();

  let animateService = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-chip",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      // markers: true,
    }
  });

  animateService
    .to(".sc-chip .frame", {
      "clip-path": "polygon(0% 20%, 100% 20%, 100% 80%, 0% 80%)",
      duration: 0.3,
      onStart: () => {
        gsap.fromTo(".sc-chip .frame .img-container", {
          yPercent: 0,
          scale: 3,
        }, {
          yPercent: -5,
          scale: 1,
          ease: "customEase",
          duration: 2,
        });
      }
    })
    .to(".sc-chip .frame", {
      "clip-path": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 0.3,
    }, "middle")
    .to(".sc-chip .title-wrap .title", {
      yPercent: -100,
      duration: 0.2,
    }, ">")
    .to(".sc-chip .title-wrap .btn-wrap", {
      opacity: 1,
      yPercent: 0,
      duration: 0.2,
    }, "<")
    .from(".sc-chip .a-reveal", {
      opacity: 0,
      duration: 0.4,
      onStart: () => {
        gsap.fromTo(".sc-chip .a-reveal .split-word", {
          yPercent: 100,
        }, {
          yPercent: 0,
          ease: "power4",
          stagger: {
            each: 0.1,
          },
        });
      }
    }, "middle")
    // .from(".sc-chip .frame .line-logo", {
    //   rotate: 90,
    // }, "middle")
    .fromTo(".sc-chip .frame .img-container img", {
      yPercent: -5,
      scale: 1.5,
    }, {
      yPercent: -25,
      scale: 1,
    }, "middle");


  //product
  const videos = document.querySelectorAll(".sc-feature video");
  const videoCount = videos.length; // 비디오 개수
  const videoDuration = 1 / videoCount; // 각 비디오가 재생되는 구간의 길이

  let animateProduct = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-feature",
      start: "top+=16% bottom",
      end: "bottom bottom",
      scrub: 1,
      // markers: true,
      onUpdate: (self) => {
        const progress = self.progress; // 스크롤 진행 상태 (0 ~ 1)

        videos.forEach((video, index) => {
          const start = index * videoDuration; // 비디오 시작 구간 계산
          const end = start + videoDuration; // 비디오 끝 구간 계산
          const adjustedEnd = index === videos.length - 1 ? end - 0.01 : end;

          // 현재 progress가 해당 비디오 구간에 속하는 경우
          if (progress >= start && progress <= adjustedEnd && video.duration) {
            // 비디오의 currentTime을 동기화 (progress를 해당 비디오 구간으로 변환)

            video.currentTime = video.duration * ((progress - start) / videoDuration);
            console.log(video.currentTime);

          }
        });
      }
    }
  });

  const proItems = document.querySelectorAll(".sc-feature .feat-item");
  proItems.forEach((item, index) => {
    animateProduct.fromTo(item.querySelector(".col-left"), {
      yPercent: 25,
    }, {
      yPercent: -25,
    })

    if (index > 0) {
      animateProduct.from(item, {
        opacity: 0,
        duration: 0.1,
      }, "<")
    }

    animateProduct.from(item.querySelector(".col-left"), {
      opacity: 0,
      yoyo: index !== proItems.length - 1,
      repeat: index === proItems.length - 1 ? 0 : 1,
      delay: index === 0 ? 0.2 : 0.1,
      duration: 0.5,
    }, "<")
      .from(item.querySelector(".col-right"), {
        opacity: 0,
        yoyo: index !== proItems.length - 1,
        repeat: index === proItems.length - 1 ? 0 : 1,
        duration: 0.5,
      }, "<")
      .from(item.querySelectorAll(".sub"), {
        opacity: 0,
        duration: 0.3,
        onStart: () => {
          gsap.fromTo(item.querySelectorAll(".sub.a-reveal .split-word"), {
            yPercent: 100,
          }, {
            yPercent: 0,
            ease: "power4",
            stagger: {
              each: 0.1,
            },
          });
        }
      }, "<")
      .from(item.querySelectorAll(".name"), {
        opacity: 0,
        duration: 0.3,
        onStart: () => {
          gsap.fromTo(item.querySelectorAll(".name.a-reveal .split-word"), {
            yPercent: 100,
          }, {
            yPercent: 0,
            ease: "power4",
            stagger: {
              each: 0.1,
            },
          });
        }
      }, "<")
    if (index === proItems.length - 1) {
      animateProduct.fromTo(item.querySelector(".link-detail"), {
        opacity: 0,
        scale: 0.9
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        delay: 0.1,
      }, "<")
    }
  });


  //product2
  gsap.from(".sc-feature .feat-list", {
    yPercent: 15,
    scrollTrigger: {
      trigger: ".sc-feature",
      start: "top top",
      end: "top+=10% top",
      scrub: 1,
      // markers: true,
    }
  });

  //Project
  let animateProject = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-detail .group-detail",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      // markers: true,
    }
  });
  animateProject.set(".sc-detail .group-detail .images", {
    xPercent: -50,
    yPercent: -50,
  })
  animateProject.from(".sc-detail .group-detail .frame .img-container", {
    opacity: 0,
    duration: 0.5,
    onStart: () => {
      gsap.from(".sc-detail .group-detail .frame .img-container img", {
        scale: 1.5,
      });
    },
  })
  animateProject.fromTo(".sc-detail .group-detail .images",
    {
      scale: 0.523,
    },
    {
      scale: 1.06,
      duration: 2,
      onStart: () => {
        const scrambleItems = document.querySelectorAll(".sc-detail .group-detail .frame .a-scramble .split-line");
        scrambleItems.forEach(child => {
          animateScrambleText(child, 2);
        });
      },
    })
    .from(".sc-detail .group-detail .title", {
      opacity: 0,
      duration: 0.1,
      delay: 0.3,
      onStart: () => {
        gsap.fromTo(".sc-detail .group-detail .title.a-reveal .split-word", {
          yPercent: 100,
        }, {
          yPercent: 0,
          ease: "power4",
          stagger: {
            each: 0.1,
          },
        });
      }
    }, "<")
    .from(".sc-detail .group-detail .translator", {
      yPercent: 15,
      duration: 0.2,
      delay: 0.25,
    }, "<")
    .to(".sc-detail .group-detail .image-flip img", {
      opacity: 0,
      duration: 0.15,
      stagger: {
        each: 0.15,
        from: "end",
      },
      delay: 0.2,
    }, "<")
    .to(".sc-detail .group-detail .images .frame:not(.main)", {
      opacity: 0,
      duration: 0.1,
      delay: 0.3,
    }, "<")
    .to(".sc-detail .group-detail .images .frame:not(.main)", {
      display: "none",
      duration: 0.1
    }, ">")
    .to(".sc-detail .group-detail .title", {
      opacity: 0,
      duration: 0.1,
      delay: 0.3,
    }, "<")
    .from(".sc-detail .group-detail .info-area", {
      opacity: 0,
      duration: 0.1,
      onStart: () => {
        projectSlide.init();
      }
    }, ">")
    .from(".sc-detail .group-detail .sub-area", {
      opacity: 0,
      duration: 0.1,
      onStart: () => {
        const scrambleItems = document.querySelectorAll(".sc-detail .group-detail .sub-area .a-scramble .split-line");
        scrambleItems.forEach(child => {
          animateScrambleText(child, 2);
        });
      }
    }, "<")
    .from(".sc-detail .group-detail .slide-control", {
      opacity: 0,
      duration: 0.1,
    }, "<")
  animateProject.to(".sc-detail .group-detail .swiper img", {
    scale: 1.5,
  })
    .to(".sc-detail .group-detail .translator", {
      yPercent: 15,
    }, "<")

  //버튼 호버 이벤트 >>1024이상
  const buttons = document.querySelectorAll(".sc-detail .slide-control .btn");

  buttons.forEach(button => {
    const arrow = button.querySelector(".arrow");

    if (!arrow) return;

    const mouseEnter = () => {
      gsap.fromTo(arrow,
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.3, }
      );
    }
    button.addEventListener('mouseenter', mouseEnter);

    const mouseLeave = () => {
      gsap.to(arrow, { scale: 0.5, autoAlpha: 0, duration: 0.3, });
    }
    button.addEventListener('mouseleave', mouseLeave);

    const mouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(arrow, {
        duration: 0.3,
        x: x,
        y: y,
      });
    }
    button.addEventListener('mousemove', mouseMove);

    button.cleanup = () => {
      button.removeEventListener('mouseenter', mouseEnter);
      button.removeEventListener('mouseleave', mouseLeave);
      button.removeEventListener('mousemove', mouseMove);
    };
  });


  //footer-inner >> transY
  gsap.fromTo("#footer .wrap", { yPercent: -16 }, {
    yPercent: 0,
    scrollTrigger: {
      trigger: "#footer",
      scrub: 1,
      start: 'top bottom',
      end: 'top center',
      // markers: true,
      onLeave: () => {
        $('#footer .bg').addClass('show');
      }
    }
  });

  return () => {
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }

    buttons.forEach(button => {
      if (button.cleanup) {
        button.cleanup();
      }
    });
  };
});

mm.add("(max-width: 1024px)", () => {
  // 1024px 이하일 때만 애니메이션을 실행

  //product 비디오 재생
  const videos = document.querySelectorAll('.sc-feature .video-area video');
  videos.forEach(video => {
    video.play();
  });

  //scale 설정 초기화
  gsap.set(".sc-detail .group-detail .images", {
    scale: 1
  });

  //버튼 설정 초기화
  gsap.set(".sc-detail .slide-control .btn .arrow", {
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