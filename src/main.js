import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

document.body.classList.add("is-loading");

const lenis = new Lenis({
  duration: 1.1,
  smoothWheel: true,
  wheelMultiplier: 0.86,
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const title = document.querySelector(".split-title");
const titleText = title.textContent.trim();
title.innerHTML = titleText
  .split(" ")
  .map((word) => `<span class="word"><span>${word}</span></span>`)
  .join(" ");
const titleWords = gsap.utils.toArray(".split-title .word span");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isSmallScreen = window.matchMedia("(max-width: 680px)").matches;

gsap.set(titleWords, { yPercent: 105, opacity: 0 });
gsap.set(".hero__ambient span, .hero__ambient i, .hero__visual, .hero__copy .eyebrow, .hero__copy > p, .event-bar span, .hero .button", {
  opacity: 0,
  y: 18,
});
gsap.set(".intro__step, .intro__arrow", { opacity: 0, y: 18 });
gsap.set(".depth", { opacity: 0, scale: 0.94 });
gsap.set(".portrait-editorial img", { opacity: 0, y: 28, scale: 0.98 });

const introTl = gsap.timeline({
  defaults: { ease: "power3.out" },
  onComplete: () => {
    document.body.classList.remove("is-loading");
    gsap.set(".intro", { display: "none" });
    title.textContent = titleText;
  },
});

if (reduceMotion) {
  introTl
    .set(".intro", { opacity: 0 })
    .set(".hero__ambient span, .hero__ambient i, .hero__visual, .hero__copy .eyebrow, .hero__copy > p, .event-bar span, .hero .button, .depth, .portrait-editorial img", {
      opacity: 1,
      y: 0,
      scale: 1,
    })
    .set(titleWords, { yPercent: 0, opacity: 1 });
} else {
  introTl
    .to(".intro__step", {
      opacity: 1,
      y: 0,
      stagger: 0.74,
      duration: 0.52,
    })
    .to(".intro__arrow", {
      opacity: 1,
      y: 0,
      stagger: 0.74,
      duration: 0.34,
    }, 0.46)
    .to(".intro", { opacity: 0, duration: 0.58 }, "+=0.7");
}

introTl
  .to(".hero__ambient span", { opacity: 1, y: 0, stagger: 0.08, duration: 0.62 })
  .to(".hero__ambient i", { opacity: 1, y: 0, stagger: 0.05, duration: 0.48 }, "-=0.36")
  .to(".depth", { opacity: 1, scale: 1, stagger: 0.08, duration: 0.7 }, "-=0.26")
  .to(".hero__visual", { opacity: 1, y: 0, duration: 0.1 }, "-=0.64")
  .to(".portrait-editorial img", { opacity: 1, y: 0, scale: 1, duration: 0.72 }, "-=0.56")
  .to(titleWords, {
    yPercent: 0,
    opacity: 1,
    stagger: 0.035,
    duration: 0.64,
  }, "-=0.24")
  .to(".hero__copy .eyebrow, .hero__copy > p", { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 }, "-=0.1")
  .to(".hero .button", { opacity: 1, y: 0, duration: 0.52 }, "-=0.08")
  .to(".event-bar span", { opacity: 1, y: 0, stagger: 0.1, duration: 0.48 }, "-=0.08");

if (!reduceMotion) {
  window.addEventListener("mousemove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;

    gsap.to(".hero__ambient span", { x: x * 18, y: y * 14, duration: 1.1, ease: "power2.out" });
    gsap.to(".depth--one", { x: x * -14, y: y * -10, duration: 1, ease: "power2.out" });
    gsap.to(".depth--two", { x: x * 10, y: y * 8, duration: 1, ease: "power2.out" });
    gsap.to(".portrait-editorial img", { x: x * 8, y: y * 5, duration: 1.2, ease: "power2.out" });
  });
}

gsap.utils.toArray(".reveal").forEach((item) => {
  if (item.closest(".hero")) return;
  if (item.closest(".self")) return;
  if (item.closest(".values")) return;
  if (item.closest(".expert")) return;
  gsap.to(item, {
    opacity: 1,
    y: 0,
    duration: 0.72,
    ease: "power3.out",
    scrollTrigger: {
      trigger: item,
      start: "top 82%",
      once: true,
    },
  });
});

gsap.set(".self .section__head", { opacity: 0, y: 28 });
gsap.set(".thought", { opacity: 0, y: 36, scale: 0.97 });
gsap.set(".insight", { opacity: 0, y: 30 });

const thoughtPaths = gsap.utils.toArray(".thought-lines path");
thoughtPaths.forEach((path) => {
  const length = path.getTotalLength();
  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
    opacity: 0,
  });
});

