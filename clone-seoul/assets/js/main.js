
// 선택한 언어 사이트 이동
$('.language-area .btn-submit').click(function () {
  url = $('#language-selector').val();
  window.open(url);
});

// 상단으로 버튼
$(window).scroll(function () {
  const curr = $(this).scrollTop(); // 현재 스크롤 위치

  if (curr > 0) {
    $('.fix-btn').addClass('show'); // 스크롤할 때 버튼 표시
  } else {
    $('.fix-btn').removeClass('show'); // 스크롤이 최상단일 때 버튼 숨김
  }
});

$('.fix-btn').click(function () {
  window.scrollTo({ top: 0, behavior: "smooth" }); //페이지 최상단으로 부드럽게 스크롤 이동
});

// Swiper 초기화
// 메인 슬라이드
const mainSlide = new Swiper('.sc-slide .group-news .swiper', {
  loop: true,
  autoplay: {
    delay: 2000,
  },
  allowTouchMove: false,
  pagination: {
    el: '.sc-slide .group-news .swiper-pagination',
    type: 'fraction',
  },
  navigation: {
    nextEl: '.sc-slide .group-news .next',
    prevEl: '.sc-slide .group-news .prev',
  },
});

const citizenSlide = new Swiper('.sc-slide .group-citizen .swiper', {
  loop: true,
  autoplay: {
    delay: 2000,
  },
  allowTouchMove: false,
  pagination: {
    el: '.sc-slide .group-citizen .swiper-pagination',
    type: 'fraction',
  },
  navigation: {
    nextEl: '.sc-slide .group-citizen .next',
    prevEl: '.sc-slide .group-citizen .prev',
  },
});

citizenSlide.autoplay.stop();

// 배너 슬라이드
const bannerSlide = new Swiper('.banner-slide .swiper', {
  slidesPerView: 3,
  spaceBetween: 42,
  loop: true,
  autoplay: {
    delay: 2000,
  },
  pagination: {
    el: '.banner-slide .swiper-pagination',
    type: 'fraction',
  },
  navigation: {
    nextEl: '.banner-slide .next',
    prevEl: '.banner-slide .prev',
  },
});


// 메인 슬라이드 토글 기능
$('.sc-slide .btn-toggle').click(function () {
  const slideContent = $(this).closest(".content");  // 가장 가까운 부모 요소 슬라이드 컨테이너 찾기 
  const currSlide = slideContent.data("target");  // 해당 슬라이드의 data-target 속성 값
  const isActive = slideContent.hasClass("active")  // 슬라이드가 이미 활성화 되어 있는지 확인

  // 슬라이드가 이미 활성화 되어 있으면 종료
  if (isActive) {
    return;
  }

  // 전체 상태 초기화 (간결하게 작성)
  $('.sc-slide .content').removeClass("active");  // 모든 슬라이드 active 제거

  // 모든 슬라이드 자동재생 멈춤
  mainSlide.autoplay.stop();
  citizenSlide.autoplay.stop();

  $(slideContent).addClass("active");  // 해당 슬라이드 active 추가

  // data-target 값에 해당하는 슬라이드를 업데이트하고 자동 재생을 시작
  if (currSlide === 'mainSlide') {
    mainSlide.update();
    mainSlide.autoplay.start();
  } else {
    citizenSlide.update();
    citizenSlide.autoplay.start();
  }

});


//슬라이드 재생, 일시정지버튼 기능

// 슬라이드 번호와 Swiper 인스턴스를 매핑한 객체
const swipers = {
  1: mainSlide,
  2: citizenSlide,
  3: bannerSlide
}

// 자동재생을 시작하거나 멈추는 함수
function toggleAutoplay(swiperNumber, action) {
  const swiper = swipers[swiperNumber]; // 해당 번호에 해당하는 슬라이드 인스턴스
  if (swiper) {
    if (action === 'start') {
      swiper.autoplay.start(); // 'start'일 경우 자동재생 시작
    } else if (action === 'stop') {
      swiper.autoplay.stop();  // 'stop'일 경우 자동재생 멈춤
    }
  }
}

