<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package propart-spain
 */

get_header();
?>
  <main id="main-container">
	  <nav id="bottom-navbar" class="bottom-nav">
	</nav>
    <section class="project">
      <div class="project-top">
<!--         <a
          href="javascript:void(0);"
          class="projrct-all"
          onclick="window.history.back();"
        >
          <img src="<?php echo get_template_directory_uri(); ?>/images/secondary/prev.png" alt="all" />
          	<p class="project-text">All projects</p>
        </a> -->
<a
    id="backButton"
    href="javascript:void(0);"
    class="projrct-all"
>
    <img src="<?php echo get_template_directory_uri(); ?>/images/secondary/prev.png" alt="all" />
    <p class="project-text">All projects</p>
</a>
        <div class="project-top-buttons">
          <button
            class="button-white"
            style="font-size: 14px !important; line-height: 22px"
            id="add-to-favorites"
          >
            Add to favorites
          </button>
          <a
            href="tel:+34695113333"
            style="font-size: 14px !important"
            class="button-black"
            >Contact us</a
          >
        </div>
      </div>
      <div class="project-desc">
        <div class="project-desc-left">
          <img
            class="project-desc-img"
            src="<?php echo get_template_directory_uri(); ?>/images/secondary/project.png"
            alt="project"
            id="projectMainImg"
          />
          <button class="project-desc-button" id="viewPhotosBtn">
            View all photos
          </button>
        </div>

        <div class="gallery-container">
          <div class="gallery-wrapper">
            <img id="sliderImage" alt="Image 1" />
            <div class="gallery-slide gallery-slide-prev" id="prevSlideBtn">
              &#10094;
            </div>
            <div class="gallery-slide gallery-slide-next" id="nextSlideBtn">
              &#10095;
            </div>
			<div id="dotContainer" class="dot-container"></div>
          </div>
        </div>

        <div class="gallery-overlay" id="galleryOverlay">
          <span class="gallery-close" id="closeGallery">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.16653 0.833548L0.833252 9.16683M9.16653 9.16678L0.833252 0.833496"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <div class="gallery-content">
            <img alt="Gallery image" class="gallery-image" id="galleryImage" />
            <span class="gallery-nav gallery-prev">&#10094;</span>
            <span class="gallery-nav gallery-next">&#10095;</span>
          </div>
          <div class="thumbnail-container" id="thumbnailContainer"></div>
        </div>

        <div class="project-desc-right">
          <div class="project-desc-top">
            <h1 class="project-desc-title" id="projectName"></h1>
            <p class="project-desc-text" id="projectLocation"></p>
            <span class="project-desc-line"></span>
          </div>

          <div class="project-inner">
            <div class="project-l">
              <div class="project-desc-price">
                <div class="project-desc-block">
                  <p class="project-desc-from">Price from</p>
                  <p class="project-desc-totalprice" id="projectPrice"></p>
                </div>
              </div>
              <div class="project-desc-details m2price">
                <div class="project-desc-block">
                  <p class="project-desc-text">Price for m²</p>
                  <p class="project-desc-title m2priceTitle" id="priceForM"></p>
                </div>
              </div>
              <div class="project-desc-details">
                <div class="project-desc-block">
                  <p class="project-desc-text">Condition</p>
                  <p class="project-desc-title">Off plan</p>
                </div>
              </div>
              <div class="project-desc-details">
                <div class="project-desc-block">
                  <p class="project-desc-text">Type</p>
                  <p class="project-desc-title" id="projectType"></p>
                </div>
              </div>
              <div class="project-desc-details">
                <div class="project-desc-block">
                  <p class="project-desc-text">Rooms</p>
                  <p class="project-desc-title" id="projectRooms"></p>
                </div>
              </div>
            </div>

            <div class="project-r">
              <div class="project-desc-details">
                <div class="project-desc-block">
                  <p class="project-desc-text">Total floors</p>
                  <p class="project-desc-title" id="projectTotalFloors"></p>
                </div>
              </div>
              <div class="project-desc-details">
                <div class="project-desc-block">
                  <p class="project-desc-text">Floor</p>
                  <p class="project-desc-title" id="projectFloor"></p>
                </div>
              </div>
              <div class="project-desc-details">
                <div class="project-desc-block">
                  <p class="project-desc-text">Size</p>
                  <p class="project-desc-title" id="projectSize"></p>
                </div>
              </div>
<!--               <div class="project-desc-details">
                <div class="project-desc-block">
                  <p class="project-desc-text">Developer</p>
                  <p class="project-desc-title" id="projectDeveloper"></p>
                </div>
              </div> -->
              <div class="project-desc-details">
                <div class="project-desc-block">
                  <p class="project-desc-text">Handover</p>
                  <p class="project-desc-title" id="projectHandover"></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="project-action-buttons">
            <button
              class="button-black"
              id="download-pdf-btn"
              title="Download project information in PDF format"
            >
              Download PDF
            </button>
            <button
              class="button-white"
              id="pricelist-btn"
              title="Request pricelist"
            >
              Pricelist
            </button>
          </div>
        </div>
        <span class="aboutAndAmenityLine"></span>
      </div>
      <section class="about">
        <div class="about-card about-card-project">
          <div class="about-card-top">
            <h3 class="about--card-title">About the project</h3>
            <hr />
          </div>
          <div class="about-card-btm">
            <p class="about-card-text" id="projectDescr"></p>
          </div>
        </div>
        <span class="aboutAndAmenityLine"></span>
<!--         <div class="about-card about-card-inner">
          <div class="about-card-inner-text">
            <h3 class="about--card-title">Amenities</h3>
          </div>
          <div class="about-card-amenities" id="projectAmenities"></div>
        </div> -->
      </section>
      <section class="units">
        <h2 class="section-title units-title">Available units</h2>

        <div class="units-block open" id="projectUnits">
          <div class="modal hidden" id="unitModal">
            <div class="modal-content">
              <div class="modal-inside">
                <div class="modal-content__title">
                  <span class="close-button" id="closeModal">&times;</span>
                  <h2 class="modal-title">Unit name</h2>
                </div>
                <div class="modal-insideContainer">
                  <div class="about-card-img">
                    <img
                      src="<?php echo get_template_directory_uri(); ?>/images/secondary/project-slide.jpg"
                      class="div1"
                      alt="plan"
                    />
                  </div>
                  <div class="price-form">
                    <div class="price-form__title">
                      <h3>Price from</h3>
                      <p>€ 149 900</p>
                    </div>
                    <div class="price-form__text">
                      <div class="price-form__info">
                        <span>Type</span>
                        <p>Apartment</p>
                      </div>
                      <div class="price-form__info">
                        <span>Size</span>
                        <p>123 m2</p>
                      </div>
                      <div class="price-form__info">
                        <span>Bedrooms</span>
                        <p>0</p>
                      </div>
                      <div class="price-form__info">
                        <span>Bathrooms</span>
                        <p>0</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="modalDescription"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
<!--       <div class="plans">
        <h2 class="section-title plans-title">Payment plans</h2>

        <div class="plans-inner" id="projectPaymentPlans"></div>
      </div> -->
    </section>
	  <section class="mapProjectWrapper">
	  	<div id="mapOffPlanById" />
		<div class="projectsMapControllers">
			<div class="zoom-btn" id="zoom-in-project">+</div>
		  <div class="zoom-btn" id="zoom-out-project">−</div>	
		</div>
	  </section>
<!-- 	  <span class="underMapText">
		  Building is within ~10km of the marker.
	  </span> -->
	  <section class="project-swiper-moreProjects">
    <div class="swiper-container">
        <div class="swiper-wrapper">       
        </div>
        <div class="swiper-custom-button-next">
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path d="M8.3335 14.1665L11.6668 9.99984L8.3335 5.83317" stroke="#313131" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>
        <div class="swiper-custom-button-prev">
		 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
			 <path d="M11.667 5.8335L8.33366 10.0002L11.667 14.1668" stroke="#313131" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		</div>
    </div>
</section>
<section id="projectInquirySection" class="project-inquiry-section"></section>
<section id="feedbackBlock"></section>
</main>
<link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />

<script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
    <script>
const path = window.location.pathname.split('/');
let language = ''; 

const allowedLanguages = ['ru', 'es']; 

if (path[1] && allowedLanguages.includes(path[1])) {
  language = path[1];
}