gsap.timeline({
  scrollTrigger: {
    trigger: ".self",
    start: "top 72%",
    once: true,
  },
})
  .to(".self .section__head", { opacity: 1, y: 0, duration: 0.6 })
  .to(".thought", {
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.13,
    duration: 0.64,
    ease: "power3.out",
  }, "-=0.18");

gsap.timeline({
  scrollTrigger: {
    trigger: ".thought-field",
    start: "top 68%",
    end: "bottom 46%",
    scrub: 0.8,
  },
})
  .to(thoughtPaths, {
    strokeDashoffset: 0,
    opacity: 1,
    stagger: 0.12,
    duration: 1,
    ease: "none",
  })
  .to(".insight", {
    opacity: 1,
    y: 0,
    duration: 0.34,
    ease: "power2.out",
  }, 0.78);

gsap.set(".values .section__head", { opacity: 0, y: 28 });
gsap.set(".shift-card--old", { opacity: 0, x: -28, y: 14 });
gsap.set(".shift-card--new", { opacity: 0, x: 28, y: 14 });
gsap.set(".shift-meaning", { opacity: 0, scale: 0.92 });
gsap.set(".center-note, .values .section-cta", { opacity: 0, y: 30 });

gsap.timeline({
  scrollTrigger: {
    trigger: ".values",
    start: "top 68%",
    once: true,
  },
})
  .to(".values .section__head", { opacity: 1, y: 0, duration: 0.62 })
  .to(".shift-card--old", {
    opacity: 1,
    x: 0,
    y: 0,
    stagger: 0.12,
    duration: 0.5,
    ease: "power3.out",
  }, "-=0.22")
  .to(".shift-card--old", {
    opacity: 0.46,
    scale: 0.96,
    textDecoration: "line-through",
    stagger: 0.05,
    duration: 0.42,
    ease: "power2.out",
  }, "+=0.1")
  .to(".shift-meaning", { opacity: 1, scale: 1, duration: 0.42, ease: "power2.out" }, "-=0.22")
  .to(".shift-card--new", {
    opacity: 1,
    x: 0,
    y: 0,
    stagger: 0.1,
    duration: 0.5,
    ease: "power3.out",
  }, "-=0.12")
  .to(".center-note", {
    opacity: 1,
    y: 0,
    duration: 0.42,
    ease: "power2.out",
  }, "-=0.08")
  .to(".values .section-cta", { opacity: 1, y: 0, duration: 0.36, ease: "power2.out" }, "-=0.12");

gsap.set(".expert .section__head", { opacity: 0, y: 28 });
gsap.set(".star-card", { opacity: 0, scale: 0.82, filter: "brightness(1)" });
gsap.set(".sky-particle", { opacity: 0, y: 10 });

const constellationPaths = gsap.utils.toArray(".constellation__lines path");
constellationPaths.forEach((path) => {
  const length = path.getTotalLength();
  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
    opacity: 0,
  });
});

const constellationTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".expert",
    start: "top 70%",
    once: true,
  },
});

