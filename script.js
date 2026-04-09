//J'ai conçu le programme en segmentant les difféntes fonctionnalités dans des Fontions, que j'appelle quand 
//j'en ai besoin

//****************************************
//Sélection des éléments HTML à manipuler
//****************************************
//Ici on va récupérer ces éléments dans des VARiables constantes (document)
const casesGrid = document.querySelectorAll(".case");//Cette instruction permet de sélectionner les 9 cases du plateau (tableau)
const statusMessage = document.getElementById("status");// Cette instruction permet de sélectionner le message
const startButton = document.getElementById("start");// Cette instruction permet de sélectionner le bouton


//**************
//VARIABLES
//**************
let board;//Tableau
let activeGame;//Booléen
let player;//Texte


//**************
//CONSTANTES
//**************
const nomsJoueurs = {X:"ZéroCréa", O:"Créativo"};


//***************************************************
//FONCTIONS
//***************************************************
//Fonction => Initialisation
function initialiserJeu () {
    board = ["", "", "", "", "", "", "", "", ""];//RAZ du tableau en mémoire
    activeGame = false;//false=> le jeu n'a pas commencé
    player = "X";//Le premier joueur est X
    statusMessage.textContent = "Cliquez sur Démarrer pour commencer la partie"//Information au joueurs

    casesGrid.forEach(function(content) {//Pour chaque case du plateau avec une fonction dans un fonction
        content.innerHTML="";//On supprime les symboles affichés dans la grille à l'écran
        content.classList.remove("lignegagnante");//On nettoie le coloriage des cases de la partie précédente
        content.classList.remove("matchnul");
    })
}


//Fonction => Evenement
function ecouterEvenement() {//Cette fonction sert à "écouter" les interractions avec l'utilisateur
    for (let i = 0; i < casesGrid.length; i++) {
        casesGrid[i].addEventListener("click", cliquerCase);//Ici on surveille un clic dans la grille
    }
    startButton.addEventListener("click", demarrerJeu) // Ici on surveille le click sur le bouton
}

//Fonction => Démarrer le jeu
function demarrerJeu () {
    initialiserJeu ();//On appelle la fonction initialisation
        activeGame = true;//True => la partie est en cours
        startButton.textContent = "Partie en cours";
        statusMessage.textContent = nomsJoueurs[player]  + ", vous commencez !"//Information au joueurs
        startButton.disabled = true;
}

//Fonction => Clic sur une case de la grille
function cliquerCase(event) {
    const element = event.currentTarget;
    let index = 0;

    for (let i = 0; i < casesGrid.length; i++) {
        if (casesGrid[i] === element) {
            index = i;
            break;
        }
    }

    jouerCoup(index, element);
}

//Fonction jouer un coup
function jouerCoup (index, element) {
    if (activeGame === false || board[index] !== "") { //On teste si le jeu est arrêté ou si le plateau est plein
        return; //On arrête le jeu
    }

    board[index] = player; //On joue le coup
    element.innerHTML = "";// On vide la case
    let img = document.createElement("img");// On crée une image
    if (player === "X") {// On choisit l'image selon le joueur
        img.src = "/img/X.png";
    } else {
        img.src = "/img/O.png";
    }
    element.appendChild(img);// On ajoute l'image dans la case

    //Le coup est joué, il faut testé si il est gagnant
    let gagnant = verifierGagnant(player);

    if (gagnant) { //On appelle la fonction de vérification verifierGagnant avec le paramètre player (joueur en cours)
        statusMessage.textContent = nomsJoueurs[player] + " a gagné !"//Si il a gagné, on affiche message

        for (let i = 0; i < gagnant.length; i++) { // Colorier les cases gagnantes
            casesGrid[gagnant[i]].classList.add("lignegagnante");
        }

        activeGame = false ; //On "désactive" le jeu
        startButton.textContent = "Recommencer";
        startButton.disabled = false;
        return;//On arrête le jeu
    }

    //Le coup est joué, il faut testé si match nul
    if (plateauPlein()) { //On appelle la fonction de vérification du match nul
        statusMessage.textContent = "Match nul !"//Si c'est le cas, on affiche message

        for (let i = 0; i < casesGrid.length; i++) {// Colorier le plateau di match nul
        casesGrid[i].classList.add("matchnul");
        }

        activeGame = false ; //On "désactive" le jeu
        startButton.textContent = "Recommencer";
        startButton.disabled = false;
        return;//On arrête le jeu
    }

    //On change le joueur
    if (player === "X") {
        player = "O";
    } else {
        player = "X";
    }

    statusMessage.textContent = nomsJoueurs[player] + ", c'est à votre tour !";

}

//Fonction => Vérifier si gagnant
function verifierGagnant(symbole) {//ici le paramètre symbole sera la lettre X ou O
    const combinaisons = [//Tableau dans lequel on mémorise les combinaisons gagnantes
    [0,1,2],[3,4,5],[6,7,8],//horizontalement
    [0,3,6],[1,4,7],[2,5,8],//verticalement
    [0,4,8],[2,4,6]//diagonalement
    ];

    for (let i = 0; i < combinaisons.length; i++) {//On parcoure le tableau des combinaisons gagnantes
        let a = combinaisons[i][0];//Ici on créé un tableau 2D => tableau de tableau - 0 c'est les 3 combinaisons horizontales - 3 lignes
        let b = combinaisons[i][1];//1 c'est les 3 combinaisons verticales - il contient 3 lignes
        let c = combinaisons[i][2];//2 c'est les 2 combinaisons diagonales - il contient 2 lignes

        if (board[a] === symbole && board[b] === symbole && board[c] === symbole) {//Si ces 3 cases (Horiz, Vert et Diag) ont le même symbole
            return combinaisons[i];//Alors on renvoie la combinaison gagnante (ça sert à modifier le fond de couleur en vert sur la combinaison gagnante)
        }
    }
    return false; //Si aucune condition ci dessus n'est VRAI alors on retourne FAUX
}

//Fonction => Plateau plein
function plateauPlein() {
    //On teste pour chaque case du tableau si elle est vide ou pas
    for (let i=0; i < 9; i++) {
        if (board[i] === "") {
            return false;
        }
    }
    return true;
}

ecouterEvenement();
initialiserJeu();