const areasData = [
    {
        "value": "Estepona",
        "label": "Estepona",
        "subAreas": [
            { "value": "Estepona", "label": "Estepona" },
            { "value": "Benavista", "label": "Benavista" },
            { "value": "Costalita", "label": "Costalita" },
            { "value": "Valle Romano", "label": "Valle Romano" },
            { "value": "El Padron", "label": "El Padron" },
            { "value": "Hacienda del Sol", "label": "Hacienda del Sol" },
            { "value": "Selwo", "label": "Selwo" },
            { "value": "Atalaya", "label": "Atalaya" },
            { "value": "Benamara", "label": "Benamara" },
            { "value": "El Presidente", "label": "El Presidente" },
            { "value": "Bel Air", "label": "Bel Air" },
            { "value": "Cancelada", "label": "Cancelada" },
            { "value": "New Golden Mile", "label": "New Golden Mile" },
            { "value": "Diana Park", "label": "Diana Park" }
        ]
    },
    {
        "value": "Malaga",
        "label": "Malaga",
        "subAreas": [
            { "value": "Malaga", "label": "Malaga" },
            { "value": "Málaga", "label": "Málaga" },
            { "value": "Málága", "label": "Málága" },
            { "value": "Torremar", "label": "Torremar" },
            { "value": "Alhaurín de la Torre", "label": "Alhaurín de la Torre" },
            { "value": "Torremolinos Centro", "label": "Torremolinos Centro" },
            { "value": "Lauro Golf", "label": "Lauro Golf" },
            { "value": "Málaga Este", "label": "Málaga Este" },
            { "value": "Playamar", "label": "Playamar" },
            { "value": "Málaga Centro", "label": "Málaga Centro" },
            { "value": "Málaga Centro", "label": "Málaga Centro" },
            { "value": "Almogía", "label": "Almogía" }
        ]
    },
    {
        "value": "Marbella",
        "label": "Marbella",
        "subAreas": [
            { "value": "Marbella", "label": "Marbella" },
            { "value": "Río Real", "label": "Río Real" },
            { "value": "Las Chapas", "label": "Las Chapas" },
            { "value": "Santa Clara", "label": "Santa Clara" },
            { "value": "Hacienda Las Chapas", "label": "Hacienda Las Chapas" },
            { "value": "Los Monteros", "label": "Los Monteros" },
            { "value": "Carib Playa", "label": "Carib Playa" },
            { "value": "Costabella", "label": "Costabella" },
            { "value": "Torre Real", "label": "Torre Real" },
            { "value": "Altos de los Monteros", "label": "Altos de los Monteros" },
            { "value": "Altos de los Monteroś", "label": "Altos de los Monteroś" },
            { "value": "Sierra Blanca", "label": "Sierra Blanca" },
            { "value": "Nagüeles", "label": "Nagüeles" },
            { "value": "Nueva Andalucía", "label": "Nueva Andalucía" },
            { "value": "Nueva Andalucíá", "label": "Nueva Andalucíá" },
            { "value": "Elviria", "label": "Elviria" },
            { "value": "Aloha", "label": "Aloha" },
            { "value": "Puerto de Cabopino", "label": "Puerto de Cabopino" },
            { "value": "Puerto de Cabopíno", "label": "Puerto de Cabopíno" },
            { "value": "The Golden Mile", "label": "The Golden Mile" },
            { "value": "Puerto Banús", "label": "Puerto Banús" },
            { "value": "Artola", "label": "Artola" },
            { "value": "Artóla", "label": "Artóla" },
            { "value": "Los Almendros", "label": "Los Almendros" },
            { "value": "Bahía de Marbella", "label": "Bahía de Marbella" },
            { "value": "Marbesa", "label": "Marbesa" },
            { "value": "Cabopino", "label": "Cabopino" },
            { "value": "Reserva de Marbella", "label": "Reserva de Marbella" },
            { "value": "Guadalmina Alta", "label": "Guadalmina Alta" },
            { "value": "Las Brisas", "label": "Las Brisas" },
            { "value": "El Rosario", "label": "El Rosario" },
            { "value": "San Pedro de Alcántara", "label": "San Pedro de Alcántara" },
            { "value": "Marbelá", "label": "Marbelá" },
            { "value": "Istán", "label": "Istán" }

        ]
    },
    {
        "value": "Fuengirola",
        "label": "Fuengirola",
        "subAreas": [
            { "value": "Fuengirola", "label": "Fuengirola" },
            { "value": "Carvajal", "label": "Carvajal" },
            { "value": "Los Boliches", "label": "Los Boliches" },
            { "value": "Los Pacos", "label": "Los Pacos" },
            { "value": "Torreblanca", "label": "Torreblanca" },
            { "value": "Las Lagunas", "label": "Las Lagunas" }
        ]
    },
    {
        "value": "Manilva",
        "label": "Manilva",
        "subAreas": [
            { "value": "Manilva", "label": "Manilva" },
            { "value": "Punta Chullera", "label": "Punta Chullera" },
            { "value": "La Duquesa", "label": "La Duquesa" },
        ]
    },
    {
        "value": "Casares",
        "label": "Casares",
        "subAreas": [
            { "value": "Casares", "label": "Casares" },
            { "value": "Casares Playa", "label": "Casares Playa" },
            { "value": "Casares Pueblo", "label": "Casares Pueblo" },
            { "value": "Doña Julia", "label": "Doña Julia" },
        ]
    },
    {
        "value": "Mijas",
        "label": "Mijas",
        "subAreas": [
            { "value": "Mijas", "label": "Mijas" },
            { "value": "Campo Mijas", "label": "Campo Mijas" },
            { "value": "La Cala de Mijas", "label": "La Cala de Mijas" },
            { "value": "Valtocado", "label": "Valtocado" },
            { "value": "Riviera del Sol", "label": "Riviera del Sol" },
            { "value": "Sierrezuela", "label": "Sierrezuela" },
            { "value": "Calanova Golf", "label": "Calanova Golf" },
            { "value": "Mijas Costa", "label": "Mijas Costa" },
            { "value": "La Cala Golf", "label": "La Cala Golf" },
            { "value": "La Cala Hills", "label": "La Cala Hills" },
            { "value": "Calypso", "label": "Calypso" },
            { "value": "Mijas Golf", "label": "Mijas Golf" },
            { "value": "Cerros del Aguila", "label": "Cerros del Aguila" },
            { "value": "Calahonda", "label": "Calahonda" },
            { "value": "El Chaparral", "label": "El Chaparral" },
            { "value": "Miraflores", "label": "Miraflores" },
            { "value": "El Faro", "label": "El Faro" },
            { "value": "La Cala", "label": "La Cala" },
            { "value": "El Coto", "label": "El Coto" },
            { "value": "Torrenueva", "label": "Torrenueva" }
        ]
    },
    {
        "value": "Benahavis",
        "label": "Benahavis",
        "subAreas": [
            { "value": "Benahavis", "label": "Benahavis" },
            { "value": "Benahavís", "label": "Benahavís" },
            { "value": "La Heredia", "label": "La Heredia" },
            { "value": "Los Arqueros", "label": "Los Arqueros" },
            { "value": "La Zagaleta", "label": "La Zagaleta" },
            { "value": "La Zagaletá", "label": "La Zagaletá" },
            { "value": "El Madroñal", "label": "El Madroñal" },
            { "value": "El Madroñál", "label": "El Madroñál" },
            { "value": "Los Flamingos", "label": "Los Flamingos" },
            { "value": "Monte Halcones", "label": "Monte Halcones" },
            { "value": "El Paraiso", "label": "El Paraiso" },
            { "value": "La Quinta", "label": "La Quinta" },
            { "value": "La Campana", "label": "La Campana" }
        ]
    },
    {
        "value": "Alhaurín el Grande",
        "label": "Alhaurín el Grande",
        "subAreas": [
            { "value": "Alhaurín", "label": "Alhaurín" },
            { "value": "Alhaurin Golf", "label": "Alhaurin Golf" },
        ]
    },
    {
        "value": "Benalmadena",
        "label": "Benalmadena",
        "subAreas": [
            { "value": "Benalmadena", "label": "Benalmadena" },
            { "value": "Benalmadena Pueblo", "label": "Benalmadena Pueblo" },
            { "value": "La Capellania", "label": "La Capellania" },
            { "value": "Arroyo de la Miel", "label": "Arroyo de la Miel" },
            { "value": "Torremuelle", "label": "Torremuelle" },
            { "value": "Torremuellé", "label": "Torremuellé" },
            { "value": "Benalmadena Costa", "label": "Benalmadena Costa" },
            { "value": "Torrequebrada", "label": "Torrequebrada" },
            { "value": "Torrequebráda", "label": "Torrequebráda" }
        ]
    },
    {
        "value": "Torremolinos",
        "label": "Torremolinos",
        "subAreas": [
            { "value": "Torremolinos", "label": "Torremolinos" },
            { "value": "La Carihuela", "label": "La Carihuela" },
            { "value": "El Pinillo", "label": "El Pinillo" },
            { "value": "Montemar", "label": "Montemar" },
            { "value": "Los Alamos", "label": "Los Alamos" },
            { "value": "La Colina", "label": "La Colina" }
        ]
    },
    {
        "value": "San Pedro de Alcantara",
        "label": "San Pedro de Alcantara",
        "subAreas": [
            { "value": "San Pedro de Alcantara", "label": "San Pedro de Alcantara" },
            { "value": "Guadalmina Baja", "label": "Guadalmina Baja" },
            { "value": "Cortijo Blanco", "label": "Cortijo Blanco" },
        ]
    },
    {
        "value": "Other",
        "label": "Other",
        "subAreas": [
            { "value": "Cártama", "label": "Cártama" },
            { "value": "Benaoján", "label": "Benaoján" },
            { "value": "Antequera", "label": "Antequera" },
            { "value": "Ojén", "label": "Ojén" },
            { "value": "Fuente de Piedra", "label": "Fuente de Piedra" },
            { "value": "Júzcar", "label": "Júzcar" },
            { "value": "Genalguacil", "label": "Genalguacil" },
            { "value": "Puerto de la Torre", "label": "Puerto de la Torre" },
            { "value": "Arriate", "label": "Arriate" },
            { "value": "El Burgo", "label": "El Burgo" },
            { "value": "Gaucín", "label": "Gaucín" },
            { "value": "La Mairena", "label": "La Mairena" },
            { "value": "Archidona", "label": "Archidona" },
            { "value": "Monda", "label": "Monda" },
            { "value": "El Chorro", "label": "El Chorro" },
            { "value": "Carratraca", "label": "Carratraca" },
            { "value": "Ronda", "label": "Ronda" },
            { "value": "Villanueva De La Concepcion", "label": "Villanueva De La Concepcion" },
            { "value": "Mollina", "label": "Mollina" },
            { "value": "Almogia", "label": "Almogia" },
            { "value": "Villanueva del Rosario", "label": "Villanueva del Rosario" },
            { "value": "Cuevas del Becerro", "label": "Cuevas del Becerro" },
            { "value": "Zalea", "label": "Zalea" },
            { "value": "Ardales", "label": "Ardales" },
            { "value": "Tolox", "label": "Tolox" },
            { "value": "Cortes de la Frontera", "label": "Cortes de la Frontera" },
            { "value": "Campillos", "label": "Campillos" },
            { "value": "Algatocin", "label": "Algatocin" },
            { "value": "Benarrabá", "label": "Benarrabá" },
            { "value": "Valle de Abdalajis", "label": "Valle de Abdalajis" },
            { "value": "Montejaque", "label": "Montejaque" },
            { "value": "Alpandeire", "label": "Alpandeire" },
            { "value": "San Luis de Sabinillas", "label": "San Luis de Sabinillas" },
            { "value": "Guaro", "label": "Guaro" },
            { "value": "Alora", "label": "Alora" },
            { "value": "Coín", "label": "Coín" },
            { "value": "Pizarra", "label": "Pizarra" },
            { "value": "Benalauría", "label": "Benalauría" },
            { "value": "Yunquera", "label": "Yunquera" },
            { "value": "Casabermeja", "label": "Casabermeja" },
            { "value": "Estacion de Cartama", "label": "Estacion de Cartama" },
            { "value": "Jubrique", "label": "Jubrique" },
            { "value": "Alozaina", "label": "Alozaina" },
            { "value": "Alozáina", "label": "Alozáina" },
            { "value": "Cañete la Real", "label": "Cañete la Real" },
            { "value": "Estación de Gaucin", "label": "Estación de Gaucin" },
            { "value": "Villafranco del Guadalhorce", "label": "Villafranco del Guadalhorce" },
            { "value": "Casarabonela", "label": "Casarabonela" },
            { "value": "Jimera de Líbar", "label": "Jimera de Líbar" },
            { "value": "Sevilla", "label": "Sevilla" },
            { "value": "Istan", "label": "Istan" },
            { "value": "Cortéjoo Blanco", "label": "Cortéjoo Blanco" },
            { "value": "El Piniíllo", "label": "El Piniíllo" },
        ]
    }
];


	
    const Header = () => {
        const location = window.location;

        const filterMobileBurgerMenu = document.getElementById(
            "filterMobileBurgerMenu"
        );

        const headerId = document.getElementById("header");

        const header = createElement("header");
        header.className = "header";

        header.className = "header";

        const applyHashStyles = () => {
            if (location.hash === "#main") {
                header.style.borderBottom = "none";
            } else {
                header.style.borderBottom = "";
            }
        };

        applyHashStyles();

        window.addEventListener("hashchange", () => {
            applyHashStyles();
        });

        const logoDiv = createElement("a");
        logoDiv.className = "logo";
         logoDiv.href = `${language && "/" + language}/`;
        header.appendChild(logoDiv);

        const nav = createElement("nav");
        nav.className = "nav";
        header.appendChild(nav);

        const navList = createElement("ul");
        navList.className = "navList";
        nav.appendChild(navList);

        const navBtm = createElement("nav");
        navBtm.className = "showNavBottom";
        header.appendChild(navBtm);

        const navListBtm = createElement("ul");
        navListBtm.className = "navListBtm";
        navBtm.appendChild(navListBtm);

        const socialDiv = createElement("div");
        socialDiv.className = "social";
        header.appendChild(socialDiv);

        const fixedMenue = document.createElement("div");
        const fixedBtn = document.createElement("button");
        fixedBtn.className = "button menuButtonWhite";
        fixedBtn.id = "fixedMenue";
        fixedMenue.className = "fixedMenue";
        fixedMenue.innerHTML = `
  
  <a class="button mapButtonWhite" href="${language && "/" + language}/map"></a>
  <button class="button callUsButtonWhite" onclick="window.location.href='tel:+346951133336';"></button>
<button class="button filterButtonWhite" id="headerOpenFilterBtn"></button>
`;
        fixedMenue.prepend(fixedBtn);
        header.appendChild(fixedMenue);

        const adaptiveFiltersContainer = document.createElement("div");
        adaptiveFiltersContainer.className = "adapriveFilters__bg";
        adaptiveFiltersContainer.id = "headerAdaptiveFilters";
        adaptiveFiltersContainer.innerHTML = `
        <div class="adapriveFilters properties">
            <div class="adapriveFilters__header">
                <h2 class="adapriveFilters__header-title">Filter</h2>
                <button class="adapriveFilters__header-btnCloseHeader" id="btnCloseHeader">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <path
                            d="M14.1667 5.83355L5.83337 14.1668M14.1667 14.1668L5.83337 5.8335"
                            stroke="#313131"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </button>
            </div>
            <div class="adapriveFilters__main">
                <div>
                    <div class="adapriveFilters__main-buttons">
                        <div class="adapriveFilters__main-btn active" id="offPlanAdaptiveBtnHeader">
                            Off plan
                        </div>
                        <div class="adapriveFilters__main-btn" id="secondaryAdaptiveBtnHeader">
                            Secondary
                        </div>
                        <div class="adapriveFilters__main-btn" id="rentAdaptiveBtnHeader">
                            Rent
                        </div>
                    </div>
                    <div class="adapriveFilters__main-dropdowns">
                        <div>
                            <div
                                id="headerLocationFilterMobile"
                                class="filterPropertiesWrapper__dropDown"
                            >
                                <span
                                    class="filterPropertiesWrapper__dropDown_label"
                                    >Locations</span
                                >
                                <div
                                    class="filterPropertiesWrapper__dropDown_header mobile"
                                >
                                    Locations
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M7 10L12 14L17 10"
                                            stroke="#717171"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div
                                    class="filterPropertiesWrapper__dropDown_body big"
                                >
                                    <div
                                        class="filterPropertiesWrapper__dropDown_list"
                                    >
                                        <div
                                            class="filterPropertiesWrapper__dropDownLocationsWrapper"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="propertiesSelectedFilter__list"
                                id="selectValueHeaderFilterLocation"
                            ></div>
                        </div>
                        <div>
                            <div
                                id="headerBedroomsFilterMobile"
                                class="filterPropertiesWrapper__dropDown"
                            >
                                <span
                                    class="filterPropertiesWrapper__dropDown_label"
                                    >Bedrooms</span
                                >
                                <div
                                    class="filterPropertiesWrapper__dropDown_header mobile"
                                >
                                    Bedrooms
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M7 10L12 14L17 10"
                                            stroke="#717171"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div
                                    class="filterPropertiesWrapper__dropDown_body big"
                                >
                                    <div
                                        class="filterPropertiesWrapper__dropDown_list"
                                    ></div>
                                </div>
                                <div
                                    class="propertiesSelectedFilter__list"
                                    id="selectValueHeaderBedrooms"
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div
                                id="headerPriceFilterMobile"
                                class="filterPropertiesWrapper__dropDown"
                            >
                                <span
                                    class="filterPropertiesWrapper__dropDown_label"
                                    >Price</span
                                >
                                <div
                                    class="filterPropertiesWrapper__dropDown_header mobile"
                                >
                                    Price
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M7 10L12 14L17 10"
                                            stroke="#717171"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div
                                    class="filterPropertiesWrapper__dropDown_body big"
                                >
                                    <div
                                        class="filterPropertiesWrapper__dropDown_list"
                                    ></div>
                                </div>
                            </div>
                            <div
                                class="propertiesSelectedFilter__list"
                                id="selectValueHeaderPrice"
                            ></div>
                        </div>
                        <div>
                            <div
                                id="headerSizeFilterMobile"
                                class="filterPropertiesWrapper__dropDown"
                            >
                                <span
                                    class="filterPropertiesWrapper__dropDown_label"
                                    >Size</span
                                >
                                <div
                                    class="filterPropertiesWrapper__dropDown_header mobile"
                                >
                                    Size
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M7 10L12 14L17 10"
                                            stroke="#717171"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div
                                    class="filterPropertiesWrapper__dropDown_body big"
                                >
                                    <div
                                        class="filterPropertiesWrapper__dropDown_list"
                                    ></div>
                                </div>
                            </div>
                            <div
                                class="propertiesSelectedFilter__list"
                                id="selectValueHeaderSize"
                            ></div>
                        </div>
                        <div>
                            <div
                                id="headerHandoverFilterMobile"
                                class="filterPropertiesWrapper__dropDown"
                            >
                                <span
                                    class="filterPropertiesWrapper__dropDown_label"
                                    >Handover</span
                                >
                                <div
                                    class="filterPropertiesWrapper__dropDown_header mobile"
                                >
                                    Handover
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M7 10L12 14L17 10"
                                            stroke="#717171"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div
                                    class="filterPropertiesWrapper__dropDown_body big"
                                >
                                    <div
                                        class="filterPropertiesWrapper__dropDown_list"
                                    ></div>
                                </div>
                            </div>
                            <div
                                class="propertiesSelectedFilter__list"
                                id="selectValueHeaderHandover"
                            ></div>
                        </div>

                    </div>
                </div>
                <div class="adapriveFilters__main-buttonsBottom">
                    <button class="adapriveFilters__main-btnClear" id="clearBtnHeaderFilterAdaptive">
                        Clear
                    </button>
                    <button class="adapriveFilters__main-btnConfirm" id="redirectFilterHeader">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    `;
        header.appendChild(adaptiveFiltersContainer);

        // Функция для управления адаптивным меню (открытие/закрытие)
        const adaptiveMenuHandler = () => {
            // Убедимся, что элементы добавлены в DOM
            const openFilterButton = header.querySelector("#headerOpenFilterBtn");
            const closeButton =
                adaptiveFiltersContainer.querySelector("#btnCloseHeader");

            if (!openFilterButton || !adaptiveFiltersContainer || !closeButton) {
                console.warn(
                    "Some elements are missing, please check the HTML structure."
                );
                return;
            }

            // Открытие меню
            const openAdaptiveMenu = () => {
                if (window.innerWidth < 767) {
                    adaptiveFiltersContainer.classList.add("active");
                    document.body.style.overflow = "hidden";
                }
            };

            // Закрытие меню
            const closeAdaptiveMenu = () => {
                adaptiveFiltersContainer.classList.remove("active");
                document.body.style.overflow = "";
            };

            // Добавление обработчиков событий
            openFilterButton.addEventListener("click", openAdaptiveMenu);
            closeButton.addEventListener("click", closeAdaptiveMenu);

            // Закрытие при клике вне области меню
            adaptiveFiltersContainer.addEventListener("click", (e) => {
                if (e.target === adaptiveFiltersContainer) {
                    closeAdaptiveMenu();
                }
            });

            // Возвращаем функцию закрытия для использования в других частях кода
            return {
                closeAdaptiveMenu
            };
        };
        const {
            closeAdaptiveMenu
        } = adaptiveMenuHandler();
        setTimeout(adaptiveMenuHandler, 0);

        const headerMapImport = document.getElementById("headerMapImport");

        function updateHeaderMap() {
                const isMobile = window.innerWidth < 767;
                if (isMobile && headerMapImport) {
                    headerMapImport.style.height = "0";
                    headerMapImport.style.overflow = "hidden";
                }
                if (!isMobile && headerMapImport) {
                    headerMapImport.style.height = "113px";
                    headerMapImport.style.overflow = "visible";
                }
            }

            function updateFixedMenueVisibility() {
                const isMobile = window.innerWidth < 767;
                if (isMobile && window.scrollY > 100) {
                    fixedMenue.style.opacity = 1;
                    fixedMenue.style.visibility = "visible";
                } else {
                    fixedMenue.style.opacity = 0;
                    fixedMenue.style.visibility = "hidden";
                }
            }

            const headerSetupFilterButtons = () => {
                const offPlanButton = document.getElementById("offPlanAdaptiveBtnHeader");
                const secondaryButton = document.getElementById("secondaryAdaptiveBtnHeader");

                if (!offPlanButton || !secondaryButton) {
                    console.warn("Filter buttons are missing, please check the HTML structure.");
                    return;
                }

                const updateVisibleFilter = (selectedValue) => {
                    const currentUrl = window.location.pathname;
                    const urlParams = new URLSearchParams(window.location.search);
                    urlParams.set("visible", selectedValue);

                    window.history.replaceState({}, "", `${currentUrl}?${urlParams.toString()}`);

                    // Update button styles
                    if (selectedValue === "Off plan") {
                        offPlanButton.classList.add("active");
                        secondaryButton.classList.remove("active");
                    } else if (selectedValue === "Secondary") {
                        secondaryButton.classList.add("active");
                        offPlanButton.classList.remove("active");
                    }
                };

                // Добавляем обработчики событий
                offPlanButton.addEventListener("click", () => updateVisibleFilter("Off plan"));
                secondaryButton.addEventListener("click", () => updateVisibleFilter("Secondary"));

                // Устанавливаем начальное состояние кнопок
                const urlParams = new URLSearchParams(window.location.search);
                const initialValue = urlParams.get("visible");

                offPlanButton.classList.remove("active");
                secondaryButton.classList.remove("active");

                // Устанавливаем "Off plan" по умолчанию, если параметр "visible" не указан
                if (initialValue === "Off plan" || !initialValue) {
                    offPlanButton.classList.add("active");
                } else if (initialValue === "Secondary") {
                    secondaryButton.classList.add("active");
                }
            };
            setTimeout(headerSetupFilterButtons, 0);

            function headerDropDownBeddroomsMobile() {
                const dropdownContainer = document.getElementById(
                    "headerBedroomsFilterMobile"
                );

                if (dropdownContainer) {
                    const dropdownHeader = dropdownContainer.querySelector(
                        ".filterPropertiesWrapper__dropDown_header"
                    );
                    const dropdownBody = dropdownContainer.querySelector(
                        ".filterPropertiesWrapper__dropDown_body"
                    );
                    const dropdownList = dropdownBody.querySelector(
                        ".filterPropertiesWrapper__dropDown_list"
                    );
                    let bedroomsQuery = [];

                    for (let i = 1; i <= 8; i++) {
                        const item = document.createElement("div");
                        item.className = "filterPropertiesWrapper__dropDown_item";
                        item.innerText = `${i} Bedroom`;

                        const checkBox = document.createElement("div");
                        checkBox.className = "filterPropertiesWrapper__customCheckBox";

                        checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;

                        item.appendChild(checkBox);
                        dropdownList.appendChild(item);

                        item.addEventListener("click", function (e) {
                            e.stopPropagation();

                            if (bedroomsQuery.includes(i)) {
                                bedroomsQuery = bedroomsQuery.filter(
                                    (bedroom) => bedroom !== i
                                );
                                checkBox.classList.remove("active");
                            } else {
                                bedroomsQuery.push(i);
                                checkBox.classList.add("active");
                            }

                            updateQueryParameter(
                                "bedrooms",
                                bedroomsQuery.length > 0
                                    ? bedroomsQuery.join(",")
                                    : null
                            );
                        });
                    }

                    function toggleMenu() {
                        dropdownBody.classList.toggle("active");
                        dropdownHeader.classList.toggle("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        if (dropdownBody.classList.contains("active")) {
                            svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                        } else {
                            svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                        }
                    }

                    dropdownHeader.addEventListener("click", function (e) {
                        e.stopPropagation();

                        if (dropdownBody.classList.contains("active")) {
                            closeMenu(e);
                        } else {
                            toggleMenu();
                        }
                    });

                    function closeMenu() {
                        dropdownBody.classList.remove("active");
                        dropdownHeader.classList.remove("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }

                    document.addEventListener("click", function (event) {
                        const isClickInside = dropdownContainer.contains(event.target);

                        if (!isClickInside) {
                            dropdownBody.classList.remove("active");

                            const svgIcon = dropdownHeader.querySelector("svg path");
                            svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                        }
                    });

                    function syncCheckboxesWithQuery() {
                        const params = new URLSearchParams(window.location.search);
                        const bedroomsParam = params.get("bedrooms");

                        if (bedroomsParam) {
                            bedroomsQuery = bedroomsParam.split(",").map(Number);
                        } else {
                            bedroomsQuery = [];
                        }

                        dropdownList
                            .querySelectorAll(".filterPropertiesWrapper__dropDown_item")
                            .forEach((item, index) => {
                                const checkBox = item.querySelector(
                                    ".filterPropertiesWrapper__customCheckBox"
                                );
                                if (bedroomsQuery.includes(index + 1)) {
                                    checkBox.classList.add("active");
                                } else {
                                    checkBox.classList.remove("active");
                                }
                            });
                    }

                    syncCheckboxesWithQuery();

                    window.addEventListener("popstate", syncCheckboxesWithQuery);
                }

                function updateQueryParameter(key, value) {
                    const queryString = window.location.search.substring(1);
                    const params = new URLSearchParams(queryString);

                    if (value) {
                        params.set(key, value);
                    } else {
                        params.delete(key);
                    }

                    const newQueryString = `?${params.toString()}`;
                    history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
                }
            }
            setTimeout(headerDropDownBeddroomsMobile, 0);

            function headerDropDownPriceMobile() {
                const dropdownContainer = document.querySelector("#headerPriceFilterMobile");
                const dropdownHeader = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDown_header"
                );
                const dropdownBody = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDown_body"
                );
                const dropdownList = dropdownBody.querySelector(
                    ".filterPropertiesWrapper__dropDown_list"
                );

                let priceMin = null;
                let priceMax = null;

                const priceValues = [
					'€ 150.000',
					'€ 200.000',
					'€ 250.000',
					'€ 300.000',
					'€ 350.000',
					'€ 400.000',
					'€ 450.000',
					'€ 500.000',
					'€ 550.000',
					'€ 600.000',
					'€ 650.000',
					'€ 700.000',
					'€ 750.000',
					'€ 800.000',
					'€ 850.000',
					'€ 900.000',
					'€ 950.000',
					'€ 1.000.000',
					'€ 1.250.000',
					'€ 1.500.000',
					'€ 1.750.000',
					'€ 2.000.000',
					'€ 2.500.000',
					'€ 3.000.000',
					'€ 3.500.000',
					'€ 4.000.000',
					'€ 5.000.000',
					'€ 10.000.000',
					'€ 15.000.000',
					'€ 20.000.000',
                ];

                function renderPriceOptions() {
                    priceValues.forEach((price) => {
                        const priceItem = document.createElement("div");
                        priceItem.className = "filterPropertiesWrapper__dropDown_item";
                        priceItem.textContent = price;

                        const checkBox = document.createElement("div");
                        checkBox.className = "filterPropertiesWrapper__customCheckBox";
                        checkBox.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
            </svg>
        `;
                        priceItem.appendChild(checkBox);
                        dropdownList.appendChild(priceItem);

                        priceItem.addEventListener("click", function (e) {
                            e.stopPropagation();
                            handlePriceSelection(priceItem.textContent.trim());
                        });
                    });
                }

                renderPriceOptions();

                function handlePriceSelection(priceText) {
                    const priceValue = parsePriceToNumber(priceText);

                    if (priceMin === null) {
                        priceMin = priceValue;
                        priceMax = null;
                    } else if (priceValue > priceMin && priceMax === null) {
                        priceMax = priceValue;
                    } else if (priceValue === priceMin) {
                        priceMin = null;
                        priceMax = null;
                    } else if (priceValue === priceMax) {
                        priceMax = null;
                    } else if (priceValue < priceMin) {
                        priceMin = priceValue;
                        priceMax = null;
                    } else if (priceValue > priceMax) {
                        priceMax = priceValue;
                    }

                    updatePricesStyles();

                    updateQueryParameter("minPrice", priceMin !== null ? priceMin.toString() : null);
                    updateQueryParameter("maxPrice", priceMax !== null ? priceMax.toString() : null);
                }

function updatePricesStyles() {
    const priceElements = dropdownList.querySelectorAll(
        ".filterPropertiesWrapper__dropDown_item"
    );

    priceElements.forEach((item) => {
        const priceValue = parsePriceToNumber(item.textContent.trim());
        const checkBox = item.querySelector(
            ".filterPropertiesWrapper__customCheckBox"
        );

        checkBox.classList.remove("active");
        item.style.opacity = "1"; // Устанавливаем начальное значение opacity для всех элементов

        if (priceMin !== null && priceValue === priceMin) {
            checkBox.classList.add("active");
        } else if (priceMax !== null && priceValue === priceMax) {
            checkBox.classList.add("active");
        } else if (
            priceMin !== null && priceMax !== null && 
            priceValue > priceMin && priceValue < priceMax
        ) {
            // Активируем чекбоксы между min и max
            checkBox.classList.add("active");
        } else if (
            (priceMin !== null && priceValue < priceMin) ||
            (priceMax !== null && priceValue > priceMax)
        ) {
            // Если значение меньше минимального или больше максимального, делаем его прозрачным
            item.style.opacity = "0.5";
        }
    });
}

                function parsePriceToNumber(priceText) {
                    return parseInt(priceText.replace(/[€,.+]/g, ""), 10);
                }

                function updateQueryParameter(key, value) {
                    const queryString = window.location.search.substring(1);
                    const params = new URLSearchParams(queryString);

                    if (value) {
                        params.set(key, value);
                    } else {
                        params.delete(key);
                    }

                    const newQueryString = `?${params.toString()}`;
                    history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
                }

                function syncPricesWithQuery() {
                    const urlParams = new URLSearchParams(window.location.search);

                    priceMin = urlParams.get("minPrice")
                        ? parseInt(urlParams.get("minPrice"), 10)
                        : null;
                    priceMax = urlParams.get("maxPrice")
                        ? parseInt(urlParams.get("maxPrice"), 10)
                        : null;

                    updatePricesStyles();
                }

                syncPricesWithQuery();

                window.addEventListener("popstate", syncPricesWithQuery);

                if (dropdownHeader && dropdownBody) {
                    function toggleMenu() {
                        dropdownBody.classList.toggle("active");
                        dropdownHeader.classList.toggle("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        if (dropdownBody.classList.contains("active")) {
                            svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                        } else {
                            svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                        }
                    }

                    function closeMenu() {
                        dropdownBody.classList.remove("active");
                        dropdownHeader.classList.remove("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }

                    dropdownHeader.addEventListener("click", function (e) {
                        e.stopPropagation();

                        if (dropdownBody.classList.contains("active")) {
                            closeMenu();
                        } else {
                            toggleMenu();
                        }
                    });

                    document.addEventListener("click", function (event) {
                        if (
                            !dropdownContainer.contains(event.target) &&
                            !dropdownHeader.contains(event.target)
                        ) {
                            closeMenu();
                        }
                    });
                } else {
                    console.warn("Menu elements (dropdownHeader or dropdownBody) not found!");
                }
            }
            setTimeout(headerDropDownPriceMobile, 0);

            function headerDropDownSizeMobile() {
                const dropdownContainer = document.querySelector("#headerSizeFilterMobile");
                const dropdownHeader = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDown_header"
                );
                const dropdownBody = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDown_body"
                );
                const dropdownList = dropdownBody.querySelector(
                    ".filterPropertiesWrapper__dropDown_list"
                );

                let sizeMin = null;
                let sizeMax = null;

                const sizeValues = [
					'20 sq.m',
					'30 sq.m',
					'40 sq.m',
					'50 sq.m',
					'60 sq.m',
					'70 sq.m',
					'80 sq.m',
					'90 sq.m',
					'100 sq.m',
					'120 sq.m',
					'140 sq.m',
					'160 sq.m',
					'180 sq.m',
					'200 sq.m',
					'220 sq.m',
					'250 sq.m',
					'270 sq.m',
					'300 sq.m',
					'350 sq.m',
					'400 sq.m',
					'450 sq.m',
					'500 sq.m',
					'550 sq.m',
					'600 sq.m',
					'700 sq.m',
					'800 sq.m',
					'900 sq.m',
					'1.000 sq.m',
					'1.500 sq.m',
					'2.000 sq.m',
					'3.000 sq.m',
                ];

                function renderSizeOptions() {
                    sizeValues.forEach((size) => {
                        const sizeItem = document.createElement("div");
                        sizeItem.className = "filterPropertiesWrapper__dropDown_item";
                        sizeItem.textContent = size;

                        const checkBox = document.createElement("div");
                        checkBox.className = "filterPropertiesWrapper__customCheckBox";
                        checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;
                        sizeItem.appendChild(checkBox);
                        dropdownList.appendChild(sizeItem);

                        sizeItem.addEventListener("click", function (e) {
                            e.stopPropagation();
                            handleSizeSelection(sizeItem.textContent.trim());
                        });
                    });
                }

                renderSizeOptions();

                function handleSizeSelection(sizeText) {
                    const sizeValue = parseSizeToNumber(sizeText);

                    if (sizeMin === null) {
                        sizeMin = sizeValue;
                        sizeMax = null;
                    } else if (sizeValue > sizeMin && sizeMax === null) {
                        sizeMax = sizeValue;
                    } else if (sizeValue === sizeMin) {
                        sizeMin = null;
                        sizeMax = null;
                    } else if (sizeValue === sizeMax) {
                        sizeMax = null;
                    } else if (sizeValue < sizeMin) {
                        sizeMin = sizeValue;
                        sizeMax = null;
                    } else if (sizeValue > sizeMax) {
                        sizeMax = sizeValue;
                    }

                    updateSizesStyles();

                    updateQueryParameter("minSize", sizeMin !== null ? sizeMin.toString() : null);
                    updateQueryParameter("maxSize", sizeMax !== null ? sizeMax.toString() : null);
                }

function updateSizesStyles() {
    const sizeElements = dropdownList.querySelectorAll(
        ".filterPropertiesWrapper__dropDown_item"
    );

    sizeElements.forEach((item) => {
        const sizeValue = parseSizeToNumber(item.textContent.trim());
        const checkBox = item.querySelector(
            ".filterPropertiesWrapper__customCheckBox"
        );

        checkBox.classList.remove("active");
        item.style.opacity = "1"; // Устанавливаем начальное значение opacity для всех элементов

        if (sizeMin !== null && sizeValue === sizeMin) {
            checkBox.classList.add("active");
        } else if (sizeMax !== null && sizeValue === sizeMax) {
            checkBox.classList.add("active");
        } else if (
            sizeMin !== null && sizeMax !== null && 
            sizeValue > sizeMin && sizeValue < sizeMax
        ) {
            // Активируем чекбоксы между sizeMin и sizeMax
            checkBox.classList.add("active");
        } else if (
            (sizeMin !== null && sizeValue < sizeMin) ||
            (sizeMax !== null && sizeValue > sizeMax)
        ) {
            // Если значение меньше минимального или больше максимального, делаем его прозрачным
            item.style.opacity = "0.5";
        }
    });
}

                function parseSizeToNumber(sizeText) {
                    return parseInt(
                        sizeText.replace(/[m².,+]/g, "").replace(/\./g, ""),
                        10
                    );
                }

                function updateQueryParameter(key, value) {
                    const queryString = window.location.search.substring(1);
                    const params = new URLSearchParams(queryString);

                    if (value) {
                        params.set(key, value);
                    } else {
                        params.delete(key);
                    }

                    const newQueryString = `?${params.toString()}`;
                    history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
                }

                function syncSizesWithQuery() {
                    const urlParams = new URLSearchParams(window.location.search);

                    sizeMin = urlParams.get("minSize")
                        ? parseInt(urlParams.get("minSize"), 10)
                        : null;
                    sizeMax = urlParams.get("maxSize")
                        ? parseInt(urlParams.get("maxSize"), 10)
                        : null;

                    updateSizesStyles();
                }

                syncSizesWithQuery();

                window.addEventListener("popstate", syncSizesWithQuery);

                if (dropdownHeader && dropdownBody) {
                    function toggleMenu() {
                        dropdownBody.classList.toggle("active");
                        dropdownHeader.classList.toggle("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        if (dropdownBody.classList.contains("active")) {
                            svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                        } else {
                            svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                        }
                    }

                    function closeMenu() {
                        dropdownBody.classList.remove("active");
                        dropdownHeader.classList.remove("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }

                    dropdownHeader.addEventListener("click", function (e) {
                        e.stopPropagation();

                        if (dropdownBody.classList.contains("active")) {
                            closeMenu();
                        } else {
                            toggleMenu();
                        }
                    });

                    document.addEventListener("click", function (event) {
                        if (
                            !dropdownContainer.contains(event.target) &&
                            !dropdownHeader.contains(event.target)
                        ) {
                            closeMenu();
                        }
                    });
                } else {
                    console.warn("Menu elements (dropdownHeader or dropdownBody) not found!");
                }
            }
            setTimeout(headerDropDownSizeMobile, 0);

            function headerDropDownHandoverMobile() {
                const dropdownContainer = document.querySelector("#headerHandoverFilterMobile");
                const dropdownHeader = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDown_header"
                );
                const dropdownBody = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDown_body"
                );
                const dropdownList = dropdownBody.querySelector(
                    ".filterPropertiesWrapper__dropDown_list"
                );

                let handoverMin = null;
                let handoverMax = null;

const handoverValues = [
"Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024",
"Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025",
"Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"
];

                function renderHandoverOptions() {
                    handoverValues.forEach((handover) => {
                        const handoverItem = document.createElement("div");
                        handoverItem.className = "filterPropertiesWrapper__dropDown_item";
                        handoverItem.textContent = handover;

                        const checkBox = document.createElement("div");
                        checkBox.className = "filterPropertiesWrapper__customCheckBox";
                        checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;
                        handoverItem.appendChild(checkBox);
                        dropdownList.appendChild(handoverItem);

                        handoverItem.addEventListener("click", function (e) {
                            e.stopPropagation();
                            handleHandoverSelection(handoverItem.textContent.trim());
                        });
                    });
                }

                renderHandoverOptions();

                function handleHandoverSelection(handoverText) {
                    const dateValue = handoverText;

                    if (handoverMin === null) {
                        handoverMin = dateValue;
                        handoverMax = null;
                    } else if (compareDates(dateValue, handoverMin) > 0 && handoverMax === null) {
                        handoverMax = dateValue;
                    } else if (dateValue === handoverMin) {
                        handoverMin = null;
                        handoverMax = null;
                    } else if (dateValue === handoverMax) {
                        handoverMax = null;
                    } else if (compareDates(dateValue, handoverMin) < 0) {
                        handoverMin = dateValue;
                        handoverMax = null;
                    } else if (compareDates(dateValue, handoverMax) > 0) {
                        handoverMax = dateValue;
                    }

                    updateHandoversStyles();

                    updateQueryParameter(
                        "handoverMin",
                        handoverMin ? convertToISODate(handoverMin) : null
                    );
                    updateQueryParameter(
                        "handoverMax",
                        handoverMax ? convertToISODate(handoverMax) : null
                    );
                }

function updateHandoversStyles() {
    const handoverElements = dropdownList.querySelectorAll(
        ".filterPropertiesWrapper__dropDown_item"
    );

    handoverElements.forEach((item) => {
        const dateValue = item.textContent.trim();
        const checkBox = item.querySelector(
            ".filterPropertiesWrapper__customCheckBox"
        );

        checkBox.classList.remove("active");
        item.style.opacity = "1"; // Устанавливаем начальное значение opacity для всех элементов

        if (handoverMin !== null && dateValue === handoverMin) {
            checkBox.classList.add("active");
        } else if (handoverMax !== null && dateValue === handoverMax) {
            checkBox.classList.add("active");
        } else if (
            handoverMin !== null && handoverMax !== null && 
            compareDates(dateValue, handoverMin) >= 0 && compareDates(dateValue, handoverMax) <= 0
        ) {
            // Активируем чекбоксы для значений между handoverMin и handoverMax
            checkBox.classList.add("active");
        } else if (
            (handoverMin !== null && compareDates(dateValue, handoverMin) < 0) ||
            (handoverMax !== null && compareDates(dateValue, handoverMax) > 0)
        ) {
            // Если значение меньше минимального или больше максимального, делаем его прозрачным
            item.style.opacity = "0.5";
        }
    });
}

                function convertToISODate(handoverText) {
                    const [quarter, year] = handoverText.split(" ");
                    const month = {
                        Q1: "01",
                        Q2: "04",
                        Q3: "07",
                        Q4: "10",
                    }[quarter];
                    return `${year}-${month}-01`;
                }

                function compareDates(dateText1, dateText2) {
                    const [quarter1, year1] = dateText1.split(" ");
                    const [quarter2, year2] = dateText2.split(" ");
                    const month1 = { Q1: "01", Q2: "04", Q3: "07", Q4: "10" }[quarter1];
                    const month2 = { Q1: "01", Q2: "04", Q3: "07", Q4: "10" }[quarter2];

                    const date1 = new Date(`${year1}-${month1}-01`);
                    const date2 = new Date(`${year2}-${month2}-01`);

                    if (date1 < date2) return -1;
                    if (date1 > date2) return 1;
                    return 0;
                }

                function updateQueryParameter(key, value) {
                    const queryString = window.location.search.substring(1);
                    const params = new URLSearchParams(queryString);

                    if (value) {
                        params.set(key, value);
                    } else {
                        params.delete(key);
                    }

                    const newQueryString = `?${params.toString()}`;
                    history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
                }

                function syncHandoversWithQuery() {
                    const urlParams = new URLSearchParams(window.location.search);

                    handoverMin = urlParams.get("handoverMin")
                        ? convertFromISODate(urlParams.get("handoverMin"))
                        : null;
                    handoverMax = urlParams.get("handoverMax")
                        ? convertFromISODate(urlParams.get("handoverMax"))
                        : null;

                    updateHandoversStyles();
                }

                function convertFromISODate(isoDate) {
                    const [year, month] = isoDate.split("-");
                    const quarter = {
                        "01": "Q1",
                        "04": "Q2",
                        "07": "Q3",
                        10: "Q4",
                    }[month];
                    return `${quarter} ${year}`;
                }

                syncHandoversWithQuery();

                window.addEventListener("popstate", syncHandoversWithQuery);

                if (dropdownHeader && dropdownBody) {
                    function toggleMenu() {
                        dropdownBody.classList.toggle("active");
                        dropdownHeader.classList.toggle("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        if (dropdownBody.classList.contains("active")) {
                            svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                        } else {
                            svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                        }
                    }

                    function closeMenu() {
                        dropdownBody.classList.remove("active");
                        dropdownHeader.classList.remove("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }

                    dropdownHeader.addEventListener("click", function (e) {
                        e.stopPropagation();

                        if (dropdownBody.classList.contains("active")) {
                            closeMenu();
                        } else {
                            toggleMenu();
                        }
                    });

                    document.addEventListener("click", function (event) {
                        if (
                            !dropdownContainer.contains(event.target) &&
                            !dropdownHeader.contains(event.target)
                        ) {
                            closeMenu();
                        }
                    });
                } else {
                    console.warn("Menu elements (dropdownHeader or dropdownBody) not found!");
                }
            }
            setTimeout(headerDropDownHandoverMobile, 0);

            function headerDropDownLocationMobile() {
    const dropdownContainer = document.querySelector("#headerLocationFilterMobile");
    const dropdownHeader = dropdownContainer.querySelector(
        ".filterPropertiesWrapper__dropDown_header"
    );
    const dropdownBody = dropdownContainer.querySelector(
        ".filterPropertiesWrapper__dropDown_body"
    );
    const dropdownList = dropdownBody.querySelector(
        ".filterPropertiesWrapper__dropDown_list"
    );

    let selectedLocations = new Set();

function renderLocationOptions() {
    areasData.forEach((area) => {
        const areaItem = document.createElement("div");
        areaItem.className = "filterPropertiesWrapper__dropDown_item";

        // Создаем обертку для основного названия территории
        const mainListSelectedWrapper = document.createElement("div");
        mainListSelectedWrapper.className = "mainListSelectedWrapper";

        // Создаем div для отображения выбранных субтерриторий
        const mainListSelected = document.createElement("div");
        mainListSelected.className = "mainListSelected";

        // Вставляем текст названия территории
        mainListSelectedWrapper.appendChild(mainListSelected);
        mainListSelectedWrapper.append(area.label);

        // Добавляем обертку с названием в основной элемент
        areaItem.appendChild(mainListSelectedWrapper);

        // Создаем иконку стрелки и добавляем её
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("width", "24");
        icon.setAttribute("height", "24");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("fill", "none");
        icon.innerHTML = `<path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
        areaItem.appendChild(icon);

        // Создание списка подтерриторий
        const subAreaList = document.createElement("div");
        subAreaList.className =
            "filterPropertiesWrapper__dropDownLocationsWrapper_list";
        subAreaList.style.display = "none"; // Скрываем подтерритории изначально

        // Создаем кнопку "All"
        const selectAllItem = document.createElement("div");
        selectAllItem.className = "filterPropertiesWrapper__dropDown_item selectAll";
        selectAllItem.innerHTML = `All<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px"></svg>`;
        const selectAllCheckBox = document.createElement("div");
        selectAllCheckBox.className = "filterPropertiesWrapper__customCheckBox";
        selectAllItem.appendChild(selectAllCheckBox);

        selectAllItem.addEventListener("click", function (e) {
            e.stopPropagation();
            handleSelectAll(area.subAreas);
        });

        subAreaList.appendChild(selectAllItem);

        // Добавляем подтерритории
        area.subAreas.forEach((subArea) => {
            const subAreaItem = document.createElement("div");
            subAreaItem.className =
                "filterPropertiesWrapper__dropDown_item location";
            subAreaItem.textContent = subArea.label;

            const subAreaCheckBox = document.createElement("div");
            subAreaCheckBox.className =
                "filterPropertiesWrapper__customCheckBox";

            subAreaItem.appendChild(subAreaCheckBox); // Добавляем чекбокс

            subAreaItem.addEventListener("click", function (e) {
                e.stopPropagation();
                handleSubAreaSelection(subArea.value, area.subAreas);
            });

            subAreaList.appendChild(subAreaItem);
        });

        // Добавляем обработчик нажатия для главной территории
        areaItem.addEventListener("click", function (e) {
            e.stopPropagation();
            const isActive = subAreaList.style.display === "block";
            subAreaList.style.display = isActive ? "none" : "block";
            // Устанавливаем класс active у подтерриторий
            subAreaList.classList.toggle("active", !isActive);
            areaItem.classList.toggle("active", !isActive); // Устанавливаем класс active у главной территории
        });

        dropdownList.appendChild(areaItem);
        dropdownList.appendChild(subAreaList);
    });

    // После рендеринга вызываем обновление стилей, чтобы правильно отобразить состояние чекбокса "All"
    updateLocationsStyles();
}


    renderLocationOptions();

    function handleSelectAll(subAreas) {
        const allSelected = subAreas.every(subArea => selectedLocations.has(subArea.value));
        if (allSelected) {
            subAreas.forEach(subArea => selectedLocations.delete(subArea.value));
        } else {
            subAreas.forEach(subArea => selectedLocations.add(subArea.value));
        }
        updateLocationsStyles();
        updateQueryParameter(
            "subAreas",
            selectedLocations.size > 0
                ? Array.from(selectedLocations).join(",")
                : null
        );
    }

    function handleSubAreaSelection(subAreaValue, subAreas) {
        if (selectedLocations.has(subAreaValue)) {
            selectedLocations.delete(subAreaValue);
        } else {
            selectedLocations.add(subAreaValue);
        }
        updateLocationsStyles(subAreas);
        updateQueryParameter(
            "subAreas",
            selectedLocations.size > 0
                ? Array.from(selectedLocations).join(",")
                : null
        );
    }

function updateLocationsStyles() {
    // Обновляем состояния чекбоксов для подтерриторий
    dropdownList.querySelectorAll(".filterPropertiesWrapper__dropDown_item.location").forEach((item) => {
        const subAreaValue = item.textContent.trim();
        const checkBox = item.querySelector(".filterPropertiesWrapper__customCheckBox");

        if (selectedLocations.has(subAreaValue)) {
            checkBox.classList.add("active");
            checkBox.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
<path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
</svg>`;
        } else {
            checkBox.classList.remove("active");
            checkBox.innerHTML = ""; // Удаляем SVG, если не выбрано
        }
    });

    // Обновляем счетчик выбранных подтерриторий и состояние mainListSelected
    dropdownList.querySelectorAll(".mainListSelectedWrapper").forEach((mainListWrapper) => {
        const areaLabel = mainListWrapper.textContent.trim().replace(/[0-9]+/g, '').trim(); // Убираем число, если оно добавляется автоматически
        const area = areasData.find(area => area.label === areaLabel);

        if (area) {
            const selectedSubAreasCount = area.subAreas.filter(subArea => selectedLocations.has(subArea.value)).length;
            const mainListSelected = mainListWrapper.querySelector(".mainListSelected");

            if (selectedSubAreasCount > 0) {
                mainListSelected.classList.add("active");
                mainListSelected.textContent = selectedSubAreasCount;
            } else {
                mainListSelected.classList.remove("active");
                mainListSelected.textContent = ""; // Очищаем текст, если ничего не выбрано
            }
        }
    });

    // Обновляем состояние кнопки "All" для каждой области
    dropdownList.querySelectorAll(".filterPropertiesWrapper__dropDown_item.selectAll").forEach((selectAllItem) => {
        const checkBox = selectAllItem.querySelector(".filterPropertiesWrapper__customCheckBox");

        // Обнаружение родительской области более точно
        const areaWrapper = selectAllItem.closest('.filterPropertiesWrapper__dropDownLocationsWrapper_list').previousElementSibling;
        const areaLabel = areaWrapper ? areaWrapper.textContent.trim().replace(/[0-9]+/g, '').trim() : '';
        const area = areasData.find(area => area.label === areaLabel);

        if (area) {
            const allSelected = area.subAreas.every(subArea => selectedLocations.has(subArea.value));

            if (allSelected && area.subAreas.length > 0) {
                checkBox.classList.add("active");
                checkBox.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
<path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
</svg>`;
            } else {
                checkBox.classList.remove("active");
                checkBox.innerHTML = ""; // Убираем активное состояние, если не все выбрано
            }
        }
    });
}

    function updateQueryParameter(key, value) {
        const queryString = window.location.search.substring(1);
        const params = new URLSearchParams(queryString);

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        const newQueryString = `?${params.toString()}`;
        history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
    }

    function syncLocationsWithQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        const subAreasParam = urlParams.get("subAreas");

        if (subAreasParam) {
            selectedLocations = new Set(subAreasParam.split(","));
        } else {
            selectedLocations.clear();
        }

        updateLocationsStyles();
    }

    syncLocationsWithQuery();

    window.addEventListener("popstate", syncLocationsWithQuery);

    dropdownHeader.addEventListener("click", function (e) {
        e.stopPropagation();

        if (dropdownBody.classList.contains("active")) {
            closeMenu();
        } else {
            closeAllDropdowns();
            toggleMenu();
        }
    });

    document.addEventListener("click", function (event) {
        if (!dropdownContainer.contains(event.target)) {
            closeMenu();
        }
    });

    function toggleMenu() {
        dropdownBody.classList.toggle("active");
        dropdownHeader.classList.toggle("active");

        const svgPath = dropdownHeader.querySelector("svg path");
        if (dropdownBody.classList.contains("active")) {
            svgPath.setAttribute("d", "M7 14L12 10L17 14");
        } else {
            svgPath.setAttribute("d", "M7 10L12 14L17 10");
        }
    }

    function closeMenu() {
        dropdownBody.classList.remove("active");
        dropdownHeader.classList.remove("active");

        const svgPath = dropdownHeader.querySelector("svg path");
        svgPath.setAttribute("d", "M7 10L12 14L17 10");
    }

    function closeAllDropdowns() {
        document
            .querySelectorAll(".filterPropertiesWrapper__dropDown_body.active")
            .forEach((body) => body.classList.remove("active"));
        document
            .querySelectorAll(".filterPropertiesWrapper__dropDown_header.active")
            .forEach((header) => header.classList.remove("active"));

        document
            .querySelectorAll(".filterPropertiesWrapper__dropDown_header svg path")
            .forEach((svgIcon) => {
                svgIcon.setAttribute("d", "M7 10L12 14L17 10");
            });
    }
}

            setTimeout(headerDropDownLocationMobile, 0);

            function clearHeaderFilters() {
                const clearBtn = document.querySelector("#clearBtnHeaderFilterAdaptive");

                if (!clearBtn) {
                    console.warn("Clear button not found!");
                    return;
                }

                clearBtn.addEventListener("click", function () {
                    const currentUrl = window.location.pathname;
                    const urlParams = new URLSearchParams(window.location.search);

                    // Получаем значения page и visible
                    const page = urlParams.get("page");
                    const visible = urlParams.get("visible");

                    // Создаем новый объект URLSearchParams и устанавливаем только параметры page и visible
                    const newUrlParams = new URLSearchParams();
                    if (page) {
                        newUrlParams.set("page", page);
                    }
                    if (visible) {
                        newUrlParams.set("visible", visible);
                    }

                    // Обновляем URL без использования хеша
                    window.history.replaceState({}, "", `${currentUrl}?${newUrlParams.toString()}`);

                    // Сбрасываем стили и значения фильтров
                    document.querySelectorAll(".filtersMap__select-body p").forEach((item) => {
                        item.style.opacity = "1";
                    });

                    // Удаление всех активных чекбоксов
                    document
                        .querySelectorAll(".filterPropertiesWrapper__customCheckBox.active")
                        .forEach((checkBox) => {
                            checkBox.classList.remove("active");
                        });

                    const nameInput = document.querySelector("#offPlanFilterInputName");
                    if (nameInput) {
                        nameInput.value = "";
                    }

                    // Сброс значений фильтров
                    window.minPrice = null;
                    window.maxPrice = null;
                    window.minSize = null;
                    window.maxSize = null;
                    window.handoverMin = null;
                    window.handoverMax = null;
                    window.selectedBedrooms = null;
                    window.name = null;
                    window.sort = null;

                    renderValueFilterFromQueryHeader();
                });
            }
            setTimeout(clearHeaderFilters, 0);

            function renderValueFilterFromQueryHeader() {
    // IDs для отображения фильтров
    const bedroomsContainer = document.getElementById("selectValueHeaderBedrooms");
    const priceContainer = document.getElementById("selectValueHeaderPrice");
    const sizeContainer = document.getElementById("selectValueHeaderSize");
    const handoverContainer = document.getElementById("selectValueHeaderHandover");
    const locationContainer = document.getElementById("selectValueHeaderFilterLocation");
    
    const queryString = window.location.search.substring(1);
    if (!queryString) {
        // Очищаем элементы, если queryString пустая
        clearFilterValues();
        return;
    }

    const queryParams = new URLSearchParams(queryString);

    // Очистка элементов перед обновлением
    clearFilterValues();

    // Bedrooms
    if (queryParams.has("bedrooms") && bedroomsContainer) {
        const bedrooms = queryParams.get("bedrooms").split(",");
        bedroomsContainer.innerHTML = ""; // Очищаем перед добавлением
        bedrooms.forEach((bedroom) => {
            addFilterItem(bedroomsContainer, `Bedroom: ${bedroom}`);
        });
    }

    // Price
    if ((queryParams.has("minPrice") || queryParams.has("maxPrice")) && priceContainer) {
        const minPrice = queryParams.get("minPrice");
        const maxPrice = queryParams.get("maxPrice");
        let priceText = "€ ";

        if (minPrice) {
            priceText += formatPrice(minPrice);
        }
        if (maxPrice) {
            priceText += " - " + formatPrice(maxPrice);
        }

        if (minPrice || maxPrice) {
            addFilterItem(priceContainer, priceText);
        }
    }

    // Size
    if ((queryParams.has("minSize") || queryParams.has("maxSize")) && sizeContainer) {
        const minSize = queryParams.get("minSize");
        const maxSize = queryParams.get("maxSize");
        let sizeText = "";

        if (minSize && maxSize) {
            sizeText = `${minSize} - ${maxSize} sq.m`;
        } else if (minSize) {
            sizeText = `From ${minSize} sq.m`;
        }

        if (sizeText) {
            addFilterItem(sizeContainer, sizeText);
        }
    }

    // Handover
    if ((queryParams.has("handoverMin") || queryParams.has("handoverMax")) && handoverContainer) {
        const handoverMin = queryParams.get("handoverMin");
        const handoverMax = queryParams.get("handoverMax");
        let handoverText = "";

        if (handoverMin && handoverMax) {
            handoverText = `${formatHandoverDate(handoverMin)} - ${formatHandoverDate(handoverMax)}`;
        } else if (handoverMin) {
            handoverText = `From ${formatHandoverDate(handoverMin)}`;
        }

        if (handoverText) {
            addFilterItem(handoverContainer, handoverText);
        }
    }

    // Location (subAreas)
    if (queryParams.has("subAreas") && locationContainer) {
        const subAreas = queryParams.get("subAreas").split(",");
        locationContainer.innerHTML = ""; // Очищаем перед добавлением
        subAreas.forEach((location) => {
            addFilterItem(locationContainer, `${location}`);
        });
    }

    // Функция для добавления элемента фильтра
    function addFilterItem(container, text) {
        const filterItem = document.createElement("div");
        filterItem.className = "propertiesSelectedFilter__item";

        const filterTitle = document.createElement("span");
        filterTitle.className = "propertiesSelectedFilter__item_title";
        filterTitle.textContent = text;

        filterItem.appendChild(filterTitle);
        container.appendChild(filterItem);
    }

    // Функция очистки всех значений фильтров
    function clearFilterValues() {
        if (bedroomsContainer) bedroomsContainer.innerHTML = "";
        if (priceContainer) priceContainer.innerHTML = "";
        if (sizeContainer) sizeContainer.innerHTML = "";
        if (handoverContainer) handoverContainer.innerHTML = "";
        if (locationContainer) locationContainer.innerHTML = "";
    }

    // Функция форматирования цены
    function formatPrice(price) {
        const num = parseInt(price, 10);
        if (num >= 1000000) {
            return num / 1000000 + "M";
        } else if (num >= 1000) {
            return num / 1000 + "K";
        }
        return num.toString();
    }

    // Функция форматирования handover даты
    function formatHandoverDate(date) {
        const [year, month] = date.split("-");
        const quarter = Math.ceil(parseInt(month, 10) / 3);
        return `Q${quarter} ${year}`;
    }
}
window.addEventListener("DOMContentLoaded", () => {
    renderValueFilterFromQueryHeader();

    let previousSearch = window.location.search;

    // Добавляем таймер для проверки изменений строки запроса
    setInterval(() => {
        const currentSearch = window.location.search;
        if (currentSearch !== previousSearch) {
            previousSearch = currentSearch;
            renderValueFilterFromQueryHeader();
        }
    }, 500);
});

		function handleBtnRedirectHeader() {
			const confirmBtn = document.getElementById("redirectFilterHeader");

			confirmBtn.addEventListener("click", () => {
				const currentUrl = window.location.href;
				const [currentPath, queryString] = currentUrl.split("?");
				const urlParams = new URLSearchParams(queryString || "");

				// Устанавливаем значение по умолчанию для "visible", если оно не указано
				let visible = urlParams.get("visible") || "Off plan";
				visible = decodeURIComponent(visible);
				urlParams.set("visible", visible);

				// Устанавливаем значение страницы на "0"
				urlParams.set("page", "0");

				// Определяем новый путь в зависимости от значения "visible"
				let newPath = "";
				if (visible === "Off plan") {
					newPath = "new-buildings";
				} else if (visible === "Secondary") {
					newPath = "secondaries";
				} else {
					// Устанавливаем "new-buildings" по умолчанию, если значение "visible" неизвестно
					newPath = "new-buildings";
				}

				const newFullPath = `${language && "/" + language}/${newPath}?${urlParams.toString()}`;

				// Перенаправляем на новый URL
				const newUrl = `${window.location.origin}/${newFullPath}`;
				window.location.replace(newUrl);
			});
		}
		setTimeout(handleBtnRedirectHeader, 0);

        window.addEventListener("scroll", updateFixedMenueVisibility);
        window.addEventListener("resize", updateFixedMenueVisibility);
        window.addEventListener("resize", updateHeaderMap);
        // Инициализируем начальное состояние fixedMenue
        updateFixedMenueVisibility();
        updateHeaderMap();
        const logoContainer = createElement("div");
        logoDiv.appendChild(logoContainer);

        const logoImg = createElement("img");
        logoImg.setAttribute("src", "/icons/shared/logo.svg");
        logoImg.setAttribute("alt", "pro-part-logo");
        logoImg.className = "logoImg";
        logoContainer.appendChild(logoImg);

  
  const navItems = [
    { text: "Home", url: `${language && "/" + language}/` },
    { text: "New building", url: `${language && "/" + language}/new-buildings?visible=Off+plan` },
    {
      text: "Secondary",
      url: `${language && "/" + language}/secondaries?page=0&visible=Secondary`,
    },
    { text: "Rent", url: `${language && "/" + language}/rent?page=1&visible=Rent` },
    { text: "Map", url: `${language && "/" + language}/map?visible=Off+plan` },
    { text: "Areas", url: `${language && "/" + language}/areas` },
    { text: "Consulting", url: `${language && "/" + language}/consulting` },
    { text: "Blog", url: `${language && "/" + language}/blogs` },
  ];
		const navbar = document.getElementById('bottom-navbar');

    // Create and append navigation links
    navItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.text;
        navbar.appendChild(link);
    });
	
	const callUsButtonBottom = document.createElement('button');
    callUsButtonBottom.className = 'button callUsButtonWhite';
    callUsButtonBottom.onclick = () => {
        window.location.href = 'tel:+34695113333';
    };

    navbar.appendChild(callUsButtonBottom);

    // Handle scroll event
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            navbar.classList.add('show');
        } else {
            navbar.classList.remove('show');
        }
        lastScrollY = window.scrollY;
    });
		
        navItems.forEach(({
            text,
            url
        }) => {
            navList.appendChild(createNavItem(text, url));
        });

        navItems.forEach(({
            text,
            url
        }) => {
            navListBtm.appendChild(createNavItem(text, url));
        });

        const callUsButton = createElement("button");
        callUsButton.className = "button callUsButton";

        callUsButton.onclick = () => {
            window.location.href = "tel:+34695113333";
        };
        const callUsText = createElement("span");
        callUsText.className = "callUsText";
        callUsText.innerText = "Call Us";
        callUsButton.appendChild(callUsText);
        socialDiv.appendChild(callUsButton);

        const likeButton = createElement("button");
        likeButton.className = "button likeButton";
		 likeButton.addEventListener("click", function() {
  window.location.href =`${language && "/" + language}/liked-projects`; 
})
        socialDiv.appendChild(likeButton);

        const shareButton = createElement("button");
        shareButton.className = "button shareButton";
        socialDiv.appendChild(shareButton);

        const menuButton = createElement("button");
        menuButton.className = "button menuButton";
        socialDiv.appendChild(menuButton);

        shareButton.innerText = "EN";

        const languageDropdown = createElement("ul");
        languageDropdown.className = "language-dropdown";
        languageDropdown.style.display = "none";
        socialDiv.appendChild(languageDropdown);

      
  const languages = [
    {
      code: "EN",
      name: "English",
      flagUrl: "<?php echo get_template_directory_uri(); ?>/icons/shared/lang-icon/united-kingdom.svg",
    },
    {
      code: "RU",
      name: "Russian",
      flagUrl: "<?php echo get_template_directory_uri(); ?>/icons/shared/lang-icon/russia.svg",
    },
  ];


       let activeLanguageItem = language.toUpperCase();