constellationTl
  .to(".expert .section__head", { opacity: 1, y: 0, duration: 0.58 })
  .to(".sky-particle", { opacity: 1, y: 0, stagger: 0.08, duration: 0.42 }, "-=0.24")
  .to(".star-card--meissa", { opacity: 1, scale: 1, duration: 0.34, ease: "back.out(1.8)" }, "-=0.08")
  .to(".star-card--meissa", { filter: "brightness(1.55)", duration: 0.12, yoyo: true, repeat: 1 }, "-=0.04")
  .to(".star-card--betelgeuse", { opacity: 1, scale: 1, duration: 0.34, ease: "back.out(1.8)" }, "-=0.24")
  .to(".star-card--betelgeuse", { filter: "brightness(1.55)", duration: 0.12, yoyo: true, repeat: 1 }, "-=0.02")
  .to(constellationPaths[0], { strokeDashoffset: 0, opacity: 1, duration: 0.34, ease: "none" }, "-=0.02")
  .to(".star-card--bellatrix", { opacity: 1, scale: 1, duration: 0.34, ease: "back.out(1.8)" }, "-=0.18")
  .to(".star-card--bellatrix", { filter: "brightness(1.5)", duration: 0.12, yoyo: true, repeat: 1 }, "-=0.02")
  .to(constellationPaths[1], { strokeDashoffset: 0, opacity: 1, duration: 0.34, ease: "none" }, "-=0.02")
  .to(".star-card--alnitak", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.8)" }, "-=0.16")
  .to(".star-card--alnitak", { filter: "brightness(1.48)", duration: 0.1, yoyo: true, repeat: 1 }, "-=0.02")
  .to(constellationPaths[2], { strokeDashoffset: 0, opacity: 1, duration: 0.34, ease: "none" }, "-=0.02")
  .to(".star-card--mintaka", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.8)" }, "-=0.16")
  .to(".star-card--mintaka", { filter: "brightness(1.48)", duration: 0.1, yoyo: true, repeat: 1 }, "-=0.02")
  .to(constellationPaths[3], { strokeDashoffset: 0, opacity: 1, duration: 0.34, ease: "none" }, "-=0.02")
  .to(constellationPaths[4], { strokeDashoffset: 0, opacity: 1, duration: 0.34, ease: "none" }, "-=0.02")
  .to(".star-card--saiph", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.8)" }, "-=0.16")
  .to(".star-card--saiph", { filter: "brightness(1.45)", duration: 0.1, yoyo: true, repeat: 1 }, "-=0.02")
  .to(constellationPaths[5], { strokeDashoffset: 0, opacity: 1, duration: 0.34, ease: "none" }, "-=0.02")
  .to(".star-card--rigel", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.8)" }, "-=0.16")
  .to(".star-card--rigel", { filter: "brightness(1.45)", duration: 0.1, yoyo: true, repeat: 1 }, "-=0.02")
  .to(constellationPaths[6], { strokeDashoffset: 0, opacity: 1, duration: 0.34, ease: "none" }, "-=0.02")
  .to(constellationPaths[7], { strokeDashoffset: 0, opacity: 1, duration: 0.34, ease: "none" }, "-=0.08");

gsap.set(".roadmap .section__head", { opacity: 0, y: 30 });
gsap.set(".route-stop", { opacity: 0, y: 34, scale: 0.94 });
gsap.set(".roadmap .section-cta", { opacity: 0, y: 24 });

const routePaths = gsap.utils.toArray(".route-line path");
routePaths.forEach((path) => {
  const length = path.getTotalLength();
  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
    opacity: 0,
  });
});

gsap.timeline({
  scrollTrigger: {
    trigger: ".roadmap",
    start: "top 72%",
    once: true,
  },
})
  .to(".roadmap .section__head", { opacity: 1, y: 0, duration: 0.58 })
  .to(".route-stop--one", { opacity: 1, y: 0, scale: 1.04, duration: 0.36, ease: "back.out(1.7)" }, "-=0.06")
  .to(".route-stop--one", { scale: 1, duration: 0.24 })
  .to(routePaths[0], { strokeDashoffset: 0, opacity: 1, duration: 0.48, ease: "none" }, "-=0.02")
  .to(".route-stop--two", { opacity: 1, y: 0, scale: 1.04, duration: 0.36, ease: "back.out(1.7)" }, "-=0.1")
  .to(".route-stop--two", { scale: 1, duration: 0.24 })
  .to(routePaths[1], { strokeDashoffset: 0, opacity: 1, duration: 0.48, ease: "none" }, "-=0.02")
  .to(".route-stop--three", { opacity: 1, y: 0, scale: 1.04, duration: 0.36, ease: "back.out(1.7)" }, "-=0.1")
  .to(".route-stop--three", { scale: 1, duration: 0.24 })
  .to(routePaths[2], { strokeDashoffset: 0, opacity: 1, duration: 0.48, ease: "none" }, "-=0.02")
  .to(".route-stop--four", { opacity: 1, y: 0, scale: 1.04, duration: 0.36, ease: "back.out(1.7)" }, "-=0.1")
  .to(".route-stop--four", { scale: 1, duration: 0.24 })
  .to(".roadmap .section-cta", { opacity: 1, y: 0, duration: 0.36, ease: "power2.out" }, "-=0.08");

