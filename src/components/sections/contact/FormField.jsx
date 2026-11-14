import { Label } from "@/components/ui";
import { cn } from "@/lib/cn";
import styles from "./FormField.module.scss";

/**
 * One labelled form control with an optional hint and error message.
 *
 * `children` is a function that receives the accessibility props the control needs, so every field
 * wires its label, hint and error the same way:
 *
 *   <FormField id="name" label="Name" error={errors.name?.message}>
 *     {(a11y) => <Input {...a11y} />}
 *   </FormField>
 *
 * Use `group` for controls that are not a single input (a row of toggle buttons, say). The label then
 * names the group through `aria-labelledby` instead of pointing at one element with `for`.
 */
export function FormField({ id, label, required = false, hint, error, group = false, className, children }) {
  const labelId = `${id}-label`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const a11y = {
    ...(group ? { "aria-labelledby": labelId } : { id }),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  };

  return (
    <div className={cn(styles.field, className)}>
      <Label {...(group ? { id: labelId } : { htmlFor: id })} required={required}>
        {label}
      </Label>
      {children(a11y)}
      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
