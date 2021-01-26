import React, {useState, useEffect, useContext} from 'react';
import * as d3 from 'd3';
import {componentAtomTree, atom, selector} from '../../../types';
import {zoomStateContext} from '../../Containers/VisualContainer';
// import rd3 from 'react-d3-library'

interface AtomComponentVisualProps {
  componentAtomTree: componentAtomTree;
  cleanedComponentAtomTree: componentAtomTree;
  selectedRecoilValue: string[];
  atoms: atom;
  selectors: selector;
  setStr: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedRecoilValue: React.Dispatch<React.SetStateAction<string[]>>;
}

const AtomComponentVisual: React.FC<AtomComponentVisualProps> = ({
  componentAtomTree,
  cleanedComponentAtomTree,
  selectedRecoilValue,
  atoms,
  selectors,
  setStr,
  setSelectedRecoilValue,
}) => {
  const {zoomState, setZoomState} = useContext(zoomStateContext);
  const {x, y, k} = zoomState;
  // set the heights and width of the tree to be passed into treeMap function
  let width: number = 0;
  let height: number = 0;

  // useState hook to update the toggle of displaying entire tree or cleaned tree
  const [rawToggle, setRawToggle] = useState<boolean>(false);

  // useState hook to update whether a suspense component will be shown on the component graph
  const [hasSuspense, setHasSuspense] = useState<boolean>(false);

  //declare hooks to render lists of atoms or selectors
  const [atomList, setAtomList] = useState(Object.keys(atoms));
  const [selectorList, setSelectorList] = useState(Object.keys(selectors));
  // need to create a hook for toggling
  const [showAtomMenu, setShowAtomMenu] = useState(false);
  const [showSelectorMenu, setShowSelectorMenu] = useState(false);

  useEffect(() => {
    height = document.querySelector('.Component').clientHeight;
    width = document.querySelector('.Component').clientWidth;

    document.getElementById('canvas').innerHTML = '';

    // reset hasSuspense to false. This will get updated to true if the red borders are rendered on the component graph.
    setHasSuspense(false);

    // creating the main svg container for d3 elements
    const svgContainer = d3.select('#canvas');

    // creating a pseudo-class for reusability
    const g = svgContainer
      .append('g')
      // .attr('transform', `translate(${x}, ${y}), scale(${k})`)
      .attr('id', 'componentGraph');

    let i = 0;
    let duration: number = 750;
    let root: any;
    let path: string;

    // creating the tree map
    const treeMap = d3.tree().nodeSize([height, width]);

    if (!rawToggle) {
      root = d3.hierarchy(
        cleanedComponentAtomTree,
        function (d: componentAtomTree) {
          return d.children;
        },
      );
    } else {
      root = d3.hierarchy(componentAtomTree, function (d: componentAtomTree) {
        return d.children;
      });
    }

    // Node distance from each other
    root.x0 = 10;
    root.y0 = width / 2;

    update(root);

    // d3 zoom functionality
    let zoom = d3.zoom().on('zoom', zoomed);

    svgContainer.call(
      zoom.transform,
      // Changes the initial view, (left, top)
      d3.zoomIdentity.translate(x, y).scale(k),
    );

    // allows the canvas to be zoom-able
    svgContainer.call(
      d3
        .zoom()
        .scaleExtent([0.05, 0.9]) // [zoomOut, zoomIn]
        .on('zoom', zoomed),
    );

    // helper function that allows for zooming
    function zoomed() {
      g.attr('transform', d3.event.transform).on(
        'mouseup',
        setZoomState(d3.zoomTransform(d3.select('#canvas').node())),
      );
    }

    // Update function
    function update(source: any) {
      treeMap(root);

      let nodes = root.descendants(),
        links = root.descendants().slice(1);

      let node = g
        .selectAll('g.node')
        .attr('stroke-width', 5)
        .data(nodes, function (d: any): number {
          return d.id || (d.id = ++i);
        });

      /* this tells node where to be placed and go to
       * adding a mouseOver event handler to each node
       * display the data in the node on hover
       * add mouseOut event handler that removes the popup text
       */
      //add div that will hold info regarding atoms and/or selectors for each node
      const tooltip = d3
        .select('.tooltipContainer')
        .append('div')
        .attr('class', 'hoverInfo')
        .style('opacity', 0);

      let nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function (): string {
          return `translate(${source.y0}, ${source.x0})`;
        })
        .on('click', click)
        .on('mouseover', function (d: any, i: number): void {
          // atsel is an array of all the atoms and selectors
          const atsel: any = [];
          if (d.data.recoilNodes) {
            for (let x = 0; x < d.data.recoilNodes.length; x++) {
              // pushing all the atoms and selectors for the node into 'atsel'
              atsel.push(d.data.recoilNodes[x]);
            }
            //change the opacity of the node when the mouse is over
            d3.select(this).transition().duration('50').attr('opacity', '.85');

            //created a str for hover div to have corrensponding info
            let newStr = formatAtomSelectorText(atsel).join('<br>');
            newStr = newStr.replace(/,/g, '<br>');
            newStr = newStr.replace(/{/g, '<br>{');

            //tooltip appear near your mouse when hover over a node
            tooltip
              .style('opacity', 1)
              .html(`<p>${newStr}</p>`)
              .style('left', d3.event.pageX + 15 + 'px') //mouse position
              .style('top', d3.event.pageY - 20 + 'px');
          }
        })
        .on('mouseout', function (d: any, i: number): void {
          d3.select(this).transition().duration('50').attr('opacity', '1'); //change the opacity back
          //remove tooltip when the mouse is not on the node
          tooltip.style('opacity', 0);
        });

      // determines shape/color/size of node
      nodeEnter
        .append('circle')
        .attr('class', 'node')
        .attr('r', determineSize)
        .attr('fill', colorComponents)
        .style('stroke', borderColor)
        .style('stroke-width', 15);
      // TO DO: Add attribute for border if it is a suspense component

      // for each node that got created, append a text element that displays the name of the node
      nodeEnter
        .append('text')
        .attr('dy', '.31em')
        .attr('y', (d: any): number => (d.data.recoilNodes ? 138 : -75))
        .attr('text-anchor', function (d: any): string {
          return d.children || d._children ? 'middle' : 'middle';
        })
        .text((d: any): string => d.data.name)
        .style('font-size', `7.5rem`)
        .style('fill', 'white');

      let nodeUpdate = nodeEnter.merge(node);

      // transition that makes it slide down to next spot
      nodeUpdate
        // .transition()
        // .duration(duration)
        .attr('transform', function (d: any): string {
          return `translate(${d.y}, ${d.x})`;
        });

      // allows user to see hand pop out when clicking is available and maintains color/size
      nodeUpdate
        .select('circle.node')
        .attr('r', determineSize)
        .attr('fill', colorComponents)
        .attr('cursor', 'pointer')
        .style('stroke', borderColor)
        .style('stroke-width', 15);

      let nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr('transform', function (d: any): string {
          return `translate(${source.y}, ${source.x})`;
        })
        .remove();

      let link = g
        .attr('fill', 'none')
        .attr('stroke-width', 5)
        .selectAll('path.link')
        .data(links, function (d: any): number {
          return d.id;
        });

      let linkEnter = link
        .enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('stroke', '#646464')
        .attr('stroke-width', 5)
        .attr('d', function (d: any): string {
          let o = {x: source.x0, y: source.y0};
          return diagonal(o, o);
        });

      let linkUpdate = linkEnter.merge(link);

      linkUpdate
        .transition()
        .duration(duration)
        .attr('stroke', '#646464')
        .attr('stroke-width', 5)
        .attr('d', function (d: any): string {
          return diagonal(d, d.parent);
        });

      let linkExit = link
        .exit()
        .transition()
        .duration(duration)
        .attr('stroke', '#646464')
        .attr('stroke-width', 5)
        .attr('d', function (d: any): string {
          let o = {y: source.y, x: source.x};
          return diagonal(o, o);
        })
        .remove();

      // makes next Node needed to appear from the previous and not the start
      nodes.forEach(function (d: any): void {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      function diagonal(s: any, d: any): string {
        path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

        return path;
      }

      function click(d: any): void {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }

        update(d);
        const atsel = [];
        if (d.data.recoilNodes) {
          for (let x = 0; x < d.data.recoilNodes.length; x++) {
            atsel.push(d.data.recoilNodes[x]);
          }
          setStr(formatAtomSelectorText(atsel));
        }
      }

      // allows the canvas to be draggable
      node.call(d3.drag());

      function formatMouseoverXValue(recoilValue: string): number {
        if (atoms.hasOwnProperty(recoilValue)) {
          return -30;
        }
        return -150;
      }

      function formatAtomSelectorText(atomOrSelector: string[]): string[] {
        let strings: any = [];
        for (let i = 0; i < atomOrSelector.length; i++) {
          if (atoms.hasOwnProperty(atomOrSelector[i])) {
            strings.push(
              ` ATOM ${atomOrSelector[i]}: ${JSON.stringify(
                atoms[atomOrSelector[i]],
              )}`,
            );
          } else if (selectors.hasOwnProperty(atomOrSelector[i])) {
            strings.push(
              ` SELECTOR ${atomOrSelector[i]}: ${JSON.stringify(
                selectors[atomOrSelector[i]],
              )}`,
            );
          }
        }
        return strings;
      }

      function determineSize(d: any): number {
        if (d.data.recoilNodes && d.data.recoilNodes.length) {
          if (d.data.recoilNodes.includes(selectedRecoilValue[0])) {
            // Size when the atom/selector is clicked on from legend
            return 150;
          }
          // Size of atoms and selectors
          return 100;
        }
        // Size of regular nodes
        return 50;
      }

      function borderColor(d: any): string {
        if (d.data.wasSuspended) setHasSuspense(true);
        return d.data.wasSuspended ? '#FF0000' : 'none';
      }

      function colorComponents(d: any): string {
        // if component node contains recoil atoms or selectors, make it orange red or yellow, otherwise keep node gray
        if (d.data.recoilNodes && d.data.recoilNodes.length) {
          if (d.data.recoilNodes.includes(selectedRecoilValue[0])) {
            // Color of atom or selector when clicked on in legend
            return 'yellow';
          }

          let hasAtom = false;
          let hasSelector = false;
          for (let i = 0; i < d.data.recoilNodes.length; i++) {
            if (atoms.hasOwnProperty(d.data.recoilNodes[i])) {
              hasAtom = true;
            }
            if (selectors.hasOwnProperty(d.data.recoilNodes[i])) {
              hasSelector = true;
            }
          }
          if (hasAtom && hasSelector) {
            return 'springgreen';
          }
          if (hasAtom) {
            return '#9580ff';
          } else {
            return '#ff80bf';
          }
        }
        return 'gray';
      }
    }
  }, [componentAtomTree, rawToggle, selectedRecoilValue]);

  function openDropdown(e: React.MouseEvent) {
    const target = e.target as Element;
    if (target.className === 'AtomP') {
      setShowAtomMenu(!showAtomMenu);
      setShowSelectorMenu(false);
    } else {
      setShowSelectorMenu(!showSelectorMenu);
      setShowAtomMenu(false);
    }
  }
  return (
    <div className="AtomComponentVisual">
      <svg id="canvas"></svg>
      <button
        id="fixedButton"
        style={{
          color: rawToggle ? '#E6E6E6' : '#989898',
        }}
        onClick={() => {
          setRawToggle(!rawToggle);
        }}>
        <span>{rawToggle ? 'Collapse' : 'Expand'}</span>
      </button>
      <div className="AtomNetworkLegend">
        <div className="AtomLegend" />
        <p onClick={openDropdown} id="AtomP" className="AtomP">
          ATOM
        </p>
        {showAtomMenu && (
          <div id="atomDrop" className="AtomDropDown">
            {atomList.map((atom, i) => (
              <p
                id={`atom-drop${i}`}
                className="atom-class"
                key={i}
                style={{opacity: '30%'}}
                onClick={() => {
                  document
                    .querySelector(`#atom-drop${i}`)
                    .setAttribute('style', 'opacity: 100%;');
                  document.querySelectorAll('.atom-class').forEach(item => {
                    if (item.id !== `atom-drop${i}`)
                      item.setAttribute('style', 'opacity: 30%;');
                  });
                  setSelectedRecoilValue([atom, 'atom']);
                }}>
                {atom}
              </p>
            ))}
          </div>
        )}
        <div className="SelectorLegend"></div>
        <p onClick={openDropdown} id="SelectorP" className="SelectorP">
          SELECTOR
        </p>
        {showSelectorMenu && (
          <div id="selectorDrop" className="SelectorDropDown">
            {selectorList.map((selector, i) => (
              <p
                id={`selector-drop${i}`}
                className="selector-class"
                key={i}
                style={{opacity: '30%'}}
                onClick={() => {
                  document
                    .querySelector(`#selector-drop${i}`)
                    .setAttribute('style', 'opacity: 100%;');
                  document.querySelectorAll('.selector-class').forEach(item => {
                    if (item.id !== `selector-drop${i}`)
                      item.setAttribute('style', 'opacity: 30%;');
                  });
                  setSelectedRecoilValue([selector, 'selector']);
                }}>
                {selector}
              </p>
            ))}
          </div>
        )}
        <div className="bothLegend"></div>
        <p>BOTH</p>
        <div className={hasSuspense ? 'suspenseLegend' : ''}></div>
        <p>{hasSuspense ? 'SUSPENSE' : ''}</p>
        <div className="tooltipContainer"></div>
      </div>
    </div>
  );
};

export default AtomComponentVisual;
