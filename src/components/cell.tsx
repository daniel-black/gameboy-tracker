import { cn } from "@/lib/utils";

export function Cell(props: {
  ref: React.Ref<HTMLTableCellElement>;
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <td
      className={cn(
        "px-2 border",
        props.isActive
          ? "bg-secondary-foreground/75 text-primary-foreground"
          : "bg-transparent"
      )}
      ref={props.ref}
      onClick={props.onClick}
    >
      <div className="flex justify-around items-center gap-2">
        {props.children}
      </div>
    </td>
  );
}
