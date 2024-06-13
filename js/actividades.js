//FUNCION SLIDER


document.querySelectorAll('.slider-wrapper').forEach(wrapper => {
    const prevButton = wrapper.querySelector('.prev');
    const nextButton = wrapper.querySelector('.next');
    const slider = wrapper.querySelector('.slider-activities');
    const slides = slider.querySelectorAll('.box');
    let currentIndex = 0;
    const slidesToShow = 3; // Número de cajas a mostrar
    const totalSlides = slides.length;
    const maxIndex = totalSlides - slidesToShow;
    let slideWidth = slides[0].clientWidth;

    if (prevButton && nextButton) { // Verificar si los botones previo y siguiente existen
        prevButton.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    
        nextButton.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }

    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index > maxIndex) index = maxIndex;
        slider.style.transform = `translateX(-${index * slideWidth}px)`;
        currentIndex = index;
    }

    // Esto recalculará el ancho de la diapositiva y la posición actual cuando se redimensione la ventana
    window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].clientWidth;
        const newIndex = Math.floor(currentIndex * newSlideWidth / slideWidth);
        slideWidth = newSlideWidth;
        goToSlide(newIndex);
    });
});



  
  