const currentPath = window.location.pathname;
function updateLanguage(lang) {
  const currentPath = window.location.pathname; // Получаем текущий путь
  const currentQuery = window.location.search; // Получаем квери-параметры (например, ?page=1&filter=on)
  let newPath;

  // Если язык — английский, убираем языковой префикс
  if (lang.code === 'EN') {
    // Убираем языковой префикс, если текущий путь начинается с допустимого языка
    newPath = currentPath.split('/').filter(segment => !allowedLanguages.includes(segment)).join('/');
    // Если после удаления префикса путь пустой, перенаправляем на "/"
    newPath = newPath ? newPath : '/';
  } else {
    // Если язык не английский, добавляем префикс языка
    newPath = `/${lang.code.toLowerCase()}${currentPath}`;
    
    // Проверяем, нет ли уже префикса в URL, чтобы не дублировать его
    allowedLanguages.forEach(language => {
      if (newPath.startsWith(`/${language}`)) {
        newPath = `/${lang.code.toLowerCase()}${currentPath.replace(`/${language}`, '')}`;
      }
    });
  }

  // Добавляем query параметры к новому пути, если они есть
  newPath += currentQuery;

  // Убедимся, что путь всегда начинается с "/"
  return newPath.startsWith('/') ? newPath : `/${newPath}`;
}

        languages.forEach((lang) => {
            const listItem = createElement("a");
			listItem.href = updateLanguage({ code: lang.code })
            listItem.className = "language-item";

            const flagImage = createElement("img");
            flagImage.src = lang.flagUrl;
            flagImage.alt = `${lang.name} flag`;
            flagImage.className = "language-flag";
            listItem.appendChild(flagImage);

            const langText = createElement("span");
            langText.innerText = `${lang.code}`;
            listItem.appendChild(langText);

        	if (!activeLanguageItem) {
  flagImage.classList.add("item--active");
  activeLanguageItem = flagImage;
  shareButton.innerText = lang.code;
}

if (activeLanguageItem === lang.code) {
  flagImage.classList.add("item--active");
  activeLanguageItem = flagImage;
  shareButton.innerText = lang.code;
}

            listItem.onclick = () => {
                shareButton.innerText = lang.code;
                languageDropdown.style.display = "none";

                if (activeLanguageItem) {
                    activeLanguageItem.classList.remove("item--active");
                }

                flagImage.classList.add("item--active");
                activeLanguageItem = flagImage;
            };

            languageDropdown.appendChild(listItem);
        });
        shareButton.onclick = (event) => {
            event.stopPropagation();
            languageDropdown.style.display =
                languageDropdown.style.display === "none" ? "grid" : "none";
        };

        document.addEventListener("click", (event) => {
            const isClickInside = socialDiv.contains(event.target);
            if (!isClickInside) {
                languageDropdown.style.display = "none";
            }
        });

        const currentHash = window.location.hash.slice(1);

        window.addEventListener("popstate", () => {
            if (navBtm.classList.contains("showNavBottom1")) {
                navBtm.classList.remove("showNavBottom1");
                navBtm.classList.add("showNavBottom");
            }

            if (!nav.classList.contains("showNav")) {
                document.body.style.overflow = "";
            }
        });

        const fixedMenueCloseBtn = document.createElement("button");
        fixedMenueCloseBtn.className = "closeNavBottom";
        nav.appendChild(fixedMenueCloseBtn);

        fixedBtn.addEventListener("click", () => {
            nav.classList.toggle("showNav");
            fixedMenue.classList.toggle("close");
            fixedMenueCloseBtn.classList.toggle("visible");
            if (nav.classList.contains("showNav")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }

            if (currentHash === "secondary" && window.innerWidth <= 768) {
                navBtm.classList.toggle("showNavBottom1");
                navBtm.classList.toggle("showNavBottom");
            }
        });
        fixedMenueCloseBtn.addEventListener("click", () => {
            nav.classList.toggle("showNav");
            fixedMenue.classList.toggle("close");
            fixedMenueCloseBtn.classList.toggle("visible");
            if (nav.classList.contains("showNav")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }

//             if (currentHash === "secondary" && window.innerWidth <= 768) {
//                 navBtm.classList.toggle("showNavBottom1");
//                 navBtm.classList.toggle("showNavBottom");
//             }
        });
        if (filterMobileBurgerMenu) {
            filterMobileBurgerMenu.addEventListener("click", () => {
                nav.classList.toggle("showNav");
                filterMobileBurgerMenu.classList.toggle("showBtn");
                if (nav.classList.contains("showNav")) {
                    document.body.style.overflow = "hidden";
                } else {
                    document.body.style.overflow = "";
                }

                if (currentHash === "secondary" && window.innerWidth <= 768) {
                    navBtm.classList.toggle("showNavBottom1");
                    navBtm.classList.toggle("showNavBottom");
                }
            });
        }
        menuButton.addEventListener("click", () => {
            nav.classList.toggle("showNav");
            shareButton.classList.toggle("showNavBtn");
            likeButton.classList.toggle("showNavBtnLike");
            menuButton.classList.toggle("showNavBtnClose");
            if (nav.classList.contains("showNav")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }

            if (currentHash === "secondary" && window.innerWidth <= 768) {
                navBtm.classList.toggle("showNavBottom1");
                navBtm.classList.toggle("showNavBottom");
            }
        });

        window.addEventListener("popstate", () => {
            if (navBtm.classList.contains("showNavBottom1")) {
                navBtm.classList.remove("showNavBottom1");
                navBtm.classList.add("showNavBottom");
            }

            if (!nav.classList.contains("showNav")) {
                document.body.style.overflow = "";
            }
        });

        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            const pageHeight = document.documentElement.scrollHeight;

            if (scrollPosition >= pageHeight) {
                header.style.transition = "opacity 0.5s";
                header.style.opacity = "0";
            } else {
                header.style.opacity = "1";
            }
        };

        window.addEventListener("scroll", handleScroll);

       const updateActiveNavItem = () => {
    const navLinks = document.querySelectorAll(".navLink");
    let currentRoute = window.location.pathname;
    currentRoute = currentRoute.endsWith('/') ? currentRoute.slice(0, -1) : currentRoute;

    navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        let linkRoute = href.startsWith('/') ? href : `/${href}`;
        linkRoute = linkRoute.endsWith('/') ? linkRoute.slice(0, -1) : linkRoute;

        if (link.classList.contains("active")) {
            nav.classList.remove("showNav");
            menuButton.classList.remove("menuActive");
        }

        if (
            (false) &&
            window.innerWidth <= 1440
        ) {
            link.classList.add("navLink-active");
            link.classList.remove("active");
        } else {
            link.classList.remove("navLink-active");
        }

        if (linkRoute === currentRoute) {
            link.classList.add("active");
            if (
                (false) &&
                window.innerWidth <= 1440
            ) {
                link.classList.add("active-bottom");
            }
        } else {
            link.classList.remove("active");
        }
    });

    if (
        (false) &&
        window.innerWidth <= 1440
    ) {
        navLinks.forEach((link) => {
            nav.style.display = "flex";
            if (header.classList.contains("header-bottom")) {
                header.style.justifyContent = "center";
            } else {
                header.style.justifyContent = "";
            }
        });
    } else {
        nav.style.display = "";
        header.style.justifyContent = "";
    }

    if (
        (false) &&
        window.innerWidth <= 1440
    ) {
        logoDiv.style.display = "none";
        socialDiv.style.display = "none";

        header.classList.add("header-bottom");
        header.classList.remove("header-hidden");
        nav.classList.add("nav-bottom");
    } else {
        logoDiv.style.display = "block";
        socialDiv.style.display = "flex";

        header.classList.remove("header-bottom");
        header.classList.remove("header-hidden");
        nav.classList.remove("nav-bottom");
    }

    if (
        (false) &&
        window.innerWidth <= 768
    ) {
        nav.classList.remove("nav-bottom");
        nav.style.display = "none";
        socialDiv.classList.add("socialBottom");

        likeButton.classList.remove("likeButton");
        likeButton.classList.add("settingsButton");

        callUsButton.classList.remove("callUsButton");
        callUsButton.classList.add("callUsButtonWhite");

        shareButton.classList.remove("shareButton");
        shareButton.classList.add("mapButton");

        menuButton.classList.remove("menuButton");
        menuButton.classList.add("menuButtonWhite");

        socialDiv.style.display = "flex";
    } else {
        likeButton.classList.add("likeButton");
        likeButton.classList.remove("settingsButton");

        shareButton.classList.add("shareButton");
        shareButton.classList.remove("mapButton");

        callUsButton.classList.add("callUsButton");
        callUsButton.classList.remove("callUsButtonWhite");

        menuButton.classList.add("menuButton");
        menuButton.classList.remove("menuButtonWhite");

        socialDiv.classList.remove("socialBottom");
    }
};
const originalPushState = history.pushState;
history.pushState = function (...args) {
    originalPushState.apply(this, args);
    updateActiveNavItem();
};

