const filters = [
    {
        name: "Normal",
        background: "#999999",
        icon: "popup/images/svg/cross.svg",
    },
    {
        name: 'face detect',
        background: '#8628b4',
        icon: "popup/images/svg/facedetect.svg"
    },
    {
        name: 'sun glasses',
        background: '#e0a604',
        icon: "popup/images/svg/sunglasses.svg"
    },
    {
        name: 'anonymous',
        background: '#5AB1BB',
        icon: "popup/images/svg/anonymous.svg"
    },
    {
        name: 'helmet',
        background: '#F96E46',
        icon: "popup/images/svg/helmet.svg"
    },
    {
        name: 'dog face',
        background: '#B6A2DE',
        icon: "popup/images/dog.png"
    }
]

const getActiveTab = () => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                resolve(tabs[0]);
            } else {
                reject();
            }
        });
    });
}

const createCard = (filter, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('id', `card-filter-${index}`);
    const button = document.createElement('button');
    button.classList.add('card__button');
    button.setAttribute("id", `filter-${index}`);

    button.addEventListener('click', async (ev) => {
        const oldFilterId = popUpStateManager.getKey('currentFilterId');
        const hasActiveClass = ev.target.classList.contains('active');


        popUpStateManager.setState({ currentFilterId: ev.target.id });
        if (oldFilterId !== ev.target.id) {
            document.getElementById(`card-${oldFilterId}`).classList.remove('active');
        }
        if (!hasActiveClass) {
            card.classList.add('active');

            const activeTab = await getActiveTab();

            card.classList.add('loading');

            chrome.tabs.sendMessage(activeTab.id, { filterName: filter.name, type: "installfilter" }, (response) => {
                card.classList.remove('loading');
            });
        }
    });

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.style.backgroundColor = filter.background;

    const img = document.createElement('img');
    img.src = filter.icon;
    img.alt = filter.name;
    img.height = 50;
    img.width = 50;

    const h3 = document.createElement('h3');
    h3.innerText = filter.name;

    cardBody.append(img, h3);
    card.append(cardBody, button);
    return card;
}

const createAllCards = () => {
    const parent = document.querySelector(".grid");

    filters.forEach((filter, index) => {
        const card = createCard(filter, index);
        parent.append(card);
    })
}

const main = () => {
    createAllCards();

    // select menu
    const select = document.getElementById('resolution');
    select.addEventListener('change', async (ev) => {
        const selectedOption = ev.target.options[ev.target.selectedIndex];
        const selectedResolution = selectedOption.value;
        const [height, width] = selectedResolution.split('x').map((val) => parseInt(val));

        const activeTab = await getActiveTab();

        chrome.tabs.sendMessage(activeTab.id, {
            resolution: {
                width,
                height
            }, type: "setresolution"
        }, (response) => {
            console.log(response);
        });

    });

    // toggle checkbox btn
    const toggleBtn = document.getElementById('toggle-btn');

    toggleBtn.addEventListener('click', async (ev) => {
        const activeTab = await getActiveTab();

        const isCheckboxChecked = ev.target.checked;

        chrome.tabs.sendMessage(activeTab.id, { isVisible: isCheckboxChecked, type: "miniplayertoggle" }, (response) => {
            console.log(response);
        });

    });
}

window.addEventListener('load', main);