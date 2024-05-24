class Peca {
    constructor() {
        this.valores = [];
        this.dim = 0;
        this.cor = '#0000FF'; // Cor padrão (azul)
    }

    inicializarPeca() {
        const x = Math.trunc(5 * Math.random());
        switch (x) {
            case 0:
                this.dim = 3;
                this.valores = [
                    [' ', ' ', ' '],
                    ['*', '*', '*'],
                    [' ', '*', ' ']
                ];
                this.cor = '#00FFFF'; // Ciano
                break;
            case 1:
                this.dim = 4;
                this.valores = [
                    ['*', ' ', ' ', ' '],
                    ['*', ' ', ' ', ' '],
                    ['*', ' ', ' ', ' '],
                    ['*', ' ', ' ', ' '],
                ];
                this.cor = '#0000FF'; // Azul
                break;
            case 2:
                this.dim = 2;
                this.valores = [
                    ['*', '*'],
                    ['*', '*']
                ];
                this.cor = '#FFFF00'; // Amarelo
                break;
            case 3:
                this.dim = 3;
                this.valores = [
                    [' ', ' ', ' '],
                    ['*', '*', ' '],
                    [' ', '*', '*']
                ];
                this.cor = '#00FF00'; // Verde
                break;
            case 4:
                this.dim = 5;
                this.valores = [
                    [' ', ' ', '*', ' ', ' '],
                    [' ', ' ', '*', ' ', ' '],
                    [' ', ' ', '*', ' ', ' '],
                    [' ', ' ', '*', ' ', ' '],
                    [' ', ' ', '*', ' ', ' ']
                ];
                this.cor = '#FF00FF'; // Magenta
                break;
        }
    }

    transposta() {
        let temp = Array.from({ length: this.dim }, () => Array(this.dim).fill(' '));
        for (let i = 0; i < this.dim; i++) {
            for (let j = 0; j < this.dim; j++) {
                temp[i][j] = this.valores[j][i];
            }
        }
        this.valores = temp;
    }

    flipVertical() {
        for (let i = 0; i < this.dim; i++) {
            this.valores[i].reverse();
        }
    }

    flipHorizontal() {
        this.valores.reverse();
    }

    rotacionarEsquerda() {
        this.transposta();
        this.flipHorizontal();
    }

    rotacionarDireita() {
        this.transposta();
        this.flipVertical();
    }
}

class Tabuleiro {
    constructor(colunas, linhas) {
        this.colunas = colunas;
        this.linhas = linhas;
        this.valores = Array.from({ length: linhas }, () => Array(colunas).fill(' '));
        this.cores = Array.from({ length: linhas }, () => Array(colunas).fill(''));
    }

    inicializarTabuleiro() {
        for (let i = 0; i < this.linhas; i++) {
            for (let j = 0; j < this.colunas; j++) {
                this.valores[i][j] = ' ';
                this.cores[i][j] = '';
            }
        }
    }

    marcarPeca(x, y, p) {
        for (let i = 0; i < p.dim; i++) {
            for (let j = 0; j < p.dim; j++) {
                if (p.valores[i][j] !== ' ' &&
                    i + y >= 0 && i + y < this.linhas &&
                    j + x >= 0 && j + x < this.colunas) {
                    this.valores[i + y][j + x] = p.valores[i][j];
                    this.cores[i + y][j + x] = p.cor; // Define a cor da peça
                }
            }
        }
    }

    apagarPeca(x, y, p) {
        for (let i = 0; i < p.dim; i++) {
            for (let j = 0; j < p.dim; j++) {
                if (p.valores[i][j] !== ' ' &&
                    i + y >= 0 && i + y < this.linhas &&
                    j + x >= 0 && j + x < this.colunas) {
                    this.valores[i + y][j + x] = ' ';
                    this.cores[i + y][j + x] = ''; // Limpa a cor
                }
            }
        }
    }

    eliminarLinhas() {
        let linhasCompletas = [];
        for (let i = 0; i < this.linhas; i++) {
            let linhaCompleta = true;
            for (let j = 0; j < this.colunas; j++) {
                if (this.valores[i][j] === ' ') {
                    linhaCompleta = false;
                    break;
                }
            }
            if (linhaCompleta) {
                linhasCompletas.push(i);
            }
        }

        // Remover todas as linhas completas identificadas
        for (let i = linhasCompletas.length - 1; i >= 0; i--) {
            this.valores.splice(linhasCompletas[i], 1);
            this.valores.unshift(Array(this.colunas).fill(' '));
            this.cores.splice(linhasCompletas[i], 1);
            this.cores.unshift(Array(this.colunas).fill(''));
        }

        return linhasCompletas.length;
    }

