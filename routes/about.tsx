import { Head } from "fresh/runtime";
import { site } from "../data/site.ts";
import { define } from "../utils.ts";

/**
 * Biography and the homelab. Work history moved to `/experience` so this page
 * stops competing with the CV: a recruiter lands on experience, a curious
 * reader lands here.
 */
const pageDescription =
  "Sobre Ricardo Verduguez: de soporte TIC en la UPC a desarrollo full-stack en producción, y el homelab que mantiene desde hace más de dos años.";

export default define.page(function About(ctx) {
  const basePath = ctx.config.basePath;

  return (
    <>
      <Head>
        <title>Sobre mí — {site.author}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={`Sobre mí — ${site.author}`} />
        <meta property="og:description" content={pageDescription} />
      </Head>

      <h1 class="page-title">Sobre mí</h1>
      <p class="page-lede">
        Soy desarrollador full-stack y acabo de terminar Ingeniería Informática
        en la UPC, compaginándola con el trabajo.
      </p>

      <div class="prose">
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

      <div class="section-head">
        <span class="section-num">01</span>
        <h2 class="section-title" id="homelab">Homelab</h2>
      </div>

      <p class="section-note">
        Infraestructura propia montada y mantenida desde hace más de dos años:
        un servidor Synology NAS y varias máquinas que sirven multimedia,
        almacenamiento, VPN y un Git propio. Jellyfin separa el cómputo (una
        Orange Pi) del almacenamiento (el NAS), conectados por NFS y SMB. Las
        migraciones entre dispositivos se automatizan con Ansible y Rsync, y la
        publicación al exterior va por túnel de Cloudflare, sin abrir puertos en
        el router.
      </p>

      <ul class="tag-list">
        {site.homelabStack.map((item) => (
          <li class="tag" key={item}>{item}</li>
        ))}
      </ul>

      <div class="section-head">
        <span class="section-num">02</span>
        <h2 class="section-title">Dónde seguir</h2>
      </div>

      <p class="prose">
        El historial laboral completo está en{" "}
        <a href={`${basePath}/experience`}>experiencia</a>; el detalle técnico
        de lo que he construido, en{" "}
        <a href={`${basePath}/projects`}>proyectos</a>.
      </p>
    </>
  );
});