const originalReplaceState = history.replaceState;
history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    updateActiveNavItem();
};

// Вызов updateActiveNavItem при изменении маршрута
updateActiveNavItem();
window.addEventListener("DOMContentLoaded", updateActiveNavItem);
window.addEventListener("resize", updateActiveNavItem);

        return header;
    };
    const createNavItem = (text, url = "#") => {
        const navItem = createElement("li");
        navItem.className = "navItem";

        const navLink = createElement("a");
        navLink.className = "navLink";
        navLink.innerText = text;
        navLink.setAttribute("href", url);
        navItem.appendChild(navLink);

        const currentHash = window.location.hash.slice(1);

        if (url.slice(1) === currentHash) {
            navLink.classList.add("active");
        }

        return navItem;
    };
//----End Header

//----Footer
const createFooterSocialLink = (type, href = "#") => {
  const link = createElement("a");
  link.href = href;
  link.target = "_blank";

  const linkSpan = createElement("span");
  linkSpan.className = "icon";
  linkSpan.classList.add(`${type}-icon`);

  link.appendChild(linkSpan);

  return link;
};

const createFooterLink = (text, href = "#") => {
  const item = createElement("li");
  const link = createElement("a");
  link.href = href;
  link.innerText = text;
  link.onclick = () => window.scrollTo(0, 0);

  item.appendChild(link);

  return item;
};

