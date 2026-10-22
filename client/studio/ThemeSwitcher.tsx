import { Check, SlidersHorizontal } from 'lucide-react';

export type StudioTheme = 'cold' | 'tech' | 'swiss';

export const THEME_STORAGE_KEY = 'userskins-atelier-theme';

export const themes: { id: StudioTheme; number: string; label: string; fullName: string; description: string; colors: string[] }[] = [
  { id: 'cold', number: '01', label: 'COLD', fullName: 'Cold White Studio', description: 'чистый свет и холодный белый', colors: ['#ffffff', '#e8edf2', '#171c23', '#ff0000'] },
  { id: 'tech', number: '02', label: 'TECH', fullName: 'White Tech Editorial', description: 'сталь, серебро, графит', colors: ['#eef3f8', '#cbd3de', '#101720', '#ff0000'] },
  { id: 'swiss', number: '03', label: 'SWISS', fullName: 'Minimal Swiss Chaos', description: 'радикальный белый, чёрный, красный', colors: ['#ffffff', '#dfe1e4', '#050505', '#ff0000'] },
];

export function readInitialTheme(): StudioTheme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return themes.find(theme => theme.id === stored)?.id ?? 'cold';
  } catch {
    return 'cold';
  }
}

export function ThemeSwitcher({
  value,
  onChange,
  compact = false,
}: {
  value: StudioTheme;
  onChange: (theme: StudioTheme) => void;
  compact?: boolean;
}) {
  const current = themes.find(theme => theme.id === value) ?? themes[0];
  return (
    <section className={'theme-console' + (compact ? ' theme-console--compact' : '')} aria-label="Оформление рабочего стола">
      {!compact && (
        <div className="theme-console-heading">
          <span className="theme-console-heading-icon" aria-hidden="true"><SlidersHorizontal size={13} strokeWidth={1.8} /></span>
          <span>DESK / LOOK & FEEL</span>
          <span className="theme-console-count">03 THEMES</span>
        </div>
      )}
      <div className="theme-console-options" role="group" aria-label="Выберите цветовую тему">
        {themes.map(theme => (
          <button
            type="button"
            key={theme.id}
            className={'theme-option' + (theme.id === value ? ' theme-option--active' : '')}
            onClick={() => onChange(theme.id)}
            aria-pressed={theme.id === value}
            aria-label={theme.fullName + (theme.id === value ? ', выбрана' : '')}
            title={theme.fullName}
            data-testid={'theme-' + theme.id}
          >
            <span className="theme-option-number">{theme.number}</span>
            <span className="theme-option-swatch" aria-hidden="true" style={{
              background: theme.colors[0],
              borderColor: theme.colors[2],
            }}>
              <span style={{ background: theme.colors[1] }} />
              <span style={{ background: theme.colors[3] }} />
            </span>
            <span className="theme-option-label">{theme.label}</span>
            <Check className="theme-option-check" size={12} strokeWidth={2.5} aria-hidden="true" />
          </button>
        ))}
      </div>
      {!compact && (
        <div className="theme-console-detail" aria-live="polite">
          <div><span className="theme-detail-pointer" aria-hidden="true">↳</span><b>{current.fullName}</b></div>
          <span>{current.description}</span>
        </div>
      )}
    </section>
  );
}
