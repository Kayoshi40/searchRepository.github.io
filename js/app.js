class view{
    constructor() {
        this.app = document.getElementById('app');

        this.title = this.createElement('h1', 'title')
        this.title.textContent = 'Github Search Repository';

        this.searchLine = this.createElement('div','search-line');
        this.searchInput = this.createElement('input','search-input');
        this.searchCounter = this.createElement('span','counter');
        this.searchLine.append(this.searchInput);
        this.searchLine.append(this.searchCounter);

        this.repositorysWrapper = this.createElement('div','repositorys-wrapper');
        this.repositorysList = this.createElement('ul','repositorys');
        this.repositorysWrapper.append(this.repositorysList);

        this.main = this.createElement('div','main');
        this.main.append(this.repositorysWrapper);

        this.app.append(this.title);
        this.app.append(this.searchLine);
        this.app.append(this.main);
    }

    createElement(elementTag, elementClass){
        const element = document.createElement(elementTag);
        if(elementClass) {
            element.classList.add(elementClass);
        }
        return element;
    }

    createRepository(repositoryData) {
        const repositoryElement = this.createElement('li','repository-prev');
        repositoryElement.innerHTML = `<div class='repository-name'><a target="_blank" href="https://github.com/${repositoryData.full_name}">${repositoryData.name}</a> </div>
                                       <span class="repository-prev-name">Имя автора: ${repositoryData.owner.login}</span>
                                       <img class="repository-prev-photo" src="${repositoryData.owner.avatar_url}" alt="${repositoryData.owner.login}"></img>
                                       <div class="repository-prev-description">Описание: ${repositoryData.description}</div>`;
        this.repositorysList.append(repositoryElement);
    }
}

class Search {
    constructor(view) {
        this.view = view;

        this.view.searchInput.addEventListener('keyup', this.debounce(this.searchRepositorys.bind(this), 1000));
    
    }

    async searchRepositorys(){
        const searchValue = this.view.searchInput.value;
        if(searchValue) {
            return await fetch(`
            https://api.github.com/search/repositories?q=${this.view.searchInput.value}&type=repositories&per_page=10`)
            .then((res) =>{
                if(res.ok) {
                    res.json().then(res => {
                        res.items.forEach(repository => this.view.createRepository(repository));
                    })
                }

            })
        }
        else{
            this.clearRepositorys();
        }

    }   

    clearRepositorys(){
        this.view.repositorysList.innerHTML = '';
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };

            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }



}


const app = new Search(new view);