const createLinksGroup = (name) => {
  const linksGroup = createElement("div");
  linksGroup.className = "linksGroup";

  const linksGroupHeader = createElement("p");
  linksGroupHeader.className = "groupHeader";
  linksGroupHeader.innerText = name;
  linksGroup.appendChild(linksGroupHeader);

  const list = createElement("ul");
  linksGroup.appendChild(list);

  return linksGroup;
};

 const Footer = () => {
        const footerDate = new Date().getFullYear();
        const footer = document.createElement("footer");
        footer.className = "footer";

        const footerTop = createElement("div");
        footerTop.className = "footerTop";
        footer.appendChild(footerTop);

        const contactsContainer = createElement("div");
        contactsContainer.className = "contactsContainer";
        footerTop.appendChild(contactsContainer);

        const logoContainer = createElement("div");
        logoContainer.className = "logoContainer";
        contactsContainer.appendChild(logoContainer);

        const logoImg = createElement("img");
        logoImg.setAttribute("src", "/icons/shared/logo.svg");
        logoImg.setAttribute("alt", "pro-part-logo");
        logoImg.className = "logo-image";
        logoContainer.appendChild(logoImg);

        const contactInfoContainer = createElement("div");
        contactInfoContainer.className = "contactInfoContainer";

        const addressElement = createElement("p");
        addressElement.className = "address";
        addressElement.innerText =
            "Pl. de la Iglesia, 3, office 1-D, 29670, San Pedro de Alcantara, Malaga";
        contactsContainer.appendChild(addressElement);

        const phoneElement = createElement("a");
        phoneElement.className = "phone";
        phoneElement.href = "tel:+34695113333";
        phoneElement.innerText = "+34 695 113 333";

        const phoneIconElement = createElement("span");
        phoneIconElement.className = "phoneIcon";
        phoneElement.prepend(phoneIconElement);

        contactInfoContainer.appendChild(addressElement);
        contactInfoContainer.appendChild(phoneElement);

        contactsContainer.appendChild(contactInfoContainer);

        const footerSocial = createElement("div");
        footerSocial.className = "footerSocial";

        const socialLinks = [{
                platform: "whatsapp",
                url: "https://api.whatsapp.com/send/?phone=34695113333&text&type=phone_number&app_absent=0"
            },
            {
                platform: "telegram",
                url: "https://t.me/ppspain"
            },
            {
                platform: "facebook",
                url: "https://facebook.com/your-page"
            },
            {
                platform: "https://www.facebook.com/people/propartes/61557005454968/?mibextid=LQQJ4d&rdid=gOL7loYQU6x4FIHO&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FyLdG6VUUZ11gwWkN%2F%3Fmibextid%3DLQQJ4d",
                url: "https://www.instagram.com/propart.es"
            },
        ];

        contactsContainer.appendChild(footerSocial);
        socialLinks.forEach(({
            platform,
            url
        }) => {
            footerSocial.appendChild(createFooterSocialLink(platform, url));
        });

        const linksContainer = createElement("div");
        linksContainer.className = "linksContainer";
        footerTop.appendChild(linksContainer);

        const areaLinks = createLinksGroup("Area");
           const areaLinksData = [{
                name: "Marbella",
                url: `${language && "/" + language}/marbella`
            },
            {
                name: "Estepona",
                url: `${language && "/" + language}/estepona`
            },
            {
                name: "Benahavis",
                url: `${language && "/" + language}/benahavis`
            },
            {
                name: "Sotogrande",
                url: `${language && "/" + language}/sotogrande`
            },
            {
                name: "Mijas",
                url: `${language && "/" + language}/mijas`
            },
            {
                name: "Ojen",
                url: `${language && "/" + language}/ojen`
            },
        ];
        areaLinksData.forEach(({
            name,
            url
        }) => {
            areaLinks.lastChild.appendChild(createFooterLink(name, url));
        });

        linksContainer.appendChild(areaLinks);

        const consultingLinks = createLinksGroup("Consulting");
         const consultingLinksData = [{
                name: "Visa",
                url: `${language && "/" + language}/visa-services`
            },
            {
                name: "Legal services",
                url: `${language && "/" + language}/legal-service`
            },
            {
                name: "Insurance",
                url: `${language && "/" + language}/insurance-service`
            },
            {
                name: "Mortgage",
                url: `${language && "/" + language}/mortgage`
            },
            {
                name: "Concierge",
                url: `${language && "/" + language}/concierge-service`
            },
            {
                name: "Construction",
                url: `${language && "/" + language}/construction-service`
            },
        ];
        consultingLinksData.forEach(({
            name,
            url
        }) => {
            consultingLinks.lastChild.appendChild(createFooterLink(name, url));
        });

        linksContainer.appendChild(consultingLinks);

        const servicesLinks = createLinksGroup("Services");
        const linksGroupInner = createElement("div");
        linksGroupInner.className = "linksGroupInner";
        servicesLinks.lastChild.appendChild(linksGroupInner);

        const linksGroupInnerRight = createElement("div");
        linksGroupInner.appendChild(linksGroupInnerRight);

      const servicesLinksDataRight =  [{
                name: "Visa",
                url: `${language && "/" + language}/visa-services`
            },
            {
                name: "Legal services",
                url: `${language && "/" + language}/legal-service`
            },
            {
                name: "Insurance",
                url: `${language && "/" + language}/insurance-service`
            },
            {
                name: "Mortgage",
                url: `${language && "/" + language}/mortgage`
            },
            {
                name: "Concierge",
                url: `${language && "/" + language}/concierge-service`
            },
            {
                name: "Construction",
                url: `${language && "/" + language}/construction-service`
            },
        ];
        servicesLinksDataRight.forEach(({
            name,
            url
        }) => {
            linksGroupInnerRight.appendChild(createFooterLink(name, url));
        });

        const linksGroupInnerLeft = createElement("div");
        linksGroupInner.appendChild(linksGroupInnerLeft);
        const servicesLinksDataLeft = [{
                name: "Repairs & Furnishings",
                url: `${language && "/" + language}/construction-service`
            },
            {
                name: "Select construction",
                url: `${language && "/" + language}/construction-service`
            },
            {
                name: "Digital Nomand Visa",
                url: `${language && "/" + language}/construction-service`
            },
            {
                name: "Tourist license",
                url: `${language && "/" + language}/construction-service`
            },
            {
                name: "Student visa",
                url: `${language && "/" + language}/visa-services`}] 

        servicesLinksDataLeft.forEach(({
            name,
            url
        }) => {
            linksGroupInnerLeft.appendChild(createFooterLink(name, url));
        });

        linksContainer.appendChild(servicesLinks);

        const footerBottom = createElement("div");
        footerBottom.className = "footerBottom";
        footer.appendChild(footerBottom);

        const rightsDiv = createElement("div");
        rightsDiv.className = "rights";
        rightsDiv.innerText = `© ${footerDate}  All rights reserved`;
        footerBottom.appendChild(rightsDiv);

        const policyDiv = createElement("div");
        policyDiv.className = "policy";
        footerBottom.appendChild(policyDiv);

        const policyLink = createElement("a");
        policyLink.href = "#";
        policyLink.innerText = "Privacy policy";
        policyDiv.appendChild(policyLink);

        const termsLink = createElement("a");
        termsLink.href = "#";
        termsLink.innerText = "Terms of use";
        policyDiv.appendChild(termsLink);

        return footer;
    };
