import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Venta } from '../../servicios/venta';
import { Obra } from '../../servicios/obra';

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
  ventas: any[] = [];
  totalVentas: number = 0;
  totalIngresos: number = 0;

  currentParadigm: string = 'all';
  currentDiscipline: string = 'all';

  disciplinas = [
    { id: 'all', nombre: 'Todas las disciplinas' },
    { id: 'sculpture', nombre: 'Esculturas' },
    { id: 'painting', nombre: 'Pintura & Óleo' },
    { id: 'installation', nombre: 'Instalación' },
    { id: 'digital', nombre: 'Arte Digital' },
    { id: 'photography', nombre: 'Fotografía' },
    { id: 'illustration', nombre: 'Ilustración' }
  ];

  // Obras base del diseño + las que llegan desde MySQL
  obrasBase: ObraGaleria[] = [
    {
      id: 101,
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
      id: 102,
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
      id: 103,
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
    }
  ];

  obras: ObraGaleria[] = [...this.obrasBase];

  constructor(
    private sVenta: Venta,
    private sObra: Obra,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.consultaVentas();
    this.consultaObrasBD();
  }

  // Carga las obras reales guardadas en MySQL y las agrega al Dashboard
  consultaObrasBD(): void {
    this.sObra.consulta().subscribe({
      next: (resultado: any) => {
        if (Array.isArray(resultado)) {
          const obrasDeBD: ObraGaleria[] = resultado.map((item: any) => {
            const esIA = item.origen === 'ai';
            return {
              id: Number(item.id_obra),
              origin: esIA ? 'ai' : 'human',
              discipline: item.disciplina || 'painting',
              badgeIcon: esIA ? 'auto_awesome' : 'palette',
              badgeText: esIA ? 'Generado por IA' : 'Humano',
              categoryLabel: esIA ? 'Síntesis Algorítmica' : 'Obra Certificada',
              yearOrVersion: '2026',
              title: item.titulo,
              artist: item.artista || 'Artista Galería Ópera',
              studioLocation: 'Catálogo Oficial • Galería Ópera',
              description: item.descripcion,
              priceLabel: item.estado === 'disponible' ? 'Adquisición' : item.estado,
              price: '$' + Number(item.precio).toLocaleString('es-CO'),
              secondaryBtnText: esIA ? 'Inspeccionar' : 'Hacer oferta',
              primaryBtnText: 'Comprar ahora',
              image: item.imagen && item.imagen.trim() !== ''
                ? item.imagen
                : 'https://lh3.googleusercontent.com/aida-public/AB6AXuA65ahsOvDT5uzIp9f9a3hbZ-cgDBmye9pLFD9wbT_LbfBUNoEpyPNpcDIPgWnEDxaIZclKDk1rkZSinIqOCSt-TqN_ro8L_tQ0nZxXMXF2q2Qa381lf3kmg_zv0kPl6HcVlOR2cRBCSeD1ETiGFykFeBB0_C6wAYdqLVsFh4Imr06M5Ypbwj6fSYdUgfFTEltUFK91jvNNSZOO7I777gjyKznRRE8CwiaKqpdoRxO7M6rPu_4H3M9gAw',
              alt: item.titulo,
              imgFilterClass: '',
              favorito: false
            };
          });
          this.obras = [...obrasDeBD, ...this.obrasBase];
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => console.error('Error cargando obras en Dashboard:', err)
    });
  }

  consultaVentas(): void {
    this.sVenta.consulta().subscribe({
      next: (resultado: any) => {
        this.ventas = Array.isArray(resultado) ? resultado : [];
        this.totalVentas = this.ventas.length;
        this.totalIngresos = this.ventas.reduce((sum, venta) => sum + parseFloat(venta.total || 0), 0);
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al conectar con PHP (Ventas):', error);
      }
    });
  }

  get obrasFiltradas(): ObraGaleria[] {
    return this.obras.filter(obra => {
      const originMatch = this.currentParadigm === 'all' || obra.origin === this.currentParadigm;
      const disciplineMatch = this.currentDiscipline === 'all' || obra.discipline === this.currentDiscipline;
      return originMatch && disciplineMatch;
    });
  }

  setArtParadigm(paradigm: 'human' | 'ai'): void {
    this.currentParadigm = this.currentParadigm === paradigm ? 'all' : paradigm;
  }

  filterDiscipline(disciplineId: string): void {
    this.currentDiscipline = disciplineId;
  }

  toggleFavorito(obra: ObraGaleria): void {
    obra.favorito = !obra.favorito;
  }
}