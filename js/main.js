// Expose modal functions at top level to prevent race conditions during DOMContentLoaded
function openFloorPlanModal(imgSrc, titleText) {
  const floorPlanModal = document.getElementById('floorPlanModalBackdrop');
  const floorPlanImg = document.getElementById('floorPlanModalImg');
  const floorPlanTitle = document.getElementById('floorPlanModalTitle');
  if (floorPlanModal && floorPlanImg && floorPlanTitle) {
    floorPlanImg.src = imgSrc;
    floorPlanTitle.textContent = `${titleText} 평면 도면`;
    floorPlanModal.style.cssText = 'display: flex !important; opacity: 1 !important; pointer-events: auto !important; visibility: visible !important;';
    document.body.style.overflow = 'hidden';
  }
}
window.openFloorPlanModal = openFloorPlanModal;

function closeFloorPlanModal() {
  const floorPlanModal = document.getElementById('floorPlanModalBackdrop');
  if (floorPlanModal) {
    floorPlanModal.style.cssText = '';
    document.body.style.overflow = '';
  }
}
window.closeFloorPlanModal = closeFloorPlanModal;

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. SCROLL EFFECT ON HEADER
  // ==========================================
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check on load

  // ==========================================
  // 2. MOBILE MENU TOGGLE
  // ==========================================
  const header = document.querySelector('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      header.classList.toggle('menu-open');

      const spans = menuToggle.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        header.classList.remove('menu-open');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ==========================================
  // 3. ON-SCROLL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  // ==========================================
  // 4. SPACE EXPLORER TAB & SLIDER CAROUSEL (Card Slider)
  // ==========================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const slides = document.querySelectorAll('.explorer-card');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const track = document.getElementById('explorerTrack');

  let currentSlideIndex = 0;

  const updateCarousel = () => {
    if (!track || slides.length === 0) return;
    const card = slides[0];
    const cardStyle = window.getComputedStyle(card);
    const cardWidth = card.offsetWidth;
    const cardMargin = parseFloat(cardStyle.marginRight) || 0;
    const step = cardWidth + cardMargin;

    // Centering calculation: center the active card in the track container
    const containerWidth = track.parentElement.offsetWidth;
    const offset = (containerWidth / 2) - (cardWidth / 2) - (currentSlideIndex * step);

    // Apply translate offset
    track.style.transform = `translateX(${offset}px)`;

    // Update active class on slides/cards and play/pause videos
    slides.forEach((slide, idx) => {
      const vid = slide.querySelector('video');
      if (idx === currentSlideIndex) {
        slide.classList.add('active');
        if (vid) vid.play().catch(e => console.log('Video autoplay blocked:', e));
      } else {
        slide.classList.remove('active');
        if (vid) {
          vid.pause();
          vid.currentTime = 0; // 초기화
        }
      }
    });

    // Update active tabs
    tabBtns.forEach((btn, idx) => {
      if (idx === currentSlideIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  const showSlide = (index) => {
    // Boundary check
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    currentSlideIndex = index;
    updateCarousel();
  };

  // Tab click event
  tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      showSlide(index);
    });
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});
  }

  const handleSwipe = () => {
    const swipeThreshold = 40; // minimum distance to trigger swipe
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped left -> next slide
      showSlide(currentSlideIndex + 1);
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped right -> prev slide
      showSlide(currentSlideIndex - 1);
    }
  };

  // Next/Prev button click events
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlideIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
      showSlide(currentSlideIndex + 1);
    });
  }

  // Initialize and listen to resize
  window.addEventListener('resize', updateCarousel);
  // Run on page load after a tiny delay to ensure correct width calculations
  setTimeout(updateCarousel, 150);

  // ==========================================
  // 5. QUICK INQUIRY BAR LOGIC (Connected to 호실상세보기 Flow)
  // ==========================================
  
  // Mobile accordion logic
  const bookingCard = document.getElementById('heroBookingCard');
  const bookingHeader = document.getElementById('bookingMobileHeader');
  
  if (bookingCard && bookingHeader) {
    // Toggle on click
    bookingHeader.addEventListener('click', () => {
      bookingCard.classList.toggle('expanded');
    });

    // Auto open on scroll down
    let hasOpenedOnScroll = false;
    window.addEventListener('scroll', () => {
      if (window.innerWidth <= 768 && !hasOpenedOnScroll) {
        if (window.scrollY > 50) {
          bookingCard.classList.add('expanded');
          hasOpenedOnScroll = true;
        }
      }
    }, { passive: true });
  }

  const quickForm = document.getElementById('heroQuickForm');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Change submit button text to show loading state
      const submitBtn = quickForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = '예약 접수 중...';
      submitBtn.disabled = true;

      const formData = new FormData(quickForm);
      const scriptURL = 'https://script.google.com/macros/s/AKfycbzOYD_sJru0b3xWXL6M7DFgXRR3Dz68Y_5dnsABEkNltRC6AErf8xqIj9WqNQdT9z8o/exec';

      fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // Avoid CORS issues with Google Apps Script
        body: formData
      })
        .then(() => {
          quickForm.reset();
          alert('상담 예약이 성공적으로 접수되었습니다. 곧 연락드리겠습니다.');
        })
        .catch((error) => {
          console.error('Error!', error.message);
        })
        .finally(() => {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        });
    });
  }


  // ==========================================
  // 8. INTERACTIVE UNIT PLAN LOGIC
  // ==========================================
  const floorSelect = document.getElementById('unitFloorSelect');
  const subFloorTabs = document.getElementById('subFloorTabs');
  const unitFloorInfo = document.getElementById('unitFloorInfo');

  const floorData = {
    '18': {
      title: '지상 18층 (최상층 오피스)',
      feature: '최상층 랜드마크 오피스 및 스카이브릿지 연결층. 안양천 파노라마 조망권이 가장 극대화되는 럭셔리 업무 공간입니다.',
      east: 'E1801 ~ E1806',
      west: 'W1801 ~ W1806',
      tags: ['최상층 조망', '섹션 오피스'],
      img: 'assets/extracted_pages/floor_18.png'
    },
    '17': {
      title: '지상 17층 (최상층 오피스)',
      feature: '스카이브릿지 연결층 및 랜드마크 오피스. 높은 품격의 입주사 전용 커뮤니티 공간과 탁 트인 전망을 선사합니다.',
      east: 'E1701 ~ E1706',
      west: 'W1701 ~ W1706',
      tags: ['스카이브릿지 연계', '최고층 조망', '섹션 오피스'],
      img: 'assets/extracted_pages/floor_17.png'
    },
    '16': {
      title: '지상 16층 (고층부 오피스)',
      feature: '소음에서 벗어나 조용하고 집중도 높은 비즈니스가 가능한 고품격 고층 오피스 층입니다.',
      east: 'E1601 ~ E1615',
      west: 'W1601 ~ W1613',
      tags: ['vip공유 라운지 인접', '스카이 오피스', '친환경 설계'],
      img: 'assets/extracted_pages/floor_16.png'
    },
    '15': {
      title: '지상 15층 (고층부 오피스)',
      feature: 'vip 공용 라운지와 연계된 명품 오피스 구역으로 비즈니스 네트워킹과 쾌적한 휴식을 제공합니다.',
      east: 'E1501 ~ E1515',
      west: 'W1501 ~ W1513',
      tags: ['vip공유 라운지 인접', '스카이브릿지 연계', '고층부 뷰',],
      img: 'assets/extracted_pages/floor_15.png'
    },
    '14': {
      title: '지상 14층 (고층부 오피스)',
      feature: '일조량과 개방감이 탁월한 고층 업무 공간으로, 다양한 비즈니스 규모에 맞게 섹션화 가능합니다.',
      east: 'E1401 ~ E1417',
      west: 'W1401 ~ W1417',
      tags: ['채광 우수', '비즈니스 센터', '섹션 오피스'],
      img: 'assets/extracted_pages/floor_14.png'
    },
    '13': {
      title: '지상 13층 (고층부 오피스)',
      feature: '최적의 비즈니스 동선과 스마트 오피스 기능이 결합된 합리적 레이아웃의 고층 층입니다.',
      east: 'E1301 ~ E1317',
      west: 'W1301 ~ W1317',
      tags: ['고층부 오피스', '동선 설계 특화', '가변형 벽체'],
      img: 'assets/extracted_pages/floor_13.png'
    },
    '12': {
      title: '지상 12층 (중층부 오피스)',
      feature: '독립 타워 형태의 쾌적한 중층부 섹션 오피스로 안양천 파노라마 조망권을 마음껏 즐기실 수 있습니다.',
      east: 'E1201 ~ E1217',
      west: 'W1201 ~ W1217',
      tags: ['안양천 조망', '섹션 오피스', '개방형 레이아웃'],
      img: 'assets/extracted_pages/floor_12.png'
    },
    '11': {
      title: '지상 11층 (중층부 오피스)',
      feature: '충분한 자연 채광과 쾌적한 실내 환기 시스템이 갖추어진 생산적인 중층 업무 공간입니다.',
      east: 'E1101 ~ E1117',
      west: 'W1101 ~ W1117',
      tags: ['자연 환기', '남향 위주 배치', '쾌적한 오피스'],
      img: 'assets/extracted_pages/floor_11.png'
    },
    '10': {
      title: '지상 10층 (중층부 오피스)',
      feature: '강소기업 및 지사 사무실에 최적화된 공간 효율성과 고급 인프라를 동시에 누려보세요.',
      east: 'E1001 ~ E1017',
      west: 'W1001 ~ W1017',
      tags: ['공간 효율', '섹션 오피스', '비즈니스 공간'],
      img: 'assets/extracted_pages/floor_10.png'
    },
    '9': {
      title: '지상 9층 (중층부 오피스)',
      feature: '중소형 규모 오피스로 가변형 설계를 적용하여 다양한 기업 니즈를 완벽히 소화합니다.',
      east: 'E901 ~ E917',
      west: 'W901 ~ W917',
      tags: ['가변형 레이아웃', '스마트 워킹', '중층부 오피스'],
      img: 'assets/extracted_pages/floor_9.png'
    },
    '8': {
      title: '지상 8층 (저층부 오피스)',
      feature: 'EAST/WEST 독립동 구조를 가장 경제적인 비용으로 만날 수 있는 최적의 오피스 층입니다.',
      east: 'E801 ~ E817',
      west: 'W801 ~ W817',
      tags: ['가성비 우수', '저층부 대표 오피스', '독립동 느낌'],
      img: 'assets/extracted_pages/floor_8.png'
    },
    '7': {
      title: '지상 7층 (저층부 오피스)',
      feature: '이동 동선이 가장 단축되며 비상시 신속한 대피와 엘리베이터 연동이 편리한 실속형 층입니다.',
      east: 'E701 ~ E717',
      west: 'W701 ~ W715',
      tags: ['이동 편의성', '실속형 오피스', '섹션 오피스'],
      img: 'assets/extracted_pages/floor_7.png'
    },
    '6': {
      title: '지상 6층 (저층부 오피스)',
      feature: '로비와 에스컬레이터 접근성이 훌륭하며 스타트업 및 연구소에 매우 적합한 공간 구성을 가집니다.',
      east: 'E601 ~ E617',
      west: 'W601 ~ W617',
      tags: ['연구소 추천', '스타트업 추천', '접근성 우수'],
      img: 'assets/extracted_pages/floor_6.png'
    },
    '5': {
      title: '지상 5층 (저층부 오피스)',
      feature: '저층부 섹션 오피스의 시작층으로, 넓고 쾌적한 복도 설계와 저소음 설비가 특징입니다.',
      east: 'E501 ~ E517',
      west: 'W501 ~ W516',
      tags: ['저층부 오피스', '저소음 구역', '맞춤 인테리어'],
      img: 'assets/extracted_pages/floor_5.png'
    },
    '4': {
      title: '지상 4층 (테라스 오피스)',
      feature: '쾌적한 야외 테라스 정원과 직접 연결되어 자연 속 휴식이 비즈니스가 되는 특별한 공간입니다.',
      east: 'E401 ~ E415',
      west: 'W401 ~ W435',
      tags: ['테라스 연결층', '조경 정원', '힐링 업무 공간'],
      img: 'assets/extracted_pages/floor_4.png'
    },
    '3': {
      title: '지상 3층 (로비 및 근린생활시설/오피스)',
      feature: '중소형 기업 오피스들이 대단위로 모여 있어 상호 유기적인 협업과 소통이 활발합니다.',
      east: 'E301 ~ E315',
      west: 'W301 ~ W334',
      tags: ['비즈니스 네트워킹', '안정적인 구조', '섹션 오피스'],
      img: 'assets/extracted_pages/floor_3.png'
    },
    '2': {
      title: '지상 2층 (로비 및 근린생활시설/오피스)',
      feature: '상담실, 회의 시설 및 입주지원센터와의 접근이 아주 빠르고 원활한 스마트 비즈니스 허브입니다.',
      east: 'E201 ~ E219',
      west: 'W201 ~ W219',
      tags: ['회의실 인접', '입주지원센터', '스마트 허브'],
      img: 'assets/extracted_pages/floor_2.png'
    },
    '1': {
      title: '지상 1층 (로비 및 근린생활시설)',
      feature: '웅장한 천장고의 호텔급 그랜드 로비와 시그니처 생각카페, 비즈니스의 첫인상을 만드는 층입니다.',
      east: 'E101 (그랜드 로비 및 라운지)',
      west: 'W101 (근린상가 R101 ~ R121)',
      tags: ['호텔식 로비', '생각카페', '럭셔리 석재'],
      img: 'assets/extracted_pages/floor_1.png'
    },
    'b1': {
      title: '지하 1층 (드라이브인 공장)',
      feature: '지상 도로와 즉시 통하는 고기능 하역장과 드라이브인(Drive-in) 시스템이 설계된 제조 전용 층입니다.',
      east: 'SB101 ~ SB105',
      west: 'WB101 ~ WB112',
      tags: ['드라이브인', '도어투도어', '신속 하역장'],
      img: 'assets/extracted_pages/floor_b1.png'
    },
    'b2': {
      title: '지하 2층 (드라이브인 공장)',
      feature: '바닥 고하중 설계와 높은 천장고를 확보하여 대형 정밀 프레스, 선반 등 중장비 배치가 매우 유리합니다.',
      east: 'SB201 ~ SB207',
      west: 'WB201 ~ WB215',
      tags: ['고하중 바닥', '높은 층고', '제조형 특화'],
      img: 'assets/extracted_pages/floor_b2.png'
    },
    'b3': {
      title: '지하 3층 (드라이브인 공장)',
      feature: '각 호실 앞 개별 하역이 가능한 완벽한 드라이브인 설계로 제조 생산성을 대폭 강화하였습니다.',
      east: 'SB301 ~ SB318',
      west: 'WB301 ~ WB320',
      tags: ['드라이브인', '도어투도어', '생산성 극대화'],
      img: 'assets/extracted_pages/floor_b3.png'
    },
    'b4': {
      title: '지하 4층 (드라이브인 공장 및 창고)',
      feature: '강력한 강제 환기 송풍 및 환풍 설비와 드라이브인 하역 통로, 쾌적한 창고형 시설이 공존합니다.',
      east: 'SB401 ~ SB408',
      west: 'WB401 ~ WB412',
      tags: ['환기 설비 완비', '물류 보관', '드라이브인'],
      img: 'assets/extracted_pages/floor_b4.png'
    },
    'b5': {
      title: '지하 5층 (창고 및 주차 공간)',
      feature: '가장 넉넉한 광폭 주차면과 장기 적재 전용 개별 보관 창고들이 모여 있는 최하층 지원 인프라입니다.',
      east: 'SB501 ~ SB507',
      west: 'WB501 ~ WB510',
      tags: ['광폭 주차장', '보관 전용 창고', '풍부한 주차대수'],
      img: 'assets/extracted_pages/floor_b5.png'
    }
  };

  const floorZones = {
    'high': {
      label: '지상 13층 ~ 18층 (고층부 오피스)',
      floors: ['18', '17', '16', '15', '14', '13']
    },
    'mid': {
      label: '지상 5층 ~ 12층 (중/저층부 오피스)',
      floors: ['12', '11', '10', '9', '8', '7', '6', '5']
    },
    'low': {
      label: '지상 1층 ~ 4층 (로비 및 근린생활시설)',
      floors: ['4', '3', '2', '1']
    },
    'basement': {
      label: '지하 5층 ~ 지하 1층 (드라이브인 공장)',
      floors: ['b1', 'b2', 'b3', 'b4', 'b5']
    }
  };

  function updateFloor(selected) {
    const data = floorData[selected];
    if (data && unitFloorInfo) {
      // Apply animate class smoothly
      unitFloorInfo.classList.remove('animated');
      void unitFloorInfo.offsetWidth; // Trigger reflow for animation restart

      unitFloorInfo.innerHTML = `
        <div class="floor-info-layout">
          <div class="floor-info-content">
            <div class="floor-info-header">
              <h3>${data.title}</h3>
              <p>${data.feature}</p>
            </div>
            
            <div class="floor-wings-grid">
              <div class="wing-box">
                <span class="wing-tag east">EAST 동 배치 호실</span>
                <p class="wing-units">${data.east}</p>
              </div>
              <div class="wing-box">
                <span class="wing-tag west">WEST 동 배치 호실</span>
                <p class="wing-units">${data.west}</p>
              </div>
            </div>
            
            <div class="floor-tags">
              ${data.tags.map(tag => `<span class="floor-tag-item"># ${tag}</span>`).join('')}
            </div>
          </div>
          
          <div class="floor-info-map">
            <a href="#" class="floor-map-link" data-img="${data.img}" data-title="${data.title}" title="클릭하여 크게 보기" onclick="if(window.openFloorPlanModal){ window.openFloorPlanModal(this.getAttribute('data-img'), this.getAttribute('data-title')); return false; }">
              <img src="${data.img}" alt="${data.title} 평면 도면">
            </a>
            <span class="map-caption">💡 이미지를 클릭하시면 원본 도면을 보실 수 있습니다.</span>
          </div>
        </div>
      `;
      unitFloorInfo.classList.add('animated');
    }
  }

  function renderSubFloorButtons(zoneKey, activeFloorKey) {
    if (!subFloorTabs) return;
    const zone = floorZones[zoneKey];
    if (!zone) return;

    subFloorTabs.innerHTML = zone.floors.map(fl => {
      const isActive = fl === activeFloorKey;
      const displayLabel = fl.startsWith('b') ? `B${fl.substring(1)}F` : `${fl}F`;
      return `<button class="sub-floor-btn ${isActive ? 'active' : ''}" data-floor="${fl}">${displayLabel}</button>`;
    }).join('');

    const buttons = subFloorTabs.querySelectorAll('.sub-floor-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        buttons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const selectedFloor = e.currentTarget.getAttribute('data-floor');
        updateFloor(selectedFloor);
      });
    });
  }

  if (floorSelect) {
    floorSelect.addEventListener('change', (e) => {
      const zoneKey = e.target.value;
      const zone = floorZones[zoneKey];
      if (zone && zone.floors.length > 0) {
        const defaultFloor = zone.floors[0];
        renderSubFloorButtons(zoneKey, defaultFloor);
        updateFloor(defaultFloor);
      }
    });

    // Initial load for default zone (high, floor 18)
    const initialZone = floorSelect.value || 'high';
    renderSubFloorButtons(initialZone, '18');
  }

  // 10. PROPERTY CARD SLIDESHOW (Alternating -1 and -2 images every 5s)
  // ==========================================
  const imageWrappers = document.querySelectorAll('.listings-container .image-wrapper');
  imageWrappers.forEach(wrapper => {
    const images = wrapper.querySelectorAll('.property-image');
    if (images.length > 1) {
      let currentIndex = 0;
      setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
      }, 5000);
    }
  });

  // ==========================================
  // 11. REST ZONE IMAGE ROTATION
  // ==========================================
  const restZoneImg = document.getElementById('restZoneImg');
  if (restZoneImg) {
    let currentRestIndex = 1;
    setInterval(() => {
      currentRestIndex = currentRestIndex === 1 ? 2 : 1;
      restZoneImg.style.opacity = 0;
      setTimeout(() => {
        restZoneImg.src = `assets/concept_photos/rest%20zone${currentRestIndex}.jpg`;
        restZoneImg.style.opacity = 1;
      }, 300);
    }, 5000);
  }

  // (Facade image rotation removed because there's only one image now)

  // ==========================================
  // 12. VIP ROOM IMAGE ROTATION (Alternating vip1 and vip2 every 5s)
  // ==========================================
  const vipRoomImg = document.getElementById('vipRoomImg');
  if (vipRoomImg) {
    let currentVipIndex = 1;
    setInterval(() => {
      currentVipIndex = currentVipIndex === 1 ? 2 : 1;
      vipRoomImg.style.opacity = 0;
      setTimeout(() => {
        vipRoomImg.src = `assets/concept_photos/vip${currentVipIndex}.png`;
        vipRoomImg.style.opacity = 1;
      }, 300);
    }, 5000);
  }

  // ==========================================
  // Recommended property listings slider arrow navigation
  const listingsContainer = document.querySelector('.listings-container');
  const listingsPrevBtn = document.getElementById('listingsPrevBtn');
  const listingsNextBtn = document.getElementById('listingsNextBtn');

  if (listingsContainer && listingsPrevBtn && listingsNextBtn) {
    listingsPrevBtn.addEventListener('click', () => {
      listingsContainer.scrollBy({ left: -200, behavior: 'smooth' });
    });

    listingsNextBtn.addEventListener('click', () => {
      listingsContainer.scrollBy({ left: 200, behavior: 'smooth' });
    });

    const toggleListingArrows = () => {
      const scrollLeft = listingsContainer.scrollLeft;
      const maxScrollLeft = listingsContainer.scrollWidth - listingsContainer.clientWidth;
      const isScrollable = listingsContainer.scrollWidth > listingsContainer.clientWidth;

      // Prev button: hide if we are at start
      if (scrollLeft <= 5) {
        listingsPrevBtn.style.opacity = '0';
        listingsPrevBtn.style.visibility = 'hidden';
        listingsPrevBtn.style.pointerEvents = 'none';
      } else {
        listingsPrevBtn.style.opacity = '1';
        listingsPrevBtn.style.visibility = 'visible';
        listingsPrevBtn.style.pointerEvents = 'auto';
      }

      // Next button: hide if we are at the end and we have scrollable content
      if (isScrollable && scrollLeft >= maxScrollLeft - 5) {
        listingsNextBtn.style.opacity = '0';
        listingsNextBtn.style.visibility = 'hidden';
        listingsNextBtn.style.pointerEvents = 'none';
      } else if (!isScrollable && listingsContainer.scrollWidth > 0) {
        // If content fits completely, hide next button
        listingsNextBtn.style.opacity = '0';
        listingsNextBtn.style.visibility = 'hidden';
        listingsNextBtn.style.pointerEvents = 'none';
      } else {
        // Default to showing next button
        listingsNextBtn.style.opacity = '1';
        listingsNextBtn.style.visibility = 'visible';
        listingsNextBtn.style.pointerEvents = 'auto';
      }
    };

    // Bind all necessary listeners for layout changes
    listingsContainer.addEventListener('scroll', toggleListingArrows);
    window.addEventListener('resize', toggleListingArrows);
    window.addEventListener('load', toggleListingArrows);

    // Recalculate when any image in the listings container loads
    listingsContainer.querySelectorAll('img').forEach(img => {
      img.addEventListener('load', toggleListingArrows);
    });

    // Run multiple times during startup to ensure layout dimensions are fully calculated
    setTimeout(toggleListingArrows, 100);
    setTimeout(toggleListingArrows, 500);
    setTimeout(toggleListingArrows, 1000);
    setTimeout(toggleListingArrows, 2000);
  }

  // ==========================================
  // 15. SPECIAL PROMOTION POPUP CONTROL
  // ==========================================

  // Helper to set cookie expiring at midnight (KST/Local time midnight)
  function setPromoCookieAtMidnight(name, value) {
    try {
      const date = new Date();
      date.setHours(24, 0, 0, 0); // Local midnight
      const expires = "expires=" + date.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    } catch (e) {
      console.warn("Cookies are not available");
    }
  }

  // Helper to get cookie
  function getPromoCookie(name) {
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    } catch (e) {
      return null;
    }
  }

  // Helper to set localStorage with expiration
  function setPromoLocalStorageAtMidnight(key, value) {
    try {
      const date = new Date();
      date.setHours(24, 0, 0, 0);
      const item = {
        value: value,
        expiry: date.getTime()
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.warn("localStorage is not available");
    }
  }

  // Helper to get localStorage with expiration check
  function getPromoLocalStorage(key) {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      const item = JSON.parse(itemStr);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch (e) {
      return null;
    }
  }

  const noticeBackdrop = document.getElementById('noticeBackdrop');
  const closeNoticeBtn = document.getElementById('closeNoticeBtn');
  const closeNoticeTextBtn = document.getElementById('closeNoticeTextBtn');
  const promoNoticeCtaBtn = document.getElementById('promoNoticeCtaBtn');
  const promoCheckbox = document.getElementById('noticeHideTodayCheckbox');

  if (noticeBackdrop) {
    const hideCookie = getPromoCookie('hideNoticeModal');
    const hideLocal = getPromoLocalStorage('hideNoticeModal');

    // Show popup only if user did not opt out today
    if (!hideCookie && !hideLocal) {
      noticeBackdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    const closePopup = () => {
      if (promoCheckbox && promoCheckbox.checked) {
        setPromoCookieAtMidnight('hideNoticeModal', 'true');
        setPromoLocalStorageAtMidnight('hideNoticeModal', 'true');
      }
      noticeBackdrop.classList.remove('show');
      document.body.style.overflow = '';
    };

    if (closeNoticeBtn) {
      closeNoticeBtn.addEventListener('click', closePopup);
    }
    if (closeNoticeTextBtn) {
      closeNoticeTextBtn.addEventListener('click', closePopup);
    }

    // Close when clicking the outer backdrop
    noticeBackdrop.addEventListener('click', (e) => {
      if (e.target === noticeBackdrop) {
        closePopup();
      }
    });

    // CTA: close popup on click
    if (promoNoticeCtaBtn) {
      promoNoticeCtaBtn.addEventListener('click', () => {
        closePopup();
      });
    }
  }

  // Privacy Policy Modal Control
  const privacyPolicyModal = document.getElementById('privacyPolicyModalBackdrop');
  const openPrivacyPolicyBtn = document.getElementById('openPrivacyPolicyBtn');
  const heroOpenPrivacyPolicyBtn = document.getElementById('heroOpenPrivacyPolicyBtn');
  const closePrivacyPolicyBtn = document.getElementById('closePrivacyPolicyBtn');

  if (privacyPolicyModal && openPrivacyPolicyBtn && closePrivacyPolicyBtn) {
    openPrivacyPolicyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      privacyPolicyModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    if (heroOpenPrivacyPolicyBtn) {
      heroOpenPrivacyPolicyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        privacyPolicyModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }

    const closePolicy = () => {
      privacyPolicyModal.classList.remove('open');
      document.body.style.overflow = '';
    };

    closePrivacyPolicyBtn.addEventListener('click', closePolicy);

    privacyPolicyModal.addEventListener('click', (e) => {
      if (e.target === privacyPolicyModal) {
        closePolicy();
      }
    });
  }

  // Floor Plan Modal Control
  const floorPlanModal = document.getElementById('floorPlanModalBackdrop');
  const floorPlanImg = document.getElementById('floorPlanModalImg');
  const floorPlanTitle = document.getElementById('floorPlanModalTitle');
  const closeFloorPlanBtn = document.getElementById('closeFloorPlanBtn');

  // Functions relocated globally to top of file

  if (closeFloorPlanBtn) {
    closeFloorPlanBtn.addEventListener('click', closeFloorPlanModal);
  }

  if (floorPlanModal) {
    floorPlanModal.addEventListener('click', (e) => {
      if (e.target === floorPlanModal) {
        closeFloorPlanModal();
      }
    });
  }

  // Delegate click events for floor map link
  if (unitFloorInfo) {
    unitFloorInfo.addEventListener('click', (e) => {
      const mapLink = e.target.closest('.floor-map-link');
      if (mapLink) {
        e.preventDefault();
        const img = mapLink.getAttribute('data-img');
        const title = mapLink.getAttribute('data-title') || '지상 18층';
        openFloorPlanModal(img, title);
      }
    });
  }

  // Handle global Escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFloorPlanModal();
    }
  });

  // Mute/unmute video background
  const heroVideo = document.getElementById('heroVideo');
  const videoMuteBtn = document.getElementById('videoMuteBtn');
  if (heroVideo && videoMuteBtn) {
    const muteIcon = videoMuteBtn.querySelector('.mute-icon');
    const unmuteIcon = videoMuteBtn.querySelector('.unmute-icon');

    videoMuteBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // If currently muted, we want to unmute it
      if (heroVideo.muted || heroVideo.volume === 0) {
        heroVideo.muted = false;
        heroVideo.volume = 1;
        muteIcon.style.display = 'none';
        unmuteIcon.style.display = 'block';

        // Force play to ensure audio context is active
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => console.log("Audio play failed:", error));
        }
      } else {
        // Mute it
        heroVideo.muted = true;
        muteIcon.style.display = 'block';
        unmuteIcon.style.display = 'none';
      }
    });
  }
});




// ==========================================
// SHOWROOM SLIDER LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

  function initShowroomSlider(trackId, prevBtnId, nextBtnId, dotsId, autoPlayDelay) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsId);

    if (!track || !prevBtn || !nextBtn) return;

    // In the new layout, we might have multiple track items. 
    // We should only select slides inside THIS track's parent slider.
    const sliderParent = track.closest('.showroom-slider');
    const slides = sliderParent.querySelectorAll('.showroom-slide');
    let currentSlide = 0;
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    // Create dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'showroom-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
          goToSlide(i);
        });
        dotsContainer.appendChild(dot);
      }
    }
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.showroom-dot') : [];

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;

      currentSlide = index;

      track.style.transform = `translateX(${currentSlide * -100}%)`;

      slides.forEach(s => s.classList.remove('active'));
      if (dots.length > 0) dots.forEach(d => d.classList.remove('active'));

      slides[currentSlide].classList.add('active');
      if (dots.length > 0 && dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
    });

    // Auto play showroom
    setInterval(() => {
      goToSlide(currentSlide + 1);
    }, autoPlayDelay);
  }

  async function loadDynamicShowroomImages() {
    // 대표님께서 설정하신 Google Apps Script 웹앱 URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxYV2lBrw-boW0QKOTMLv4O_hHTW2jLPuBPVWZHGCwPeilbeI8kDBlt_lkaMdy5pZw9/exec';

    if (GOOGLE_SCRIPT_URL === 'YOUR_SCRIPT_URL_HERE') {
      // URL이 아직 없으면 기존 고정 이미지(Fallback) 사용
      initShowroomSlider('showroomTrack1', 'prevShowroomBtn1', 'nextShowroomBtn1', 'showroomDots1', 5000);
      initShowroomSlider('showroomTrack2', 'prevShowroomBtn2', 'nextShowroomBtn2', 'showroomDots2', 5500);
      return;
    }

    try {
      // Add a cache buster to prevent browser from caching the Apps Script response
      const res = await fetch(GOOGLE_SCRIPT_URL + '?t=' + new Date().getTime());
      if (!res.ok) throw new Error('Failed to fetch dynamic images');
      const data = await res.json();
      console.log("API Response:", data);

      const slider1Images = data.slider1 || [];
      const slider2Images = data.slider2 || [];

      if (slider1Images.length === 0 && slider2Images.length === 0) {
        throw new Error('No images found in Google Drive');
      }

      function buildSlidesHTML(imgUrls, altPrefix) {
        if (imgUrls.length === 0) return null;
        return imgUrls.map((url, index) => {
          // Convert the legacy uc?export=view Google Drive URL to the thumbnail API
          // which avoids the Google CORS/hotlink block that causes broken white images
          let safeUrl = url;
          if (url.includes('uc?export=view&id=')) {
            const fileId = url.split('id=')[1];
            safeUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
          }
          return `
            <div class="showroom-slide ${index === 0 ? 'active' : ''}">
              <div class="showroom-img-wrap">
                <img src="${safeUrl}" alt="${altPrefix} ${index + 1}">
              </div>
            </div>
          `;
        }).join('');
      }

      const track1 = document.getElementById('showroomTrack1');
      const track2 = document.getElementById('showroomTrack2');

      if (track1 && slider1Images.length > 0) {
        track1.innerHTML = buildSlidesHTML(slider1Images, '프리미엄 비즈니스 공간');
      }

      if (track2 && slider2Images.length > 0) {
        track2.innerHTML = buildSlidesHTML(slider2Images, '스마트 섹션 오피스');
      }

    } catch (e) {
      console.log('Using static showroom images due to API error:', e);
    } finally {
      // Re-initialize slider functionality with either new or fallback images
      initShowroomSlider('showroomTrack1', 'prevShowroomBtn1', 'nextShowroomBtn1', 'showroomDots1', 5000);
      initShowroomSlider('showroomTrack2', 'prevShowroomBtn2', 'nextShowroomBtn2', 'showroomDots2', 5500);
    }
  }

  loadDynamicShowroomImages();

});
