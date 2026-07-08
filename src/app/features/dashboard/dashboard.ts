import {Component, signal} from '@angular/core';
import {Donation} from '../donation/donation';
import {Profile, UserRole} from '../../core/dtos/user-profile';
import {DonationStatus} from '../../core/dtos/donation';
import {Invoice} from '../../core/invoice';
import {AuthService} from '../../services/auth-service';
import {DonateFlowService} from '../../core/services/donate-flow-service';
import {Router, RouterLink} from '@angular/router';
import {Purchase, PurchaseStatus} from '../../core/dtos/purchase';
import {DatePipe, DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';


type Tab = 'overview' | 'donations' | 'purchases' | 'invoices' | 'privileges';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  activeTab = signal<Tab>('overview');
  isLoading = signal<boolean>(true);
  isSidebarOpen = signal(false);

  user = signal<Profile | null >(null);
  donations = signal<Donation[]>([]);
  purchases = signal<Purchase[]>([]);
  invoices = signal<Invoice[]>([]);


  error = signal('');
  isLoggedIn = signal<boolean>(false);
  isProcessing = signal<boolean>(false);

  // Quick donate
  quickAmount = signal<number>(50);
  quickAmounts = [20, 50, 100, 200];

  tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview',    label: 'Vue d\'ensemble', icon: 'fas fa-home' },
    { id: 'donations',   label: 'Mes dons',         icon: 'fas fa-heart' },
    { id: 'purchases',   label: 'Mes achats',        icon: 'fas fa-shopping-bag' },
    { id: 'invoices',    label: 'Mes reçus',         icon: 'fas fa-file-invoice' },
    { id: 'privileges',  label: 'Mon profil',        icon: 'fas fa-user-shield' },
  ];

  constructor(
    private auth: AuthService,
    //private dashboardService: DashboardService,
    private donateFlow: DonateFlowService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.isLoading.set(true);

    // Load profile from auth state first (already in memory if logged in)
    //const currentUser = this.auth.user();
    /*if (currentUser) {
      this.user.set(currentUser);
    }*/

    // Mock data — replace each block with a real service call when the
    // backend endpoints are available, e.g.:
    // this.dashboardService.getDonations().subscribe(d => this.donations.set(d));

    /*this.donations.set([
      { id: 'don-001', amount: 150, currency: 'EUR', designation: 'Dîme', frequency: 'once', status: 'PAID', date: '2026-06-15', receiptUrl: '#', stripeSessionId: 'cs_test_abc' },
      { id: 'don-002', amount: 50,  currency: 'EUR', designation: 'Offrande', frequency: 'monthly', status: 'PAID', date: '2026-05-15', receiptUrl: '#' },
      { id: 'don-003', amount: 200, currency: 'EUR', designation: 'Sacrifice de Shiloh', frequency: 'once', status: 'PAID', date: '2026-04-10', receiptUrl: '#' },
      { id: 'don-004', amount: 75,  currency: 'EUR', designation: 'Don', frequency: 'once', status: 'PENDING', date: '2026-07-01' },
      { id: 'don-005', amount: 30,  currency: 'EUR', designation: 'Offrande Prophétique', frequency: 'once', status: 'FAILED', date: '2026-06-28' },
    ]);

    this.purchases.set([
      { id: 'pur-001', items: [{ productId: 'b1', title: 'Bible Louis Segond', quantity: 1, unitPrice: 24.9 }], total: 24.9, status: 'DELIVERED', date: '2026-05-20', invoiceUrl: '#' },
      { id: 'pur-002', items: [{ productId: 'b2', title: 'Le pouvoir de la prière', quantity: 2, unitPrice: 14.5 }], total: 29, status: 'PROCESSING', date: '2026-07-02' },
    ]);*/

    this.invoices.set([
      { id: 'inv-001', type: 'DONATION_RECEIPT',  label: 'Reçu don — Juin 2026 - TEST',    amount: 150, date: '2026-06-15', downloadUrl: '#' },
      { id: 'inv-002', type: 'DONATION_RECEIPT',  label: 'Reçu don — Mai 2026 - TEST',     amount: 50,  date: '2026-05-15', downloadUrl: '#' },
      { id: 'inv-003', type: 'PURCHASE_INVOICE',  label: 'Facture boutique #001 - TEST',   amount: 24.9, date: '2026-05-20', downloadUrl: '#' },
      { id: 'inv-004', type: 'DONATION_RECEIPT',  label: 'Reçu don — Avril 2026 - TEST',   amount: 200, date: '2026-04-10', downloadUrl: '#' },
    ]);

    /*if (!currentUser) {
      this.user.set({
        id: 'usr-001',
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean.dupont@exemple.com',
        role: 'MEMBER',
        privileges: [
          { code: 'DONATE', label: 'Faire un don', description: 'Accès à la plateforme de don en ligne' },
          { code: 'SHOP', label: 'Boutique', description: 'Accès à la librairie en ligne' },
          { code: 'EVENTS', label: 'Événements', description: 'Inscription aux événements' },
          { code: 'RESOURCES', label: 'Ressources', description: 'Accès aux ressources téléchargeables' },
        ],
        memberSince: '2024-03-01',
      });
    }*/

    setTimeout(() => this.isLoading.set(false), 600);
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.isSidebarOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
  }

  openDonateModal(): void {
    this.donateFlow.open();
  }

  quickDonate(): void {
    this.router.navigate(['/donner'], {
      queryParams: { mode: 'anonymous', amount: this.quickAmount() }
    });
  }

  downloadReceipt(invoice: Invoice): void {
    // TODO: replace with a signed URL fetch via DashboardService.downloadReceipt()
    window.open(invoice.downloadUrl, '_blank');
  }

  statusLabel(status: DonationStatus | PurchaseStatus): string {
    const map: Record<string, string> = {
      PAID: 'Payé', PENDING: 'En attente', FAILED: 'Échoué',
      REFUNDED: 'Remboursé', DELIVERED: 'Livré',
      PROCESSING: 'En cours', CANCELLED: 'Annulé',
    };
    return map[status] ?? status;
  }

  statusClass(status: DonationStatus | PurchaseStatus): string {
    const map: Record<string, string> = {
      PAID: 'badge-success', DELIVERED: 'badge-success',
      PENDING: 'badge-warning', PROCESSING: 'badge-warning',
      FAILED: 'badge-error', CANCELLED: 'badge-error',
      REFUNDED: 'badge-neutral',
    };
    return map[status] ?? 'badge-neutral';
  }

  roleLabel(role: UserRole): string {
    const map: Record<UserRole, string> = {
      MEMBER: 'Membre', ADMIN: 'Administrateur',
      TREASURER: 'Trésorier', PASTOR: 'Pasteur',
    };
    return map[role] ?? role;
  }

  get userInitials(): string {
    const u = this.user();
    if (!u) return '?';
    return `${u.firstname[0]}${u.lastname[0]}`.toUpperCase();
  }

  get recentDonations(): Donation[] {
    return this.donations()
      //.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }


}
