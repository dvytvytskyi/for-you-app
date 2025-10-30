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
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/assets/liked-properties.css">
<script src="<?php echo get_template_directory_uri(); ?>/js/simple-likes.js"></script>
<!-- jsPDF library for PDF export -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<main id="main-content">
	<nav id="bottom-navbar" class="bottom-nav">
	</nav>
    <div class="frame-parent">
        <div class="dropdown-parent">
            <div class="our-blog">Favorite Projects <span id="liked-count-title"></span></div>
            <div class="dropdown">
                <div class="label-drop">Last 3 months</div>
                <img
                    class="arrow-down-icon"
                    alt="Dropdown Arrow"
                    src="<?php echo get_template_directory_uri(); ?>/assets/blog-sorting/arrow_down.svg" />

                <div class="filter__select--body">
                    <p data-value="Last month">Last month</p>
                    <p data-value="Last 3 months">Last 3 months</p>
                    <p data-value="Last 6 months">Last 6 months</p>
                    <p data-value="Last year">Last year</p>
                </div>
            </div>
			<div class="fav-buttons">
				<button class="copy_link">Copy link</button>
				<button id="export_pdf" class="filtersMap__clearBtn" style="background-color: #2196F3;">Export PDF</button>
				<button id="clear_favourites" class="filtersMap__clearBtn">Clear</button>
			</div>
        </div>
        <div id="projects" class="card-parent"></div>
</main>

<script>

// Update liked count in title
function updateLikedCountTitle() {
    const count = window.getLikedCount ? window.getLikedCount() : 0;
    const titleElement = document.getElementById('liked-count-title');
    if (titleElement) {
        titleElement.textContent = count > 0 ? `(${count})` : '';
    }
}

// Update count on page load
document.addEventListener('DOMContentLoaded', updateLikedCountTitle);
setTimeout(updateLikedCountTitle, 500); // Also try after short delay

// Update count when likes change
document.addEventListener('likesUpdated', updateLikedCountTitle);

document.querySelector('#clear_favourites').addEventListener('click', () => {
    // Clear all liked properties using the simple system
    if (window.clearAllLikes) {
        window.clearAllLikes();
    } else {
        // Fallback to old system
        localStorage.removeItem('favoriteSecondaryProjects');
        localStorage.removeItem('favoriteSecondaryProjects');
        localStorage.removeItem('favoriteProjects');
        renderOffPlanProjects();
    }
    // Dispatch event to update badge
    if (window.dispatchLikesUpdateEvent) {
        window.dispatchLikesUpdateEvent();
    }
    // Update the count in title
    updateLikedCountTitle();
});

