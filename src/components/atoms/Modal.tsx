import { DialogBase, type DialogBaseProps } from "./Dialog";

export type ModalProps = Omit<DialogBaseProps, "position">;

/** Centered modal dialog, specs/02-design-system.md §3.6 (DS-FR-15). */
export function Modal(props: ModalProps) {
  return <DialogBase position="center" {...props} />;
}
