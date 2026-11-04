const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;

function initScrollMain(options = {}) {
   const {
      mainSelector = "#main",
      footerSelector = "#contact",
      scaleFrom = 1,
      scaleTo = 0.95,
      radiusFrom = 0,
      radiusTo = 24,
   } = options;

   const main = document.querySelector(mainSelector);
   const footer = document.querySelector(footerSelector);
   if (!main || !footer) {
      console.warn(`initScrollMain : "${mainSelector}" ou "${footerSelector}" introuvable.`);
      return () => {};
   }

   const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

   main.style.transformOrigin = "center bottom";
   main.style.willChange = "transform";

   let ticking = false;

   const update = () => {
      ticking = false;

      if (reducedMotion.matches) {
         main.style.transform = "";
         main.style.borderBottomLeftRadius = "";
         main.style.borderBottomRightRadius = "";
         return;
      }

      const { top, height } = footer.getBoundingClientRect();
      const progress = height > 0 ? clamp((window.innerHeight - top) / height) : 0;

      const scale = lerp(scaleFrom, scaleTo, progress); // linéaire, comme useTransform
      const radius = `${lerp(radiusFrom, radiusTo, progress).toFixed(2)}px`;

      main.style.transform = `scale(${scale.toFixed(4)})`;
      main.style.borderBottomLeftRadius = radius;
      main.style.borderBottomRightRadius = radius;
   };

   const schedule = () => {
      if (!ticking) {
         ticking = true;
         requestAnimationFrame(update);
      }
   };

   window.addEventListener("scroll", schedule, { passive: true });
   window.addEventListener("resize", schedule, { passive: true });
   reducedMotion.addEventListener("change", schedule);

   const resizeObserver = new ResizeObserver(schedule);
   resizeObserver.observe(footer);

   update();

   return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
      resizeObserver.disconnect();
      main.style.transform = "";
      main.style.borderBottomLeftRadius = "";
      main.style.borderBottomRightRadius = "";
      main.style.willChange = "";
   };
}

function initDismissible(options = {}) {
   const {
      selector = ".group\\/tooltip",
      openWhen = ":hover, :focus-visible", // doit correspondre à la variante CSS (`tooltip-open`, `hovercard-open`)
   } = options;

   const triggers = document.querySelectorAll(selector);

   // Échap masque le contenu ouvert sans déplacer la souris ni le focus (WCAG 1.4.13).
   const dismiss = (event) => {
      if (event.key !== "Escape") return;
      triggers.forEach((trigger) => {
         if (trigger.matches(openWhen)) trigger.dataset.dismissed = "";
      });
   };

   // Le contenu redevient disponible quand ni la souris ni le focus ne sont plus dessus.
   const reset = (event) => {
      const trigger = event.currentTarget;
      if (!trigger.matches(openWhen)) delete trigger.dataset.dismissed;
   };

   document.addEventListener("keydown", dismiss);
   triggers.forEach((trigger) => {
      trigger.addEventListener("pointerleave", reset);
      trigger.addEventListener("focusout", reset);
   });

   return () => {
      document.removeEventListener("keydown", dismiss);
      triggers.forEach((trigger) => {
         trigger.removeEventListener("pointerleave", reset);
         trigger.removeEventListener("focusout", reset);
         delete trigger.dataset.dismissed;
      });
   };
}

// Safari ne donne pas le focus à un bouton cliqué : sans ça, `:focus-within` ne s'active pas au toucher.
function initFocusOnClick(selector) {
   const buttons = document.querySelectorAll(selector);
   const focus = (event) => event.currentTarget.focus();

   buttons.forEach((button) => button.addEventListener("click", focus));

   return () => {
      buttons.forEach((button) => button.removeEventListener("click", focus));
   };
}

const init = () => {
   initScrollMain();
   initDismissible({ selector: ".group\\/tooltip", openWhen: ":hover, :focus-visible" });
   initDismissible({ selector: ".group\\/hovercard", openWhen: ":hover, :focus-within" });
   initFocusOnClick(".group\\/hovercard > button");
};

if (document.readyState === "loading") {
   document.addEventListener("DOMContentLoaded", init);
} else {
   init();
}
