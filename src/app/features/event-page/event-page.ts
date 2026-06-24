import {Component, computed, signal} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

export interface AppEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  description: string;
  image: string;
  price: number; // 0 pour gratuit
  capacity: number;
  registeredCount: number;
  category: 'conference' | 'concert' | 'culte' | 'jeunesse';
  categoryLabel: string;
}

@Component({
  selector: 'app-event-page',
  imports: [
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './event-page.html',
  styleUrl: './event-page.css',
})
export class EventPage {
  categories = [
    { id: 'all', label: 'Tous les événements' },
    { id: 'conference', label: 'Conférences' },
    { id: 'concert', label: 'Concerts / Louange' },
    { id: 'culte', label: 'Cultes Spéciaux' },
    { id: 'jeunesse', label: 'Jeunesse' }
  ];

  activeCategory = signal<string>('all');

  events = signal<AppEvent[]>([
    {
      id: 'conf-foi-2026',
      title: 'Conférence Nationale : Marcher dans la Foi',
      date: new Date('2026-10-15T09:00:00'),
      location: 'Palais des Congrès, Paris',
      description: 'Trois jours intensifs d\'enseignements approfondis, d\'ateliers pratiques et de moments de communion fraternelle.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
      price: 45.0,
      capacity: 500,
      registeredCount: 412,
      category: 'conference',
      categoryLabel: 'Conférence'
    },
    {
      id: 'concert-louange',
      title: 'Nuit de la Louange & Adoration',
      date: new Date('2026-11-05T19:30:00'),
      location: 'Auditorium Grâce, Lyon',
      description: 'Une soirée unique pour s\'élever ensemble dans l\'adoration avec la chorale Grâce & Lumière et des invités spéciaux.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop',
      price: 0,
      capacity: 300,
      registeredCount: 298, // Presque complet
      category: 'concert',
      categoryLabel: 'Concert'
    },
    {
      id: 'jeunesse-impact',
      title: 'Rassemblement Impact Jeunesse 2026',
      date: new Date('2026-12-12T14:00:00'),
      location: 'Complexe Sportif, Bordeaux',
      description: 'Le rendez-vous annuel de la jeunesse. Messages inspirants, concerts pop-louange et partages.',
      image: '../assets/images/Gemini_Generated_Image.png',
      price: 15.0,
      capacity: 800,
      registeredCount: 350,
      category: 'jeunesse',
      categoryLabel: 'Jeunesse'
    }
  ]);

  // Variables pour la modale d'inscription
  selectedEvent = signal<AppEvent | null>(null);
  isSubmitting = signal<boolean>(false);
  successMessage = signal<boolean>(false);

  // Champs du formulaire d'inscription
  registerName = signal<string>('');
  registerEmail = signal<string>('');
  ticketCount = signal<number>(1);

  // Filtrage des événements
  filteredEvents = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return this.events();
    return this.events().filter(e => e.category === cat);
  });

  setCategory(catId: string): void {
    this.activeCategory.set(catId);
  }

  openRegisterModal(event: AppEvent): void {
    if (this.isFull(event)) return;
    this.selectedEvent.set(event);
    this.successMessage.set(false);
    this.ticketCount.set(1);
  }

  closeModal(): void {
    if (this.isSubmitting()) return;
    this.selectedEvent.set(null);
    this.registerName.set('');
    this.registerEmail.set('');
  }

  isFull(event: AppEvent): boolean {
    return event.registeredCount >= event.capacity;
  }

  submitRegistration(): void {
    if (!this.registerName() || !this.registerEmail()) return;

    this.isSubmitting.set(true);

    // Simulation de l'inscription via API
    setTimeout(() => {
      const currentEvent = this.selectedEvent();
      if (currentEvent) {
        // Mettre à jour le nombre de places localement
        this.events.update(list =>
          list.map(e => e.id === currentEvent.id
            ? { ...e, registeredCount: e.registeredCount + this.ticketCount() }
            : e
          )
        );
      }

      this.isSubmitting.set(false);
      this.successMessage.set(true);

      // Fermeture automatique après 2 secondes
      setTimeout(() => this.closeModal(), 2000);
    }, 1500);
  }
}
