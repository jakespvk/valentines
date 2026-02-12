import { Component, signal, afterNextRender, ElementRef, inject } from '@angular/core';

type Scene = 'sunset' | 'transitioning' | 'card' | 'celebration';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  private elementRef = inject(ElementRef);
  
  scene = signal<Scene>('sunset');
  
  // Placeholders - customize these!
  recipientName = 'My Love';
  senderName = 'Yours Forever';
  personalMessage = `Every moment with you feels like golden hour — 
warm, beautiful, and something I never want to end.`;
  dateDetails = 'February 14th';
  timeDetails = '7:00 PM';
  locationDetails = 'Our favorite spot';
  
  constructor() {
    afterNextRender(() => {
      this.createFloatingElements();
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
    
    this.scene.set('celebration');
    this.createCelebration();
  }
  
  private createFloatingElements(): void {
    const container = this.elementRef.nativeElement.querySelector('.floating-elements');
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
  
  private createCelebration(): void {
    const container = this.elementRef.nativeElement.querySelector('.celebration-container');
    if (!container) return;
    
    const celebrationElements = ['♥', '✦', '♥', '✧', '☀', '♥', '✦', '♥'];
    
    // Create burst of confetti
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const el = document.createElement('span');
        el.className = 'confetti-particle';
        el.innerHTML = celebrationElements[Math.floor(Math.random() * celebrationElements.length)];
        el.style.left = `${Math.random() * 100}%`;
        el.style.fontSize = `${16 + Math.random() * 20}px`;
        el.style.animationDuration = `${2.5 + Math.random() * 2}s`;
        el.style.setProperty('--drift', `${(Math.random() - 0.5) * 200}px`);
        container.appendChild(el);
        
        setTimeout(() => el.remove(), 4500);
      }, i * 40);
    }
  }
}
