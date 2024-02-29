import React, { useState } from 'react'
import './progress-bar.css';

export default function ProgressBar({percentRange, color, max}) {
const percent = (percentRange * 100) / max ;

  return (
    <div className="container">
        <div className="progress-bar">
            <div className="range" value={percentRange} style={{width: `${percent}%`, background : color}}> </div>
           
        </div>
    </div>
  )
}
