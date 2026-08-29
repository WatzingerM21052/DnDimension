import wayfinderSource from "../icons/wayfinder.svg";
import { Icon, type IconProps } from "./Icon";

export type WayfinderIconProps = Omit<IconProps, "source">;

export const WayfinderIcon = (props: WayfinderIconProps) => (
  <Icon {...props} source={wayfinderSource} />
);
