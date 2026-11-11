import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Venta } from '../../servicios/venta';
import { Obra } from '../../servicios/obra';
import { CompraService } from '../../servicios/compra';
import Swal from 'sweetalert2';

export interface ObraGaleria {
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
  precioNumerico: number;
  stock: number;
  esDeBD: boolean;
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
  imports: [CommonModule, RouterModule],
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
      price: '$1.450.000',
      precioNumerico: 1450000,
      stock: 1,
      esDeBD: false,
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
      price: '$820.000',
      precioNumerico: 820000,
      stock: 2,
      esDeBD: false,
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
      price: '$185.000',
      precioNumerico: 185000,
      stock: 5,
      esDeBD: false,
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
    private sCompra: CompraService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sincronizarFavoritos();
    this.consultaVentas();
    this.consultaObrasBD();
  }

  consultaObrasBD(): void {
    this.sObra.consulta().subscribe({
      next: (resultado: any) => {
        if (Array.isArray(resultado)) {
          const obrasDeBD: ObraGaleria[] = resultado.map((item: any) => {
            const esIA = item.origen === 'ai';
            const stockDisp = Number(item.stock || 0);
            const agotada = item.estado === 'vendido' || stockDisp <= 0;

            return {
              id: Number(item.id_obra),
              origin: esIA ? 'ai' : 'human',
              discipline: item.disciplina || 'painting',
              badgeIcon: esIA ? 'auto_awesome' : 'palette',
              badgeText: esIA ? 'Generado por IA' : 'Humano',
              categoryLabel: esIA ? 'Síntesis Algorítmica' : 'Obra Certificada',
              yearOrVersion: `Stock: ${stockDisp}`,
              title: item.titulo,
              artist: item.artista || 'Artista Galería Ópera',
              studioLocation: 'Catálogo Oficial • Galería Ópera',
              description: item.descripcion,
              priceLabel: agotada ? 'VENDIDO' : item.estado,
              price: '$' + Number(item.precio).toLocaleString('es-CO'),
              precioNumerico: Number(item.precio),
              stock: stockDisp,
              esDeBD: true,
              secondaryBtnText: esIA ? 'Inspeccionar' : 'Hacer oferta',
              primaryBtnText: agotada ? 'Agotado' : 'Comprar ahora',
              image: item.imagen && item.imagen.trim() !== ''
                ? item.imagen
                : 'https://lh3.googleusercontent.com/aida-public/AB6AXuA65ahsOvDT5uzIp9f9a3hbZ-cgDBmye9pLFD9wbT_LbfBUNoEpyPNpcDIPgWnEDxaIZclKDk1rkZSinIqOCSt-TqN_ro8L_tQ0nZxXMXF2q2Qa381lf3kmg_zv0kPl6HcVlOR2cRBCSeD1ETiGFykFeBB0_C6wAYdqLVsFh4Imr06M5Ypbwj6fSYdUgfFTEltUFK91jvNNSZOO7I777gjyKznRRE8CwiaKqpdoRxO7M6rPu_4H3M9gAw',
              alt: item.titulo,
              imgFilterClass: '',
              favorito: false
            };
          });
          this.obras = [...obrasDeBD, ...this.obrasBase];
          this.sincronizarFavoritos();
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => console.error('Error cargando obras en Dashboard:', err)
    });
  }

  // FUNCIÓN DE COMPRA DIRECTA CON ALTA CIBERSEGURIDAD
  comprarObraDirecto(obra: ObraGaleria): void {
    const nombreSesion = sessionStorage.getItem('nombre');
    const correoSesion = sessionStorage.getItem('correo');
    const idUsuario = Number(sessionStorage.getItem('id') || 0);

    // 1. Validación de Autenticación: Si es un visitante sin cuenta, lo llevamos al Login
    if (!nombreSesion || !correoSesion) {
      Swal.fire({
        title: 'Autenticación Requerida',
        text: 'Para adquirir una obra certificada debes iniciar sesión con tu cuenta.',
        icon: 'lock' as any,
        iconHtml: '<span class="material-symbols-outlined">lock</span>',
        showCancelButton: true,
        confirmButtonColor: '#000000',
        cancelButtonColor: '#747878',
        confirmButtonText: 'Iniciar Sesión',
        cancelButtonText: 'Seguir explorando'
      }).then((res) => {
        if (res.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    // 2. Verificar que la obra tenga stock
    if (obra.stock <= 0) {
      Swal.fire('Obra Agotada', 'Esta pieza ya fue adquirida y no tiene stock disponible.', 'warning');
      return;
    }

    // 3. Si es una de las 3 tarjetas de demostración estáticas, avisamos que elija una de la BD
    if (!obra.esDeBD) {
      Swal.fire({
        title: 'Obra de Exhibición (Demo)',
        text: 'Esta pieza es de muestra visual. Puedes comprar cualquiera de las obras reales subidas a tu base de datos.',
        icon: 'info',
        confirmButtonColor: '#000000'
      });
      return;
    }

    // 4. Modal de Confirmación de Compra Segura
    Swal.fire({
      title: `¿Adquirir "${obra.title}"?`,
      html: `
        <div style="text-align: left; font-size: 14px; line-height: 1.6;">
          <p><strong>Artista:</strong> ${obra.artist}</p>
          <p><strong>Comprador verificado:</strong> ${nombreSesion} (${correoSesion})</p>
          <p><strong>Valor en Galería:</strong> ${obra.price} COP</p>
          <p style="font-size: 12px; color: #555; margin-top: 8px;">
            🔒 El precio final y el stock serán verificados directamente por el servidor MySQL.
          </p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#aa361e',
      confirmButtonText: 'Confirmar Compra Segura',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Enviamos SOLO los IDs y credenciales; el precio lo calcula PHP desde MySQL
        const payloadSeguro = {
          id_usuario: idUsuario,
          nombre_comprador: nombreSesion,
          correo_comprador: correoSesion,
          id_obra: obra.id,
          cantidad: 1
        };

        this.sCompra.comprar(payloadSeguro).subscribe({
          next: (resp: any) => {
            if (resp && resp.resultado === 'OK') {
              Swal.fire({
                title: '¡Adquisición Certificada!',
                html: `
                  <div style="text-align: left; font-size: 13px;">
                    <p>${resp.mensaje}</p>
                    <p><strong>Total liquidado:</strong> $${Number(resp.total).toLocaleString('es-CO')} COP</p>
                    <p style="margin-top:8px;"><strong>Firma SHA-256:</strong></p>
                    <code style="display:block; padding:6px; background:#f5f3ef; font-size:10px; word-break:break-all;">${resp.hash}</code>
                  </div>
                `,
                icon: 'success',
                confirmButtonColor: '#000000'
              });
              // Recargamos las obras desde MySQL para reflejar el nuevo stock al instante
              this.consultaObrasBD();
            } else {
              Swal.fire('No se pudo procesar', resp?.mensaje || 'Error al verificar la obra.', 'error');
            }
          },
          error: (err: any) => {
            console.error('Error en la compra:', err);
            Swal.fire('Error de Servidor', 'No fue posible conectar con el módulo de compras.', 'error');
          }
        });
      }
    });
  }

  // Botón secundario (Hacer oferta / Inspeccionar)
  inspeccionarObra(obra: ObraGaleria): void {
    Swal.fire({
      title: obra.title,
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p><strong>Autor:</strong> ${obra.artist}</p>
          <p><strong>Régimen:</strong> ${obra.badgeText}</p>
          <p><strong>Memoria Curatorial:</strong> ${obra.description}</p>
          <p><strong>Unidades disponibles:</strong> ${obra.stock}</p>
          <p><strong>Precio oficial:</strong> ${obra.price}</p>
        </div>
      `,
      imageUrl: obra.image,
      imageHeight: 220,
      imageAlt: obra.title,
      confirmButtonColor: '#000000',
      confirmButtonText: 'Cerrar Ficha'
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

  // Genera una clave única en el navegador exclusiva para el usuario que tiene la sesión iniciada
  private obtenerClaveColeccion(): string {
    const idUsuario = sessionStorage.getItem('id') || '';
    const nombreUsuario = sessionStorage.getItem('nombre') || '';
    const correoUsuario = sessionStorage.getItem('correo') || '';

    const identificador = (idUsuario + '_' + nombreUsuario + '_' + correoUsuario)
      .toLowerCase()
      .replace(/\s+/g, '');

    // Si no hay nadie logueado, usa una caja separada llamada 'visitante'
    return identificador !== '__' ? `coleccion_opera_${identificador}` : 'coleccion_opera_visitante';
  }

  // Marca con corazón únicamente las obras que pertenecen al usuario actual
  sincronizarFavoritos(): void {
    const claveUsuario = this.obtenerClaveColeccion();
    const guardadosTexto = localStorage.getItem(claveUsuario);
    const coleccion: ObraGaleria[] = guardadosTexto ? JSON.parse(guardadosTexto) : [];
    const idsGuardados = new Set(coleccion.map(item => item.id));

    this.obras.forEach(obra => {
      obra.favorito = idsGuardados.has(obra.id);
    });
  }

  // Guarda o elimina la obra únicamente en la colección de la cuenta activa
  toggleFavorito(obra: ObraGaleria): void {
    obra.favorito = !obra.favorito;

    const claveUsuario = this.obtenerClaveColeccion();
    const guardadosTexto = localStorage.getItem(claveUsuario);
    let coleccion: ObraGaleria[] = guardadosTexto ? JSON.parse(guardadosTexto) : [];

    if (obra.favorito) {
      const existe = coleccion.some(item => item.id === obra.id);
      if (!existe) {
        coleccion.unshift(obra);
      }
    } else {
      coleccion = coleccion.filter(item => item.id !== obra.id);
    }

    localStorage.setItem(claveUsuario, JSON.stringify(coleccion));
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
}