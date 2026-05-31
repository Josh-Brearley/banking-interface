import { DialogBase, type DialogBaseProps } from "./Dialog";

export type DrawerProps = Omit<DialogBaseProps, "position" | "size">;

/** Right-side sheet sharing the Modal a11y contract, DS-FR-16. */
export function Drawer(props: DrawerProps) {
  return <DialogBase position="right" {...props} />;
}