// Export to PDF functionality
document.querySelector('#export_pdf').addEventListener('click', async () => {
    const button = document.querySelector('#export_pdf');
    const originalText = button.textContent;
    
    try {
        button.textContent = 'Generating PDF...';
        button.disabled = true;
        
        // Get favorite projects from localStorage
        const favoriteProjects = JSON.parse(localStorage.getItem('favoriteProjects')) || [];
        const favoriteSecondaryProjects = JSON.parse(localStorage.getItem('favoriteSecondaryProjects')) || [];
        
        if (favoriteProjects.length === 0 && favoriteSecondaryProjects.length === 0) {
            alert('No favorite projects to export');
            button.textContent = originalText;
            button.disabled = false;
            return;
        }
        
        // Initialize jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        let yPosition = 20;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;
        const lineHeight = 7;
        
        // Add title
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('Pro-Part - Favorite Projects', margin, yPosition);
        yPosition += 15;
        
        // Add date
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
        yPosition += 10;
        
        // Add separator line
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, 190, yPosition);
        yPosition += 10;
        
        // Function to add a project to PDF
        const addProjectToPDF = (project, index, type) => {
            // Check if we need a new page
            if (yPosition > pageHeight - 60) {
                doc.addPage();
                yPosition = 20;
            }
            
            // Project number and type
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`${index + 1}. ${project.development_name || project.name || 'Project'}`, margin, yPosition);
            yPosition += 8;
            
            // Type badge
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`[${type}]`, margin, yPosition);
            yPosition += 8;
            doc.setTextColor(0, 0, 0);
            
            // Location
            doc.setFontSize(10);
            const location = [project.town, project.province, project.country].filter(Boolean).join(', ');
            if (location) {
                doc.text(`Location: ${location}`, margin + 5, yPosition);
                yPosition += lineHeight;
            }
            
            // Price
            if (project.price) {
                doc.setFont(undefined, 'bold');
                doc.text(`Price: ${project.currency || 'EUR'} ${project.price.toLocaleString()}`, margin + 5, yPosition);
                doc.setFont(undefined, 'normal');
                yPosition += lineHeight;
            }
            
            // Details
            const details = [];
            if (project.beds) details.push(`${project.beds} beds`);
            if (project.baths) details.push(`${project.baths} baths`);
            if (project.built_area) details.push(`${project.built_area} m²`);
            if (project.plot_area) details.push(`${project.plot_area} m² plot`);
            
            if (details.length > 0) {
                doc.text(`Details: ${details.join(' • ')}`, margin + 5, yPosition);
                yPosition += lineHeight;
            }
            
            // Description
            if (project.description) {
                doc.setFontSize(9);
                const descriptionLines = doc.splitTextToSize(project.description.substring(0, 200) + '...', 170);
                descriptionLines.slice(0, 3).forEach(line => {
                    if (yPosition > pageHeight - 20) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    doc.text(line, margin + 5, yPosition);
                    yPosition += 5;
                });
                doc.setFontSize(10);
            }
            
            yPosition += 5;
            
            // Add separator
            doc.setDrawColor(230, 230, 230);
            doc.line(margin, yPosition, 190, yPosition);
            yPosition += 8;
        };
        
        // Add Off-Plan Projects
        if (favoriteProjects.length > 0) {
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text('Off-Plan Projects', margin, yPosition);
            yPosition += 10;
            doc.setFont(undefined, 'normal');
            
            favoriteProjects.forEach((project, index) => {
                addProjectToPDF(project, index, 'Off-Plan');
            });
        }
        
        // Add Secondary Projects
        if (favoriteSecondaryProjects.length > 0) {
            if (favoriteProjects.length > 0) {
                yPosition += 5;
            }
            
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text('Secondary Market Projects', margin, yPosition);
            yPosition += 10;
            doc.setFont(undefined, 'normal');
            
            favoriteSecondaryProjects.forEach((project, index) => {
                addProjectToPDF(project, index, 'Secondary');
            });
        }
        
        // Add footer to all pages
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} of ${totalPages}`, margin, pageHeight - 10);
            doc.text('Pro-Part.es | +34 695 113 333', 105, pageHeight - 10, { align: 'center' });
        }
        
        // Save the PDF
        const fileName = `ProPart_Favorites_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        button.textContent = 'Exported!';
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
        button.textContent = originalText;
        button.disabled = false;
    }
});
	
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
            { "value": "Málaga", "label": "Málaga" },
            { "value": "Torremar", "label": "Torremar" },
            { "value": "Alhaurín de la Torre", "label": "Alhaurín de la Torre" },
            { "value": "Torremolinos Centro", "label": "Torremolinos Centro" },
            { "value": "Lauro Golf", "label": "Lauro Golf" },
            { "value": "Málaga Este", "label": "Málaga Este" },
            { "value": "Playamar", "label": "Playamar" },
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
            { "value": "Sierra Blanca", "label": "Sierra Blanca" },
            { "value": "Nagüeles", "label": "Nagüeles" },
            { "value": "Nueva Andalucía", "label": "Nueva Andalucía" },
            { "value": "Elviria", "label": "Elviria" },
            { "value": "Aloha", "label": "Aloha" },
            { "value": "Puerto de Cabopino", "label": "Puerto de Cabopino" },
            { "value": "The Golden Mile", "label": "The Golden Mile" },
            { "value": "Puerto Banús", "label": "Puerto Banús" },
            { "value": "Artola", "label": "Artola" },
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
            { "value": "Benahavís", "label": "Benahavís" },
            { "value": "La Heredia", "label": "La Heredia" },
            { "value": "Los Arqueros", "label": "Los Arqueros" },
            { "value": "La Zagaleta", "label": "La Zagaleta" },
            { "value": "El Madroñal", "label": "El Madroñal" },
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
            { "value": "Benalmadena Costa", "label": "Benalmadena Costa" },
            { "value": "Torrequebrada", "label": "Torrequebrada" },
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
  <button class="button callUsButtonWhite" onclick="window.location.href='tel:+34695113333';"></button>
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
                const queryString = window.location.search.substring(1);

                // IDs для отображения фильтров
                const bedroomsContainer = document.getElementById("selectValueHeaderBedrooms");
                const priceContainer = document.getElementById("selectValueHeaderPrice");
                const sizeContainer = document.getElementById("selectValueHeaderSize");
                const handoverContainer = document.getElementById("selectValueHeaderHandover");
                const locationContainer = document.getElementById("selectValueHeaderFilterLocation");

                // Функция очистки всех значений фильтров
                function clearFilterValues() {
                    if (bedroomsContainer) bedroomsContainer.innerHTML = "";
                    if (priceContainer) priceContainer.innerHTML = "";
                    if (sizeContainer) sizeContainer.innerHTML = "";
                    if (handoverContainer) handoverContainer.innerHTML = "";
                    if (locationContainer) locationContainer.innerHTML = "";
                }

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
            setTimeout(renderValueFilterFromQueryHeader, 0);

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
				const newUrl = `/${language && "/" + language}/${newPath}?${urlParams.toString()}`;
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
    { text: "New building", url: `${language && "/" + language}/new-buildings?page=0&visible=Off+plan` },
    {
      text: "Secondary",
      url: `${language && "/" + language}/secondaries?page=0&visible=Secondary`,
    },
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

  return newPath.startsWith('/') ? newPath : `/${newPath}`;
}
        languages.forEach((lang) => {
            const listItem = createElement("a");
            listItem.className = "language-item";

            const flagImage = createElement("img");
            flagImage.src = lang.flagUrl;
            flagImage.alt = `${lang.name} flag`;
            flagImage.className = "language-flag";
            listItem.appendChild(flagImage);

            const langText = createElement("span");
            langText.innerText = `${lang.code}`;
			listItem.href = updateLanguage({ code: lang.code })
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

            if (currentHash === "secondary" && window.innerWidth <= 768) {
                navBtm.classList.toggle("showNavBottom1");
                navBtm.classList.toggle("showNavBottom");
            }
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
            (currentRoute === "/secondary" || currentRoute === "/secondary-projects") &&
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
                (currentRoute === "/secondary" || currentRoute === "/secondary-projects") &&
                window.innerWidth <= 1440
            ) {
                link.classList.add("active-bottom");
            }
        } else {
            link.classList.remove("active");
        }
    });

    if (
        (currentRoute === "/secondary" || currentRoute === "/secondary-projects") &&
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
        (currentRoute === "/secondary" || currentRoute === "/secondary-projects") &&
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
        (currentRoute === "/secondary" || currentRoute === "/secondary-projects") &&
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
`;
document.head.appendChild(style);
   
    const blogs = []
    console.log(blogs)


let currentBlogs = [];
const renderCurrentBlogs = (pagesData) => {
  const newsCardParent = document.querySelector(".news-card-parent");
  
  newsCardParent.innerHTML = "";

  pagesData.map(blog => {
    const blogCard = document.createElement("a");
    blogCard.className = "news-card";
    blogCard.href = `/blog/?id=${blog.id}`;
	  
	const trimmedDescription = blog.opisanie.replace(/<[^>]+>/g, "").length > 100 
      ? blog.opisanie.replace(/<[^>]+>/g, "").substring(0, 100) + "..." 
      : blog.opisanie.replace(/<[^>]+>/g, "");

    blogCard.innerHTML = `
      <div>
                 <div class="frame-child-photo">
        <img class="news-card-child" alt="Blog Image" src="${blog.image}" />
      </div>
      <div class="aug-2024-parent">
        <div class="all-properties">${blog.date}</div>
        <div class="line-div"></div>
        <div class="discover-the-hottest-container">
          <p class="discover-the-hottest">${blog.title}</p>
          <p class="discover-the-hottest">${blog.nazvanie_bloga}</p>
        </div>
      </div>
      <div class="explore-the-top" id="blogDescription">
		${trimmedDescription}
      </div>
      </div>
      <div class="button-back-wrapper">
        <div class="button-back">
          <div>
            <div class="all-properties">Read more</div>
          </div>
        </div>
      </div>
    `;

    newsCardParent.appendChild(blogCard);
  });
};

    const Pagination = (totalItems) => {
  const pagination = document.createElement("div");
  pagination.className = "pagination";

  // Рассчитываем количество страниц (по 9 элементов на страницу)
  const itemsPerPage = 9;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Получаем текущую страницу из query parameter
  const urlParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(urlParams.get("page")) || 1;

  const updateCurrentBlogs = (pagesData) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    currentBlogs = blogs.slice(startIndex, endIndex);
    renderCurrentBlogs(pagesData); // Отрисовка текущих блогов
  };

  const onPageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    // Обновляем query parameter при изменении страницы
    urlParams.set("page", page);
    window.history.pushState({}, "", `?${urlParams.toString()}`);

    currentPage = page;
    updateCurrentBlogs(); // Обновляем текущие блоги для новой страницы
    renderPagination();
  };

  const createPageItem = (page) => {
    const pageItem = document.createElement("span");
    pageItem.className = "page-number";
    pageItem.innerText = page;
    if (page === currentPage) {
      pageItem.classList.add("active");
    }
    pageItem.addEventListener("click", () => {
      onPageChange(page);
    });
    return pageItem;
  };

  const createButton = (label, disabled, onClick) => {
    const button = document.createElement("button");
    button.className = `pagination-button pagination-button-${label}`;
    button.innerHTML = `<img src="<?php echo get_template_directory_uri(); ?>/icons/newbuilding/${label}.svg" alt="${label}" />`;
    if (disabled) {
      button.disabled = true;
      button.classList.add("disabled");
    }
    button.addEventListener("click", onClick);
    return button;
  };

  const createDots = () => {
    const dots = document.createElement("span");
    dots.className = "dots";
    dots.innerText = "...";
    return dots;
  };

  const renderPagination = () => {
    pagination.innerHTML = "";

    const screenWidth = window.innerWidth;
    const maxVisiblePages = screenWidth <= 500 ? 3 : 7;

    let startPage = 1;
    let endPage = Math.min(totalPages, maxVisiblePages);

    if (totalPages > maxVisiblePages) {
      if (currentPage > maxVisiblePages - 2) {
        startPage = currentPage - Math.floor(maxVisiblePages / 2);
        endPage = currentPage + Math.floor(maxVisiblePages / 2);

        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = endPage - maxVisiblePages + 1;
        }
        if (startPage < 1) {
          startPage = 1;
        }
      }
    }

    pagination.appendChild(
      createButton("prev", currentPage === 1, () =>
        onPageChange(currentPage - 1)
      )
    );

    if (startPage > 1) {
      pagination.appendChild(createPageItem(1));
      if (startPage > 2) {
        pagination.appendChild(createDots());
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      pagination.appendChild(createPageItem(page));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pagination.appendChild(createDots());
      }
      pagination.appendChild(createPageItem(totalPages));
    }

    pagination.appendChild(
      createButton("next", currentPage === totalPages, () =>
        onPageChange(currentPage + 1)
      )
    );
  };

  window.addEventListener("resize", renderPagination);

  var pagesData = <?php echo json_encode(get_all_blog_posts_list()); ?>;
  // Инициализация текущих блогов и рендера пагинации при загрузке
  updateCurrentBlogs(pagesData);
  renderPagination();

  return pagination;
};


    function renderblogsortingPage(mainContent) {
        const paginationContainer = mainContent.querySelector(
            "#pagination-container"
        );
        if (paginationContainer) {
            console.log("Found pagination container");
            var pagesData = <?php echo json_encode(get_all_blog_posts_list()); ?>;
            var pagesDataLength = pagesData.length;
            console.log(pagesData);
            const pagination = Pagination(pagesDataLength);
            paginationContainer.appendChild(pagination);
        }

        let activeDropdown = null;

        const setupDropdown = () => {
            const dropdown = document.querySelector(".dropdown");
            const body = document.querySelector(".filter__select--body");
            const options = body.querySelectorAll("p");
            const label = dropdown.querySelector(".label-drop");

            const toggleDropdown = (e) => {
                e.stopPropagation();

                if (activeDropdown && activeDropdown !== dropdown) {
                    activeDropdown.querySelector(".filter__select--body").style.display =
                        "none";
                    activeDropdown.querySelector(".dropdown").classList.remove("active");
                }

                const isCurrentlyActive = body.style.display === "block";
                body.style.display = isCurrentlyActive ? "none" : "block";
                dropdown.classList.toggle("active", !isCurrentlyActive);

                if (!isCurrentlyActive) {
                    activeDropdown = dropdown;
                } else {
                    activeDropdown = null;
                }
            };

            dropdown.addEventListener("click", toggleDropdown);

            body.addEventListener("click", (e) => {
                e.stopPropagation();
            });


            function formatSelection(value) {
                switch (value) {
                    case 'Last month':
                        return 'month';
                    case 'Last 3 months':
                        return '3-month';
                    case 'Last 6 months':
                        return '6-month';
                    case 'Last year':
                        return 'year';
                    default:
                        return `Selected: ${value}`;
                }
            }

            function updateURLParameter(param, value) {
    // Получаем текущий URL
    const url = new URL(window.location.href);

    // Если значение есть, добавляем или обновляем параметр
    if (value) {
        url.searchParams.set(param, value);
    } else {
        // Если значение пустое, удаляем параметр
        url.searchParams.delete(param);
    }

    // Обновляем URL независимо от того, добавляем или удаляем параметр
    window.history.replaceState({}, '', url);
}


            options.forEach((option) => {
                option.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const selectedValue = e.target.getAttribute("data-value");
                    console.log(`Selected: ${selectedValue}`);
                    updateURLParameter("sort",formatSelection(selectedValue));
                    label.textContent = selectedValue;
                    body.style.display = "none";
                    dropdown.classList.remove("active");
                    activeDropdown = null;
                });
            });
        };

        document.addEventListener("click", () => {
            if (activeDropdown) {
                const body = activeDropdown.querySelector(".filter__select--body");
                body.style.display = "none";
                activeDropdown.classList.remove("active");
                activeDropdown = null;
            }
        });

        setupDropdown();
    }
	
function formatPrice(price) {
    	const num = parseInt(price, 10);
    if (num >= 1000000) {
        return num / 1000000 + "M";
   } else if (num >= 1000) {
		return num / 1000 + "K";
   }
   return num.toString();
}

function formatHandoverDate(handoverArray) {
            // Add safety check for handover array
            if (!handoverArray || !Array.isArray(handoverArray) || handoverArray.length < 2) {
                return '';
            }
            
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
	
function saveToLocalStorage(key, project) {
    if (!project || !project._id) {
        console.warn('Project or project ID is missing:', project);
        return;
    }
    
    const savedProjects = JSON.parse(localStorage.getItem(key)) || [];
    const projectIndex = savedProjects.findIndex(p => p._id === project._id);
    
    if (projectIndex > -1) {
        // Remove project from favorites
        savedProjects.splice(projectIndex, 1);
    } else {
        // Add project to favorites
        savedProjects.push(project);
    }

    // Update localStorage
    localStorage.setItem(key, JSON.stringify(savedProjects));
}
	
function isProjectInFavorites(key, projectId) {
    if (!projectId) {
        return false;
    }
    const savedProjects = JSON.parse(localStorage.getItem(key)) || [];
    return savedProjects.some(p => p._id === projectId);
}
	
function createProjectCard(project) {
    // Add safety check for project structure
    if (!project || !project.generalInfo) {
        console.warn('Project or generalInfo is missing:', project);
        // Return a basic card with error message instead of null
        const errorCard = document.createElement("div");
        errorCard.className = "card error-card";
        errorCard.innerHTML = '<p>Project data incomplete</p>';
        return errorCard;
    }
    
    const { generalInfo, images, units } = project;
    
    // Use fallback values instead of returning null
    const projectName = generalInfo.name || 'Unnamed Project';
    const projectImage = images && images[0] ? images[0].original : '/path/to/default-image.jpg';
    const projectUnits = units && units[0] ? units[0] : {};
    
    const card = document.createElement("a");
    card.className = "card";
    card.href = `/new-building?project=${project._id}`;
    card.addEventListener('click', function(event) {
        const clickedElement = event.target;
        // Scroll to top only if the user clicked outside the heart icon
        if (!clickedElement.closest('.heart-wrapper')) {
            window.scrollTo(0, 0);
        }
    });

    const handover = formatHandoverDate(generalInfo.handover) || '';

	const isFavorite = isProjectInFavorites('favoriteProjects', project._id);
	
    card.innerHTML = `
    <div>
      <div class="rectangle-parent">
        <img class="frame-child" src="${projectImage}" alt="${projectName}" />
        <div class="frame-group">
          <div class="off-plan-wrapper"><div class="off-plan">${projectUnits.type || 'Property'}</div></div>
          <div class="off-plan-wrapper"><div class="off-plan">${projectUnits.bedrooms || '0'} beds</div></div>
          <div class="off-plan-wrapper"><div class="off-plan">${projectUnits.size || '0'} m<sup>2</sup></div></div>
        </div>
        <div class="instance-parent">
          <div class="heart-wrapper">
            <svg class="heart-icon" width="24" height="24" viewBox="0 0 24 24" fill="${isFavorite ? '#313131' : 'none'}" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="call-us-wrapper"><div class="off-plan">Call us</div></div>
        </div>
      </div>
      <div class="frame-container">
        <div class="frame-div">
          <div class="marein-natura-parent">
            <div class="marein-natura">${projectName}</div>
            <div class="marbella-spain">${generalInfo.province || 'Unknown'}</div>
          </div>
          <div class="parent">
            <div class="marein-natura">€ ${projectUnits.price?.toLocaleString() || '0'}</div>
            <div class="m21">€ ${projectUnits.price && projectUnits.size ? (projectUnits.price / projectUnits.size).toLocaleString() : '0'} m<sup>2</sup></div>
          </div>
        </div>
        <div class="developer-name-parent">
          <div class="off-plan">${generalInfo.developer || 'Unknown Developer'}</div>
          <div class="off-plan">${handover}</div>
        </div>
      </div>
    </div>`;
	
	card.querySelector('.heart-wrapper').addEventListener('click', function(event) {
        event.preventDefault();
        
        let savedProjects = JSON.parse(localStorage.getItem('favoriteProjects')) || [];
        const projectIndex = savedProjects.findIndex(p => p._id === project._id);
        const heartIcon = this.querySelector('.heart-icon');

        if (projectIndex > -1) {
            // Remove from favorites
            savedProjects.splice(projectIndex, 1);
            heartIcon.setAttribute('fill', 'none');
        } else {
            // Add to favorites
            savedProjects.push(project);
            heartIcon.setAttribute('fill', '#313131');
        }

        // Update localStorage
        localStorage.setItem('favoriteProjects', JSON.stringify(savedProjects));
        
        // Dispatch event to update badge
        if (window.dispatchLikesUpdateEvent) {
            window.dispatchLikesUpdateEvent();
        }
    });
	
    return card;
}

function createSecondaryProjectCard(project) {
    // Add safety check for project structure
    if (!project) {
        console.warn('Project is missing:', project);
        // Return a basic card with error message instead of null
        const errorCard = document.createElement("div");
        errorCard.className = "card error-card";
        errorCard.innerHTML = '<p>Project data incomplete</p>';
        return errorCard;
    }
    
    // Secondary projects have properties directly on the project object, not in generalInfo
    const projectName = project.development_name || project.type || 'Unnamed Project';
    // Check for different possible image property names
    let projectImage = '/path/to/default-image.jpg';
    if (project.images && project.images[0]) {
        console.log('Image structure:', project.images[0]);
        projectImage = project.images[0].original || project.images[0].url || project.images[0];
    }
    
    const card = document.createElement("a");
    card.className = "card";
    card.href = `/secondary?project=${project.id}`;
    card.addEventListener('click', function(event) {
        const clickedElement = event.target;
        // Scroll to top only if the user clicked outside the heart icon
        if (!clickedElement.closest('.heart-wrapper')) {
            window.scrollTo(0, 0);
        }
    });

	const isFavorite = isProjectInFavorites('favoriteSecondaryProjects', project.id);
	
    card.innerHTML = `<div>
      <div class="rectangle-parent">
        <img class="frame-child" src="${projectImage}" alt="${projectName}" />
        <div class="instance-parent">
          <div class="heart-wrapper">
            <svg class="heart-icon" width="24" height="24" viewBox="0 0 24 24" fill="${isFavorite ? '#313131' : 'none'}" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="call-us-wrapper"><div class="off-plan">Call us</div></div>
        </div>
      </div>
      <div class="frame-container">
        <div class="frame-div">
          <div class="marein-natura-parent">
            <div class="marein-natura">${projectName}</div>
            <div class="marbella-spain">${project.province || project.town || 'Unknown'}, Spain</div>
          </div>
          <div class="parent">
            <div class="marein-natura">€ ${project.price?.toLocaleString() || '0'}</div>
            <div class="m21">€ ${project.price && project.built_area ? (project.price / project.built_area).toLocaleString() : '0'} m<sup>2</sup></div>
          </div>
        </div>
        <div class="developer-name-parent">
          <div class="off-plan">${project.type || 'Property'}</div>
          <div class="off-plan">Size: ${project.built_area || '0'} sq.m</div>
        </div>
      </div>
    </div>`;
	
	card.querySelector('.heart-wrapper').addEventListener('click', function(event) {
        event.preventDefault();
        
        let savedSecondaryProjects = JSON.parse(localStorage.getItem('favoriteSecondaryProjects')) || [];
        const projectIndex = savedSecondaryProjects.findIndex(p => p.id === project.id);
        const heartIcon = this.querySelector('.heart-icon');

        if (projectIndex > -1) {
            // Remove from favorites
            savedSecondaryProjects.splice(projectIndex, 1);
            heartIcon.setAttribute('fill', 'none');
        } else {
            // Add to favorites
            savedSecondaryProjects.push(project);
            heartIcon.setAttribute('fill', '#313131');
        }

        // Update localStorage
        localStorage.setItem('favoriteSecondaryProjects', JSON.stringify(savedSecondaryProjects));
        
        // Dispatch event to update badge
        if (window.dispatchLikesUpdateEvent) {
            window.dispatchLikesUpdateEvent();
        }
    });
	
    return card;
}

	function renderOffPlanProjects() {
    const projectsContainer = document.getElementById('projects');
    const savedOffPlanProjects = JSON.parse(localStorage.getItem('favoriteProjects')) || [];
    const savedSecondaryProjects = JSON.parse(localStorage.getItem('favoriteSecondaryProjects')) || [];
	
    // Clear the container first
    projectsContainer.innerHTML = '';
    
    // Check if there are any projects at all
    if (savedOffPlanProjects.length === 0 && savedSecondaryProjects.length === 0) {
        projectsContainer.innerHTML = '<p>There are no favorite projects</p>';
        return;
    }
    
    // Render off-plan projects
    savedOffPlanProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsContainer.appendChild(projectCard);
    });
    
    // Render secondary projects
    savedSecondaryProjects.forEach(project => {
        const projectCard = createSecondaryProjectCard(project);
        projectsContainer.appendChild(projectCard);
    });
}
function renderShareProjects(id) {
    if (!id) {
        return;
    }
    const offPlanProjectsContainer = document.getElementById('projects');
    fetch(`https://crm.server.pro-part.es/api/v1/share-projects/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
             data.offPlan.forEach(project => {
            const projectCard = createProjectCard(project);
            offPlanProjectsContainer.appendChild(projectCard);
        });
 			data.secondary.forEach(project => {
            const projectCard = createSecondaryProjectCard(project);
            offPlanProjectsContainer.appendChild(projectCard);
        });
        })
        .catch(error => {
            console.error("Ошибка при запросе данных проекта:", error);
        });
}

	


    document.addEventListener("DOMContentLoaded", () => {
        const headerContainer = document.getElementById("header");
        const mainContent = document.getElementById("main-content");
        const feedbackFormContainer = document.getElementById("feedbackBlock");
        const footerContainer = document.getElementById("footer");
        console.log()
        renderblogsortingPage(mainContent);
        headerContainer.appendChild(Header());
        feedbackFormContainer.appendChild(FeedbackForm());
        footerContainer.appendChild(Footer());
    });
	
	// Create card functions for new like system
	window.createProjectCardForLiked = function(property) {
		// Adapt the API response to match old format
		const adaptedProject = {
			_id: property.id,
			generalInfo: {
				name: property.development_name || property.name,
				province: property.province,
				developer: property.developer || 'Unknown Developer',
				handover: property.handover
			},
			images: property.images ? property.images.map(img => ({ original: img.image_url })) : [],
			units: [{
				type: property.type || 'Property',
				bedrooms: property.beds,
				size: property.built_area,
				price: property.price
			}]
		};
		
		const card = createProjectCard(adaptedProject);
		
		// Set correct initial heart state based on new like system
		const heartIcon = card.querySelector('.heart-icon');
		if (heartIcon && window.isLiked) {
			heartIcon.setAttribute('fill', window.isLiked(property.id) ? '#313131' : 'none');
		}
		
		// Update heart click to use new system
		const heartWrapper = card.querySelector('.heart-wrapper');
		if (heartWrapper) {
			heartWrapper.replaceWith(heartWrapper.cloneNode(true));
			const newHeartWrapper = card.querySelector('.heart-wrapper');
			newHeartWrapper.addEventListener('click', function(event) {
				event.preventDefault();
				event.stopPropagation();
				
				if (window.toggleLike) {
					const isLiked = window.toggleLike(property.id);
					const heartIcon = this.querySelector('.heart-icon');
					if (heartIcon) {
						heartIcon.setAttribute('fill', isLiked ? '#313131' : 'none');
					}
					
					// Reload the page to update the list
					if (!isLiked) {
						setTimeout(() => window.loadLikedProperties(), 100);
					}
				}
			});
		}
		
		return card;
	};
	
	window.createSecondaryProjectCardForLiked = function(property) {
		// Secondary properties are already in the right format
		const card = createSecondaryProjectCard(property);
		
		// Set correct initial heart state based on new like system
		const heartIcon = card.querySelector('.heart-icon');
		if (heartIcon && window.isLiked) {
			heartIcon.setAttribute('fill', window.isLiked(property.id) ? '#313131' : 'none');
		}
		
		// Update heart click to use new system
		const heartWrapper = card.querySelector('.heart-wrapper');
		if (heartWrapper) {
			heartWrapper.replaceWith(heartWrapper.cloneNode(true));
			const newHeartWrapper = card.querySelector('.heart-wrapper');
			newHeartWrapper.addEventListener('click', function(event) {
				event.preventDefault();
				event.stopPropagation();
				
				if (window.toggleLike) {
					const isLiked = window.toggleLike(property.id);
					const heartIcon = this.querySelector('.heart-icon');
					if (heartIcon) {
						heartIcon.setAttribute('fill', isLiked ? '#313131' : 'none');
					}
					
					// Reload the page to update the list
					if (!isLiked) {
						setTimeout(() => window.loadLikedProperties(), 100);
					}
				}
			});
		}
		
		return card;
	};

	window.onload = function() {
 	const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get("shareId");

    if (shareId) {
		document.querySelector(".copy_link").style.display = 'none';
		renderShareProjects(shareId);
    } else {
        // Use new like system
        if (window.loadLikedProperties) {
            window.loadLikedProperties();
        } else {
            renderOffPlanProjects(); // Fallback to old system
        }
    }
	};
	
