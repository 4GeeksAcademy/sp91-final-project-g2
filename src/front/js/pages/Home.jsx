import React, { useEffect } from 'react';
import '../../styles/home.css';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import Navbar from '../component/Navbar.jsx';
import karoll from '../../img/karoll.jpg';
import luis from '../../img/luis.jpg';
import cristian from '../../img/cristian.jpg';

gsap.registerPlugin(Observer);

const Home = () => {
  useEffect(() => {
    let sections = document.querySelectorAll("section"),
      background = document.querySelectorAll(".bg"),
      outerWrappers = gsap.utils.toArray(".outer"),
      innerWrappers = gsap.utils.toArray(".inner"),
      currentIndex = -1,
      wrap = gsap.utils.wrap(0, sections.length - 1),
      animating;

    let clamp = gsap.utils.clamp(0, sections.length - 1);

    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });

    function gotoSection(index, direction) {
      index = clamp(index); // make sure it's valid

      // If they are the same, it's either the first or last slide
      if (index === currentIndex) {
        return;
      }

      animating = true;
      let fromTop = direction === -1,
        dFactor = fromTop ? -1 : 1,
        tl = gsap.timeline({
          defaults: { duration: 1.25, ease: "power1.inOut" },
          onComplete: () => (animating = false),
        });
      if (currentIndex >= 0) {
        // The first time this function runs, current is -1
        gsap.set(sections[currentIndex], { zIndex: 0 });
        tl.to(background[currentIndex], { yPercent: -15 * dFactor }).set(
          sections[currentIndex],
          { autoAlpha: 0 }
        );
      }
      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
      tl.fromTo(
        [outerWrappers[index], innerWrappers[index]],
        { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
        { yPercent: 0 },
        0
      ).fromTo(background[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0);

      currentIndex = index;
      return tl;
    }

    Observer.create({
      type: "wheel, pointer",
      wheelSpeed: -1,
      onDown: () => {
        !animating && gotoSection(currentIndex - 1, -1);
      },
      onUp: () => {
        !animating && gotoSection(currentIndex + 1, 1);
      },
      tolerance: 200,
      allowClicks: true,
      preventDefault: true,
    });

    gotoSection(0, 1).progress(1);

    // SWIPER
    new Swiper(".swiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      initialSlide: 1,
      slidesPerView: "auto",
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false,
      },
      pagination: {
        el: ".swiper-pagination",
      },
    });
  }, []);

  return (
    <div>
      <Navbar/>
      <section>
        <div className="outer">
          <div className="inner">
            <div className="bg home">
              <div className="scroll">
                <p className="welcome-text">Bienvenido a Cafetaleros</p>
                <p className="coffe-text">Tu café de confianza</p>
              </div>

              <img src="https://th.bing.com/th/id/R.86599832c83f6179e52b4aff416dbdc7?rik=xsMRDGxbiTfaXw&riu=http%3a%2f%2fassets.stickpng.com%2fimages%2f580b57fbd9996e24bc43c0ea.png&ehk=xGMBYlo6JVW7cP%2bHM67OKVHTWe8WW5o%2fdIxqNyZSh2Y%3d&risl=&pid=ImgRaw&r=0" alt="" />
              <div className="home-content">
                <h1>
                  CAFETALEROS
                </h1>
                <p>
                Sumérgete en el mundo del buen café, donde cada taza cuenta una historia de sabor y tradición. Desde los granos más frescos hasta el proceso de preparación más cuidadoso, celebramos la magia que solo una taza perfecta de café puede ofrecer. ¡Disfruta de la experiencia de un café único y deja que sus aromas y texturas te cautiven! Únete a nosotros para disfrutar del mejor café, porque en Cafetaleros sabemos que cada momento es mejor con una taza en mano.
                </p>
                <ul className="links">
                  <li>
                    <a href="#"><ion-icon className="icon" name="logo-apple"></ion-icon></a>
                  </li>
                  <li>
                    <a href="#"><ion-icon className="icon" name="logo-google"></ion-icon></a>
                  </li>
                  <li>
                    <a href="#"><ion-icon className="icon" name="logo-youtube"></ion-icon></a>
                  </li>
                  <li>
                    <a href="#"><ion-icon className="icon" name="logo-instagram"></ion-icon></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <img className="mouse-move" src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/28313e5d-95f1-4e38-ac49-16b4cf006014" alt="" />
      </section>

      <section>
        <div className="outer">
          <div className="inner">
            <div className="bg content">
              <div className="swiper">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <img src= {luis} alt="Luis Borjas" />
                    <div className="title">
                      <h2>Luis Borjas</h2>
                      <p>Nuestro experimentado</p>
                    </div>
                  </div>

                  <div className="swiper-slide">
                    <img src= {karoll} alt="Karoll Guzmán" />
                    <div className="title">
                      <h2>Karoll Guzmán</h2>
                      <p>Nuestra entusiasta</p>
                    </div>
                  </div>

                  <div className="swiper-slide">
                    <img src= {cristian} alt="Cristian Chacón" />
                    <div className="title">
                      <h2>Cristian Chacón</h2>
                      <p>Nuestro prometedor</p>
                    </div>
                  </div>
                </div>
                <div className="swiper-pagination"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="outer">
          <div className="inner">
            <div className="bg info">
              <img src="https://pngimg.com/uploads/coffee_beans/coffee_beans_PNG9283.png" alt="" />
              <div className="info-content">
                <h1>Por qué elegir Cafetaleros?</h1>
                <p>
                Cafetaleros ofrece una experiencia de café única con granos seleccionados a mano de las mejores fincas, combinando métodos tradicionales y experiencia moderna para un sabor rico y audaz. Priorizamos la sostenibilidad y el comercio justo, apoyando a los agricultores comprometidos con la calidad.
                </p>
                <p>
                <strong>¡Disfruta de la taza perfecta para comenzar tu día!</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
