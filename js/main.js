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
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
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
  // 4. SPACE EXPLORER TAB & SLIDER (Four Seasons Benchmarking)
  // ==========================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const slides = document.querySelectorAll('.explorer-slide');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');

  let currentSlideIndex = 0;

  const showSlide = (index) => {
    // Boundary check
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    
    currentSlideIndex = index;

    // Update active tabs
    tabBtns.forEach((btn, idx) => {
      if (idx === currentSlideIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update active slides
    slides.forEach((slide, idx) => {
      if (idx === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  };

  // Tab click event
  tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      showSlide(index);
    });
  });

  // Next/Prev button click events
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlideIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
      showSlide(currentSlideIndex + 1);
    });
  }

  // ==========================================
  // 5. QUICK INQUIRY BAR LOGIC (Connected to 호실상세보기 Flow)
  // ==========================================
  const quickForm = document.getElementById('heroQuickForm');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Smooth scroll to 호실상세보기 section
      const 호실상세보기Section = document.getElementById('호실상세보기');
      if (호실상세보기Section) {
        호실상세보기Section.scrollIntoView({ behavior: 'smooth' });
        
        // Automatically open the 호실상세보기 modal after scroll completes
        setTimeout(() => {
          const modalBackdrop = document.getElementById('modalBackdrop');
          if (modalBackdrop) {
            modalBackdrop.classList.add('open');
            document.body.style.overflow = 'hidden';
            
            // Prefill email if entered in quick form
            const heroEmail = document.getElementById('heroEmail');
            const inputEmail = document.getElementById('inputEmail');
            if (heroEmail && inputEmail && heroEmail.value) {
              inputEmail.value = heroEmail.value;
            }
          }
        }, 800);
      }
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

  // ==========================================
  // 9. 호실 상세보기 매칭 진단 LOGIC (Rooms & Units)
  // ==========================================
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const 호실상세보기Form = document.getElementById('호실상세보기Form');
  
  const inputRent = document.getElementById('inputRent');
  
  const valTargetRent = document.getElementById('valTargetRent');
  const valDepositLimit = document.getElementById('valDepositLimit');
  const valRecArea = document.getElementById('valRecArea');
  const valRecMatchCount = document.getElementById('valRecMatchCount');

  let hasSearched = false;
  let activeIntervals = [];

  let allRooms = [
    {
      id: 'propCard1',
      roomNum: 'E1705호',
      price: 680000000,
      rent: 3000000,
      specs: 'E1705호 | 전용 35.4평 | 공급 65.2평 | 계약 70.8평',
      description: '지상 17층 스카이 오피스 (안양천 영구 조망)',
      status: '분양 및 임대 가능 (즉시 입주)',
      images: [
        'assets/room_photos/1-1.jpeg',
        'assets/room_photos/1-2.jpeg',
        'assets/concept_photos/photo_15.jpg',
        'assets/concept_photos/photo_16.jpg',
        'assets/concept_photos/photo_22.jpg'
      ]
    },
    {
      id: 'propCard2',
      roomNum: 'W1512호',
      price: 850000000,
      rent: 3800000,
      specs: 'W1512호 | 전용 45.2평 | 공급 83.1평 | 계약 90.4평',
      description: '지상 15층 코너형 프리미엄 섹션 오피스',
      status: '분양 및 임대 가능 (협의 입주)',
      images: [
        'assets/room_photos/2-2.jpeg',
        'assets/room_photos/2-1.jpeg',
        'assets/concept_photos/photo_06.jpg',
        'assets/concept_photos/photo_14.jpg',
        'assets/concept_photos/photo_18.jpg'
      ]
    },
    {
      id: 'propCard3',
      roomNum: 'B102호',
      price: 520000000,
      rent: 2300000,
      specs: 'B102호 | 전용 28.5평 | 공급 52.4평 | 계약 57.0평',
      description: '지하 1층 하역 데크 연계 드라이브인 공장',
      status: '분양 및 임대 가능 (즉시 입주)',
      images: [
        'assets/room_photos/3-1.jpeg',
        'assets/room_photos/3-2.jpeg',
        'assets/concept_photos/photo_10.jpg',
        'assets/concept_photos/photo_20.jpg',
        'assets/concept_photos/photo_24.jpg'
      ]
    },
    {
      id: 'propCard4',
      roomNum: 'E408호',
      price: 1250000000,
      rent: 5500000,
      specs: 'E408호 | 전용 65.0평 | 공급 119.6평 | 계약 130.0평',
      description: '지상 4층 광폭 테라스 연계 아틀리에 오피스',
      status: '분양 및 임대 가능 (협의 입주)',
      images: [
        'assets/room_photos/3-1.jpeg',
        'assets/room_photos/3-2.jpeg',
        'assets/concept_photos/photo_05.jpg',
        'assets/concept_photos/photo_09.jpg',
        'assets/concept_photos/photo_12.jpg'
      ]
    },
    {
      id: 'propCard5',
      roomNum: 'B204호',
      price: 720000000,
      rent: 3200000,
      specs: 'B204호 | 전용 42.1평 | 공급 77.5평 | 계약 84.2평',
      description: '지하 2층 하역 통로 인접 드라이브인 제조 공장',
      status: '분양 및 임대 가능 (즉시 입주)',
      images: [
        'assets/room_photos/2-1.jpeg',
        'assets/room_photos/2-2.jpeg',
        'assets/concept_photos/photo_10.jpg',
        'assets/concept_photos/photo_20.jpg',
        'assets/concept_photos/photo_24.jpg'
      ]
    },
    {
      id: 'propCard6',
      roomNum: 'W1802호',
      price: 760000000,
      rent: 3400000,
      specs: 'W1802호 | 전용 38.2평 | 공급 70.3평 | 계약 76.4평',
      description: '지상 18층 탑층 펜트형 스카이뷰 섹션 오피스',
      status: '분양 및 임대 가능 (즉시 입주)',
      images: [
        'assets/room_photos/1-1.jpeg',
        'assets/room_photos/1-2.jpeg',
        'assets/concept_photos/photo_07.jpg',
        'assets/concept_photos/photo_08.jpg',
        'assets/concept_photos/photo_15.jpg'
      ]
    },
    {
      id: 'propCard7',
      roomNum: 'E1211호',
      price: 430000000,
      rent: 1900000,
      specs: 'E1211호 | 전용 22.4평 | 공급 41.2평 | 계약 44.8평',
      description: '지상 12층 실속형 소형 비즈니스 임대 오피스',
      status: '분양 및 임대 가능 (즉시 입주)',
      images: [
        'assets/room_photos/2-1.jpeg',
        'assets/room_photos/2-2.jpeg',
        'assets/concept_photos/photo_02.jpg',
        'assets/concept_photos/photo_06.jpg',
        'assets/concept_photos/photo_14.jpg'
      ]
    },
    {
      id: 'propCard8',
      roomNum: 'W1004호',
      price: 980000000,
      rent: 4400000,
      specs: 'W1004호 | 전용 51.5평 | 공급 94.8평 | 계약 103.0평',
      description: '지상 10층 스페이스 가변형 중대형 섹션 오피스',
      status: '분양 및 임대 가능 (협의 입주)',
      images: [
        'assets/room_photos/3-1.jpeg',
        'assets/room_photos/3-2.jpeg',
        'assets/concept_photos/photo_12.jpg',
        'assets/concept_photos/photo_17.jpg',
        'assets/concept_photos/photo_19.jpg'
      ]
    },
    {
      id: 'propCard9',
      roomNum: 'B305호',
      price: 780000000,
      rent: 3500000,
      specs: 'B305호 | 전용 45.6평 | 공급 83.9평 | 계약 91.2평',
      description: '지하 3층 램프 인접 더블 드라이브인 제조 공장',
      status: '분양 및 임대 가능 (즉시 입주)',
      images: [
        'assets/room_photos/3-1.jpeg',
        'assets/room_photos/3-2.jpeg',
        'assets/concept_photos/photo_10.jpg',
        'assets/concept_photos/photo_20.jpg',
        'assets/concept_photos/photo_24.jpg'
      ]
    },
    {
      id: 'propCard10',
      roomNum: 'E510호',
      price: 610000000,
      rent: 2700000,
      specs: 'E510호 | 전용 31.2평 | 공급 57.4평 | 계약 62.4평',
      description: '지상 5층 집중 업무 특화 쾌적한 테라스형 오피스',
      status: '분양 및 임대 가능 (즉시 입주)',
      images: [
        'assets/room_photos/1-1.jpeg',
        'assets/room_photos/1-2.jpeg',
        'assets/concept_photos/photo_08.jpg',
        'assets/concept_photos/photo_12.jpg',
        'assets/concept_photos/photo_18.jpg'
      ]
    },
    {
      id: 'propCard11',
      roomNum: 'W1403호',
      price: 530000000,
      rent: 2400000,
      specs: 'W1403호 | 전용 27.8평 | 공급 51.2평 | 계약 55.6평',
      description: '지상 14층 안양천 조망 소형 프리미엄 오피스',
      status: '분양 및 임대 가능 (즉시 입주)',
      images: [
        'assets/room_photos/2-1.jpeg',
        'assets/room_photos/2-2.jpeg',
        'assets/concept_photos/photo_06.jpg',
        'assets/concept_photos/photo_14.jpg',
        'assets/concept_photos/photo_22.jpg'
      ]
    },
    {
      id: 'propCard12',
      roomNum: 'E807호',
      price: 790000000,
      rent: 3600000,
      specs: 'E807호 | 전용 40.5평 | 공급 74.5평 | 계약 81.0평',
      description: '지상 8층 입주 기업 선호도 최상 남향 오피스',
      status: '분양 및 임대 가능 (협의 입주)',
      images: [
        'assets/room_photos/3-1.jpeg',
        'assets/room_photos/3-2.jpeg',
        'assets/concept_photos/photo_15.jpg',
        'assets/concept_photos/photo_20.jpg',
        'assets/concept_photos/photo_23.jpg'
      ]
    },
    {
      id: 'propCard13',
      roomNum: 'B110호',
      price: 1120000000,
      rent: 5000000,
      specs: 'B110호 | 전용 62.0평 | 공급 114.1평 | 계약 124.0평',
      description: '지하 1층 대형 지입 하역 데크 다용도 제조 공장',
      status: '분양 및 임대 가능 (즉시 입주)',
      images: [
        'assets/room_photos/3-1.jpeg',
        'assets/room_photos/3-2.jpeg',
        'assets/concept_photos/photo_10.jpg',
        'assets/concept_photos/photo_20.jpg',
        'assets/concept_photos/photo_24.jpg'
      ]
    },
    {
      id: 'propCard14',
      roomNum: 'W909호',
      price: 650000000,
      rent: 2900000,
      specs: 'W909호 | 전용 33.6평 | 공급 61.8평 | 계약 67.2평',
      description: '지상 9층 엘리베이터 인접 쾌적한 비즈니스 룸',
      status: '분양 및 임대 가능 (즉시 입주)',
      images: [
        'assets/room_photos/1-1.jpeg',
        'assets/room_photos/1-2.jpeg',
        'assets/concept_photos/photo_08.jpg',
        'assets/concept_photos/photo_12.jpg',
        'assets/concept_photos/photo_15.jpg'
      ]
    },
    {
      id: 'propCard15',
      roomNum: 'E1601호',
      price: 920000000,
      rent: 4100000,
      specs: 'E1601호 | 전용 48.0평 | 공급 88.3평 | 계약 96.0평',
      description: '지상 16층 고층부 안양천 조망 럭셔리 스카이 오피스',
      status: '분양 및 임대 가능 (협의 입주)',
      images: [
        'assets/room_photos/2-1.jpeg',
        'assets/room_photos/2-2.jpeg',
        'assets/concept_photos/photo_02.jpg',
        'assets/concept_photos/photo_06.jpg',
        'assets/concept_photos/photo_23.jpg'
      ]
    },
    {
      id: 'propCard16',
      roomNum: 'W606호',
      price: 480000000,
      rent: 2100000,
      specs: 'W606호 | 전용 25.1평 | 공급 46.2평 | 계약 50.2평',
      description: '지상 6층 휴식정원 연계 가성비 우수 임대 호실',
      status: '분양 및 임대 가능 (즉시 입주)',
      images: [
        'assets/room_photos/2-1.jpeg',
        'assets/room_photos/2-2.jpeg',
        'assets/concept_photos/photo_14.jpg',
        'assets/concept_photos/photo_18.jpg',
        'assets/concept_photos/photo_22.jpg'
      ]
    },
    {
      id: 'propCard17',
      roomNum: 'E1002호',
      price: 1050000000,
      rent: 4700000,
      specs: 'E1002호 | 전용 55.0평 | 공급 101.2평 | 계약 110.0평',
      description: '지상 10층 사옥용 복합 가변 연접 오피스 추천',
      status: '분양 및 임대 가능 (협의 입주)',
      images: [
        'assets/room_photos/3-1.jpeg',
        'assets/room_photos/3-2.jpeg',
        'assets/concept_photos/photo_12.jpg',
        'assets/concept_photos/photo_17.jpg',
        'assets/concept_photos/photo_19.jpg'
      ]
    },
    {
      id: 'propCard18',
      roomNum: 'B215호',
      price: 660000000,
      rent: 2900000,
      specs: 'B215호 | 전용 37.5평 | 공급 69.0평 | 계약 75.0평',
      description: '지하 2층 화역 하적 데크 연계 5톤 차량 진입 공장',
      status: '분양 및 임대 가능 (즉시 입주)',
      images: [
        'assets/room_photos/3-1.jpeg',
        'assets/room_photos/3-2.jpeg',
        'assets/concept_photos/photo_10.jpg',
        'assets/concept_photos/photo_20.jpg',
        'assets/concept_photos/photo_24.jpg'
      ]
    },
    {
      id: 'propCard19',
      roomNum: 'W1110호',
      price: 400000000,
      rent: 1800000,
      specs: 'W1110호 | 전용 20.8평 | 공급 38.3평 | 계약 41.6평',
      description: '지상 11층 스타트업 최적 임대 소형 저예산 오피스',
      status: '분양 및 임대 가능 (즉시 입주)',
      images: [
        'assets/room_photos/1-1.jpeg',
        'assets/room_photos/1-2.jpeg',
        'assets/concept_photos/photo_08.jpg',
        'assets/concept_photos/photo_12.jpg',
        'assets/concept_photos/photo_15.jpg'
      ]
    },
    {
      id: 'propCard20',
      roomNum: 'E1508호',
      price: 820000000,
      rent: 3700000,
      specs: 'E1508호 | 전용 43.4평 | 공급 79.9평 | 계약 86.8평',
      description: '지상 15층 채광 우수 남향 중층 비즈니스 룸',
      status: '분양 및 임대 가능 (협의 입주)',
      images: [
        'assets/room_photos/2-1.jpeg',
        'assets/room_photos/2-2.jpeg',
        'assets/concept_photos/photo_02.jpg',
        'assets/concept_photos/photo_06.jpg',
        'assets/concept_photos/photo_22.jpg'
      ]
    }
  ];

  function initCardImageRotations() {
    activeIntervals.forEach(clearInterval);
    activeIntervals = [];

    const imageWrappers = document.querySelectorAll('.listings-container .image-wrapper');
    imageWrappers.forEach(wrapper => {
      const images = wrapper.querySelectorAll('.property-image');
      if (images.length > 1) {
        let currentIndex = 0;
        const intervalId = setInterval(() => {
          images[currentIndex].classList.remove('active');
          currentIndex = (currentIndex + 1) % images.length;
          images[currentIndex].classList.add('active');
        }, 5000);
        activeIntervals.push(intervalId);
      }
    });
  }

  function renderPropertyCards(roomsList, isLocked = true) {
    const container = document.getElementById('listingsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (roomsList.length === 0) {
      container.innerHTML = `
        <div class="no-match-card">
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h4>조건에 맞는 추천 호실이 없습니다</h4>
          <p>희망 월 임대료(예산)를 상향 조정하신 후 다시 조회해 보세요. 더 많은 프리미엄 호실을 만나보실 수 있습니다.</p>
        </div>
      `;
      return;
    }

    roomsList.forEach((room, index) => {
      const card = document.createElement('div');
      card.className = `property-card ${isLocked ? 'locked' : ''} fade-in-card`;
      card.id = room.id;
      card.style.animationDelay = `${index * 80}ms`;

      let imagesHtml = '';
      room.images.forEach((imgUrl, i) => {
        imagesHtml += `<img src="${imgUrl}" alt="${room.roomNum} 사진 ${i+1}" class="property-image ${i === 0 ? 'active' : ''}" draggable="false">`;
      });

      card.innerHTML = `
        <div class="image-wrapper">
          ${imagesHtml}
          <div class="image-overlay">
            <span class="badge-호실상세보기" id="badge-${room.id}">${isLocked ? '호실 확인하기' : '예산 범위 내'}</span>
          </div>
        </div>
        <div class="property-details">
          <div class="skeleton-group">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text-short"></div>
            <div class="skeleton skeleton-text-long"></div>
            <div class="skeleton skeleton-text-pill"></div>
          </div>
          <div class="real-content" style="${isLocked ? 'display:none;' : 'display:block;'}">
            <h3 class="prop-price">₩${room.price.toLocaleString('ko-KR')}</h3>
            <p class="prop-specs"><strong>${room.roomNum}</strong>${room.specs.includes('|') ? ' | ' + room.specs.split('|').slice(1).join('|').trim() : ''}</p>
            <p class="prop-address">${room.description}</p>
            <div class="prop-status-row">
              <span class="status-indicator active"></span>
              <span class="prop-status-text">${room.status}</span>
            </div>
          </div>
        </div>
      `;

      card.setAttribute('data-price', room.price);
      card.setAttribute('data-rent', room.rent);

      card.addEventListener('click', () => {
        if (card.classList.contains('locked')) return;
        openGallery({
          title: `${room.roomNum} 상세 갤러리`,
          specs: room.specs,
          images: room.images
        });
      });

      container.appendChild(card);
    });

    initCardImageRotations();
  }

  // Render initial 5 fallback cards
  renderPropertyCards(allRooms.slice(0, 5), true);


  // Input Formatting Helpers
  function formatNumber(numStr) {
    const cleanStr = numStr.replace(/\D/g, '');
    if (!cleanStr) return '';
    return Number(cleanStr).toLocaleString('ko-KR');
  }
  
  function parseNumber(formattedStr) {
    return Number(formattedStr.replace(/,/g, '')) || 0;
  }
  
  if (inputRent) {
    inputRent.addEventListener('input', (e) => {
      const startCursor = e.target.selectionStart;
      const originalLength = e.target.value.length;
      
      const formatted = formatNumber(e.target.value);
      e.target.value = formatted;
      
      const lengthDiff = formatted.length - originalLength;
      e.target.setSelectionRange(startCursor + lengthDiff, startCursor + lengthDiff);
    });
    
    inputRent.addEventListener('focus', (e) => {
      e.target.select();
    });
  }

  // Modal actions
  if (openModalBtn && closeModalBtn && modalBackdrop) {
    openModalBtn.addEventListener('click', () => {
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    
    closeModalBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    });
    
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // 구글 스프레드시트 기록용 Google Apps Script 웹 앱 URL
  // (실제 배포 완료 후 발급받은 URL을 아래 작은따옴표 사이에 입력해 주세요)
  const GOOGLE_SCRIPT_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbyI9PNCwCOFc65WxE4chBBSav59igs0GueDxbofzbkQq-XsC79igGiD5aDWgc6WPswM/exec';

  // Form submit
  if (호실상세보기Form) {
    호실상세보기Form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const companyName = document.getElementById('inputCompanyName').value;
      const phone = document.getElementById('inputPhone').value;
      const email = document.getElementById('inputEmail').value;
      const rentInput = parseNumber(inputRent.value);
      const privacyConsent = document.getElementById('inputPrivacyConsent');
      
      // 개인정보 보호법 제15조/제22조 준수 동의 확인
      if (privacyConsent && !privacyConsent.checked) {
        alert("개인정보 수집 및 이용 약관에 동의해 주세요.");
        privacyConsent.focus();
        return;
      }

      // 이메일 주소 유효성 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("올바른 이메일 형식을 입력해 주세요.");
        document.getElementById('inputEmail').focus();
        return;
      }
      
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (!cleanPhone.startsWith('010')) {
        alert("전화번호는 010으로 시작해야 합니다.");
        document.getElementById('inputPhone').focus();
        return;
      }
      
      if (rentInput <= 0) {
        alert("올바른 희망 임대료를 입력해 주세요.");
        return;
      }

      // Set hasSearched flag to true
      hasSearched = true;

      // Filter rooms matching user's budget: rent <= rentInput, limited to at most 5 rooms
      const matchedRoomsList = allRooms.filter(r => rentInput >= r.rent).slice(0, 5);
      const matchingCount = matchedRoomsList.length;
      const matchedRoomNums = matchedRoomsList.map(r => r.roomNum);

      // Calculations
      const depositLimit = rentInput * 10;
      const recommendedArea = Math.round(rentInput / 85000);

      // 구글 스프레드시트 전송 연동 (Apps Script Web App POST)
      if (GOOGLE_SCRIPT_WEBAPP_URL && !GOOGLE_SCRIPT_WEBAPP_URL.includes('YOUR_DEPLOYED_SCRIPT_ID')) {
        const formData = new URLSearchParams();
        formData.append('companyName', companyName);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('rent', rentInput.toLocaleString('ko-KR') + "원");
        formData.append('recommendedRooms', `추천 ${matchingCount}개 호실 (${matchedRoomNums.join(', ') || '없음'})`);

        fetch(GOOGLE_SCRIPT_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors', // Redirect CORS 우회
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        })
        .then(() => console.log('Successfully sent data to Google Sheets!'))
        .catch(err => console.error('Error sending data to Google Sheets:', err));
      } else {
        console.warn('Google Script Web App URL is not configured. Local simulation only.');
      }
      
      // Close modal
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
      
      // Update company status header info
      const companyStatus = document.getElementById('companyStatus');
      if (companyStatus) {
        companyStatus.innerText = `${companyName} (${email} / ${phone}) 님 추천 호실`;
        companyStatus.style.display = 'block';
      }
      
      // Log lead information (mocking database entry)
      console.log('New Lead Received (Leasing Matching):', {
        companyName,
        phone,
        email,
        rentInput,
        depositLimit,
        recommendedArea,
        matchingCount
      });
      
      // Animate counting numbers
      animateNumberUpdate(valTargetRent, rentInput, "₩");
      animateNumberUpdate(valDepositLimit, depositLimit, "₩");
      animateNumberUpdate(valRecArea, recommendedArea, "", " 평");
      animateNumberUpdate(valRecMatchCount, matchingCount, "", " 개호실");
      
      openModalBtn.innerHTML = "<span>매칭 조건 변경</span>";
      
      // Render matched rooms in UNLOCKED state (isLocked = false)
      renderPropertyCards(matchedRoomsList, false);
    });
  }

  function animateNumberUpdate(element, targetVal, prefix = "", suffix = "") {
    element.classList.add('active-value');
    let startVal = 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(startVal + easeProgress * (targetVal - startVal));
      
      element.innerHTML = `${prefix} ${currentVal.toLocaleString()}${suffix}`;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }
  // ==========================================
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

  // ==========================================
  // 11b. FACADE / SKYBRIDGE IMAGE ROTATION (Alternating main1 and main2 every 5s)
  // ==========================================
  const facadeImg = document.getElementById('facadeImg');
  if (facadeImg) {
    let currentFacadeIndex = 1;
    setInterval(() => {
      currentFacadeIndex = currentFacadeIndex === 1 ? 2 : 1;
      facadeImg.style.opacity = 0;
      setTimeout(() => {
        facadeImg.src = `assets/main${currentFacadeIndex}.png`;
        facadeImg.style.opacity = 1;
      }, 300);
    }, 5000);
  }

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
  // 13. INTERACTIVE ROOM DETAIL GALLERY MODAL
  // ==========================================
  const roomPhotos = {
    'propCard1': {
      title: '스카이 오피스 E1705호 상세 갤러리',
      specs: 'E1705호 | 전용 35.4평 | 공급 65.2평 | 계약 70.8평',
      images: [
        'assets/room_photos/1-1.jpeg',
        'assets/room_photos/1-2.jpeg',
        'assets/concept_photos/photo_15.jpg',
        'assets/concept_photos/photo_16.jpg',
        'assets/concept_photos/photo_22.jpg'
      ]
    },
    'propCard2': {
      title: '코너 프리미엄 오피스 W1512호 상세 갤러리',
      specs: 'W1512호 | 전용 45.2평 | 공급 83.1평 | 계약 90.4평',
      images: [
        'assets/room_photos/2-2.jpeg',
        'assets/room_photos/2-1.jpeg',
        'assets/concept_photos/photo_06.jpg',
        'assets/concept_photos/photo_14.jpg',
        'assets/concept_photos/photo_18.jpg'
      ]
    },
    'propCard3': {
      title: '드라이브인 제조 공장 B102호 상세 갤러리',
      specs: 'B102호 | 전용 28.5평 | 공급 52.4평 | 계약 57.0평',
      images: [
        'assets/room_photos/3-1.jpeg',
        'assets/room_photos/3-2.jpeg',
        'assets/concept_photos/photo_10.jpg',
        'assets/concept_photos/photo_20.jpg',
        'assets/concept_photos/photo_24.jpg'
      ]
    },
    'propCard4': {
      title: '테라스 아틀리에 E408호 상세 갤러리',
      specs: 'E408호 | 전용 65.0평 | 공급 119.6평 | 계약 130.0평',
      images: [
        'assets/room_photos/3-1.jpeg',
        'assets/room_photos/3-2.jpeg',
        'assets/concept_photos/photo_05.jpg',
        'assets/concept_photos/photo_09.jpg',
        'assets/concept_photos/photo_12.jpg'
      ]
    },
    'propCard5': {
      title: '드라이브인 제조 공장 B204호 상세 갤러리',
      specs: 'B204호 | 전용 42.1평 | 공급 77.5평 | 계약 84.2평',
      images: [
        'assets/room_photos/2-1.jpeg',
        'assets/room_photos/2-2.jpeg',
        'assets/concept_photos/photo_10.jpg',
        'assets/concept_photos/photo_20.jpg',
        'assets/concept_photos/photo_24.jpg'
      ]
    }
  };

  const PLACEHOLDER_IMAGE = 'assets/room_photos/placeholder.png';

  // Initialize all static rooms to use the placeholder image by default
  allRooms.forEach(room => {
    room.images = [PLACEHOLDER_IMAGE];
  });
  
  // Initialize all static roomPhotos to use the placeholder image by default
  Object.keys(roomPhotos).forEach(key => {
    roomPhotos[key].images = [PLACEHOLDER_IMAGE];
  });

  let currentGalleryList = [];
  let currentGalleryIndex = 0;

  const galleryModalBackdrop = document.getElementById('galleryModalBackdrop');
  const galleryMainImage = document.getElementById('galleryMainImage');
  const galleryModalTitle = document.getElementById('galleryModalTitle');
  const galleryModalSpecs = document.getElementById('galleryModalSpecs');
  const galleryThumbnails = document.getElementById('galleryThumbnails');
  const closeGalleryBtn = document.getElementById('closeGalleryBtn');
  const galleryPrevBtn = document.getElementById('galleryPrevBtn');
  const galleryNextBtn = document.getElementById('galleryNextBtn');
  
  // W1101 Comments references
  const galleryCommentsColumn = document.getElementById('galleryCommentsColumn');
  const commentsList = document.getElementById('commentsList');
  const commentsForm = document.getElementById('commentsForm');
  const commentTypeSelect = document.getElementById('commentType');
  const commentAdminPwInput = document.getElementById('commentAdminPw');
  const commentAuthorInput = document.getElementById('commentAuthor');
  const commentPwInput = document.getElementById('commentPw');
  const commentPrivateCheckbox = document.getElementById('commentPrivate');
  const commentTextInput = document.getElementById('commentText');

  // Track unlocked private comment IDs for current session
  const unlockedPrivateComments = new Set();

  // Toggle admin password field visibility
  if (commentTypeSelect && commentAdminPwInput) {
    commentTypeSelect.addEventListener('change', () => {
      if (commentTypeSelect.value === 'admin') {
        commentAdminPwInput.style.display = 'block';
        commentAdminPwInput.required = true;
        if (commentAuthorInput) {
          commentAuthorInput.value = '관리자';
        }
      } else {
        commentAdminPwInput.style.display = 'none';
        commentAdminPwInput.required = false;
        if (commentAuthorInput) {
          commentAuthorInput.value = '';
        }
      }
    });
  }

  // ponytail: Sweden standard Swedish locale sv Sweden format outputs exactly YYYY-MM-DD HH:mm:ss
  const getFormattedDateTime = () => new Date().toLocaleString('sv').slice(0, 16);

  // ponytail: 1-line browser native character replacer for HTML safety
  const escapeHTML = str => (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  function renderW1101Comments() {
    if (!commentsList) return;
    
    let comments = [];
    try {
      const stored = localStorage.getItem('comments_W1101');
      if (stored) {
        comments = JSON.parse(stored);
      } else {
        comments = [
          { id: 1, author: "분양상담실", text: "W1101호는 코너 자리에 위치하여 채광과 안양천 뷰가 극대화된 최고 평형 오피스입니다.", date: "2026-06-25 14:00", type: "admin", isPrivate: false, password: "1234" },
          { id: 2, author: "임대관리부", text: "현재 대기업 IT 개발팀에서 입주 협의 중인 호실입니다. 사전 예약 후 방문 안내 요망.", date: "2026-06-28 10:30", type: "admin", isPrivate: false, password: "1234" }
        ];
        localStorage.setItem('comments_W1101', JSON.stringify(comments));
      }
    } catch (e) {
      console.error(e);
    }

    commentsList.innerHTML = '';
    
    if (comments.length === 0) {
      commentsList.innerHTML = `<div style="text-align: center; color: #666; font-size: 0.8rem; padding: 2rem 0; font-weight: 300;">등록된 메모가 없습니다.</div>`;
      return;
    }

    comments.forEach(comment => {
      const item = document.createElement('div');
      item.className = `comment-item type-${comment.type || 'customer'}`;
      
      let textHTML = '';
      const isPrivate = !!comment.isPrivate;
      const isUnlocked = unlockedPrivateComments.has(comment.id);
      
      if (isPrivate && !isUnlocked) {
        textHTML = `<div class="comment-text private-locked" data-id="${comment.id}">🔒 비밀댓글입니다. (클릭하여 비번 입력)</div>`;
      } else {
        const privateLabel = isPrivate ? '<span style="color:#00ff55; font-size:0.75rem; margin-right:0.3rem; font-weight:600;">[비밀글]</span>' : '';
        const textClass = isPrivate ? 'comment-text private-unlocked' : 'comment-text';
        textHTML = `<div class="${textClass}">${privateLabel}${escapeHTML(comment.text)}</div>`;
      }

      const badgeClass = comment.type === 'admin' ? 'admin' : 'customer';
      const badgeText = comment.type === 'admin' ? '공지/답변' : '고객질문';

      item.innerHTML = `
        <div class="comment-item-header">
          <div class="comment-author-wrapper">
            <span class="comment-badge ${badgeClass}">${badgeText}</span>
            <span class="comment-author">${escapeHTML(comment.author)}</span>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span class="comment-date">${comment.date}</span>
            <button class="comment-delete-btn" data-id="${comment.id}" title="삭제">&times;</button>
          </div>
        </div>
        ${textHTML}
      `;

      const deleteBtn = item.querySelector('.comment-delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteW1101Comment(comment.id, comment.password);
        });
      }

      const lockedText = item.querySelector('.comment-text.private-locked');
      if (lockedText) {
        lockedText.addEventListener('click', (e) => {
          e.stopPropagation();
          unlockPrivateComment(comment.id, comment.password);
        });
      }

      commentsList.appendChild(item);
    });

    commentsList.scrollTop = commentsList.scrollHeight;
  }

  function unlockPrivateComment(id, correctPassword) {
    const input = prompt("비밀댓글 확인을 위해 비밀번호 4자리를 입력하세요\n(관리자는 관리자 암호 '1234' 입력 가능):");
    if (input === null) return;
    
    if (input === String(correctPassword) || input === '1234') {
      unlockedPrivateComments.add(id);
      renderW1101Comments();
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  }

  function addW1101Comment(author, text, type, isPrivate, password) {
    let comments = [];
    try {
      const stored = localStorage.getItem('comments_W1101');
      if (stored) {
        comments = JSON.parse(stored);
      }
    } catch(e) {}

    const newComment = {
      id: Date.now(),
      author: author || (type === 'admin' ? '관리자' : '고객'),
      text: text,
      date: getFormattedDateTime(),
      type: type || 'customer',
      isPrivate: !!isPrivate,
      password: password || '0000'
    };

    comments.push(newComment);
    localStorage.setItem('comments_W1101', JSON.stringify(comments));
    
    if (isPrivate) {
      unlockedPrivateComments.add(newComment.id);
    }
    
    renderW1101Comments();
  }

  function deleteW1101Comment(id, correctPassword) {
    const input = prompt("삭제 확인을 위해 비밀번호를 입력하세요\n(관리자는 관리자 암호 '1234' 입력 가능):");
    if (input === null) return;

    if (input === String(correctPassword) || input === '1234') {
      let comments = [];
      try {
        const stored = localStorage.getItem('comments_W1101');
        if (stored) {
          comments = JSON.parse(stored);
        }
      } catch(e) {}

      comments = comments.filter(c => c.id !== id);
      localStorage.setItem('comments_W1101', JSON.stringify(comments));
      renderW1101Comments();
    } else {
      alert("비밀번호가 일치하지 않아 삭제할 수 없습니다.");
    }
  }

  if (commentsForm) {
    commentsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!commentTextInput) return;
      
      const type = commentTypeSelect ? commentTypeSelect.value : 'customer';
      if (type === 'admin' && commentAdminPwInput) {
        if (commentAdminPwInput.value !== '1234') {
          alert("관리자 비밀번호(1234)가 올바르지 않습니다.");
          return;
        }
      }
      
      const author = commentAuthorInput ? commentAuthorInput.value.trim() : '';
      const text = commentTextInput.value.trim();
      const isPrivate = commentPrivateCheckbox ? commentPrivateCheckbox.checked : false;
      const password = commentPwInput ? commentPwInput.value.trim() : '0000';
      
      if (text) {
        addW1101Comment(author, text, type, isPrivate, password);
        commentTextInput.value = '';
        if (commentPwInput) commentPwInput.value = '';
        if (commentPrivateCheckbox) commentPrivateCheckbox.checked = false;
        if (commentAdminPwInput) commentAdminPwInput.value = '';
      }
    });
  }

  // Dynamic cards have their own event listeners bound inside renderPropertyCards.

  function openGallery(data) {
    currentGalleryList = data.images;
    currentGalleryIndex = 0;
    
    if (galleryModalTitle) galleryModalTitle.innerText = data.title;
    if (galleryModalSpecs) galleryModalSpecs.innerText = data.specs;
    
    updateGalleryView();
    
    // Reset private comments unlock status for new session
    unlockedPrivateComments.clear();
    
    // Check if W1101 to activate comments
    const isW1101 = data.title.includes('W1101') || data.specs.includes('W1101');
    const container = document.querySelector('.gallery-modal-container');
    if (isW1101) {
      if (galleryCommentsColumn) galleryCommentsColumn.style.display = 'flex';
      if (container) container.classList.add('with-comments');
      renderW1101Comments();
    } else {
      if (galleryCommentsColumn) galleryCommentsColumn.style.display = 'none';
      if (container) container.classList.remove('with-comments');
    }
    
    if (galleryModalBackdrop) {
      galleryModalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function updateGalleryView() {
    if (!galleryMainImage) return;
    
    galleryMainImage.style.opacity = 0;
    setTimeout(() => {
      galleryMainImage.src = currentGalleryList[currentGalleryIndex];
      galleryMainImage.style.opacity = 1;
    }, 150);
    
    if (galleryThumbnails) {
      galleryThumbnails.innerHTML = currentGalleryList.map((img, idx) => {
        const isActive = idx === currentGalleryIndex;
        return `
          <div class="gallery-thumb ${isActive ? 'active' : ''}" data-index="${idx}">
            <img src="${img}" alt="썸네일 ${idx + 1}">
          </div>
        `;
      }).join('');
      
      const thumbs = galleryThumbnails.querySelectorAll('.gallery-thumb');
      thumbs.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
          currentGalleryIndex = idx;
          updateGalleryView();
        });
      });
    }
  }

  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryList.length) % currentGalleryList.length;
      updateGalleryView();
    });
  }

  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryList.length;
      updateGalleryView();
    });
  }

  if (closeGalleryBtn && galleryModalBackdrop) {
    closeGalleryBtn.addEventListener('click', () => {
      galleryModalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    });
    
    galleryModalBackdrop.addEventListener('click', (e) => {
      if (e.target === galleryModalBackdrop) {
        galleryModalBackdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================
  // 14. GOOGLE SHEETS DYNAMIC DATA SYNC
  // ==========================================
  // To use your own Google Sheet:
  // 1. Create a Google Spreadsheet with column headers in row 1:
  //    card, 공간, 전용평형, 공급평형, 계약평형, price, rent, 소개글, 현황, 1-1, 1-2, 1-3, 1-4, 1-5
  // 2. Populate values in row 2 onwards (e.g. card = propCard1)
  // 3. Share the Google Sheet: "Anyone with the link can view"
  // 4. Copy the spreadsheet ID from the URL and paste it below.
  const SPREADSHEET_ID = 'https://docs.google.com/spreadsheets/d/1JL5_OxcOXRy2QE9mwfjwJF7R7GEavIwG9UGB3oLJe9E/edit?gid=0#gid=0'; // Replace this with your Google Sheet ID

  function parseCSV(text) {
    const lines = text.split(/\r?\n/);
    if (lines.length === 0) return [];
    
    function parseCSVLine(line) {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    }
    
    const headers = parseCSVLine(lines[0]);
    const parsedData = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = parseCSVLine(line);
      const item = {};
      headers.forEach((header, idx) => {
        if (!header) return;
        let val = values[idx] || '';
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        item[header] = val;
      });
      parsedData.push(item);
    }
    return parsedData;
  }

  function convertGoogleDriveLink(url) {
    if (!url) return '';
    const urlStr = String(url).trim();
    if (urlStr.includes('drive.google.com')) {
      let fileId = '';
      if (urlStr.includes('/file/d/')) {
        fileId = urlStr.split('/file/d/')[1].split('/')[0];
      } else if (urlStr.includes('?id=')) {
        fileId = urlStr.split('?id=')[1].split('&')[0];
      }
      if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
      }
    }
    return urlStr;
  }

  function updateWebsiteData(dataList) {
    dataList.forEach(item => {
      // Resolve cardId from sheet row. Supports both 'card' and 'card_id'
      const cardId = item.card || item.card_id || ('propCard_' + Math.random().toString(36).substr(2, 9));
      if (!cardId) return;
      
      // Resolve room number (호실 / 공간)
      let roomNum = '';
      if (item.호실) {
        roomNum = String(item.호실).trim();
      } else if (item.공간) {
        roomNum = String(item.공간).trim();
      }
      
      // Skip empty sheet rows so they don't overwrite static default data
      if (!roomNum) return;
      
      // Construct specs string
      let specsStr = '';
      if (item['전용면적/계약면적']) {
        const parts = String(item['전용면적/계약면적']).split('/');
        const exVal = parts[0] ? parts[0].trim() : '';
        const coVal = parts[1] ? parts[1].trim() : '';
        
        let exText = exVal;
        let coText = coVal;
        
        if (exVal && !isNaN(exVal)) {
          const py = (parseFloat(exVal) * 0.3025).toFixed(1);
          exText = `${exVal}㎡ (${py}평)`;
        }
        if (coVal && !isNaN(coVal)) {
          const py = (parseFloat(coVal) * 0.3025).toFixed(1);
          coText = `${coVal}㎡ (${py}평)`;
        }
        
        const partsArr = [];
        if (exText) partsArr.push(`전용 ${exText}`);
        if (coText) partsArr.push(`계약 ${coText}`);
        
        specsStr = roomNum + (partsArr.length > 0 ? ' | ' + partsArr.join(' | ') : '');
      } else if (item.전용평형 || item.공급평형 || item.계약평형) {
        const p1 = item.전용평형 ? `전용 ${String(item.전용평형).includes('평') ? item.전용평형 : item.전용평형 + '평'}` : '';
        const p2 = item.공급평형 ? `공급 ${String(item.공급평형).includes('평') ? item.공급평형 : item.공급평형 + '평'}` : '';
        const p3 = item.계약평형 ? `계약 ${String(item.계약평형).includes('평') ? item.계약평형 : item.계약평형 + '평'}` : '';
        const parts = [p1, p2, p3].filter(Boolean);
        specsStr = roomNum + (parts.length > 0 ? ' | ' + parts.join(' | ') : '');
      } else if (item.specs) {
        specsStr = String(item.specs).trim();
        roomNum = specsStr.split('|')[0].trim();
      }
      
      // Resolve price and rent (보증금/임대가)
      let depVal = 0;
      let rentVal = 0;
      
      if (item['보증금/임대가']) {
        const cleanStr = String(item['보증금/임대가']).replace(/,/g, '');
        const parts = cleanStr.split('/');
        const p1 = parseFloat(parts[0]);
        let p2 = parts[1] ? parseFloat(parts[1]) : null;
        
        if (!isNaN(p1)) {
          const depMultiplier = p1 < 100000 ? 10000 : 1;
          depVal = p1 * depMultiplier;
          
          if (p2 !== null && !isNaN(p2)) {
            if (p1 === p2) {
              const rentMultiplier = p2 < 100000 ? 10000 : 1;
              rentVal = (p2 / 10) * rentMultiplier;
            } else {
              const rentMultiplier = p2 < 100000 ? 10000 : 1;
              rentVal = p2 * rentMultiplier;
            }
          } else {
            rentVal = depVal / 10;
          }
        }
      } else {
        depVal = Number(item.price || item.deposit || 0);
        rentVal = Number(item.rent || 0);
      }
      
      // Resolve 소개글 / 설명
      const descriptionText = item['설명'] || item['소개글'] || item['address'] || '';
      
      // Resolve 현황
      const statusText = item['현황'] || item['status'] || '분양 및 임대 가능 (즉시 입주)';
      
      // Resolve images
      const images = [];
      for (let i = 1; i <= 5; i++) {
        const imgVal = item[`1-${i}`];
        if (imgVal) images.push(convertGoogleDriveLink(imgVal));
      }
      
      const finalImages = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
      
      const roomData = {
        id: cardId,
        roomNum: roomNum || cardId,
        price: depVal,
        rent: rentVal,
        specs: specsStr || `${roomNum || cardId}`,
        description: descriptionText || '',
        status: statusText || '분양 및 임대 가능 (즉시 입주)',
        images: finalImages
      };
      
      // Update roomPhotos in-memory as well for gallery detail modal
      roomPhotos[cardId] = {
        title: `${roomData.roomNum} 상세 갤러리`,
        specs: roomData.specs,
        images: roomData.images
      };
      
      // Check if this room is already in allRooms
      const existingIdx = allRooms.findIndex(r => r.id === cardId || (roomNum && r.roomNum === roomNum));
      if (existingIdx > -1) {
        allRooms[existingIdx] = roomData;
      } else {
        allRooms.push(roomData);
      }
    });
    
    console.log('Google Sheets room data applied successfully!', allRooms);
    
    // Refresh default 5 locked cards if no search has occurred
    if (!hasSearched) {
      renderPropertyCards(allRooms.slice(0, 5), true);
    }
  }

  // Load spreadsheet data asynchronously
  let cleanSpreadsheetId = SPREADSHEET_ID;
  if (cleanSpreadsheetId && cleanSpreadsheetId.includes('/d/')) {
    cleanSpreadsheetId = cleanSpreadsheetId.split('/d/')[1].split('/')[0];
  }
  if (cleanSpreadsheetId && cleanSpreadsheetId !== '12n4h9gVv9wM7jX6e91m8Ua1pC_X00X0X0X0X0X0X0X0') {
    fetch(`https://docs.google.com/spreadsheets/d/${cleanSpreadsheetId}/export?format=csv`)
      .then(res => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.text();
      })
      .then(text => {
        try {
          const dataList = parseCSV(text);
          updateWebsiteData(dataList);
        } catch (e) {
          console.warn('Failed to parse Google Sheet CSV data, fallback to static:', e);
        }
      })
      .catch(e => {
        console.warn('Failed to fetch dynamic Google Sheet CSV data, fallback to static:', e);
      });
  }

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
    const date = new Date();
    date.setHours(24, 0, 0, 0); // Local midnight
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
  }

  // Helper to get cookie
  function getPromoCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Helper to set localStorage with expiration
  function setPromoLocalStorageAtMidnight(key, value) {
    const date = new Date();
    date.setHours(24, 0, 0, 0);
    const item = {
      value: value,
      expiry: date.getTime()
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  // Helper to get localStorage with expiration check
  function getPromoLocalStorage(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    try {
      const item = JSON.parse(itemStr);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch(e) {
      return null;
    }
  }

  const promoBackdrop = document.getElementById('promoPopupBackdrop');
  const closePromoBtn = document.getElementById('closePromoBtn');
  const closePromoTextBtn = document.getElementById('closePromoTextBtn');
  const promoCtaBtn = document.getElementById('promoCtaBtn');
  const promoCheckbox = document.getElementById('promoHideTodayCheckbox');

  if (promoBackdrop) {
    const hideCookie = getPromoCookie('hidePromoPopup');
    const hideLocal = getPromoLocalStorage('hidePromoPopup');

    // Show popup only if user did not opt out today
    if (!hideCookie && !hideLocal) {
      setTimeout(() => {
        promoBackdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
      }, 1200);
    }

    const closePopup = () => {
      if (promoCheckbox && promoCheckbox.checked) {
        setPromoCookieAtMidnight('hidePromoPopup', 'true');
        setPromoLocalStorageAtMidnight('hidePromoPopup', 'true');
      }
      promoBackdrop.classList.remove('show');
      document.body.style.overflow = '';
    };

    if (closePromoBtn) {
      closePromoBtn.addEventListener('click', closePopup);
    }
    if (closePromoTextBtn) {
      closePromoTextBtn.addEventListener('click', closePopup);
    }

    // Close when clicking the outer backdrop
    promoBackdrop.addEventListener('click', (e) => {
      if (e.target === promoBackdrop) {
        closePopup();
      }
    });

    // CTA: close popup on click
    if (promoCtaBtn) {
      promoCtaBtn.addEventListener('click', () => {
        closePopup();
      });
    }
  }

  // Privacy Policy Modal Control
  const privacyPolicyModal = document.getElementById('privacyPolicyModalBackdrop');
  const openPrivacyPolicyBtn = document.getElementById('openPrivacyPolicyBtn');
  const closePrivacyPolicyBtn = document.getElementById('closePrivacyPolicyBtn');

  if (privacyPolicyModal && openPrivacyPolicyBtn && closePrivacyPolicyBtn) {
    openPrivacyPolicyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      privacyPolicyModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

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
    
    videoMuteBtn.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      if (heroVideo.muted) {
        muteIcon.style.display = 'block';
        unmuteIcon.style.display = 'none';
      } else {
        muteIcon.style.display = 'none';
        unmuteIcon.style.display = 'block';
      }
    });
  }
});


