// Инициализация маски для телефона
document.addEventListener('DOMContentLoaded', function() {
  // Маска для телефона
  const phoneInput = document.querySelector('input[type="tel"]');
  const form = document.querySelector('.consultation-form');
  const phoneMask = IMask(phoneInput, {
      mask: '+{7} (000) 000 00 00',
      lazy: false,
      placeholderChar: '_'
  });

  // При фокусе показываем маску полностью
  phoneInput.addEventListener('focus', function() {
      if (!phoneMask.value) {
          phoneMask.value = '+7 (';
      }
  });

  // При потере фокуса, если номер не заполнен полностью, очищаем поле
  phoneInput.addEventListener('blur', function() {
      if (phoneMask.value === '+7 (') {
          phoneMask.value = '';
      }
  });

  // Добавляем обработчик отправки формы
  form.addEventListener('submit', function(e) {
      // Убираем все не цифры из номера телефона
      const phoneDigits = phoneMask.value.replace(/\D/g, '');
      
      // Проверяем длину (должно быть 11 цифр для российского номера)
      if (phoneDigits.length !== 11) {
          e.preventDefault(); // Предотвращаем отправку формы
          phoneInput.setCustomValidity('Пожалуйста, введите полный номер телефона');
          phoneInput.reportValidity();
      } else {
          phoneInput.setCustomValidity(''); // Сбрасываем сообщение об ошибке
      }
  });

  // Сбрасываем сообщение об ошибке при вводе
  phoneInput.addEventListener('input', function() {
      phoneInput.setCustomValidity('');
  });

  // Обработка кнопок показания/описание
  const buttons = document.querySelectorAll('.product-button');
  
  buttons.forEach(button => {
      button.addEventListener('click', function() {
          const card = this.closest('.product-card');
          const description = card.querySelector('.product-description');
          const indications = card.querySelector('.product-indications');
          const name = card.querySelector('.product-name');
          
          // Добавляем название препарата в атрибут
          if (!indications.hasAttribute('data-product-name')) {
              indications.setAttribute('data-product-name', name.textContent.trim());
          }
          
          if (description.classList.contains('hidden')) {
              // Показываем описание
              description.classList.remove('hidden');
              indications.classList.remove('visible');
              this.textContent = 'ПОКАЗАНИЯ';
          } else {
              // Показываем показания
              description.classList.add('hidden');
              indications.classList.add('visible');
              this.textContent = 'ОПИСАНИЕ';
          }
      });
  });

  // Плавная прокрутка для навигации
  const navLinks = document.querySelectorAll('.nav-list a');
  
  navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Получаем текст ссылки
          const linkText = this.textContent.trim().toLowerCase();
          
          // Определяем целевую секцию
          let targetSection;
          switch(linkText) {
              case 'о компании':
                  targetSection = document.querySelector('.hero');
                  break;
              case 'о нашей аптеке':
                  targetSection = document.querySelector('.about');
                  break;
              case 'ассортимент товаров':
                  targetSection = document.querySelector('.products');
                  break;
              case 'статьи и советы':
                  targetSection = document.querySelector('.articles');
                  break;
              case 'связь':
                  targetSection = document.querySelector('.contact-form');
                  break;
              case 'аптеки в городе':
                  targetSection = document.querySelector('.pharmacy-locations');
                  break;
              case 'контакты':
                  targetSection = document.querySelector('.contacts');
                  break;
          }
          
          // Если секция найдена, прокручиваем к ней
          if (targetSection) {
              targetSection.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
              });
          }
      });
  });

  // Плавная прокрутка для кнопки "Посмотреть каталог"
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
      ctaButton.addEventListener('click', function() {
          document.getElementById('products').scrollIntoView({
              behavior: 'smooth',
              block: 'start'
          });
      });
  }

  // Modal functionality
  const modal = document.getElementById('availability-modal');
  const viewAllButton = document.querySelector('.view-all-button');
  const closeModal = document.querySelector('.close-modal');
  const consultationBtn = document.querySelector('.consultation-btn');
  const locationsBtn = document.querySelector('.locations-btn');

  function openModal() {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  function closeModalFunc() {
      modal.classList.remove('show');
      document.body.style.overflow = ''; // Restore scrolling
  }

  // Open modal when clicking "View All" button
  viewAllButton.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
  });

  // Close modal when clicking close button
  closeModal.addEventListener('click', closeModalFunc);

  // Close modal when clicking outside
  modal.addEventListener('click', function(e) {
      if (e.target === modal) {
          closeModalFunc();
      }
  });

  // Handle consultation button click
  consultationBtn.addEventListener('click', function() {
      closeModalFunc();
      document.querySelector('.contact-form').scrollIntoView({
          behavior: 'smooth',
          block: 'start'
      });
  });

  // Handle locations button click
  locationsBtn.addEventListener('click', function() {
      closeModalFunc();
      // Здесь можно добавить переход на страницу с аптеками
      window.location.href = '/locations';
  });

  // Close modal on Escape key press
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
          closeModalFunc();
      }
  });

  // Отслеживание активных секций
  const sections = document.querySelectorAll('section[id], .hero, .contact-form, .articles');
  const navItems = document.querySelectorAll('.nav-list a');

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px', // Активируется, когда секция находится в центре viewport
    threshold: 0
  };

  function resetActiveLinks() {
    navItems.forEach(link => link.classList.remove('active'));
  }

  function getTargetLink(sectionId) {
    let targetText = '';
    if (sectionId === 'hero') {  // Изменено: проверяем класс 'hero'
      targetText = 'О КОМПАНИИ';
    } else {
      switch(sectionId) {
        case 'about':
          targetText = 'О НАШЕЙ АПТЕКЕ';
          break;
        case 'products':
          targetText = 'АССОРТИМЕНТ ТОВАРОВ';
          break;
        case 'articles':
          targetText = 'СТАТЬИ И СОВЕТЫ';
          break;
        default:
          if (sectionId === 'contact-form') {
            targetText = 'СВЯЗЬ';
          } else if (sectionId === 'pharmacy-locations') {
            targetText = 'АПТЕКИ В ГОРОДЕ';
          } else if (sectionId === 'contacts') {
            targetText = 'КОНТАКТЫ';
          }
          break;
      }
    }
    return Array.from(navItems).find(link => link.textContent.trim() === targetText);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        resetActiveLinks();
        const targetLink = getTargetLink(entry.target.classList[0]);
        if (targetLink) {
          targetLink.classList.add('active');
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}); 