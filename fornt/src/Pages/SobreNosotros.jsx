import React from "react";

export default function SobreNosotros() {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 fade show">Sobre Nosotros</h1>

      {/* Sección: ¿Quiénes somos? */}
      <section className="mb-5">
        <div className="row align-items-center">
          <div
            className="col-md-6 slide-in-left"
            data-bs-toggle="tooltip"
            title="Conoce más sobre nosotros"
          >
            <h3>¿Quiénes somos?</h3>
            <p>
              En <strong>VerdeMarket</strong>, nos dedicamos a ofrecer productos
              ecológicos de alta calidad a precios accesibles. Nuestro objetivo
              es contribuir a un estilo de vida más saludable y sostenible,
              haciendo que productos amigables con el medio ambiente sean
              accesibles para todos.
            </p>
          </div>
          <div className="col-md-6 slide-in-right">
            <img
              src="/images/ecomarket.jpg"
              alt="Quiénes somos"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </section>

      {/* Sección: Misión y Visión */}
      <section className="mb-5">
        <div className="row align-items-center">
          <div className="col-md-6 order-md-2 slide-in-right">
            <h3>Nuestra Misión</h3>
            <p>
              Promover un mundo más verde mediante la distribución de productos
              respetuosos con el medio ambiente, mientras garantizamos la
              satisfacción de nuestros clientes con calidad y precio.
            </p>
            <h3>Nuestra Visión</h3>
            <p>
              Ser la tienda líder en productos ecológicos en Bolivia,
              fomentando un cambio positivo en los hábitos de consumo.
            </p>
          </div>
          <div className="col-md-6 order-md-1 slide-in-left">
            <img
              src="/images/misionvision.png"
              alt="Misión y Visión"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </section>

      {/* Sección: Nuestros Valores */}
      <section className="mb-5">
        <h3 className="text-center mb-4 fade show">Nuestros Valores</h3>
        <div className="row">
          {[
            {
              img: "/images/sostenible.png",
              title: "Sostenibilidad",
              text: "Cuidar del medio ambiente en cada paso.",
            },
            {
              img: "/images/calidad.png",
              title: "Calidad",
              text: "Ofrecemos productos confiables y duraderos.",
            },
            {
              img: "/images/innovacion.png",
              title: "Innovación",
              text: "Siempre mejorar nuestra oferta y servicios.",
            },
            {
              img: "/images/compromiso.png",
              title: "Compromiso",
              text: "Atender a las necesidades de nuestros clientes.",
            },
          ].map((valor, index) => (
            <div
              key={index}
              className="col-md-3 text-center fade show"
              data-bs-toggle="tooltip"
              title={valor.title}
            >
              <img
                src={valor.img}
                alt={valor.title}
                className="img-fluid rounded mb-3"
              />
              <h5>{valor.title}</h5>
              <p>{valor.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sección: Contacto */}
      <section>
        <div className="row align-items-center">
          <div className="col-md-6 slide-in-left">
            <h3>Contacto</h3>
            <p>
              Si deseas conocernos más, puedes visitarnos en la{" "}
              <strong>Universidad NUR, Santa Cruz, Bolivia</strong>, o
              contactarnos a través de nuestras redes sociales:
            </p>
            <ul>
              <li>
                <strong>Facebook:</strong>{" "}
                <a
                  href="https://www.facebook.com/share/17rZTgAfJC/?mibextid=JRoKGi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VerdeMarket
                </a>
              </li>
              <li>
                <strong>Instagram:</strong>{" "}
                <a
                  href="https://www.instagram.com/verdemarket.scz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @verdemarket.scz
                </a>
              </li>
              <li>
                <strong>Teléfono:</strong> 78130227
              </li>
              <li>
              <strong>Teléfono:</strong> 70248750
              </li>
              <li>
              <strong>Teléfono:</strong> 77060721
              </li>
            </ul>
          </div>
          <div className="col-md-2 slide-in-right">
            <img
              src="/images/contacto.png"
              alt="Contacto"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
