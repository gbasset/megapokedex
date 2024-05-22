
import './progress-bar.css';

type ProgressBar = {
  percentRange: number;
  color: string;
  max: number;
}
export default function ProgressBar({percentRange, color, max}:ProgressBar) {
const percent = (percentRange * 100) / max ;

  return (
    <div className="container">
        <div className="progress-bar">
            <div className="range"  style={{width: `${percent}%`, background : color}}> </div>
           
        </div>
    </div>
  )
}