//----End Footer

//---CreateElement
const createElement = (name) => document.createElement(name);
//---End CreateElement

function ProjectInquiryForm() {
    const inquiryHTML = `
        <div class="project-inquiry-container">
            <div class="project-inquiry-left">
                <h2 class="project-inquiry-title">Want to know more about the project?</h2>
                <div class="project-inquiry-contacts">
                    <a href="tel:+34695113333" class="project-inquiry-contact">+34 695 113 333</a>
                    <a href="mailto:info@pro-part.es" class="project-inquiry-contact">info@pro-part.es</a>
                </div>
                <div class="project-inquiry-buttons">
                    <a href="https://wa.me/34695113333?text=Hello%2C%20I%27m%20interested%20in%20this%20property" target="_blank" class="button-black whatsapp-btn">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.0512 2.89375C15.1637 1.00625 12.6512 0 10.0012 0C4.52625 0 0.07125 4.45375 0.07 9.92875C0.07 11.6675 0.525 13.3663 1.39125 14.8625L0 20L5.2575 18.6375C6.69625 19.4275 8.33 19.8438 10 19.8438H10.0012C15.475 19.8438 19.93 15.3888 19.93 9.91375C19.93 7.26375 18.9387 4.78125 17.0512 2.89375ZM10.0012 18.1838C8.49625 18.1838 7.02125 17.7838 5.735 17.03L5.43125 16.855L2.3525 17.6538L3.1625 14.6438L2.97 14.3275C2.14375 12.9912 1.70875 11.4775 1.70875 9.92875C1.70875 5.35375 5.425 1.6375 10.0012 1.6375C12.2162 1.6375 14.2975 2.5025 15.8637 4.06875C17.43 5.635 18.295 7.71625 18.295 9.93125C18.295 14.5063 14.5775 18.1838 10.0012 18.1838Z" fill="white"/>
                            <path d="M14.5788 12.005C14.3288 11.88 13.0913 11.2688 12.8663 11.1813C12.6413 11.095 12.4788 11.0513 12.3163 11.3013C12.1538 11.5513 11.6663 12.13 11.5288 12.2925C11.3913 12.455 11.2525 12.4763 11.0025 12.3513C10.7525 12.2263 9.97 11.9675 9.03125 11.1263C8.30125 10.4713 7.80375 9.66255 7.66625 9.4113C7.52875 9.1613 7.65 9.03005 7.77625 8.90505C7.8875 8.7938 8.02625 8.61255 8.15125 8.47505C8.27625 8.33755 8.32125 8.23755 8.40875 8.0763C8.49625 7.91505 8.4525 7.77755 8.39 7.6513C8.32875 7.52505 7.83375 6.28755 7.63 5.7863C7.43375 5.2988 7.23125 5.3638 7.08125 5.35505C6.9375 5.34755 6.775 5.3463 6.6125 5.3463C6.45 5.3463 6.18875 5.40755 5.96375 5.65755C5.73875 5.90755 5.08625 6.5188 5.08625 7.7563C5.08625 8.99505 6 10.1925 6.125 10.355C6.25 10.5175 7.80125 12.9963 10.1963 14.0888C10.7663 14.3438 11.2113 14.495 11.5575 14.6088C12.13 14.7875 12.6475 14.7613 13.0575 14.6988C13.5175 14.6288 14.5163 14.1113 14.72 13.545C14.9238 12.9788 14.9238 12.5013 14.8625 12.3938C14.8013 12.2863 14.6388 12.225 14.3888 12.1L14.5788 12.005Z" fill="white"/>
                        </svg>
                        WhatsApp
                    </a>
                    <a href="https://t.me/+34695113333" target="_blank" class="button-black telegram-btn">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM14.9167 6.66667L13.3333 14.25C13.2083 14.7917 12.9167 14.9167 12.5 14.6667L10.0833 12.8333L8.91667 13.9167C8.75 14.0833 8.625 14.2083 8.33333 14.2083L8.54167 11.75L13.0417 7.70833C13.25 7.54167 13.0417 7.45833 12.75 7.625L7.16667 11.0833L4.79167 10.3333C4.25 10.1667 4.25 9.83333 4.91667 9.58333L14.1667 6C14.625 5.83333 15.0417 6.08333 14.9167 6.66667Z" fill="white"/>
                        </svg>
                        Telegram
                    </a>
                </div>
            </div>
            <div class="project-inquiry-right">
                <form class="project-inquiry-form">
                    <input type="tel" class="project-inquiry-input" placeholder="Your phone number" name="phone" required />
                    <div class="project-inquiry-row">
                        <input type="text" class="project-inquiry-input" placeholder="Name" name="name" required />
                        <input type="email" class="project-inquiry-input" placeholder="Email" name="email" required />
                    </div>
                    <button type="submit" class="button-black project-inquiry-submit">Submit request</button>
                    <p class="project-inquiry-disclaimer">
                        By clicking the button, I agree to the processing of personal data and the website's terms and conditions.
                    </p>
                    <p class="project-inquiry-disclaimer">
                        This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.
                    </p>
                </form>
            </div>
        </div>
    `;

    const inquiryElement = document.createElement("div");
    inquiryElement.innerHTML = inquiryHTML;

    // Handle form submission
    const form = inquiryElement.querySelector("form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        // Show notification
        const modalElement = document.querySelector(".notificationModal");
        if (modalElement) {
            modalElement.textContent = "Your request was received!";
            modalElement.style.display = "block";
            setTimeout(() => {
                modalElement.style.display = "none";
            }, 3000);
        }
        
        // Reset form
        form.reset();
    });

    return inquiryElement;
}

