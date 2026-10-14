import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Venta } from '../../servicios/venta'; 


interface ObraGaleria {
  id: number;
  origin: 'human' | 'ai';
  discipline: string;
  badgeIcon: string;
  badgeText: string;
  categoryLabel: string;
  yearOrVersion: string;
  title: string;
  artist: string;
  studioLocation: string;
  description: string;
  priceLabel: string;
  price: string;
  secondaryBtnText: string;
  primaryBtnText: string;
  image: string;
  alt: string;
  imgFilterClass: string;
  favorito: boolean;
}





@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {


  currentParadigm: string = 'all';
  currentDiscipline: string = 'all';

  // Lista de píldoras de disciplinas para los botones de filtro
  disciplinas = [
    { id: 'all', nombre: 'Todas las disciplinas' },
    { id: 'sculpture', nombre: 'Esculturas' },
    { id: 'painting', nombre: 'Pintura & Óleo' },
    { id: 'installation', nombre: 'Instalación' },
    { id: 'digital', nombre: 'Arte Digital' },
    { id: 'photography', nombre: 'Fotografía' },
    { id: 'illustration', nombre: 'Ilustración' }
  ];

  // Catálogo de obras (Humano e IA)
  obras: ObraGaleria[] = [
    {
      id: 1,
      origin: 'human',
      discipline: 'sculpture',
      badgeIcon: 'person',
      badgeText: 'Humano',
      categoryLabel: 'Escultura en Mármol',
      yearOrVersion: '2023',
      title: 'Busto de Mármol Fragmentado',
      artist: 'Elena Rostova',
      studioLocation: 'Estudio Rostova • Madrid, España',
      description: 'Mármol de Carrara cincelado a mano, pátina de cera de abejas. 46 × 28 × 32 cm.',
      priceLabel: 'Adquisición',
      price: '€1,450',
      secondaryBtnText: 'Hacer oferta',
      primaryBtnText: 'Comprar ahora',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKzRNNjw_UO_WH_rOR6Y3jlvAacxdpF8C9HloDuGS--zlLEQM6_SOyHG9WystyNvX5jhSNFe4W8bOyAIP3rGx_vIpXpNokmzUSzwdNDQ1HE5eIXaRYVCLf7c3nbkO43Vd5YsMzZxWwy-_8S2K2ffGMJJFk7sJgCSXm2h0EU4oCIjLXZFuwAtTJqxkGvRCaMp_SsNzCBXlvE_FXpwKWgTZyXoh_jK39f06KpZUYuteNXqTepCr4w1Oj1A',
      alt: 'Busto de Mármol Fragmentado',
      imgFilterClass: 'grayscale contrast-[1.05]',
      favorito: false
    },
    {
      id: 2,
      origin: 'human',
      discipline: 'painting',
      badgeIcon: 'brush',
      badgeText: 'Humano',
      categoryLabel: 'Óleo sobre Lino',
      yearOrVersion: '2024',
      title: 'Ocaso en Terracota',
      artist: 'Mateo Benavides',
      studioLocation: 'Atelier Benavides • Oaxaca / Valencia',
      description: 'Pigmentos minerales puros y aglutinante vegetal sobre lino crudo belga. 120 × 90 cm.',
      priceLabel: 'Precio Galería',
      price: '€820',
      secondaryBtnText: 'Hacer oferta',
      primaryBtnText: 'Comprar ahora',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG50FwYE1qfDo2xoNG_GjXNvcr3KNKDMFhCGxEEPSlmzYGcw2cHTQYaI_051zaRgdOfsJww2CV9sTDb2wDPQixk-jQKz9Bv4naAvi9jZUx3hFhCaR3-VsWzgwL_irFNvcL1eicgG5KFbn8u0uB6K0vmnlLXUpyfep3BlMgkkrhU1Fi_cluxywOLTAM7ncsr9NQUK6SEPUQXDl6e8eo4QfoFhfb6xIyB1hNd93pnkfIIETydfgHUll3NQ',
      alt: 'Ocaso en Terracota',
      imgFilterClass: '',
      favorito: false
    },
    {
      id: 3,
      origin: 'ai',
      discipline: 'digital',
      badgeIcon: 'auto_awesome',
      badgeText: 'Generado por IA',
      categoryLabel: 'Latente Procedural 3D',
      yearOrVersion: 'v5.2',
      title: 'Vórtice Topológico 09',
      artist: 'Studio Diffusion v5.2',
      studioLocation: 'Curaduría: Algorithmic Vault • Berlín',
      description: 'Archivo máster TIFF de ultra-alta definición 12K con render 3D GLTF interactivo incluido.',
      priceLabel: 'Licencia Maestra',
      price: '€185',
      secondaryBtnText: 'Inspeccionar',
      primaryBtnText: 'Comprar ahora',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeO00BNyGwq0z0Rky4YeTV9hBOkzsI0bWCHVFTg_2EdCSiyjCW6_AFfc-gCyFJ9BB3I_NIqS6QrJ0FzQYcdcpXq3-dXDoxsg2Zpse3fZ5S8W7A0wKa3f3C0WX-BnfXqH5akbmP_lpj7Q--1UEGcpoXUanTPgMbmNVgzVjrjTwOA61Jv_rLABU81qoAfhc2Zs7Zk2psbjOct4TrdQ-wNx1qgitKWXMKkVEMMQu_3aEG7R4nQLc2K_SSbg',
      alt: 'Vórtice Topológico 09',
      imgFilterClass: '',
      favorito: false
    },
    {
      id: 4,
      origin: 'human',
      discipline: 'sculpture',
      badgeIcon: 'handyman',
      badgeText: 'Humano',
      categoryLabel: 'Bronce & Madera',
      yearOrVersion: '2024',
      title: 'Geometría en Bronce y Roble',
      artist: 'Clara Szekely',
      studioLocation: 'Fundición Szekely • Budapest / Barcelona',
      description: 'Bronce fundido a la cera perdida ensamblado con roble quemado Shou Sugi Ban. 54 × 22 × 18 cm.',
      priceLabel: 'Pieza Única',
      price: '€2,100',
      secondaryBtnText: 'Hacer oferta',
      primaryBtnText: 'Comprar ahora',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI-z2P_R7b3Iy3pLLYbF62QkfHJVt0X-2HnOxX90BAehyEJElSJJ58094pATKxj38_tB0iiPNQxiIZbHp6hO6wNvN_fKH4wiy2LAGvycX1DXVUP9wqzLZc-dRmQz-Cj35Vbfgcd642VlZ3yY6b04PjDiXaTbMNT-Sc5f_vCmB_vi8ADufA8wCg0F9DeVaOqNDMeOc6h6ZJTEf1XCW4JC1g1ZQ4hmfzbyJi5VUKYuv3-eMFxxlWnQaSlw',
      alt: 'Geometría en Bronce y Roble',
      imgFilterClass: 'grayscale contrast-110',
      favorito: false
    },
    {
      id: 5,
      origin: 'ai',
      discipline: 'sculpture',
      badgeIcon: 'memory',
      badgeText: 'Generado por IA',
      categoryLabel: 'Escultura Algorítmica',
      yearOrVersion: 'Sintético',
      title: 'Monolito Hiperbólico IV',
      artist: 'NeuroForm Engine',
      studioLocation: 'Generado con StableDiffusion XL + ControlNet Depth',
      description: 'Malla poligonal 3D OBJ/FBX de alta densidad lista para manufactura aditiva y fresado CNC.',
      priceLabel: 'Licencia CNC',
      price: '€95',
      secondaryBtnText: 'Inspeccionar',
      primaryBtnText: 'Comprar ahora',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt8wHNQyREEg8GgUJzP3yEerUusBer7h3i_1iaebU6GLmx3itB6_fx4pifi6g8oIhrO493Y4SfwzB0AmpQkLqrUEiXiL_3tR1Ya6ZXENraXzrctNLyd49lgkxMZpFke4h2epxOC0aIWGskwjo7DJ9zO09-TAjMv82qLrg2IVGSDggVLclCGSaVurOybeN6O_AzVVvxpZCpNjj60WisEucQ3NzMw7pJnVljki5ghM38R0CkBQE-CgdW-A',
      alt: 'Monolito Hiperbólico IV',
      imgFilterClass: '',
      favorito: false
    },
    {
      id: 6,
      origin: 'ai',
      discipline: 'illustration',
      badgeIcon: 'auto_awesome',
      badgeText: 'Generado por IA',
      categoryLabel: 'Síntesis Gráfica',
      yearOrVersion: 'Serie Latente',
      title: 'Vigía en Vaho Carmesí',
      artist: 'Midjourney v6 Archival Seed',
      studioLocation: 'Prompter: Studio Arcano • Tokio',
      description: 'Impresión giclée sobre papel Hahnemühle Photo Rag 308g con firma criptográfica on-chain.',
      priceLabel: 'Edición de 10',
      price: '€320',
      secondaryBtnText: 'Hacer oferta',
      primaryBtnText: 'Comprar ahora',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZs-K9bgpGaMuR7YO0zM_7sD90I9XJpIgiwDaev_RPA5JD9bumfh2QU-b1L219apW1zFMyeJoZ6SBFWgHEYa9vqIBHSYsZCMMftgcSRpdML8KRepIcVsnf-zu5QuSdel4_0k_k4t0TNEQKF5gp88IkFYZWYJRNsQKzeqLJUAfzAOQlY7z1IewrngJAj4Y98WRob910-tEG3vE9HRwbTgYoAGIJFQDtj0ekK7oF5-L3cZHa5Gx6AAbewQ',
      alt: 'Vigía en Vaho Carmesí',
      imgFilterClass: '',
      favorito: false
    }
  ];

  // Devuelve las obras filtradas dinámicamente según el botón activo (Humano/IA y Disciplina)
  get obrasFiltradas(): ObraGaleria[] {
    return this.obras.filter(obra => {
      const originMatch = this.currentParadigm === 'all' || obra.origin === this.currentParadigm;
      const disciplineMatch = this.currentDiscipline === 'all' || obra.discipline === this.currentDiscipline;
      return originMatch && disciplineMatch;
    });
  }

  // Cambia entre 'human', 'ai' o vuelve a 'all' si se pulsa el mismo botón
  setArtParadigm(paradigm: 'human' | 'ai'): void {
    if (this.currentParadigm === paradigm) {
      this.currentParadigm = 'all';
    } else {
      this.currentParadigm = paradigm;
    }
  }

  // Filtra por disciplina (Esculturas, Pintura, etc.)
  filterDiscipline(disciplineId: string): void {
    this.currentDiscipline = disciplineId;
  }

  // Botón de corazón (Favorito)
  toggleFavorito(obra: ObraGaleria): void {
    obra.favorito = !obra.favorito;
  }














  ventas: any[] = []; 
  

  totalVentas: number = 0;
  totalIngresos: number = 0;

  constructor(private sVenta: Venta, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.consultaVentas();
  }

  consultaVentas() {
    this.sVenta.consulta().subscribe({
      next: (resultado: any) => {
        console.log("Ventas recibidas de PHP:", resultado);
        this.ventas = resultado;
        
        
        this.totalVentas = this.ventas.length; 
        
        
        this.totalIngresos = this.ventas.reduce((sum, venta) => sum + parseFloat(venta.total || 0), 0);

        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error("Error al conectar con PHP (Ventas):", error);
      }
    });
  }
}