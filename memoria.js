function GameMemoria() {
    this.badges = [];
    this.timer = [];
    this.pontuacao = "";
    this.clicados = 0;
    this.total = 0;
    this.ultimo = [];
    this.jogar = false;
}

GameMemoria.prototype.iniciar = function () {
    this.resetar();
    this.getImageBadges(this);
}

GameMemoria.prototype.resetar = function () {
    var game = document.getElementById("game");
    var loading = document.getElementById("loading");
    var score = document.getElementById("score");
    var child = document.getElementById("twiter");
    
    if(child){
        score.removeChild(child);
    }
    
    this.jogar = true;
    clearInterval(this.timer);
    game.innerHTML = '';
    loading.setAttribute('style', 'display:block;');
}

GameMemoria.prototype.contador = function () {
    var tempo = +new Date();
    var parado = 0;

    function atualiza_tempo()
    {
        var tempo_segundos = Math.floor((+new Date() - tempo) / 1000);
        this.pontuacao = tempo_segundos;
        var display = tempo_segundos.toString() + " seg";
        document.getElementById("display_tempo").innerHTML = display;
        return;
    }

    this.timer = setInterval(atualiza_tempo, 600);
}

GameMemoria.prototype.getImageBadges = function (object) {
    var xhttp = new XMLHttpRequest();
    var badges = [];
    var badges_rand = [];

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            badges = JSON.parse(this.responseText);
            for (var i = 1; i <= 9; i++) {
                var randBadge = badges[Math.floor(Math.random() * badges.length)];
                badges_rand.push(randBadge);
                badges_rand.push(randBadge);
            }
            object.badges = badges_rand;
            object.generateCards();
        }
    };
    xhttp.open("GET", "https://services.sapo.pt/Codebits/listbadges", true);
    xhttp.send();
}

GameMemoria.prototype.generateCards = function () {
    var cols = 6;
    var rows = 3;
    var badges = this.badges;
    var cards = [];
    var game = document.getElementById("game");
    var loading = document.getElementById('loading');
    loading.setAttribute('style', 'display:none;');

    for (var i = 0; i < rows; i++) {
        cards[i] = [];
        for (var a = 0; a < cols; a++) {
            var cardImage = new Image();

            var rand = Math.floor(Math.random() * badges.length);
            var randSlice = badges[rand];

            badges.splice(badges.indexOf(randSlice), 1);
            cards[i][a] = randSlice;

            cardImage.setAttribute("data-src", randSlice['img']);
            cardImage.setAttribute("id", randSlice['id']);
            cardImage.setAttribute("src", 'https://i2.wp.com/codebits.eu/logos/defaultavatar.jpg');
            cardImage.setAttribute("class", "badge");
            cardImage.setAttribute("style", "width: 100px;height: 100px;");

            cardImage.onclick = (function (object, card, objimg) {
                return function () {
                    object.logica(card, objimg);
                };
            })(this, randSlice, cardImage);

            game.appendChild(cardImage);
        }
        var br = document.createElement("br");
        game.appendChild(br);
    }
    this.contador();
}

GameMemoria.prototype.logica = function (card, objimg) {

    var atual = objimg;

    if (this.clicados < 2 && this.jogar == true) {
        if (this.clicados == 1) {
            atual.src = card['img'];
            if (this.ultimo.id != atual.id) {
                this.jogar = false;
                setTimeout((function (obj, atual) {
                    return function () {
                        atual.src = 'https://i2.wp.com/codebits.eu/logos/defaultavatar.jpg';
                        obj.ultimo.src = 'https://i2.wp.com/codebits.eu/logos/defaultavatar.jpg';
                        obj.clicados = 0;
                        obj.jogar = true;
                    };
                })(this, atual), 4000);
            } else {
                this.jogar = true;
                this.ultimo = [];
                this.clicados = 0;
                this.total += 2;

                if (this.total == 18) {
                    this.endGame();
                }
            }
        } else if (this.clicados == 0) {
            atual.src = card['img'];
            this.ultimo = atual;
            this.clicados++;
        }
    }
}

GameMemoria.prototype.endGame = function () {
    this.jogar = false;
    var inicio = document.getElementById('btn-inicio').textContent = "Jogar Novamente!";
    clearInterval(this.timer);
    var score = document.getElementById("score");
    var twiter = document.createElement('a');
    twiter.setAttribute('href', 'https://twitter.com/intent/tweet/?text=' + document.getElementById("display_tempo").innerHTML);
    twiter.setAttribute('target', '_blank');
    twiter.setAttribute('id', 'twiter');
    twiter.innerHTML = "Partilha Twitter";
    score.appendChild(twiter);
}