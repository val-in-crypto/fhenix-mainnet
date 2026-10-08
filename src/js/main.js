import { initFigmaHome } from "./figma-home.js";
import { initStage } from "./stage.js";
import { buildTimeline } from "./timeline.js";
import { initDollar } from "./dollar-panel.js";
import { initSections } from "./sections.js";

initStage();
initFigmaHome();

document.fonts.ready.then(() => {
  const dollar = initDollar();
  buildTimeline({ dollar });
  initSections();
});
