const wheel = document.getElementById('wheel'); // Referência ao elemento SVG da roda
const spinButton = document.getElementById('spin-button'); // Referência ao botão de girar
let spinning = false; // Variável de controle para verificar se a roda está girando
let currentRotation = 0; // Armazena o ângulo de rotação atual da roda

const slices = [
  // Definição das fatias da roda
  { text: 'Sorte 1', color: '#f44336' },   // Texto e cor da fatia 1
  { text: 'Sorte 2', color: '#9c27b0' },   // Texto e cor da fatia 2
  { text: 'Sorte 3', color: '#03a9f4' },   // Texto e cor da fatia 3
  { text: 'Sorte 4', color: '#4caf50' },   // Texto e cor da fatia 4
  { text: 'Sorte 5', color: '#ffc107' }    // Texto e cor da fatia 5
];

const sliceAngle = 360 / slices.length; // Calcula o ângulo de cada fatia da roda

for (let i = 0; i < slices.length; i++) {
  const startAngle = i * sliceAngle; // Ângulo inicial da fatia
  const endAngle = (i + 1) * sliceAngle; // Ângulo final da fatia

  const slice = document.createElementNS('http://www.w3.org/2000/svg', 'path'); // Cria um elemento de fatia SVG
  slice.setAttribute('class', 'slice'); // Define a classe da fatia
  slice.setAttribute('fill', slices[i].color); // Define a cor de preenchimento da fatia
  slice.setAttribute('d', describeArc(200, 200, 150, startAngle, endAngle)); // Define o caminho da fatia
  wheel.appendChild(slice); // Adiciona a fatia ao elemento SVG da roda

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text'); // Cria um elemento de texto SVG
  const textAngle = startAngle + sliceAngle / 2; // Ângulo do texto no centro da fatia
  const radius = 120; // Raio para posicionar o texto
  const textX = 200 + Math.cos((textAngle - 90) * Math.PI / 180) * radius; // Posição X do texto
  const textY = 200 + Math.sin((textAngle - 90) * Math.PI / 180) * radius; // Posição Y do texto
  text.setAttribute('x', textX); // Define a posição X do texto
  text.setAttribute('y', textY); // Define a posição Y do texto
  text.setAttribute('fill', '#fff'); // Define a cor do texto
  text.setAttribute('text-anchor', 'middle'); // Define o alinhamento horizontal do texto
  text.setAttribute('dominant-baseline', 'middle'); // Define o alinhamento vertical do texto
  text.textContent = slices[i].text; // Define o conteúdo do texto
  wheel.appendChild(text); // Adiciona o texto ao elemento SVG da roda
}

spinButton.addEventListener('click', () => {
  if (!spinning) {
    const randomIndex = Math.floor(Math.random() * slices.length); // Seleciona um índice aleatório
    const targetSlice = (currentRotation / sliceAngle + randomIndex) % slices.length; // Calcula a fatia de destino
    const targetRotation = 360 * 10 + (randomIndex * sliceAngle) - currentRotation % 360; // Calcula a rotação até a fatia de destino

    currentRotation += targetRotation; // Atualiza a rotação atual
    wheel.style.transform = `rotate(${currentRotation}deg)`; // Aplica a rotação à roda
    spinButton.disabled = true; // Desabilita o botão de girar
    spinning = true; // Define que a roda está girando

    setTimeout(() => {
      spinButton.disabled = false; // Habilita o botão de girar novamente
      spinning = false; // Define que a roda parou de girar

      const topAngle = 360 - currentRotation % 360; // Calcula o ângulo no topo da roda
      const winnerIndex = Math.floor(topAngle / sliceAngle) % slices.length; // Calcula o índice da fatia vencedora
      alert(`O resultado foi: ${slices[winnerIndex].text}`); // Exibe um alerta com o texto da fatia vencedora
    }, 4000); // Tempo após o qual a roda para de girar
  }
});

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle); // Calcula o ponto inicial do arco
  const end = polarToCartesian(x, y, radius, startAngle); // Calcula o ponto final do arco

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'; // Define o flag do arco grande

  const d = [
    `M ${start.x} ${start.y}`, // Mova para o ponto inicial
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, // Desenha o arco
    'L 200 200', // Linha até o centro da roda
    'Z' // Fecha o caminho
  ].join(' ');

  return d; // Retorna o caminho do arco
}
