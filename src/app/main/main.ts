import {
  Component,
  signal,
  afterNextRender,
  ElementRef,
  inject,
  DestroyRef,
  computed,
} from '@angular/core';

type Scene =
  | 'sunset'
  | 'transitioning'
  | 'card'
  | 'celebrating-burst'
  | 'countdown';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  private elementRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  scene = signal<Scene>('sunset');

  // Placeholders - customize these!
  recipientName = 'My Love';
  senderName = 'Will you be my valentine?';
  personalMessage =
    "These past 2 1/2 years with you have been unforgettable. Ups and downs, sure,\
    but we always bring it back. I know that we've both grown a lot as people, and\
    I'm really proud of us. Looking back, I definitely did not see us ending up here,\
    but I'm so grateful that we did. The cuddles, the laughs, shit-talking out the\
    ass... I love you, baby.";
  dateDetails = 'Will you be my valentine?';
  timeDetails = '';
  locationDetails = '';

  // Countdown target - midnight on Valentine's Day
  valentineDate = new Date('2026-02-14T00:00:00');

  // Countdown state
  countdownDays = signal(0);
  countdownHours = signal(0);
  countdownMinutes = signal(0);
  countdownSeconds = signal(0);

  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    afterNextRender(() => {
      this.createFloatingElements();
    });

    this.destroyRef.onDestroy(() => {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
    });
  }

  onSunClick(): void {
    if (this.scene() !== 'sunset') return;

    this.scene.set('transitioning');

    // After sunburst animation completes, show the card
    setTimeout(() => {
      this.scene.set('card');
    }, 1200);
  }

  onYesClick(): void {
    if (this.scene() !== 'card') return;

    this.scene.set('celebrating-burst');
    this.createSoftConfetti();

    // After burst envelopes the screen, transition to countdown
    setTimeout(() => {
      this.scene.set('countdown');
      this.startCountdown();
    }, 1500);
  }

  private startCountdown(): void {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const target = this.valentineDate.getTime();
    const diff = Math.max(0, target - now);

    this.countdownDays.set(Math.floor(diff / (1000 * 60 * 60 * 24)));
    this.countdownHours.set(
      Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    );
    this.countdownMinutes.set(
      Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    );
    this.countdownSeconds.set(Math.floor((diff % (1000 * 60)) / 1000));
  }

  private createFloatingElements(): void {
    const container =
      this.elementRef.nativeElement.querySelector('.floating-elements');
    if (!container) return;

    // Create floating hearts and sparkles
    const elements = ['♥', '✦', '♥', '✧', '♥', '✦'];

    for (let i = 0; i < 12; i++) {
      const el = document.createElement('span');
      el.className = 'floating-particle';
      el.innerHTML = elements[i % elements.length];
      el.style.left = `${Math.random() * 100}%`;
      el.style.animationDelay = `${Math.random() * 20}s`;
      el.style.animationDuration = `${20 + Math.random() * 15}s`;
      el.style.fontSize = `${12 + Math.random() * 14}px`;
      el.style.opacity = `${0.3 + Math.random() * 0.4}`;
      container.appendChild(el);
    }
  }

  private createSoftConfetti(): void {
    const container = this.elementRef.nativeElement.querySelector(
      '.confetti-container',
    );
    if (!container) return;

    const num_hearts = 550;
    for (let i = 0; i < num_hearts; i++) {
      setTimeout(() => {
        const el = document.createElement('span');
        el.className = 'confetti-particle';
        el.innerHTML = '♥';
        el.style.left = `${Math.random() * 100}%`;
        el.style.fontSize = `${14 + Math.random() * 18}px`;
        el.style.animationDuration = `${3.5 + Math.random() * 3}s`;
        el.style.opacity = `${0.4 + Math.random() * 0.35}`;
        el.style.color = '#c0283a';
        el.style.setProperty('--drift', `${(Math.random() - 0.5) * 300}px`);
        container.appendChild(el);

        setTimeout(() => el.remove(), 6500);
      }, i * 3);
    }
  }
}
