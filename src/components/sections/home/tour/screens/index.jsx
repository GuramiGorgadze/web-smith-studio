import { BuildScreen } from "./BuildScreen";
import { DesignScreen } from "./DesignScreen";
import { DiscoveryScreen } from "./DiscoveryScreen";
import { GrowthScreen } from "./GrowthScreen";
import { LaunchScreen } from "./LaunchScreen";
import { StrategyScreen } from "./StrategyScreen";

const screens = {
  discovery: DiscoveryScreen,
  strategy: StrategyScreen,
  design: DesignScreen,
  build: BuildScreen,
  launch: LaunchScreen,
  growth: GrowthScreen,
};

/** Renders the illustrated browser screen for a tour step. Purely decorative (aria-hidden). */
export function TourScreen({ screen }) {
  const Screen = screens[screen] ?? DiscoveryScreen;

  return (
    <div aria-hidden="true">
      <Screen />
    </div>
  );
}
