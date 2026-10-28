import { Head } from "fresh/runtime";
import { site } from "../data/site.ts";
import { define } from "../utils.ts";

interface Job {
  role: string;
  company: string;
  period: string;
  place: string;
  bullets: string[];
}

/** Straight from the CV; the wording is updated once the details are confirmed. */
const experience: Job[] = [
  {
    role: "Junior Web Developer",
    company: "3iPunt",
    period: "octubre 2023 — mayo 2026",
    place: "Barcelona",
    bullets: [
      "Desarrollo full-stack de aplicaciones web en producción con PHP, JavaScript, Moodle y jQuery.",
      "Control de versiones y trabajo con ramas en Git y Bitbucket.",
      "Seguimiento de incidencias, tareas y planificación en Jira.",
      "Colaboración con el equipo técnico en un entorno de consultoría y desarrollo a medida.",
    ],
  },
  {
    role: "Desarrollador backend PHP",
    company: "4DMOVIN Business / Namastech",
    period: "junio 2022 — septiembre 2022",
    place: "Castelldefels",
    bullets: [
      "Desarrollo sobre un ERP en PHP y Angular.",
      "Automatización de correos y sincronización de calendarios integrando Google APIs y Microsoft Graph API, mejorando la compatibilidad con IMAP, POP y SMTP.",
      "Pantalla de gestión y automatización de redes sociales (posts y feeds).",
    ],
  },
  {
    role: "Soporte TIC (becario)",
    company: "EPSEVG — Universitat Politècnica de Catalunya",
    period: "noviembre 2020 — enero 2022",
    place: "Barcelona",
    bullets: [
      "Helpdesk para el personal de la UPC: incidencias informáticas de primer nivel.",
      "Administración de sistemas Linux y Windows: cuentas, permisos y resolución de incidencias.",
      "Gestión de imágenes de sistemas operativos con OpenGnsys.",
      "Puesta en marcha del Digital Signage de la universidad: sistema operativo Linux y hardware Raspberry.",
    ],
  },
];

export default define.page(function About(ctx) {
  const basePath = ctx.config.basePath;

  return (
    <>
      <Head>
        <title>Sobre mí — {site.author}</title>
        <meta
          name="description"
          content="Desarrollador full-stack con base en sistemas: experiencia en producción, soporte TIC en la UPC y un homelab mantenido desde hace más de dos años."
        />
      </Head>

      <h1 class="page-title">Sobre mí</h1>

      <div class="about-copy">
        <p class="page-lede">
          Soy desarrollador full-stack y acabo de terminar Ingeniería
          Informática en la UPC, compaginándola con el trabajo.
        </p>
        <p>
          Empecé en el helpdesk de la universidad, donde aprendí cómo sufre la
          gente cuando un sistema falla: soporte a usuarios, gestión de
          incidencias y cuentas de Directorio Activo. Después pasé a desarrollo:
          dos años y ocho meses construyendo aplicaciones web en producción con
          PHP, JavaScript y Moodle.
        </p>
        <p>
          En paralelo mantengo mi propio homelab: un NAS, varias máquinas, VPN
          con WireGuard y OpenVPN, servidor Git con Gitea, análisis estático con
          SonarQube y servicios publicados al exterior por túnel de Cloudflare.
          No es un laboratorio de tutorial: lleva más de dos años funcionando y
          ha tenido sus averías, que es donde más he aprendido.
        </p>
        <p>
          Busco un puesto donde las dos cosas cuenten: desarrollo en un equipo
          de sistemas o de seguridad, o infraestructura donde entender lo que
          corre encima sea una ventaja. Me interesa especialmente la seguridad
          aplicada —vulnerabilidades, calidad de código, exposición de
          servicios— porque es donde confluyen las dos mitades.
        </p>
      </div>

      <h2 class="section-title" id="experiencia">Experiencia</h2>
      <ol class="experience">
        {experience.map((job) => (
          <li class="experience-item" key={`${job.company}-${job.period}`}>
            <h3>{job.role}</h3>
            <p class="experience-meta">
              {job.company} · {job.period} · {job.place}
            </p>
            <ul>
              {job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </li>
        ))}
      </ol>

      <h2 class="section-title" id="homelab">Homelab</h2>
      <p class="section-lede">
        Infraestructura propia montada y mantenida desde hace más de dos años:
        un servidor Synology NAS y varias máquinas que sirven multimedia,
        almacenamiento, VPN y un Git propio. Jellyfin separa el cómputo (una
        Orange Pi) del almacenamiento (el NAS), conectados por NFS y SMB. Las
        migraciones entre dispositivos se automatizan con Ansible y Rsync, y la
        publicación al exterior va por túnel de Cloudflare, sin abrir puertos en
        el router.
      </p>
      <ul class="tag-list">
        {[
          "Synology NAS",
          "NFS / SMB",
          "Docker",
          "Ansible",
          "Rsync",
          "WireGuard",
          "OpenVPN",
          "Gitea",
          "SonarQube",
          "Cloudflare Tunnel",
        ].map((tag) => <li class="tag" key={tag}>{tag}</li>)}
      </ul>

      <h2 class="section-title">Formación</h2>
      <div class="education">
        <h3>Grado en Ingeniería Informática</h3>
        <p class="experience-meta">
          Universitat Politècnica de Catalunya (UPC) · 2017 — 2026 · Barcelona
        </p>
      </div>

      <p>
        El detalle de lo que he construido está en{" "}
        <a href={`${basePath}/projects`}>la página de proyectos</a>.
      </p>
    </>
  );
});
