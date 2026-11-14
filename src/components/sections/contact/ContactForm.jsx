import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Button,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import { Rich } from "@/i18n/Rich";
import { buildInquiry, EMPTY_CONTACT_VALUES, getInitialContactState } from "@/lib/contactForm";
import { createContactSchema } from "@/lib/contactSchema";
import { describeSubmitError, submitInquiry } from "@/lib/submitInquiry";
import { ContactSuccess } from "./ContactSuccess";
import { EstimateAttachment } from "./EstimateAttachment";
import { FormField } from "./FormField";
import styles from "./ContactForm.module.scss";

/**
 * The project inquiry form.
 *
 * It starts from whatever the page address says (`searchParams`): a service or pricing button can
 * preselect the project type and care plan, and the "Try it live" estimator can attach its numbers.
 * Mount it with a `key` so a new address starts a fresh form.
 */
export function ContactForm({ searchParams }) {
  const i18n = useI18n();
  const { ui, content } = i18n;
  const { form: text, errors: errorText, projectTypes, budgetOptions, timelineOptions } = content.contact;

  const [initial] = useState(() => getInitialContactState(searchParams, i18n));
  // "none" = no estimate in the address, otherwise the visitor can include or remove it.
  const [estimateState, setEstimateState] = useState(initial.estimate ? "included" : "none");
  const [sent, setSent] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const restartedRef = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createContactSchema(content.contact)),
    defaultValues: initial.values,
    mode: "onTouched",
  });

  // After "Send another message" the form comes back: put the cursor in the first field.
  useEffect(() => {
    if (!sent && restartedRef.current) {
      restartedRef.current = false;
      setFocus("name");
    }
  }, [sent, setFocus]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError("");

    // The hidden field was filled in, which only a bot does. Say thanks and send nothing.
    if (values.website) {
      setSent({ mode: "endpoint", name: values.name, email: values.email });
      return;
    }

    try {
      const estimate = estimateState === "included" ? initial.estimate : null;
      const outcome = await submitInquiry(buildInquiry(values, estimate, i18n), content.contact.mail);
      setSent({ ...outcome, name: values.name, email: values.email });
    } catch (error) {
      console.error("Contact form submission failed:", error);
      const explanation = describeSubmitError(error, i18n);
      setSubmitError(explanation.message);
      toast.error(explanation.toast, { description: errorText.kept });
    }
  });

  const startAgain = () => {
    reset(EMPTY_CONTACT_VALUES);
    setEstimateState("none");
    restartedRef.current = true;
    setSent(null);
  };

  if (sent) {
    return <ContactSuccess {...sent} onReset={startAgain} />;
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate aria-label={text.aria}>
      {estimateState === "none" ? null : (
        <EstimateAttachment
          estimate={initial.estimate}
          included={estimateState === "included"}
          onToggle={() => setEstimateState((state) => (state === "included" ? "removed" : "included"))}
        />
      )}

      <fieldset className={styles.group}>
        <legend className={styles.legend}>
          <span className={styles.step} aria-hidden="true">
            1
          </span>
          {text.aboutYou}
        </legend>

        <div className={styles.row}>
          <FormField id="contact-name" label={text.name.label} required error={errors.name?.message}>
            {(a11y) => (
              <Input {...a11y} {...register("name")} autoComplete="name" placeholder={text.name.placeholder} />
            )}
          </FormField>

          <FormField id="contact-email" label={text.email.label} required error={errors.email?.message}>
            {(a11y) => (
              <Input
                {...a11y}
                {...register("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder={text.email.placeholder}
              />
            )}
          </FormField>
        </div>

        <FormField
          id="contact-company"
          label={text.company.label}
          hint={text.company.hint}
          error={errors.company?.message}
        >
          {(a11y) => (
            <Input
              {...a11y}
              {...register("company")}
              autoComplete="organization"
              placeholder={text.company.placeholder}
            />
          )}
        </FormField>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>
          <span className={styles.step} aria-hidden="true">
            2
          </span>
          {text.yourProject}
        </legend>

        <FormField id="contact-type" label={text.projectType.label} required group error={errors.projectType?.message}>
          {(a11y) => (
            <Controller
              name="projectType"
              control={control}
              render={({ field }) => (
                <ToggleGroup
                  {...a11y}
                  type="single"
                  layout="pills"
                  value={field.value}
                  // Pressing the selected pill again would clear it; a project type is always needed.
                  onValueChange={(value) => value && field.onChange(value)}
                >
                  {projectTypes.map((option) => (
                    <ToggleGroupItem key={option.id} value={option.id}>
                      {option.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            />
          )}
        </FormField>

        <FormField id="contact-budget" label={text.budget.label} error={errors.budget?.message} hint={text.budget.hint}>
          {(a11y) => (
            <Controller
              name="budget"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger {...a11y} ref={field.ref} onBlur={field.onBlur}>
                    <SelectValue placeholder={text.budget.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          )}
        </FormField>

        <FormField id="contact-timeline" label={text.timeline.label} group error={errors.timeline?.message}>
          {(a11y) => (
            <Controller
              name="timeline"
              control={control}
              render={({ field }) => (
                <ToggleGroup
                  {...a11y}
                  type="single"
                  layout="pills"
                  value={field.value}
                  onValueChange={(value) => value && field.onChange(value)}
                >
                  {timelineOptions.map((option) => (
                    <ToggleGroupItem key={option.id} value={option.id}>
                      {option.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            />
          )}
        </FormField>

        <FormField
          id="contact-message"
          label={text.message.label}
          required
          hint={text.message.hint}
          error={errors.message?.message}
        >
          {(a11y) => (
            <Textarea {...a11y} {...register("message")} rows={6} placeholder={text.message.placeholder} />
          )}
        </FormField>

        <div className={styles.check}>
          <Controller
            name="care"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="contact-care"
                name={field.name}
                ref={field.ref}
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
              />
            )}
          />
          <Label htmlFor="contact-care" className={styles.checkLabel}>
            <span>{text.care.label}</span>
            <span className={styles.checkHint}>{text.care.hint}</span>
          </Label>
        </div>
      </fieldset>

      {/* Honeypot: invisible to people and skipped by keyboards, but bots fill in every field they find. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contact-website">{text.honeypot}</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className={styles.footer}>
        <div className={styles.consent}>
          <div className={styles.check}>
            <Controller
              name="consent"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="contact-consent"
                  name={field.name}
                  ref={field.ref}
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  onBlur={field.onBlur}
                  aria-required="true"
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={errors.consent ? "contact-consent-error" : undefined}
                />
              )}
            />
            <Label htmlFor="contact-consent" className={styles.checkLabel}>
              <span>
                <Rich
                  text={text.consent}
                  tags={{
                    privacy: (children) => (
                      <Link to="/privacy" target="_blank" rel="noreferrer" className={styles.link}>
                        {children}
                        <span className="srOnly">{ui.newTab}</span>
                      </Link>
                    ),
                  }}
                />
              </span>
            </Label>
          </div>
          {errors.consent ? (
            <p id="contact-consent-error" className={styles.error} role="alert">
              {errors.consent.message}
            </p>
          ) : null}
        </div>

        {submitError ? (
          <p className={styles.submitError} role="alert">
            {submitError}
          </p>
        ) : null}

        <div className={styles.submit}>
          <Button type="submit" size="lg" loading={isSubmitting} iconRight={<ArrowRight size={18} />}>
            {isSubmitting ? text.sending : text.send}
          </Button>
          <p className={styles.note}>{i18n.t(text.note)}</p>
        </div>
      </div>
    </form>
  );
}