// play/pause 버튼 클릭 시 자동재생을 제어하는 클릭 이벤트 핸들러
$('.swiper .play, .swiper .pause').click(function () {
  const swiperNumber = $(this).data('swiper'); // 클릭된 버튼에 해당하는 swiper 번호
  const isPlay = $(this).hasClass('play'); // 클릭된 버튼이 'play' 버튼인지 'pause' 버튼인지 확인

  $(this).hide().siblings(isPlay ? '.pause' : '.play').show(); // 클릭된 버튼을 숨기고 버튼 상태를 토글
  toggleAutoplay(swiperNumber, isPlay ? 'start' : 'stop'); // 자동재생 제어 함수 호출
});


// 전체보기버튼 팝업
const btnAllOpen = document.querySelectorAll(".sc-slide .btn-all");  // 슬라이드 전체보기 버튼 
const btnAllClose = document.querySelector(".sc-slide .group-all .btn-close"); // 슬라이드 전체보기 팝업 닫기 
const popupContainer = document.querySelector(".sc-slide .group-all");  // 슬라이드 전체보기 팝업 컨테이너

// 슬라이드 전체보기 버튼 클릭 시 팝업 열기
btnAllOpen.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.body.classList.add("popup"); // 팝업 열린 상태에서는 페이지의 스크롤을 비활성화
    popupContainer.classList.add("on");
  });
});
// 닫기 버튼 클릭 시 팝업 닫기
btnAllClose.addEventListener("click", () => {
  document.body.classList.remove("popup");
  popupContainer.classList.remove("on");
});
// 팝업 컨테이너를 클릭하면 팝업 닫기
popupContainer.addEventListener("click", () => {
  document.body.classList.remove("popup");
  popupContainer.classList.remove("on");
});


// 관련사이트 하위목록 토글
$('.expand').click(function () {
  const button = $(this);  // 클릭된 버튼
  const isExpanded = button.attr('aria-expanded') === 'true'; // 현재 aria-expanded 값 확인

  if (isExpanded) {
    // 하위메뉴가 펼쳐져있으면, 하위 메뉴를 닫음
    button.removeClass('on').siblings('.sub-wrap').stop().slideUp(300);
    button.attr('aria-expanded', 'false');
  } else {
    // 하위메뉴가 닫혀있다면
    $('.expand').removeClass('on').siblings('.sub-wrap').stop().slideUp(300);;  // 다른 expand버튼에서 열려있는 하위 메뉴를 모두 닫음
    button.addClass('on').siblings('.sub-wrap').stop().slideDown(300);  // 현재 클릭된 항목의 하위 메뉴를 열기
    button.attr('aria-expanded', 'true');  // aria-expanded 상태 업데이트
  }
});

// 첫번째 아이템에서 Shift+Tab 누르면 하위메뉴 닫힘 
$('.sc-sites .sub-item:first-child').keydown(function (e) {
  const key = e.key;  // 눌린 키
  const isShift = e.shiftKey;  // Shift 키가 함께 눌렸는지 여부

  // Shift+Tab을 누르면 메뉴 닫기
  if (key === 'Tab' && isShift) {
    $('.expand').removeClass('on').siblings('.sub-wrap').stop().slideUp(300); // 하위 메뉴 닫기
    $('.expand').attr('aria-expanded', 'false');  // aria-expanded 상태 업데이트
  }
});

// 마지막 아이템에서 Tab 누르면 하위메뉴 닫힘 
$('.sc-sites .sub-item:last-child').keydown(function (e) {
  const key = e.key;
  const isShift = e.shiftKey;

  // Tab을 누르면 메뉴 닫기
  if (key === 'Tab' && !isShift) {
    $('.expand').removeClass('on').siblings('.sub-wrap').stop().slideUp(300); // 하위 메뉴 닫기
    $('.expand').attr('aria-expanded', 'false');  // aria-expanded 상태 업데이트
  }
});
