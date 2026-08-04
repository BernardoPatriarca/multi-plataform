import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'sistema_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  isDark = signal<boolean>(false);

  init(): void {
    const stored = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    const dark = stored ? stored === 'dark' : prefersDark;
    this.apply(dark);
  }

  toggle(): void {
    this.apply(!this.isDark());
  }

  private apply(dark: boolean): void {
    this.isDark.set(dark);
    document.body.classList.toggle('dark', dark);
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }
}
