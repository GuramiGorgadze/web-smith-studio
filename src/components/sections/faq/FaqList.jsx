import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui";
import { useContent } from "@/i18n/I18nContext";

/**
 * Radix accordion over the studio FAQ (or over `items`, if given).
 * The first question starts open so the answer area is never empty.
 */
export function FaqList({ items, defaultValue }) {
  const { faqs } = useContent();
  const list = items ?? faqs.items;

  return (
    <Accordion type="single" collapsible defaultValue={defaultValue ?? list[0]?.id}>
      {list.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
