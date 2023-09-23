// Dendrogram.js
import { hierarchy } from 'd3-hierarchy';
import { Cluster } from '@visx/hierarchy';
import { Group } from '@visx/group';
import { LinkVertical } from '@visx/shape';

function Dendrogram({ data }) {
  const root = hierarchy(data, d => (d.isExpanded ? d.children : null));

  return (
    <svg width={500} height={500}>
      <Cluster root={root} size={[460, 460]}>
        {({ links, nodes }) => (
          <Group top={20} left={20}>
            {links.map((link, i) => (
              <LinkVertical
                key={i}
                data={link}
                stroke="#374469"
                strokeWidth="1"
                fill="none"
              />
            ))}

            {nodes.map((node, i) => (
              <Group key={i} top={node.y} left={node.x}>
                {node.depth === 0 ? (
                  <circle fill="#374469" r={15} />
                ) : (
                  <circle fill="#fff" r={12} stroke="#374469" strokeWidth={2} />
                )}
                <text
                  dy=".33em"
                  fontSize={9}
                  fontFamily="Arial"
                  textAnchor="middle"
                  style={{ pointerEvents: 'none' }}
                  fill={node.depth === 0 ? '#ffffff' : '#374469'}
                >
                  {node.data.name}
                </text>
              </Group>
            ))}
          </Group>
        )}
      </Cluster>
    </svg>
  );
}

export default Dendrogram;