function FeedbackForm() {
    const formHTML = `
        <form action="" class="feedbackBlock">
            <div class="feedbackForm">
                <p class="formHeader">Get help from our expert</p>
                <p class="formDescription">
                    Our expert will help you with property purchase, management, or
                    consulting in Costa Del Sol.
                </p>
                <input
                    type="text"
                    name="name"
                    class="nameInput"
                    placeholder="Your name"
                />
                <input
                    type="tel"
                    name="phone"
                    class="phoneInput"
                    placeholder="Phone number"
                />
                <button type="submit" class="submitButton">Get a consultation</button>
                <p class="hint">
                    When you click “Get a Consultation,” you agree to our Terms of Service
                    and Privacy Policy.
                </p>
            </div>
        </form>
    `;

    const formElement = document.createElement("div");
    formElement.innerHTML = formHTML;

    // Modal element
    const modalElement = document.createElement("div");
    modalElement.className = "notificationModal";
    modalElement.innerText = "Your message was received!";
    modalElement.style.display = "none"; // Hide initially
    document.body.appendChild(modalElement);

    // Handle form submission
    formElement.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent page reload

        // Show the modal
        modalElement.style.display = "block";

        // Hide modal after 3 seconds
        setTimeout(() => {
            modalElement.style.display = "none";
        }, 3000);
    });

    return formElement;
}

const style = document.createElement("style");
style.innerHTML = `
    .notificationModal {
        position: fixed;
        top: 60px;
        right: 20px;
        padding: 10px 20px;
        background-color: #d3d3d3;
        color: #222222;
		font-weight: 600;
        border-radius: 12px;
        font-size: 16px;
        z-index: 1000;
        display: none;
    }
    
    .thumbnail-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        padding: 10px;
        max-height: 100px;
        overflow-y: auto;
        background-color: rgba(0, 0, 0, 0.5);
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        margin-top: 10px;
    }
    
    .thumbnail {
        border-radius: 4px;
        transition: all 0.3s ease;
        opacity: 0.7;
    }
    
    .thumbnail:hover {
        transform: scale(1.05);
        opacity: 1;
    }
    
    .thumbnail.active {
        opacity: 1;
    }
    
    .gallery-image {
        max-width: 90vw;
        max-height: 80vh;
        width: auto;
        height: auto;
        object-fit: contain;
        display: block;
        margin: 0 auto;
    }
    
    .gallery-content {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 80vh;
        position: relative;
    }
    
    .gallery-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 15px 10px;
        cursor: pointer;
        font-size: 24px;
        border-radius: 5px;
        transition: background 0.3s ease;
    }
    
    .gallery-nav:hover {
        background: rgba(0, 0, 0, 0.8);
    }
    
    .gallery-prev {
        left: 20px;
    }
    
    .gallery-next {
        right: 20px;
    }
`;
document.head.appendChild(style);
let currentImageIndex = 0;
let images = [];
let imagesSecondary = [];
function createDots() {
  const dotContainer = document.getElementById("dotContainer");
  dotContainer.innerHTML = "";

  const maxDots = 5;
  const numImages = window.imagesSecondary ? window.imagesSecondary.length : 0;

  if (numImages === 0) {
    console.warn("No images available for creating dots");
    return;
  }

  let start;
  let end;

  if (currentImageIndex < maxDots) {
    start = 0;
    end = Math.min(numImages, maxDots);
  } else {
    start = currentImageIndex - 4;
    end = Math.min(numImages, start + maxDots);
  }

  for (let i = start; i < end; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.dataset.index = i;

    dot.addEventListener("click", () => {
      showImage(i, "galleryImage");
      currentImageIndex = i; // Update currentImageIndex here
      updateDots(); // Call updateDots to refresh the active state
    });
    
    dotContainer.appendChild(dot);
  }

  console.log(`Dots created from image index ${start} to ${end - 1}`);
  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    const dotIndex = parseInt(dot.dataset.index, 10);

    dot.classList.toggle("active", 
      (currentImageIndex < 5 && dotIndex === currentImageIndex) ||
      (currentImageIndex >= 5 && index === 4)
    );
  });
}
		
function openGallery() {
  console.log("Opening gallery, currentImageIndex:", currentImageIndex);
  console.log("Images available:", window.imagesSecondary ? window.imagesSecondary.length : 0);
  
  document.getElementById("galleryOverlay").style.display = "block";
  document.body.style.overflow = "hidden";
  showImage(currentImageIndex, "galleryImage");
  createThumbnails();
  createDots();
}

function createThumbnails() {
  const container = document.getElementById("thumbnailContainer");
  console.log("Creating thumbnails, container:", container);
  
  if (!container) {
    console.error("thumbnailContainer not found");
    return;
  }
  
  container.innerHTML = "";
  
  if (!window.imagesSecondary || window.imagesSecondary.length === 0) {
    console.warn("No images available for creating thumbnails");
    return;
  }
  
  console.log("Creating thumbnails for", window.imagesSecondary.length, "images");
  
  window.imagesSecondary.forEach((src, index) => {
    const thumb = document.createElement("img");
    thumb.src = src;
    thumb.className = "thumbnail";
    thumb.style.width = "60px";
    thumb.style.height = "60px";
    thumb.style.objectFit = "cover";
    thumb.style.margin = "5px";
    thumb.style.cursor = "pointer";
    thumb.style.border = "2px solid transparent";
    thumb.onclick = () => {
      showImage(index, "galleryImage");
    };
    container.appendChild(thumb);
    console.log("Added thumbnail", index, "with src:", src);
  });
  
  updateThumbnails();
}
		
function updateThumbnails() {
  const thumbs = document.querySelectorAll(".thumbnail");
  thumbs.forEach((thumb, index) => {
    const isActive = index === currentImageIndex;
    thumb.classList.toggle("active", isActive);
    
    // Update border style for active thumbnail
    if (isActive) {
      thumb.style.border = "2px solid #007bff";
    } else {
      thumb.style.border = "2px solid transparent";
    }
  });
};
		
function addSwipeHandlersSecondary() {
  const galleryWrapper = document.querySelector(".gallery-wrapper");
  const galleryContent = document.querySelector(".gallery-content");
  let startX = 0;
  let isSwiping = false;

  const handleSwipe = (step) => {
    changeImageSecondary(step);
    isSwiping = false;
  };

  const startTouch = (event) => {
    startX = event.touches[0].clientX;
    isSwiping = true;
  };

  const moveTouch = (event) => {
    if (!isSwiping) return;
    const moveX = event.touches[0].clientX;
    const diffX = startX - moveX;
    
    if (diffX > 50) {
      handleSwipe(1);
    } else if (diffX < -50) {
      handleSwipe(-1);
    }
  };

  galleryWrapper.addEventListener("touchstart", startTouch);
  galleryWrapper.addEventListener("touchmove", moveTouch);
  galleryWrapper.addEventListener("touchend", () => {
    isSwiping = false;
  });

  galleryContent.addEventListener("touchstart", startTouch);
  galleryContent.addEventListener("touchmove", moveTouch);
  galleryContent.addEventListener("touchend", () => {
    isSwiping = false;
  });
}
		
function closeGallery() {
  document.getElementById("galleryOverlay").style.display = "none";
  document.body.style.overflow = "";
}

function handleKeyPress(event) {
  if (event.key === "Escape") {
    closeGallery();
  }
}

function showImage(index, elementId) {
  const galleryImage = document.getElementById(elementId);
  if (galleryImage && window.imagesSecondary && window.imagesSecondary[index]) {
    galleryImage.src = window.imagesSecondary[index];
    currentImageIndex = index;
    updateThumbnails();
  }
}

function changeImage(step) {
  if (!window.imagesSecondary || window.imagesSecondary.length === 0) {
    console.warn("No images available for changing");
    return;
  }
  
  currentImageIndex =
    (currentImageIndex + step + window.imagesSecondary.length) % window.imagesSecondary.length;
  showImage(currentImageIndex, "galleryImage");
  showImage(currentImageIndex, "sliderImage");
  updateDots();
}



function updateThumbnails() {
  const thumbs = document.querySelectorAll(".thumbnail");
  thumbs.forEach((thumb, index) => {
    thumb.classList.toggle("active", index === currentImageIndex);
  });
}

function addSwipeHandlers() {
  const galleryWrapper = document.querySelector(".gallery-wrapper");
  const galleryContent = document.querySelector(".gallery-content");
  let startX = 0;
  let isSwiping = false;

  const handleSwipe = (step) => {
    changeImage(step);
    isSwiping = false;
  };

  const startTouch = (event) => {
    startX = event.touches[0].clientX;
    isSwiping = true;
  };

  const moveTouch = (event) => {
    if (!isSwiping) return;
    const moveX = event.touches[0].clientX;
    const diffX = startX - moveX;

    if (diffX > 50) {
      handleSwipe(1);
    } else if (diffX < -50) {
      handleSwipe(-1);
    }
  };

  galleryWrapper.addEventListener("touchstart", startTouch);
  galleryWrapper.addEventListener("touchmove", moveTouch);
  galleryWrapper.addEventListener("touchend", () => {
    isSwiping = false;
  });

  galleryContent.addEventListener("touchstart", startTouch);
  galleryContent.addEventListener("touchmove", moveTouch);
  galleryContent.addEventListener("touchend", () => {
    isSwiping = false;
  });
}

function hideButtonsOnResize() {
  const prevButton = document.querySelector(".gallery-slide-prev");
  const nextButton = document.querySelector(".gallery-slide-next");
  const screenWidth = window.innerWidth;
}

window.addEventListener("resize", hideButtonsOnResize);
function renderOffPlan(mainContent) {
  if (window.innerWidth <= 768) {
    addSwipeHandlers();
  }

  hideButtonsOnResize();

  // Set up gallery event listeners
  document
    .getElementById("viewPhotosBtn")
    .addEventListener("click", openGallery);
  document
    .getElementById("closeGallery")
    .addEventListener("click", closeGallery);
  document
    .querySelector(".project-desc-img")
    .addEventListener("click", openGallery);
  document.getElementById("sliderImage").addEventListener("click", openGallery);

  const prevButton = document.querySelector(".gallery-prev");
  const prevSlideButton = document.querySelector(".gallery-slide-prev");

  const nextButton = document.querySelector(".gallery-next");
  const nextSlideButton = document.querySelector(".gallery-slide-next");

  if (prevButton) prevButton.addEventListener("click", () => changeImage(-1));
  if (prevSlideButton)
    prevSlideButton.addEventListener("click", () => changeImage(-1));

  if (nextButton) nextButton.addEventListener("click", () => changeImage(1));
  if (nextSlideButton)
    nextSlideButton.addEventListener("click", () => changeImage(1));
  document.addEventListener("keydown", handleKeyPress);
}

function formatToQuarter(dateArray) {
  const year = dateArray[0];
  const month = dateArray[1];

  let quarter;
  if (month >= 1 && month <= 3) {
    quarter = "Q1";
  } else if (month >= 4 && month <= 6) {
    quarter = "Q2";
  } else if (month >= 7 && month <= 9) {
    quarter = "Q3";
  } else if (month >= 10 && month <= 12) {
    quarter = "Q4";
  }

  return `${quarter} ${year}`;
}
		
const swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto',
            spaceBetween: 12,
            loop: true,
            navigation: {
                nextEl: '.swiper-custom-button-next',
                prevEl: '.swiper-custom-button-prev',
            },
});
		
		
function formatHandoverDate(handoverArray) {
            const year = handoverArray[0];
            const month = handoverArray[1];
            if (1 <= month && month <= 3) {
                return `Q1 ${year}`;
            } else if (4 <= month && month <= 6) {
                return `Q2 ${year}`;
            } else if (7 <= month && month <= 9) {
                return `Q3 ${year}`;
            } else if (10 <= month && month <= 12) {
                return `Q4 ${year}`;
            }
            return `${year}`;
}

        const accessKey = "rijVnGe6lBwcsWop";
        const secretKey = "0FnSmmqRcM1X0V5y28Mx9rMYyo2mQdVt";
        const body = {};

        const params = new URLSearchParams({
            accessKey: accessKey,
            secretKey: secretKey,
            isPagination: "true",
            size: "9",
            page: "0",
        });

        const headers = {
            "Content-Type": "application/json",
        };

        const requestBody = Object.keys(body).length ? body : {};
		
        async function fetchAndRenderSlides() {
			const locationElement = document.getElementById('projectLocation');

            const locationText = locationElement ? locationElement.textContent.trim() : '';
	
            try {
                // Fetching data from API
                const response = await fetch(
                   `https://crm.server.pro-part.es/api/v1/off-plan/integration/projects?${params.toString()}&locations=${locationText}`, {
                        method: "GET",
                    }
                );

                // Check if the response is not ok
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Parse the response JSON
                const data = await response.json();

                // Grab the Swiper wrapper where we will append the slides
                const swiperWrapper = document.querySelector('.swiper-wrapper');
				const savedOffPlanProjects = JSON.parse(localStorage.getItem('favoriteProjects')) || [];

                // Loop through the fetched data and create slides dynamically
                data.projects?.forEach(project => {
                    const slide = document.createElement('div');
                    slide.classList.add('swiper-slide');
					const handover = formatHandoverDate(project.generalInfo.handover);
					const isFavorite = savedOffPlanProjects.some(p => p._id === project._id);

                    // Generate the slide content
                    slide.innerHTML = `
        <a class="swiper-card" href="${'/new-building?project=' + project._id}">
          <div class="rectangle-parent">
			<div class="image-slider-container">
        		<div class="image-wrapper">
          		<img
            		class="frame-child current-image"
            		src="${project.images[0].original}"
            		alt="${project.generalInfo.name}"
					style="transition: opacity 0.3s ease;"
          		/>
        		</div>
        		<button class="card-buttons-swiper-btn-left">
          			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            			<path d="M10.5 5L7.18352 8.5286C6.93883 8.78894 6.93883 9.21106 7.18352 9.4714L10.5 13" stroke="#717171" stroke-width="1.2" stroke-linecap="round"/>
          			</svg>
        		</button>
        		<button class="card-buttons-swiper-btn-right" style="rotate: 180deg">
          			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            			<path d="M7.5 5L10.8165 8.5286C11.0612 8.78894 11.0612 9.21106 10.8165 9.4714L7.5 13" stroke="#717171" stroke-width="1.2" stroke-linecap="round"/>
          			</svg>
        		</button>
      		</div>
            
            <div class="frame-group">
              <div class="off-plan-wrapper"><div class="off-plan">${project.units[0].type
                }</div></div>
              <div class="off-plan-wrapper"><div class="off-plan">${project.units[0].bedrooms
                } beds</div></div>
              <div class="off-plan-wrapper"><div class="off-plan">${project.units[0].size
                } m<sup>2</sup></div></div>
            </div>
            <div class="instance-parent">
              <div class="heart-wrapper">
                <svg
                  class="heart-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="${isFavorite ? '#313131' : 'none'}"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="call-us-wrapper"><div class="off-plan">Call us</div></div>
            </div>
          </div>
          <div class="frame-container">
            <div class="frame-div">
              <div class="marein-natura-parent">
			
   					 <div class="marein-natura">${project.generalInfo.name}</div>
			
                <div class="marbella-spain">${project.generalInfo.province}</div>
              </div>
              <div class="parent">
                <div class="marein-natura">€ ${project.units[0].price.toLocaleString()}</div>
                <div class="m21">€ ${Math.round(
                    project.units[0].price / project.units[0].size
                ).toLocaleString()} m²</div>
              </div>
            </div>
            <div class="frame-item"></div>
            <div class="developer-name-parent">
              <div class="off-plan">${project.generalInfo.developer}</div>
              <div class="off-plan">${handover}</div>
            </div>
          </div>
        </a>
      `;
			const container = slide.querySelector('.image-slider-container');
            const leftButton = container.querySelector('.card-buttons-swiper-btn-left');
            const rightButton = container.querySelector('.card-buttons-swiper-btn-right');
            const image = container.querySelector('.current-image');
			container.dataset.currentIndex = '0';

            function updateImage(direction) {
                const currentIndex = parseInt(container.dataset.currentIndex, 10);
                const totalImages = project.images && project.images.length;

                if (!totalImages) {
                    console.error(`No images available for project ID: ${project._id}`);
                    return;
                }

                let newIndex = direction === 'next'
                    ? (currentIndex + 1) % totalImages
                    : (currentIndex - 1 + totalImages) % totalImages;

                image.style.opacity = '0';
                setTimeout(() => {
                    if (project.images[newIndex]?.original) {
                        image.src = project.images[newIndex].original;
                        image.style.opacity = '1';
                    } else {
                        console.warn(`Missing 'original' field for image at index ${newIndex} in project ID: ${project._id}`);
                    }
                }, 100);

                container.dataset.currentIndex = newIndex;
            }

            leftButton.addEventListener('click', (e) => {
                e.preventDefault();
                updateImage('prev');
            });

            rightButton.addEventListener('click', (e) => {
                e.preventDefault();
                updateImage('next');
            });

 				const heartWrapper = slide.querySelector('.heart-wrapper');
            	heartWrapper.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                console.log('Heart clicked for project:', project._id);
                
                let savedOffPlanProjects = JSON.parse(localStorage.getItem('favoriteProjects')) || [];
                const projectIndex = savedOffPlanProjects.findIndex(p => p._id === project._id);
                const heartIcon = this.querySelector('.heart-icon');

                if (projectIndex > -1) {
                    // Remove from favorites
                    console.log('Removing from favorites');
                    savedOffPlanProjects.splice(projectIndex, 1);
                    heartIcon.setAttribute('fill', 'none');
                } else {
                    // Add to favorites
                    console.log('Adding to favorites');
                    savedOffPlanProjects.push(project);
                    heartIcon.setAttribute('fill', '#313131');
                }

                // Update localStorage
                localStorage.setItem('favoriteProjects', JSON.stringify(savedOffPlanProjects));});
                
				swiperWrapper.appendChild(slide);
                });

                swiper.update();

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        }