function sendFavoriteProjects() {
    const favoriteProjects = JSON.parse(localStorage.getItem("favoriteProjects")) || [];
    const favoriteSecondaryProjects = JSON.parse(localStorage.getItem("favoriteSecondaryProjects")) || [];

    const offPlan = favoriteProjects.map(project => project._id);
    const secondary = favoriteSecondaryProjects.map(project => project.id);

    if (offPlan.length === 0 && secondary.length === 0) {
        console.log("Оба массива пустые, запрос не отправлен");
        return;
    }

    const body = {
	shareType:"LIKE"
};
    if (offPlan.length > 0) {
        body.offPlan = offPlan;
    }
    if (secondary.length > 0) {
        body.secondary = secondary;
    }
  const copyButton = document.querySelector(".copy_link");
  fetch("https://crm.server.pro-part.es/api/v1/share-projects", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
  })
  .then(response => response.json())
  .then(data => {
      const shareLink = `https://test.pro-part.es/liked-projects?shareId=${data._id}`;
      navigator.clipboard.writeText(shareLink)
          .then(() => {
              copyButton.textContent = 'Copied';
              setTimeout(() => {
                  copyButton.textContent = 'Copy Link';
              }, 2000);
          })
          .catch(error => {
              console.error("Ошибка при копировании текста:", error);
          });
  })
  .catch(error => {
      console.error("Ошибка при выполнении запроса:", error);
  });
}

document.querySelector(".copy_link").addEventListener("click", sendFavoriteProjects);

// Simple system is already loaded

</script>
<?php

get_footer();
