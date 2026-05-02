// ── LOADER ──────────────────────────────────────
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const bar = document.getElementById("loader-bar");
  const counter = document.getElementById("loader-counter");
  const name = document.getElementById("loader-name");

  // Animate name in
  gsap.to(name, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.1,
  });

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          onComplete: () => {
            loader.style.display = "none";
            initAnimations();
          },
        });
      }, 300);
    }
    bar.style.width = progress + "%";
    counter.textContent = String(Math.floor(progress)).padStart(3, "0");
  }, 60);
});

// ── CUSTOM CURSOR ──────────────────────────────
const cursor = document.getElementById("cursor");
let mouseX = 0,
  mouseY = 0;

const isMobile = () => window.innerWidth <= 768;

document.addEventListener("mousemove", (e) => {
  if (isMobile()) return;
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

document
  .querySelectorAll(
    "a, button, .project-item, .gallery-item, .skill-tag, .filter-btn",
  )
  .forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });

document.addEventListener("mousedown", () => cursor.classList.add("click"));
document.addEventListener("mouseup", () => cursor.classList.remove("click"));

// ── INIT GSAP ANIMATIONS ──────────────────────
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero title lines
  gsap.from(".title-line", {
    yPercent: 110,
    stagger: 0.12,
    duration: 1,
    ease: "power4.out",
  });

  // Reveal elements on scroll
  document.querySelectorAll(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  // Stats counter animation
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count);
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.to(
          { val: 0 },
          {
            val: target,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: function () {
              el.textContent = Math.floor(this.targets()[0].val) + "+";
            },
          },
        );
      },
    });
  });

  // Gallery items stagger
  gsap.from(".gallery-item", {
    opacity: 0,
    y: 40,
    stagger: 0.08,
    duration: 0.7,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#galleryGrid",
      start: "top 80%",
    },
  });

  // Navbar background
  ScrollTrigger.create({
    start: 100,
    onUpdate: (self) => {
      const nav = document.getElementById("navbar");
      nav.style.boxShadow =
        self.progress > 0 ? "0 4px 40px rgba(0,0,0,0.06)" : "none";
    },
  });
}

// ── GALLERY FILTER ────────────────────────────
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    document.querySelectorAll(".gallery-item").forEach((item) => {
      const show = filter === "all" || item.dataset.cat === filter;
      gsap.to(item, {
        opacity: show ? 1 : 0.2,
        scale: show ? 1 : 0.97,
        duration: 0.3,
      });
    });
  });
});

// ── PROJECT HOVER IMAGE ───────────────────────
const hoverImg = document.getElementById("proj-hover-img");
const hoverSrc = document.getElementById("proj-hover-src");

document.querySelectorAll(".project-item[data-img]").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    hoverSrc.src = item.dataset.img;
    hoverImg.classList.add("visible");
  });
  item.addEventListener("mouseleave", () => {
    hoverImg.classList.remove("visible");
  });
  item.addEventListener("mousemove", (e) => {
    const x = e.clientX + 24;
    const y = e.clientY - 90;
    hoverImg.style.left = x + "px";
    hoverImg.style.top = y + "px";
  });
});

// ── GITHUB API ────────────────────────────────
async function fetchGitHub() {
  try {
    const res = await fetch("https://api.github.com/users/dharunkumarn");
    if (res.ok) {
      const data = await res.json();
      if (data.public_repos)
        document.getElementById("ghRepos").textContent = data.public_repos;
      if (data.followers)
        document.getElementById("ghFollowers").textContent = data.followers;
    }
  } catch (e) {
    document.getElementById("ghRepos").textContent = "30+";
    document.getElementById("ghStars").textContent = "120+";
    document.getElementById("ghFollowers").textContent = "80+";
  }
}
fetchGitHub();

// ── CONTRIBUTION GRID GENERATOR ───────────────
function generateContribGrid() {
  const grid = document.getElementById("contribGrid");
  const weeks = 30;
  const days = 7;
  const levels = ["", "l1", "l2", "l3", "l4"];
  let html = '<div class="contrib-title">Contribution Activity — 2025</div>';
  for (let d = 0; d < days; d++) {
    html += '<div class="contrib-row">';
    for (let w = 0; w < weeks; w++) {
      const rand = Math.random();
      let level = "";
      if (rand > 0.6) level = "l1";
      if (rand > 0.75) level = "l2";
      if (rand > 0.88) level = "l3";
      if (rand > 0.95) level = "l4";
      html += `<div class="contrib-cell ${level}"></div>`;
    }
    html += "</div>";
  }
  grid.innerHTML = html;
}
generateContribGrid();