gsap.set(".register__scene h2, .register__scene > p, .gc-widget, .register__benefits span, .register__scene small", {
  opacity: 0,
  y: 26,
});

gsap.timeline({
  scrollTrigger: {
    trigger: ".register",
    start: "top 72%",
    once: true,
  },
})
  .to(".register__scene h2", { opacity: 1, y: 0, duration: 0.62 })
  .to(".register__scene > p", { opacity: 1, y: 0, duration: 0.48 }, "-=0.28")
  .to(".gc-widget", { opacity: 1, y: 0, duration: 0.62, ease: "power3.out" }, "-=0.12")
  .to(".register__benefits span", { opacity: 1, y: 0, stagger: 0.1, duration: 0.42 }, "-=0.18")
  .to(".register__scene small", { opacity: 1, y: 0, duration: 0.36 }, "-=0.12");

const initCareMessages = () => {
  const care = document.querySelector(".care");
  const layer = document.querySelector(".care__message-layer");
  const phone = document.querySelector(".care__phone");
  const content = document.querySelector(".care__content");

  if (!care || !layer || !phone || !content || reduceMotion) return;

  const messages = [
    "❓ «Есть запись эфира?»",
    "💬 «Спасибо, разобрался!»",
    "👋 «Добрый день!»",
    "📅 «Когда старт?»",
    "✅ «Оплатил.»",
    "🤝 «Хочу попасть на вебинар.»",
    "📞 «Можно созвониться?»",
  ];

  const active = new Set();
  let messageIndex = 0;
  let flow;

  const relativeRect = (element, rootRect, padding = 0) => {
    const rect = element.getBoundingClientRect();

    return {
      left: rect.left - rootRect.left - padding,
      right: rect.right - rootRect.left + padding,
      top: rect.top - rootRect.top - padding,
      bottom: rect.bottom - rootRect.top + padding,
    };
  };

  const overlaps = (point, boxes) => boxes.some((box) => (
    point.x > box.left &&
    point.x < box.right &&
    point.y > box.top &&
    point.y < box.bottom
  ));

  const getSpawnPoint = (rootRect, blockedBoxes) => {
    const width = rootRect.width;
    const height = rootRect.height;
    const margin = isSmallScreen ? 20 : 42;

    for (let attempt = 0; attempt < 28; attempt += 1) {
      const fromEdge = Math.random();
      let point;

      if (fromEdge < 0.28) {
        point = {
          x: gsap.utils.random(width * 0.34, width - margin),
          y: gsap.utils.random(margin, height * 0.23),
        };
      } else if (fromEdge < 0.5) {
        point = {
          x: gsap.utils.random(width * 0.5, width - margin),
          y: gsap.utils.random(height * 0.7, height - margin),
        };
      } else if (fromEdge < 0.75) {
        point = {
          x: gsap.utils.random(width * 0.47, width - margin),
          y: gsap.utils.random(height * 0.25, height * 0.68),
        };
      } else {
        point = {
          x: gsap.utils.random(margin, width * 0.96),
          y: gsap.utils.random(height * 0.58, height - margin),
        };
      }

      if (!overlaps(point, blockedBoxes)) return point;
    }

    return {
      x: gsap.utils.random(rootRect.width * 0.54, rootRect.width * 0.82),
      y: gsap.utils.random(rootRect.height * 0.12, rootRect.height * 0.78),
    };
  };

  const pulsePhone = () => {
    gsap.timeline()
      .to(phone, {
        scale: 1.03,
        rotation: gsap.utils.random(-1.4, 1.4),
        duration: 0.14,
        ease: "power2.out",
      })
      .to(phone, {
        scale: 1,
        rotation: 0,
        duration: 0.32,
        ease: "elastic.out(1, 0.72)",
      });

    gsap.fromTo(".care__phone-ring", {
      opacity: 0.58,
      scale: 0.92,
      boxShadow: "0 0 0 0 rgba(255, 238, 221, 0.32), 0 0 44px rgba(184, 184, 255, 0.18)",
    }, {
      opacity: 0,
      scale: 1.18,
      boxShadow: "0 0 0 18px rgba(255, 238, 221, 0), 0 0 64px rgba(184, 184, 255, 0)",
      duration: 0.56,
      ease: "power2.out",
    });

    gsap.fromTo(".care__phone-notice", {
      opacity: 0,
      y: -12,
      scale: 0.92,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.18,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      repeatDelay: 0.36,
    });
  };

  const spawnMessage = () => {
    if (active.size >= (isSmallScreen ? 3 : 6)) return;

    const rootRect = care.getBoundingClientRect();
    const phoneRect = relativeRect(phone, rootRect, isSmallScreen ? 26 : 52);
    const contentRect = relativeRect(content, rootRect, isSmallScreen ? 16 : 34);
    const blockedBoxes = [phoneRect, contentRect];
    const start = getSpawnPoint(rootRect, blockedBoxes);
    const target = {
      x: (phoneRect.left + phoneRect.right) / 2,
      y: (phoneRect.top + phoneRect.bottom) / 2,
    };
    const control = {
      x: (start.x + target.x) / 2 + gsap.utils.random(-180, 180),
      y: Math.min(start.y, target.y) - gsap.utils.random(56, 150),
    };
    const bubble = document.createElement("span");
    const progress = { value: 0 };
    const endRotation = gsap.utils.random(-7, 7);

    bubble.className = "care-message";
    bubble.textContent = messages[messageIndex % messages.length];
    messageIndex += 1;
    layer.appendChild(bubble);
    active.add(bubble);

    gsap.set(bubble, {
      x: start.x,
      y: start.y,
      opacity: 0,
      scale: gsap.utils.random(0.92, 1.02),
      rotation: gsap.utils.random(-2.2, 2.2),
    });

    const floatY = gsap.utils.random(-9, 9);
    const floatX = gsap.utils.random(-8, 8);

    gsap.timeline({
      onComplete: () => {
        active.delete(bubble);
        bubble.remove();
        pulsePhone();
      },
    })
      .to(bubble, {
        opacity: 1,
        y: start.y + floatY,
        x: start.x + floatX,
        duration: 0.28,
        ease: "power2.out",
      })
      .to(bubble, {
        x: start.x - floatX * 0.6,
        y: start.y - floatY * 0.7,
        rotation: `+=${gsap.utils.random(-1.5, 1.5)}`,
        duration: gsap.utils.random(1.75, 2.55),
        ease: "sine.inOut",
      })
      .to(progress, {
        value: 1,
        duration: gsap.utils.random(1.75, 2.25),
        ease: "power1.inOut",
        onUpdate: () => {
          const t = progress.value;
          const easedScale = 1 - t * 0.46;
          const x = ((1 - t) ** 2 * start.x) + (2 * (1 - t) * t * control.x) + (t ** 2 * target.x);
          const y = ((1 - t) ** 2 * start.y) + (2 * (1 - t) * t * control.y) + (t ** 2 * target.y);

          gsap.set(bubble, {
            x,
            y,
            scale: easedScale,
            opacity: 1 - t * 0.9,
            rotation: t * endRotation,
          });
        },
      });
  };

  const startFlow = () => {
    if (flow) return;

    const tick = () => {
      spawnMessage();
      flow = gsap.delayedCall(gsap.utils.random(1.05, 1.55), tick);
    };

    tick();
  };

  const stopFlow = () => {
    if (!flow) return;
    flow.kill();
    flow = null;
  };

  ScrollTrigger.create({
    trigger: care,
    start: "top 86%",
    end: "bottom 12%",
    onEnter: startFlow,
    onEnterBack: startFlow,
    onLeave: stopFlow,
    onLeaveBack: stopFlow,
  });
};

initCareMessages();
