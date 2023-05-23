import Tilt from 'react-parallax-tilt';
import brain from './brain.png'

const Logo = () =>{
return(

  <div className="ma4 mt0">
    <Tilt className='Tilt br2 shadow-2'  scale={1.15} tiltMaxAngleX={55} tiltMaxAngleY={55} style={{height: 150, width:150}}>
      <div className='Tilt-inner pa3'><img style={{paddingTop:'5px'}} src={brain} alt="logo" /></div>
    </Tilt>
  </div>


)
}

export default Logo