// ── FORM ──────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector(".form-submit");
  btn.innerHTML = "<span>Sending...</span>";
  setTimeout(() => {
    btn.innerHTML = "<span>Sent ✓</span>";
    document.getElementById("form-success").style.display = "block";
    e.target.reset();
    setTimeout(() => {
      btn.innerHTML = "<span>Send Message →</span>";
    }, 3000);
  }, 1200);
}

// ── MOBILE MENU ───────────────────────────────
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.toggle("open");
});
function closeMobileMenu() {
  document.getElementById("mobileMenu").classList.remove("open");
}

// ── SMOOTH SCROLL for nav links ───────────────
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 72, behavior: "smooth" });
    }
  });
});

// ── i18n LANGUAGE TOGGLE ──────────────────────
const translations = {
  en: {
    nav_about: "About",
    nav_projects: "Projects",
    nav_gallery: "Gallery",
    nav_experience: "Experience",
    nav_contact: "Contact",
    nav_hire: "Hire Me",
    mobile_hire: "Hire Me →",
    hero_role1: "Full Stack Developer",
    hero_role2: "& UX-UI Designer",
    hero_desc:
      'Building digital experiences<br>that live at the intersection of<br><strong style="color:var(--charcoal)">code, craft &amp; creativity.</strong>',
    hero_available: "Available for freelance projects",
    hero_scroll: "Scroll",
    about_label: "About Me",
    about_title: "Crafting<br><em>beautiful</em><br>digital worlds",
    about_text:
      "I'm Co Van An — a full-stack developer from Viet Nam (Ba Dinh - Ha Noi) with a obsession for clean architecture and expressive interfaces. I build things people remember, not just use. Every pixel, every API call, every database query is a chance to do something extraordinary.",
    stat_years: "Years Building",
    stat_projects: "Projects Shipped",
    stat_clients: "Happy Clients",
    stat_tech: "Technologies",
    skill_front: "Frontend",
    skill_back: "Backend",
    skill_lang: "Languages",
    skill_infra: "Infrastructure",
    skill_tools: "Tools &amp; Design",
    proj_label: "Selected Work",
    proj_title:
      'Projects<br><span style="font-family:var(--font-serif);font-weight:300;font-style:italic;color:var(--accent);">&amp; Case Studies</span>',
    proj_count: "06 Projects",
    proj_desc1: "Full-stack e-commerce platform with AI recommendations",
    proj_desc2:
      "Full-stack QR-based restaurant ordering system with real-time order tracking and online payments.",
    proj_desc3:
      "3D interactive landing page for iPhone 15 Pro using Three.js and GSAP",
    proj_desc4:
      "Smart IoT system for managing devices in offices and buildings.",
    proj_desc5: "Social platform for developers with code sharing",
    proj_desc6: "Decentralized file storage with blockchain verification",
    proj_view: "View",
    gal_label: "Visual Gallery",
    gal_title:
      'Design<br><span style="font-family:var(--font-serif);font-weight:300;font-style:italic;color:var(--accent);">Works</span>',
    gal_desc:
      "A curated collection of UI explorations, design systems, and visual experiments that push the boundaries of what's possible in the browser.",
    filter_all: "All Work",
    filter_ui: "UI Design",
    filter_web: "Web Dev",
    filter_motion: "Motion",
    filter_brand: "Branding",
    exp_label: "Experience &amp; Recognition",
    exp_role1: "Senior Frontend Developer",
    exp_comp1: "Tech Startup — Remote",
    exp_desc1:
      "Leading frontend architecture for a SaaS platform serving 50K+ users. Built component systems, reduced bundle size by 40%.",
    exp_role2: "Full Stack Developer",
    exp_comp2: "Digital Agency, Chennai",
    exp_desc2:
      "Developed 12+ client projects across e-commerce, fintech, and media sectors. Delivered under aggressive deadlines with 100% client retention.",
    exp_role3: "Junior Web Developer",
    exp_comp3: "Freelance",
    exp_desc3: "Developed UI components using React and modern JavaScript.",
    exp_role4: "UI/UX Intern",
    exp_comp4: "Design Studio, Coimbatore",
    exp_desc4:
      "Designed wireframes and prototypes in Figma. Contributed to a design system used across 20+ products.",
    exp_big: "Building things<br>that <em>matter.</em>",
    aw_label: "Recognitions",
    gh_label: "Open Source",
    gh_title: "Code I've<br>put into <em>the world.</em>",
    gh_desc:
      "Every commit tells a story. Every repo is a conversation. I believe in building in public and contributing to the ecosystem that built me.",
    gh_btn: "View GitHub Profile",
    gh_repo: "Repositories",
    gh_star: "Stars Earned",
    gh_follow: "Followers",
    gh_contrib: "Contributions",
    gh_act: "Contribution Activity — 2024",
    ct_label: "Get In Touch",
    ct_big: "Let's<br><em>build</em><br>together.",
    ct_sub:
      "Whether you have a project in mind, want to collaborate, or just want to say hello — I'm always up for a good conversation.",
    ct_form_lbl: "Send A Message",
    ct_name: "Your Name",
    ct_email: "Email Address",
    ct_subj: "Subject",
    ct_msg: "Message",
    ct_btn: "<span>Send Message →</span>",
    ct_success: "✓ Message sent! I'll get back to you soon.",
    ft_left: "© 2025 Cồ Văn An. All rights reserved.",
    ft_right:
      'Built with <span style="color:var(--accent)">♥</span> from Space',
  },
  vi: {
    nav_about: "Giới thiệu",
    nav_projects: "Dự án",
    nav_gallery: "Thư viện",
    nav_experience: "Kinh nghiệm",
    nav_contact: "Liên hệ",
    nav_hire: "Thuê tôi",
    mobile_hire: "Thuê tôi →",

    hero_role1: "Lập trình viên",
    hero_role2: "& Thiết kế UX/UI",

    hero_desc:
      'Xây dựng những trải nghiệm số<br>nơi giao thoa giữa<br><strong style="color:var(--charcoal)">công nghệ, thẩm mỹ &amp; sáng tạo.</strong>',

    hero_available: "Sẵn sàng nhận dự án freelance",
    hero_scroll: "Cuộn xuống",

    about_label: "Về tôi",
    about_title: "Kiến tạo<br><em>trải nghiệm số</em><br>ấn tượng",

    about_text:
      "Tôi là Cồ Văn An — lập trình viên full-stack, đam mê kiến trúc hệ thống sạch và giao diện giàu cảm xúc. Với tôi, xây dựng sản phẩm để sử dụng - mà còn để tạo dấu ấn. Mỗi pixel, mỗi API, mỗi truy vấn cơ sở dữ liệu cũng đủ để làm nên điều khác biệt.",

    stat_years: "Năm kinh nghiệm",
    stat_projects: "Dự án hoàn thành",
    stat_clients: "Khách hàng hài lòng",
    stat_tech: "Công nghệ - kỹ thuật",

    skill_front: "Frontend",
    skill_back: "Backend",
    skill_lang: "Languages",
    skill_infra: "Hạ tầng",
    skill_tools: "Công cụ & Thiết kế",

    proj_label: "Dự án tiêu biểu",
    proj_title:
      'Dự án<br><span style="font-family:var(--font-serif);font-weight:300;font-style:italic;color:var(--accent);">&amp; Nghiên cứu</span>',
    proj_count: "06 dự án",

    proj_desc1: "Nền tảng thương mại điện tử full-stack tích hợp AI gợi ý",
    proj_desc2:
      "QR code gọi món ăn tại bàn, theo dõi đơn hàng thời gian thực và thanh toán online",
    proj_desc3:
      "Landing Page iPhone 15 Pro 3D tương tác sử dụng Three.js và GSAP",
    proj_desc4:
      "Hệ thống IoT thông minh dùng để quản lý thiết bị trong văn phòng và tòa nhà",
    proj_desc5: "Mạng xã hội dành cho lập trình viên chia sẻ mã nguồn",
    proj_desc6: "Hệ thống lưu trữ file phi tập trung với xác thực blockchain",

    proj_view: "Xem",

    gal_label: "Thư viện",
    gal_title:
      'Thiết kế<br><span style="font-family:var(--font-serif);font-weight:300;font-style:italic;color:var(--accent);">Works</span>',

    gal_desc:
      "Tổng hợp các thiết kế UI, hệ thống design và thử nghiệm hình ảnh nhằm mở rộng giới hạn trải nghiệm trên nền web.",

    filter_all: "Tất cả",
    filter_ui: "UI Design",
    filter_web: "Web Dev",
    filter_motion: "Motion",
    filter_brand: "Branding",

    exp_label: "Kinh nghiệm & Thành tựu",

    exp_role1: "Senior Frontend Developer",
    exp_comp1: "Startup công nghệ — Remote",
    exp_desc1:
      "Dẫn dắt kiến trúc frontend cho nền tảng SaaS phục vụ hơn 50.000 người dùng. Xây dựng hệ thống component và giảm 40% dung lượng bundle.",

    exp_role2: "Full Stack Developer",
    exp_comp2: "Digital Agency, Hà Nội",
    exp_desc2:
      "Phát triển hơn 12 dự án khách hàng trong các lĩnh vực e-commerce, fintech và media. Đảm bảo tiến độ gấp với tỷ lệ giữ chân khách hàng 100%.",

    exp_role3: "Junior Web Developer",
    exp_comp3: "Freelance",
    exp_desc3:
      "Xây dựng các components sử dụng React.js và JavaScript",

    exp_role4: "UI/UX Intern",
    exp_comp4: "Design Studio, Đà Nẵng",
    exp_desc4:
      "Thiết kế wireframe và prototype bằng Figma. Đóng góp vào hệ thống design được sử dụng trong hơn 20 sản phẩm.",

    exp_big: "Xây dựng những sản phẩm<br><em>có giá trị.</em>",

    aw_label: "Thành tựu",

    gh_label: "Mã nguồn mở",
    gh_title: "Những gì tôi<br>đã chia sẻ với <em>cộng đồng.</em>",

    gh_desc:
      "Mỗi dòng code đều kể một câu chuyện. Mỗi repository là một cuộc đối thoại. Tôi tin vào việc xây dựng công khai và đóng góp trở lại cho cộng đồng.",

    gh_btn: "Xem GitHub",
    gh_repo: "Repositories",
    gh_star: "Stars",
    gh_follow: "Followers",
    gh_contrib: "Đóng góp",
    gh_act: "Hoạt động đóng góp — 2024",

    ct_label: "Liên hệ",
    ct_big: "Cùng nhau<br><em>xây dựng</em><br>điều gì đó tuyệt vời.",

    ct_sub:
      "Nếu bạn có ý tưởng, muốn hợp tác, hoặc đơn giản chỉ muốn trò chuyện — mình luôn sẵn sàng.",

    ct_form_lbl: "Gửi tin nhắn",
    ct_name: "Tên của bạn",
    ct_email: "Email",
    ct_subj: "Chủ đề",
    ct_msg: "Nội dung",

    ct_btn: "<span>Gửi tin nhắn →</span>",
    ct_success: "✓ Đã gửi! Mình sẽ phản hồi sớm.",

    ft_left: "© 2025 Cồ Văn An. All rights reserved.",
    ft_right:
      'Built with <span style="color:var(--accent)">♥</span> from Earth',
  },
};

let currentLang = "en";

function setLanguage(lang) {
  currentLang = lang;

  // Update toggle UI
  const langEn = document.getElementById("lang-en");
  const langVi = document.getElementById("lang-vi");

  if (langEn && langVi) {
    langEn.classList.toggle("active", lang === "en");
    langVi.classList.toggle("active", lang === "vi");
    langEn.style.color = lang === "en" ? "var(--accent)" : "var(--muted)";
    langVi.style.color = lang === "vi" ? "var(--accent)" : "var(--muted)";
  }

  // Translate all elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
}

if (document.getElementById("lang-en")) {
  document
    .getElementById("lang-en")
    .addEventListener("click", () => setLanguage("en"));
}
if (document.getElementById("lang-vi")) {
  document
    .getElementById("lang-vi")
    .addEventListener("click", () => setLanguage("vi"));
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setLanguage("en");
});
