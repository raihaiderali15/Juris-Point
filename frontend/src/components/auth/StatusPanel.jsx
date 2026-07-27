import { Button } from '../ui/Button';

/**
 * StatusPanel — the centered icon+title+description block used for
 * "Check Your Inbox", "Password Updated", "Verify Your Email" screens.
 *
 * variant: "neutral" (gold icon, default) | "success" (green icon, for
 * completed states like Password Updated).
 * actionLabel/onAction-less: pass `action` as a ready-made element
 * (e.g. a <Button>) so this component stays free of click logic itself.
 */
export function StatusPanel({ icon, title, description, variant = 'neutral', action }) {
  const iconStyles = variant === 'success'
    ? 'text-success border-[rgba(111,168,140,0.4)]'
    : 'text-gold border-border';

  return (
    <div className="text-center py-8">
      <div className={`w-16 h-16 mx-auto mb-7 border rounded-full flex items-center justify-center text-2xl ${iconStyles}`}>
        {icon}
      </div>
      <div className="font-serif text-2xl font-bold mb-3.5">{title}</div>
      <p className="text-sm text-text-muted leading-loose max-w-[360px] mx-auto mb-8">
        {description}
      </p>
      {action}
    </div>
  );
}