function toggleProjectFavorite(project, storageKey) {
    const savedProjects = JSON.parse(localStorage.getItem(storageKey)) || [];
    const projectIndex = savedProjects.findIndex(p => p._id === project._id);
    const favoriteBtn = document.getElementById('add-to-favorites');
    
    if (projectIndex > -1) {
        // Remove project from favorites
        savedProjects.splice(projectIndex, 1);
        favoriteBtn.textContent = 'Add to favorites';
    } else {
        // Add project to favorites
        savedProjects.push(project);
        favoriteBtn.textContent = 'Remove from favorites';
    }

    // Update localStorage
    localStorage.setItem(storageKey, JSON.stringify(savedProjects));
}

function fetchProject() {
  const url = new URL(window.location.href);
  const urlParams = new URLSearchParams(url.search);
  const projectId = urlParams.get('project'); // Get 'project' parameter from URL

  if (projectId) {
    console.log('🚀 Fetching project details for ID:', projectId);
    fetch(`https://xf9m-jkaj-lcsq.p7.xano.io/api:v5maUE6u/properties/${projectId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log('✅ Project data received:', data);
        console.log('📊 Available fields:', Object.keys(data));
        
        // --- 1. Handle Coordinates for Map ---
        if (data.latitude && data.longitude) {
          const coordinates = {
            lat: data.latitude,
            lng: data.longitude,
          };
          // Assuming you have a renderMap function
          renderMap(coordinates);
        }

        // --- 2. Setup Favorites Button ---
        const favoriteBtn = document.getElementById('add-to-favorites');
        if (favoriteBtn) {
            const storageKey = 'favoriteProjects'; // You can use a different key if you want
            const savedProjects = JSON.parse(localStorage.getItem(storageKey)) || [];
            const isProjectFavorite = savedProjects.some(p => p.id === data.id);
            
            favoriteBtn.textContent = isProjectFavorite ? 'Remove from favorites' : 'Add to favorites';
            
            // Clone and replace the button to avoid multiple event listeners
            const newFavoriteBtn = favoriteBtn.cloneNode(true);
            favoriteBtn.parentNode.replaceChild(newFavoriteBtn, favoriteBtn);
            
            newFavoriteBtn.addEventListener('click', () => {
                const projectSummary = {
                    id: data.id,
                    name: data.development_name || data.subtype,
                    image: (data.images && data.images.length > 0) ? data.images[0].image_url : '',
                    price: data.price
                };
                toggleProjectFavorite(projectSummary, storageKey, newFavoriteBtn);
            });
        }
		  
		  
        // --- 3. Get DOM Elements ---
        const projectName = document.getElementById("projectName");
        const projectLocation = document.getElementById("projectLocation");
        const projectPrice = document.getElementById("projectPrice");
        const projectPriceForM = document.getElementById("priceForM");
        const projectType = document.getElementById("projectType");
        const projectRooms = document.getElementById("projectRooms");
        const projectTotalFloors = document.getElementById("projectTotalFloors");
        const projectFloor = document.getElementById("projectFloor"); // Note: New API has 'levels', not a specific floor
        const projectSize = document.getElementById("projectSize");
        const projectDeveloper = document.getElementById("projectDeveloper");
        const projectHandover = document.getElementById("projectHandover");
        const projectDescr = document.getElementById("projectDescr");
        const projectAmenities = document.getElementById("projectAmenities");
        const projectPaymentPlans = document.getElementById("projectPaymentPlans");

        // --- 4. Populate Page with Property Data ---
        console.log('🏗️ Populating page with data...');
        console.log('  - development_name:', data.development_name);
        console.log('  - subtype:', data.subtype);
        console.log('  - price:', data.price);
        console.log('  - town:', data.town);
        console.log('  - province:', data.province);
        
        if (projectName) {
            const nameToUse = data.development_name || data.subtype || 'N/A';
            console.log('  - Setting name to:', nameToUse);
            projectName.textContent = nameToUse;
        } else {
            console.error('  ❌ projectName element not found!');
        }
        
        if (projectLocation) {
            projectLocation.textContent = `${data.town || 'Unknown'}, ${data.province || 'Unknown'}`;
        } else {
            console.error('  ❌ projectLocation element not found!');
        }
        
        if (projectPrice && data.price) {
            projectPrice.textContent = `€ ${data.price.toLocaleString("en-US").replace(/,/g, " ")}`;
        } else {
            console.error('  ❌ projectPrice element not found or price is missing!');
        }
        
        if (projectPriceForM && data.price && data.built_area) {
            projectPriceForM.textContent = `€ ${
                (data.price / data.built_area).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }`;
        }

        // Debug logs for each field
        console.log('🔍 Mapping fields:');
        console.log('  - Type:', data.type);
        console.log('  - Beds:', data.beds);
        console.log('  - Levels:', data.levels);
        console.log('  - Built area:', data.built_area);
        console.log('  - Completion date:', data.completion_date);
        
        if (projectType) projectType.textContent = data.type || 'N/A';
        if (projectRooms) projectRooms.textContent = data.beds || 'N/A';
        if (projectTotalFloors) projectTotalFloors.textContent = data.levels || 'N/A';
        if (projectFloor) projectFloor.textContent = data.levels || 'N/A'; // Using total levels as there's no specific floor number
        if (projectSize && data.built_area) {
            projectSize.textContent = `${data.built_area.toLocaleString("en-US").replace(/,/g, " ")} m²`;
        } else {
            projectSize.textContent = 'N/A';
        }
        if (projectDeveloper) projectDeveloper.textContent = 'N/A'; // Field does not exist in the new API
        if (projectHandover && data.completion_date) {
            projectHandover.textContent = new Date(data.completion_date).toLocaleDateString(); // Simple date format
        } else {
            projectHandover.textContent = 'N/A';
        }
        if (projectDescr) projectDescr.textContent = data.description;

        // --- 5. Handle Image Gallery ---
		if (data.images && data.images.length > 0) {
			window.imagesSecondary = data.images.map(item => item.image_url);
			imagesSecondary =data.images.map(item => item.image_url);
            images = data.images.map(item => item.image_url);
            console.log("Images populated:", images);
        
            const galleryImage = document.getElementById("galleryImage");
            const sliderImage = document.getElementById("sliderImage");
            const projectMainImg = document.getElementById("projectMainImg");

            if (galleryImage) galleryImage.src = images[0];
            if (projectMainImg) projectMainImg.src = images[0];
            if (sliderImage) sliderImage.src = images[0];
			  
            // Assuming createDots and updateDots are global functions
            createDots();
			updateDots();
		} else {
			console.warn("No images available in the project data.");
		}
          
        // --- 6. Handle Amenities ---
        if (projectAmenities && data._category_values_of_properties) {
            projectAmenities.innerHTML = ''; // Clear existing
            const amenitiesList = data._category_values_of_properties.map(amenity => amenity.value).join(", ");
            const span = document.createElement("span");
            span.className = "about-card-amenity";
            span.textContent = amenitiesList;
            projectAmenities.appendChild(span);
        }

        // --- 7. Handle Removed Sections ---
        // The new API does not support a payment plan or a list of units for a project.
        if (projectPaymentPlans) {
            projectPaymentPlans.innerHTML = '<p>Payment plan not available for this property.</p>';
            // Or you could hide the parent container entirely:
            // projectPaymentPlans.parentElement.style.display = 'none';
        }
        
        const unitsContainer = document.getElementById("projectUnits");
        if (unitsContainer) {
             unitsContainer.innerHTML = '<p>Unit information is not applicable for this property type.</p>';
             // Or hide it:
             // unitsContainer.parentElement.style.display = 'none';
        }

		// fetchAndRenderSlides() // If you need this, ensure it's defined
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  } else {
    console.log("No 'project' query string found in the URL");
  }
}

fetchProject();

function loadLeafletCSS() {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
    document.head.appendChild(link);
}

function loadLeafletJS() {
    return new Promise((resolve, reject) => {
        var script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";
        script.onload = resolve;  
        script.onerror = reject; 
        document.body.appendChild(script);
    });
}

async function renderMap(coordinates) {
    loadLeafletCSS();  
    await loadLeafletJS(); 

    // Инициализация карты
    var map = L.map('mapOffPlanById', {
        center: [coordinates.lat, coordinates.lng], // Используем переданные координаты
        zoom: 10,
        minZoom: 5,
        maxZoom: 18,
        zoomControl: false,
        scrollWheelZoom: false // Отключаем прокрутку колесиком по умолчанию
    });
    
    // Добавляем тайловый слой
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
	
	var zoomInButton = document.getElementById('zoom-in-project');
	var zoomOutButton = document.getElementById('zoom-out-project');

	zoomInButton.addEventListener('click', function() {
		map.zoomIn();
	});

	zoomOutButton.addEventListener('click', function() {
		map.zoomOut();
	});

    // Включаем прокрутку колесиком только при зажатом Shift
    map.on('keydown', function (e) {
        if (e.originalEvent.shiftKey) {
            map.scrollWheelZoom.enable(); // Включаем зумирование колесиком
        }
    });

    map.on('keyup', function (e) {
        if (!e.originalEvent.shiftKey) {
            map.scrollWheelZoom.disable(); // Отключаем зумирование колесиком
        }
    });

    // Определяем стиль точки
    const redDotIcon = L.divIcon({
        className: 'custom-dot', // Класс для стилизации
        iconSize: [17.5, 17.5],
        iconAnchor: [8.75, 8.75]
    });
    
    // Добавляем маркер с кастомным стилем на карту
    L.marker([coordinates.lat, coordinates.lng], { icon: redDotIcon }).addTo(map);
}
		
    document.getElementById('backButton').addEventListener('click', goBackWithScrollPosition);

    function goBackWithScrollPosition() {
        // Получаем параметры из текущего URL
        const urlParams = new URLSearchParams(window.location.search);
        const scrollPosition = urlParams.get('scrollPosition') || 0; // Используем 0 по умолчанию

        // Получаем предыдущий URL из истории и добавляем к нему `scrollPosition`
        const previousURL = document.referrer; // Предыдущий URL
        if (previousURL) {
            const modifiedURL = new URL(previousURL);
            modifiedURL.searchParams.set('scrollPosition', scrollPosition); // Устанавливаем параметр

            // Переходим на модифицированный URL
            window.location.href = modifiedURL.toString();
        } else {
            // Если нет предыдущего URL, просто используем `history.back()`
            window.history.back();
        }
    }
		
		// Сохраняем позицию скролла при уходе со страницы
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('scrollPosition', window.scrollY);
});

// Восстанавливаем позицию скролла при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition !== null) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
        sessionStorage.removeItem('scrollPosition'); // Очистка после восстановления
    }
});

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});
		
document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
  const headerContainer = document.getElementById("header");
  const projectInquiryContainer = document.getElementById("projectInquirySection");
  const feedbackFormContainer = document.getElementById("feedbackBlock");
  const footerContainer = document.getElementById("footer");
  renderOffPlan(mainContent);
  headerContainer.appendChild(Header());
  if (projectInquiryContainer) {
    projectInquiryContainer.appendChild(ProjectInquiryForm());
  }
  feedbackFormContainer.appendChild(FeedbackForm());
  footerContainer.appendChild(Footer());
//   initializeImageSliders();
  
  })
</script>

<!-- Pricelist Modal -->
<div id="pricelistModal" class="pricelist-modal">
  <div class="pricelist-modal-overlay" id="pricelistModalOverlay"></div>
  <div class="pricelist-modal-content">
    <div class="pricelist-modal-header">
      <h2 class="pricelist-modal-title">Request Pricelist</h2>
      <button class="pricelist-modal-close" id="pricelistModalClose">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <form class="pricelist-form" id="pricelistForm">
      <div class="pricelist-form-group">
        <label for="pricelistName" class="pricelist-form-label">Name</label>
        <input 
          type="text" 
          id="pricelistName" 
          name="name" 
          class="pricelist-form-input" 
          placeholder="Enter your name"
          required
        />
      </div>
      <div class="pricelist-form-group">
        <label for="pricelistPhone" class="pricelist-form-label">Phone Number</label>
        <input 
          type="tel" 
          id="pricelistPhone" 
          name="phone" 
          class="pricelist-form-input" 
          placeholder="Enter your phone number"
          required
        />
      </div>
      <button type="submit" class="pricelist-form-submit">
        Submit
      </button>
    </form>
  </div>
</div>

<script>
// Pricelist Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
  const pricelistBtn = document.getElementById('pricelist-btn');
  const pricelistModal = document.getElementById('pricelistModal');
  const pricelistModalClose = document.getElementById('pricelistModalClose');
  const pricelistModalOverlay = document.getElementById('pricelistModalOverlay');
  const pricelistForm = document.getElementById('pricelistForm');

  // Open modal
  if (pricelistBtn) {
    pricelistBtn.addEventListener('click', function() {
      pricelistModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Close modal function
  function closeModal() {
    pricelistModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close on X button
  if (pricelistModalClose) {
    pricelistModalClose.addEventListener('click', closeModal);
  }

  // Close on overlay click
  if (pricelistModalOverlay) {
    pricelistModalOverlay.addEventListener('click', closeModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && pricelistModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle form submission
  if (pricelistForm) {
    pricelistForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('pricelistName').value;
      const phone = document.getElementById('pricelistPhone').value;
      
      // Here you can add your form submission logic
      console.log('Pricelist request:', { name, phone });
      
      // Show success message
      alert('Thank you! Your pricelist request has been submitted.');
      
      // Reset form and close modal
      pricelistForm.reset();
      closeModal();
    });
  }
});
</script>

<?php

get_footer();
