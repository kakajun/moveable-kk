import './app.css'

import * as React from 'react'
import Moveable from 'react-moveable'

export default function App() {
  const targetRef = React.useRef<HTMLDivElement>(null)
  const moveableRef = React.useRef<Moveable>(null)

  return (
    <div className="root">
      <div
        className="container"
        style={{
          left: '200px',
          top: '100px',
          width: '500px',
          height: '500px',
          border: '1px solid #ccc',
        }}
      >
        <div
          className="target element1"
          style={{
            width: '100px',
            height: '100px',
            left: '20px',
            top: '120px',
          }}
        >
          Element1
        </div>
        <div
          className="target element2"
          style={{
            width: '100px',
            height: '100px',
            left: '400px',
            top: '80px',
          }}
        >
          Element2
        </div>
        <div
          className="target element3"
          style={{
            width: '300px',
            height: '100px',
            top: '400px',
            left: '50px',
          }}
        >
          Element3
        </div>
        <div
          ref={targetRef}
          className="target"
          style={{
            width: '150px',
            height: '150px',
          }}
        >
          Target
        </div>
        <Moveable
          ref={moveableRef}
          target={targetRef}
          draggable={true}
          scalable={true}
          rotatable={true}
          snappable={true}
          isDisplaySnapDigit={true}
          isDisplayInnerSnapDigit={true}
          snapGap={true}
          snapDirections={{
            top: true,
            left: true,
            bottom: true,
            right: true,
            center: true,
            middle: true,
          }}
          elementSnapDirections={{
            top: true,
            left: true,
            bottom: true,
            right: true,
            center: true,
            middle: true,
          }}
          snapThreshold={5}
          maxSnapElementGuidelineDistance={9999}
          elementGuidelines={[
            { element: '.container', className: 'red' },
            { element: '.element1', className: 'red' },
            { element: '.element2', className: 'red' },
            { element: '.element3', className: 'red' },
          ]}
          onRender={e => {
            e.target.style.cssText += e.cssText
          }}
          onSnap={e => {
            // console.log(e.guidelines, e.elements)
          }}
        />
      </div>
    </div>
  )
}
