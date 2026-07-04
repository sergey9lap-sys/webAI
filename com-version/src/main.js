import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const protectShortWords = () => {
  const roots = document.querySelectorAll(
    ".hero__copy, .competence-table, .lecture-timeline, .audience, .register__copy, .author__text, .testimonials, .footer, .thanks-card",
  );
  const shortWords = "(а|и|в|во|на|с|со|к|ко|о|об|от|до|за|по|из|у|для|не|но|что|как)";
  const shortWordPattern = new RegExp(`(^|[\\s([{«"„])(${shortWords})\\s+`, "giu");

  roots.forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || parent.closest("script, style, noscript, .gc-widget")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((node) => {
      node.nodeValue = node.nodeValue.replace(shortWordPattern, "$1$2\u00a0");
    });
  });
};

protectShortWords();

if (!reduceMotion) {
  const lenis = new Lenis({
    duration: 1,
    smoothWheel: true,
    wheelMultiplier: 0.9,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  gsap.utils.toArray(".reveal").forEach((item) => {
    if (item.closest(".lecture-timeline")) return;

    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.72,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 84%",
        once: true,
      },
    });
  });

  const timelineItems = gsap.utils.toArray(".lecture-timeline .check-card");
  if (timelineItems.length) {
    gsap.set(timelineItems, { opacity: 0, y: 26, "--line-scale": 0 });
    gsap.set(".lecture-timeline .timeline-number", { scale: 0.82, opacity: 0 });
    gsap.set(".lecture-timeline .check-card p", { opacity: 0, y: 18 });

    const lectureTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".lecture-timeline",
        start: "top 78%",
        once: true,
      },
    });

    timelineItems.forEach((item) => {
      lectureTl
        .to(item, { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" })
        .to(item.querySelector(".timeline-number"), { opacity: 1, scale: 1, duration: 0.26, ease: "back.out(1.8)" }, "-=0.18")
        .to(item.querySelector("p"), { opacity: 1, y: 0, duration: 0.34, ease: "power2.out" }, "-=0.12")
        .to(item, { "--line-scale": 1, duration: 0.38, ease: "power1.inOut" }, "-=0.04");
    });
  }

  const siteLinePath = document.querySelector("[data-site-line-path]");
  if (siteLinePath) {
    const length = siteLinePath.getTotalLength();
    gsap.set(siteLinePath, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    gsap.to(siteLinePath, {
      strokeDashoffset: length * 0.18,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      },
    });
  }
} else {
  gsap.set(".reveal", { opacity: 1, y: 0 });
}

const initCountdown = () => {
  const countdown = document.querySelector("[data-countdown]");
  if (!countdown) return;

  const target = new Date(countdown.dataset.countdown).getTime();
  const daysNode = countdown.querySelector("[data-days]");
  const hoursNode = countdown.querySelector("[data-hours]");
  const minutesNode = countdown.querySelector("[data-minutes]");
  const secondsNode = countdown.querySelector("[data-seconds]");
  const pad = (value) => String(value).padStart(2, "0");

  const setValue = (node, value) => {
    if (!node || node.textContent === value) return;
    node.classList.add("is-changing");
    node.textContent = value;
    window.setTimeout(() => node.classList.remove("is-changing"), 220);
  };

  const render = () => {
    const distance = Math.max(0, target - Date.now());
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    setValue(daysNode, pad(days));
    setValue(hoursNode, pad(hours));
    setValue(minutesNode, pad(minutes));
    setValue(secondsNode, pad(seconds));
  };

  render();
  window.setInterval(render, 1000);
};

initCountdown();

const initTestimonialSlider = () => {
  const slider = document.querySelector("[data-testimonial-slider]");
  if (!slider) return;

  const track = slider.querySelector(".testimonial-slider__track");
  const slides = Array.from(slider.querySelectorAll(".testimonial-slide"));
  const prevButton = slider.querySelector("[data-testimonial-prev]");
  const nextButton = slider.querySelector("[data-testimonial-next]");
  const dotsNode = slider.querySelector("[data-testimonial-dots]");
  if (!track || !slides.length || !dotsNode) return;

  let current = 0;
  let pointerStart = null;
  const desktopQuery = window.matchMedia("(min-width: 821px)");
  const getSlidesPerView = () => 1;
  const getPageCount = () => Math.ceil(slides.length / getSlidesPerView());

  let dots = [];

  const buildDots = () => {
    dotsNode.innerHTML = "";
    dots = Array.from({ length: getPageCount() }, (_, index) => {
      const dot = document.createElement("button");
      dot.className = "testimonial-slider__dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Показать отзыв ${index + 1}`);
      dot.addEventListener("click", () => goTo(index));
      dotsNode.append(dot);
      return dot;
    });
  };

  const render = () => {
    const pageCount = getPageCount();
    current = Math.min(current, pageCount - 1);
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === current);
      dot.setAttribute("aria-current", index === current ? "true" : "false");
    });
  };

  const goTo = (index) => {
    const pageCount = getPageCount();
    current = (index + pageCount) % pageCount;
    render();
  };

  prevButton?.addEventListener("click", () => goTo(current - 1));
  nextButton?.addEventListener("click", () => goTo(current + 1));

  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goTo(current - 1);
    if (event.key === "ArrowRight") goTo(current + 1);
  });

  slider.addEventListener("pointerdown", (event) => {
    pointerStart = event.clientX;
  });

  slider.addEventListener("pointerup", (event) => {
    if (pointerStart === null) return;
    const delta = event.clientX - pointerStart;
    pointerStart = null;
    if (Math.abs(delta) < 42) return;
    goTo(delta > 0 ? current - 1 : current + 1);
  });

  desktopQuery.addEventListener("change", () => {
    buildDots();
    render();
  });

  slider.tabIndex = 0;
  buildDots();
  render();
};

initTestimonialSlider();

const initCookieConsent = () => {
  const consent = document.querySelector("[data-cookie-consent]");
  if (!consent) return;

  const storageKey = "agk-cookie-consent";
  if (localStorage.getItem(storageKey) === "accepted") return;

  consent.hidden = false;

  consent.querySelectorAll("[data-cookie-accept]").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.setItem(storageKey, "accepted");
      consent.hidden = true;
    });
  });
};

initCookieConsent();
