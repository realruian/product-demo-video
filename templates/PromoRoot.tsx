import "./index.css";
import { Composition } from "remotion";
import { PromoVideo, TOTAL, PROMO_CANVAS } from "./PromoVideo";

// 注册 composition。durationInFrames = TOTAL（由 PromoVideo 按场景帧数算出）。
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PromoVideo"
      component={PromoVideo}
      durationInFrames={TOTAL}
      fps={30}
      width={PROMO_CANVAS.w}
      height={PROMO_CANVAS.h}
    />
  );
};
