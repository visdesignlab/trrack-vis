import React, { FC } from 'react';
import translate from '../Utils/translate';
import { ProvenanceNode } from '@visdesignlab/provenance-lib-core';
import { treeColor } from './Styles';
import { Animate } from 'react-move';
import { EventConfig } from '../Utils/EventConfig';
import { BundleMap } from '../Utils/BundleMap';

interface BackboneNodeProps<T, S extends string> {
  first: boolean;
  current: boolean;
  duration: number;
  node: ProvenanceNode<T, S>;
  radius: number;
  strokeWidth: number;
  textSize: number;
  bundleMap?: BundleMap;
  bundleNodeList:string[];
  clusterLabels:boolean;
  eventConfig?: EventConfig<S>;
}

function BackboneNode<T, S extends string>({
  first,
  current,
  node,
  duration,
  radius,
  strokeWidth,
  textSize,
  bundleMap,
  bundleNodeList,
  clusterLabels,
  eventConfig
}: BackboneNodeProps<T, S>) {
  const padding = 15;

  let glyph = <circle className={treeColor(current)} r={radius} strokeWidth={strokeWidth} />;

  if (eventConfig) {
    const eventType = node.metadata.type;
    if (eventType && eventType in eventConfig && eventType !== 'Root') {
      const { bundleGlyph, currentGlyph, backboneGlyph } = eventConfig[eventType];
      if(bundleNodeList.includes(node.id) || (bundleMap && Object.keys(bundleMap).includes(node.id)))
      {
        glyph = <g fontWeight={'none'}>{bundleGlyph}</g>
      }
      else if(current)
      {
        glyph = <g fontWeight={'bold'}>{currentGlyph}</g>
      }
      else{
        glyph = <g fontWeight={'none'}>{backboneGlyph}</g>
      }
    }
  }

  let label = '';

  if(bundleMap && Object.keys(bundleMap).includes(node.id) && clusterLabels)
  {
    label = bundleMap[node.id].bundleLabel;
  }
  else if(!bundleNodeList.includes(node.id) || !clusterLabels)
  {
    label = node.label;
  }

  return (
    <Animate
      start={{ opacity: 0 }}
      enter={{ opacity: [1], timing: { duration: 100, delay: first ? 0 : duration } }}
    >
      {state => (
        <>
          {glyph}
          <g style={{ opacity: state.opacity }} transform={translate(padding, 0)}>
            <Label
              label={label}
              dominantBaseline="middle"
              textAnchor="start"
              fontSize={textSize}
              fontWeight={current ? 'bold' : 'regular'}
            />
          </g>
        </>
      )}
    </Animate>
  );
}

export default BackboneNode;

const Label: FC<{ label: string } & React.SVGProps<SVGTextElement>> = (props: {
  label: string;
}) => {
  return <text {...props}>{props.label}</text>;
};