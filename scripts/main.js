const timerSection = document.querySelector('.cta');

// Burger menu

const burgerBtn = document.querySelector('.burger-btn');
const headerNav = document.querySelector('.header__nav');
const headerMenu = document.querySelector('.header__menu');

const burgerMenuOnOff = () => {
    burgerBtn.classList.toggle('burger_active');
    headerNav.classList.toggle('header__nav_active');
    document.body.classList.toggle('no-scroll');
};

burgerBtn.addEventListener('click', burgerMenuOnOff);

headerMenu.addEventListener('click', (event) => {
    if (event.target.tagName === 'A' && headerNav.classList.contains('header__nav_active')) {
        burgerMenuOnOff();
    }
});

// Best Gifts random cards

const giftsPath = 'data/gifts.json';

const getGiftsData = async (path) => {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Произошла ошибка: ${error}`);
        throw error;
    }
};

const getRandomNumber = (arrLength) => {
    return Math.floor(Math.random() * arrLength);
}

const cardsList = document.querySelector('.cards__list');

const createCard = (category, name) => {
    const getCategory = category.split(' ')[1].toLowerCase();

    const card = document.createElement('li');
    card.classList.add('cards__list-item');
    card.dataset.gift = name;

    const cardItem = document.createElement('div');
    cardItem.classList.add('cards__item');

    card.append(cardItem);

    const cardImgContainer = document.createElement('div');
    cardImgContainer.classList.add('card__img-container');
    cardItem.append(cardImgContainer);
    const cardImg = document.createElement('img');
    cardImg.classList.add('card__img');
    cardImg.src = `img/gift-for-${getCategory}.png`;
    cardImg.alt = `Image category`;

    cardImgContainer.append(cardImg);

    const cardTitleContainer = document.createElement('div');
    cardTitleContainer.classList.add('card__title-container');
    cardItem.append(cardTitleContainer);
    const cardCategory = document.createElement('h4');
    cardCategory.classList.add('card__category', `for-${getCategory}`);
    cardCategory.textContent = `For ${getCategory}`;
    const cardTitle = document.createElement('h4');
    cardTitle.classList.add('card__title');
    cardTitle.textContent = name;

    cardTitleContainer.append(cardCategory, cardTitle);

    return card;
}

const renderRandomCards = async () => {
    if (!timerSection) {
        return;
    }

    const cardsArr = await getGiftsData(giftsPath);
    const randomGifts = [];

    for (let i = 0; i < 4; i++) {
        const arrI = getRandomNumber(cardsArr.length);
        const giftData = cardsArr[arrI];

        const card = createCard(giftData.category, giftData.name);
        randomGifts.push(card);
    }
};

renderRandomCards()

// Category switching

const tabsList = document.querySelector('.tabs-list');

if (!timerSection) {
    tabsList.addEventListener('click', (event) => {
        const target = event.target.closest('li');

        if (target) {
            const category = event.target.dataset.category;
            changeCardsCategory(target);
            filterCardsCategory(category);
        }
    });
}

const changeCardsCategory = (targetElem) => {
    const elems = document.querySelectorAll('.tabs-list__item');
    elems.forEach((li) => {
        li.classList.remove('active-tab');
    });
    targetElem.classList.add('active-tab');
}

const filterCardsCategory = async (category = 'All') => {
    const allCardsData = await getGiftsData(giftsPath);

    if (category === 'All') {
        renderCards(allCardsData);
    } else {
        const cardsCategoryArr = allCardsData.filter((card) => {
            if (card.category === `For ${category}`) {
                return card;
            }
        });

        renderCards(cardsCategoryArr);
    }
};

if (!timerSection) {
    filterCardsCategory();
}

const renderCards = async (arr) => {
    if (timerSection) {
        return;
    }

    cardsList.innerHTML = '';

    const cards = arr.map((card) => {
        return createCard(card.category, card.name);
    });

    cardsList.append(...cards);
};

// Scroll to top button

const scrollToTopBtn = document.querySelector('.scroll-to-top-btn');


scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
});

window.addEventListener('scroll', () => {
    if (window.scrollY >= 300) {
        scrollToTopBtn.classList.add('active-top-btn');
    } else {
        scrollToTopBtn.classList.remove('active-top-btn');
    }
});

// Modal Gifts window

const modalWindow = document.querySelector('.modal-window');
const modalWindowList = document.querySelector('.modal-window__list');

const closeModal = (event) => {
    if (event.target === modalWindow || event.target.closest('.modal-window__close-btn')) {
        modalWindow.classList.remove('modal-window_active');
        document.body.classList.toggle('no-scroll');
        modalWindowList.innerHTML = '';
    }
};

modalWindow.addEventListener('click', closeModal);

// Slider

const sliderList = document.querySelector('.slider-list');
const sliderBtnRight = document.querySelector('.slider__btn-right');
const sliderBtnLeft = document.querySelector('.slider__btn-left');

if (sliderList) {
    const fullWidthSlider = sliderList.scrollWidth;
    const visibleWidthSlider = sliderList.offsetWidth;

    const initSlider = () => {
        let offset = 0;
        let steps = 0;
        let maxSteps = document.documentElement.clientWidth > 768 ? 3 : 6;

        const maxOffset = fullWidthSlider - visibleWidthSlider;
        const offsetStep = maxOffset / maxSteps;

        sliderBtnRight.addEventListener('click', () => {
            steps++;
            sliderBtnRight.disabled = steps === maxSteps;
            sliderBtnLeft.disabled = steps === 0 ? true : false;
            offset = offset - offsetStep;

            sliderList.style.transform = `translateX(${offset}px)`;
        });

        sliderBtnLeft.addEventListener('click', () => {
            steps--;
            sliderBtnRight.disabled = steps > maxSteps;
            sliderBtnLeft.disabled = steps === 0 ? true : false;
            offset = offset + offsetStep;

            sliderList.style.transform = `translateX(${offset}px)`;
        });
    };

    initSlider();

    window.addEventListener('resize', () => {
        initSlider();
        sliderList.style.transform = 'translateX(0)';
        sliderBtnRight.disabled = false;
        sliderBtnLeft.disabled = true;
    })
}