    encaixa(x, y, p) {
        for (let i = 0; i < p.dim; i++) {
            for (let j = 0; j < p.dim; j++) {
                if (p.valores[i][j] !== ' ' &&
                    (i + y < 0 || i + y >= this.linhas || j + x < 0 || j + x >= this.colunas ||
                        this.valores[y + i][x + j] !== ' ')) {
                    return false;
                }
            }
        }
        return true;
    }

    desenharTabuleiro(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < this.linhas; i++) {
            for (let j = 0; j < this.colunas; j++) {
                if (this.valores[i][j] !== ' ') {
                    ctx.fillStyle = this.cores[i][j] || '#0000FF';  // Cor das peças

                    // Desenha a peça com sombra
                    ctx.shadowColor = this.cores[i][j]; // Cor do glow
                    ctx.shadowBlur = 20; // Intensidade do glow

                    ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);

                    // Desenha a borda da célula
                    ctx.shadowBlur = 0; // Remove o efeito de sombra para a borda
                    ctx.strokeStyle = 'black';  // Cor das bordas das células
                    ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
                }
            }
        }
    }
}

// Variáveis globais
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const cellSize = 20;
const boardWidth = Math.floor(canvas.width / cellSize);
const boardHeight = Math.floor(canvas.height / cellSize);
const p = new Peca();
const t = new Tabuleiro(boardWidth, boardHeight);
let x = Math.floor(boardWidth / 2) - Math.floor(p.dim / 2);
let y = 0;
let pontos = 0;
let gameOver = false;
let recorde = localStorage.getItem('recorde') || 0; // Recupera o recorde armazenado localmente

// Função para atualizar a pontuação
function atualizarPontos() {
    const pontuacaoElement = document.getElementById('pontuacao');
    pontuacaoElement.textContent = `Pontuação: ${pontos}`;
}

// Função para atualizar o recorde
function atualizarRecorde() {
    const recordeElement = document.getElementById('recorde');
    recordeElement.textContent = `Recorde: ${recorde}`;
}

// Função para descer a peça
function descer() {
    t.apagarPeca(x, y, p);
    if (t.encaixa(x, y + 1, p)) {
        y++;
    } else {
        t.marcarPeca(x, y, p);
        const linhasEliminadas = t.eliminarLinhas();
        pontos += linhasEliminadas * 100; // Pontuação baseada no número de linhas eliminadas
        if (pontos > recorde) {
            recorde = pontos;
            localStorage.setItem('recorde', recorde); // Atualiza o recorde localmente
        }
        p.inicializarPeca();
        x = Math.floor(boardWidth / 2) - Math.floor(p.dim / 2);
        y = 0;
        if (!t.encaixa(x, y, p)) {
            gameOver = true;
            alert("Game Over!");
            t.inicializarTabuleiro();
            pontos = 0;
            gameOver = false; // Resetar gameOver para false
            descer(); // Chamar descer() novamente para fazer a peça descer
        }
        atualizarPontos(); // Atualiza a exibição dos pontos
        atualizarRecorde(); // Atualiza a exibição do recorde
    }
    t.marcarPeca(x, y, p);
}

// Inicializa o jogo
document.addEventListener('DOMContentLoaded', () => {
    p.inicializarPeca();
    t.inicializarTabuleiro();
    t.marcarPeca(x, y, p);
    t.desenharTabuleiro(ctx);
    atualizarPontos();
    atualizarRecorde();
});

document.addEventListener('keydown', (e) => {
    t.apagarPeca(x, y, p);
    switch (e.keyCode) {
        case 37: // Esquerda
            if (t.encaixa(x - 1, y, p)) x--;
            break;
        case 38: // Cima (Rotacionar à direita)
            p.rotacionarDireita();
            if (!t.encaixa(x, y, p)) p.rotacionarEsquerda();
            break;
        case 39: // Direita
            if (t.encaixa(x + 1, y, p)) x++;
            break;
        case 40: // Baixo (Acelerar descida)
            descer();
            break;
    }
    t.marcarPeca(x, y, p);
    t.desenharTabuleiro(ctx);
});

// Botões de rotação
document.getElementById('btndir').addEventListener('click', () => {
    t.apagarPeca(x, y, p);
    p.rotacionarDireita();
    if (!t.encaixa(x, y, p)) p.rotacionarEsquerda();
    t.marcarPeca(x, y, p);
    t.desenharTabuleiro(ctx);
});

document.getElementById('btnesq').addEventListener('click', () => {
    t.apagarPeca(x, y, p);
    p.rotacionarEsquerda();
    if (!t.encaixa(x, y, p)) p.rotacionarDireita();
    t.marcarPeca(x, y, p);
    t.desenharTabuleiro(ctx);
});

// Atualização automática do tabuleiro a cada segundo
setInterval(() => {
    if (!gameOver) {
        descer();
        t.desenharTabuleiro(ctx);
    }
}, 1000);
