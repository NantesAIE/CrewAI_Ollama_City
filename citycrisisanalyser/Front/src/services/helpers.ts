export function drawAgentLinesAndBars(
  svg: SVGSVGElement | null,
  agents: (HTMLDivElement | null)[]
) {
  if (!svg || agents.some(a => !a)) return;

  svg.innerHTML = '';
  const equipe = agents[0];
  const equipeRect = equipe?.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();

  if (!equipeRect) return;

  const startX = equipeRect.left + equipeRect.width / 2 - svgRect.left;
  const startY = equipeRect.top + equipeRect.height / 2 - svgRect.top;

  agents.slice(1).forEach((agent, i) => {
    if (!agent) return;
    const agentRect = agent.getBoundingClientRect();
    const endX = agentRect.left + agentRect.width / 2 - svgRect.left;
    const endY = agentRect.top + agentRect.height / 2 - svgRect.top;
    const length = Math.hypot(endX - startX, endY - startY);
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', `translate(${startX},${startY}) rotate(${angle})`);

    const barBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    barBg.setAttribute('x', '0');
    barBg.setAttribute('y', '-2');
    barBg.setAttribute('width', String(length));
    barBg.setAttribute('height', '4');
    barBg.setAttribute('rx', '2');
    barBg.setAttribute('fill', '#E0E0E0');
    group.appendChild(barBg);

    const barFill = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    barFill.setAttribute('x', '0');
    barFill.setAttribute('y', '-2');
    barFill.setAttribute('width', '0');
    barFill.setAttribute('height', '4');
    barFill.setAttribute('rx', '2');
    barFill.setAttribute('fill', '#43A047');
    barFill.style.transition = 'width 1.2s linear';
    group.appendChild(barFill);

    group.setAttribute('class', `agent-bar agent-bar-${i}`);
    svg.appendChild(group);
  });
}
