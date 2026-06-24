import {Component, computed, effect, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';


export interface ResourceCategory {
  id: string;
  label: string;
}

export type ResourceFileType = 'PDF' | 'MP4' | 'MP3' | 'JPGs' | 'ZIP (Interactive Guide)' | 'ICS' | 'EPUB';

export interface ResourceItem {
  id: string;
  title: string;
  date: Date;
  downloadCount: number;
  category: string; // Doit correspondre à un id de ResourceCategory
  fileType: ResourceFileType; // Tag en haut à droite
  fileUrl: string; // Lien réel vers le fichier
  imageUrl?: string; // Optionnel : Image de couverture (ex: pour vidéo)
}
@Component({
  selector: 'app-resource-page',
  imports: [
    FormsModule
  ],
  templateUrl: './resource-page.html',
  styleUrl: './resource-page.css',
})
export class ResourcePage {
// -- Gestion de l'état (Signals) --

  // Les catégories d'origine
  categories = signal<ResourceCategory[]>([]);
  // La catégorie active (signal synchrone)
  activeCategory = signal<string>('intercessory');
  // Le tri actif
  currentSort = signal<string>('newest');
  // Les données des ressources
  allResources = signal<ResourceItem[]>([]);

  // -- État de l'interface (Interface State) --
  isSubmitting = signal<boolean>(false);

  constructor() { }

  ngOnInit(): void {
    // 1. Initialiser les catégories
    this.categories.set(this.getMockCategories());

    // 2. Initialiser les données des ressources
    this.allResources.set(this.getMockResources());
  }

  // -- Calculs réactifs (Computed Signals) --

  // Filtrage : retourne les ressources qui correspondent à la catégorie active
  filteredResources = computed(() => {
    const activeCatId = this.activeCategory();
    const all = this.allResources();

    if (activeCatId === 'all') return all;
    return all.filter(r => r.category === activeCatId);
  });

  // Tri : retourne les ressources filtrées, triées selon le choix
  sortedAndFilteredResources = computed(() => {
    const list = [...this.filteredResources()]; // Clone la liste pour le tri
    const sort = this.currentSort();

    if (sort === 'newest') {
      return list.sort((a, b) => b.date.getTime() - a.date.getTime());
    } else if (sort === 'oldest') {
      return list.sort((a, b) => a.date.getTime() - b.date.getTime());
    }
    // Ajoutez d'autres tris ici (ex: par nom, par téléchargement)
    return list;
  });

  // Compte total pour l'affichage (ex: "Resources (12)")
  totalVisibleResources = computed(() => this.sortedAndFilteredResources().length);


  // -- Méthodes de l'interface --

  // Change la catégorie active
  setCategory(catId: string): void {
    this.activeCategory.set(catId);
  }

  // Simule le téléchargement (et met à jour le compteur localement)
  downloadResource(resourceId: string): void {
    // 1. Incrémenter le compteur localement
    this.allResources.update(list =>
      list.map(r => r.id === resourceId ? { ...r, downloadCount: r.downloadCount + 1 } : r)
    );

    // 2. Ouvrir le lien
    const resource = this.allResources().find(r => r.id === resourceId);
    if (resource) {
      console.log(`Downloading: ${resource.title}`);
      // window.open(resource.fileUrl, '_blank'); // Décommenter pour ouvrir réellement
    }
  }

  // Utilitaire pour le formatage de date spécifique "Mar 06"
  formatShortDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    return `${month} ${day}`;
  }

  // -- Données Mockées internes --

  private getMockCategories(): ResourceCategory[] {
    return [
      { id: 'all', label: 'Toutes les ressources' },
      { id: 'prophetic', label: 'Theme prophetique du mois' },
      { id: 'next_sunday', label: 'Dimanche prochain' },
      { id: 'operations', label: 'Opérations' },
      { id: 'intercessory', label: 'Prière d\'intercession' },
      { id: 'shiloh', label: 'Shiloh' },
      { id: 'testimonies', label: 'Témoignages' },
      { id: 'others', label: 'Others' }
    ];
  }

  private getMockResources(): ResourceItem[] {
    return [
      // --- Row 1 (Basé sur l'image) ---
      {
        id: 'prayer-culture',
        title: 'A CALL TO BUILDING A PRAYER CULTURE',
        date: new Date('2026-03-06'),
        downloadCount: 5799,
        category: 'intercessory',
        fileType: 'PDF',
        fileUrl: '/assets/documents/prayer_culture.pdf'
      },
      {
        id: 'publishing-arm',
        title: 'INTERCESSORY PRAYERS FOR THE PUBLISHING ARM OF THE MINISTRY',
        date: new Date('2026-02-02'),
        downloadCount: 4056,
        category: 'intercessory',
        fileType: 'PDF',
        fileUrl: '/assets/documents/publishing_prayers.pdf'
      },
      {
        id: 'wsf-fellowship',
        title: 'PRAYERS FOR WINNERS SATELLITE FELLOWSHIP (WSF) 2',
        date: new Date('2026-03-02'),
        downloadCount: 5432,
        category: 'intercessory',
        fileType: 'PDF',
        fileUrl: '/assets/documents/wsf_prayers.pdf'
      },
      {
        id: 'sermon-oyedepo',
        title: 'BISHOP DAVID OYEDEPO: SERMON TRANSCRIPT',
        date: new Date('2026-03-12'),
        downloadCount: 6850,
        category: 'intercessory',
        fileType: 'PDF',
        fileUrl: '/assets/documents/oyedepo_transcript.pdf'
      },

      // --- Row 2 (Basé sur l'image) ---
      {
        id: 'video-breakthrough',
        title: 'VIDEO TEACHING - BREAKTHROUGH FAITH',
        date: new Date('2026-03-15'),
        downloadCount: 7120,
        category: 'prophetic',
        fileType: 'MP4',
        fileUrl: 'https://link.to.vimeo.com/video/123',
        imageUrl: '/assets/images/video_cover.jpg'
      },
      {
        id: 'wsf-notes',
        title: 'WSF FOUNDATION CLASS NOTES (Session 2)',
        date: new Date('2026-04-01'),
        downloadCount: 4050,
        category: 'operations',
        fileType: 'PDF',
        fileUrl: '/assets/documents/foundation_session2.pdf'
      },
      {
        id: 'shiloh-photos',
        title: 'SHILOH 2025: PHOTO HIGHLIGHTS COLLECTION',
        date: new Date('2026-01-22'),
        downloadCount: 3900,
        category: 'shiloh',
        fileType: 'JPGs',
        fileUrl: '/assets/documents/shiloh_photos.zip'
      },
      {
        id: 'album-praise',
        title: 'PRAISE & ADORATION VOL. 4 (Full Album Audio)',
        date: new Date('2026-02-20'),
        downloadCount: 5432,
        category: 'prophetic',
        fileType: 'MP3',
        fileUrl: '/assets/documents/album4.zip'
      },

      // --- Row 3 (Basé sur l'image) ---
      {
        id: 'study-guide',
        title: 'INTERACTIVE STUDY GUIDE: FAITH IN ACTION',
        date: new Date('2026-04-05'),
        downloadCount: 2150,
        category: 'prophetic',
        fileType: 'ZIP (Interactive Guide)',
        fileUrl: '/assets/documents/interactive_guide.zip'
      },
      {
        id: 'ministry-calendar',
        title: 'MINISTRY EVENT CALENDAR (Q3 2026)',
        date: new Date('2026-06-24'),
        downloadCount: 1890,
        category: 'operations',
        fileType: 'ICS',
        fileUrl: '/assets/documents/calendar_q3.ics'
      },
      {
        id: 'book-winning',
        title: 'WINNING FAITH (Chapter Excerpt)',
        date: new Date('2026-04-10'),
        downloadCount: 2910,
        category: 'prophetic',
        fileType: 'EPUB',
        fileUrl: '/assets/documents/winning_excerpt.epub'
      },
    ];
  }
}
