import { Fragment, type ReactNode } from "react";
import Badge from "@/components/ui/Badge";

// Splits a "{token}" translation string into text/node segments so tokens
// can be rendered as rich elements (links, badges) instead of plain text —
// keeps interpolation locale-safe without losing styling.
export function renderTemplate(template: string, tokens: Record<string, ReactNode>): ReactNode {
  const parts = template.split(/(\{\w+\})/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\{(\w+)\}$/);
        if (match && match[1] in tokens) {
          return <Fragment key={i}>{tokens[match[1]]}</Fragment>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

// Renders a "{badge}" token inside a translation string as a styled Badge
// component instead of plain text, so "to be confirmed" placeholders keep
// their visual treatment across every locale.
export function withBadge(template: string, badgeText: string): ReactNode {
  return renderTemplate(template, { badge: <Badge variant="outline">{badgeText}</Badge> });
}
